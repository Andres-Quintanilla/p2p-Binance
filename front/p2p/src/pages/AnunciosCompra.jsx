import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AnunciosCompra = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const res = await api.get("/anuncios?tipo=compra");
        setAnuncios(res.data);
      } catch (error) {
        console.error("Error al obtener anuncios de compra:", error);
        setMensaje("Error al cargar los anuncios");
      }
    };

    fetchAnuncios();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Anuncios de Compra</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      {anuncios.length > 0 ? (
        <ul className="list-group">
          {anuncios.map((a) => (
            <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
              <strong>{a.Usuario?.email}</strong> {a.cantidadDisponible} {a.Moneda?.nombre} a ${a.precioUnitario} USD <br />
              <em>Método de pago: </em> {a.descripcionPago}
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate(`/comprar/${a.id}`)}
              >
                Vender
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay anuncios de compra disponibles.</p>
      )}

      <div className="mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/crear-anuncio-compra/1")} 
        >
          Crear Anuncio de Compra
        </button>
      </div>
    </div>
  );
};

export default AnunciosCompra;
