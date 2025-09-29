import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const ejecutarProceso = async () => {
    setLoading(true);
    setMensaje("");

    try {
      const res = await fetch("http://localhost:5000/api/ejecutar-proceso", {
        method: "POST",
      });
      const data = await res.json();
      setMensaje(data.mensaje || "Proceso completado");
    } catch (error) {
      setMensaje(`ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "#000",
        color: "#fff",
        height: "100vh",
        padding: "20px",
        fontFamily: "monospace",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        onClick={ejecutarProceso}
        disabled={loading}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          fontSize: "16px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Procesando..." : "Postulomania"}
      </button>

      {mensaje && <div style={{ marginTop: "20px" }}>{mensaje}</div>}

      {/* Botones de navegación */}
      <div style={{ marginTop: "40px", display: "flex", gap: "20px" }}>
        <button
          onClick={() => navigate("/analisis")}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Ir a Análisis
        </button>
        <button
          onClick={() => navigate("/metrics")}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Ir a Metrics
        </button>
      </div>
    </div>
  );
}
