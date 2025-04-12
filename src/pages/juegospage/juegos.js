import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import tragamonedasImg from "../../images/tragamonedas.png";
import dadosImg from "../../images/dados.png";
import "./juegos.css";
import { deductFichas } from "../../services/payments";
import { getUserFichas } from "../../services/payments";
import api from '../../services/api';

const Juegos = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [slots, setSlots] = useState(["?", "?", "?"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [diceResult, setDiceResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const handlePopState = (e) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
      window.history.pushState(null, null, window.location.href);
    };

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  // En el handlePlay del componente Juegos
  const handlePlay = async (gameType) => {
    setError("");
  
    try {
      const response = await getUserFichas();
      const fichas = response?.data?.fichas || 0;
  
      if (fichas < 10) {
        setError("Fichas insuficientes. Recarga para seguir jugando.");
        return;
      }
  
      // eslint-disable-next-line no-unused-vars
      const newFichas = (await deductFichas(10))?.data?.fichas || fichas - 10;
  
      window.dispatchEvent(new Event("fichasUpdated"));
  
      if (gameType === "tragamonedas") spinSlots();
      if (gameType === "dados") rollDice();
      
    } catch (err) {
      setError(err.message);
      window.dispatchEvent(new Event("fichasUpdated"));
    }
  };


  const spinSlots = () => {
    setIsSpinning(true);
    setTimeout(() => {
      const newSlots = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * 5)
      );
      setSlots(newSlots);
      setIsSpinning(false);
      checkSlotWin(newSlots);
    }, 2000);
  };

  const rollDice = () => {
    setDiceResult("...");
    setTimeout(() => {
      const result = Array.from(
        { length: 2 },
        () => Math.floor(Math.random() * 6) + 1
      );
      setDiceResult(result.join(" - "));
      checkDiceWin(result);
    }, 1500);
  };

  const checkSlotWin = async (slots) => {
    if (new Set(slots).size === 1) {
      try {
        await api.post('/api/user/add-fichas', { amount: 50 });
        window.dispatchEvent(new Event('fichasUpdated'));
        alert('¡Ganaste 50 fichas!');
      } catch (error) {
        console.error('Error al añadir fichas:', error);
      }
    }
  };

  const checkDiceWin = async (dice) => {
    if (dice[0] === dice[1]) {
      try {
        await api.post('/api/user/add-fichas', { amount: 20 });
        window.dispatchEvent(new Event('fichasUpdated'));
        alert('¡Ganaste 20 fichas!');
      } catch (error) {
        console.error('Error al añadir fichas:', error);
      }
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <main className="auth-main">
        <div className="juegos-container">
          <h1 className="juegos-titulo">Nuestros Juegos</h1>
          {error && <div className="error-message">{error}</div>}
          <div className="juegos-grid">
            {/* Tarjeta Tragamonedas */}
            <div className="juego-card">
              <div className="juego-imagen-container">
                {isSpinning ? (
                  <div className="slots-animation">
                    {slots.map((slot, i) => (
                      <div key={i} className="slot">
                        {["🍒", "🍊", "🍋", "💎", "7️⃣"][slot]}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <img
                      src={tragamonedasImg}
                      alt="Tragamonedas"
                      className="juego-imagen"
                    />
                    <div className="juego-overlay">
                      <h3>Tragamonedas Clásico</h3>
                      <p>Gira los rodillos y gana grandes premios</p>
                    </div>
                  </>
                )}
              </div>
              <button
                className={`auth-button juego-boton ${
                  isSpinning ? "disabled" : ""
                }`}
                onClick={() => handlePlay("tragamonedas")}
                disabled={isSpinning}
              >
                {isSpinning ? "Girando..." : "Jugar (10 fichas)"}
              </button>
            </div>
            {/* Tarjeta Dados */}
            <div className="juego-card">
              <div className="juego-imagen-container">
                {diceResult ? (
                  <div className="dice-animation">
                    <div className="dice-result">{diceResult}</div>
                  </div>
                ) : (
                  <>
                    <img
                      src={dadosImg}
                      alt="Juego de Dados"
                      className="juego-imagen"
                    />
                    <div className="juego-overlay">
                      <h3>Dados Dorados</h3>
                      <p>Acierta la combinación ganadora</p>
                    </div>
                  </>
                )}
              </div>
              <button
                className="auth-button juego-boton"
                onClick={() => handlePlay("dados")}
              >
                Lanzar (10 fichas)
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
