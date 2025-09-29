import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Analisis from "./Analisis";
import Metrics from "./Metrics";


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/metrics" element={<Metrics />} />
       
      </Routes>
    </BrowserRouter>
  );
}
