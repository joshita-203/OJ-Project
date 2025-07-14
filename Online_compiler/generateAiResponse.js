const {GoogleGenAI} = require("@google/genai");
const dotenv = require("dotenv");
dotenv.config();
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});


const generateAiResponse = async (code) =>{
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Give a short and crisp review of the following code. Then tell whether the code is correct or has any mistakes. 
    Also mention its time and space complexity. Check if the code is optimized — if not, suggest improvements in simple 
    and easy-to-understand language. Keep the overall response brief and beginner-friendly.
    Here is the code:
    ${code}
    `,
  });
   return response.text;
};

module.exports = generateAiResponse;