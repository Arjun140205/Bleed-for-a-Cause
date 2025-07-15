import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { FaClock, FaPhone, FaMapMarkerAlt, FaSearch, FaHeart, FaTint, FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { bloodBanksDatabase } from '../../data/bloodBanksData';
import { motion } from 'framer-motion';
import TextInput from "../ui/TextInput";
import Loader from "../ui/Loader";
import Card from "../ui/Card";

const INDIA_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;
const SEARCH_ZOOM = 12;

// Animated SVG Red Blobs for background
const AnimatedBlobs = ({ mouse }) => (
  <div className="pointer-events-none fixed inset-0 z-0">
    <motion.svg
      width="100vw"
      height="100vh"
      viewBox="0 0 1440 900"
      className="absolute top-0 left-0 w-full h-full"
      style={{ filter: 'blur(60px)', opacity: 0.35 }}
    >
      <motion.ellipse
        cx={400 + (mouse.x || 0) * 0.1}
        cy={300 + (mouse.y || 0) * 0.1}
        initial={{ rx: 320, ry: 180 }}
        animate={{
          rx: [320, 340, 320],
          ry: [180, 200, 180],
        }}
        fill="url(#red1)"
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx={1100 - (mouse.x || 0) * 0.08}
        cy={600 - (mouse.y || 0) * 0.08}
        initial={{ rx: 220, ry: 120 }}
        animate={{
          rx: [220, 250, 220],
          ry: [120, 140, 120],
        }}
        fill="url(#red2)"
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
      <defs>
        <radialGradient id="red1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d4f" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <radialGradient id="red2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
      </defs>
    </motion.svg>
  </div>
);

// ✅ Component to update map view dynamically
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (
      Array.isArray(center) &&
      typeof center[0] === 'number' &&
      typeof center[1] === 'number' &&
      typeof zoom === 'number'
    ) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};
MapController.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

const BloodBankLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(INDIA_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  // Custom marker icon
  const bloodIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setHasSearched(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = bloodBanksDatabase.filter(bank =>
      bank.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
    if (filtered.length > 0) {
      setMapCenter([filtered[0].lat, filtered[0].lng]);
      setMapZoom(SEARCH_ZOOM);
    } else {
      setMapCenter(INDIA_CENTER);
      setMapZoom(DEFAULT_ZOOM);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Glassmorphism style
  const glass = 'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';

  return (
    <div
      className="relative min-h-screen py-0 overflow-x-hidden"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-16 sm:pt-18 lg:pt-18 xl:pt-20">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-8 shadow-lg shadow-red-300/40"
            style={{ letterSpacing: 2 }}
          >
            Find a Blood Bank
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-pink-700 mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Locate Blood Banks Across India
          </motion.h1>
          <motion.p
            className="text-xl max-w-3xl mx-auto"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Search, explore, and connect with blood banks in your city. Save lives by finding the nearest donation center or blood bank.
          </motion.p>
        </motion.div>
        {/* Wavy Divider */}
        <svg className="w-full h-10 mb-8" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 Q 360 60 720 30 T 1440 30 V60 H0V30Z" fill="#fee2e2" />
        </svg>
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6 min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-4.5rem)] lg:min-h-[calc(100vh-5rem)] xl:min-h-[calc(100vh-6rem)]">
          {/* Left Panel - Search and Results */}
          <div className="w-full lg:w-2/5 flex flex-col">
            {/* Search Section */}
            <motion.div
              className={`rounded-3xl shadow-xl p-5 mb-5 ${glass}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
                <FaSearch className="mr-2 text-red-600 text-lg" />
                Search Blood Banks
              </h2>
              <div className="relative">
                <TextInput
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter city, state, or hospital name..."
                  className="w-full px-4 py-3 text-base border-2 border-red-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all duration-300 pr-12 bg-white/60"
                  style={{ color: 'var(--text-main)' }}
                />
                <motion.button
                  onClick={handleSearch}
                  disabled={loading}
                  className="absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center disabled:opacity-50 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? (
                    <Loader />
                  ) : (
                    <FaSearch className="text-sm" />
                  )}
                </motion.button>
              </div>
              <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                Search across major cities in India
              </p>
            </motion.div>
            {/* Return to Quick Search Button */}
            {hasSearched && (
              <motion.div
                className="mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={() => {
                    setHasSearched(false);
                    setSearchResults([]);
                    setSearchQuery('');
                    setMapCenter([20.5937, 78.9629]);
                    setMapZoom(5);
                  }}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium border border-red-200 hover:border-red-300 flex items-center"
                >
                  <FaArrowLeft className="mr-2 text-xs" />
                  Back to Quick Search
                </button>
              </motion.div>
            )}
            {/* Quick Search Suggestions */}
            {!hasSearched && (
              <motion.div
                className={`rounded-3xl shadow-xl p-5 mb-5 ${glass}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
                  <FaHeart className="mr-2 text-red-600 text-base" />
                  Quick Search
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Patna', 'AIIMS'].map((city, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setSearchQuery(city);
                        setTimeout(handleSearch, 100);
                      }}
                      className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-xl transition-all duration-300 text-sm font-medium border border-red-200 hover:border-red-300 shadow-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {city}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
            {/* Results Section */}
            <div className="flex-1 overflow-y-auto">
              {hasSearched && (
                <>
                  {loading ? (
                    <motion.div
                      className={`text-center py-12 rounded-3xl shadow-xl ${glass}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Loader />
                      <p className="text-base" style={{ color: 'var(--text-muted)' }}>Searching blood banks...</p>
                    </motion.div>
                  ) : searchResults.length > 0 ? (
                    <motion.div
                      className={`rounded-3xl shadow-xl p-5 ${glass}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="mb-4">
                        <h3 className="text-lg font-bold flex items-center bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
                          <FaTint className="mr-2 text-red-600 text-base" />
                          Found {searchResults.length} Blood Bank{searchResults.length !== 1 ? 's' : ''}
                        </h3>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Click on any card to view location on map</p>
                      </div>
                      <div className="space-y-3 max-h-72 overflow-y-auto">
                        {searchResults.map((bank, index) => (
                          <Card
                            key={index}
                            className={`rounded-xl p-4 border hover:border-red-300 hover:bg-red-50 transition-all duration-300 cursor-pointer ${selectedBank === bank ? 'ring-2 ring-red-400' : ''}`}
                            style={{
                              background: 'var(--bg-main)',
                              borderColor: 'rgba(200,200,200,0.10)',
                              color: 'var(--text-main)'
                            }}
                            onClick={() => {
                              setMapCenter([bank.lat, bank.lng]);
                              setMapZoom(15);
                              setSelectedBank(bank);
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-base font-semibold pr-2 bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-400">{bank.name}</h4>
                              <FaTint className="text-red-600 text-lg flex-shrink-0 animate-pulse" />
                            </div>
                            <div className="space-y-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                              <div className="flex items-start gap-2">
                                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0 text-sm" />
                                <div>
                                  <p className="font-medium" style={{ color: 'var(--text-main)' }}>{bank.city}, {bank.state}</p>
                                  <p className="text-xs">{bank.address}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaClock className="text-red-500 flex-shrink-0 text-sm" />
                                <p>{bank.hours}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <FaPhone className="text-red-500 flex-shrink-0 text-sm" />
                                <p>{bank.contact}</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className={`text-center py-12 rounded-3xl shadow-xl ${glass}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p className="text-base" style={{ color: 'var(--text-muted)' }}>No blood banks found for your search.</p>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </div>
          {/* Right Panel - Map */}
          <motion.div
            className={`w-full lg:w-3/5 flex flex-col items-center justify-center rounded-3xl shadow-2xl ${glass} relative min-h-[500px]`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden relative">
              <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true} className="w-full h-full z-10">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapController center={mapCenter} zoom={mapZoom} />
                {(hasSearched ? searchResults : bloodBanksDatabase).map((bank, idx) => (
                  <Marker
                    key={idx}
                    position={[bank.lat, bank.lng]}
                    icon={bloodIcon}
                  >
                    <Popup>
                      <div className="text-sm font-semibold mb-1">{bank.name}</div>
                      <div className="text-xs mb-1">{bank.city}, {bank.state}</div>
                      <div className="text-xs">{bank.address}</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
              {/* Artistic floating blood drop */}
              <motion.div
                className="absolute -top-8 -right-8"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
                  <ellipse cx="20" cy="30" rx="10" ry="16" fill="#ef4444" fillOpacity="0.25" />
                  <path d="M20 6 C24 16, 32 22, 20 38 C8 22, 16 16, 20 6 Z" fill="#ef4444" />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </div>
        {/* CTA Banner */}
        <motion.div
          className="mt-12 rounded-3xl p-8 text-center shadow-2xl bg-gradient-to-r from-red-500 via-red-400 to-red-700 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-2xl font-extrabold mb-4 text-white drop-shadow-lg">
            Can’t find a blood bank near you?
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-white/90">
            Become a donor or contact us for more information. Every effort counts in saving lives!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a
              href="/eligibility"
              className="bg-white text-red-600 font-bold px-8 py-4 rounded-xl hover:bg-red-100 transition-colors shadow-lg shadow-red-200/40 text-xl relative overflow-hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
            >
              Check Eligibility
            </motion.a>
            <motion.a
              href="/contact"
              className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-xl shadow-lg shadow-red-200/40 relative overflow-hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
            >
              Contact Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BloodBankLocator;