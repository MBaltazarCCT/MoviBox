import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Trash } from "react-bootstrap-icons";
import { Button } from "react-bootstrap";
import "./AlertasSytles.css";

function Alerta_borrar(props) {
    const id = props.id;
    const handleDelete = props.handleDelete;
    const deleteCliente = props.deleteCliente;
    const token = props.token

  const showSwal = () => {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      title: <strong>¿Estás seguro?</strong>,
      html: <i>Esta acción no se puede deshacer {id} </i>,
      icon: "warning",
      showCancelButton: true,
      scrollbarPadding: false,
      confirmButtonText: "Si, borrar",
      cancelButtonText: "No, cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCliente();
        handleDelete();

        MySwal.fire("Borrado!", "El elemento ha sido borrado.", "success");
      }
    });
  };

  return (
    <div>
      <button className="btn text-danger" onClick={showSwal}>
        <Trash size={20} className="boton_eliminar" />
      </button>
    </div>
  );
}

export default Alerta_borrar;
