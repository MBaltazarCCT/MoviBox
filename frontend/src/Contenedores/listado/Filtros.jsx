import React, { useState, useRef } from "react";
import { Overlay, Popover, Form, Button, InputGroup } from "react-bootstrap";
import { Funnel, FunnelFill, X } from "react-bootstrap-icons";
import { format, parseISO, isAfter, isBefore } from "date-fns";

// Component for filter header with popover
const FilterHeader = ({ column, table }) => {
  const [showFilter, setShowFilter] = useState(false);
  const headerRef = useRef(null);
  const columnFilters = table.getState().columnFilters;
  const isFiltered = columnFilters.some((filter) => filter.id === column.id);

  return (
    <div ref={headerRef} className="d-flex align-items-center">
      <span>{column.columnDef.header}</span>
      <Button
        variant="link"
        className="p-0 ms-2 border-0"
        onClick={(e) => {
          e.stopPropagation();
          setShowFilter(!showFilter);
        }}
      >
        {isFiltered ? <FunnelFill size={12} /> : <Funnel size={12} />}
      </Button>

      <Overlay
        target={headerRef.current}
        show={showFilter}
        placement="bottom"
        rootClose
        onHide={() => setShowFilter(false)}
      >
        <Popover style={{ minWidth: "250px" }}>
          <Popover.Header
            as="h3"
            className="d-flex justify-content-between align-items-center"
          >
            Filtrar {column.columnDef.header}
            <Button
              variant="link"
              className="p-0"
              onClick={() => setShowFilter(false)}
            >
              <X size={20} />
            </Button>
          </Popover.Header>
          <Popover.Body>
            <ColumnFilterContent
              column={column}
              table={table}
              onClose={() => setShowFilter(false)}
            />
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
};

// Filter content for different column types
const ColumnFilterContent = ({ column, table, onClose }) => {
  const columnFilters = table.getState().columnFilters;
  const currentFilter = columnFilters.find((filter) => filter.id === column.id);

  // Handle different filter types based on column ID
  const renderFilterUI = () => {
    const columnId = column.id;

    // Date range filter for llegada column
    if (columnId === "llegada") {
      const [desde, hasta] = currentFilter?.value || ["", ""];

      return (
        <DateRangeFilter
          column={column}
          table={table}
          initialValues={[desde, hasta]}
          onClose={onClose}
        />
      );
    }

    // Dropdown filter for estatus column
    if (columnId === "estatus") {
      return (
        <SelectFilter
          column={column}
          table={table}
          options={["En patio", "Salida"]}
          initialValue={currentFilter?.value || ""}
          onClose={onClose}
        />
      );
    }

    // Text filter for other columns
    return (
      <TextFilter
        column={column}
        table={table}
        initialValue={currentFilter?.value || ""}
        onClose={onClose}
      />
    );
  };

  return renderFilterUI();
};

// Date range filter component
const DateRangeFilter = ({ column, table, initialValues, onClose }) => {
  const [dateRange, setDateRange] = useState(initialValues);

  const applyFilter = () => {
    if (dateRange[0] || dateRange[1]) {
      table.getColumn(column.id).setFilterValue(dateRange);
    } else {
      table.getColumn(column.id).setFilterValue(undefined);
    }
    onClose();
  };

  const clearFilter = () => {
    table.getColumn(column.id).setFilterValue(undefined);
    onClose();
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Desde:</Form.Label>
        <Form.Control
          type="date"
          value={dateRange[0]}
          onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Hasta:</Form.Label>
        <Form.Control
          type="date"
          value={dateRange[1]}
          onChange={(e) => setDateRange([dateRange[0], e.target.value])}
        />
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button variant="secondary" size="sm" onClick={clearFilter}>
          Limpiar
        </Button>
        <Button variant="primary" size="sm" onClick={applyFilter}>
          Aplicar
        </Button>
      </div>
    </Form>
  );
};

// Select dropdown filter component
const SelectFilter = ({ column, table, options, initialValue, onClose }) => {
  const [value, setValue] = useState(initialValue);

  const applyFilter = () => {
    if (value) {
      table.getColumn(column.id).setFilterValue(value);
    } else {
      table.getColumn(column.id).setFilterValue(undefined);
    }
    onClose();
  };

  const clearFilter = () => {
    table.getColumn(column.id).setFilterValue(undefined);
    onClose();
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Select value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">Todos</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button variant="secondary" size="sm" onClick={clearFilter}>
          Limpiar
        </Button>
        <Button variant="primary" size="sm" onClick={applyFilter}>
          Aplicar
        </Button>
      </div>
    </Form>
  );
};

// Text filter component
const TextFilter = ({ column, table, initialValue, onClose }) => {
  const [value, setValue] = useState(initialValue);

  const applyFilter = () => {
    if (value) {
      table.getColumn(column.id).setFilterValue(value);
    } else {
      table.getColumn(column.id).setFilterValue(undefined);
    }
    onClose();
  };

  const clearFilter = () => {
    table.getColumn(column.id).setFilterValue(undefined);
    onClose();
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder={`Buscar ${column.columnDef.header}...`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button variant="secondary" size="sm" onClick={clearFilter}>
          Limpiar
        </Button>
        <Button variant="primary" size="sm" onClick={applyFilter}>
          Aplicar
        </Button>
      </div>
    </Form>
  );
};

// Component to display active filters
const ActiveFilters = ({ table }) => {
  const columnFilters = table.getState().columnFilters;



  return (
    <div className="d-flex flex-wrap align-items-center mb-3">
      <small className="me-2">Filtros activos:</small>
      {columnFilters.map((filter) => {
        const column = table.getColumn(filter.id);
        let filterLabel = "";

        if (filter.id === "llegada") {
          const [desde, hasta] = filter.value;
          filterLabel = `${desde || "..."} a ${hasta || "..."}`;
        } else {
          filterLabel = filter.value.toString().substring(0, 20);
        }

        return (
          <Button
            key={filter.id}
            size="sm"
            variant="outline-secondary"
            className="me-2 mb-1 d-flex align-items-center"
            onClick={() => column.setFilterValue(undefined)}
          >
            {column.columnDef.header}: {filterLabel}
            <X size={14} className="ms-1" />
          </Button>
        );
      })}

      {columnFilters.length > 1 && (
        <Button
          size="sm"
          variant="link"
          className="ms-2"
          onClick={() => table.resetColumnFilters()}
        >
          Limpiar todos
        </Button>
      )}
    </div>
  );
};

export { FilterHeader, ActiveFilters };
