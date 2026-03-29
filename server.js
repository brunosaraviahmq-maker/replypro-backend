const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

// 🔍 Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 💬 Chat IA
app.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.json({ reply: "No hay mensaje" });
    }

    const userMessage = messages[messages.length - 1].content;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: userMessage
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.[0]?.generated_text ||
      "No pude responder en este momento";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Error en el servidor" });
  }
});

app.listen(3000, () => console.log("Servidor listo en puerto 3000"));