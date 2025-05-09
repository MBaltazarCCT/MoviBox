import { useState, useEffect } from "react";
import axios from "axios";

const useFetchClientes = () => {
  const [listaClientes, setListaClientes] = useState([]);

  const fetchClientes = async () => {
    try {
      const res = await axios.get("http://localhost:8081/nombres-clientes");
      setListaClientes(res.data);
    } catch (err) {
      console.error("Error al obtener clientes:", err);
    }
  };

  useEffect(() => {
    fetchClientes(); // Se ejecuta al montar el componente
  }, []);

  return { listaClientes, fetchClientes };
};

export default useFetchClientes;
