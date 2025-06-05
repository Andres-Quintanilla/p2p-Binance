import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import AdminMonedas from './pages/AdminMonedas';
import AdminPanel from './pages/AdminPanel';
import SeleccionarMoneda from './pages/SeleccionarMoneda';
import DetalleBilletera from './pages/DetalleBilletera';
import CrearAnuncioCompra from './pages/CrearAnuncioCompra';
import CrearAnuncioVenta from './pages/CrearAnuncioVenta';
import Navbar from './components/Navbar';
import AnunciosCompra from './pages/AnunciosCompra';
import AnunciosVenta from './pages/AnunciosVenta';
import MisAnuncios from './pages/MisAnuncios';
import TransaccionDetalle from './pages/TransaccionDetalle';
import OrdenesComprador from './pages/OrdenesComprador';
import OrdenesVendedor from './pages/OrdenesVendedor';

const RutaPrivada = ({ children }) => {
  const { usuario } = useAuth();
  return usuario ? children : <Navigate to="/login" />;
};

const App = () => {
  const { usuario } = useAuth();

  return (
    <Router>
      {usuario && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/admin/monedas"
          element={
            <RutaPrivada>
              <AdminMonedas />
            </RutaPrivada>
          }
        />
        <Route
          path="/admin/panel"
          element={
            <RutaPrivada>
              <AdminPanel />
            </RutaPrivada>
          }
        />
        <Route
          path="/monedas"
          element={
            <RutaPrivada>
              <SeleccionarMoneda />
            </RutaPrivada>
          }
        />
        <Route
          path="/billetera/:monedaId"
          element={
            <RutaPrivada>
              <DetalleBilletera />
            </RutaPrivada>
          }
        />
        <Route
          path="/crear-anuncio-compra/:monedaId"
          element={
            <RutaPrivada>
              <CrearAnuncioCompra />
            </RutaPrivada>
          }
        />
        <Route
          path="/crear-anuncio-venta/:monedaId"
          element={
            <RutaPrivada>
              <CrearAnuncioVenta />
            </RutaPrivada>
          }
        />
        <Route 
          path="/compras"
          element={
            <RutaPrivada>
              <AnunciosCompra />
            </RutaPrivada>
          }
        />
        <Route 
          path="/ventas"
          element={
            <RutaPrivada>
              <AnunciosVenta />
            </RutaPrivada>
          }
        />
        <Route 
          path="/mis-anuncios"
          element={
            <RutaPrivada>
              <MisAnuncios />
            </RutaPrivada>
          }
        />
        <Route 
          path="/comprar/:anuncioId"
          element={
            <RutaPrivada>
              <TransaccionDetalle />
            </RutaPrivada>
          }
        />
        <Route 
          path="/ordenes-comprador" 
          element={
            <RutaPrivada>
              <OrdenesComprador />
            </RutaPrivada>
          } 
        />
        <Route 
          path="/ordenes-vendedor" 
          element={
            <RutaPrivada>
              <OrdenesVendedor />
            </RutaPrivada>
          } 
        />
        <Route path="/" element={<Navigate to="/monedas" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
