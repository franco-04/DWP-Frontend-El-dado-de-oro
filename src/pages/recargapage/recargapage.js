import React from 'react';
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './recarga.css'; // Archivo CSS nuevo

const Recarga = () => {
    // Datos de paquetes de fichas
    const paquetes = [
        { fichas: 100, precio: 5.00 },
        { fichas: 250, precio: 10.00 },
        { fichas: 500, precio: 20.00 },
        { fichas: 1000, precio: 35.00 },
        { fichas: 2500, precio: 75.00 },
        { fichas: 5000, precio: 120.00 }
    ];

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-main">
                <div className="recarga-container">
                    <div className="recarga-header">
                        <h1>Recarga de Fichas</h1>
                        <p>Selecciona tu paquete preferido</p>
                    </div>
                    
                    <div className="paquetes-grid">
                        {paquetes.map((paquete, index) => (
                            <div className="paquete-card" key={index}>
                                <div className="chip-icon">
                                    <svg viewBox="0 0 24 24" width="40" height="40">
                                        <path fill="#FFD700" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                                        <path fill="#FFD700" d="M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"/>
                                    </svg>
                                </div>
                                <div className="paquete-info">
                                    <span className="fichas">{paquete.fichas}</span>
                                    <span className="precio">${paquete.precio.toFixed(2)}</span>
                                </div>
                                <button className="auth-button">
                                    Comprar Ahora
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className="disclaimer">
                        * Los precios incluyen cargos por procesamiento. Fichas no reembolsables.
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Recarga;