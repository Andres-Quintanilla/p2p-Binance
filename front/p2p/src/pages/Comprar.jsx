import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const Comprar = () => {
  const { anuncioId } = useParams();
  const [anuncio, setAnuncio] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [comprobante, setComprobante] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnuncio = async () => {
      try {
        const res = await api.get(`/anuncios/${anuncioId}`);
        setAnuncio(res.data);
      } catch (error) {
        console.error("No se pudo cargar el anuncio:", error);
        setMensaje("No se pudo cargar el anuncio.");
      }
    };

    fetchAnuncio();
  }, [anuncioId]);

  const handleComprar = async () => {
    try {
      if (anuncio.tipo === "venta") {
        if (!comprobante) {
          setMensaje("Debes subir un comprobante para continuar.");
          return;
        }

        const res = await api.post(`/transacciones/comprar/${anuncioId}`);
        const transaccionId = res.data.id;

        const formData = new FormData();
        formData.append("comprobante", comprobante);
        formData.append("descripcionPago", anuncio.descripcionPago || "");

        await api.put(`/transacciones/${transaccionId}/comprobante`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMensaje("Compra iniciada correctamente.");
        setTimeout(() => navigate("/ordenes-comprador"), 2000);

      } else if (anuncio.tipo === "compra") {
        await api.post(`/transacciones/vender/${anuncioId}`);
        setMensaje("Venta iniciada correctamente.");
        setTimeout(() => navigate("/ordenes-vendedor"), 2000);
      }
    } catch (error) {
      console.error("Error al iniciar la transacción:", error);
      setMensaje("Error al iniciar la transacción.");
    }
  };

  if (!anuncio) {
    return <p className="mt-4 text-danger">{mensaje || "Cargando..."}</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Confirmar {anuncio.tipo === "venta" ? "Compra" : "Venta"}</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      <div className="card p-3">
        <p><strong>Moneda:</strong> {anuncio.Moneda?.nombre}</p>
        <p><strong>Cantidad:</strong> {anuncio.cantidadDisponible}</p>
        <p><strong>Precio Unitario:</strong> ${anuncio.precioUnitario} USD</p>
        <p><strong>Método de Pago:</strong> {anuncio.descripcionPago}</p>

        {anuncio.tipo === "venta" && (
          <>
            <label className="form-label mt-2">Subir Comprobante de Pago:</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setComprobante(e.target.files[0])}
            />
          </>
        )}

        <button className="btn btn-primary mt-2" onClick={handleComprar}>
          Confirmar {anuncio.tipo === "venta" ? "Compra" : "Venta"}
        </button>
      </div>
    </div>
  );
};

export default Comprar;
