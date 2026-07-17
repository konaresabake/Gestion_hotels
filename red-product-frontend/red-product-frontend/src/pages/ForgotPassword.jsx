import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { forgotPassword } from "../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-card-title">Mot de passe oublié?</p>
        <p className="auth-subtext">
          Entrez votre adresse e-mail ci-dessous et nous vous envoyons des instructions sur la
          façon de modifier votre mot de passe.
        </p>

        <div className="auth-field">
          <input
            type="email"
            placeholder="Votre e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {sent && (
          <p style={{ color: "#2e8b57", fontSize: 13, marginTop: -8, marginBottom: 16 }}>
            Si ce compte existe, un email a été envoyé.
          </p>
        )}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer"}
        </button>
      </form>

      <p className="auth-links">
        Revenir à la <Link to="/login">connexion</Link>
      </p>
    </AuthLayout>
  );
}
