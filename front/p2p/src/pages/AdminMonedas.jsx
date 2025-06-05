import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const AdminMonedas = () => {
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState("");
  const [valorEnSus, setValorEnSus] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [monedas, setMonedas] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/monedas", {
        nombre,
        valorEnSus: parseFloat(valorEnSus)
      });

      if (!res.data) {
        setMensaje("Error al crear la moneda");
      } else {
        setMensaje("Moneda creada correctamente");
        setNombre("");
        setValorEnSus("");
        obtenerMonedas(); 
      }
    } catch (error) {
      console.error("Error al crear moneda:", error);
      setMensaje("Error de conexión");
    }
  };

  const obtenerMonedas = async () => {
    try {
      const res = await api.get("/monedas");
      setMonedas(res.data);
    } catch (error) {
      console.error("Error al obtener monedas:", error);
    }
  };

  useEffect(() => {
    obtenerMonedas();
  }, []);

  if (!usuario?.esAdmin) {
    return <p>Acceso denegado. Esta sección es solo para administradores.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Crear Moneda</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      <form onSubmit={handleSubmit} className="mb-3 d-flex gap-2">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="form-control"
        />
        <input
          type="number"
          placeholder="Valor en $us"
          value={valorEnSus}
          onChange={(e) => setValorEnSus(e.target.value)}
          step="0.0001"
          min="0.0001"
          required
          className="form-control"
        />
        <button type="submit" className="btn btn-dark">Crear</button>
      </form>

      <hr />
      <h4>Monedas Existentes</h4>
      {monedas.length > 0 ? (
        <ul className="list-group">
          {monedas.map((m) => (
            <li key={m.id} className="list-group-item">
              {m.nombre} - ${m.valorEnSus}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay monedas registradas aún.</p>
      )}
    </div>
  );
};

export default AdminMonedas;
