import "./HotelCard.css";

const CURRENCY_LABEL = { XOF: "XOF", EUR: "EUR", USD: "USD" };

export default function HotelCard({ hotel, onClick }) {
  const price = Number(hotel.price_per_night).toLocaleString("fr-FR");

  return (
    <button className="hotel-card" onClick={onClick}>
      <div className="hotel-card-image">
        {hotel.photo ? (
          <img src={hotel.photo} alt={hotel.name} />
        ) : (
          <div className="hotel-card-placeholder">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#c7c7cc" strokeWidth="1.4" />
              <circle cx="8.5" cy="10" r="1.6" stroke="#c7c7cc" strokeWidth="1.4" />
              <path d="M3 16l5-4 4 3 3-2 6 5" stroke="#c7c7cc" strokeWidth="1.4" />
            </svg>
          </div>
        )}
      </div>
      <div className="hotel-card-body">
        <p className="hotel-card-address">{hotel.address}</p>
        <p className="hotel-card-name">{hotel.name}</p>
        <p className="hotel-card-price">
          {price} {CURRENCY_LABEL[hotel.currency] ?? hotel.currency} par nuit
        </p>
      </div>
    </button>
  );
}
