import React from "react";
import { useEffect, useState } from "react";
import {
  Accordion,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Navbar,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import axios from "axios";
import { DropdownList } from "react-widgets";
import { set } from "date-fns";
import { Eye, ChevronDown, Modem } from "react-bootstrap-icons";

function FormularioMovimientos() {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState,
    formState: { errors, isSubmitting },
    control,
  } = useForm();

  const [contenedores, setContenedores] = useState([]);
  const [succesModalShow, setSuccesModalShow] = useState(false);
  const [failModalShow, setFailModalShow] = useState(false);

  const movmientos = [
    "Camión a piso",
    "Camión a camión",
    "Estadías",
    "Inspección ocular",
    "Movimiento para lavado",
    "Movimiento para fumigación",
    "Movimiento para cambio de sello",
  ];

  useEffect(() => {
    axios.get("http://localhost:8081/contenedores-ubicacion").then((res) => {
      setContenedores(res.data);
      console.log(res.data);
    });
  }, []);

  const onSubmit = (data) => {
    data["solicitado_por"] = "Max";
    data["estatus"] = "Pendiente";
    data["fecha_realizado"] = new Date().toISOString().split("T")[0];
    data["hora_realizado"] = new Date().toISOString().split("T")[1].slice(0, 8);
    data["id_contenedor"] = contenedores.find(
      (c) => c.numero_contenedor === watch("contenedor")?.numero_contenedor
    )?.id_contenedor;
    console.log(data);
    axios
      .post("http://localhost:8081/crear-movimiento", data)
      .then((res) => {
        if (res.status === 200) {
          setSuccesModalShow(true);
        } else if (res.status === 500) {
          setFailModalShow(true);
        }
        console.log(res.data);
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        setFailModalShow(true);
      });
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Accordion defaultActiveKey="0" alwaysOpen flush>
          <Accordion.Item eventKey="0" aria-expanded="true">
            <Accordion.Header>
              <h5 className="text-center">Formulario de movimientos</h5>
            </Accordion.Header>
            <Accordion.Body>
              <Row className="gy-3 mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="d-flex align-items-center">
                      Contenedor <span className="text-danger"> *</span>
                    </Form.Label>
                    <Controller
                      name="contenedor"
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DropdownList
                          textField="numero_contenedor"
                          defaultValue={"Seleccione un contenedor"}
                          aria-invalid={errors.contenedor ? "true" : "false"}
                          dataKey="id_contenedor"
                          data={contenedores}
                          {...field}
                          onChange={(value) => {
                            field.onChange(value);
                            console.log(value);

                            setValue(
                              "lugar_origen",
                              contenedores.find(
                                (c) => c.id_contenedor === value.id_contenedor
                              )?.ubicacion || "No se tiene registro"
                            );
                          }}
                        />
                      )}
                    />
                    {errors.contenedor && (
                      <p className="text-danger">{errors.contenedor.message}</p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Seleccione un movimiento{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      {...register("tipo_movimiento", { required: true })}
                    >
                      {movmientos.map((movimiento, index) => (
                        <option
                          key={`${movimiento}-${index}`}
                          value={movimiento}
                        >
                          {movimiento}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>
                      Ubicación <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ubicación"
                      {...register("lugar_origen", {
                        required: "Campo requerido",
                      })}
                    />
                    {errors.cliente && (
                      <span className="text-danger">
                        {errors.cliente.message}
                      </span>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Destino <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Destino"
                      {...register("lugar_fin", {
                        required: "Campo requerido",
                      })}
                    />
                    {errors.cliente && (
                      <span className="text-danger">
                        {errors.cliente.message}
                      </span>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Seleccione un gruyero{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select
                      {...register("realizado_por", { required: true })}
                    >
                      <option>Gruyero 1</option>
                      <option>Gruyero 2</option>
                    </Form.Select>
                    {errors.gruyero && (
                      <p className="text-danger">
                        Se requiere seleccionar un gruyero
                      </p>
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Instrucciones adicionales</Form.Label>
                    <Form.Control
                      as="textarea"
                      {...register("instrucciones_add")}
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
                  Generar movimiento
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
                </Button>{" "}
              </div>
            </div>
          </Col>
        </Navbar>
      </Form>
      {succesModalShow && (
        <Modal_Succes
          show={succesModalShow}
          onHide={() => setSuccesModalShow(false)}
        />
      )}
      {failModalShow && (
        <Modal_Fail
          show={failModalShow}
          onHide={() => setFailModalShow(false)}
        />
      )}
    </>
  );
}

const Modal_Succes = (props) => {
  return (
    <Modal {...props} centered aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Contenedor agregado con éxito
        </Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button href="/listado-contenedores" variant="primary">
          Mostrar en inventario
        </Button>
        <Button variant="secondary" onClick={props.onHide}>
          Seguir agregando contenedores
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Modal_Fail = (props) => {
  return (
    <Modal {...props} centered aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Error al registrar contenedor
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>El contenedor no se podido agregar, intente nuevamente</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FormularioMovimientos;
