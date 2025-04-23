import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Trash, Pencil, Eye, } from "react-bootstrap-icons";
import { Button, Modal, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Filters from "./Filters";
import Tabla from "../Complementos/Tabla";
import NuevoCliente from "./NuevoCliente";

function ListadoClientes() {
  const [cliente, setCliente] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showCliente, setShowCliente] = useState(false);
  const [editCliente, setEditCliente] = useState(false);

  const fetchClientes = () => {
    axios
      .get("http://localhost:8081/clientes")
      .then((res) => setCliente(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        "http://localhost:8081/eliminar-cliente/" + selectedId
      );
      console.log(selectedId);
      fetchClientes();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
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
          <Button
            variant="link"
            className="p-0 border-0 text-danger"
            onClick={() => {
              setSelectedId(props.getValue());
              setShowModal(true);
            }}
          >
            <Trash size={20} />
          </Button>

          <Link
            variant="link"
            onClick={() => {
              setSelectedId(props.getValue());
              setEditCliente(true);
            }}
            className="= p-0 ms-4 border-0 "
          >
            <Pencil />
          </Link>

          <Link
            variant="link"
            onClick={() => {
              setSelectedId(props.getValue());
              setShowCliente(true);
            }}
            className="p-0 ms-4 border-0 text-success"
          >
            <Eye />
          </Link>
        </>
      ),
    },
  ];



  return (
    <>
      {/* show clientes data */}
      <Tabla columns={columns} data={cliente} idfilter={"id_cliente"} />

      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>¡ALTO!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>¿Estás seguro de que deseas eliminar este cliente?</h4>
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
        show={showCliente}
        onHide={() => setShowCliente(false)}
        size="lg"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NuevoCliente esModoVista={true} id={selectedId} />
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={editCliente}
        onHide={() => setEditCliente(false)}
        size="lg"
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <NuevoCliente esModoVista={false} esUpdate={true} id={selectedId} />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ListadoClientes;
