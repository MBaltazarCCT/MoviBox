import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Trash, Pencil, Filter, Eye, ArrowRight, TextWrap } from "react-bootstrap-icons";
import { Button, Modal, Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import Tabla from "../Complementos/Tabla";
import { format, parseISO, isAfter, isBefore } from "date-fns";

function ListadoMovimientos() {
  const [contenedores, setContenedores] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalDetalles, setShowModalDetalles] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fetchContenedores = () => {
    axios
      .get("http://localhost:8081/movimientos")
      .then((res) => setContenedores(res.data))

      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchContenedores();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(
        "http://localhost:8081/eliminar-movimiento/" + selectedId
      );
      fetchContenedores();
      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleActualizarMovimiento = async () => {
    const data = {
      id_movimiento: selectedId,
      id_contenedor: contenedores.find((c) => c.id_movimiento === selectedId)
        ?.id_contenedor,
      lugar_fin: contenedores.find((c) => c.id_movimiento === selectedId)?.lugar_fin,
      estatus: "Cerrado",
      fecha_realizado: format(new Date(), "yyyy-MM-dd"),
      hora_realizado: format(new Date(), "HH:mm:ss"),
      duracion: "0",
    };

    try {
      await axios.put(
        `http://localhost:8081/actualizar-movimiento/${selectedId}`,
        data
      );
      fetchContenedores();
      setShowModalDetalles(false);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      header: "ID",
      accessorKey: "id_movimiento",
      size: 50,

      meta: { filterVariant: "number" },
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Contenedor",
      accessorKey: "numero_contenedor",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Movimiento",
      accessorKey: "tipo_movimiento",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Origen",
      accessorKey: "lugar_origen",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Destino",
      accessorKey: "lugar_fin",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Estatus",
      accessorKey: "estatus",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      header: "Acción",
      accessorKey: "id_movimiento",
      cell: (props) => (
        <p className="text-nowrap">
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
            to={`/eliminar-movimiento/${props.getValue()}`}
            className="p-0 ms-4 border-0"
          >
            <Pencil />
          </Link>

          <Button
            variant="link"
            className="p-0 ms-4 border-0 text-success"
            onClick={() => {
              setSelectedId(props.getValue());
              setShowModalDetalles(true);
            }}
          >
            <Eye />
          </Button>
        </p>
      ),
    },
  ];

  return (
    <>
      <Tabla columns={columns} data={contenedores} idfilter={"id_movimiento"} />

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
        show={showModalDetalles}
        onHide={() => setShowModalDetalles(false)}
        size="xl"
        fullscreen="xl-down"
      >
        <Modal.Header
          data-bs-theme="dark"
          closeButton
          className="text-white"
          style={{ backgroundColor: "#162759" }}
        >
          <Modal.Title>Detalles del movimiento</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.5rem" }}>
          <Container>
            <Row>
              <Col md={3} className="border-end border-3">
                <strong>Contenedor:</strong>
                <p className="text-primary-subtle bg-dark-subtle p-1">
                  {
                    contenedores.find((c) => c.id_movimiento === selectedId)
                      ?.numero_contenedor
                  }
                </p>

                <strong>Color:</strong>
                <p className="text-primary-subtle bg-dark-subtle p-1">
                  {
                    contenedores.find((c) => c.id_movimiento === selectedId)
                      ?.color
                  }
                </p>

                <strong>Tamaño:</strong>
                <p className="text-primary-subtle bg-dark-subtle  p-1">
                  {
                    contenedores.find((c) => c.id_movimiento === selectedId)
                      ?.tamano
                  }
                </p>

                <strong>Peso:</strong>
                <p className="text-primary-subtle bg-dark-subtle  p-1">
                  {
                    contenedores.find((c) => c.id_movimiento === selectedId)
                      ?.peso
                  }
                </p>
              </Col>

              <Col md={9}>
                <Row className="ms-3">
                  <strong className="p-0">Movimiento:</strong>
                  <p className="text-primary-subtle bg-dark-subtle p-1">
                    {
                      contenedores.find((c) => c.id_movimiento === selectedId)
                        ?.tipo_movimiento
                    }
                  </p>
                </Row>
                <Row className="ms-3">
                  <Col md={5} className="p-0">
                    <strong className="p-0">Origen:</strong>
                    <p className="text-white fw-bolder bg-primary p-1">
                      {
                        contenedores.find((c) => c.id_movimiento === selectedId)
                          ?.lugar_origen
                      }
                    </p>
                  </Col>
                  <Col
                    md={2}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <p className="text-center">
                      <ArrowRight style={{ fontSize: 50, color: "#162759" }} />
                    </p>
                  </Col>

                  <Col md={5} className="p-0">
                    <strong className="col-6">Destino:</strong>
                    <p className="text-white fw-bolder bg-primary p-1">
                      {
                        contenedores.find((c) => c.id_movimiento === selectedId)
                          ?.lugar_fin
                      }
                    </p>
                  </Col>
                  <hr />

                  <Col md={12} className="p-0">
                    Comentarios:
                    <p
                      style={{ fontSize: "1.2rem" }}
                    >
                      {
                        contenedores.find((c) => c.id_movimiento === selectedId)
                          ?.instrucciones_add
                      }
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {contenedores.find((c) => c.id_movimiento === selectedId)?.estatus ===
            "Pendiente" && (
            <Button variant="danger" onClick={handleActualizarMovimiento}>
              Terminar movimiento
            </Button>
          )}

          <Button
            variant="secondary"
            onClick={() => setShowModalDetalles(false)}
          >
            Ocultar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ListadoMovimientos;
