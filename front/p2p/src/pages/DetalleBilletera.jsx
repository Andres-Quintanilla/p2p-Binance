import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const DetalleBilletera = () => {
  const { monedaId } = useParams();

  const [billetera, setBilletera] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const [destinoId, setDestinoId] = useState("");
  const [monto, setMonto] = useState("");
  const [transferenciaMensaje, setTransferenciaMensaje] = useState("");

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

  const realizarTransferencia = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/transferencias", {
        origenId: billetera.id,
        destinoId,
        monto: parseFloat(monto),
      });

      if (!res.data || res.status !== 200) {
        setTransferenciaMensaje("Error al realizar la transferencia");
      } else {
        setTransferenciaMensaje("Transferencia realizada con éxito");
        setMonto("");
        setDestinoId("");
      }
    } catch (error) {
      console.error("Error al transferir:", error);
      setTransferenciaMensaje("Error al conectar con el servidor");
    }
  };

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
          {billetera.Transaccions?.length > 0 ? (
            <ul className="list-group">
              {billetera.Transaccions.map((tx) => (
                <li key={tx.id} className="list-group-item">
                  {tx.tipo.toUpperCase()} - {tx.monto} - Estado: {tx.estado}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay movimientos aún.</p>
          )}

          <hr />
          <h4>Transferir fondos</h4>
          <form onSubmit={realizarTransferencia}>
            <div className="mb-2">
              <label>ID de Billetera Destino:</label>
              <input
                type="text"
                className="form-control"
                value={destinoId}
                onChange={(e) => setDestinoId(e.target.value)}
                required
              />
            </div>
            <div className="mb-2">
              <label>Monto a transferir:</label>
              <input
                type="number"
                className="form-control"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                step="0.0001"
                min="0.0001"
                required
              />
            </div>
            <button className="btn btn-success" type="submit">
              Enviar transferencia
            </button>
            {transferenciaMensaje && (
              <p className="text-info mt-2">{transferenciaMensaje}</p>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default DetalleBilletera;
