import { React, useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Accordion,
  Button,
  Modal,
  Container,
  Card,
} from "react-bootstrap";
import { Border, PersonPlus, Watch } from "react-bootstrap-icons";
import Multiselect from "react-widgets/Multiselect";
import DropdownList from "react-widgets/DropdownList";
import "react-widgets/styles.css";
import NuevoCliente from "../../Clientes/NuevoCliente";
import Derecha from "../../Recursos/245_Derecha.jpg";
import Izquierda from "../../Recursos/245_Izquierda.jpg";
import Frente from "../../Recursos/245_Frente.jpg";
import Puerta from "../../Recursos/245_Puerta.jpg";
import Sello from "../../Recursos/245_Sello1.jpg";
import Image from "react-bootstrap/Image";
import { data } from "react-router-dom";
import { set } from "react-hook-form";

const FormDatosLlegada = ({
  register,
  errors,
  handleContenedoresSelect,
  trigger,
  esUpdate,
}) => {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <>
      <Row className="gy-3 mb-3 bg-white">
        <Row className="gy-2">
          <Col md={4}>
            <Form.Group controlId="fecha_llegada">
              <Form.Label className="">
                Fecha de llegada <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                {...register("fecha_llegada", { required: true })}
                aria-invalid={errors.fechaLlegada ? "true" : "false"}
              />
              {errors.fecha_llegada?.type === "required" && (
                <p className="text-danger mb-0">Se requiere fecha llegada</p>
              )}
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="hora_llegada">
              <Form.Label>
                Hora de llegada <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="time"
                {...register("hora_llegada", { required: true })}
                aria-invalid={errors.hora_llegada ? "true" : "false"}
              />
              {errors.hora_llegada?.type === "required" && (
                <p className="text-danger mb-0">Se requiere hora de llegada</p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={4}>
            <Form.Group className="Formulario">
              <Form.Label>
                Transportista <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className="text-uppercase"
                type="text"
                placeholder="Nombre de la empresa"
                {...register("transportista", { required: true })}
                aria-invalid={errors.transportista ? "true" : "false"}
              />
              {errors.transportista?.type === "required" && (
                <p className="text-danger mb-0">Se requiere un transportista</p>
              )}
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="eco">
              <Form.Label>
                Número de económico <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                className="text-uppercase"
                type="text"
                placeholder="Número de la unidad"
                {...register("eco", { required: true })}
                aria-invalid={errors.eco ? "true" : "false"}
              />
              {errors.eco?.type === "required" && (
                <p className="text-danger mb-0">
                  Se requiere número de económico
                </p>
              )}
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="cantidad-de-contenedores">
              <Form.Label>
                Cantidad de contenedores <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                disabled={esUpdate}
                {...register("cantidad_contenedores", {
                  required: true,
                  disabled: esUpdate,
                })}
                onChange={(e) => handleContenedoresSelect(e.target.value)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </Form.Select>
              {errors.cantidad_contenedores?.type === "required" && (
                <p className="text-danger mb-0">
                  Se requiere cantidad de contenedores
                </p>
              )}
            </Form.Group>
          </Col>
        </Row>
        <hr />
        <Row>
          <Col md={8}>
            <Col md={12}>
              <Form.Group controlId="operador">
                <Form.Label>
                  Operador <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  className="text-uppercase"
                  type="text"
                  placeholder="Nombre del operador"
                  {...register("operador", { required: true })}
                  aria-invalid={errors.operador ? "true" : "false"}
                />
                {errors.operador?.type === "required" && (
                  <p className="text-danger mb-0">Se requiere un operador</p>
                )}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group controlId="identificacion">
                <Form.Label>
                  Identificación del transportista{" "}
                  <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const fileReader = new FileReader();
                      fileReader.onload = (event) => {
                        if (event.target && event.target.result) {
                          setPreviewImage(event.target.result.toString());
                        }
                      };
                      fileReader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </Form.Group>
            </Col>
          </Col>

          <Col md={4}>
            <div
              className="d-flex flex-column justify-content-center align-items-center"
              style={{ minHeight: "calc(100% - 60px)" }}
            >
              {previewImage ? (
                <div className="text-center">
                  <Image
                    src={previewImage}
                    alt="Vista previa de identificación"
                    className="img-fluid"
                    style={{ height: "180px" }}
                    rounded
                  />
                </div>
              ) : (
                <div className="d-flex justify-content-center align-items-center flex-grow-1 text-muted">
                  <p className="text-center m-0">
                    Vista previa de la identificación
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Row>
    </>
  );
};

const FormDatosGenerales = ({
  listaClientes,
  i,
  actualizarClientes,
  errors,
  register,
  Controller,
  control,
  color,
  setValue,
}) => {
  const opciones = [
    "Ninguno",
    "Húmedo",
    "Abombado",
    "Abollado",
    "Raspado",
    "Cortado",
    "Perforado",
    "Doblado",
    "Desprendido",
    "Roto",
    "Flojo",
    "Torsión",
    "Rajado",
    "Falta",
    "Oxidado",
    "Sucio",
    "Resp. Impropia",
  ];

  const coloresRGB = {
    AMARILLO: { color: "AMARILLO", rgb: "rgb(220, 220, 28)" },
    AZUL: { color: "AZUL", rgb: "rgb(16, 16, 147)" },
    BLANCO: { color: "BLANCO", rgb: "rgb(207, 206, 206)" },
    GRIS: { color: "GRIS", rgb: "rgb(128, 128, 128)" },
    NARANJA: { color: "NARANJA", rgb: "rgb(255, 165, 0)" },
    ROJO: { color: "ROJO", rgb: "rgb(179, 31, 31)" },
    ROSA: { color: "ROSA", rgb: "rgb(254, 116, 139)" },
    "VERDE CLARO": { color: "VERDE CLARO", rgb: "rgb(144, 238, 144)" },
    "VERDE OSCURO": { color: "VERDE OSCURO", rgb: "rgb(9, 63, 9)" },
  };

  const ValorLetras = {
    A: 10,
    B: 12,
    C: 13,
    D: 14,
    E: 15,
    F: 16,
    G: 17,
    H: 18,
    I: 19,
    J: 20,
    K: 21,
    L: 23,
    M: 24,
    N: 25,
    O: 26,
    P: 27,
    Q: 28,
    R: 29,
    S: 30,
    T: 31,
    U: 32,
    V: 34,
    W: 35,
    X: 36,
    Y: 37,
    Z: 38,
  };

  function validateContainerNumber(textt) {
    if (!/^[A-Z]{4}\d{6}\d{1}$/.test(textt)) {
      console.log(textt);
      return false;
    }

    let suma = 0;
    let exp = 1;

    textt
      .slice(0, -1)
      .split("")
      .forEach((char) => {
        const val = ValorLetras[char] || Number(char);
        suma += val * exp;
        exp *= 2;
      });

    let digitoVerificador = suma - Math.trunc(suma / 11) * 11;
    digitoVerificador = digitoVerificador === 10 ? 0 : digitoVerificador;

    return digitoVerificador === Number(textt.slice(-1));
  }

  const coloresRGBArray = Object.values(coloresRGB);

  console.log(coloresRGBArray);

  const [showModal, setShowModal] = useState(false);
  const tamaños = [
    "40' HC",
    "20' DC",
    "20' HC",
    "40' DC",
    "40' DC Opentop",
    "40' HC Opentop",
    "Otros",
  ];

  const tamañosArray = Object.values(tamaños);

  useEffect(() => {
    const colorEncontrado = coloresRGBArray.find((c) => c.color === color);

    if (colorEncontrado) {
      setValue(`color1`, colorEncontrado);
    }
  });

  return (
    <>
      <Row className="gy-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>
              Contenedor <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name={`numero_contenedor${i}`}
              control={control}
              rules={{
                length: {
                  value: 11,
                  message: "Mínimo 11 caracteres",
                },
                validate: (value) => {
                  return (
                    validateContainerNumber(value) ||
                    "Número de contenedor inválido"
                  );
                },
              }}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <Form.Control
                    type="text"
                    {...field}
                    placeholder="XXXX-000000-0"
                    aria-invalid={invalid ? "true" : "false"}
                  />
                  {error && <p className="text-danger">{error.message}</p>}
                </>
              )}
            />
          </Form.Group>
        </Col>

        <Col md={8}>
          <Form.Group controlId={`nomCliente${i}`}>
            <Form.Label className="d-flex align-items-center">
              Cliente <span className="text-danger"> *</span>
              <Button
                className="border-0 m-0 ms-2 p-0"
                variant="link"
                onClick={() => setShowModal(true)}
              >
                <PersonPlus className="p-0 mb-1" />
              </Button>{" "}
            </Form.Label>
            <Controller
              name={`cliente${i}`}
              control={control}
              rules={{ required: false }}
              render={({ field }) => (
                <DropdownList
                  textField="CLIENTE"
                  defaultValue={"Seleccione un cliente"}
                  data={listaClientes}
                  {...field}
                  aria-invalid={errors[`cliente${i}`] ? "true" : "false"}
                />
              )}
            />
            {errors[`cliente${i}`] && (
              <p className="text-danger">Se requiere seleccionar un cliente</p>
            )}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId={`estado${i}`}>
            <Form.Label>
              Estado <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              {...register(`estado${i}`, { required: true })}
              aria-invalid={errors[`estado${i}`] ? "true" : "false"}
            >
              <option value="">Seleccione estado</option>
              <option>VACÍO</option>
              <option>LLENO</option>
            </Form.Select>
            {errors[`estado${i}`]?.type === "required" && (
              <p className="text-danger">Se requiere seleccionar un estado</p>
            )}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId={`carga${i}`}>
            <Form.Label>
              Tipo de carga <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              {...register(`carga${i}`, { required: true })}
              aria-invalid={errors[`carga${i}`] ? "true" : "false"}
            >
              <option value="">Seleccione tipo de carga</option>
              <option value="GENERAL">GENERAL</option>
              <option value="REFRIGERADO">REFRIGERADO</option>
            </Form.Select>
            {errors[`carga${i}`]?.type === "required" && (
              <p className="text-danger">
                Se requiere seleccionar tipo de carga
              </p>
            )}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId={`color${i}`}>
            <Form.Label>
              Color <span className="text-danger">*</span>
            </Form.Label>
            <Controller
              name={`color${i}`}
              control={control}
              rules={{ required: true }}
              defaultValue={"Seleccione un color"}
              render={({ field }) => (
                <DropdownList
                  {...field}
                  data={coloresRGBArray}
                  textField="color"
                  renderValue={({ item }) => (
                    <span>
                      <strong style={{ color: item.rgb }}>&#9698;</strong>
                      {" " + item.color}
                    </span>
                  )}
                  renderListItem={({ item }) => (
                    <span>
                      <strong style={{ color: item.rgb }}>&#9698;</strong>
                      {" " + item.color}
                    </span>
                  )}
                />
              )}
            />
            {errors[`color${i}`] && (
              <p className="text-danger">Se requiere seleccionar un color</p>
            )}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId={`peso${i}`}>
            <Form.Label>
              Peso (kg) <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              {...register(`peso${i}`, { required: true })}
              aria-invalid={errors[`peso${i}`] ? "true" : "false"}
            />
            {errors[`peso${i}`]?.type === "required" && (
              <p className="text-danger">Se requiere el peso del contenedor</p>
            )}
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId={`tamano${i}`}>
            <Form.Label>
              Tamaño <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              {...register(`tamano${i}`, { required: true })}
              aria-invalid={errors[`tamano${i}`] ? "true" : "false"}
            >
              <option value="">Seleccione un tamaño</option>
              {tamañosArray.map((tamano, index) => (
                <option key={`${tamano}-${index}`} value={tamano}>
                  {tamano}
                </option>
              ))}
            </Form.Select>
            {errors[`tamano${i}`] && (
              <p className="text-danger">
                Se requiere seleccionar al menos un tamaño
              </p>
            )}
          </Form.Group>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="modalw"
      >
        <Modal.Header closeButton>
          <Modal.Title>Agregar nuevo cliente</Modal.Title>
        </Modal.Header>
        <Container className="p-5">
          <NuevoCliente
            setShowModal={setShowModal}
            AgregadoDesdeContenedor={true}
            actualizarClientes={actualizarClientes}
          />
        </Container>
      </Modal>
    </>
  );
};

const FormImagenes = ({ register, Controller, control, errors, i }) => {
  const [images, setImages] = useState({
    Foto_frontal: Puerta,
    Foto_trasera: Frente,
    Foto_lateral_derecha: Derecha,
    Foto_lateral_izquierda: Izquierda,
    Foto_candado: Sello,
  });

  let opciones = [
    "Ninguno",
    "Húmedo",
    "Abombado",
    "Abollado",
    "Raspado",
    "Cortado",
    "Perforado",
    "Doblado",
    "Desprendido",
    "Roto",
    "Flojo",
    "Torsión",
    "Rajado",
    "Falta",
    "Oxidado",
    "Sucio",
    "Resp. Impropia",
  ];

  const onImageChange = (event, key) => {
    if (event.target.files && event.target.files[0]) {
      setImages((prevImages) => ({
        ...prevImages,
        [key]: URL.createObjectURL(event.target.files[0]),
      }));
      fetch(key)
        .then(function (response) {
          return response.blob();
        })
        .then(function (blob) {});
    }
  };

  return (
    <>
      <Row>
        {Object.keys(images).map((key) => (
          <Row key={key} className="gy-3">
            <Col md={3} className="d-flex align-items-stretch">
              <div className="d-flex justify-content-center align-items-center rounded w-100">
                <Image
                  src={images[key]}
                  alt="Imagen subida"
                  rounded
                  fluid
                  className="object-fit-cover p-1"
                  style={{ height: "90%" }}
                />
              </div>
            </Col>

            <Col md={9}>
              <Row className="gy-3 mb-3">
                <Form.Group>
                  <Col md={12}>
                    <Form.Label>
                      {key.replaceAll("_", " ")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => onImageChange(e, key)}
                    />
                  </Col>
                </Form.Group>

                <Form.Group>
                  <Col md={12}>
                    <Form.Label>
                      Tipo de daño <span className="text-danger">*</span>
                    </Form.Label>
                    <Controller
                      name={`dmg${key.replace("Foto", "")}${i}`}
                      control={control}
                      defaultValue={["Ninguno"]}
                      rules={{ required: false }}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <Multiselect
                          {...rest}
                          value={value}
                          onChange={onChange}
                          data={opciones.sort()}
                        />
                      )}
                    />
                  </Col>
                </Form.Group>

                <Form.Group>
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register(`obs${key.replace("Foto", "")}${i}`, {
                      required: false,
                    })}
                  ></Form.Control>
                </Form.Group>

                {key === "Foto_candado" && (
                  <Form.Group>
                    <Col md={6}>
                      <Form.Label>
                        Candado <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Número de candado"
                        {...register(`num_candado${i}`, { required: true })}
                      />
                    </Col>
                  </Form.Group>
                )}
              </Row>
            </Col>
          </Row>
        ))}
      </Row>
    </>
  );
};

