import validator from "validator";

// Valid blood types
export const VALID_BLOOD_TYPES = ['a+', 'a-', 'b+', 'b-', 'ab+', 'ab-', 'o+', 'o-'];

/**
 * Normalize blood type format
 * @param {string} type - Blood type to normalize
 * @returns {string|null} - Normalized blood type or null if invalid
 */
export const normalizeBloodType = (type) => {
  if (!type) return null;
  const normalized = type.toString().toLowerCase().replace(/\s+/g, '');
  return VALID_BLOOD_TYPES.includes(normalized) ? normalized : null;
};

/**
 * Validate geographic coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} - Whether coordinates are valid
 */
export const validateCoordinates = (lat, lng) => {
  const validLat = typeof lat === 'number' && lat >= -90 && lat <= 90;
  const validLng = typeof lng === 'number' && lng >= -180 && lng <= 180;
  return validLat && validLng;
};

/**
 * Validate date format and range
 * @param {string} date - Date string to validate
 * @returns {boolean} - Whether date is valid
 */
export const validateDate = (date) => {
  const parsedDate = new Date(date);
  const now = new Date();
  return parsedDate instanceof Date && !isNaN(parsedDate) && parsedDate <= now;
};

const validateSignupData = (req, userType) => {
  if (userType === "patient") {
    const { name, emailId, password, phoneNumber, age } = req.body;

    if (!name) {
      throw new Error("Name is invalid");
    } else if (!validator.isEmail(emailId)) {
      throw new Error(emailId + " is invalid Email");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password must be strong <br> (A-Z, a-z, 0-9, symbol)");
    } else if (!validator.isMobilePhone(phoneNumber, "en-IN")) {
      throw new Error(phoneNumber + " is invalid Phone number");
    } else if (!age) {
      throw new Error("Enter correct Age");
    }
  } else if (userType === "donor") {
    const { name, emailId, password, phoneNumber, age } = req.body;

    if (!name) {
      throw new Error("Name is invalid");
    } else if (!validator.isEmail(emailId)) {
      throw new Error(emailId + " is invalid Email");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password must be strong <br> (A-Z, a-z, 0-9, symbol)");
    } else if (!validator.isMobilePhone(phoneNumber, "en-IN")) {
      throw new Error(phoneNumber + " is invalid Phone number");
    } else if (!age) {
      throw new Error("Enter correct Age");
    }
  } else if (userType === "hospital") {
    const { name, emailId, password, phoneNumber, licenseNumber, state, district } = req.body;

    if (!name) {
      throw new Error("Name is invalid");
    } else if (!validator.isEmail(emailId)) {
      throw new Error(emailId + " is invalid Email");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Password must be strong <br> (A-Z, a-z, 0-9, symbol)");
    } else if (!validator.isMobilePhone(phoneNumber, "en-IN")) {
      throw new Error(phoneNumber + " is invalid Phone number");
    } else if (!licenseNumber) {
      throw new Error("License number is required");
    } else if (!state) {
      throw new Error("State is required");
    } else if (!district) {
      throw new Error("District is required");
    }
  }
};

export default validateSignupData;
