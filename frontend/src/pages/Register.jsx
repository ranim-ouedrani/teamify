import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import Logo from '../components/Logo';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'ETUDIANT',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleSelect = (selectedRole) => {
    setFormData((prev) => ({
      ...prev,
      role: selectedRole,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas !');
      return;
    }
    console.log("Données d'inscription :", formData);
    // Simulation ou appel vers votre microservice d'inscription
    navigate('/activate');
  };

  return (
    <div className="auth-container">
      {/* Panneau Gauche : Bannière / Branding */}
      <div className="auth-banner">
        <div className="banner-content">
          <div className="logo-container">
            <Logo size={54} />
          </div>

          <h1 className="banner-title">
            Rejoins la communauté <br /> d'apprentissage
          </h1>
          <p className="banner-subtitle">
            Crée ton compte pour accéder aux groupes intelligents, valider tes compétences et collaborer sur des projets académiques.
          </p>
        </div>
      </div>

      {/* Panneau Droit : Formulaire */}
      <div className="auth-form-wrapper">
        <div className="auth-form-container">
          <div className="form-header">
            <h2>Créer un compte ✨</h2>
            <p>Choisis ton rôle et complète tes informations</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Sélection du Rôle */}
            <div className="input-group">
              <label>Je suis :</label>
              <div className="role-selector">
                <button
                  type="button"
                  className={`role-card ${formData.role === 'ETUDIANT' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('ETUDIANT')}
                >
                  <span className="role-icon">🎓</span>
                  <span className="role-label">Étudiant</span>
                </button>

                <button
                  type="button"
                  className={`role-card ${formData.role === 'ENSEIGNANT' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('ENSEIGNANT')}
                >
                  <span className="role-icon">👨‍🏫</span>
                  <span className="role-label">Enseignant</span>
                </button>

                <button
                  type="button"
                  className={`role-card ${formData.role === 'ADMINISTRATEUR' ? 'active' : ''}`}
                  onClick={() => handleRoleSelect('ADMINISTRATEUR')}
                >
                  <span className="role-icon">⚙️</span>
                  <span className="role-label">Admin</span>
                </button>
              </div>
            </div>

            {/* Prénom et Nom */}
            <div className="form-row">
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
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="email">Adresse E-mail académique</label>
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

            {/* Mots de passe */}
            <div className="form-row">
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
                <label htmlFor="confirmPassword">Confirmation</label>
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
            </div>

            <button type="submit" className="btn-primary">
              S'inscrire
            </button>

            <div className="form-footer">
              <p>
                Déjà un compte ? <Link to="/login" className="login-link">Se connecter</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;