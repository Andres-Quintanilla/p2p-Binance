import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Vender = () => {
  const { anuncioId } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnuncio = async () => {
      try {
        const res = await api.get(`/anuncios/${anuncioId}`);
        setAnuncio(res.data);
      } catch (error) {
        console.error("Error al cargar el anuncio:", error);
        setMensaje("No se pudo cargar el anuncio.");
      }
    };

    fetchAnuncio();
  }, [anuncioId]);

  const handleConfirmarVenta = async () => {
    try {
      const res = await api.post(`/transacciones/vender/${anuncioId}`);
      alert("Venta iniciada correctamente.");
      navigate("/ordenes-vendedor");
    } catch (error) {
      console.error("Error al iniciar la venta:", error);
      alert("Error al iniciar la venta.");
    }
  };

  if (!anuncio) return <p className="mt-4 text-danger">{mensaje || "Cargando..."}</p>;

  return (
    <div className="container mt-4">
      <h3>Confirmar Venta</h3>
      <div className="card p-3">
        <p><strong>Moneda:</strong> {anuncio.Moneda?.nombre}</p>
        <p><strong>Cantidad:</strong> {anuncio.cantidadDisponible}</p>
        <p><strong>Precio Unitario:</strong> ${anuncio.precioUnitario} USD</p>
        <p><strong>Método de Pago:</strong> {anuncio.descripcionPago}</p>

        <button className="btn btn-success" onClick={handleConfirmarVenta}>
          Confirmar Venta
        </button>
      </div>
    </div>
  );
};

export default Vender;
