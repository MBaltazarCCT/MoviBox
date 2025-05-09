import { useEffect, useState } from "react";
import axios from "axios";
import { useMsal } from "@azure/msal-react";
import { Button, Dropdown, } from "react-bootstrap";

const UserImageFetcher = () => {
  const { instance, accounts } = useMsal();
  const [userImage, setUserImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accounts.length === 0) return;

      try {
        const response = await instance.acquireTokenSilent({
          scopes: ["User.Read"],
          account: accounts[0],
        });

        const token = response.accessToken;

        // Obtener foto de perfil
        const photoResponse = await axios.get(
          "https://graph.microsoft.com/v1.0/me/photo/$value",
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );
        const imageUrl = URL.createObjectURL(photoResponse.data);
        setUserImage(imageUrl);

        // Obtener datos del usuario
        const profileResponse = await axios.get(
          "https://graph.microsoft.com/v1.0/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserInfo({
          displayName: profileResponse.data.displayName,
          jobTitle: profileResponse.data.jobTitle,
        });
      } catch (error) {
        console.error("Error obteniendo datos del usuario:", error);
      }
    };

    fetchUserData();
  }, [accounts, instance]);

  const handleLogout = () => {
    instance.logoutRedirect().catch((e) => {
      console.log(e);
    });
  }

  if (!userInfo) return null;

  return (
    <div className="d-flex nowrap">
      <div style={{ color: "black", fontSize: "15px", textAlign: "right" }}>
        <div>{userInfo.displayName}</div>
        <div style={{ fontSize: "12px", opacity: 0.8 }}>
          {userInfo.jobTitle}
        </div>
      </div>
      <Dropdown className="bg-transparent border-none p-0" drop={"start"}>
        <Dropdown.Toggle
          id="dropdown-basic"
          className="bg-transparent border-0  p-0"
        >
          <img
            src={userImage}
            alt="Foto de perfil"
            className="ms-2"
            style={{ width: 40, height: 40, borderRadius: "50%" }}
          />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogout}>Cerrar sesión</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserImageFetcher;
