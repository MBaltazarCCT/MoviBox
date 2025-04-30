import React from "react";

import { useMsal } from "@azure/msal-react";
import { loginRequest, getAccessToken } from "../authConfig";
import { Button, Image } from "react-bootstrap";
import logo from "../Recursos/logo-dark-512.png";
import { AlignCenter, Hr } from "react-bootstrap-icons";
import { get } from "react-hook-form";
import axios from "axios";
import { interval } from "date-fns";

function LogInForm({ setUserRol }) {
  const { instance } = useMsal();

  const handleLogin = async () => {
    setUserRol(null);
    try {
      const loginResponse = await instance.loginPopup({
        ...loginRequest,
        prompt: "select_account",
      });

      const account = loginResponse.account;

      const config = await getAccessToken(instance, account);

      config.params = { email: account.username };

      const res = await axios.get("http://localhost:8081/rol_usuario", config);

      if (res.data[0].rol) {
        instance.setActiveAccount(account);
        setUserRol(res.data[0].rol);
      } else {
        await instance.logout({
          postLogoutRedirectUri: "/", // opcional
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="d-flex flex-column align-items-center p-5 shadow rounded-4"
        style={{ backgroundColor: "#fff", maxWidth: "400px", width: "100%" }}
      >
        <Image
          src={logo}
          alt="Company Logo"
          className="mb-4"
          style={{
            maxHeight: "65px",
            width: "auto",
            objectFit: "contain",
          }}
        />

        <hr
          className="w-100 mb-4"
          style={{ borderColor: "#162759", opacity: 0.3 }}
        />

        <h3
          className="text-center mb-3"
          style={{ color: "#162759", fontWeight: "600" }}
        >
          Bienvenido a ConTrack
        </h3>

        <p
          className="text-center text-muted mb-4"
          style={{ fontSize: "0.95rem" }}
        >
          Inicie sesión con su cuenta de Microsoft 365 empresarial
        </p>

        <Button
          variant="secondary"
          className="w-100"
          onClick={() => handleLogin()}
          style={{
            backgroundColor: "#162759",
            borderColor: "#162759",
            fontWeight: "500",
            padding: "10px 0",
            borderRadius: "12px",
          }}
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  );
}

export default LogInForm;
