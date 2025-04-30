import React, { children } from "react";
import { Navbar, Col, Button, Container } from "react-bootstrap";

function Footer(props) {
  return (
    <Navbar
      bg="light"
      variant="light"
      className="sticky-bottom p-0 shadow border-top"
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100vw",
        zIndex: "1",
        height: "60px",
      }}
    >
      <Col md={2}></Col>

      <Col md={10}>
        <Container fluid>
          <div
            className="d-block justify-content-between align-items-center m-auto"
            style={{ width: "70%", maxWidth: "900px" }}
          >
            {props.children}{" "}
          </div>
        </Container>
      </Col>
    </Navbar>
  );
}

export default Footer;
