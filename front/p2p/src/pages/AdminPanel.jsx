import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await api.get("/usuarios");
        setUsuarios(res.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setMensaje("Error al cargar los usuarios");
      }
    };

    fetchUsuarios();
  }, []);

  const cambiarRol = async (id, esAdmin) => {
    try {
      await api.put(`/usuarios/${id}/hacer-admin`, { esAdmin: !esAdmin });
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, esAdmin: !esAdmin } : u
        )
      );
    } catch (error) {
      console.error("Error al cambiar rol:", error);
      setMensaje("Error al cambiar el rol del usuario");
    }
  };

  if (!usuario?.esAdmin) {
    return <p>Acceso denegado. Esta sección es solo para administradores.</p>;
  }

  return (
    <div className="container mt-3">
      <h2>Panel de Administración</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rol</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.esAdmin ? "Administrador" : "Usuario"}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => cambiarRol(u.id, u.esAdmin)}
                >
                  Cambiar a {u.esAdmin ? "Usuario" : "Administrador"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
