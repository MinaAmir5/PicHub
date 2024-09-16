import About from "./components/About/About";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="about" element={<About />} />
            </Routes>
    );
}

export default App;