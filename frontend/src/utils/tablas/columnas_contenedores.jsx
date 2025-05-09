import Alerta_borrar from "../../utils/Alerta_borrar";
import Boton_ver from "../Boton_ver.jsx";
import Formulario_contenedor from "../../pages/contenedores/Formulario_contenedor.jsx";
import { deleteCliente } from "../../api/clientesAPI.js";
import { format, parseISO, isAfter, isBefore } from "date-fns";




export const columns = (obtenerHeaders, handleDelete) => [
  {
    header: "ID",
    accessorKey: "id_contenedor",

    meta: { filterVariant: "number" },
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Contenedor",
    accessorKey: "numero_contenedor",
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Cliente",
    accessorKey: "cliente",
    cell: (props) => <p className="m-0 text-nowrap">{props.getValue()}</p>,
  },
  {
    header: "Llegada",
    accessorFn: (row) => row.fecha_llegada, // Mantenemos fechaLlegada como valor accesible para filtros
    id: "llegada", // Identificador único para la columna
    meta: { filterVariant: "fecha" },
    cell: (props) => {
      const row = props.row.original;
      return (
        <div>
          <p className="m-0">
            {format(new Date(row.fecha_llegada), "dd-MM-yy")}
          </p>
          <p className="m-0 text-muted">
            {row.hora_llegada.split("T")[1].split(":").slice(0, 2).join(":")}
          </p>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length < 2) return true;

      const fecha = parseISO(row.original.fecha_llegada);
      const desde = filterValue[0] ? parseISO(filterValue[0]) : null;
      const hasta = filterValue[1] ? parseISO(filterValue[1]) : null;

      return (
        (!desde || isAfter(fecha, desde)) && (!hasta || isBefore(fecha, hasta))
      );
    },
  },
  {
    header: "Estado",
    accessorKey: "estado",
    cell: (props) => <p className="m-0 text-nowrap">{props.getValue()}</p>,
  },
  {
    header: "Tamaño",
    accessorKey: "tamano",
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Ubicación",
    accessorKey: "ubicacion",
    cell: (props) => <p className="m-0">{props.getValue()}</p>,
  },
  {
    header: "Acción",
    accessorFn: (row) => row.id_contenedor,
    cell: (props) => (
      <div className="d-inline-flex">
        <Alerta_borrar
          deleteCliente={deleteCliente}
          id={props.getValue()}
          token={obtenerHeaders}
          handleDelete={handleDelete}
        />
        <Boton_ver
          formulario={
            <Formulario_contenedor
              esModoVista={true}
              id_cnt={props.getValue()}
            />
          }
        />
      </div>
    ),
  },
];