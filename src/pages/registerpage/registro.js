import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  registerUser,
  checkUsername,
  checkEmail,
  verifyRegistration,
} from "../../services/auth"; // Añadir verifyRegistration
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import "./registro.css";

const Registro = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form");
  const [qrData, setQrData] = useState("");
  const [otp, setOtp] = useState(""); 
  const navigate = useNavigate();

  const validateField = async (name, value) => {
    let error = "";

    switch (name) {
      case "username":
        if (!/^[a-zA-Z0-9]{3,20}$/.test(value)) {
          error = "3-20 caracteres alfanuméricos";
        } else {
          try {
            const { available } = await checkUsername(value);
            if (!available) error = "Usuario ya existe";
          } catch (err) {
            error = "Error verificando usuario";
          }
        }
        break;

      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Formato de email inválido";
        } else {
          try {
            const { available } = await checkEmail(value);
            if (!available) error = "Email ya registrado";
          } catch (err) {
            error = "Error verificando email";
          }
        }
        break;

      case "password":
        if (!/(?=.*[A-Z])(?=.*\d).{8,}/.test(value)) {
          error = "Mínimo 8 caracteres, 1 mayúscula y 1 número";
        }
        break;
      default:
        error = `Campo ${name} no reconocido`;
        break;
    }

    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validar cada campo
    const fieldsToValidate = ["username", "email", "password"];
    for (const field of fieldsToValidate) {
      const error = await validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await registerUser(formData);
        setQrData(response.secret);
        setStep("qr");
      } catch (error) {
        setErrors({ general: error.message });
      }
    }
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyRegistration(formData.email, otp);
      navigate("/login");
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <main className="auth-main">
        <div className="auth-form-container">
          {step === "form" ? (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre de usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className={`auth-input ${errors.username ? "invalid" : ""}`}
                  placeholder="Ej: JugadorMaster"
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`auth-input ${errors.email ? "invalid" : ""}`}
                  placeholder="Ej: contacto@casinodorado.com"
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`auth-input ${errors.password ? "invalid" : ""}`}
                  placeholder="Crea tu contraseña"
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {errors.general && (
                <div className="error-message">{errors.general}</div>
              )}

              <button type="submit" className="auth-button">
                Crear Cuenta
              </button>
            </form>
          ) : (
            <div className="qr-section">
              <h2>Verificación MFA</h2>
              <div className="qr-container">
                <QRCodeSVG
                  value={qrData}
                  size={256}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                />
              </div>
              <form onSubmit={handleVerifyOTP}>
                <div className="form-group">
                  <label>Ingresa el código de verificación</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="auth-input"
                    placeholder="Código de 6 dígitos"
                  />
                </div>
                {errors.general && (
                  <div className="error-message">{errors.general}</div>
                )}
                <button type="submit" className="auth-button">
                  Verificar Código
                </button>
              </form>
            </div>
          )}
          <p className="auth-link">
            ¿Ya tienes cuenta? <Link to="/login">¡Inicia sesión!</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registro;
