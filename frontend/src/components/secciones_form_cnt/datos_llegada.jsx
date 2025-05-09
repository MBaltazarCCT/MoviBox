import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Form, Row, Col, Image, Spinner } from "react-bootstrap";
import { reglasCnt } from "../../utils/validación_contenedores";
import CampoRequerido from "../../utils/CampoRequerido";
import DropdownList from "react-widgets/DropdownList";
import Combobox from "react-widgets/Combobox";
import { getFotoOperador } from "../../api/operadoresAPI";

function Datos_llegada({ listaOperadores, listaUnidades, }) {
  const {
    register,
    watch,
    control,

    formState: { errors },
  } = useFormContext();
  const foto = watch("operador"); // Cambia esto según cómo obtienes el nombre del operador
  const [isLoading, setIsLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchFoto = async () => {
      setIsLoading(true);
      if (foto) {
        const res = await getFotoOperador(foto);
        setPreviewImage(res);
      }
      setIsLoading(false);
    };
    fetchFoto();
  }, [foto]);

  return (
    <>
      <Row className="gy-3 mb-3 bg-white">
        <Row className="gy-2">
          {/* Fecha llegada */}
          <Col md={4} xs={12}>
            {CampoRequerido("Fecha de llegada")}
            <Form.Control
              type="date"
              {...register("fecha_llegada", reglasCnt.requerido)}
              isInvalid={!!errors.fecha_llegada}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fecha_llegada?.message}
            </Form.Control.Feedback>
          </Col>
          {/* Hora llegada */}
          <Col md={4} xs={12}>
            {CampoRequerido("Hora de llegada")}
            <Form.Control
              type="time"
              {...register("hora_llegada", reglasCnt.requerido)}
              isInvalid={!!errors.hora_llegada}
            />
            <Form.Control.Feedback type="invalid">
              {errors.hora_llegada?.message}
            </Form.Control.Feedback>
          </Col>

          <Col md={4} xs={12}>
            {/* Número de contenedores */}
            {CampoRequerido("Número de contenedores")}
            <Form.Select
              {...register("cantidad_contenedores", reglasCnt.requerido)}
              isInvalid={!!errors.numero_contenedores}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.cantidad_contenedores?.message}
            </Form.Control.Feedback>
          </Col>
        </Row>

        <hr />

        <Col md={8}>
          <Row className="gy-2 pt-0">
            <Col md={6} xs={12}>
              {/* Transportista */}
              {CampoRequerido("Transportista")}
              <Form.Control
                type="text"
                {...register("transportista", reglasCnt.requerido)}
                isInvalid={!!errors.transportista}
              />
              <Form.Control.Feedback type="invalid">
                {errors.transportista?.message}
              </Form.Control.Feedback>
            </Col>

            <Col md={6} xs={12}>
              {/* Número de ecónomico */}
              {CampoRequerido("Número económico")}
              <Controller
                name={"unidad_llegada"}
                control={control}
                rules={reglasCnt.requerido}
                render={({ field }) => (
                  <Combobox
                    busy={!listaUnidades || listaUnidades.length === 0}
                    defaultValue={"Seleccione una unidad"}
                    data={listaUnidades}
                    {...field}
                    aria-invalid={errors[`unidad_llegada`] ? "true" : "false"}
                  />
                )}
              />
            </Col>

            <Col md={12} xs={12}>
              {/* Nombre del conductor */}
              {CampoRequerido("Nombre del conductor")}
              <Controller
                name={"operador"}
                control={control}
                rules={reglasCnt.requerido}
                render={({ field }) => (
                  <Combobox
                    textField="name"
                    defaultValue={"Seleccione un operador"}
                    busy={!listaOperadores || listaOperadores.length === 0}
                    data={listaOperadores}
                    {...field}
                    aria-invalid={errors[`operador`] ? "true" : "false"}
                  />
                )}
              />
            </Col>
          </Row>
        </Col>
        <Col md={4} className="border rounded">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <Form.Label>Foto del operador</Form.Label>
            {previewImage ? (
              <div className="text-center" style={{ height: "128px" }}>
                {isLoading ? (
                  <Spinner
                    animation="border"
                    role="status"
                    className="text-primary">
                    <span className="visually-hidden">Cargando...</span>
                  </Spinner>
                ) : (
                  <Image
                    src={`data:image/jpeg;base64,${previewImage}`}
                    alt="Vista previa de identificación"
                    className="img-fluid border"
                    style={{ maxHeight: "100px" }}
                    rounded
                  />
                )}
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
    </>
  );
}

export default Datos_llegada;
