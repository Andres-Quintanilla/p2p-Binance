import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CrearAnuncioVenta = () => {
  const navigate = useNavigate();
  const [billeteras, setBilleteras] = useState([]);
  const [monedaId, setMonedaId] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [cantidadDisponible, setCantidadDisponible] = useState("");
  const [descripcionPago, setDescripcionPago] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchBilleteras = async () => {
      try {
        const res = await api.get("/billeteras");
        const conSaldo = res.data.filter((b) => b.saldo > 0);
        setBilleteras(conSaldo);
      } catch (error) {
        console.error("Error al obtener billeteras:", error);
      }
    };
    fetchBilleteras();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/anuncios", {
        tipo: "venta",
        monedaId: parseInt(monedaId),
        precioUnitario: parseFloat(precioUnitario),
        cantidadDisponible: parseFloat(cantidadDisponible),
        descripcionPago,
      });
      setMensaje("Anuncio de venta creado exitosamente");
      setTimeout(() => navigate("/mis-anuncios"), 1500);
    } catch (error) {
      console.error("Error al crear anuncio de venta:", error);
      setMensaje("Error al crear el anuncio de venta");
    }
  };

  return (
    <div className="container mt-3">
      <h2>Crear Anuncio de Venta</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Moneda:</label>
          <select
            className="form-select"
            value={monedaId}
            onChange={(e) => setMonedaId(e.target.value)}
            required
          >
            <option value="">Selecciona una moneda</option>
            {billeteras.map((b) => (
              <option key={b.id} value={b.monedaId}>
                {b.Moneda?.nombre} (saldo: {b.saldo})
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label>Precio Unitario (USD):</label>
          <input
            type="number"
            className="form-control"
            value={precioUnitario}
            onChange={(e) => setPrecioUnitario(e.target.value)}
            step="0.0001"
            min="0.0001"
            required
          />
        </div>
        <div className="mb-2">
          <label>Cantidad Disponible:</label>
          <input
            type="number"
            className="form-control"
            value={cantidadDisponible}
            onChange={(e) => setCantidadDisponible(e.target.value)}
            step="0.0001"
            min="0.0001"
            required
          />
        </div>
        <div className="mb-2">
          <label>Descripción del Pago:</label>
          <textarea
            className="form-control"
            value={descripcionPago}
            onChange={(e) => setDescripcionPago(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Crear Anuncio
        </button>
      </form>
    </div>
  );
};

export default CrearAnuncioVenta;
