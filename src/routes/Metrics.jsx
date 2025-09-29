import { useState, useEffect } from "react";
import styles from "./Metrics.module.css";

export default function Metrics() {
  const [tecnologias, setTecnologias] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [generales, setGenerales] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [techRes, locRes, modRes, genRes] = await Promise.all([
          fetch("http://localhost:5000/api/metricas/tecnologias"),
          fetch("http://localhost:5000/api/metricas/ubicaciones"),
          fetch("http://localhost:5000/api/metricas/modalidades"),
          fetch("http://localhost:5000/api/metricas/generales"),
        ]);

        const techData = await techRes.json();
        const locData = await locRes.json();
        const modData = await modRes.json();
        const genData = await genRes.json();

        setTecnologias(techData);
        setUbicaciones(locData);
        setModalidades(modData);
        setGenerales(genData[0] || null);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className={styles.container}>Cargando métricas...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Métricas</h1>

      {generales && (
        <div className={`${styles.section} ${styles.cards}`}>
          <div className={styles.card}>
            <h2>Total de ofertas</h2>
            <p>{generales.total_ofertas}</p>
          </div>
          <div className={styles.card}>
            <h2>Promedio de compatibilidad</h2>
            <p>{generales.promedio_compatibilidad.toFixed(2)}</p>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h2>Tecnologías</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tecnología</th>
                <th>Categoría</th>
                <th>Conteo</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {tecnologias.map((t) => (
                <tr key={t.nombre_tecnologia}>
                  <td>{t.nombre_tecnologia}</td>
                  <td>{t.categoria}</td>
                  <td>{t.conteo}</td>
                  <td className={styles.percentage}>{t.porcentaje.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Ubicaciones</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ciudad</th>
                <th>Conteo</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((u) => (
                <tr key={u.ciudad}>
                  <td>{u.ciudad}</td>
                  <td>{u.conteo}</td>
                  <td className={styles.percentage}>{u.porcentaje.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Modalidades</h2>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Modalidad</th>
                <th>Conteo</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {modalidades.map((m) => (
                <tr key={m.modalidad}>
                  <td>{m.modalidad}</td>
                  <td>{m.conteo}</td>
                  <td className={styles.percentage}>{m.porcentaje.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
