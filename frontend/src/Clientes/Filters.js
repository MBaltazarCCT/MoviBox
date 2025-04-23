import React from 'react'
import { InputGroup, Form, Row, Col } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";

function Filters({setColumnFilters, columnFilters}) {
    const clienteName =
      columnFilters.find((f) => f.id === "nombre_completo")?.value || "";

    const onFilterChange = (id, value) => {
      setColumnFilters((prev) =>
        prev.filter((f) => f.id !== id).concat({ id, value })
      );
    };


  return (
    <Row className='mt-3'>
      <Col md={5}>
        <InputGroup whith="50%">
          <InputGroup.Text id="basic-addon1">
            <Search />
          </InputGroup.Text>
          <Form.Control
            type="text"
            variant="filled"
            placeholder="Buscar cliente"
            borderRadius={5}
            value={clienteName}
            onChange={(e) => onFilterChange("nombre_completo", e.target.value)}
          />
        </InputGroup>
      </Col>
    </Row>
  );
}

export default Filters