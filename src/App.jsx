import { BrowserRouter, Routes, Route } from "react-router-dom";
import Penjualan from "./pages/Penjualan";

const App = ()=> {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Penjualan />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App