import { useEffect, useState } from "react";
import api from "../api/axios";

const MisAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchMisAnuncios = async () => {
      try {
        const res = await api.get("/anuncios/mis-anuncios");
        setAnuncios(res.data);
      } catch (error) {
        console.error("Error al obtener mis anuncios:", error);
        setMensaje("No se pudieron cargar tus anuncios.");
      }
    };

    fetchMisAnuncios();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Mis Anuncios</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      {anuncios.length > 0 ? (
        <ul className="list-group">
          {anuncios.map((a) => (
            <li
              key={a.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {a.tipo.toUpperCase()} - {a.cantidadDisponible} {a.Moneda?.nombre} a ${a.precioUnitario} USD
              <span className="badge bg-secondary">{a.descripcionPago}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No has creado anuncios aún.</p>
      )}
    </div>
  );
};

export default MisAnuncios;
