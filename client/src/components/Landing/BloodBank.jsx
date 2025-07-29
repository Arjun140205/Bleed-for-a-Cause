import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import { FaClock, FaPhone, FaMapMarkerAlt, FaSearch, FaHeart, FaTint, FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';
import { bloodBanksDatabase } from '../../data/bloodBanksData';
import { motion } from 'framer-motion';

const INDIA_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 5;
const SEARCH_ZOOM = 12;

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

// ✅ Prop validation for MapController
MapController.propTypes = {
  center: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoom: PropTypes.number.isRequired,
};

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

const BloodBankLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState(INDIA_CENTER);
  const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);
  const [hasSearched, setHasSearched] = useState(false);
  // const [selectedBank, setSelectedBank] = useState(null); // Commented out as not currently used
  
  // Featured blood banks to show on initial load
  const [featuredBanks, setFeaturedBanks] = useState([]);

  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };
  
  // For glassmorphism card style
  // Glass effect styling is now directly applied to elements
  // const glass = 'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';

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

  // Initialize featured blood banks on component mount
  useEffect(() => {
    // Select a few major cities' blood banks to display initially
    const majorCities = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'];
    const initialBanks = bloodBanksDatabase.filter(bank => 
      majorCities.some(city => bank.city.includes(city))
    ).slice(0, 10); // Limit to 10 initial pins
    
    setFeaturedBanks(initialBanks);
  }, []);

  return (
    <div
      className="relative min-h-screen py-30 px-4 sm:px-6 lg:px-8 overflow-x-hidden"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-8 shadow-lg shadow-red-300/40"
            style={{ letterSpacing: 2 }}
          >
            FIND BLOOD DONATION CENTERS
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-6 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Blood Bank Locator
          </motion.h1>
          
          <motion.p
            className="text-xl max-w-3xl mx-auto text-red-900/80 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Easily locate blood donation centers near you with our interactive map. Search by location to find the nearest blood banks and donation facilities.
          </motion.p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-16rem)]">
          {/* Left Panel - Search and Results */}
          <motion.div 
            className="w-full lg:w-2/5 flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Search Section */}
            <motion.div
              className="rounded-xl shadow-xl p-5 mb-6 border border-red-100/40 backdrop-blur-sm"
              style={{
                background: "rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(252, 165, 165, 0.15)"
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.h2 
                className="text-xl font-bold mb-4 flex items-center text-red-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <FaSearch className="mr-2 text-red-600 text-lg" />
                Search Blood Banks
              </motion.h2>
              
              <div className="relative">
                <motion.div 
                  className="input-wrapper relative"
                  initial={{ width: "95%" }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter city, state, or hospital name..."
                    className="w-full px-5 py-4 text-base border-2 border-red-200/50 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200/50 transition-all duration-300 pr-12 bg-white/70 placeholder-red-400/70"
                    style={{ color: "#333" }}
                  />
                  <motion.button
                    onClick={handleSearch}
                    disabled={loading}
                    className="absolute right-3 top-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center disabled:opacity-50 shadow-md shadow-red-300/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <FaSearch className="text-sm" />
                    )}
                  </motion.button>
                </motion.div>
              </div>
              
              <motion.p 
                className="text-sm mt-3 text-red-700/80 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Search across major cities in India
              </motion.p>
            </motion.div>

            {/* Return to Quick Search Button */}
            {hasSearched && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.button
                  onClick={() => {
                    setHasSearched(false);
                    setSearchResults([]);
                    setSearchQuery('');
                    setMapCenter([20.5937, 78.9629]);
                    setMapZoom(5);
                  }}
                  className="bg-gradient-to-r from-red-50 to-white text-red-700 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium border border-red-200/50 hover:border-red-300 flex items-center shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaArrowLeft className="mr-2 text-xs" />
                  Back to Quick Search
                </motion.button>
              </motion.div>
            )}

            {/* Quick Search Suggestions */}
            {!hasSearched && (
              <motion.div
                className="rounded-xl shadow-lg p-6 mb-6 border border-red-100/40 backdrop-blur-sm"
                style={{
                  background: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 32px rgba(252, 165, 165, 0.15)"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
              >
                <motion.h3 
                  className="text-lg font-bold mb-4 flex items-center text-red-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  <FaHeart className="mr-2 text-red-600 text-base" />
                  Quick Search
                </motion.h3>
                
                <motion.div 
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3, staggerChildren: 0.1 }}
                >
                  {['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Pune', 'Jaipur', 'Lucknow', 'Patna', 'AIIMS'].map((city, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setSearchQuery(city);
                        setTimeout(handleSearch, 100);
                      }}
                      className="bg-white/70 hover:bg-red-100/80 text-red-700 px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium border border-red-200/30 hover:border-red-300/80 shadow-sm hover:shadow-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.05 }}
                    >
                      {city}
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Results Section */}
            <motion.div 
              className="flex-1 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              {hasSearched && (
                <>
                  {loading ? (
                    <motion.div
                      className="text-center py-12 rounded-xl shadow-xl border border-red-100/30 backdrop-blur-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 32px rgba(252, 165, 165, 0.15)"
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex justify-center">
                        <div className="relative h-16 w-16">
                          <div className="absolute inset-0 rounded-full border-4 border-red-200 opacity-25"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-red-600 animate-spin"></div>
                        </div>
                      </div>
                      <p className="text-base text-red-700/80 mt-4 font-medium">Searching blood banks...</p>
                    </motion.div>
                  ) : searchResults.length > 0 ? (
                    <motion.div
                      className="rounded-xl shadow-xl border border-red-100/40 p-6 backdrop-blur-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 8px 32px rgba(252, 165, 165, 0.15)"
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-lg font-bold flex items-center text-red-700">
                          <FaTint className="mr-2 text-red-600 text-base" />
                          Found {searchResults.length} Blood Bank{searchResults.length !== 1 ? 's' : ''}
                        </h3>
                        <p className="text-sm mt-1 text-red-700/70 italic">Click on any card to view location on map</p>
                      </motion.div>
                      
                      <motion.div 
                        className="space-y-3 max-h-[24rem] overflow-y-auto pr-2 custom-scrollbar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {searchResults.map((bank, index) => (
                          <motion.div
                            key={index}
                            className="rounded-lg p-4 border border-red-200/30 hover:border-red-300/80 bg-white/50 hover:bg-white/80 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            onClick={() => {
                              setMapCenter([bank.lat, bank.lng]);
                              setMapZoom(15);
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-base font-bold pr-2 text-red-700 group-hover:text-red-800 transition-colors">{bank.name}</h4>
                              <FaTint className="text-red-600 text-lg flex-shrink-0 group-hover:text-red-700 transition-colors" />
                            </div>
                            <div className="space-y-2 text-sm text-red-900/70">
                              <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0 text-sm" />
                                <div>
                                  <p className="font-semibold text-red-800">{bank.city}, {bank.state}</p>
                                  <p className="text-xs text-red-800/70">{bank.address}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaClock className="text-red-500 flex-shrink-0 text-sm" />
                                <p>{bank.hours}</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <FaPhone className="text-red-500 flex-shrink-0 text-sm" />
                                <p>{bank.contact}</p>
                              </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-red-200/30 flex justify-end">
                              <motion.button 
                                className="text-red-600 hover:text-red-800 font-medium text-sm flex items-center gap-1 transition-colors duration-300"
                                whileHover={{ x: 3 }}
                              >
                                View on Map 
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="text-center py-12 rounded-xl shadow-xl border border-red-100/40 backdrop-blur-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        boxShadow: "0 8px 32px rgba(252, 165, 165, 0.15)"
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="bg-white/40 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaSearch className="text-3xl text-red-400" />
                        </div>
                      </motion.div>
                      <motion.h3 
                        className="text-lg font-bold mb-2 text-red-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        No Blood Banks Found
                      </motion.h3>
                      <motion.p 
                        className="mb-4 text-base text-red-700/70"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        We could not find any blood banks matching your search
                      </motion.p>
                      <motion.p 
                        className="text-sm px-4 text-red-700/70 italic"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        Try searching for major cities like Delhi, Mumbai, Kolkata, Chennai, etc.
                      </motion.p>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Right Panel - Map */}
          <motion.div 
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div
              className="rounded-xl shadow-xl p-5 border border-red-100/40 backdrop-blur-sm h-full min-h-[320px] lg:min-h-[500px]"
              style={{
                background: "rgba(255, 255, 255, 0.3)",
                boxShadow: "0 8px 32px rgba(252, 165, 165, 0.15)"
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <motion.h3 
                className="text-xl font-bold mb-4 flex items-center text-red-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                <FaMapMarkerAlt className="mr-2 text-red-600 text-lg" />
                Interactive Map
              </motion.h3>
              <MapContainer
                center={INDIA_CENTER}
                zoom={DEFAULT_ZOOM}
                className="h-[200px] sm:h-[280px] lg:h-[400px] xl:h-[500px] w-full rounded-md sm:rounded-lg shadow-lg"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapController center={mapCenter} zoom={mapZoom} />
                
                {/* Show either search results or featured banks */}
                {(hasSearched ? searchResults : featuredBanks).map((bank, index) => (
                  <Marker
                    key={`${bank.name}-${index}`}
                    position={[bank.lat, bank.lng]}
                    icon={bloodIcon}
                  >
                    <Popup className="custom-popup">
                      <div className="space-y-2 sm:space-y-3 p-1 sm:p-2">
                        <h3 className="font-bold text-red-600 text-sm sm:text-base lg:text-lg">{bank.name}</h3>
                        <div className="flex items-start gap-2">
                          <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0 text-xs sm:text-sm" />
                          <p className="text-xs sm:text-sm" style={{ color: "var(--text-main)" }}>{bank.address}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-red-500 text-xs sm:text-sm" />
                          <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>{bank.hours}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-red-500 text-xs sm:text-sm" />
                          <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>{bank.contact}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation for AnimatedBlobs
AnimatedBlobs.propTypes = {
  mouse: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }).isRequired
};

export default BloodBankLocator;