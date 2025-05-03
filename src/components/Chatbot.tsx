import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, Mic, MicOff } from 'lucide-react'; 

interface Message {
  text: string;
  isUser: boolean;
  audio?: string | null;
}

const SpeechRecognition =
  window.SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: SpeechRecognition | null = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false; 
  recognition.interimResults = false; 
}

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! What would you like help with today? Let’s make farming easier together!", isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false); 
  const [micError, setMicError] = useState<string | null>(null); 

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastAudioDataRef = useRef<string | null>(null);
  const isPlayingRef = useRef<boolean>(false);
  const [currentlyPlayingIndex, setCurrentlyPlayingIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); 

  useEffect(() => {
    if (!recognition) {
      console.warn("Speech Recognition API not supported in this browser.");
      return; 
    }

    recognition.lang = targetLanguage;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); 
      setIsRecording(false); 
      setMicError(null); 
      sendMessage(transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      let errorMsg = `Speech recognition error: ${event.error}`;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone access in your browser settings.";
      } else if (event.error === 'no-speech') {
        errorMsg = "No speech detected. Please try speaking clearly.";
      }
      setMicError(errorMsg);
      setIsRecording(false);
    };

    recognition.onend = () => {
      if (isRecording) {
         setIsRecording(false);
      }
    };

    return () => {
      if (recognition && isRecording) {
        recognition.stop();
      }
    };
  }, [targetLanguage, isRecording]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { text: messageText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInput(''); 
    setIsLoading(true);
    setMicError(null); 

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `user_input=${encodeURIComponent(messageText)}&target_language=${targetLanguage}`,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = {
        text: data.response, 
        isUser: false,
        audio: data.audio || null,
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        text: 'Oops! 😅 Something went wrong while talking to Your Farming Assistant.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetLanguage(e.target.value);
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  const playAudio = (audioData: string | null, index: number) => {
    if (!audioData) return;

    if (
      audioRef.current &&
      lastAudioDataRef.current === audioData &&
      isPlayingRef.current &&
      currentlyPlayingIndex === index
    ) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      isPlayingRef.current = false;
      setCurrentlyPlayingIndex(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(`data:audio/mpeg;base64,${audioData}`);
    audioRef.current = audio;
    lastAudioDataRef.current = audioData;
    isPlayingRef.current = true;
    setCurrentlyPlayingIndex(index);

    audio.play().catch(e => console.error("Error playing audio:", e));

    audio.onended = () => {
      isPlayingRef.current = false;
      setCurrentlyPlayingIndex(null);
    };
  };

  const handleMicClick = () => {
    if (!recognition) {
      setMicError("Speech Recognition is not supported by your browser.");
      return;
    }

    if (isRecording) {
      recognition.stop(); 
      setIsRecording(false);
    } else {
      try {
        setMicError(null);
        recognition.lang = targetLanguage; 
        recognition.start();
        setIsRecording(true);
      } catch (error) {
         console.error("Error starting recognition:", error);
         setMicError("Could not start microphone. Please check permissions.");
         setIsRecording(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Your Farming Assistant</h1>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              id="language"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={targetLanguage}
              onChange={handleLanguageChange}
              disabled={isRecording} 
            >
              <option value="en">English</option>
              <option value="te">తెలుగు (Telugu)</option>
              {}
            </select>
          </div>
          {}
          <div className="text-sm text-right ml-4">
             {micError && <p className="text-red-600">{micError}</p>}
             {isRecording && <p className="text-blue-600 animate-pulse">Listening...</p>}
             {!SpeechRecognition && <p className="text-orange-600">Mic input not supported.</p>}
          </div>
        </div>
        <div className="h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 shadow-sm ${ 
                    message.isUser
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  } flex items-center justify-between gap-2`}
                >
                  {}
                  <span dangerouslySetInnerHTML={{ __html: message.text }} />
                  {!message.isUser && message.audio && (
                    <button
                      onClick={() => playAudio(message.audio, index)}
                      className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 ${message.isUser ? 'text-green-200 hover:text-white focus:ring-white' : 'text-gray-500 hover:text-green-600 focus:ring-green-500'}`}
                      aria-label={currentlyPlayingIndex === index ? "Stop audio" : "Play audio"}
                    >
                      {currentlyPlayingIndex === index ? (
                        <span role="img" aria-label="stop icon" className="text-lg">⏹️</span> 
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 animate-pulse">
                  Thinking... 🤔
                </div>
              </div>
            )}
            {}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={handleChange}
                placeholder={isRecording ? "Listening..." : "Ask queries about farming... 🚜"}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500"
                disabled={isLoading || isRecording} 
              />
              {}
              {SpeechRecognition && ( 
                 <button
                    type="button" 
                    onClick={handleMicClick}
                    className={`p-2 rounded-lg transition ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    disabled={isLoading} 
                    aria-label={isRecording ? "Stop recording" : "Start recording"}
                 >
                    {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                 </button>
              )}
              {}
              <button
                type="submit"
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isRecording || !input.trim()} 
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
