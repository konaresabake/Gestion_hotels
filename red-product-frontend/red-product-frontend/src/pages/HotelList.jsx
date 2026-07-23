import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import HotelCard from "../components/HotelCard";
import { listHotels } from "../api/hotels";
import "./HotelList.css";

export default function HotelList() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currency, setCurrency] = useState("");
  const [ordering, setOrdering] = useState("-created_at");

  // Debounce : on attend 350ms après la dernière frappe avant de relancer la recherche
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  const params = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      min_price: minPrice || undefined,
      max_price: maxPrice || undefined,
      currency: currency || undefined,
      ordering,
    }),
    [debouncedSearch, minPrice, maxPrice, currency, ordering]
  );

  useEffect(() => {
    setLoading(true);
    listHotels(params)
      .then(({ data }) => setHotels(data))
      .finally(() => setLoading(false));
  }, [params]);

  const hasActiveFilters = search || minPrice || maxPrice || currency;

  const resetFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCurrency("");
    setOrdering("-created_at");
  };

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

      <div className="hotel-filters">
        <div className="hotel-search">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="5" stroke="#9a9aa0" strokeWidth="1.4" />
            <line x1="9.7" y1="9.7" x2="13" y2="13" stroke="#9a9aa0" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Rechercher par nom ou adresse..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <input
          type="number"
          min="0"
          placeholder="Prix min"
          className="hotel-filter-input"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          min="0"
          placeholder="Prix max"
          className="hotel-filter-input"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select
          className="hotel-filter-input"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="">Toutes devises</option>
          <option value="XOF">F XOF</option>
          <option value="EUR">€ EUR</option>
          <option value="USD">$ USD</option>
        </select>

        <select
          className="hotel-filter-input"
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
        >
          <option value="-created_at">Plus récents</option>
          <option value="price_per_night">Prix croissant</option>
          <option value="-price_per_night">Prix décroissant</option>
          <option value="name">Nom (A → Z)</option>
        </select>

        {hasActiveFilters && (
          <button className="hotel-filter-reset" onClick={resetFilters}>
            Réinitialiser
          </button>
        )}
      </div>

      {loading && <p className="hotel-list-empty">Chargement...</p>}

      {!loading && hotels.length === 0 && (
        <p className="hotel-list-empty">
          {hasActiveFilters
            ? "Aucun hôtel ne correspond à ces critères."
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
