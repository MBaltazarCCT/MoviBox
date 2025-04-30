import React, { useState } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Modal,
  Navbar,
  Spinner,
  Accordion,
} from "react-bootstrap";
import axios from "axios";

const Unidades = () => {
  const [unidad, setUnidad] = useState({
    numeroUnidad: "",
    marca: "",
    operador: "",
    placas: "",
    licencia: "",
    transportista: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [failModalShow, setFailModalShow] = useState(false);

  const handleChange = (e) => {
    setUnidad({
      ...unidad,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    axios
      .post("http://localhost:8081/crear-unidad", unidad)
      .then((res) => {
        if (res.status === 200) {
          setSuccessModalShow(true);
        } else {
          setFailModalShow(true);
        }
      })
      .catch((error) => {
        console.error("Error al enviar la unidad:", error);
        setFailModalShow(true);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
                <Accordion defaultActiveKey="0" flush alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h5> Datos de llegada </h5>
            </Accordion.Header>
            <Accordion.Body>
        <Row className="gy-3 mb-3 p-3">
          <Col md={4}>
            <Form.Group controlId="numeroUnidad">
              <Form.Label>Número de Unidad</Form.Label>
              <Form.Control
                type="text"
                name="numeroUnidad"
                placeholder="Número de Unidad"
                value={unidad.numeroUnidad}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="marca">
              <Form.Label>Marca</Form.Label>
              <Form.Select
                name="marca"
                value={unidad.marca}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona una marca</option>
                <option value="Freightliner">Freightliner</option>
                <option value="Kenworth">Kenworth</option>
                <option value="Peterbilt">Peterbilt</option>
                <option value="International">International</option>
                <option value="Volvo">Volvo</option>
                <option value="Mack">Mack</option>
                <option value="Scania">Scania</option>
                <option value="Mercedes-Benz">Mercedes-Benz</option>
                <option value="MAN">MAN</option>
                <option value="DAF">DAF</option>
                <option value="Iveco">Iveco</option>
                <option value="Western Star">Western Star</option>
                <option value="Hino">Hino</option>
                <option value="Isuzu">Isuzu</option>
                <option value="Fuso">Fuso</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="placas">
              <Form.Label>Placas</Form.Label>
              <Form.Control
                type="text"
                name="placas"
                placeholder="Placas"
                value={unidad.placas}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="licencia">
              <Form.Label>Licencia</Form.Label>
              <Form.Control
                type="text"
                name="licencia"
                placeholder="Licencia"
                value={unidad.licencia}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="transportista">
              <Form.Label>Transportista</Form.Label>
              <Form.Control
                type="text"
                name="transportista"
                placeholder="Transportista"
                value={unidad.transportista}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={12}>
            <Form.Group controlId="operador">
              <Form.Label>Operador</Form.Label>
              <Form.Control
                type="text"
                name="operador"
                placeholder="Operador"
                value={unidad.operador}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        </Accordion.Body>
        </Accordion.Item>
        </Accordion>

        <Navbar
          bg="light"
          variant="light"
          className="sticky-bottom p-0 shadow border-top"
          style={{
            position: "fixed",
            bottom: "0",
            left: "0",
            width: "100vw",
            zIndex: "1",
            height: "60px",
          }}
        >
          <Col md={2}></Col>

          <Col md={10}>
            <div
              className="d-block justify-content-between align-items-center m-auto"
              style={{ width: "70%", maxWidth: "900px" }}
            >
              <div className="d-flex align-items-end justify-content-end">
                <Button
                  variant="primary"
                  type="submit"
                  style={{
                    background: "#162759",
                    height: "40px",
                    borderColor: "#162759",
                  }}
                >
                  Guardar unidad
                  {isSubmitting && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="ms-2"
                    />
                  )}
                </Button>
              </div>
            </div>
          </Col>
        </Navbar>
      </Form>

      {successModalShow && (
        <ModalSuccess
          show={successModalShow}
          onHide={() => setSuccessModalShow(false)}
        />
      )}
      {failModalShow && (
        <ModalFail
          show={failModalShow}
          onHide={() => setFailModalShow(false)}
        />
      )}
    </>
  );
};

const ModalSuccess = (props) => (
  <Modal {...props} centered>
    <Modal.Header closeButton>
      <Modal.Title>Unidad registrada con éxito</Modal.Title>
    </Modal.Header>
    <Modal.Footer>
      <Button href="/listado-unidades" variant="primary">
        Ver en listado
      </Button>
      <Button variant="secondary" onClick={props.onHide}>
        Agregar otra unidad
      </Button>
    </Modal.Footer>
  </Modal>
);

const ModalFail = (props) => (
  <Modal {...props} centered>
    <Modal.Header closeButton>
      <Modal.Title>Error al registrar unidad</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>No se pudo registrar la unidad. Intente nuevamente.</p>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={props.onHide}>
        Cerrar
      </Button>
    </Modal.Footer>
  </Modal>
);

export default Unidades;
