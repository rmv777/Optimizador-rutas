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
  try {
    const { origen, destino } = req.body;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    const elemento = datos.rows[0].elements[0];

    if (elemento.status !== "OK") {
      return res.status(400).json({ error: "No se pudo calcular la distancia" });
    }

    const distancia = elemento.distance.value; // metros
    const duracion = elemento.duration.value; // segundos

    res.json({
      distancia,
      duracion
    });

  } catch (error) {
    console.error("Error en /distancia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



app.listen(PORT, () => {
  console.log(`Backend funcionando en puerto ${PORT}`);
});
