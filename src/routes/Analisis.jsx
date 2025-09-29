import { useEffect, useState } from "react";
import { FaExternalLinkAlt, FaCopy, FaCalendarAlt, FaSortAmountDown } from "react-icons/fa";
import OfertaDescripcion from "./OfertaDescripcion";
import "../App.css";

export default function Analisis() {
  const [ofertas, setOfertas] = useState([]);
  const [orden, setOrden] = useState("fecha"); 
  const [detalleId, setDetalleId] = useState(null); // id de oferta para mostrar descripción

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/analisis"); 
        const data = await res.json();
        setOfertas(data);
      } catch (error) {
        console.error("Error fetching ofertas:", error);
      }
    };
    fetchOfertas();
  }, []);

  const ordenarOfertas = (tipo) => {
    setOrden(tipo);
    const sorted = [...ofertas].sort((a, b) => {
      if (tipo === "fecha") return new Date(b.fecha) - new Date(a.fecha);
      if (tipo === "compatibilidad") return (b.compatibilidad || 0) - (a.compatibilidad || 0);
      return 0;
    });
    setOfertas(sorted);
  };

  const handleCopy = (url) => navigator.clipboard.writeText(url).then(() => alert("✅ Link copiado"));
  const handleGoTo = (url) => window.open(url, "_blank");

  return (
    <div className="container">
      <h1 className="titulo">🎰 Postulomanía 🎰</h1>

      <div className="orden-buttons">
        <button onClick={() => ordenarOfertas("fecha")} className={orden==="fecha"?"active":""}><FaCalendarAlt /> Fecha</button>
        <button onClick={() => ordenarOfertas("compatibilidad")} className={orden==="compatibilidad"?"active":""}><FaSortAmountDown /> Compatibilidad</button>
      </div>

      <div className="cards">
        {ofertas.map(o => (
          <div 
            key={o.id} 
            className={`card ${detalleId === o.oferta_id ? "open" : ""}`} 
            style={{ position: "relative", pointerEvents: detalleId === o.oferta_id ? "none" : "auto" }}
          >
            <h2>{o.cargo}</h2>
            <p><strong>Ciudad:</strong> {o.ciudad}</p>
            <p><strong>Compatibilidad:</strong> {o.compatibilidad || 0}</p>
            <p className="fecha">{o.fecha ? new Date(o.fecha).toLocaleDateString() : ""}</p>

            <div className="card-buttons">
              <button onClick={() => handleGoTo(o.url)} disabled={!o.url}><FaExternalLinkAlt /> Ir</button>
              <button onClick={() => handleCopy(o.url)} disabled={!o.url}><FaCopy /> Copiar</button>
              <button onClick={() => setDetalleId(prev => (prev === o.oferta_id ? null : o.oferta_id))}>
                Detalles
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mostrar la descripción de la oferta seleccionada */}
      {detalleId && (
        <OfertaDescripcion 
          ofertaId={detalleId} 
          onClose={() => setDetalleId(null)} 
        />
      )}
    </div>
  );
}
