import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

// CORS para tu frontend en GitHub Pages
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://rmv777.github.io");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.post("/distancia", async (req, res) => {
  const { origen, destino } = req.body;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  const respuesta = await fetch(url);
  const datos = await respuesta.json();

  // Validación de errores de Google
  if (!datos.rows || !datos.rows[0] || !datos.rows[0].elements || !datos.rows[0].elements[0]) {
    console.error("Respuesta inesperada de Google:", datos);
    return res.status(500).json({ error: "Error en la API de Google", datos });
  }

  const distancia = datos.rows[0].elements[0].distance.value;

  res.json({ distancia });
});


app.listen(PORT, () => {
  console.log(`Backend funcionando en puerto ${PORT}`);
});
