import React, { useEffect, useState } from "react";
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
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import Datos_llegada from "../../components/secciones_form_cnt/datos_llegada";
import Datos_contenedor from "../../components/secciones_form_cnt/datos_contenedor";
import Registro_dmg from "../../components/secciones_form_cnt/registro_dmg";
import Generar_movimiento from "../../components/secciones_form_cnt/generar_movimiento";
import "./Formulario_contenedor.css";
import {
  transformarData,
  transformarDataUpdate,
} from "../../utils/validación_contenedores";
import { addContenedor, getContenedor } from "../../api/contendoresAPI";
import { useMsal } from "@azure/msal-react";
import { useGenerarToken } from "../../api/useGenerarToken";
import Footer from "../../components/layout/Footer";
import { getOperadores } from "../../api/operadoresAPI";
import { getNombresClientes } from "../../api/clientesAPI";

function Formulario_contenedor(props) {
  const esUpdate = props.esUpdate || false;
  const id_cnt = props.id_cnt || null;
  const { obtenerHeaders } = useGenerarToken();
  const [operadores, setOperadores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [fetchedCnt, setFetchedCnt] = useState(null);
  const valoresDefault = {
    /* fecha_llegada: "2025-01-01",
    hora_llegada: "10:00",
    transportista: "CCT",
    operador: "ADAN GUADALUPE",
    numero_contenedor1: "CMAU8383723",
    eco: "T-144",
    estado1: "VACÍO",
    carga1: "GENERAL",
    peso1: "100000",
    tamano1: "Otros",
    cliente1: "Cliente 1",
    num_candado1: "1234",
    tipo_movimiento1: "Camión a piso",
    lugar_fin1: "lugar 1", */
  };

  const methods = useForm({
    defaultValues: valoresDefault,
    mode: "onChange",
  });

  useEffect(() => {
    const fetchData = async () => {
      const headers = await obtenerHeaders();
      const operadores = await getOperadores(headers);
      const clientes = await getNombresClientes(headers);

      setOperadores(operadores);
      setClientes(clientes);

      if (esUpdate) {
        const fetchedCnt = await getContenedor(id_cnt, headers);
        const newdata = transformarDataUpdate(fetchedCnt);
        setFetchedCnt(newdata);
        console.log(newdata);
        methods.reset(newdata);
      }
    };
    fetchData(); // Llamas la función
  }, []);

  const onSubmit = async (data) => {
    data = transformarData(data);
    const headers = await obtenerHeaders();
    if (esUpdate) {
    } else {
      console.log("Crear nuevo contenedor", data);
      addContenedor(data, headers);
    }
  };

  const cantidadDeContenedores = methods.watch("numero_contenedores") || 1;

  return (
    <>
      {esUpdate && <div>fasdf</div>}
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <Accordion defaultActiveKey="1" flush alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h5> Datos de llegada </h5>
              </Accordion.Header>
              <Accordion.Body>
                <Datos_llegada listaOperadores={operadores} />
              </Accordion.Body>
            </Accordion.Item>

            {Array.from({ length: cantidadDeContenedores }, (_, index) => (
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <h5> Datos del contenedor #{esUpdate ? "" : index + 1}</h5>
                </Accordion.Header>
                <Accordion.Body>
                  <Datos_contenedor
                    index={esUpdate ? null : index + 1}
                    listaClientes={clientes}
                  />
                  <hr />
                  <Registro_dmg />
                  <hr />
                  <Generar_movimiento index={esUpdate ? "" : index + 1} />
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          <Footer>
            <div>
              <Button
                variant="primary"
                type="submit"
                className="d-flex ms-auto"
                style={{
                  backgroundColor: "#162759",
                  borderColor: "#162759",
                }}
              >
                Guardar contenedor
              </Button>
            </div>
          </Footer>
        </Form>
      </FormProvider>
    </>
  );
}

export default Formulario_contenedor;
