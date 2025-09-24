import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [ofertas, setOfertas] = useState([]);

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/analisis"); 
        const data = await res.json();

        // Ordenar de más reciente a más antigua según fecha_analisis
        data.sort((a, b) => new Date(b.fecha_analisis) - new Date(a.fecha_analisis));

        setOfertas(data);
      } catch (error) {
        console.error("Error fetching ofertas:", error);
      }
    };
    fetchOfertas();
  }, []);

  const handleCopy = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("✅ Link copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar:", err);
      });
  };

  const handleGoTo = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="container">
      <h1 className="titulo">Ofertas</h1>
      <div className="cards">
        {ofertas.map((oferta) => (
          <div key={oferta.id} className="card">
            <h2>{oferta.cargo}</h2>
            <p>
              <strong>Ciudad:</strong> {oferta.ciudad}
            </p>
            <p>
              <strong>Compatibilidad:</strong> {oferta.compatibilidad}
            </p>
            <p className="fecha">
              {oferta.fecha_analisis
                ? new Date(oferta.fecha_analisis).toLocaleDateString()
                : ""}
            </p>
            <div className="card-buttons">
              <button 
                onClick={() => handleGoTo(oferta.url)}
                disabled={!oferta.url}
              >
                Ir al enlace
              </button>
              <button 
                onClick={() => handleCopy(oferta.url)}
                disabled={!oferta.url}
              >
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
