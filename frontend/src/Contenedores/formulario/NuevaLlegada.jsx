import React, { useState, useEffect, useCallback, useRef, } from "react";
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
import useFetchClientes from "./FetchClientes";
import axios from "axios";
import Multiselect from "react-widgets/Multiselect";
import "react-widgets/styles.css";
import "./NuevoContenedorStyle.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FormDatosGenerales,
  FormImagenes,
  FormDaños,
  FormMovimientos,
  FormDatosLlegada,
} from "./ContenedorForm";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

const NuevaLlegada = (props) => {
  const navigate = useNavigate();
  const id = props.id;
  const esUpdate = props.update;
  const esModoVista = props.view;
  const { listaClientes, fetchClientes } = useFetchClientes();
  const [cantidadDeContenedores, setCantidadDeContenedores] = useState(1);
  const handleEditadoCorrectamente = props.handleEditadoCorrectamente;

  const [succesModalShow, setSuccesModalShow] = useState(false);
  const [failModalShow, setFailModalShow] = useState(false);
  const [contenedoresAgregados, setContenedoresAgregados] = useState([]);

  const valoresDefault = {
    fecha_llegada: "",
    hora_llegada: "",
    transportista: "CCT",
    operador: "",
    numero_contenedor1: "CMAU8383723",
    eco: "",
    estado1: "VACÍO",
    carga1: "",
    peso1: "",
    tamano1: "Otros",
    cliente1: "",
    num_candado1: "1234",
  };

  const dataFetched = useRef(false);
  const [color_contenedor, setColorContenedor] = useState("");

  // Use useState for form values
  const [formValues, setFormValues] = useState(valoresDefault);

  // Cargar los datos en caso de que sea update o vista
  useEffect(() => {
    if ((esUpdate || esModoVista) && !dataFetched.current) {
      dataFetched.current = true; 
      const fetchData = async () => {
        try {
          const res = await axios.get(`http://localhost:8081/contenedor/${id}`);
          console.log(res.data);
          const updatedValues = {
            fecha_llegada: res.data.fecha_llegada.split("T")[0],
            hora_llegada: res.data.hora_llegada.split("T")[1].slice(0, 5),
            transportista: res.data.transportista,
            operador: res.data.operador,
            numeroContenedor1: res.data.numero_contenedor,
            eco: res.data.unidad_llegada,
            estado1: res.data.estado,
            carga1: res.data.carga,
            num_candado1: res.data.num_candado,
            peso1: res.data.peso,
            tamano1: res.data.tamano,
            cliente1: res.data.cliente,
            color1: res.data.color,
            dmg_frontal1: res.data.dmg_frontal.split(",") || [],
            dmg_lateral_derecha1: res.data.dmg_lateral_d.split(",") || [],
            dmg_lateral_izquierda1: res.data.dmg_lateral_i.split(",") || [],
            dmg_candado1: res.data.dmg_candado.split(",") || [],
            dmg_trasera1: res.data.dmg_trasero.split(",") || [],
            obs_trasera1: res.data.obs_trasero,
            obs_frontal1: res.data.obs_frontal,
            obs_lateral_derecho1: res.data.obs_lateral_d,
            obs_lateral_izquierdo1: res.data.obs_lateral_i,
            obs_candado1: res.data.obs_candado,
            num_candado1: res.data.num_candado,
            tipo_movimiento1: res.data.tipo_movimiento,
            lugar_fin1: res.data.lugar_fin,
            instrucciones_add1: res.data.instrucciones_add,

          };
          
          reset(updatedValues); // Reset form values 
          //actualizar el color
          setColorContenedor(res.data.color);

        } catch (err) {
          setFormValues(valoresDefault);
          
          console.error("Error fetching data:", err);
        }
      };

      fetchData();
    }
  }, [id, esUpdate, esModoVista]);

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    control,
  } = useForm({
    defaultValues: formValues,
    mode: "onChange",
    disabled: esModoVista || false,
  });


  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({});
    }
  }, [isSubmitSuccessful, reset]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onSubmit = async (data) => {

    setContenedoresAgregados([]);

    //await delay(2000);

    let transformedData = Object.entries(data).reduce((acc, [key, value]) => {
      // eliminar espacios en blanco al inicio y al final
      if (typeof value === "string") {
        value = value.trim();
      }

      // Convertir a mayúsculas
      const keyMatch = key.match(/^([a-zA-Z_]+)(\d+)$/);

      //guardar el número de contenedor
      if (keyMatch && keyMatch[1] === "numero_contenedor") {
        setContenedoresAgregados((prev) => [...prev, value]);
      }

      if (keyMatch) {
        const [, fieldName, containerNum] = keyMatch;
        const containerIndex = parseInt(containerNum, 10);

        if (containerIndex <= cantidadDeContenedores) {
          // Special handling for cliente fields
          if (fieldName === "cliente" && value && value.CLIENTE) {
            acc[key] = value.CLIENTE.toUpperCase();
          } else if (Array.isArray(value)) {
            acc[key] = value.join(",");
          } else if (fieldName === "color" && value && value.color) {
            acc[key] = value.color.toUpperCase();
          } else {
            acc[key] = value;
          }
        }
      } else {
        acc[key] = value;
      }

      return acc;
    }, {});

    transformedData.cantidad_contenedores = cantidadDeContenedores;
    transformedData.estatus = "Pendiente";
    transformedData.acceso = "Llegada";
    transformedData.fecha_llegada = transformedData.fecha_llegada.trim();
    transformedData.user = "Max";
    transformedData.unidad_llegada = data.eco;

    if (esUpdate) {
      axios
        .put(
          `http://localhost:8081/actualizar-contenedor/${id}`,
          transformedData
        )
        .then((res) => {
          if (res.status === 200) {
            handleEditadoCorrectamente(true);
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
          setFailModalShow(true);
        });
    } else {
      axios
        .post("http://localhost:8081/agregar-contenedor", transformedData)
        .then((res) => {
          if (res.status === 200) {
            console.log(transformedData)
            setSuccesModalShow(true);
          }
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
          setFailModalShow(true);
        });
    }
  };
  const [show, setShow] = useState(true);

  const handleContenedoresSelect = (e) => {
    setCantidadDeContenedores(e);
  };

  return (
    <>
      {succesModalShow && (
        <Modal_Succes
          show={succesModalShow}
          onHide={() => setSuccesModalShow(false)}
          numeroContendor={contenedoresAgregados}
        />
      )}
      {failModalShow && (
        <Modal_Fail
          show={failModalShow}
          onHide={() => setFailModalShow(false)}
        />
      )}
      <Form onSubmit={handleSubmit(onSubmit)} className="mt-0 overflow-y-auto">
        <Accordion defaultActiveKey="0" flush alwaysOpen>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h5> Datos de llegada </h5>
            </Accordion.Header>
            <Accordion.Body>
              <FormDatosLlegada
                errors={errors}
                register={register}
                handleContenedoresSelect={handleContenedoresSelect}
                esUpdate={esUpdate}
              />

              {!esModoVista && (
                <Alert
                  variant="danger"
                  className=""
                  show={show}
                  onClose={() => setShow(false)}
                  dismissible
                >
                  <p>
                    Los campos marcados con <strong>*</strong> son obligatorios.
                    Por favor, asegúrese de llenarlos correctamente.
                  </p>
                </Alert>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {Array.from({ length: cantidadDeContenedores }, (_, j) => (
            <Accordion.Item key={`contenedor-${j + 1}`} eventKey={`${j + 1}`}>
              <Accordion.Header>
                {" "}
                <h5> Contenedor #{j + 1}</h5>
              </Accordion.Header>
              <Accordion.Body>
                <FormDatosGenerales
                  key={`datos-generales-${j + 1}`}
                  i={j + 1}
                  listaClientes={listaClientes}
                  actualizarClientes={fetchClientes}
                  register={register}
                  errors={errors}
                  control={control}
                  Controller={Controller}
                  color={color_contenedor}
                  setValue = {setValue}
                />

                <hr />

                <FormImagenes
                  key={`imagenes-${j + 1}`}
                  i={j + 1}
                  errors={errors}
                  control={control}
                  Controller={Controller}
                  register={register}
                />
                <hr />

                <FormMovimientos
                  key={`movimientos-${j + 1}`}
                  i={j + 1}
                  listaClientes={listaClientes}
                  actualizarClientes={fetchClientes}
                  register={register}
                  errors={errors}
                  control={control}
                  Controller={Controller}
                  watch={watch}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>

        {!esModoVista && (
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
                    {esUpdate
                      ? "Actualizar Contenedores"
                      : "Registrar Contenedores"}
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
        )}
      </Form>
    </>
  );
};

const Modal_Succes = (props) => {
  return (
    <Modal {...props} centered aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.numeroContendor.length === 1
            ? "Contenedor registrado"
            : "Contenedores registrados"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.numeroContendor.map((contenedor, index) =>
          contenedor ? (
            <p key={index}>
              Contenedor #{index + 1}: {contenedor}{" "}
            </p>
          ) : null
        )}
      </Modal.Body>
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

export default NuevaLlegada;
