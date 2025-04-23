import React, { useState, useEffect, useRef, } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Tab,
  Form,
  Button,
  Accordion,
  Navbar,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMsal } from "@azure/msal-react";



function NuevoCliente({
  setShowModal,
  AgregadoDesdeContenedor,
  esUpdate,
  esModoVista,
  actualizarClientes,
  id,
}) {
  const navigate = useNavigate();
  const id_cliente = id;

  const esAgregadoDesdeContenedor = AgregadoDesdeContenedor;
  const [tipoPersona, setTipoPersona] = useState("PF");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
    control,
    watch,
  } = useForm({
    defaultValues: {
      tipo_persona: "PF",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      razon_social: "",
      razon_comercial: "",
      representante_legal: "",
      rfc_nit: "",
      telefono: "",
      transportista: "",
      credito_disponible: "",
      email1: "",
      email2: "",
      email3: "",
      email4: "",
      estado: "",
      municipio: "",
      ciudad: "",
      colonia: "",
      calle: "",
      numero: "",
      codigo_postal: "",
      referencia: "",
    },
    disabled: esModoVista || false,
  });

  // Watch the tipo_persona field to update state when it changes

  const dataFetched = useRef(false);

  useEffect(() => {
    if ((esUpdate || esModoVista) && !dataFetched.current) {
      dataFetched.current = true; // Set to true to prevent re-fetching
      axios
        .get(`http://localhost:8081/cliente/${id_cliente}`)
        .then((res) => {
          const clienteData = res.data;
          console.log(clienteData)
          // Set all form values from received data

          reset(clienteData);
          setTipoPersona(clienteData.tipo_persona);
        })
        .catch((err) => console.log(err));
    }
  }, [esUpdate, id_cliente, reset]);

  const { instance, accounts } = useMsal();

  const onSubmit = async (data) => {

    //transformat data en mayúsculas
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "string") {
        data[key] = data[key].toUpperCase();
      }
    });

    try {
      // 1. Obtener el token
      const response = await instance.acquireTokenSilent({
        scopes: ["api://69781179-eb1b-42fa-93ab-3525c9d1e5d1/access_as_user"],
        account: accounts[0],
      });

      const token = response.accessToken;

      // 2. Configurar headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // 3. Hacer la petición
      if (esUpdate) {
        await axios.put(
          `http://localhost:8081/actualizar-cliente/${id_cliente}`,
          data,
          config
        );
        console.log("Cliente actualizado");
        navigate("/listado-clientes");
      } else {
        await axios.post("http://localhost:8081/agregar-cliente", data, config);
        console.log("Cliente creado");
        if (esAgregadoDesdeContenedor) {
          setShowModal(false);
          actualizarClientes();
        } else {
          navigate("/listado-clientes");
        }
      }
    } catch (err) {
      console.error("Error durante envío:", err);
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Accordion defaultActiveKey="0" alwaysOpen flush>
          <Accordion.Item eventKey="0" aria-expanded="true">
            <Accordion.Header>
              <h5 className="text-center">Inforamación del cliente</h5>
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Check
                  inline
                  type="radio"
                  label="Persona física"
                  id="personaFisica"
                  value="PF"
                  disabled={esUpdate}
                  {...register("tipo_persona")}
                  checked={tipoPersona === "PF"}
                  onChange={() => setTipoPersona("PF")}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Persona Moral"
                  id="personaMoral"
                  value="PM"
                  disabled={esUpdate}
                  {...register("tipo_persona")}
                  checked={tipoPersona === "PM"}
                  onChange={() => setTipoPersona("PM")}
                />
              </Form.Group>

              {tipoPersona === "PF" ? (
                <Row className="gy-3 mb-3">
                  <Col md={12}>
                    <Form.Label>
                      Nombre(s) <span className="text-danger">*</span>{" "}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("nombre", {
                        required: "Este campo es requerido",
                      })}
                    />
                    {errors.nombre && (
                      <span className="text-danger">
                        {errors.nombre.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Label>
                      Apellido paterno <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("apellido_paterno", {
                        required: "Este campo es requerido",
                      })}
                    />
                    {errors.apellido_paterno && (
                      <span className="text-danger">
                        {errors.apellido_paterno.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Label>
                      Apellido materno <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("apellido_materno", {
                        required: "Este campo es requerido",
                      })}
                    />
                    {errors.apellido_materno && (
                      <span className="text-danger">
                        {errors.apellido_materno.message}
                      </span>
                    )}
                  </Col>
                </Row>
              ) : (
                <Row className="gy-3 mb-3">
                  <Col md={6}>
                    <Form.Label>
                      Razón social <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("razon_social", {
                        required: "Este campo es requerido",
                      })}
                    />
                    {errors.razon_social && (
                      <span className="text-danger">
                        {errors.razon_social.message}
                      </span>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Label>
                      Razón comercial <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      {...register("razon_comercial", {
                        required: "Este campo es requerido",
                      })}
                    />
                    {errors.razon_comercial && (
                      <span className="text-danger">
                        {errors.razon_comercial.message}
                      </span>
                    )}
                  </Col>
                </Row>
              )}

              <hr />

              <Row className="gy-3">
                <Col md={6}>
                  <Form.Label>
                    Representante legal <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("representante_legal", {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.representante_legal && (
                    <span className="text-danger">
                      {errors.representante_legal.message}
                    </span>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Label>
                    RFC / NIT <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("rfc_nit", {
                      required: "Este campo es requerido",
                      pattern: {
                        value: /^[A-Z0-9]{10,17}$/,
                        message: "Formato RFC/NIT inválido",
                      },
                    })}
                  />
                  {errors.rfc_nit && (
                    <span className="text-danger">
                      {errors.rfc_nit.message}
                    </span>
                  )}
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Teléfono <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="tel"
                    {...register("telefono", {
                      required: "Este campo es requerido",
                      pattern: {
                        value: /^\d{10}$/,
                        message: "Debe contener 10 dígitos",
                      },
                    })}
                  />
                  {errors.telefono && (
                    <span className="text-danger">
                      {errors.telefono.message}
                    </span>
                  )}
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Transportista <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("transportista", {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.transportista && (
                    <span className="text-danger">
                      {errors.transportista.message}
                    </span>
                  )}
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Crédito total disponible{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    {...register("credito_disponible", {
                      required: "Este campo es requerido",
                      min: { value: 0, message: "El valor debe ser positivo" },
                    })}
                  />
                  {errors.credito_disponible && (
                    <span className="text-danger">
                      {errors.credito_disponible.message}
                    </span>
                  )}
                </Col>

                <Col md={6}>
                  <Form.Label>
                    Contacto Email 1 <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email1", {
                      required: "Este campo es requerido",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {errors.email1 && (
                    <span className="text-danger">{errors.email1.message}</span>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Label>Contacto Email 2</Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email2", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {errors.email2 && (
                    <span className="text-danger">{errors.email2.message}</span>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Label>Contacto Email 3</Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email3", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {errors.email3 && (
                    <span className="text-danger">{errors.email3.message}</span>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Label>Contacto Email 4</Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email4", {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email inválido",
                      },
                    })}
                  />
                  {errors.email4 && (
                    <span className="text-danger">{errors.email4.message}</span>
                  )}
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="0" aria-expanded="true">
            <Accordion.Header>
              <h5 className="text-center">Dirección del cliente</h5>
            </Accordion.Header>
            <Accordion.Body>
              <Row className="gy-3 mt-2">
                <Col md={4}>
                  <Form.Label>
                    Estado <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("estado", {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.estado && (
                    <span className="text-danger">{errors.estado.message}</span>
                  )}
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Municipio <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("municipio", {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.municipio && (
                    <span className="text-danger">
                      {errors.municipio.message}
                    </span>
                  )}
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Ciudad <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("ciudad", {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.ciudad && (
                    <span className="text-danger">{errors.ciudad.message}</span>
                  )}
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Colonia <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("colonia", {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.colonia && (
                    <span className="text-danger">
                      {errors.colonia.message}
                    </span>
                  )}
                </Col>
                <Col md={4}>
                  <Form.Label>
                    Calle <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("calle", {
                      required: "Este campo es requerido",
                    })}
                  />
                  {errors.calle && (
                    <span className="text-danger">{errors.calle.message}</span>
                  )}
                </Col>
                <Col md={2}>
                  <Form.Label>
                    Número <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("numero", {
                      required: "Este campo es requerido",
                      pattern: {
                        value: /^\d+$/,
                        message: "Solo números",
                      },
                    })}
                  />
                  {errors.numero && (
                    <span className="text-danger">{errors.numero.message}</span>
                  )}
                </Col>
                <Col md={2}>
                  <Form.Label>
                    C.P. <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    {...register("codigo_postal", {
                      required: "Este campo es requerido",
                      pattern: {
                        value: /^\d+$/,
                        message: "Solo números",
                      },
                    })}
                  />
                  {errors.codigo_postal && (
                    <span className="text-danger">
                      {errors.codigo_postal.message}
                    </span>
                  )}
                </Col>
                <Col md={12}>
                  <Form.Label>
                    Referencia <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register("referencia")}
                  />

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
                  disabled={isSubmitting}
                  style={{
                    background: "#162759",
                    height: "40px",
                    borderColor: "#162759",
                  }}
                >
                  {esUpdate ? "Actualizar" : "Guardar nuevo cliente"}
                </Button>
              </div>
            </div>
          </Col>
        </Navbar>
      </Form>
    </>
  );
}

export default NuevoCliente;
