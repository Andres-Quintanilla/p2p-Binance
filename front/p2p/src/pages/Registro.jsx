import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Registro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.message || "Error al registrar");
      } else {
        setMensaje("Registro exitoso. Redirigiendo...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setMensaje("Error al conectar con el servidor");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="card p-4 shadow w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Registro</h2>
        {mensaje && <div className="alert alert-danger text-center">{mensaje}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-dark w-100">Registrarse</button>
        </form>
      </div>
    </div>
  );
};

export default Registro;
