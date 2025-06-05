import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [estadisticas, setEstadisticas] = useState(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const res = await api.get('/admin/estadisticas');
        setEstadisticas(res.data);
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        setMensaje('Error al cargar las estadísticas');
      }
    };

    if (usuario?.esAdmin) {
      fetchEstadisticas();
    }
  }, [usuario]);

  if (!usuario?.esAdmin) {
    return <p>Acceso denegado. Esta sección es solo para administradores.</p>;
  }

  return (
    <div className="container">
      <h2>Dashboard de Administración</h2>
      {mensaje && <p className="text-danger">{mensaje}</p>}
      {estadisticas ? (
        <div>
          <p>Total de usuarios: {estadisticas.totalUsuarios}</p>
          <p>Total de transacciones: {estadisticas.totalTransacciones}</p>
        </div>
      ) : (
        <p>Cargando estadísticas...</p>
      )}
    </div>
  );
};

export default Dashboard;
