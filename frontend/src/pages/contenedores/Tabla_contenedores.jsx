import React, { useEffect, useState } from "react";
import Tabla from "../../components/estructura_tabla/Tabla";
import { getContenedores } from "../../api/contendoresAPI.js";
import { useGenerarToken } from "../../api/useGenerarToken";
import { columns } from "../../utils/tablas/columnas_contenedores.jsx";

function Tabla_contenedores() {
  const [contenedores, setContenedores] = useState([]);
  const [onDeleteSuccess, setOnDeleteSuccess] = useState(false);
  const { obtenerHeaders } = useGenerarToken();

   const fetchData = async () => {
    const headers = await obtenerHeaders();
    const contenedores = await getContenedores(headers);
    console.log(contenedores)
    setContenedores(contenedores);
    setOnDeleteSuccess(false);
  }; 

  const datos = [
    {
        "id_contenedor": 38,
        "numero_contenedor": "CMAU8383723",
        "color": "AZUL",
        "tamano": "Otros",
        "estado": "LLENO",
        "carga": "General",
        "peso": "1000",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "kyn",
        "operador": "ADAN GUADALUPE",
        "ubicacion": "t-117",
        "unidad_llegada": "t-117",
        "fecha_llegada": "2025-04-30T00:00:00.000Z",
        "hora_llegada": "1970-01-01T15:34:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 40,
        "numero_contenedor": "CMAU8383723",
        "color": "ROJO",
        "tamano": "40' HC",
        "estado": "LLENO",
        "carga": "General",
        "peso": "5000",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCT",
        "operador": "Adan Guadalupe",
        "ubicacion": "T-179",
        "unidad_llegada": "T-179",
        "fecha_llegada": "2025-04-21T00:00:00.000Z",
        "hora_llegada": "1970-01-01T10:59:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 41,
        "numero_contenedor": "OOCU7885195",
        "color": "VERDE CLARO",
        "tamano": "20' DC",
        "estado": "LLENO",
        "carga": "IMO",
        "peso": "3000",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCT",
        "operador": "Adan Guadalupe",
        "ubicacion": "T-179",
        "unidad_llegada": "T-179",
        "fecha_llegada": "2025-04-21T00:00:00.000Z",
        "hora_llegada": "1970-01-01T10:59:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 42,
        "numero_contenedor": "XYLU8122383",
        "color": "NARANJA",
        "tamano": "20' DC",
        "estado": "VACÍO",
        "carga": "IMO",
        "peso": "9",
        "cliente": "MAXIMILIANO2 BALTAZAR QUINTERO",
        "transportista": "CCT",
        "operador": "Adan Guadalupe",
        "ubicacion": "T-179",
        "unidad_llegada": "T-179",
        "fecha_llegada": "2025-04-21T00:00:00.000Z",
        "hora_llegada": "1970-01-01T10:59:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 43,
        "numero_contenedor": "TXGU8156512",
        "color": "ROSA",
        "tamano": "40' DC Opentop",
        "estado": "LLENO",
        "carga": "IMO",
        "peso": "7000",
        "cliente": "MAXIMILIANO2 BALTAZAR QUINTERO",
        "transportista": "CCT",
        "operador": "Adan Guadalupe",
        "ubicacion": "T-179",
        "unidad_llegada": "T-179",
        "fecha_llegada": "2025-04-21T00:00:00.000Z",
        "hora_llegada": "1970-01-01T10:59:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 44,
        "numero_contenedor": "CMAU8383723",
        "color": "AMARILLO",
        "tamano": "40' Refrigerado",
        "estado": "LLENO",
        "carga": "IMO",
        "peso": "10000",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCT",
        "operador": "Adan Guadalupe",
        "ubicacion": "12908",
        "unidad_llegada": "12908",
        "fecha_llegada": "2025-04-21T00:00:00.000Z",
        "hora_llegada": "1970-01-01T15:56:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 47,
        "numero_contenedor": "CMAU8383723",
        "color": "ROJO",
        "tamano": "40' HC",
        "estado": "VACÍO",
        "carga": "General",
        "peso": "500000",
        "cliente": "   LOGISTICA EXPRESS SA TEST LEVONO SA DE CV",
        "transportista": "CCT",
        "operador": "Adan Guadalupe",
        "ubicacion": "Ubicación 2",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-04-21T00:00:00.000Z",
        "hora_llegada": "1970-01-01T16:11:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 48,
        "numero_contenedor": "CMAU8383723",
        "color": null,
        "tamano": "OTROS",
        "estado": "VACÍO",
        "carga": "GENERAL",
        "peso": "100000",
        "cliente": "CLIENTE 1",
        "transportista": "CCT",
        "operador": "ADAN GUADALUPE",
        "ubicacion": "T-144",
        "unidad_llegada": "T-144",
        "fecha_llegada": "2025-01-01T00:00:00.000Z",
        "hora_llegada": "1970-01-01T10:00:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 54,
        "numero_contenedor": "BMOU4847607",
        "color": "AZUL",
        "tamano": "20' DC",
        "estado": "LLENO",
        "carga": "REFRIGERADO",
        "peso": "500",
        "cliente": "   LOGISTICA EXPRESS SA TEST LEVONO SA DE CV",
        "transportista": "CCTRUCKING",
        "operador": "ADRIAN HERNANDEZ URIBE",
        "ubicacion": "12908",
        "unidad_llegada": "12908",
        "fecha_llegada": "2025-04-23T00:00:00.000Z",
        "hora_llegada": "1970-01-01T18:12:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 55,
        "numero_contenedor": "BMOU4847607",
        "color": "BLANCO",
        "tamano": "20' DC",
        "estado": "LLENO",
        "carga": "REFRIGERADO",
        "peso": "555555",
        "cliente": "   LOGISTICA EXPRESS SA TEST LEVONO SA DE CV",
        "transportista": "CCTRUCKING",
        "operador": "LUIS IGNACIO TORRES HERNANDEZ",
        "ubicacion": "T-177",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-02T00:00:00.000Z",
        "hora_llegada": "1970-01-01T12:13:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 56,
        "numero_contenedor": "BMOU4847607",
        "color": "BLANCO",
        "tamano": "20' DC",
        "estado": "LLENO",
        "carga": "REFRIGERADO",
        "peso": "555555",
        "cliente": "   LOGISTICA EXPRESS SA TEST LEVONO SA DE CV",
        "transportista": "CCTRUCKING",
        "operador": "LUIS IGNACIO TORRES HERNANDEZ",
        "ubicacion": "T-177",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-02T00:00:00.000Z",
        "hora_llegada": "1970-01-01T12:13:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 57,
        "numero_contenedor": "BMOU4847607",
        "color": "BLANCO",
        "tamano": "20' DC",
        "estado": "LLENO",
        "carga": "REFRIGERADO",
        "peso": "5000000",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCTRUCKING",
        "operador": "ADAN GUADALUPE RODRIGUEZ MALDONADO",
        "ubicacion": "T-177",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-21T00:00:00.000Z",
        "hora_llegada": "1970-01-01T13:19:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 58,
        "numero_contenedor": "BMOU4847607",
        "color": "BLANCO",
        "tamano": "40' HC",
        "estado": "LLENO",
        "carga": "REFRIGERADO",
        "peso": "5000",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCTRUCKING",
        "operador": "ALBERTO FRANCO CAMPOS",
        "ubicacion": "T-177",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-08T00:00:00.000Z",
        "hora_llegada": "1970-01-01T13:31:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 59,
        "numero_contenedor": "BMOU4847607",
        "color": "GRIS",
        "tamano": "40' HC",
        "estado": "VACÍO",
        "carga": "REFRIGERADO",
        "peso": "500",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCTRUCKING",
        "operador": "ADAN GUADALUPE RODRIGUEZ MALDONADO",
        "ubicacion": "T-177",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-08T00:00:00.000Z",
        "hora_llegada": "1970-01-01T13:39:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 60,
        "numero_contenedor": "BMOU4847607",
        "color": "GRIS",
        "tamano": "40' HC",
        "estado": "VACÍO",
        "carga": "REFRIGERADO",
        "peso": "500",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCTRUCKING",
        "operador": "ALFREDO ESTRADA QUINTERO",
        "ubicacion": "T-177",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-08T00:00:00.000Z",
        "hora_llegada": "1970-01-01T13:39:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 61,
        "numero_contenedor": "BMOU4847607",
        "color": "GRIS",
        "tamano": "40' HC",
        "estado": "VACÍO",
        "carga": "REFRIGERADO",
        "peso": "500",
        "cliente": "MAXIMILIANO BALTAZAR QUINTERO",
        "transportista": "CCTRUCKING",
        "operador": "ALFREDO ESTRADA QUINTERO",
        "ubicacion": "T-177",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-08T00:00:00.000Z",
        "hora_llegada": "1970-01-01T13:39:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    },
    {
        "id_contenedor": 62,
        "numero_contenedor": "BMOU4847607",
        "color": "AZUL",
        "tamano": "20' DC",
        "estado": "LLENO",
        "carga": "REFRIGERADO",
        "peso": "5000",
        "cliente": "   LOGISTICA EXPRESS SA TEST LEVONO SA DE CV",
        "transportista": "CCTRUCKING",
        "operador": "GERARDO OCEGUEDA ECHEVESTE",
        "ubicacion": "LUGAR 3",
        "unidad_llegada": "T-177",
        "fecha_llegada": "2025-05-06T00:00:00.000Z",
        "hora_llegada": "1970-01-01T13:45:00.000Z",
        "unidad_salida": null,
        "fecha_salida": null,
        "hora_salida": null,
        "registrado_por": null
    }
]

  useEffect(() => {
    fetchData();
  }, []);

  const recargarDatos = async () => {
    await fetchData();
  };

  return (
    <>
      <Tabla
        data={contenedores}
        columns={columns(obtenerHeaders /* recargarDatos */)}
        idfilter={"id_contenedor"}
      />
    </>
  );
}

export default Tabla_contenedores;
