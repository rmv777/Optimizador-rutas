import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint raíz (evita el error al abrir el dominio en Render)
app.get("/", (req, res) => {
  res.send("Backend Optimizador-rutas funcionando correctamente 🚀");
});

// Health check para Render
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Endpoint principal: cálculo de distancia
app.post("/distance", async (req, res) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({
        error: "Debes enviar 'origin' y 'destination' en el cuerpo de la petición."
      });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta GOOGLE_MAPS_API_KEY en las variables de entorno."
      });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
      origin
    )}&destinations=${encodeURIComponent(
      destination
    )}&key=${apiKey}&mode=driving&language=es`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      return res.status(500).json({
        error: "Error en la API de Google",
        details: data
      });
    }

    const element = data.rows[0].elements[0];

    if (element.status !== "OK") {
      return res.status(400).json({
        error: "No se pudo calcular la distancia",
        details: element
      });
    }

    res.json({
      origin: data.origin_addresses[0],
      destination: data.destination_addresses[0],
      distance: element.distance.text,
      duration: element.duration.text,
      distanceValue: element.distance.value,
      durationValue: element.duration.value
    });

  } catch (error) {
    console.error("Error en /distance:", error);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message
    });
  }
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
