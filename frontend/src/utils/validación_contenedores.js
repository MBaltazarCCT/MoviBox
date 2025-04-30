export const reglasCnt = {
  requerido: { required: "Campo obligatorio" },
  tipodmg: {
    required: "Campo obligatorio",
    validate: (value) => {
      if (value.length === 0) {
        return "Campo obligatorio";
      }
      return true;
    },
  },
};

// Validación número de contenedor

const ValorLetras = {
  A: 10,
  B: 12,
  C: 13,
  D: 14,
  E: 15,
  F: 16,
  G: 17,
  H: 18,
  I: 19,
  J: 20,
  K: 21,
  L: 23,
  M: 24,
  N: 25,
  O: 26,
  P: 27,
  Q: 28,
  R: 29,
  S: 30,
  T: 31,
  U: 32,
  V: 34,
  W: 35,
  X: 36,
  Y: 37,
  Z: 38,
};

export function validateContainerNumber(textt) {
  if (!/^[A-Z]{4}\d{6}\d{1}$/.test(textt)) {
    console.log(textt);
    return false;
  }

  let suma = 0;
  let exp = 1;

  textt
    .slice(0, -1)
    .split("")
    .forEach((char) => {
      const val = ValorLetras[char] || Number(char);
      suma += val * exp;
      exp *= 2;
    });

  let digitoVerificador = suma - Math.trunc(suma / 11) * 11;
  digitoVerificador = digitoVerificador === 10 ? 0 : digitoVerificador;

  return digitoVerificador === Number(textt.slice(-1));
}

//Array de colores en formato RGB
// Se utiliza para mostrar los colores en el formulario de registro de datos generales de contenedores
const coloresRGB = {
  AMARILLO: { color: "AMARILLO", rgb: "rgb(220, 220, 28)" },
  AZUL: { color: "AZUL", rgb: "rgb(16, 16, 147)" },
  BLANCO: { color: "BLANCO", rgb: "rgb(207, 206, 206)" },
  GRIS: { color: "GRIS", rgb: "rgb(128, 128, 128)" },
  NARANJA: { color: "NARANJA", rgb: "rgb(255, 165, 0)" },
  ROJO: { color: "ROJO", rgb: "rgb(179, 31, 31)" },
  ROSA: { color: "ROSA", rgb: "rgb(254, 116, 139)" },
  "VERDE CLARO": { color: "VERDE CLARO", rgb: "rgb(144, 238, 144)" },
  "VERDE OSCURO": { color: "VERDE OSCURO", rgb: "rgb(9, 63, 9)" },
};

export const coloresRGBArray = Object.values(coloresRGB);

//Array de datos de contenedor
export const tipos_daños = [
  "Ninguno",
  "Húmedo",
  "Abombado",
  "Abollado",
  "Raspado",
  "Cortado",
  "Perforado",
  "Doblado",
  "Desprendido",
  "Roto",
  "Flojo",
  "Torsión",
  "Rajado",
  "Falta",
  "Oxidado",
  "Sucio",
  "Resp. Impropia",
];

export function transformarData(datos) {
  const datosNuevos = Object.fromEntries(
    Object.entries(datos).map(([key, value]) => {
      if (key.startsWith("color")) {
        return [key, value.color.toUpperCase()];
      }
      if (key.startsWith("cliente")) {
        return [key, value.CLIENTE.toUpperCase()];
      }
      if (key.startsWith("operador")) {
        return [key, value.name.toUpperCase()];
      }
      if (Array.isArray(value)) {
        return [key, value.join(",").toUpperCase()];
      }
      if (typeof value === "string") {
        return [key, value.trim().toUpperCase()];
      }
      return [key, value];
    })
  );
  transformarData.estatus = "Pendiente";
  transformarData.acceso = "Llegada";
  transformarData.user = "Max";
  return datosNuevos;
};

export function transformarDataUpdate(datos) {
  const datosNuevos = Object.fromEntries(
    Object.entries(datos).map(([key, value]) => {
      if (key.includes("fecha_llegada")) {
        return [key, value.split("T")[0]];
      }
      if (key.includes("hora_llegada")) {
        return [key, value.split("T")[1].slice(0, 5)];
      }
      if (key.startsWith("Color")) {
        return [key, coloresRGBArray.find((c) => c.color === value)] ;
      }
      

      if (Array.isArray(value)) {
        return [key, value.split(",").toUpperCase()];
      }
      if (typeof value === "string") {
        return [key, value.trim().toUpperCase()];
      }
      return [key, value];
    })
  );

  return datosNuevos;
};