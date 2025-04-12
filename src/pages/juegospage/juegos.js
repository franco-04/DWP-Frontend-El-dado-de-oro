import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import tragamonedasImg from "../../images/tragamonedas.png";
import dadosImg from "../../images/dados.png";
import "./juegos.css";
import { deductFichas } from "../../services/payments";
import { getUserFichas } from "../../services/payments";
import api from '../../services/api';

const WinModal = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="win-modal-container">
      <div className="win-modal-content">
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="confetti"></div>
        <div className="win-modal-message">{message}</div>
        <div className="sparkles">✨✨✨</div>
      </div>
    </div>
  );
};

const Juegos = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [slots, setSlots] = useState(["?", "?", "?"]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [winMessage, setWinMessage] = useState("");
  
  // Refs para las animaciones de los slots
  const slotRefs = [useRef(null), useRef(null), useRef(null)];
  const [slotSymbols] = useState(["🍒", "🍊", "🍋", "💎", "7️⃣"]);
  const [visibleSymbols, setVisibleSymbols] = useState([0, 0, 0]);

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

  const updateSlotAnimation = (slotIndex, finalSymbol) => {
    if (!slotRefs[slotIndex].current) return;
    
    let currentPos = 0;
    const animationDuration = 1000 + slotIndex * 500;
    const interval = 100;
    const totalSteps = animationDuration / interval;
    let currentStep = 0;
    
    const animateSlot = () => {
      if (currentStep >= totalSteps) {
        setVisibleSymbols(prev => {
          const newSymbols = [...prev];
          newSymbols[slotIndex] = finalSymbol;
          return newSymbols;
        });
        return;
      }
      
      currentPos = Math.floor(Math.random() * slotSymbols.length);
      setVisibleSymbols(prev => {
        const newSymbols = [...prev];
        newSymbols[slotIndex] = currentPos;
        return newSymbols;
      });
      
      currentStep++;
      setTimeout(animateSlot, interval);
    };
    
    animateSlot();
  };

  const spinSlots = () => {
    setIsSpinning(true);
    
    const willWin = Math.random() < 0.5;
    
    let finalSlots;
    if (willWin) {
      const randomSymbol = Math.floor(Math.random() * 5);
      finalSlots = [randomSymbol, randomSymbol, randomSymbol];
    } else {
      const firstSymbol = Math.floor(Math.random() * 5);
      let secondSymbol, thirdSymbol;
      
      do {
        secondSymbol = Math.floor(Math.random() * 5);
      } while (secondSymbol === firstSymbol);
      
      if (Math.random() < 0.5) {
        thirdSymbol = firstSymbol;
      } else {
        thirdSymbol = secondSymbol;
      }
      
      finalSlots = [firstSymbol, secondSymbol, thirdSymbol];
    }
    
    finalSlots.forEach((symbol, index) => {
      setTimeout(() => {
        updateSlotAnimation(index, symbol);
      }, 200 * index);
    });
    
    setTimeout(() => {
      setSlots(finalSlots);
      setIsSpinning(false);
      checkSlotWin(finalSlots);
    }, 2500);
  };

  const rollDice = () => {
    setDiceResult("...");
    setTimeout(() => {
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
        setWinMessage('🎉 ¡Ganaste 50 fichas! 🎉');
        setShowWinModal(true);
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
        setWinMessage('🎲 ¡Número correcto! +20 fichas 🎉');
        setShowWinModal(true);
      } catch (error) {
        console.error('Error al añadir fichas:', error);
      }
    }
  };

  const handleStartDiceGame = () => {
    setIsPlaying(true);
    setDiceResult(null);
  };

  const resetDiceGame = () => {
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
            <div className="juego-card">
              <div className="juego-imagen-container">
                {isSpinning ? (
                  <div className="slots-animation">
                    {[0, 1, 2].map((i) => (
                      <div 
                        key={i} 
                        className="slot spinning-slot" 
                        ref={slotRefs[i]}
                      >
                        {slotSymbols[visibleSymbols[i]]}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {slots[0] === "?" ? (
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
                    ) : (
                      <div className="slots-animation">
                        {slots.map((slot, i) => (
                          <div key={i} className="slot">
                            {slotSymbols[slot]}
                          </div>
                        ))}
                      </div>
                    )}
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
              ) : diceResult ? (
                <button
                  className="auth-button juego-boton"
                  onClick={resetDiceGame}
                >
                  Jugar de nuevo
                </button>
              ) : (
                <button
                  className="auth-button juego-boton"
                  onClick={() => handlePlay("dados")}
                >
                  Lanzar dado (10 fichas)
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      {showWinModal && (
        <WinModal 
          message={winMessage}
          onClose={() => setShowWinModal(false)}
        />
      )}
      <Footer />
    </div>
  );
};

export default Juegos;