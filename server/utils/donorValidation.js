/**
 * Helper functions for donor-related operations
 */

export const normalizeBloodType = (bloodType) => {
  if (!bloodType || typeof bloodType !== 'string') {
    return null;
  }

  const valid = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const normalized = bloodType.toUpperCase().trim().replace(/\s/g, '');
  
  // Also check for alternative formats
  const alternatives = {
    'APOSITIVE': 'A+', 'ANEGATIVE': 'A-',
    'BPOSITIVE': 'B+', 'BNEGATIVE': 'B-',
    'ABPOSITIVE': 'AB+', 'ABNEGATIVE': 'AB-',
    'OPOSITIVE': 'O+', 'ONEGATIVE': 'O-',
    'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
    'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
    'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-',
    'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-'
  };

  if (valid.includes(normalized)) {
    return normalized;
  }

  const alternativeMatch = alternatives[normalized];
  return alternativeMatch || null;
};

export const validateCoordinates = (lat, lng) => {
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180;
};
