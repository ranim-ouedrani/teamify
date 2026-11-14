import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';
import Logo from '../components/Logo';

const ActivateAccount = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    email: '',
    generatedId: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Étape 1 : Demande d'envoi de l'identifiant attribué
  const handleStep1Submit = (e) => {
    e.preventDefault();
    console.log("Demande d'identifiant pour :", {
      nom: formData.lastName,
      prenom: formData.firstName,
      email: formData.email,
    });
    // Simulation d'envoi d'e-mail -> passage à l'étape 2
    setStep(2);
  };

  // Étape 2 : Activation finale du compte
  const handleStep2Submit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    if (!formData.acceptTerms) {
      alert("Veuillez accepter l'utilisation de vos données.");
      return;
    }

    console.log('Activation du compte avec :', formData);
    // Appeler ici l'API REST de votre microservice (ex: POST /api/auth/activate)
  };

  return (
    <div className="auth-container">
      {/* Panneau Gauche : Présentation TeamiFy */}
      <div className="auth-banner">
        <div className="banner-content">
          <div className="logo-container">
            <Logo size={54} />
          </div>

          <h1 className="banner-title">
            Activation de votre <br /> compte académique
          </h1>
          <p className="banner-subtitle">
            Validation rapide en deux étapes pour activer votre accès sécurisé à la plateforme de gestion et de collaboration.
          </p>
        </div>
      </div>

      {/* Panneau Droit : Formulaire multi-étapes */}
      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Activer mon compte ✨</h2>
            <div className="step-indicator">
              <span className={`step-badge ${step === 1 ? 'active' : ''}`}>Étape 1 sur 2</span>
              <span className={`step-badge ${step === 2 ? 'active' : ''}`}>Étape 2 sur 2</span>
            </div>
          </div>

          {/* ÉTAPE 1 : Demander l'identifiant par e-mail */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="auth-form">
              <div className="input-group">
                <label htmlFor="lastName">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Ex: Fattoumi"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Ex: Oussema"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Adresse E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="exemple@esprit.tn"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-primary">
                Recevoir mon identifiant
              </button>

              <div className="form-footer">
                <p>
                  Déjà activé ? <Link to="/login" className="login-link">Se connecter</Link>
                </p>
              </div>
            </form>
          )}

          {/* ÉTAPE 2 : Finaliser la création du mot de passe */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="auth-form">
              <div className="info-box">
                Un e-mail contenant votre identifiant unique vient de vous être envoyé.
              </div>

              <div className="input-group">
                <label htmlFor="generatedId">Identifiant reçu par e-mail</label>
                <input
                  type="text"
                  id="generatedId"
                  name="generatedId"
                  placeholder="Ex: ETU-2026-948"
                  value={formData.generatedId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>J'accepte l'utilisation de mes données personnelles</span>
                </label>
              </div>

              <div className="button-group">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                  Retour
                </button>
                <button type="submit" className="btn-primary">
                  Activer mon compte
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;