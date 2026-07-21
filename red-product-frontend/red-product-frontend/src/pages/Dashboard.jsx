import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import { fetchAdminCount } from "../api/auth";
import { listHotels } from "../api/hotels";
import "./Dashboard.css";

export default function Dashboard() {
  const { admin } = useAuth();
  const [hotelCount, setHotelCount] = useState(null);
  const [adminCount, setAdminCount] = useState(null);

  useEffect(() => {
    listHotels()
      .then(({ data }) => setHotelCount(data.length))
      .catch(() => setHotelCount(null));

    fetchAdminCount()
      .then(({ data }) => setAdminCount(data.count))
      .catch(() => setAdminCount(null));
  }, []);

  // NB : "Hotels" et "Utilisateurs" sont branchées sur l'API.
  // Formulaires, Messages, E-mails, Entités n'ont pas encore de modèle
  // backend dédié — à ajouter quand ces fonctionnalités existeront.
  const stats = [
    { value: 125, label: "Formulaires", sublabel: "Je ne sais pas quoi mettre", color: "var(--stat-purple)", icon: "✉" },
    { value: 40, label: "Messages", sublabel: "Je ne sais pas quoi mettre", color: "var(--stat-teal)", icon: "P" },
    { value: adminCount ?? "—", label: "Utilisateurs", sublabel: "Total des admins inscrits", color: "var(--stat-yellow)", icon: "◍" },
    { value: 25, label: "E-mails", sublabel: "Je ne sais pas quoi mettre", color: "var(--stat-red)", icon: "✉" },
    { value: hotelCount ?? "—", label: "Hotels", sublabel: "Total des hôtels enregistrés", color: "var(--stat-purple2)", icon: "P", to: "/hotels" },
    { value: "02", label: "Entités", sublabel: "Je ne sais pas quoi mettre", color: "var(--stat-blue)", icon: "◍" },
  ];

  return (
    <AppLayout title="Dashboard">
      <p className="dashboard-welcome-title">Bienvenue sur RED Product</p>
      <p className="dashboard-welcome-sub">Lorem ipsum dolor sit amet consectetur</p>

      <div className="stat-grid">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </AppLayout>
  );
}
