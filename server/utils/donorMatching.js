/**
 * Helper utility functions for donor matching and location calculations
 */

/**
 * Check if donor blood type is compatible with patient blood type
 * @param {String} donorBloodType - Blood type of the donor (a+, b+, ab+, o+, a-, b-, ab-, o-)
 * @param {String} patientBloodType - Blood type of the patient
 * @returns {Boolean} Whether the donor's blood is compatible with the patient
 */
export const isBloodCompatible = (donorBloodType, patientBloodType) => {
  // Normalize blood types to lowercase
  const donor = donorBloodType.toLowerCase();
  const patient = patientBloodType.toLowerCase();
  
  // Blood compatibility chart
  const compatibilityMap = {
    'a+': ['a+', 'a-', 'o+', 'o-'],
    'a-': ['a-', 'o-'],
    'b+': ['b+', 'b-', 'o+', 'o-'],
    'b-': ['b-', 'o-'],
    'ab+': ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'], // AB+ can receive from anyone
    'ab-': ['a-', 'b-', 'ab-', 'o-'],
    'o+': ['o+', 'o-'],
    'o-': ['o-'] // O- can only receive from O-
  };
  
  // Check if donor blood type is in the list of compatible types for patient
  return compatibilityMap[patient]?.includes(donor) || false;
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Number} lat1 - Latitude of first point
 * @param {Number} lon1 - Longitude of first point
 * @param {Number} lat2 - Latitude of second point
 * @param {Number} lon2 - Longitude of second point
 * @returns {Number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  // Radius of the Earth in kilometers
  const R = 6371;
  
  // Convert degrees to radians
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  // Haversine formula
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const distance = R * c; // Distance in kilometers
  
  return distance;
};

/**
 * Helper function to convert degrees to radians
 * @param {Number} deg - Degrees
 * @returns {Number} Radians
 */
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

/**
 * Filter donors based on blood compatibility and distance
 * @param {Array} donors - List of all donors
 * @param {String} patientBloodType - Blood type of the patient
 * @param {Number} patientLat - Patient latitude
 * @param {Number} patientLng - Patient longitude
 * @param {Number} maxDistance - Maximum distance in kilometers
 * @returns {Array} Filtered list of compatible and nearby donors
 */
export const findCompatibleDonors = (donors, patientBloodType, patientLat, patientLng, maxDistance = 10) => {
  return donors
    .filter(donor => {
      // Check blood compatibility
      if (!isBloodCompatible(donor.bloodType, patientBloodType)) {
        return false;
      }
      
      // Extract donor coordinates - MongoDB stores as [longitude, latitude]
      const donorLng = donor.location?.coordinates[0] || 0;
      const donorLat = donor.location?.coordinates[1] || 0;
      
      // Skip donors with no location data
      if (!donorLat || !donorLng) {
        return false;
      }
      
      // Calculate distance and check if within range
      const distance = calculateDistance(patientLat, patientLng, donorLat, donorLng);
      donor.distance = parseFloat(distance.toFixed(1)); // Add distance to donor object
      
      return distance <= maxDistance;
    })
    .sort((a, b) => a.distance - b.distance); // Sort by distance
};
