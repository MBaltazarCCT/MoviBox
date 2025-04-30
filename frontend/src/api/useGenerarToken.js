import { useMsal } from "@azure/msal-react";

export const useGenerarToken = () => {
  const { instance, accounts } = useMsal();

  const obtenerHeaders = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        scopes: ["api://69781179-eb1b-42fa-93ab-3525c9d1e5d1/access_as_user"],
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
