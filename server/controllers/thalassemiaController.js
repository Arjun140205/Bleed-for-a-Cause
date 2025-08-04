/**
 * Thalassemia Risk Controller
 * 
 * This controller handles calculations for determining thalassemia risk
 * in offspring based on parental thalassemia status
 */

/**
 * Calculate thalassemia risk based on parents' status
 * @param {Request} req - Express request object with motherStatus and fatherStatus in body
 * @param {Response} res - Express response object
 * @returns {Object} - Risk assessment result
 */
export const calculateThalassemiaRisk = async (req, res) => {
  try {
    const { motherStatus, fatherStatus } = req.body;

    // Validate input
    if (!motherStatus || !fatherStatus) {
      return res.status(400).json({ 
        success: false, 
        message: "Both mother and father status are required" 
      });
    }

    // Validate status values
    const validStatuses = ["normal", "minor", "major"];
    if (!validStatuses.includes(motherStatus) || !validStatuses.includes(fatherStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: "Status must be one of: normal, minor, or major" 
      });
    }

    // Calculate risk based on parental status
    let risk = "";
    let description = "";
    let riskPercentages = {};

    if (motherStatus === "normal" && fatherStatus === "normal") {
      risk = "No risk";
      description = "Both parents are normal, so there is no risk of thalassemia in offspring.";
      riskPercentages = {
        normal: "100%",
        minor: "0%",
        major: "0%"
      };
    } 
    else if ((motherStatus === "normal" && fatherStatus === "minor") || 
             (motherStatus === "minor" && fatherStatus === "normal")) {
      risk = "Carrier (Minor)";
      description = "One parent is a carrier. Each child has a 50% chance of being a carrier and 50% chance of being normal.";
      riskPercentages = {
        normal: "50%",
        minor: "50%",
        major: "0%"
      };
    } 
    else if (motherStatus === "minor" && fatherStatus === "minor") {
      risk = "High Risk of Thalassemia Major";
      description = "Both parents are carriers (thalassemia minor). Each child has a 25% chance of having thalassemia major, a 50% chance of being a carrier, and a 25% chance of being normal.";
      riskPercentages = {
        normal: "25%",
        minor: "50%",
        major: "25%"
      };
    } 
    else if ((motherStatus === "normal" && fatherStatus === "major") || 
             (motherStatus === "major" && fatherStatus === "normal")) {
      risk = "Carrier (Minor)";
      description = "One parent has thalassemia major, the other is normal. All children will be carriers (thalassemia minor).";
      riskPercentages = {
        normal: "0%",
        minor: "100%",
        major: "0%"
      };
    }
    else if ((motherStatus === "minor" && fatherStatus === "major") || 
             (motherStatus === "major" && fatherStatus === "minor")) {
      risk = "High Risk of Thalassemia Major";
      description = "One parent is a carrier, the other has thalassemia major. Each child has a 50% chance of having thalassemia major and a 50% chance of being a carrier.";
      riskPercentages = {
        normal: "0%",
        minor: "50%",
        major: "50%"
      };
    }
    else if (motherStatus === "major" && fatherStatus === "major") {
      risk = "High Risk of Thalassemia Major";
      description = "Both parents have thalassemia major. All children will have thalassemia major.";
      riskPercentages = {
        normal: "0%",
        minor: "0%",
        major: "100%"
      };
    }

    return res.status(200).json({
      success: true,
      result: {
        risk,
        description,
        riskPercentages
      }
    });
    
  } catch (error) {
    console.error("Error calculating thalassemia risk:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error calculating thalassemia risk" 
    });
  }
};
