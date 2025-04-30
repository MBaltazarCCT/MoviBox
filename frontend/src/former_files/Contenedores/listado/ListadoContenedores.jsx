import React, { useEffect, useState } from "react";
import { Table, Navbar, Col } from "react-bootstrap";
import axios from "axios";
import { Trash, Pencil, Filter, Eye } from "react-bootstrap-icons";
import { Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  globalFilterFn,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  onGlobalFilterChange,
  fuzzyFilter,
} from "@tanstack/react-table";
import Filters from "../../../Complementos/Filters";
import { format, parseISO, isAfter, isBefore } from "date-fns";
import NuevaLlegada from "../formulario/NuevaLlegada";
import "./listaStyles.css";
import Tabla from "../../../Complementos/Tabla";
import Formulario_contenedor from "../../../pages/contenedores/Formulario_contenedor";

function ListadoContenedores() {
  const [contenedores, setContenedores] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showContenedor, setShowContenedor] = useState(false);
  const [editContenedor, setEditContenedor] = useState(false);
  const [editadoCorrectamente, setEditadoCorrectamente] = useState(false);

  const handleEditadoCorrectamente = (e) => {
    setEditadoCorrectamente(e);
    setEditContenedor(!e);
  };

  const [globalFilter, setGlobalFilter] = useState("");

  const fetchContenedores = () => {
    axios
      .get("http://localhost:8081/contenedores")
      .then((res) => setContenedores(res.data))
      .catch((err) => console.log(err));
  };
  console.log(contenedores);
  useEffect(() => {
    fetchContenedores();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        "http://localhost:8081/eliminar-contenedor/" + selectedId
      );
      fetchContenedores();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
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
          (!desde || isAfter(fecha, desde)) &&
          (!hasta || isBefore(fecha, hasta))
        );
      },
    },
    {
      header: "Carga",
      accessorFn: (row) => row.estado, // Mantenemos estado + carga como valor accesible para filtros
      meta: { filterVariant: "select" },
      cell: (props) => {
        const row = props.row.original;
        return (
          <p className="m-0">
            {row.estado} {row.carga}
          </p>
        );
      },
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
        <>
          <Button
            variant="link"
            className="p-0 border-0 text-danger"
            onClick={() => {
              setSelectedId(props.getValue());
              console.log(selectedId);
              setShowModal(true);
            }}
          >
            <Trash size={20} />
          </Button>

          <Link
            variant="link"
            onClick={() => {
              setSelectedId(props.getValue());
              setEditContenedor(true);
            }}
            className="p-0 ms-4 border-0"
          >
            <Pencil />
          </Link>

          <Button
            variant="link"
            onClick={() => {
              setSelectedId(props.getValue());
              setShowContenedor(true);
            }}
            className="p-0 ms-4 border-0 text-success"
          >
            <Eye />
          </Button>
        </>
      ),
    },
  ];

  const table = useReactTable({
    columns,
    data: contenedores,
    state: { columnFilters, globalFilter },

    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 15, //custom default page size
      },
      sorting: [
        {
          id: "id_contenedor",
          desc: true,
        },
      ],
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client-side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(), // client-side faceting
    getFacetedUniqueValues: getFacetedUniqueValues(), // generate unique values for select filter/autocomplete
    getFacetedMinMaxValues: getFacetedMinMaxValues(), // generate min/max values for range filter
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <>
      <Tabla columns={columns} data={contenedores} idfilter={"id_contenedor"} />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡ALTO!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>¿Estás seguro de que deseas eliminar este contenedor?</h4>
          <p>Esta acción no se puede deshacer.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        centered
        show={showContenedor}
        onHide={() => setShowContenedor(false)}
        size="lg"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Contenedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NuevaLlegada view={true} id={selectedId} />
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={editContenedor}
        onHide={() => setEditContenedor(false)}
        className="cufsdf"
        size="lg"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Contenedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formulario_contenedor esUpdate={true} id_cnt={selectedId} />
        </Modal.Body>
      </Modal>

      <Modal
        centered
        onHide={() => setEditadoCorrectamente(false)}
        size="sm"
        show={editadoCorrectamente}
      >
        <Modal.Header closeButton>
          <Modal.Title>Acutalizado correctamente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Los datos del contenedor han sido actualizados correctamente.
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListadoContenedores;
