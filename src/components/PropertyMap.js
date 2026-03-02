import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon bug in Leaflet + Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Helper: fly to focused property
const FlyToProperty = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([parseFloat(lat), parseFloat(lng)], 16, { duration: 1.5 });
    }
  }, [lat, lng, map]);
  return null;
};

const PropertyMap = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const focusLat   = searchParams.get('lat');
  const focusLng   = searchParams.get('lng');
  const focusId    = searchParams.get('id');
  const focusTitle = searchParams.get('title');
  const focusPrice = searchParams.get('price');

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const focusMarkerRef = useRef(null);

  const defaultCenter = focusLat && focusLng
    ? [parseFloat(focusLat), parseFloat(focusLng)]
    : [10.7769, 106.7009];

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5001/api/properties/map');
        const data = await response.json();
        if (data.success) setProperties(data.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Auto open popup of focused marker
  useEffect(() => {
    if (focusLat && focusLng) {
      setTimeout(() => {
        if (focusMarkerRef.current) {
          focusMarkerRef.current.openPopup();
        }
      }, 800);
    }
  }, [focusLat, focusLng, loading]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: '6px',
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← Quay Lại
        </button>
        <h1 style={{ margin: 0 }}>🗺️ Bản Đồ Bất Động Sản</h1>
        {loading && <span style={{ color: '#888', fontSize: '14px' }}>Đang tải...</span>}
      </div>

      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #ddd' }}>
        <MapContainer
          center={defaultCenter}
          zoom={focusLat && focusLng ? 16 : 12}
          style={{ width: '100%', height: '620px' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {focusLat && focusLng && (
            <FlyToProperty lat={focusLat} lng={focusLng} />
          )}

          {/* ===== OTHER PROPERTIES (grey dots) ===== */}
          {properties.map((property) => {
            const lat = property.position?.lat ?? property.latitude;
            const lng = property.position?.lng ?? property.longitude;
            if (!lat || !lng) return null;
            if (focusId && property.id === parseInt(focusId)) return null; // skip focused one

            return (
              <CircleMarker
                key={property.id}
                center={[parseFloat(lat), parseFloat(lng)]}
                radius={8}
                pathOptions={{ color: '#888', fillColor: '#aaa', fillOpacity: 0.8 }}
              >
                <Popup minWidth={200}>
                  <div style={{ lineHeight: '1.6' }}>
                    <h3 style={{ margin: '0 0 4px', fontSize: '13px' }}>{property.title}</h3>
                    <p style={{ margin: '0 0 4px', color: '#e53935', fontWeight: 'bold', fontSize: '13px' }}>
                      {formatPrice(property.price)}
                    </p>
                    <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#555' }}>
                      📍 {property.address || property.location}
                    </p>
                    <a href={`/properties/${property.id}`} style={{ color: '#1976d2', fontSize: '12px', fontWeight: 'bold' }}>
                      Xem Chi Tiết →
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* ===== FOCUSED PROPERTY (big red dot) ===== */}
          {focusLat && focusLng && (
            <>
              {/* Outer pulsing ring */}
              <CircleMarker
                center={[parseFloat(focusLat), parseFloat(focusLng)]}
                radius={20}
                pathOptions={{
                  color: '#e53935',
                  fillColor: '#e53935',
                  fillOpacity: 0.15,
                  weight: 2,
                  dashArray: '4'
                }}
              />
              {/* Inner red dot with popup */}
              <CircleMarker
                center={[parseFloat(focusLat), parseFloat(focusLng)]}
                radius={12}
                pathOptions={{
                  color: '#b71c1c',
                  fillColor: '#e53935',
                  fillOpacity: 1,
                  weight: 3
                }}
                ref={focusMarkerRef}
              >
                <Popup minWidth={220}>
                  <div style={{ lineHeight: '1.8' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '14px' }}>
                      📍 {focusTitle ? decodeURIComponent(focusTitle) : `Bất Động Sản #${focusId}`}
                    </h3>
                    {focusPrice && (
                      <p style={{ margin: '0 0 6px', color: '#e53935', fontWeight: 'bold' }}>
                        {formatPrice(focusPrice)}
                      </p>
                    )}
                    <a
                      href={`/properties/${focusId}`}
                      style={{ color: '#1976d2', fontSize: '13px', fontWeight: 'bold' }}
                    >
                      Xem Chi Tiết →
                    </a>
                  </div>
                </Popup>
              </CircleMarker>
            </>
          )}
        </MapContainer>
      </div>

      <p style={{ marginTop: '0.5rem', fontSize: '12px', color: '#888', textAlign: 'right' }}>
        Tìm thấy {properties.length} bất động sản • 🔴 Đang xem • ⚫ Khác
      </p>
    </div>
  );
};

export default PropertyMap;