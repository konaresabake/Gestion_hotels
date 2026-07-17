import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import HotelCard from "../components/HotelCard";
import { listHotels } from "../api/hotels";
import "./HotelList.css";

export default function HotelList() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listHotels()
      .then(({ data }) => setHotels(data))
      .finally(() => setLoading(false));
  }, []);

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

      {loading && <p className="hotel-list-empty">Chargement...</p>}

      {!loading && hotels.length === 0 && (
        <p className="hotel-list-empty">Aucun hôtel pour le moment. Crée le premier !</p>
      )}

      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} onClick={() => navigate(`/hotels/${hotel.id}`)} />
        ))}
      </div>
    </AppLayout>
  );
}
