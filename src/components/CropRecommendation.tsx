import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react'; 

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
}

const teluguNumeralsMap: { [key: string]: string } = {
  '౦': '0', '౧': '1', '౨': '2', '౩': '3', '౪': '4',
  '౫': '5', '౬': '6', '౭': '7', '౮': '8', '౯': '9'
};
const spokenWordsMap: { [key: string]: string } = {
  'సున్నా': '0', 'ఒకటి': '1', 'ఒక': '1', 'రెండు': '2', 'మూడు': '3', 'నాలుగు': '4',
  'ఐదు': '5', 'ఆరు': '6', 'ఏడు': '7', 'ఎనిమిది': '8', 'తొమ్మిది': '9', 'పది': '10', 'వంద': '100',
  'జీరో': '0', 'వన్': '1', 'టు': '2', 'త్రీ': '3', 'ఫోర్': '4', 'ఫైవ్': '5',
  'సిక్స్': '6', 'సెక్స్' : '6', 'సెవెన్': '7', 'ఎయిట్': '8', 'నైన్': '9', 'టెన్': '10', 'హండ్రెడ్': '100',
  'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5', 'six': '6',
  'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10', 'hundred': '100',
};

function convertSpokenNumberToEnglish(transcript: string): string {
  let result = transcript.trim().toLowerCase();
  for (const teluguNum in teluguNumeralsMap) {
    result = result.replace(new RegExp(teluguNum, 'g'), teluguNumeralsMap[teluguNum]);
  }
  const sortedWords = Object.keys(spokenWordsMap).sort((a, b) => b.length - a.length);
  for (const word of sortedWords) {
     result = result.replace(new RegExp(word, 'gi'), spokenWordsMap[word]);
  }
   result = result.replace(/[^0-9.]/g, '');
  return result;
}

