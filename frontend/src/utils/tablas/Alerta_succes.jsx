import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";

export function Alerta_succes(Titulo) {
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate();

  MySwal.fire({
    html: <strong>{Titulo} agregado correctamente</strong>,
    icon: "success",
    showCancelButton: true,
    confirmButtonText: "Ir a lista de contenedores",
    cancelButtonText: "Cerrar",
    reverseButtons: true,
  }).then((result) => {
    if (result.isConfirmed) {
      navigate("/listado-contenedores");
    }
  });
}
