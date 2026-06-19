const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());


const upload = multer({ storage: multer.memoryStorage() });


app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const data = await pdfParse(pdfBuffer);

    res.json({
      text: data.text,
    });
  } catch (error) {
    res.status(500).json({ error: "PDF read failed" });
  }
});


app.post("/generate", async (req, res) => {
  const { name, role, company, skills, resumeText } = req.body;

  const prompt = `
Write a professional cover letter.

Name: ${name}
Role: ${role}
Company: ${company}
Skills: ${skills}

Resume:
${resumeText || "No resume provided"}

Make it professional, clear and well structured.
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    res.json({
      text: response.data.candidates[0].content.parts[0].text,
    });

  } catch (error) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    res.status(500).json({
      text: "Error generating response",
    });
  }
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});