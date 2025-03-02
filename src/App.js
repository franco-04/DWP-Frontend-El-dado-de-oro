import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../src/pages/loginpage/Login';
import Registro from './pages/registerpage/registro';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                {/* Otras rutas pueden ir aquí */}
            </Routes>
        </Router>
    );
}

export default App;