import Sign from "./components/Sign/Sign";
import Home from "./components/Home/Home";
import ViewPic from './components/View/view';
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./commons/auth";


function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="sign" element={<Sign />} />
                <Route path="/view/:num" element={<ViewPic />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;