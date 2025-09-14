import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, Navigation, Phone, Clock } from "lucide-react";

const LaundryMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // DIRTYCLOTHS laundry coordinates in Midigama, Sri Lanka
  const laundryCoordinates = [5.965437, 80.394401]; // Approximate coordinates

  // ✅ useCallback ensures stable reference for dependency array
  const initializeMap = useCallback(() => {
    if (mapRef.current && window.L && !mapInstanceRef.current) {
      // Initialize the map
      const map = window.L.map(mapRef.current, {
        center: laundryCoordinates,
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        attributionControl: true,
      });

      // Add OpenStreetMap tile layer
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      // Create custom icon
      const laundryIcon = window.L.divIcon({
        html: `
          <div style="
            background: linear-gradient(45deg, #4F46E5, #7C3AED);
            border: 3px solid white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: pulse 2s infinite;
          ">
            <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 
              9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 
              2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        `,
        className: "custom-marker",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });

      // Add marker
      const marker = window.L.marker(laundryCoordinates, { icon: laundryIcon }).addTo(map);

      // Popup content
      const popupContent = `
        <div style="text-align: center; padding: 10px; min-width: 200px;">
          <h3 style="color: #4F46E5; margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
            🧺 DIRTYCLOTHS
          </h3>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">
            <strong>📍 Location:</strong><br>
            Amuwatta koratuwa<br>
            Midigama, Ahangama
          </p>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">
            <strong>📞 Phone:</strong><br>
            <a href="tel:+94721634671" style="color: #4F46E5; text-decoration: none;">
              +94 72 163 4671
            </a>
          </p>
          <p style="margin: 5px 0; color: #666; font-size: 14px;">
            <strong>🕒 Hours:</strong><br>
            Mon-Sat: 6AM-10PM<br>
            Sunday: 7AM-8PM
          </p>
          <div style="margin-top: 10px;">
            <a href="https://www.google.com/maps/dir//${laundryCoordinates[0]},${laundryCoordinates[1]}" 
              target="_blank" 
              style="
                background: linear-gradient(45deg, #4F46E5, #7C3AED);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                text-decoration: none;
                font-size: 12px;
                display: inline-block;
                margin-top: 5px;
              ">
              🗺️ Get Directions
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent).openPopup();

      // Circle showing service area (5km)
      window.L.circle(laundryCoordinates, {
        color: "#4F46E5",
        fillColor: "#4F46E5",
        fillOpacity: 0.1,
        radius: 5000,
        stroke: true,
        weight: 2,
        dashArray: "5, 5",
      }).addTo(map).bindPopup(`
        <div style="text-align: center;">
          <strong>🚛 Free Pickup & Delivery Zone</strong><br>
          <span style="color: #666; font-size: 12px;">Within 5km of our location</span>
        </div>
      `);

      mapInstanceRef.current = map;
      setIsMapLoaded(true);

      // Add pulse animation CSS
      const style = document.createElement("style");
      style.textContent = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
          100% { box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
        }
      `;
      document.head.appendChild(style);
    }
  }, [laundryCoordinates]);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (!document.querySelector('link[href*="leaflet"]')) {
        const leafletCSS = document.createElement("link");
        leafletCSS.rel = "stylesheet";
        leafletCSS.href =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css";
        leafletCSS.crossOrigin = "";
        document.head.appendChild(leafletCSS);
      }

      if (!window.L) {
        const leafletJS = document.createElement("script");
        leafletJS.src =
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js";
        leafletJS.crossOrigin = "";
        leafletJS.onload = initializeMap;
        document.head.appendChild(leafletJS);
      } else {
        initializeMap();
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [initializeMap]);

  const handleGetDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/dir//${laundryCoordinates[0]},${laundryCoordinates[1]}`;
    window.open(googleMapsUrl, "_blank");
  };

  const handleCallLaundry = () => {
    window.open("tel:+94721634671", "_self");
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-indigo-600" />
          Find Us in Midigama
        </h3>
        <p className="text-gray-600">
          Located right next to the famous Midigama surf break - perfect for
          surfers and locals!
        </p>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-80 rounded-2xl border-2 border-gray-200 relative z-10"
          style={{ minHeight: "320px" }}
        >
          {!isMapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading interactive map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleGetDirections}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <Navigation className="w-5 h-5 mr-2" />
            Get Directions
          </button>
          <button
            onClick={handleCallLaundry}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Now
          </button>
        </div>

        {/* Location Details */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                Address
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Amuwatta koratuwa
                <br />
                Midigama, Ahangama
                <br />
                Western Province, Sri Lanka
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-indigo-600" />
                Operating Hours
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Monday - Saturday: 6:00 AM - 10:00 PM
                <br />
                Sunday: 7:00 AM - 8:00 PM
                <br />
                <span className="text-sm text-indigo-600 font-medium">
                  Express service available!
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Service Area Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 mt-4 border border-indigo-200">
          <p className="text-sm text-gray-700 text-center">
            <span className="font-semibold text-indigo-700">
              🚛 Free Pickup & Delivery
            </span>{" "}
            within 5km radius •
            <span className="font-semibold text-purple-700">
              {" "}
              Perfect for surfers staying nearby!
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaundryMap;
