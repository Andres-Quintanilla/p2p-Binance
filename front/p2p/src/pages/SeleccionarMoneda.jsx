import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const SeleccionarMoneda = () => {
  const [monedas, setMonedas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMonedas = async () => {
      try {
        const res = await api.get("/monedas");
        setMonedas(res.data);
      } catch (error) {
        console.error("Error al obtener monedas:", error);
        setMensaje("Error al obtener monedas disponibles");
      }
    };

    fetchMonedas();
  }, []);

  const seleccionar = (monedaId) => {
    navigate(`/billetera/${monedaId}`);
  };

  return (
    <div className="container">
      <h2>Selecciona una moneda para operar</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      <ul className="list-group">
        {monedas.map((moneda) => (
          <li
            key={moneda.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {moneda.nombre} (${moneda.valorEnSus})
            <button
              className="btn btn-primary btn-sm"
              onClick={() => seleccionar(moneda.id)}
            >
              Seleccionar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SeleccionarMoneda;
