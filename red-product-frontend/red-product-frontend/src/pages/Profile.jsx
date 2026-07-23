import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";
import { changePassword, updateProfile } from "../api/auth";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const { admin, refreshAdmin } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(admin?.name ?? "");
  const [email, setEmail] = useState(admin?.email ?? "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(admin?.avatar ?? null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (avatarFile) formData.append("avatar", avatarFile);

      await updateProfile(formData);
      await refreshAdmin();
      setProfileSuccess(true);
    } catch (err) {
      setProfileError(
        err.response?.data?.email?.[0] || "Impossible d'enregistrer les modifications."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ old_password: oldPassword, new_password: newPassword });
      setPasswordSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.old_password?.[0] ||
          err.response?.data?.new_password?.[0] ||
          "Impossible de changer le mot de passe."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AppLayout title="Mon profil">
      <button className="create-hotel-back" onClick={() => navigate(-1)}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="#26262a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        MON PROFIL
      </button>

      <div className="profile-grid">
        {/* Carte infos + avatar */}
        <form className="create-hotel-card profile-card" onSubmit={handleProfileSubmit}>
          <p className="profile-card-title">Informations personnelles</p>

          <div className="profile-avatar-row">
            <div className="profile-avatar-preview" onClick={() => fileInputRef.current?.click()}>
              {preview ? (
                <img src={preview} alt={name} />
              ) : (
                <span>{name?.[0]?.toUpperCase() ?? "A"}</span>
              )}
            </div>
            <div>
              <button
                type="button"
                className="profile-avatar-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Changer la photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </div>
          </div>

          <div className="create-hotel-field">
            <label>Nom</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="create-hotel-field">
            <label>E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {profileError && <p className="auth-error-text">{profileError}</p>}
          {profileSuccess && <p className="profile-success">Profil mis à jour avec succès.</p>}

          <div className="create-hotel-actions">
            <button className="create-hotel-submit" type="submit" disabled={savingProfile}>
              {savingProfile ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </div>
        </form>

        {/* Carte mot de passe */}
        <form className="create-hotel-card profile-card" onSubmit={handlePasswordSubmit}>
          <p className="profile-card-title">Changer le mot de passe</p>

          <div className="create-hotel-field">
            <label>Mot de passe actuel</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="create-hotel-field">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="create-hotel-field">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {passwordError && <p className="auth-error-text">{passwordError}</p>}
          {passwordSuccess && (
            <p className="profile-success">Mot de passe changé avec succès.</p>
          )}

          <div className="create-hotel-actions">
            <button className="create-hotel-submit" type="submit" disabled={savingPassword}>
              {savingPassword ? "Enregistrement..." : "Changer le mot de passe"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
