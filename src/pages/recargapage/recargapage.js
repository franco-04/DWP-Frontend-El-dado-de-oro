import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import { createPayPalOrder, capturePayPalOrder, getUserFichas } from '../../services/payments';
import './recarga.css';

const Recarga = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [currentFichas, setCurrentFichas] = useState(0);
    const [selectedPaquete, setSelectedPaquete] = useState(null);
    const [showPayPal, setShowPayPal] = useState(false);

    // Datos de paquetes de fichas
    const paquetes = [
        { id: 0, fichas: 100, precio: 5.00 },
        { id: 1, fichas: 250, precio: 10.00 },
        { id: 2, fichas: 500, precio: 20.00 },
        { id: 3, fichas: 1000, precio: 35.00 },
        { id: 4, fichas: 2500, precio: 75.00 },
        { id: 5, fichas: 5000, precio: 120.00 }
    ];

    // Cargar fichas actuales del usuario
    useEffect(() => {
        const fetchFichas = async () => {
            try {
                // Verificar si hay token
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login?redirect=recarga');
                    return;
                }
                
                const result = await getUserFichas();
                setCurrentFichas(result.fichas);
            } catch (err) {
                console.error("Error al cargar fichas:", err);
                // Si hay error de autenticación
                if (err.toString().includes('403') || err.toString().includes('401')) {
                    navigate('/login?redirect=recarga');
                }
            }
        };

        fetchFichas();
    }, [navigate]);

    // Manejar selección de paquete
    const handleSelectPaquete = (paquete) => {
        setSelectedPaquete(paquete);
        setShowPayPal(true);
        setError(null);
        setSuccess(null);
    };

    // Crear orden de PayPal
    const createOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await createPayPalOrder(selectedPaquete.id);
            setLoading(false);
            return result.orderId;
        } catch (err) {
            setLoading(false);
            setError(err.message || "Ocurrió un error al crear la orden");
            return null;
        }
    };

    // Capturar pago de PayPal
    const onApprove = async (data) => {
        try {
            setLoading(true);
            setError(null);
            
            const result = await capturePayPalOrder(data.orderID);
            setLoading(false);
            
            // Actualizar fichas
            setCurrentFichas(prev => prev + selectedPaquete.fichas);
            setSuccess(`¡Pago completado! Has recibido ${result.fichasAñadidas} fichas.`);
            setSelectedPaquete(null);
            setShowPayPal(false);
            
            // Después de 3 segundos, limpiar el mensaje de éxito
            setTimeout(() => {
                setSuccess(null);
            }, 5000);
            
            return true;
        } catch (err) {
            setLoading(false);
            setError(err.message || "Ocurrió un error al procesar el pago");
            return false;
        }
    };
    
    const cancelPayment = () => {
        setSelectedPaquete(null);
        setShowPayPal(false);
    };

    return (
        <div className="auth-page">
            <Header />
            <main className="auth-main">
                <div className="recarga-container">
                    <div className="recarga-header">
                        <h1>Recarga de Fichas</h1>
                        <p>Selecciona tu paquete preferido</p>

                    </div>
                    
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}
                    
                    {!selectedPaquete ? (
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
                                    <button 
                                        className="auth-button"
                                        onClick={() => handleSelectPaquete(paquete)}
                                        disabled={loading}
                                    >
                                        {loading ? 'Cargando...' : 'Comprar Ahora'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="checkout-container">
                            <div className="checkout-summary">
                                <h2>Resumen de Compra</h2>
                                <div className="checkout-details">
                                    <p><strong>Paquete:</strong> {selectedPaquete.fichas} Fichas</p>
                                    <p><strong>Precio:</strong> ${selectedPaquete.precio.toFixed(2)} USD</p>
                                </div>
                                
                                {showPayPal && (
                                    <div className="paypal-container">
                                        <PayPalScriptProvider options={{ 
                                            "client-id": "AVhg-_dHnGnInjdRa4t5AkCvb-FxoyHGiju6YeaU6uN8fhfp3pjbSqcEcFRn8rjisD5lNUyRqPuOhmlt",
                                            currency: "USD"
                                        }}>
                                            <PayPalButtons
                                                style={{ 
                                                    color: "gold",
                                                    shape: "rect",
                                                    label: "pay"
                                                }}
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={(err) => setError("Error de PayPal: " + err)}
                                            />
                                        </PayPalScriptProvider>
                                        
                                        <button 
                                            className="cancel-button"
                                            onClick={cancelPayment}
                                            disabled={loading}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
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