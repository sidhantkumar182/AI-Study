const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPIKey() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('\n==================================================');
  console.log('🔍 Testing Google Gemini API Key Setup...');
  console.log('==================================================');
  console.log(`🔑 Key: "${apiKey ? apiKey.slice(0, 15) + '...' : 'EMPTY'}"`);

  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-lite-preview-02-05', 'gemini-2.0-flash-exp', 'gemini-1.5-flash-latest'];

  for (const mName of models) {
    try {
      console.log(`📡 Requesting model ${mName}...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: mName });

      const result = await model.generateContent('Say "Hello"');
      const responseText = result.response.text();

      console.log(`✅ SUCCESS with ${mName}! Response: "${responseText.trim()}"`);
      console.log('==================================================\n');
      return;
    } catch (error) {
      console.log(`❌ ERROR (${mName}): ${error.message.slice(0, 150)}...`);
    }
  }
  console.log('==================================================\n');
}

testGeminiAPIKey();
