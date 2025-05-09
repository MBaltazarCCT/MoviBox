import axios from "axios";

export const getUnidades = async (token) => {
const API_URL = process.env.REACT_APP_API_UNIDADES;
console.log(API_URL);

  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.text;
  } catch (error) {
    console.error("Error fetching unidades:", error);
  }
};

export const getClientes = async (token) => {
 const API_URL = process.env.REACT_APP_API_CLIENTES;


  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.text;
  } catch (error) {
    console.error("Error fetching unidades:", error);
  }
};
