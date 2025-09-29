import { useState, useEffect } from "react";

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
    return <div style={{ background: "#111", color: "#fff", height: "100vh", padding: "20px" }}>Cargando métricas...</div>;
  }

  return (
    <div style={{ background: "#111", color: "#fff", minHeight: "100vh", padding: "20px", fontFamily: "monospace" }}>
      <h1>Métricas</h1>

      {generales && (
        <div style={{ marginBottom: "30px" }}>
          <h2>Generales</h2>
          <p>Total de ofertas: {generales.total_ofertas}</p>
          <p>Promedio de compatibilidad: {generales.promedio_compatibilidad.toFixed(2)}</p>
        </div>
      )}

      <div style={{ marginBottom: "30px" }}>
        <h2>Tecnologías</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #fff", textAlign: "left" }}>Tecnología</th>
              <th style={{ borderBottom: "1px solid #fff" }}>Categoría</th>
              <th style={{ borderBottom: "1px solid #fff" }}>Conteo</th>
              <th style={{ borderBottom: "1px solid #fff" }}>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {tecnologias.map((t) => (
              <tr key={t.nombre_tecnologia}>
                <td>{t.nombre_tecnologia}</td>
                <td>{t.categoria}</td>
                <td>{t.conteo}</td>
                <td>{t.porcentaje.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Ubicaciones</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #fff", textAlign: "left" }}>Ciudad</th>
              <th style={{ borderBottom: "1px solid #fff" }}>Conteo</th>
              <th style={{ borderBottom: "1px solid #fff" }}>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {ubicaciones.map((u) => (
              <tr key={u.ciudad}>
                <td>{u.ciudad}</td>
                <td>{u.conteo}</td>
                <td>{u.porcentaje.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Modalidades</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #fff", textAlign: "left" }}>Modalidad</th>
              <th style={{ borderBottom: "1px solid #fff" }}>Conteo</th>
              <th style={{ borderBottom: "1px solid #fff" }}>Porcentaje</th>
            </tr>
          </thead>
          <tbody>
            {modalidades.map((m) => (
              <tr key={m.modalidad}>
                <td>{m.modalidad}</td>
                <td>{m.conteo}</td>
                <td>{m.porcentaje.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
