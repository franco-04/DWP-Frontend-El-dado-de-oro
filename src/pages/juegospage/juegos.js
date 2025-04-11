import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import tragamonedasImg from '../../images/tragamonedas.png';
import dadosImg from '../../images/dados.png';
import './juegos.css';

const Juegos = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
            return;
        }

        const handlePopState = (e) => {
            // Eliminar credenciales y redirigir
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login', { replace: true });
            
            // Limpiar todo el historial de navegación
            window.history.pushState(null, null, window.location.href);
        };

        // Configurar el estado inicial de la historia
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-main">
                <div className="juegos-container">
                    <h1 className="juegos-titulo">Nuestros Juegos</h1>
                    <div className="juegos-grid">
                        {/* Tarjeta Tragamonedas */}
                        <div className="juego-card">
                            <div className="juego-imagen-container">
                                <img 
                                    src={tragamonedasImg} 
                                    alt="Tragamonedas" 
                                    className="juego-imagen"
                                />
                                <div className="juego-overlay">
                                    <h3>Tragamonedas Clásico</h3>
                                    <p>Gira los rodillos y gana grandes premios</p>
                                </div>
                            </div>
                            <button className="auth-button juego-boton">
                                Jugar Ahora
                            </button>
                        </div>
                        {/* Tarjeta Dados */}
                        <div className="juego-card">
                            <div className="juego-imagen-container">
                                <img 
                                    src={dadosImg} 
                                    alt="Juego de Dados" 
                                    className="juego-imagen"
                                />
                                <div className="juego-overlay">
                                    <h3>Dados Dorados</h3>
                                    <p>Acierta la combinación ganadora</p>
                                </div>
                            </div>
                            <button className="auth-button juego-boton">
                                Lanzar Dados
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Juegos;