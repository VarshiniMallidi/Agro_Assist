import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, FlaskRound as Flask, MessageCircle } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome to AgroAssist</h1>
        <p className="text-lg text-gray-600">Your intelligent farming companion for better agricultural decisions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sprout className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Crop Recommendation</h3>
            <p className="text-gray-600 text-center mb-4">Get personalized crop suggestions based on your soil conditions and climate.</p>
            <button
              onClick={() => navigate('/crop-recommendation')}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flask className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">Fertilizer Recommendation</h3>
            <p className="text-gray-600 text-center mb-4">Find the perfect fertilizer mix for optimal crop growth and yield.</p>
            <button
              onClick={() => navigate('/fertilizer-recommendation')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">AI Chatbot</h3>
            <p className="text-gray-600 text-center mb-4">Get instant answers to your farming questions from our AI assistant.</p>
            <button
              onClick={() => navigate('/chatbot')}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose AgroAssist?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Smart Crop Recommendations</h3>
              <p className="text-gray-600">Get data-driven suggestions for the best crops to grow based on your specific conditions.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Flask className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Precise Fertilizer Guide</h3>
              <p className="text-gray-600">Optimize your fertilizer usage with customized recommendations for better yield.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;