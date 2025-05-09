import React, { useState } from "react";
import CampoRequerido from "../../utils/CampoRequerido";
import { reglasCnt, tipos_daños } from "../../utils/validación_contenedores";
import DropdownList from "react-widgets/DropdownList";
import { useFormContext, Controller } from "react-hook-form";
import { Form, Row, Col, Button, Image } from "react-bootstrap";

function Generar_movimiento({ index }) {
  const {
    register,
    control,
    error,
    invalid,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <Row className="pt-0">
        <Row className="gy-2">
          <Col md={6}>
            <Form.Group>
              {CampoRequerido("Seleccione un movimiento")}
              <Controller
                name={`tipo_movimiento${index}`}
                control={control}
                rules={reglasCnt.requerido}
                render={({ field, fieldState: { error, invalid } }) => (
                  <>
                    <DropdownList
                      {...field}
                      data={[
                        "Camión a piso",
                        "Camión a camión",
                        "Movimiento para lavado",
                        "Movimiento para fumigación",
                        "Movimiento para cambio de sello",
                      ].sort()}
                      defaultValue="Seleccione carga"
                    />
                    <Form.Control.Feedback type="invalid">
                      {error?.message}
                    </Form.Control.Feedback>
                    {error && <p className="text-danger">{error.message}</p>}
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              {CampoRequerido("Seleccione un destino")}
              <Controller
                name={`lugar_fin${index}`}
                control={control}
                rules={reglasCnt.requerido}
                render={({ field, fieldState: { error, invalid } }) => (
                  <>
                    <DropdownList
                      {...field}
                      data={["lugar 1", "lugar 2", "lugar 3"]}
                      defaultValue="Seleccione un destino"
                    />
                    <Form.Control.Feedback type="invalid">
                      {error?.message}
                    </Form.Control.Feedback>
                    {error && <p className="text-danger">{error.message}</p>}
                  </>
                )}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Instrucciones adicionales</Form.Label>
              <Form.Control
                as="textarea"
                {...register(`instrucciones_add${index}`, {
                  required: false,
                })}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
      </Row>
    </>
  );
}

export default Generar_movimiento;
