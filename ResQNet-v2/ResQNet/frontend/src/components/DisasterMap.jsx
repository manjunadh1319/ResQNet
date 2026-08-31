import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [16.5062, 80.648]; // Vijayawada, AP — dataset's regional center

export default function DisasterMap({ data }) {
  const hospitals = data?.hospitals || [];
  const rescueTeams = data?.rescue_teams || [];

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-xl border border-ink-900/10 dark:border-mist-100/10">
      <MapContainer center={DEFAULT_CENTER} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hospitals.map((h, i) =>
          h.latitude && h.longitude ? (
            <CircleMarker
              key={`hosp-${i}`}
              center={[parseFloat(h.latitude), parseFloat(h.longitude)]}
              radius={7}
              pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.6 }}
            >
              <Popup>
                <b>{h.hospital}</b>
                <br />
                {h.location} · {h.beds} beds · {h.icu} ICU
              </Popup>
            </CircleMarker>
          ) : null
        )}

        {rescueTeams.map((t, i) =>
          t.latitude && t.longitude ? (
            <CircleMarker
              key={`team-${i}`}
              center={[parseFloat(t.latitude), parseFloat(t.longitude)]}
              radius={7}
              pathOptions={{ color: "#2f6fed", fillColor: "#2f6fed", fillOpacity: 0.6 }}
            >
              <Popup>
                <b>{t.team}</b>
                <br />
                {t.location} · {t.available === "Yes" ? "Available" : "Unavailable"}
              </Popup>
            </CircleMarker>
          ) : null
        )}
      </MapContainer>
    </div>
  );
}
