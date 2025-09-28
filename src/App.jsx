import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [ofertas, setOfertas] = useState([]);
  const [orden, setOrden] = useState("fecha"); // Orden por defecto

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

  // Función para ordenar ofertas según el tipo seleccionado
  const ordenarOfertas = (tipo) => {
    setOrden(tipo);

    const sorted = [...ofertas].sort((a, b) => {
      if (tipo === "fecha") {
        return new Date(b.fecha) - new Date(a.fecha);
      } else if (tipo === "compatibilidad") {
        return (b.compatibilidad || 0) - (a.compatibilidad || 0);
      }
      return 0;
    });

    setOfertas(sorted);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => alert("✅ Link copiado al portapapeles"))
      .catch(err => console.error("Error al copiar:", err));
  };

  const handleGoTo = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container">
      <h1 className="titulo">Ofertas</h1>

      {/* Botones de orden */}
      <div className="orden-buttons">
        <button 
          onClick={() => ordenarOfertas("fecha")}
          className={orden === "fecha" ? "active" : ""}
        >
          Ordenar por Fecha
        </button>
        <button 
          onClick={() => ordenarOfertas("compatibilidad")}
          className={orden === "compatibilidad" ? "active" : ""}
        >
          Ordenar por Compatibilidad
        </button>
      </div>

      <div className="cards">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="card">
            <h2>{oferta.cargo}</h2>
            <p><strong>Ciudad:</strong> {oferta.ciudad}</p>
            <p><strong>Compatibilidad:</strong> {oferta.compatibilidad || 0}</p>
            <p className="fecha">
              {oferta.fecha ? new Date(oferta.fecha).toLocaleDateString() : ""}
            </p>
            <div className="card-buttons">
              <button onClick={() => handleGoTo(oferta.url)} disabled={!oferta.url}>
                Ir al enlace
              </button>
              <button onClick={() => handleCopy(oferta.url)} disabled={!oferta.url}>
                Copiar link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