const translations = {
  en: {
    title: "Crop Recommendation",
    languageLabel: "Language",
    nitrogenLabel: "Nitrogen",
    nitrogenUnit: "mg/kg",
    phosphorusLabel: "Phosphorus",
    phosphorusUnit: "mg/kg",
    potassiumLabel: "Potassium",
    potassiumUnit: "mg/kg",
    temperatureLabel: "Temperature",
    temperatureUnit: "°C",
    humidityLabel: "Humidity",
    humidityUnit: "%",
    phLabel: "pH Level",
    phUnit: "0-14",
    rainfallLabel: "Rainfall",
    rainfallUnit: "mm",
    submitButton: "Get Recommendation",
    loadingButton: "Getting Recommendation...",
    listening: "Listening...",
    errorPrefix: "Error",
    recommendationPrefix: "Recommendation",
    allFieldsRequiredError: "All fields are required.",
    invalidNumberError: (field: string, value: string) => `Invalid number format for ${field}: "${value}". Please enter a valid number.`,
    micNotSupportedError: "Microphone input (Speech Recognition) is not supported by your browser.",
    micPermissionError: "Microphone access denied. Please allow access.",
    micNoSpeechError: "No speech detected. Please try again.",
    micNetworkError: "Network error during speech recognition.",
    micLangUnsupportedError: (lang: string) => `The selected language (${lang}) is not supported by your browser's speech recognition.`,
    micGenericError: (error: string) => `Mic error: ${error}`,
    micStartError: "Could not start microphone. Check permissions.",
    conversionError: (transcript: string) => `Could not convert "${transcript}" to a valid number.`,
    unexpectedResponseError: "Received an unexpected response from the server.",
    fetchErrorPrefix: "Failed to get recommendation",
    fetchNetworkError: "Network error: Could not connect to the server. Is it running?",
    fetchGenericError: "An unexpected error occurred. Please try again later.",
  },
  te: {
    title: "పంట సిఫార్సు",
    languageLabel: "భాష",
    nitrogenLabel: "నత్రజని",
    nitrogenUnit: "mg/kg",
    phosphorusLabel: "భాస్వరం",
    phosphorusUnit: "mg/kg",
    potassiumLabel: "పొటాషియం",
    potassiumUnit: "mg/kg",
    temperatureLabel: "ఉష్ణోగ్రత",
    temperatureUnit: "°C",
    humidityLabel: "తేమ",
    humidityUnit: "%",
    phLabel: "pH స్థాయి",
    phUnit: "0-14",
    rainfallLabel: "వర్షపాతం",
    rainfallUnit: "mm",
    submitButton: "సిఫార్సు పొందండి",
    loadingButton: "సిఫార్సు పొందుతోంది...",
    listening: "వినడం జరుగుతోంది...",
    errorPrefix: "లోపం",
    recommendationPrefix: "సిఫార్సు",
    allFieldsRequiredError: "అన్ని ఫీల్డ్‌లు అవసరం.",
    invalidNumberError: (field: string, value: string) => `${field} కోసం చెల్లని సంఖ్య ఫార్మాట్: "${value}". దయచేసి చెల్లుబాటు అయ్యే సంఖ్యను నమోదు చేయండి.`,
    micNotSupportedError: "మైక్రోఫోన్ ఇన్‌పుట్ (స్పీచ్ రికగ్నిషన్) మీ బ్రౌజర్ ద్వారా మద్దతు లేదు.",
    micPermissionError: "మైక్రోఫోన్ యాక్సెస్ నిరాకరించబడింది. దయచేసి యాక్సెస్‌ను అనుమతించండి.",
    micNoSpeechError: "ప్రసంగం కనుగొనబడలేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    micNetworkError: "ప్రసంగ గుర్తింపు సమయంలో నెట్‌వర్క్ లోపం.",
    micLangUnsupportedError: (lang: string) => `ఎంచుకున్న భాష (${lang}) మీ బ్రౌజర్ యొక్క ప్రసంగ గుర్తింపు ద్వారా మద్దతు లేదు.`,
    micGenericError: (error: string) => `మైక్ లోపం: ${error}`,
    micStartError: "మైక్రోఫోన్‌ను ప్రారంభించడంలో విఫలమయ్యారు. అనుమతులను తనిఖీ చేయండి.",
    conversionError: (transcript: string) => `"${transcript}" ను చెల్లుబాటు అయ్యే సంఖ్యగా మార్చడంలో విఫలమయ్యారు.`,
    unexpectedResponseError: "సర్వర్ నుండి ఊహించని ప్రతిస్పందన అందింది.",
    fetchErrorPrefix: "సిఫార్సు పొందడంలో విఫలమయ్యారు",
    fetchNetworkError: "నెట్‌వర్క్ లోపం: సర్వర్‌కు కనెక్ట్ చేయడంలో విఫలమయ్యారు. ఇది నడుస్తోందా?",
    fetchGenericError: "ఊహించని లోపం సంభవించింది. దయచేసి మళ్ళీ ప్రయత్నించండి.",
    cropNames: {
        'rice': 'వరి',
        'maize': 'మొక్కజొన్న',
        'chickpea': 'శనగ',
        'kidneybeans': 'రాజ్మా', 
        'pigeonpeas': 'కంది పప్పు',
        'mothbeans': 'మోత్ బీన్స్',
        'mungbean': 'పెసర',
        'blackgram': 'మినుములు',
        'lentil': 'మసూర్ పప్పు', 
        'pomegranate': 'దానిమ్మ',
        'banana': 'అరటి',
        'mango': 'మామిడి',
        'grapes': 'ద్రాక్ష',
        'watermelon': 'పుచ్చకాయ',
        'muskmelon': 'కర్బూజ',
        'apple': 'ఆపిల్',
        'orange': 'నారింజ', 
        'papaya': 'బొప్పాయి',
        'coconut': 'కొబ్బరి',
        'cotton': 'పత్తి',
        'jute': 'జనపనార',
        'coffee': 'కాఫీ',
    } as Record<string, string>, 
  }
};

interface FormData {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    temperature: string;
    humidity: string;
    ph: string;
    rainfall: string;
}

type LanguageKey = 'en' | 'te';

