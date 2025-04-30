import React, { useState } from "react";
import CampoRequerido from "../../utils/CampoRequerido";
import { reglasCnt, tipos_daños } from "../../utils/validación_contenedores";
import Multiselect from "react-widgets/Multiselect";
import { useFormContext, Controller } from "react-hook-form";
import { Form, Row, Col, Button, Image } from "react-bootstrap";
import Derecha from "../../Recursos/245_Derecha.jpg";
import Izquierda from "../../Recursos/245_Izquierda.jpg";
import Frente from "../../Recursos/245_Frente.jpg";
import Puerta from "../../Recursos/245_Puerta.jpg";
import Sello from "../../Recursos/245_Sello1.jpg";

function Registro_dmg({index}) {
  const {
    register,
    control,
    error,
    invalid,
    formState: { errors },
  } = useFormContext();

  const [images, setImages] = useState({
    Foto_frontal: Puerta,
    Foto_trasera: Frente,
    Foto_lateral_derecha: Derecha,
    Foto_lateral_izquierda: Izquierda,
    Foto_candado: Sello,
  });

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
      <Row className="pt-0">
        {Object.keys(images).map((key) => (
          <Row key={key} className="gy-2">
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
                    {CampoRequerido(key.replaceAll("_", " "))}
                    <Form.Control
                      type="file"
                      onChange={(e) => onImageChange(e, key)}
                    />
                  </Col>
                </Form.Group>

                <Col md={12}>
                  {CampoRequerido("Tipo de daño")}
                  <Controller
                    name={`dmg${key.replace("Foto", "")}${index}`}
                    control={control}
                    rules={reglasCnt.tipodmg}
                    defaultValue={["Ninguno"]}
                    render={({
                      field: { onChange, value, ...rest },
                      fieldState: { error, invalid },
                    }) => (
                      <>
                        <Multiselect
                          {...rest}
                          value={value}
                          onChange={onChange}
                          data={tipos_daños.sort()}
                          defaultValue={[]}
                        />

                        {invalid && (
                          <Form.Control.Feedback
                            type="invalid"
                            className="d-block"
                          >
                            {error?.message}
                          </Form.Control.Feedback>
                        )}
                      </>
                    )}
                  />
                </Col>

                <Form.Group>
                  <Form.Label>Observaciones</Form.Label>
                  <Form.Control
                    as="textarea"
                    {...register(`obs${key.replace("Foto", "")}${index}`, {
                      required: false,
                    })}
                  ></Form.Control>
                </Form.Group>

                {key === "Foto_candado" && (
                    <Col md={6}>
                      {CampoRequerido("Número de candado")}
                      <Form.Control
                        type="text"
                        placeholder="Número de candado"
                        {...register(`num_candado${index}`, reglasCnt.requerido)}
                        isInvalid={!!errors[`num_candado${index}`]}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors[`num_candado${index}`]?.message}
                      </Form.Control.Feedback>
                    </Col>
                )}
              </Row>
            </Col>
          </Row>
        ))}
      </Row>
    </>
  );
}

export default Registro_dmg;
