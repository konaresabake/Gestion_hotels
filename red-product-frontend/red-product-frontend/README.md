# RED Product — Frontend

Interface React (Vite) pour l'admin **RED Product** : connexion, inscription,
mot de passe oublié, dashboard, liste des hôtels, création d'hôtel.
Reproduction fidèle de la maquette (couleurs, mise en page, textes).

## Stack
- React 19 + Vite
- react-router-dom (routes + protection par JWT)
- axios (client API + rafraîchissement automatique du token)
- CSS pur, pas de framework (variables CSS dans `src/index.css`)

## Installation

```bash
npm install
cp .env.example .env      # ajuste VITE_API_URL si le backend n'est pas en local
npm run dev
```

L'app tourne sur `http://localhost:5173/`. Assure-toi que le **backend Django**
tourne sur `http://127.0.0.1:8000` (ou adapte `VITE_API_URL`).

## Structure

```
src/
├── api/            client axios, endpoints auth + hotels
├── context/        AuthContext (session, login/logout)
├── components/     AuthLayout, Sidebar, Topbar, AppLayout, HotelCard, StatCard
├── pages/          Login, Register, ForgotPassword, Dashboard, HotelList, CreateHotel
└── index.css       variables de couleur / typographie globales
```

## Pages

| Route | Écran | Protégée |
|---|---|:---:|
| `/login` | Connexion | non |
| `/register` | Inscription | non |
| `/forgot-password` | Mot de passe oublié | non |
| `/dashboard` | Tableau de bord (stats) | oui |
| `/hotels` | Liste des hôtels | oui |
| `/hotels/new` | Créer un hôtel | oui |

## Notes
- La case "Gardez-moi connecté" détermine si le token est stocké en
  `localStorage` (persistant) ou `sessionStorage` (le temps de l'onglet).
- Sur le Dashboard, seule la carte **"Hotels"** est branchée sur l'API
  (les autres — Formulaires, Messages, Utilisateurs, E-mails, Entités —
  restent des valeurs statiques de la maquette, en attendant que ces modules
  existent côté backend).
- Le formulaire "Créer un hôtel" envoie en `multipart/form-data` pour
  supporter l'upload de photo.
