import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../src/pages/loginpage/Login';
import Registro from './pages/registerpage/registro';
import Contacto from './pages/contacpage/Contact';
import Home from './homepage/homepage';
import Recarga from './pages/recargapage/recargapage';
import Juegos from './pages/juegospage/juegos';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/contacto" element={<Contacto />} /> 
                <Route path="/recarga" element={<Recarga />} />
                <Route path="/juegos" element={<Juegos />} />


            </Routes>
        </Router>
    );
}

export default App;