import React from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import "./Contact.css"; // Asegúrate de crear este CSS con los mismos estilos "auth-"

const Contacto = () => {
  return (
    <div className="auth-page">
      <Header />
      <main className="auth-main">
        <div className="auth-form-container">
          <h2>Contáctanos</h2>
          <form>
            <div className="form-group">
              <label>Nombre</label>
              <input 
                type="text" 
                placeholder="Ej: Juan Pérez"
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Ej: contacto@casinodorado.com"
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <label>Asunto</label>
              <input 
                type="text" 
                placeholder="Ej: Consulta sobre membresías"
                className="auth-input"
              />
            </div>
            <div className="form-group">
              <label>Mensaje</label>
              <textarea
                placeholder="Escribe tu mensaje aquí..."
                rows="5"
                className="auth-input"
                style={{ minHeight: "150px",
                  resize: "none"
                }}
              />
            </div>

            <button type="submit" className="auth-button">
              Enviar Mensaje
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacto;