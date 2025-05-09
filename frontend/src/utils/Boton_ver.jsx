import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";

function Boton_ver(props) {
  const [showModal, setShowModal] = useState(false);
  const formulario = props.formulario
  return (
    <>
      <button className="btn text-success" onClick={() => setShowModal(true)}>
        <Eye size={20} />
      </button>

      <Modal_form showModal={showModal} setShowModal={setShowModal} formulario={formulario} />
    </>
  );
}

function Modal_form({ showModal, setShowModal, formulario }) {
  return (
    <Modal centered show={showModal} onHide={() => setShowModal(false)} size="lg">
      <Modal.Body>
        {formulario}
      </Modal.Body>

    </Modal>
  );
}

export default Boton_ver;
