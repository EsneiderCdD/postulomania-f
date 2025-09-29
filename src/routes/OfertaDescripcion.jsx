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
      position: "fixed",
      top: "100px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "600px",
      maxHeight: "400px",
      overflowY: "auto",
      background: "#222",
      color: "#fff",
      border: "1px solid #444",
      borderRadius: "8px",
      padding: "20px",
      zIndex: 9999,
      boxShadow: "0 4px 20px rgba(0,0,0,0.7)"
    }}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <p>{descripcion}</p>
          <button onClick={onClose} style={{
            marginTop: "15px",
            padding: "5px 10px",
            fontSize: "14px",
            cursor: "pointer"
          }}>Cerrar</button>
        </>
      )}
    </div>
  );
}
