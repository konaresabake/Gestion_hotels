import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { deleteHotel, getHotel, updateHotel } from "../api/hotels";
import "./CreateHotel.css";

const CURRENCIES = [
  { value: "XOF", label: "F XOF" },
  { value: "EUR", label: "€ EUR" },
  { value: "USD", label: "$ USD" },
];

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getHotel(id)
      .then(({ data }) => {
        setForm({
          name: data.name,
          address: data.address,
          email: data.email,
          phone_number: data.phone_number,
          price_per_night: data.price_per_night,
          currency: data.currency,
        });
        setPreview(data.photo);
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

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
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (photo) formData.append("photo", photo);

      await updateHotel(id, formData);
      navigate("/hotels");
    } catch (err) {
      setError("Impossible d'enregistrer les modifications.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer définitivement cet hôtel ?")) return;
    try {
      await deleteHotel(id);
      navigate("/hotels");
    } catch (err) {
      setError("Impossible de supprimer cet hôtel.");
    }
  };

  if (loading) {
    return (
      <AppLayout title="Détail de l'hôtel">
        <p>Chargement...</p>
      </AppLayout>
    );
  }

  if (notFound) {
    return (
      <AppLayout title="Détail de l'hôtel">
        <p>Cet hôtel n'existe pas ou a été supprimé.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Détail de l'hôtel">
      <button className="create-hotel-back" onClick={() => navigate("/hotels")}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="#26262a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        DÉTAIL DE L'HÔTEL
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
          <label>Photo</label>
          <div className="create-hotel-dropzone" onClick={() => fileInputRef.current?.click()}>
            {preview ? (
              <img src={preview} alt="Aperçu" className="create-hotel-preview" />
            ) : (
              <span>Ajouter une photo</span>
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

        <div className="create-hotel-actions" style={{ justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              background: "none",
              border: "1px solid #ef5350",
              color: "#ef5350",
              borderRadius: 6,
              padding: "12px 20px",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Supprimer
          </button>
          <button className="create-hotel-submit" type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
