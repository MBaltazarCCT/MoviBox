import Encabezado from "./Complementos/Encabezado";
import  LogInForm  from "./Complementos/LogInForm";
import { SidebarMenu, BarraLateralToggle } from "./Complementos/BarraLateral";
import NuevoCliente from "./Clientes/NuevoCliente";
import ListadoContenedores from "./Contenedores/listado/ListadoContenedores";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router";
import Unidades from "./Unidades/Unidades";
import ListadoClientes from "./Clientes/ListadoClientes";
import NuevaLlegada from "./Contenedores/formulario/NuevaLlegada";
import ListadoMovimientos from "./Movimientos/ListadoMovimientos";
import { ChevronUp, Image } from "react-bootstrap-icons";
import { useEffect, useState, } from "react";
import FormularioMovimientos from "./Movimientos/FormularioMovimientos";
import MapaPatio from "./Mapa/MapaPatio";
import "./index.css";
import axios from "axios";


import {
  MsalProvider,
  AuthenticatedTemplate,
  useMsal,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

import { loginRequest,  } from "./authConfig";




function App( {instance } ) {

  

  const handleScrolltop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const mostarScrollTop = () => {
    const scrollTopButton = document.querySelector(".scroll-top");
    if (window.pageYOffset > 500) {
      scrollTopButton.style.display = "block";
    } else {
      scrollTopButton.style.display = "none";
    }
  };

  const [userRol, setUserRol] = useState("esperando...");

  useEffect(() => {
    window.addEventListener("scroll", mostarScrollTop);
  }, []);

  return (
    <>
      <MsalProvider instance={instance}>
        <UnauthenticatedTemplate>
          <LogInForm setUserRol={setUserRol} />
        </UnauthenticatedTemplate>

        <AuthenticatedTemplate>
          {!userRol ? ( <p>no tienes acceso</p>) : (
          <div>
            <BrowserRouter>
              <Encabezado userRol={userRol} />
              <Container
                fluid
                className="contenedor"
                style={{ marginBottom: "65px" }}
              >
                <Row>
                  <Col md={2}>
                    <SidebarMenu />
                  </Col>
                  <Col
                    xxl={{ span: 6, offset: 2 }}
                    xl={{ span: 8, offset: 1 }}
                    md={{ span: 8, offset: 1 }}
                  >
                    <main className="main-content mt-3 ms-md-3 ms-0">
                      <Row className="flex-column">
                        <Routes>
                          <Route index element={<Unidades />} />
                          <Route path="cliente" element={<NuevoCliente />} />
                          <Route
                            path="/cliente/:id_cliente"
                            element={<NuevoCliente update={true} />}
                          />
                          <Route path="llegada_sencillo" />
                          <Route path="Unidades" element={<Unidades />} />
                          <Route
                            path="listado-contenedores"
                            element={<ListadoContenedores />}
                          />
                          <Route path="/contenedor/:id" />
                          <Route
                            path="listado-clientes"
                            element={<ListadoClientes />}
                          />
                          <Route
                            path="nueva_llegada"
                            element={<NuevaLlegada />}
                          />

                          <Route
                            path="movimientos"
                            element={<ListadoMovimientos />}
                          />
                          <Route
                            path="generar_movimiento"
                            element={<FormularioMovimientos />}
                          />
                          <Route
                            path="mapa"
                            element={<MapaPatio className="m-0" />}
                          />
                        </Routes>
                      </Row>
                    </main>
                  </Col>
                </Row>
              </Container>

              <div
                className="scroll-top"
                onClick={handleScrolltop}
                style={{
                  position: "fixed",
                  bottom: "30px",
                  right: "20px",
                  cursor: "pointer",
                  backgroundColor: "#162759",
                  color: "white",
                  borderRadius: "50%",
                  padding: "10px",
                  display: "none",
                  zIndex: 1000,
                }}
              >
                <ChevronUp size={30} />
              </div>
            </BrowserRouter>
          </div>
          )}
        </AuthenticatedTemplate>
        
      </MsalProvider>
    </>
  );
}

export default App;
