import { useMsal } from "@azure/msal-react";

export const useGenerarToken = () => {
  const { instance, accounts } = useMsal();

  const obtenerHeaders = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: [process.env.REACT_APP_API_TOKEN],
        account: accounts[0],
      });
      const token = response.accessToken;
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    } catch (error) {
      console.error("Error generating token:", error);
      throw error;
    }
  };

  return { obtenerHeaders };
};
