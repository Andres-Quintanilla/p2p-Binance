import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const DetalleBilletera = () => {
  const { monedaId } = useParams();
  const [billetera, setBilletera] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchBilletera = async () => {
      try {
        const res = await api.get(`/billeteras/${monedaId}`);
        setBilletera(res.data);
      } catch (error) {
        console.error("Error al obtener billetera:", error);
        setMensaje("Error al cargar la billetera");
      }
    };

    fetchBilletera();
  }, [monedaId]);

  return (
    <div className="container mt-3">
      <h2>Detalle de Billetera</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      {billetera && (
        <div>
          <p><strong>ID de Billetera:</strong> <span className="text-primary">{billetera.id}</span></p>
          <p><strong>Moneda:</strong> {billetera.Moneda?.nombre}</p>
          <p><strong>Saldo:</strong> {billetera.saldo}</p>

          <h4>Movimientos</h4>
          {billetera.movimientos?.length > 0 ? (
            <ul className="list-group">
              {billetera.movimientos.map((tx) => (
                <li key={tx.id} className="list-group-item">
                  <strong>{tx.sentido}</strong> - {tx.tipo.toUpperCase()} - {tx.monto} - Estado: {tx.estado}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay movimientos aún.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DetalleBilletera;
