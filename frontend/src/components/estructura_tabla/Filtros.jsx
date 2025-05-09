import React, { useState, useRef, useEffect } from "react";
import { Funnel, Filter } from "react-bootstrap-icons";
import { Overlay, Popover } from "react-bootstrap";

function Filtros({ column }) {
  const [showFilter, setShowFilter] = useState(false);
  const headerRef = useRef(null);
  const { filterVariant } = column.columnDef.meta ?? {};
  const columnFilterValue = column.getFilterValue();
  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant]
  );

  // Función para renderizar el contenido del filtro
  const renderFilterContent = () => {
    if (filterVariant === "range") {
      return (
        <div>
          <div className="d-flex gap-2">
            <DebouncedInput
              type="number"
              min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
              max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
              value={columnFilterValue?.[0] ?? ""}
              onChange={(value) =>
                column.setFilterValue((old) => [value, old?.[1]])
              }
              placeholder={`Min ${
                column.getFacetedMinMaxValues()?.[0] !== undefined
                  ? `(${column.getFacetedMinMaxValues()?.[0]})`
                  : ""
              }`}
              className="form-control form-control-sm"
            />
            <DebouncedInput
              type="number"
              min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
              max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
              value={columnFilterValue?.[1] ?? ""}
              onChange={(value) =>
                column.setFilterValue((old) => [old?.[0], value])
              }
              placeholder={`Max ${
                column.getFacetedMinMaxValues()?.[1]
                  ? `(${column.getFacetedMinMaxValues()?.[1]})`
                  : ""
              }`}
              className="form-control form-control-sm"
            />
          </div>
        </div>
      );
    } else if (filterVariant === "select") {
      return (
        <select
          className="form-select form-select-sm"
          onChange={(e) => column.setFilterValue(e.target.value)}
          value={columnFilterValue?.toString()}
        >
          <option value="">Todos</option>
          {sortedUniqueValues.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
      );
    } else if (filterVariant === "number") {
      return (
        <select
          className="form-select form-select-sm"
          onChange={(e) =>
            column.setFilterValue([e.target.value, e.target.value])
          }
          value={columnFilterValue?.toString()}
        >
          <option value="">Todos</option>
          {sortedUniqueValues.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
      );
    } else if (filterVariant === "fecha") {
      return (
        <div className="d-flex gap-2">
          <DebouncedInput
            type="date"
            value={columnFilterValue?.[0] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old) => [value, old?.[1]])
            }
            placeholder={`Desde`}
            className="form-control form-control-sm"
          />
          <DebouncedInput
            type="date"
            value={columnFilterValue?.[1] ?? ""}
            onChange={(value) =>
              column.setFilterValue((old) => [old?.[0], value])
            }
            placeholder={`Hasta`}
            className="form-control form-control-sm"
          />
        </div>
      );
    } else {
      return (
        <>
          <datalist id={column.id + "list"}>
            {sortedUniqueValues.map((value) => (
              <option value={value} key={value} />
            ))}
          </datalist>
          <DebouncedInput
            type="text"
            value={columnFilterValue ?? ""}
            onChange={(value) => column.setFilterValue(value)}
            placeholder={`Buscar... (${column.getFacetedUniqueValues().size})`}
            className="form-control form-control-sm"
            list={column.id + "list"}
          />
        </>
      );
    }
  };

  // Agregamos un indicador si el filtro está activo
  const isFiltered = column.getFilterValue() != null;

  return (
    <div ref={headerRef} className="d-flex align-items-center">
      <div
        className="cursor-pointer d-flex align-items-center"
        onClick={() => setShowFilter(!showFilter)}
      >
        <span className="encabezados">
          {column.columnDef.header} <Filter />{" "}
        </span>
        {isFiltered && (
          <span className="ms-1 text-primary">
            <Funnel size={14} />
          </span>
        )}
      </div>

      <Overlay
        target={headerRef.current}
        show={showFilter}
        placement="bottom"
        rootClose
        onHide={() => setShowFilter(false)}
      >
        <Popover style={{ maxWidth: "350px", minWidth: "250px" }}>
          <Popover.Header
            as="h3"
            className="d-flex justify-content-between align-items-center"
          >
            Filtrar {column.columnDef.header}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setShowFilter(false)}
            ></button>
          </Popover.Header>
          <Popover.Body>
            {renderFilterContent()}
            <div className="d-flex justify-content-between mt-2">
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => {
                  column.setFilterValue(undefined);
                  setShowFilter(false);
                }}
              >
                Limpiar
              </button>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowFilter(false)}
              >
                Aplicar
              </button>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (value !== initialValue) {
        onChange(value);
      }
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, initialValue, debounce, onChange]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export default Filtros;
