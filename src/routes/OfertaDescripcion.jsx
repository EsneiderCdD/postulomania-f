import { useEffect, useState } from "react";

export default function OfertaDescripcion({ ofertaId, onClose }) {
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDescripcion = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/ofertas`);
        const data = await res.json();
        const oferta = data.find(o => o.id === ofertaId);
        setDescripcion(oferta?.descripcion || "No disponible");
      } catch (error) {
        console.error("Error fetching descripción:", error);
        setDescripcion("Error al cargar la descripción");
      } finally {
        setLoading(false);
      }
    };

    fetchDescripcion();
  }, [ofertaId]);

  if (!ofertaId) return null;

  return (
    <div style={{
      position: "absolute",
      background: "#222",
      color: "#fff",
      border: "1px solid #444",
      borderRadius: "8px",
      padding: "15px",
      width: "300px",
      top: "100%",
      left: "0",
      zIndex: 1000,
      boxShadow: "0 2px 10px rgba(0,0,0,0.5)"
    }}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h4>Descripción</h4>
          <p>{descripcion}</p>
          <button onClick={onClose} style={{
            marginTop: "10px",
            padding: "5px 10px",
            fontSize: "14px",
            cursor: "pointer"
          }}>Cerrar</button>
        </>
      )}
    </div>
  );
}
