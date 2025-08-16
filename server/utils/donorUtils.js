/**
 * Utility functions for donor eligibility and notifications
 */

/**
 * Calculate donor eligibility status and next donation date
 * @param {Date} lastDonationDate - Date of last donation
 * @returns {Object} Eligibility status and details
 */
export const calculateEligibility = (lastDonationDate) => {
  if (!lastDonationDate) {
    return {
      isEligible: true,
      message: "Eligible to donate",
      nextDonationDate: null,
      daysUntilEligible: 0
    };
  }

  const today = new Date();
  const lastDonation = new Date(lastDonationDate);
  const diffTime = Math.abs(today - lastDonation);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Standard waiting period is 90 days
  const waitingPeriod = 90;
  const daysUntilEligible = Math.max(0, waitingPeriod - diffDays);
  
  // Calculate next eligible donation date
  const nextDonationDate = new Date(lastDonation);
  nextDonationDate.setDate(nextDonationDate.getDate() + waitingPeriod);
  
  if (diffDays >= waitingPeriod) {
    return {
      isEligible: true,
      message: "Eligible to donate",
      nextDonationDate: null,
      daysUntilEligible: 0,
      lastDonationDate
    };
  }
  
  return {
    isEligible: false,
    message: `You can donate again in ${daysUntilEligible} days`,
    nextDonationDate,
    daysUntilEligible,
    lastDonationDate
  };
};

/**
 * Send notification to eligible donors
 * @param {Object} donor - Donor document
 * @param {Object} patientDetails - Patient details including location and blood type
 * @returns {Promise<boolean>} Whether notification was sent successfully
 */
export const sendDonationNotification = async (donor, patientDetails) => {
  try {
    // Example email content
    const emailContent = {
      subject: "Urgent: Blood Donation Request",
      body: `Dear ${donor.name},
      
A thalassemia patient in your area needs blood type ${patientDetails.bloodType}. 
You are receiving this notification because you are a compatible donor within ${donor.notificationPreferences.radius}km of the patient's location.

If you are available to donate, please respond to this email or contact the blood bank.

Thank you for your help!`
    };

    // Here you would integrate with your email/SMS service
    // For now, we'll just log it
    console.log("Would send notification:", {
      to: donor.emailId,
      ...emailContent
    });

    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

/**
 * Calculate donation frequency score
 * @param {Array} donations - Array of donation dates
 * @returns {Object} Frequency metrics
 */
export const calculateDonationFrequency = (donations) => {
  if (!donations || donations.length === 0) {
    return {
      frequency: 0,
      regularity: 0,
      lastYear: 0
    };
  }

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // Count donations in last year
  const lastYearDonations = donations.filter(date => 
    new Date(date) >= oneYearAgo
  ).length;

  // Calculate average gap between donations
  const sortedDonations = [...donations].sort((a, b) => new Date(b) - new Date(a));
  let gaps = [];
  for (let i = 0; i < sortedDonations.length - 1; i++) {
    const gap = Math.abs(new Date(sortedDonations[i]) - new Date(sortedDonations[i + 1]));
    gaps.push(gap / (1000 * 60 * 60 * 24)); // Convert to days
  }

  const averageGap = gaps.length > 0 ? gaps.reduce((a, b) => a + b) / gaps.length : 0;
  const regularity = gaps.length > 0 ? 1 - (Math.std(gaps) / averageGap) : 0;

  return {
    frequency: lastYearDonations,
    regularity: regularity,
    lastYear: lastYearDonations
  };
};
