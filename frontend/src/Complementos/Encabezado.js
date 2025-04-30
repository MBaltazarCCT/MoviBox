import React, { useState } from "react";
import logo from "../Recursos/logo-dark-512.png";
import { Navbar, Container, Nav, Form, Image } from "react-bootstrap";
import UserImageFetcher from "./UserImageFetcher";

import "./BarraLateralStyle.css";

function Encabezado({ userRol }) {
  const [show, setShow] = useState(false);
  console.log("rol: ", userRol.rol);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Navbar
        bg="light"
        variant="light"
        expand="md"
        className="p-0 shadow sticky-top"
      >
        <Navbar.Brand href="#" className="col-md-3 col-lg-2 me-0 px-4">
          <Image
            src={logo}
            alt="Company Logo"
            rounded
            className="me-2"
            style={{
              maxHeight: "55px",
              width: "auto",
            }}
          />
        </Navbar.Brand>

        {userRol}

        <Navbar.Toggle
          aria-controls="sidebarMenu"
          className="position-absolute d-md-none"
        />

        <Nav className="ms-auto">
          <UserImageFetcher />
        </Nav>
      </Navbar>
    </>
  );
}

export default Encabezado;
