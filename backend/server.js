const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "https://rmv777.github.io"
}));

app.use(express.json());


import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/distancia", async (req, res) => {
    const { origen, destino } = req.body;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origen.lat},${origen.lng}&destinations=${destino.lat},${destino.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    const distancia = datos.rows[0].elements[0].distance.value;

    res.json({ distancia });
});

app.listen(3000, () => console.log("Backend seguro funcionando en puerto 3000"));
