import {
  Nav,
  ListGroup,

} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  BoxSeam,
  ArrowRepeat,
  People,
  Truck,
  Map,
} from "react-bootstrap-icons";
import "./BarraLateralStyle.css";


const SidebarMenu = () => {
  return (
    <aside className="sidebar ">
      <Nav variant="pills">
        <ListGroup>
          <ListGroup.Item className="border-0">
            <BoxSeam className="me-2" /> <strong>Contenedores</strong>
            <Nav className="flex-column ms-1">
              <NavLink to="/nueva_llegada" className="nav-link">
                Llegada
              </NavLink>
              <NavLink to="/listado-contenedores" className="nav-link">
                Inventario
              </NavLink>
            </Nav>
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            <ArrowRepeat className="me-2" /> <strong>Movimientos</strong>
            <Nav className="flex-column ms-1">
              <NavLink to="/movimientos" className="nav-link">
                Lista movimientos
              </NavLink>
              <NavLink to="/generar_movimiento" className="nav-link">
                Nuevo movimiento
              </NavLink>
            </Nav>
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            <People className="me-2" /> <strong>Clientes</strong>
            <Nav className="flex-column ms-1">
              <NavLink to="/listado-clientes" className="nav-link">
                Lista clientes
              </NavLink>
              <NavLink to="/cliente" className="nav-link">
                Nuevo cliente
              </NavLink>
            </Nav>
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            <Truck className="me-2" /> <strong>Unidades</strong>
            <Nav className="flex-column ms-1">
              <NavLink to="/flota-actual" className="nav-link">
                Flota actual
              </NavLink>
              <NavLink to="/Unidades" className="nav-link">
                Nueva unidad
              </NavLink>
            </Nav>
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            <Map className="me-2" /> <strong>Patio</strong>
            <Nav className="flex-column ms-1">
              <NavLink to="/mapa" className="nav-link">
                Mapa del patio
              </NavLink>
              
            </Nav>
          </ListGroup.Item>
        </ListGroup>
      </Nav>
    </aside>
  );
};


export { SidebarMenu };
