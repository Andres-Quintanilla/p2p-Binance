import { useAuth } from "../context/AuthContext";

const Inicio = () => {
    const { usuario, logout } = useAuth();

    return (
        <div className="container">
            <h1>Bienvenido, {usuario?.email}</h1>
            <p>Tu rol: {usuario?.esAdmin ? "Administrador" : "Usuario normal"}</p>
            <button onClick={logout}>Cerrar sesión</button>
        </div>
    );
};

export default Inicio;