import axios from "axios";


//APIS usadas en el formulario y tabla de contenedores

const API_URL = process.env.REACT_APP_API_CONTENEDORES;

//API para agregar un nuevo contenedor

export const addContenedor = async (data, token) => {
  try {
    const response = await axios.post(API_URL, data, token);
    return response.data;
    
  } catch (error) {
    console.error("Error adding contenedor:", error);
  }
};

//Consultar datos de un contenedor por id
export const getContenedor = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, token);
    return response.data;
  } catch (error) {
    console.error("Error fetching contenedor:", error);
    
  }
};

//Consultar datos de un contenedores por id
export const getContenedores = async (token) => {
  try {
    const response = await axios.get(API_URL, token);
    return response.data;
  } catch (error) {
    console.error("Error fetching contenedores:", error);
  }
};


//eliminar
export const deleteContenedor = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, token);
    return response.data;
  } catch (error) {
    console.error("Error deleting contenedor:", error);
  }
};

//API para obtener lista de operadores