function CropRecommendation() {
  const [formData, setFormData] = useState<FormData>({
    nitrogen: '', phosphorus: '', potassium: '',
    temperature: '', humidity: '', ph: '', rainfall: ''
  });

  const [recommendation, setRecommendation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<LanguageKey>('en'); 

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingField, setRecordingField] = useState<keyof FormData | null>(null);
  const [micError, setMicError] = useState<string | null>(null);

  const currentFieldRef = useRef<keyof FormData | null>(null);
  const currentLangRef = useRef<LanguageKey>(language); 

  useEffect(() => {
    currentLangRef.current = language;
  }, [language]);

  useEffect(() => {
    if (!recognition) {
      console.warn("Speech Recognition API not supported.");
      setMicError(translations[currentLangRef.current].micNotSupportedError);
      return;
    }

    recognition.lang = language === 'te' ? 'te-IN' : 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      const targetField = currentFieldRef.current;
      const currentTranslations = translations[currentLangRef.current];

      if (targetField) {
        const convertedNumber = convertSpokenNumberToEnglish(transcript);
        if (convertedNumber && !isNaN(parseFloat(convertedNumber))) {
           setFormData(prevData => ({
             ...prevData,
             [targetField]: convertedNumber
           }));
           setMicError(null);
        } else {
            setMicError(currentTranslations.conversionError(transcript));
        }
      }
      setIsRecording(false);
      setRecordingField(null);
      currentFieldRef.current = null;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      const currentTranslations = translations[currentLangRef.current];
      let errorMsg = currentTranslations.micGenericError(event.error);

      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = currentTranslations.micPermissionError;
      } else if (event.error === 'no-speech') {
        errorMsg = currentTranslations.micNoSpeechError;
      } else if (event.error === 'network') {
        errorMsg = currentTranslations.micNetworkError;
      } else if (event.error === 'language-not-supported') {
         errorMsg = currentTranslations.micLangUnsupportedError(recognition?.lang || 'N/A');
      }
      setMicError(errorMsg);
      setIsRecording(false);
      setRecordingField(null);
      currentFieldRef.current = null;
    };

    recognition.onend = () => {
      if (currentFieldRef.current) {
        setIsRecording(false);
        setRecordingField(null);
        currentFieldRef.current = null;
      }
    };

    return () => {
      if (recognition && isRecording) {
        recognition.stop();
      }
    };
  }, [language, isRecording]); 
  const handleMicClick = (fieldName: keyof FormData) => {
    if (!recognition) {
      setMicError(translations[language].micNotSupportedError);
      return;
    }

    if (isRecording) {
      if (recordingField === fieldName) {
        recognition.stop();
        setIsRecording(false);
        setRecordingField(null);
        currentFieldRef.current = null;
      }
      return;
    }

    try {
      setMicError(null);
      setError(null); 
      setRecordingField(fieldName);
      currentFieldRef.current = fieldName; 
      setIsRecording(true);
      recognition.lang = language === 'te' ? 'te-IN' : 'en-US';
      recognition.start();
    } catch (err) {
      console.error("Error starting recognition:", err);
      setMicError(translations[language].micStartError);
      setIsRecording(false);
      setRecordingField(null);
      currentFieldRef.current = null;
    }
  };


  const getRecommendation = async () => {
    setIsLoading(true);
    setError(null);
    setRecommendation('');
    setMicError(null); 

    const currentTranslations = translations[language];

    const formValues = Object.values(formData);
    if (formValues.some(value => value.trim() === '')) {
      setError(currentTranslations.allFieldsRequiredError);
      setIsLoading(false);
      return;
    }

    let payload: Record<keyof FormData, number> | null = null;
    try {
        payload = Object.entries(formData).reduce((acc, [key, value]) => {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) {
               
                const fieldLabelKey = `${key}Label` as keyof typeof currentTranslations;
                const fieldLabel = typeof currentTranslations[fieldLabelKey] === 'string'
                                    ? currentTranslations[fieldLabelKey]
                                    : key;
                setError(currentTranslations.invalidNumberError(String(fieldLabel), value));
                throw new Error(`Invalid number format for ${key}`);
            }
            acc[key as keyof FormData] = numValue;
            return acc;
        }, {} as Record<keyof FormData, number>);
    } catch (conversionError: any) {
        setIsLoading(false);
        return;
    }

    if (!payload) {
        setError(currentTranslations.fetchGenericError);
        setIsLoading(false);
        return;
    }

    try {
          const response = await fetch('http://127.0.0.1:5001/recommend-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
         let errorData;
         try { errorData = await response.json(); } catch (jsonError) {  }

         const errorDetail = errorData?.error || response.statusText || `HTTP error! status: ${response.status}`;
         throw new Error(errorDetail);
      }

      const data = await response.json();
      if (data.recommended_crop && typeof data.recommended_crop === 'string') {
 
        setRecommendation(data.recommended_crop.toLowerCase());
      } else {
        setError(currentTranslations.unexpectedResponseError);
      }

    } catch (err: any) {
      console.error('Error fetching recommendation:', err);
      const message = err.message || '';
      let displayError = currentTranslations.fetchGenericError; 
      if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
          displayError = currentTranslations.fetchNetworkError;
      } else {
          displayError = `${currentTranslations.fetchErrorPrefix}: ${message}`;
      }
      setError(displayError);
      setRecommendation(''); 
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecording && recognition) {
        recognition.stop();
    }
    await getRecommendation();
  
    if (recommendation || error) {
        setTimeout(() => {
          
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }, 100); 
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
   
    const sanitizedValue = value.match(/^[0-9]*\.?[0-9]*$/);
    setFormData(prevData => ({
      ...prevData,
      [name]: sanitizedValue ? sanitizedValue[0] : prevData[name as keyof FormData]
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as LanguageKey;
    setLanguage(newLang);
    if (recognition && isRecording) {
      recognition.stop();
      
    }
    setError(null);
    setMicError(null);

  };

  const T = translations[language];

  const renderInputField = (name: keyof FormData) => {
    const labelKey = `${name}Label` as keyof typeof T;
    const unitKey = `${name}Unit` as keyof typeof T;

    const label = typeof T[labelKey] === 'string' ? T[labelKey] : name;
    const placeholder = typeof T[unitKey] === 'string' ? T[unitKey] : '';

    return (
        <div>
          <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text" 
              inputMode="decimal" 
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
              placeholder={placeholder}
              required
              disabled={isLoading || isRecording}
            />
            {SpeechRecognition && (
              <button
                type="button"
                onClick={() => handleMicClick(name)}
                className={`p-2 rounded-lg transition ${
                  recordingField === name
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600' 
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isLoading || (isRecording && recordingField !== name)}
                aria-label={`${language === 'te' ? 'రికార్డ్' : 'Record'} ${label}`} 
              >
                {recordingField === name ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>
            )}
          </div>
          {}
          {recordingField === name && <p className="text-xs text-blue-600 mt-1 animate-pulse">{T.listening}</p>}
        </div>
      );
  }


  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">{T.title}</h1>
      <div className="bg-white rounded-xl shadow-lg p-6">

        {}
        <div className="mb-4">
          <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-1">
            {T.languageLabel}
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-100"
            disabled={isLoading || isRecording} 
          >
            <option value="en">English</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>

        {}
        {micError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-md text-center text-sm text-red-700">
                {micError}
            </div>
        )}
         {}
         {!SpeechRecognition && (
            <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-md text-center text-sm text-orange-700">
                {T.micNotSupportedError} {}
            </div>
         )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {}
            {renderInputField('nitrogen')}
            {renderInputField('phosphorus')}
            {renderInputField('potassium')}
            {renderInputField('temperature')}
            {renderInputField('humidity')}
            {renderInputField('ph')}
            {renderInputField('rainfall')}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || isRecording} 
          >
            {isLoading ? T.loadingButton : T.submitButton}
          </button>
        </form>

        {}
        {error && !isLoading && (
          <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md text-center">
            <h3 className="text-lg font-semibold text-red-800">{T.errorPrefix}:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {}
        {recommendation && !isLoading && !error && (
          <div className="mt-6 p-4 rounded-md border border-green-300 bg-green-50 text-green-800 shadow-sm text-center">
             {}
             <h3 className="text-lg font-semibold text-green-800 mb-1">{T.recommendationPrefix}:</h3>
             {}
             <p className="text-xl font-medium"> {}
               {}
               {language === 'te' && T.cropNames && T.cropNames[recommendation]
                 ? T.cropNames[recommendation] 
                 : recommendation.charAt(0).toUpperCase() + recommendation.slice(1)
               }
             </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CropRecommendation;
