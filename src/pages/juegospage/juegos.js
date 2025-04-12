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
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

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
      // Aumentar probabilidad a 50%
      const willWin = Math.random() < 0.5;
      
      let newSlots;
      if (willWin) {
        // Si va a ganar, hacer todos los símbolos iguales
        const randomSymbol = Math.floor(Math.random() * 5);
        newSlots = [randomSymbol, randomSymbol, randomSymbol];
      } else {
        // Si no va a ganar, asegurarse de que al menos uno sea diferente
        const firstSymbol = Math.floor(Math.random() * 5);
        let secondSymbol, thirdSymbol;
        
        do {
          secondSymbol = Math.floor(Math.random() * 5);
        } while (secondSymbol === firstSymbol);
        
        // 50% probabilidad de que el tercero sea igual al primero o al segundo
        if (Math.random() < 0.5) {
          thirdSymbol = firstSymbol;
        } else {
          thirdSymbol = secondSymbol;
        }
        
        newSlots = [firstSymbol, secondSymbol, thirdSymbol];
      }
      
      setSlots(newSlots);
      setIsSpinning(false);
      checkSlotWin(newSlots);
    }, 2000);
  };

  const rollDice = () => {
    setDiceResult("...");
    setTimeout(() => {
      // Probabilidad del 50% de ganar
      const willWin = Math.random() < 0.5;
      
      const result = willWin ? selectedNumber : getRandomDifferentNumber(selectedNumber);
      setDiceResult(result);
      checkDiceWin(result);
    }, 1500);
  };

  const getRandomDifferentNumber = (selected) => {
    let result;
    do {
      result = Math.floor(Math.random() * 6) + 1;
    } while (result === selected);
    return result;
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
    if (dice === selectedNumber) {
      try {
        await api.post('/api/user/add-fichas', { amount: 20 });
        window.dispatchEvent(new Event('fichasUpdated'));
        alert('¡Ganaste 20 fichas!');
      } catch (error) {
        console.error('Error al añadir fichas:', error);
      }
    }
  };

  const handleStartDiceGame = () => {
    setIsPlaying(true);
    setDiceResult(null);
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
                    {isPlaying ? (
                      <div className="dice-selection">
                        <h4>Selecciona un número:</h4>
                        <div className="dice-options">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <button 
                              key={num}
                              className={`dice-option ${selectedNumber === num ? 'selected' : ''}`}
                              onClick={() => setSelectedNumber(num)}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
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
                          <p>Elige un número y prueba tu suerte</p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              {!isPlaying ? (
                <button
                  className="auth-button juego-boton"
                  onClick={handleStartDiceGame}
                >
                  Comenzar juego
                </button>
              ) : (
                <button
                  className="auth-button juego-boton"
                  onClick={() => handlePlay("dados")}
                  disabled={diceResult !== null}
                >
                  Lanzar dado (10 fichas)
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Juegos;