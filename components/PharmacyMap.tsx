'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Pharmacy {
  pharmacyNameLatin: string;
  pharmacyNameArabic: string;
  cityCode: string;
  pharmacyPhone: string;
  addressLatin: string;
  addressArabic: string;
  latitude: number;
  longitude: number;
}

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  selectedPharmacy: Pharmacy | null;
  onPharmacySelect: (pharmacy: Pharmacy | null) => void;
  isDarkMode: boolean;
  language: 'en' | 'fr' | 'ar';
}

const PharmacyMap = ({ pharmacies, selectedPharmacy, onPharmacySelect, isDarkMode, language }: PharmacyMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const getPharmacyName = (pharmacy: Pharmacy) => {
    return language === 'ar' ? pharmacy.pharmacyNameArabic : pharmacy.pharmacyNameLatin;
  };

  const getAddress = (pharmacy: Pharmacy) => {
    return language === 'ar' ? pharmacy.addressArabic : pharmacy.addressLatin;
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [31.7917, -7.0926],
      zoom: 6,
      zoomControl: true,
    });

    const tileLayer = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayer, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileLayer = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileLayer, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
  }, [isDarkMode]);

  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (pharmacies.length === 0) return;

    const customIcon = (isSelected: boolean) => L.divIcon({
      html: `
        <div style="
          width: 40px;
          height: 40px;
          background-color: ${isSelected ? '#a3e635' : '#14b8a6'};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          transform: ${isSelected ? 'scale(1.3)' : 'scale(1)'};
          transition: all 0.3s;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1e293b" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    pharmacies.forEach(pharmacy => {
      const isSelected = selectedPharmacy === pharmacy;
      const marker = L.marker([pharmacy.latitude, pharmacy.longitude], {
        icon: customIcon(isSelected),
      }).addTo(mapRef.current!);

      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="color: #14b8a6; font-weight: 600; margin-bottom: 8px;">${getPharmacyName(pharmacy)}</h3>
          <p style="font-size: 14px; margin-bottom: 4px;">${getAddress(pharmacy)}</p>
          <p style="font-size: 14px; color: #64748b;">${pharmacy.pharmacyPhone}</p>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onPharmacySelect(pharmacy);
      });

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
    });

    const bounds = L.latLngBounds(pharmacies.map(p => [p.latitude, p.longitude]));
    mapRef.current.fitBounds(bounds, { padding: [50, 50] });

  }, [pharmacies, selectedPharmacy, language]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: '400px' }}
    />
  );
};

export default PharmacyMap;
