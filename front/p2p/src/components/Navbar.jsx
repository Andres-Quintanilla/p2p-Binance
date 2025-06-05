import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-3">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-warning" to="/monedas">
          Binance P2P
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {usuario && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/monedas">
                    Monedas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/compras">
                    Compras
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/ventas">
                    Ventas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/mis-anuncios">
                    Mis Anuncios
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/ordenes-comprador">
                    Ordenes Comprador
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/ordenes-vendedor">
                    Ordenes Vendedor
                  </NavLink>
                </li>
                {usuario.esAdmin && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin/monedas">
                        Admin Monedas
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin/panel">
                        Panel Admin
                      </NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {!usuario ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Iniciar Sesión
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/registro">
                    Registro
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item d-flex align-items-center text-white me-3">
                  <span>
                    {usuario.email} ({usuario.esAdmin ? "Admin" : "Usuario"})
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-warning btn-sm"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
