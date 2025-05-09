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
  unidades_procesadas,
  transform_clientes,
} from "../../utils/validación_contenedores";
import { addContenedor, getContenedor } from "../../api/contendoresAPI";
import { useMsal } from "@azure/msal-react";
import { useGenerarToken } from "../../api/useGenerarToken";
import Footer from "../../components/layout/Footer";
import { getOperadores } from "../../api/operadoresAPI";
import { getUnidades, getClientes } from "../../api/graphAPI";
import { getNombresClientes } from "../../api/clientesAPI";
import { Alerta_succes } from "../../utils/tablas/Alerta_succes";

function Formulario_contenedor(props) {
  const esUpdate = props.esUpdate || false;
  const esModoVista = props.esModoVista || null;
  const { instance, accounts } = useMsal();
  const restringir = props.restringir || false;
  const id_cnt = props.id_cnt || null;
  const { obtenerHeaders } = useGenerarToken();
  const [operadores, setOperadores] = useState([]);
  const [clientes, setClientes] = useState();
  const [unidades, setUnidades] = useState([]);
  const [fetchedCnt, setFetchedCnt] = useState(null);
  const valoresDefault = {
    fecha_llegada: "2025-01-01",
    hora_llegada: "10:00",
    transportista: "CCT",
    operador: "ADAN GUADALUPE",
    numero_contenedor1: "CMAU8383723",
    eco: "T-144",
    estado1: "VACÍO",
    carga1: "GENERAL",
    peso1: "100000",
    tamano1: "Otros",
    num_candado1: "1234",
    tipo_movimiento1: "Camión a piso",
    lugar_fin1: "lugar 1",
  };

  const methods = useForm({
    defaultValues: valoresDefault,
    mode: "onChange",
    disabled: esModoVista,
  });

  useEffect(() => {
    const fetchContenedor = async () => {
      const headers = await obtenerHeaders();
      const fetchedCnt = await getContenedor(id_cnt, headers);
      const newdata = transformarDataUpdate(fetchedCnt);
      setFetchedCnt(newdata);
      console.log(newdata);
      methods.reset(newdata);
    };

    const fetchOpciones = async () => {
      const headers = await obtenerHeaders();
      const operadores = await getOperadores(headers);
      const response = await instance.acquireTokenSilent({
        scopes: ["Files.Read.All", "Sites.Read.All"],
      });


      const unidades = await getUnidades(response.accessToken);

      const clientes = await getClientes(response.accessToken);

      setUnidades(unidades_procesadas(unidades));
      setOperadores(operadores);
      setClientes(transform_clientes(clientes));
    };

    if (esUpdate || esModoVista) {
      fetchContenedor();
    }

    if (!esModoVista) {
      fetchOpciones();
    }
  }, [esUpdate, esModoVista, id_cnt]);

  const onSubmit = async (data) => {
    console.log(data);
    data = transformarData(data);
    const headers = await obtenerHeaders();
    if (esUpdate) {
    } else {
      console.log("Crear nuevo contenedor", data);
      addContenedor(data, headers);
      methods.reset();
    }
  };

  const cantidadDeContenedores = methods.watch("cantidad_contenedores") || 1;

  return (
    <>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSubmit)}>
          <Accordion defaultActiveKey="0" flush alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <h5> Datos de llegada </h5>
              </Accordion.Header>
              <Accordion.Body>
                <Datos_llegada
                  listaOperadores={operadores}
                  listaUnidades={unidades}
                />
              </Accordion.Body>
            </Accordion.Item>

            {Array.from({ length: cantidadDeContenedores }, (_, index) => (
              <Accordion.Item eventKey="1">
                <Accordion.Header>
                  <h5>
                    {" "}
                    Datos del contenedor #
                    {esUpdate || esModoVista ? "" : index + 1}
                  </h5>
                </Accordion.Header>
                <Accordion.Body>
                  <Datos_contenedor
                    index={esUpdate || esModoVista ? null : index + 1}
                    listaClientes={clientes}
                  />
                  <hr />
                  <Registro_dmg />
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
          {!esModoVista && (
            <Footer>
              <div>
                <Button
                  variant="primary"
                  type="submit"
                  className="d-flex ms-auto"
                  style={{
                    backgroundColor: "#162759",
                    borderColor: "#162759",
                  }}>
                  Guardar contenedor
                </Button>
              </div>
            </Footer>
          )}
        </Form>
      </FormProvider>
    </>
  );
}

export default Formulario_contenedor;
