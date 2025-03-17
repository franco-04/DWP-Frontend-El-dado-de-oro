import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import tragamonedasImg from '../../images/tragamonedas.png';
import dadosImg from '../../images/dados.png';
import './juegos.css';

const Juegos = () => {
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
