# 🌾 AgroAssist – AI-Powered Agricultural Assistant
Welcome to "AgroAssist" project! This repository focuses on devloping a crop recommendation model, fertlizer recommendation model, chatbot tailored for farmers, equipped with features such as speech-to-text , text-to-speech and real-time communication, This project integrates a flask backend and a react frontend, creating an interactive platform for farmers to seek information and assistance.
## 📌 Overview
In this repository, you'll find Flask backend(`chatbot.py','crop.py','fertilizer.py`), react frontend(`chatbot.tsx, crop.tsx,fertlizer.tsz`). The frontend offers an intuitive chat interface, supporting two languages and enhancing user interaction.

### ❗ Problem Statement
Many farmers lack access to personalized agricultural advice due to limited knowledge, language barriers, or distance from expert support. Incorrect crop selection or fertilizer use can lead to poor yields, soil degradation, and economic loss.

AgroAssist addresses this by:

Recommending crops based on soil nutrients and weather.

Suggesting suitable fertilizers tailored to crop and soil needs.

Offering bilingual, voice-enabled chatbot assistance for accessibility.

### ⚙️ Tech Stack
##### Frontend:

HTML/CSS

JavaScript 

React

##### Backend:

Python (Flask)

Google Gemini API

gTTS (Text-to-Speech)

SpeechRecognition (Speech-to-Text)

Google Translate API

Machine Learning:

Scikit-learn (Decision Tree for crop prediction)

Rule-based and ML model for fertilizer recommendation

Data Handling:

Pandas

NumPy

## 📥 Installation
#### 🔧 Prerequisites
 - Python 3.8 or later
 - Flask
 - React
 - Googletrans(for language translation)
 - gTTS(for voice recognition)
 - npm
 - pip


## ▶️ Usage

1.  Clone this repository:

```bash
git clone https://github.com/your-username/Farmer-Support-ChatBot.git
```

2.  Navigate to the project directory:

```bash
cd Agro_Assist
```

3.  Run the Flask backend of chatbot:

```bash
python backend/chatbot.py
```

4. Run the Flask backend of crop recommendation:
   
```bash
python backend/chatbot.py
```

5. Run the Flask backend of fertlizer recommendation:
   
```bash
python backend/chatbot.py
```
  
6.  Run the React frontend:

```bash
npm run dev
```

7.Open your  browser and access `http://127.0.0.1:5000/` to interact with AgroAssist

## ✨ Features
🌾 Crop Recommendation: Suggests the best crop based on N, P, K, temperature, humidity, pH, and rainfall.

🧪 Fertilizer Recommendation: Identifies nutrient deficiencies and recommends ideal fertilizers.

🌍 Bilingual Chatbot: Supports two languages via Google Translate API.

## 📊 Datasets
crop_recommendation.csv: Contains NPK, environmental factors, and corresponding crops.

fertilizer_recommendation.csv: Maps crop and nutrient data to fertilizer advice.

## 📜 License
This project is licensed under the MIT License.

## 🙏 Acknowledgments
Kaggle for open datasets

Google APIs (Translate, Gemini, TTS/STT)

scikit-learn, Flask, and the Python open-source community

## Authors
This collaborative effort is led by a dedicated team of four individuals:

-   **A.Sirisahasra**
-   **P.Nishitha**
-   **M.Varshini**