const FormMovimientos = ({ esLlegada, i, register, watch }) => {
  const movmientos = [
    "Camión a piso",
    "Camión a camión",
    "Estadías",
    "Inspección ocular",
    "Movimiento para lavado",
    "Movimiento para fumigación",
    "Movimiento para cambio de sello",
  ];

  const tipoMovimientoSeleccionado = watch(`tipo_movimiento${i}`);

  return (
    <Row className="gy-3 mb-3" style={{ padding: "20px" }}>
      <h4 className="mb-2">Movimientos </h4>
      <Col md={6}>
        <Form.Group>
          <Form.Label>
            Seleccione un movimiento <span className="text-danger">*</span>
          </Form.Label>
          <Form.Select {...register(`tipo_movimiento${i}`, { required: true })}>
            {movmientos.map((movimiento, index) => (
              <option key={`${movimiento}-${index}`} value={movimiento}>
                {movimiento}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>
      {tipoMovimientoSeleccionado === "Camión a piso" && (
        <Col md={6}>
          <Form.Group>
            <Form.Label>
              Seleccione la ubicación <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select {...register(`lugar_fin${i}`, { required: true })}>
              <option>Ubicación 1</option>
              <option>Ubicación 2</option>
            </Form.Select>
          </Form.Group>
        </Col>
      )}

      <Col md={6}>
        <Form.Group>
          <Form.Label>Instrucciones adicionales</Form.Label>
          <Form.Control
            as="textarea"
            {...register(`instrucciones_add${i}`, {
              required: false,
            })}
          ></Form.Control>
        </Form.Group>
      </Col>
    </Row>
  );
};

export { FormDatosLlegada, FormDatosGenerales, FormImagenes, FormMovimientos };
