import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Form, Row, Col, Button } from "react-bootstrap";
import {
  reglasCnt,
  validateContainerNumber,
  coloresRGBArray,
} from "../../utils/validación_contenedores";
import CampoRequerido from "../../utils/CampoRequerido";
import { DropdownList, Combobox } from "react-widgets";

import { PersonPlus } from "react-bootstrap-icons";

function Datos_contenedor(
  { index, listaClientes } // Se puede usar para identificar el contenedor en caso de múltiples contenedores
) {
  index = index || ""; // Default to 0 if no index is provided
  const {
    register,
    control,
    resetField,
    watch,
    formState: { errors },
  } = useFormContext();

  const lista_clientes = listaClientes ? listaClientes.clientes_base : false;
  const cliente_seleccionado = listaClientes ? watch(`cliente${index}`) : [];
  const lista_sublciente = listaClientes
    ? listaClientes[cliente_seleccionado]
    : [];

  return (
    <>
      <Row className="gy-3">
        <Col md={6}>
          {/* Cliente */}
          <Form.Group>
            <Form.Label className="d-flex align-items-center">
              Cliente <span className="text-danger"> *</span>
            </Form.Label>
            <Controller
              name={`cliente${index}`}
              control={control}
              rules={reglasCnt.requerido}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <Combobox
                    {...field}
                    data={lista_clientes || []}
                    busy={!lista_clientes}
                    defaultValue={"Seleccione un cliente"}
                    onChange={(val) => {
                      field.onChange(val);
                      resetField(`sub_cliente${index}`, {
                        defaultValue: "Seleccione un subcliente",
                      });
                    }}
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
          {/* subCliente */}
          <Form.Group>
            <Form.Label className="d-flex align-items-center">
              Sub cliente <span className="text-danger"> *</span>
            </Form.Label>
            <Controller
              name={`sub_cliente${index}`}
              control={control}
              rules={reglasCnt.requerido}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <Combobox
                    {...field}
                    busy={!lista_clientes}
                    data={lista_sublciente}
                    defaultValue="Seleccione un subcliente"
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

        <Col md={4}>
          {CampoRequerido("Número de contenedor")}
          <Controller
            name={`numero_contenedor${index}`}
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
                />
                <Form.Control.Feedback type="invalid">
                  {error?.message}
                </Form.Control.Feedback>
                {error && <p className="text-danger">{error.message}</p>}
              </>
            )}
          />
        </Col>

        <Col md={4}>
          <Form.Group>
            {CampoRequerido("Estado del contenedor")}
            <Controller
              name={`estado${index}`}
              control={control}
              rules={reglasCnt.requerido}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <DropdownList
                    {...field}
                    data={["VACÍO", "LLENO"]}
                    defaultValue="Seleccione un estado"
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

        <Col md={4}>
          <Form.Group>
            {CampoRequerido("Tipo de carga")}
            <Controller
              name={`carga${index}`}
              control={control}
              rules={reglasCnt.requerido}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <DropdownList
                    {...field}
                    data={["GENERAL", "REFRIGERADO"]}
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

        <Col md={4}>
          <Form.Group>
            {CampoRequerido("Color")}
            <Controller
              name={`color${index}`}
              control={control}
              rules={reglasCnt.requerido}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <DropdownList
                    {...field}
                    data={coloresRGBArray}
                    defaultValue="Seleccione un color"
                    textField={"color"}
                    dataKey={"color"}
                    valueField={"color"}
                    renderListItem={({ item }) => (
                      <span>
                        <strong style={{ color: item.rgb }}>&#9698;</strong>
                        {" " + item.color}
                      </span>
                    )}
                    renderValue={({ item }) =>
                      item === "Seleccione un color" ? (
                        <span>Seleccione un color</span>
                      ) : (
                        <span>
                          <strong style={{ color: item.rgb }}>&#9698;</strong>
                          {" " + item.color}
                        </span>
                      )
                    }
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

        <Col md={4}>
          <Form.Group>
            {CampoRequerido("Tamaño del contenedor")}
            <Controller
              name={`tamano${index}`}
              control={control}
              rules={reglasCnt.requerido}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <DropdownList
                    {...field}
                    data={[
                      "40' HC",
                      "20' DC",
                      "20' HC",
                      "40' DC",
                      "40' DC Opentop",
                      "40' HC Opentop",
                      "Otros",
                    ]}
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

        <Col md={4}>
          <Form.Group>
            {CampoRequerido("Peso del contenedor")}
            <Controller
              name={`peso${index}`}
              control={control}
              rules={reglasCnt.requerido}
              render={({ field, fieldState: { error, invalid } }) => (
                <>
                  <Form.Control
                    type="number"
                    {...field}
                    placeholder="Peso en kg"
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
      </Row>
    </>
  );
}

export default Datos_contenedor;
