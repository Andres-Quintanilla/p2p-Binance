// OrdenesVendedor.jsx
import { useEffect, useState } from "react";
import api from "../api/axios";

const OrdenesVendedor = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await api.get("/transacciones/vendedor");
        setOrdenes(res.data);
      } catch (error) {
        console.error("Error al cargar órdenes:", error);
        setMensaje("No se pudieron cargar las órdenes del vendedor.");
      }
    };
    fetchOrdenes();
  }, []);

  const handleAccion = async (id, accion) => {
    try {
      if (accion === "confirmar") {
        const billeteraDestinoId = prompt("Ingrese el ID de la billetera del comprador:");
        if (!billeteraDestinoId) {
          setMensaje("Operación cancelada: no se ingresó un ID de billetera.");
          return;
        }
        await api.put(`/transacciones/${id}/confirmar`, { billeteraDestinoId });
        setMensaje("Transacción confirmada correctamente.");
      } else if (accion === "cancelar") {
        await api.put(`/transacciones/${id}/cancelar`);
        setMensaje("Transacción cancelada correctamente.");
      }
      setOrdenes((prev) => prev.filter((orden) => orden.id !== id));
    } catch (error) {
      console.error(`Error al ${accion} transacción:`, error);
      setMensaje(`Error al ${accion} la transacción.`);
    }
  };

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

  return (
    <div className="container mt-4">
      <h2>Órdenes de Compra como Vendedor</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      {ordenes.map((orden) => (
        <div key={orden.id} className="card mt-3 p-3">
          <p><strong>Transacción ID:</strong> {orden.id}</p>
          <p><strong>Comprador:</strong> {orden.usuarioComprador?.email}</p>
          <p><strong>Moneda:</strong> {orden.Anuncio?.Moneda?.nombre}</p>
          <p><strong>Monto:</strong> {orden.monto}</p>
          <p><strong>Método de Pago:</strong> {orden.Anuncio?.descripcionPago}</p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`badge ${getBadgeClass(orden.estado)}`}>{orden.estado}</span>
          </p>
          {orden.imagenComprobante && (
            <div>
              <p><strong>Comprobante:</strong></p>
              <img
                src={`http://localhost:3000/${orden.imagenComprobante}`}
                alt="Comprobante"
                style={{ maxWidth: "200px", maxHeight: "200px" }}
              />
            </div>
          )}
          {orden.estado === "pendiente" && (
            <div className="mt-2">
              <button className="btn btn-success me-2" onClick={() => handleAccion(orden.id, "confirmar")}>Confirmar</button>
              <button className="btn btn-danger" onClick={() => handleAccion(orden.id, "cancelar")}>Cancelar</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrdenesVendedor;
