import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import google.generativeai as genai
from google.generativeai.types import GenerationConfig
from googletrans import Translator
from gtts import gTTS
import base64
import io
import logging
import re

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)
CORS(app)


GEMINI_API_KEY = ""  #REPLACE WITH YOUR GEMINI API KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-2.0-flash") 

translator = Translator()

SYSTEM_INSTRUCTIONS_EN = """
You are a friendly and knowledgeable agricultural assistant trained to help farmers in India.
Your role is to provide accurate, easy-to-understand advice in simple language.
You can help with:
- Fertilizer and pesticide usage and schedules
- Pest or disease control
- Best farming practices
- Weather-related guidance
- Government schemes and subsidies
- Storage, harvesting, and market-related information
If a user asks about crop recommendations, politely guide them to use the Crop Recommendation Tool available on the website.
If they ask about fertilizer recommendations, tell them to check the Fertilizer Recommendation Tool on the website.
If a question is unclear or unrelated to agriculture, politely ask them to rephrase or ask about farming-related topics in India.
Always be respectful, kind, and supportive — like a true friend of the farmer.
Note:
- Do not use emojis in your responses
- Do not use bold text in your responses
- When possible, give your response in clean bullet points to keep it neat
- Use simple language for farmers which they can understand
"""

SYSTEM_INSTRUCTIONS_TE = """
మీరు భారతదేశంలోని రైతులకు సహాయం చేయడానికి శిక్షణ పొందిన ఒక స్నేహపూర్వక మరియు పరిజ్ఞానం గల వ్యవసాయ సహాయకుడు.
మీ పాత్ర సరళమైన భాషలో ఖచ్చితమైన, సులభంగా అర్థమయ్యే సలహాలను ఇవ్వడం.


మీరు ఈ విషయాల్లో సహాయం చేయగలరు:
- ఎరువులు మరియు పురుగుమందుల వినియోగం మరియు షెడ్యూల్‌లు
- తెగులు లేదా వ్యాధి నియంత్రణ
- ఉత్తమ వ్యవసాయ పద్ధతులు
- వాతావరణ సంబంధిత మార్గదర్శకాలు
- ప్రభుత్వ పథకాలు మరియు రాయితీలు
- నిల్వ, కోత మరియు మార్కెట్ సంబంధిత సమాచారం
పంట సిఫార్సుల గురించి అడిగితే, వినియోగదారులను వెబ్‌సైట్‌లో అందుబాటులో ఉన్న Crop Recommendation Tool వాడమని మర్యాదగా సూచించండి.
ఎరువుల సిఫార్సుల గురించి అడిగితే, వినియోగదారులను వెబ్‌సైట్‌లో ఉన్న Fertilizer Recommendation Tool చూడమని చెప్పండి.
ఒక ప్రశ్న అస్పష్టంగా లేదా వ్యవసాయానికి సంబంధం లేకుండా ఉంటే, దయచేసి మరింత స్పష్టంగా లేదా వ్యవసాయానికి సంబంధించినదిగా మళ్లీ అడగమని సూచించండి.
ఎల్లప్పుడూ గౌరవంగా, దయతో మరియు సహాయకంగా ఉండండి — రైతుకు నిజమైన స్నేహితుడిలా వ్యవహరించండి.
గమనిక:
- స్పందనలో ఎమోజీలు ఉపయోగించవద్దు
- బోల్డ్ టెక్స్ట్ ఉపయోగించవద్దు
- సాధ్యమైనప్పుడు సమాధానాలను పాయింట్ల రూపంలో చక్కగా ఇవ్వండి
- రైతులకు అర్థమయ్యే సరళమైన భాషను ఉపయోగించండి
"""

conversation_history = []

def translate_text(text, target_language, source_language='auto'):
    if text:
        try:
            translation = translator.translate(text, dest=target_language, src=source_language)
            return translation.text
        except Exception as e:
            logging.error(f"Translation error ({source_language} to {target_language}): {e}")
            return text
    return ""

def synthesize_speech(text, language_code):
    if text and language_code in ['en', 'te']:
        try:
            cleaned_text = text.replace('*', '') 
            tts = gTTS(text=cleaned_text, lang=language_code)
            audio_segment = io.BytesIO()
            tts.write_to_fp(audio_segment)
            audio_segment.seek(0)
            audio_bytes = audio_segment.read()
            return base64.b64encode(audio_bytes).decode('utf-8')
        except Exception as e:
            logging.error(f"TTS error ({language_code}): {e}")
            return None
    return None


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_input = request.form.get("user_input")
        audio_data = request.form.get("audio_data")
        target_language = request.form.get("target_language", "en")
        user_language = request.form.get("user_language", "en")




        if audio_data:
            logging.info(f"Received audio data in {user_language} - processing not implemented on backend")
            user_input = translate_text("Processing audio input...", 'en', user_language)




        if not user_input:
            return jsonify({"response": translate_text("Please enter your message or provide audio input.", target_language, 'en')})


        translated_user_input_en = translate_text(user_input, 'en', user_language)


        system_instructions = SYSTEM_INSTRUCTIONS_EN if target_language == 'en' else SYSTEM_INSTRUCTIONS_TE

        chat = model.start_chat(history=[])




        response = chat.send_message(f"{system_instructions}\n\nUser question (in English): {translated_user_input_en}")




        chatbot_response_en = response.text if response.text else translate_text("Sorry, I didn't get a response.", target_language, 'en')

        chatbot_response_en = chatbot_response_en.replace('*', '')  

        chatbot_response_en = re.sub(r'\*(.*?)\*', r'<strong>\1</strong>', chatbot_response_en)




        translated_response = translate_text(chatbot_response_en, target_language, 'en')

        translated_response = translated_response.replace('*', '') 




        audio_output = synthesize_speech(translated_response, target_language)
        return jsonify({"response": translated_response, "audio": audio_output})




    except Exception as e:
        logging.error(f"Chat API error: {str(e)}")
        error_message = translate_text(f"Oh no! Something went wrong: {str(e)}", target_language, 'en')
        return jsonify({"response": error_message})




if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
