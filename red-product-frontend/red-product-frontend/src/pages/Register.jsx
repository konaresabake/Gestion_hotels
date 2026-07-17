import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { registerAdmin } from "../api/auth";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", accepted_terms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.accepted_terms) {
      setError("Merci d'accepter les termes et la politique.");
      return;
    }
    setLoading(true);
    try {
      await registerAdmin(form);
      navigate("/login");
    } catch (err) {
      const detail =
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        "Impossible de créer le compte.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="auth-card-title">Inscrivez-vous en tant que Admin</p>

        <div className="auth-field">
          <input
            type="text"
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

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
            name="accepted_terms"
            checked={form.accepted_terms}
            onChange={handleChange}
          />
          Accepter les termes et la politique
        </label>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </button>
      </form>

      <p className="auth-links">
        Vous avez déjà un compte? <Link to="/login">Se connecter</Link>
      </p>
    </AuthLayout>
  );
}
