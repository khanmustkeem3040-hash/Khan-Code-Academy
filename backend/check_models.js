require('dotenv').config();

async function listModels() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("Error: GEMINI_API_KEY aapki .env file mein nahi mila!");
      return;
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    console.log("\n=== Available Models for Your Key ===");
    if (data.models) {
      data.models.forEach(m => {
        if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
          console.log(`- ${m.name.replace("models/", "")}`);
        }
      });
    } else {
      console.log("Response:", data);
    }
  } catch (err) {
    console.error("Error fetching models:", err);
  }
}

listModels();