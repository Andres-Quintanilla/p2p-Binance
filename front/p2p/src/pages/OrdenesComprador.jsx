import { useEffect, useState } from "react";
import api from "../api/axios";

const OrdenesComprador = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [comprobantes, setComprobantes] = useState({});

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await api.get("/transacciones/pendientes-comprador");
        setOrdenes(res.data);
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
        setMensaje("No se pudieron cargar las órdenes del comprador.");
      }
    };
    fetchOrdenes();
  }, []);

  const getBadgeClass = (estado) => {
    switch (estado) {
      case "completada":
        return "bg-success";
      case "cancelada":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  const handleComprobanteChange = (e, transaccionId) => {
    setComprobantes({
      ...comprobantes,
      [transaccionId]: e.target.files[0]
    });
  };

  const handleSubirComprobante = async (transaccionId, descripcionPago) => {
    const archivo = comprobantes[transaccionId];
    if (!archivo) {
      setMensaje("Selecciona un archivo para subir.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("comprobante", archivo);
      formData.append("descripcionPago", descripcionPago || "");

      await api.put(`/transacciones/${transaccionId}/comprobante`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setMensaje("Comprobante subido correctamente.");
      setComprobantes({ ...comprobantes, [transaccionId]: null });

      // Opcional: actualizar la lista
      const res = await api.get("/transacciones/pendientes-comprador");
      setOrdenes(res.data);
    } catch (error) {
      console.error("Error al subir comprobante:", error);
      setMensaje("Error al subir el comprobante.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Mis Órdenes como Comprador</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      {ordenes.map((orden) => (
        <div key={orden.id} className="card mt-3 p-3">
          <p><strong>Transacción ID:</strong> {orden.id}</p>
          <p><strong>Vendedor:</strong> {orden.usuarioVendedor?.email}</p>
          <p><strong>Moneda:</strong> {orden.Anuncio?.Moneda?.nombre}</p>
          <p><strong>Monto:</strong> {orden.monto}</p>
          <p><strong>Método de Pago:</strong> {orden.Anuncio?.descripcionPago}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`badge ${getBadgeClass(orden.estado)}`}>{orden.estado}</span>
          </p>

          {orden.imagenComprobante ? (
            <div>
              <p><strong>Comprobante:</strong></p>
              <img
                src={`http://localhost:3000/${orden.imagenComprobante}`}
                alt="Comprobante"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          ) : (
            orden.Anuncio?.tipo === "compra" && (
              <div className="mt-3">
                <label className="form-label">Subir Comprobante de Pago:</label>
                <input
                  type="file"
                  className="form-control mb-2"
                  accept="image/*"
                  onChange={(e) => handleComprobanteChange(e, orden.id)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleSubirComprobante(orden.id, orden.Anuncio?.descripcionPago)}
                >
                  Confirmar Pago
                </button>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdenesComprador;
