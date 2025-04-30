import React, { useState } from "react";
import { Table, Navbar, Col, Placeholder, } from "react-bootstrap";

import { Button, Modal, Form } from "react-bootstrap";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,

} from "@tanstack/react-table";
import Filtros from "./Filtros";
import "./listaStyles.css";

function Tabla(props) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [showContenedor, setShowContenedor] = useState(false);
  const [editContenedor, setEditContenedor] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const columns = props.columns;


  const table = useReactTable({
    columns,
    data: props.data,
    state: { columnFilters, globalFilter },

    initialState: {
      pagination: {
        pageIndex: 0, //custom initial page index
        pageSize: 15, //custom default page size
      },
      sorting: [
        {
          id: props.idfilter,
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
      <div className="col-4 pb-3 ps-0">
        <Form.Control
          type="text"
          size="sm"
          value={globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(String(e.target.value))}
          className="p-2 font-lg shadow border border-block fit-content"
          placeholder="Búscar en tabla..."
        />
      </div>

      <Table hover striped size="sm" style={{ overflowY: "scroll" }}>
        <thead style={{ fontSize: "0.9rem", textWrapMode: "nowrap" }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: `${header.getSize()}px` }}>
                  {header.column.getCanFilter() ? (
                    <div>
                      <Filtros column={header.column} />
                    </div>
                  ) : (
                    header.column.columnDef.header
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody style={{ fontSize: "0.8rem" }}>

          {table.getRowModel().rows.length === 0 && (
            
            Array.from({ length: 10 }, () => (
              <tr key={Math.random()} className="m-0 p-0">
                {table.getAllColumns().map((column) => (
                  <td key={column.id} className="m-0 p-0">
                    <Placeholder as="p" animation="glow" >
                      <Placeholder style={{width: "80%"}}/>
                    </Placeholder>
                  </td>
                ))}
              </tr>
            ))

          
          )}
          {table.getRowModel().rows.length > 0 &&
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="m-0 p-0">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="m-0">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}

        </tbody>
      </Table>

      <Navbar
        bg="light"
        variant="light"
        expand="md"
        className="sticky-bottom flex-md-nowrap p-0 shadow border-top"
        style={{
          position: "fixed",
          bottom: "0",
          width: "100%",
          left: "0",
          zIndex: "1",
          height: "60px",
        }}
      >
        <Col md={2}></Col>

        <Col md={10}>
          <div
            className="d-flex flex-column justify-content-center m-auto"
            style={{ width: "70%", maxWidth: "900px" }}
          >
            <div className="d-flex justify-content-center">
              <Button
                onClick={() => table.firstPage()}
                disabled={!table.getCanPreviousPage()}
                variant="text"
                className="border-0"
              >
                {"<<"}
              </Button>
              <Button
                variant="text"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-0"
              >
                <strong>{"<"}</strong>
              </Button>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                variant="text"
                className="border-0"
              >
                {">"}
              </Button>
              <Button
                onClick={() => table.lastPage()}
                disabled={!table.getCanNextPage()}
                variant="text"
                className="border-0"
              >
                {">>"}
              </Button>
            </div>

            <div className="d-flex justify-content-center">
              <span>
                Página{" "}
                <strong className="me-3">
                  {table.getState().pagination.pageIndex + 1} de{" "}
                  {table.getPageCount()}{" "}
                </strong>
                {table.getRowModel().rows.length.toLocaleString()} de{" "}
                {table.getRowCount().toLocaleString()} contenedores
              </span>
            </div>
          </div>
        </Col>
      </Navbar>



      <Modal
        centered
        show={showContenedor}
        onHide={() => setShowContenedor(false)}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contenedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
      </Modal>

      <Modal
        centered
        show={editContenedor}
        onHide={() => setEditContenedor(false)}
        className="cufsdf"
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Contenedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Tabla;
