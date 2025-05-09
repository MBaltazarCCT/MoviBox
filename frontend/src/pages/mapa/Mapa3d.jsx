import React, { useState } from "react";
import Patio from "../../components/mapa3d/Patio";

function Mapa3d() {
    const colores = ["verde", "rojo", "azul", "gris", "naranja"];
    const estados = ["LLENO", "VACÍO"];
  const data = new Array(260).fill(0).map((_, id) => ({
    id,
    peso: Math.floor(Math.random() * (200000 - 50000 + 1)) + 50000,
    color: colores[Math.floor(Math.random() * colores.length)],
    estado: estados[Math.floor(Math.random() * estados.length)],
  }));

  return (
    <div>
      <Patio data={data}/>
    </div>
  );
}

export default Mapa3d;
