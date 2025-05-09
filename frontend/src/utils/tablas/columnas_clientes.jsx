import Alerta_borrar from "../../utils/Alerta_borrar";

import { deleteCliente } from "../../api/clientesAPI.js";

export const columns = (obtenerHeaders, handleDelete) => [
  {
    header: "ID",
    accessorKey: "id_cliente",
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Tipo",
    accessorKey: "tipo_persona",
    cell: (props) => (
      <p className="m-0">{props.getValue() === "PF" ? "Moral" : "Física"}</p>
    ),
  },
  {
    header: "Cliente",
    accessorFn: (row) =>
      `${row.nombre}  ${row.apellido_materno} ${row.apellido_paterno} ${row.razon_social} ${row.razon_comercial}`,
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Contacto",
    accessorFn: (row) => `${row.email1} ${row.telefono}`,
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Transportista",
    accessorKey: "transportista",
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },

  {
    header: "Acción",
    accessorFn: (row) => row.id_cliente,
    cell: (props) => (
      <>
        <Alerta_borrar
          deleteCliente={deleteCliente}
          id={props.getValue()}
          token={obtenerHeaders}
          handleDelete={handleDelete}
        />


      </>
    ),
  },
];
