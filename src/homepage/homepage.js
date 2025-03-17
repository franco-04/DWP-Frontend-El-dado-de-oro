import React from "react";
import Header from "../pages/layouts/Header";
import Footer from "../pages/layouts/Footer";
import "./homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <Header />
      <main className="homepage-main">
        <div className="content-container">
          <div className="text-container">
            <h1>Bienvenido al Dado de oro</h1>
            <p>
              Sumérgete en la emoción y el lujo de nuestro exclusivo casino.
              Aquí encontrarás una amplia variedad de juegos. ¡Diviértete y gana
              grandes premios!
            </p>
            <p>
              Regístrate ahora para obtener acceso. Si ya eres miembro, inicia
              sesión para continuar disfrutando de la mejor experiencia de juego
              en línea.
            </p>
            <div className="buttons-container">
              <button className="login-button">
                <a href="/login" className="no-underline text-inherit">
                  Iniciar Sesión
                </a>
              </button>
              <button className="register-button">
                <a href="/registro" className="no-underline text-inherit">
                  Registrarme
                </a>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
