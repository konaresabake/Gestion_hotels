import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { createHotel } from "../api/hotels";
import "./CreateHotel.css";

const CURRENCIES = [
  { value: "XOF", label: "F XOF" },
  { value: "EUR", label: "€ EUR" },
  { value: "USD", label: "$ USD" },
];

export default function CreateHotel() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone_number: "",
    price_per_night: "",
    currency: "XOF",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append("photo", photo);

      await createHotel(formData);
      navigate("/hotels");
    } catch (err) {
      setError("Impossible d'enregistrer l'hôtel. Vérifie les champs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="Créer un nouvel hôtel">
      <button className="create-hotel-back" onClick={() => navigate("/hotels")}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="#26262a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        CRÉER UN NOUVEL HÔTEL
      </button>

      <form className="create-hotel-card" onSubmit={handleSubmit}>
        <div className="create-hotel-grid">
          <div className="create-hotel-field">
            <label>Nom de l'hôtel</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className="create-hotel-field">
            <label>Adresse</label>
            <input name="address" value={form.address} onChange={handleChange} required />
          </div>

          <div className="create-hotel-field">
            <label>E-mail</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="create-hotel-field">
            <label>Numéro de téléphone</label>
            <input name="phone_number" value={form.phone_number} onChange={handleChange} required />
          </div>

          <div className="create-hotel-field">
            <label>Prix par nuit</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="price_per_night"
              value={form.price_per_night}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-hotel-field">
            <label>Devise</label>
            <select name="currency" value={form.currency} onChange={handleChange}>
              {CURRENCIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="create-hotel-field create-hotel-photo-field">
          <label>Ajouter une photo</label>
          <div className="create-hotel-dropzone" onClick={() => fileInputRef.current?.click()}>
            {preview ? (
              <img src={preview} alt="Aperçu" className="create-hotel-preview" />
            ) : (
              <>
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="#c7c7cc" strokeWidth="1.4" />
                  <circle cx="8.5" cy="10" r="1.6" stroke="#c7c7cc" strokeWidth="1.4" />
                  <path d="M3 16l5-4 4 3 3-2 6 5" stroke="#c7c7cc" strokeWidth="1.4" />
                </svg>
                <span>Ajouter une photo</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              hidden
            />
          </div>
        </div>

        {error && <p className="auth-error-text">{error}</p>}

        <div className="create-hotel-actions">
          <button className="create-hotel-submit" type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
