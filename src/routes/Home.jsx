import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [progreso, setProgreso] = useState(0);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  // Limpiar interval al desmontar componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const consultarEstado = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/estado-proceso");
      const data = await res.json();

      setProgreso(data.progreso);
      setMensaje(data.mensaje);

      // Si el proceso terminó, detener el polling
      if (!data.en_ejecucion) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setLoading(false);

        // Mostrar error si existe
        if (data.error) {
          setMensaje(`❌ Error: ${data.error}`);
        } else if (data.progreso === 100) {
          setMensaje("✅ Proceso completado exitosamente");
        }
      }
    } catch (error) {
      console.error("Error consultando estado:", error);
    }
  };

  const ejecutarProceso = async () => {
    setLoading(true);
    setMensaje("Iniciando proceso...");
    setProgreso(0);

    try {
      const res = await fetch("http://localhost:5000/api/ejecutar-proceso", {
        method: "POST",
      });

      if (res.status === 409) {
        const data = await res.json();
        setMensaje("⚠️ Ya hay un proceso en ejecución");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMensaje(data.mensaje || "Proceso iniciado");

      // Iniciar polling del estado cada 2 segundos
      intervalRef.current = setInterval(consultarEstado, 2000);
    } catch (error) {
      setMensaje(`❌ ERROR: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>POSTULOMANIA</h1>

      <button
        onClick={ejecutarProceso}
        disabled={loading}
        className={styles.mainButton}
      >
        {loading ? "Procesando..." : "Postulomania"}
      </button>

      {/* Barra de progreso */}
      {loading && (
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progreso}%` }}
            >
              {progreso}%
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de estado */}
      {mensaje && <div className={styles.message}>{mensaje}</div>}

      {/* Botones de navegación */}
      <div className={styles.navButtons}>
        <button
          onClick={() => navigate("/analisis")}
          className={styles.navButton}
        >
          Ir a Análisis
        </button>
        <button
          onClick={() => navigate("/metrics")}
          className={styles.navButton}
        >
          Ir a Metrics
        </button>
      </div>
    </div>
  );
}