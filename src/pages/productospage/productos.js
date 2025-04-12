import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import "./productos.css";
import { getUserFichas } from "../../services/payments";
import api from '../../services/api';

// Importar imágenes de productos (estas serían tus imágenes reales)
import producto1Img from "../../images/teclado.png";
import producto2Img from "../../images/Audifonos.png";
import producto3Img from "../../images/pad.png";

const Productos = () => {
  const navigate = useNavigate();
  const [userFichas, setUserFichas] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Lista de productos disponibles
  const productos = [
    {
      id: 1,
      nombre: "Teclado Gaming RGB",
      descripcion: "Teclado mecánico con retroiluminación RGB personalizable",
      precio: 500,
      imagen: producto1Img
    },
    {
      id: 2,
      nombre: "Auriculares Gaming",
      descripcion: "Auriculares con sonido envolvente 7.1 y micrófono retráctil",
      precio: 300,
      imagen: producto2Img
    },
    {
      id: 3,
      nombre: "Mousepad XL",
      descripcion: "Mousepad de gran tamaño con superficie de precisión",
      precio: 150,
      imagen: producto3Img
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Obtener fichas del usuario
    const fetchFichas = async () => {
      try {
        const response = await getUserFichas();
        setUserFichas(response?.data?.fichas || 0);
      } catch (err) {
        setError("Error al cargar tus fichas");
      }
    };

    fetchFichas();

    // Actualizar fichas cuando cambian
    const handleFichasUpdate = () => {
      fetchFichas();
    };

    window.addEventListener("fichasUpdated", handleFichasUpdate);
    return () => {
      window.removeEventListener("fichasUpdated", handleFichasUpdate);
    };
  }, [navigate]);

  // Función para canjear producto
  const canjearProducto = async (producto) => {
    setError("");
    setSuccess("");
    setLoading(true);

    if (userFichas < producto.precio) {
      setError(`No tienes suficientes fichas para canjear ${producto.nombre}`);
      setLoading(false);
      return;
    }

    try {
      // Llamada a la API para procesar el canje
      await api.post('/api/user/canjear-producto', { 
        productoId: producto.id,
        precioFichas: producto.precio 
      });
      
      // Actualizar fichas del usuario
      const response = await getUserFichas();
      setUserFichas(response?.data?.fichas || 0);
      
      // Notificar a otros componentes
      window.dispatchEvent(new Event('fichasUpdated'));
      
      setSuccess(`¡Has canjeado ${producto.nombre} exitosamente!`);
    } catch (err) {
      setError(err.response?.data?.error || "Error al procesar el canje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <main className="auth-main">
        <div className="productos-container">
          <h1 className="productos-titulo">Canjea tus Fichas</h1>
          <div className="fichas-disponibles">
            <span>Fichas disponibles: </span>
            <span className="fichas-count">{userFichas}</span>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="productos-grid">
            {productos.map((producto) => (
              <div className="producto-card" key={producto.id}>
                <div className="producto-imagen-container">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="producto-imagen"
                  />
                  <div className="producto-overlay">
                    <h3>{producto.nombre}</h3>
                    <p>{producto.descripcion}</p>
                  </div>
                </div>
                <div className="producto-footer">
                  <div className="producto-precio">
                    <span>{producto.precio}</span>
                    <span className="fichas-icon">🪙</span>
                  </div>
                  <button
                    className={`auth-button producto-boton ${
                      loading || userFichas < producto.precio ? "disabled" : ""
                    }`}
                    onClick={() => canjearProducto(producto)}
                    disabled={loading || userFichas < producto.precio}
                  >
                    {loading ? "Procesando..." : "Canjear Ahora"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Productos;