import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Analisis from "./Analisis";
import Metrics from "./Metrics";
import Buscar from "./Buscar";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/metrics" element={<Metrics />} />
        <Route path="/buscar" element={<Buscar />} />
      </Routes>
    </BrowserRouter>
  );
}
