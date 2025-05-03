import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, FlaskRound as Flask, MessageCircle, Home } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-green-700' : '';
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-8 w-8" />
            <span className="text-xl font-bold">AgroAssist</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/" className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-700 transition ${isActive('/')}`}>
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/crop-recommendation" className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-700 transition ${isActive('/crop-recommendation')}`}>
              <Sprout className="h-5 w-5" />
              <span>Crops</span>
            </Link>
            <Link to="/fertilizer-recommendation" className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-700 transition ${isActive('/fertilizer-recommendation')}`}>
              <Flask className="h-5 w-5" />
              <span>Fertilizer</span>
            </Link>
            <Link to="/chatbot" className={`flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-green-700 transition ${isActive('/chatbot')}`}>
              <MessageCircle className="h-5 w-5" />
              <span>Chat</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;