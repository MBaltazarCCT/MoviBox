import Encabezado from "./components/layout/Encabezado";
import LogInForm from "./utils/LogInForm";
import { SidebarMenu, BarraLateralToggle } from "./components/layout/BarraLateral";
import NuevoCliente from "./former_files/Clientes/NuevoCliente";
import ListadoContenedores from "./former_files/Contenedores/listado/ListadoContenedores";
import { Container, Row, Col } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router";
import Unidades from "./former_files/Unidades/Unidades";
import ListadoMovimientos from "./former_files/movimientos/ListadoMovimientos";
import { ChevronUp, Image } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import FormularioMovimientos from "./former_files/movimientos/FormularioMovimientos"
import "./index.css";
import Formulario_contenedor from "./pages/contenedores/Formulario_contenedor";
import Formulario_clientes from "./pages/clientes/Formulario_clientes";
import Tabla_clientes from "./pages/clientes/Tabla_clientes";
import Tabla_contenedores from "./pages/contenedores/Tabla_contenedores";
import "react-widgets/styles.css";
import Mapa3d from "./pages/mapa/Mapa3d";

import {
  MsalProvider,
  AuthenticatedTemplate,
  useMsal,
  UnauthenticatedTemplate,
} from "@azure/msal-react";

import { loginRequest } from "./authConfig";

function App({ instance }) {
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
    {process.env.REACT_APP_AUTH}
        <UnauthenticatedTemplate>
          <LogInForm setUserRol={setUserRol} />
        </UnauthenticatedTemplate>

        <AuthenticatedTemplate>
          {!userRol ? (
            <p>no tienes acceso</p>
          ) : (
            <div>
              <BrowserRouter>
                <Encabezado userRol={userRol} />
                <Container fluid style={{ marginBottom: "65px" }}>
                  <Row>
                    <Col md={2}>
                      <SidebarMenu />
                    </Col>
                    <Col
                      xxl={{ span: 6, offset: 2 }}
                      xl={{ span: 8, offset: 1 }}
                      md={{ span: 8, offset: 1 }}>
                      <main className="main-content mt-3 ms-md-3 ms-0">
                        <Row className="flex-column">
                          <Routes>
                            <Route index element={<Formulario_contenedor />} />
                            <Route
                              path="/cliente"
                              element={<Formulario_clientes esUpdate={false} />}
                            />
                            <Route path="llegada_sencillo" />
                            <Route path="Unidades" element={<Unidades />} />
                            <Route
                              path="listado-contenedores"
                              element={<Tabla_contenedores />}
                            />
                            <Route path="/contenedor/:id" />
                            <Route
                              path="listado-clientes"
                              element={<Tabla_clientes />}
                            />
                            <Route
                              path="nueva_llegada"
                              element={<Formulario_contenedor />}
                            />

                            <Route
                              path="movimientos"
                              element={<ListadoMovimientos />}
                            />
                            <Route
                              path="generar_movimiento"
                              element={<FormularioMovimientos />}
                            />
                          </Routes>
                        </Row>
                      </main>
                    </Col>
                    <Routes>
                      <Route
                        path="mapa"
                        element={<Mapa3d className=" mapa" />}
                      />
                    </Routes>
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
                  }}>
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
