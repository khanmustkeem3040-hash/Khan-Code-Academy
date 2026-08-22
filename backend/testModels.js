// testModels.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // Direct API call to fetch working models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log("=== APKI KEY PAR AVAILABLE MODELS ===");
    if(data.models) {
        data.models.forEach(m => console.log(m.name));
    } else {
        console.log(data);
    }
  } catch (err) {
    console.error(err);
  }
}

listModels();