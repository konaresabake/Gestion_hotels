import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import HotelCard from "../components/HotelCard";
import { listHotels } from "../api/hotels";
import "./HotelList.css";

export default function HotelList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listHotels({ search: search || undefined })
      .then(({ data }) => setHotels(data))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <AppLayout title="Liste des hôtels">
      <div className="hotel-list-header">
        <p className="hotel-list-count">
          Hôtels <span>{hotels.length}</span>
        </p>
        <button className="hotel-create-btn" onClick={() => navigate("/hotels/new")}>
          + Créer un nouvel hôtel
        </button>
      </div>

      {search && (
        <p className="hotel-search-active">
          Résultats pour « {search} » — <button onClick={() => navigate("/hotels")}>effacer</button>
        </p>
      )}

      {loading && <p className="hotel-list-empty">Chargement...</p>}

      {!loading && hotels.length === 0 && (
        <p className="hotel-list-empty">
          {search
            ? "Aucun hôtel ne correspond à cette recherche."
            : "Aucun hôtel pour le moment. Crée le premier !"}
        </p>
      )}

      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} onClick={() => navigate(`/hotels/${hotel.id}`)} />
        ))}
      </div>
    </AppLayout>
  );
}
