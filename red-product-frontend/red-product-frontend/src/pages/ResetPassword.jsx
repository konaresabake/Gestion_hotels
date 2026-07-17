import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const linkInvalid = !uid || !token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({ uid, token, new_password: password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.new_password?.[0] ||
        "Ce lien est invalide ou a expiré. Refais une demande.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  if (linkInvalid) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <p className="auth-card-title">Lien invalide</p>
          <p className="auth-subtext">
            Ce lien de réinitialisation est incomplet ou incorrect. Refais une demande depuis
            l'écran "Mot de passe oublié".
          </p>
        </div>
        <p className="auth-links">
          Revenir à la <Link to="/forgot-password">demande de réinitialisation</Link>
        </p>
      </AuthLayout>
    );
  }

  if (done) {
    return (
      <AuthLayout>
        <div className="auth-card">
          <p className="auth-card-title">Mot de passe mis à jour</p>
          <p className="auth-subtext">
            Ton mot de passe a bien été changé. Redirection vers la connexion...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-card-title">Nouveau mot de passe</p>
        <p className="auth-subtext">Choisis un nouveau mot de passe pour ton compte Admin.</p>

        <div className="auth-field">
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && <p className="auth-error-text">{error}</p>}

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Mise à jour..." : "Réinitialiser le mot de passe"}
        </button>
      </form>

      <p className="auth-links">
        Revenir à la <Link to="/login">connexion</Link>
      </p>
    </AuthLayout>
  );
}
