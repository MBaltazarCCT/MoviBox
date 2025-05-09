import React, { useEffect, useState } from "react";
import Tabla from "../../components/estructura_tabla/Tabla";
import { getClientes } from "../../api/clientesAPI.js";
import { useGenerarToken } from "../../api/useGenerarToken";
import { columns } from "../../utils/tablas/columnas_clientes.jsx";

function Tabla_clientes() {
  const [clientes, setClientes] = useState([]);
  const [onDeleteSuccess, setOnDeleteSuccess] = useState(false);
  const { obtenerHeaders } = useGenerarToken();

  const fetchData = async () => {
    const headers = await obtenerHeaders();
    const clientes = await getClientes(headers);
    setClientes(clientes);
    setOnDeleteSuccess(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const recargarDatos = async () => {
    await fetchData();
  };

  return (
    <>
      <Tabla
        data={clientes}
        columns={columns(obtenerHeaders, recargarDatos)}
        idfilter={"id_cliente"}
      />
    </>
  );
}

export default Tabla_clientes;
