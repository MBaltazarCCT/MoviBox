import { useState, useEffect } from "react";
import axios from "axios";

const useFetchOperadores = () => {
  const [listaOperadores, setListaOperadores] = useState([]);

  const fetchOperadores = async () => {
    try {
      const res = await axios.post("http://localhost:8081/api/empleados");
      setListaOperadores(res.data);
    } catch (err) {
      console.error("Error al obtener Operadores:", err);
    }
  };

  useEffect(() => {
    fetchOperadores(); // Se ejecuta al montar el componente
  }, []);

  return { listaOperadores, fetchOperadores };
};


const FetchFoto = async  (nombre) => {

    try {
      const res = await axios.post(
        "http://localhost:8081/api/foto/empleado",
        nombre
      );
      return res.data[0].avatar_128;
    } catch (err) {
      console.error("Error al obtener foto:", err);
    }
};



export default useFetchOperadores;
export { FetchFoto };
