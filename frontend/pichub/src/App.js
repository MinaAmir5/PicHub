import Sign from "./components/Sign/Sign";
import Home from "./components/Home/Home";
import { Routes, Route } from "react-router-dom";

function App() {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="sign" element={<Sign />} />
            </Routes>
    );
}

export default App;