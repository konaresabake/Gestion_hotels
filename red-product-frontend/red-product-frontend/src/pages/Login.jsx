import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", keepLoggedIn: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-card-title">Connectez-vous en tant que Admin</p>

        <div className="auth-field">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="auth-error-text">{error}</p>}

        <label className="auth-checkbox">
          <input
            type="checkbox"
            name="keepLoggedIn"
            checked={form.keepLoggedIn}
            onChange={handleChange}
          />
          Gardez-moi connecté
        </label>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <Link to="/forgot-password" className="auth-forgot">
        Mot de passe oublié?
      </Link>
      <p className="auth-links">
        Vous n'avez pas de compte? <Link to="/register">S'inscrire</Link>
      </p>
    </AuthLayout>
  );
}
