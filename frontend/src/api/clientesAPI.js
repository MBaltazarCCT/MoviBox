import axios from "axios";

const API_URL = process.env.REACT_APP_API_CLIENTES;

//API para extraer solo los nombres de los clientes

export const getNombresClientes = async (data, token) => {
  try {
    const response = await axios.get(`${API_URL}/nombres`, data, token);
    return response.data;
  } catch (error) {
    console.error("Error adding contenedor:", error);
    console.log(error);
  }
};

//API para obtener lista de clientes
export const getClientes = async (token) => {
  try {
    const response = await axios.get(API_URL, token);
    return response.data;
  } catch (error) {
    console.error("Error adding contenedor:", error);
    console.log(error);
  }
};

//Eliminar cliente
export const deleteCliente = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, token);
    return response.data;
  } catch (error) {
    console.error("Error deleting contenedor:", error);
    console.log(error);
  }
};

//API consultar cliente por id
export const getCliente = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, token);
    return response.data;
  } catch (error) {
    console.error("Error fetching contenedor:", error);
    throw error;
  }
};

//API para crear cliente
export const addCliente = async (data, token) => {
  try {
    const response = axios.post(API_URL, data, token);
    return response.data;
  } catch (error) {
    console.error("Error adding cliente:", error);
    console.log(error);
  }
};
