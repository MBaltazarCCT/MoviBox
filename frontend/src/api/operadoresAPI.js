import axios from "axios";

// API para obtener la lista de empleados
const API_URL = "http://localhost:8081/api/empleados";

export const getOperadores = async (token) => {
  console.log(token);
  try {
    const response = await axios.post(API_URL, {}, token);
    return response.data;
  } catch (error) {
    console.error("Error fetching empleados:", error);
  }
};

export const getFotoOperador = async (nombre) => {
  try {
    const response = await axios.post(`${API_URL}/foto`, nombre);
    return response.data[0].avatar_128;
  } catch (error) {
    console.error("Error fetching foto:", error);
  }
};
