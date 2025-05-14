# AI-Driven Decision Support System For Sustainable Agriculture And Zero Hunger

---

## Project Overview

The AI-Driven Decision Support System is designed to support farmers by recommending the most suitable crops and fertilizers based on soil parameters and environmental factors. It also features a bilingual chatbot assistant for real-time agricultural guidance.

---

## Key Features

- **Crop Recommendation**  
  Suggests the best crop based on N, P, K, temperature, humidity, pH, and rainfall using a Decision Tree model.

- **Fertilizer Recommendation**  
  Recommends the ideal fertilizer based on crop type, N, P, K, temperature, humidity, soil moisture, and soil type using a Decision Tree model.

- **Bilingual Chatbot**  
  Provides real-time agricultural query responses in Telugu or English.

---

## Prerequisites

Ensure the following packages and tools are installed:

- python3  
- flask  
- flask-cors  
- numpy  
- scikit-learn  
- google-generativeai  
- googletrans  
- gTTS  
- node  
- npm  

---

## How to Run

This repository contains:

- Flask backend: `chatbot.py`, `crop.py`, `fertilizer.py`
- React frontend: `ChatBot.tsx`, `CropRecommendation.tsx`, `FertlizerRecommendation.tsx`

The frontend offers an intuitive interface and supports two languages.

### Usage (in VS Code or terminal)

1. Clone the repository:
   ```bash
   git clone https://github.com/VarshiniMallidi/Agro_Assist.git
2. Navigate to the project directory
   ```bash
   cd Agro_Assist
3. Set up Python environment and install dependencies
4. Add your Gemini API key
Edit backend/chatbot.py and add your Gemini API key where required.

5. Run Flask backends
Open three terminals:
    ```bash
       python backend/chatbot.py
       python backend/crop.py
       python backend/fertilizer.py
6. Install npm
     ```bash
        npm install
7. Rub the React frontend
     ```bash
        npm run dev
8. Access the application
   Open your browser and go to:
   http://localhost:5173/

## Project Structure
```text
Agro_Assist/
├── backend/
│   ├── chatbot.py
│   ├── crop.py
│   ├── fertilizer.py
│   ├── crop_model.pkl
│   └── fert_model.pkl
├── src/
│   └── components/
│       ├── ChatBot.tsx
│       ├── CropRecommendation.tsx
│       ├── FertilizerRecommendation.tsx
│       ├── Home.tsx
│       └── Navbar.tsx
├── colab/
│   ├── crop.ipynb
│   └── fertilizer.ipynb
├── datasets/
│   ├── Crop_recommendation.csv
│   └── Fertilizer Prediction.csv
```


## Usage Guide

### Crop Recommendation
- **Input**: N, P, K values, temperature, humidity, pH level, rainfall  
- **Output**: Recommended crop

### Fertilizer Recommendation
- **Input**: Crop name, NPK values, soil type, temperature, humidity, soil moisture  
- **Output**: Recommended fertilizer

### Chatbot
- **Input**: Any agriculture-related question  
- **Output**: AI-generated response (in Telugu or English)

---

## Contributors

**Team:**


- [A. Sirisahasra](https://github.com/Sirisahasra-Annamaneni) 
- [P. Nishitha](https://github.com/Nishitha-25)   
- [M. Varshini](https://github.com/VarshiniMallidi)





