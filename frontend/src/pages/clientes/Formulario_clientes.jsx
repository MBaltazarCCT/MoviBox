import React from 'react'
import { useForm } from "react-hook-form";
import { Form, Row, Col, Button, Accordion, Navbar } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useGenerarToken } from "../../api/useGenerarToken";
import { addCliente, getCliente } from "../../api/clientesAPI.js";



function Formulario_clientes( {esUpdate} ) {

    const [tipoPersona, setTipoPersona] = useState("PF");

    const { obtenerHeaders } = useGenerarToken();

    const onSubmit = async (data) => {
      const headers = await obtenerHeaders();

      await addCliente(data, headers);
    };
    
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

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

                    <Col md={12}>
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
  )
}

export default Formulario_clientes