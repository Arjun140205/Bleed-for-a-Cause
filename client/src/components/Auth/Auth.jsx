import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import LoginForm from "./LoginForm";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Navbar from "../Landing/Navbar";
import TextInput from "../ui/TextInput";
import PasswordInput from "../ui/PasswordInput";
import SelectInput from "../ui/SelectInput";

function Auth() {
  const [userType, setUserType] = useState("Patient");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");

    if (authToken && userType) {
      navigate(`/${userType}`);
    }
  }, [navigate]);

  const handleUserTypeChange = (type) => {
    setUserType(type);
    // Clear age when switching to Hospital type
    if (type === "Hospital") {
      setAge("");
    }
  };

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [state, setState] = useState("");
  const [license, setLicense] = useState("");
  const [district, setDistrict] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    symbol: false,
  });

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordChecks({
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[^A-Za-z0-9]/.test(value),
    });
  };

  const fetchDistricts = async (selectedState) => {
    if (!selectedState) return;

    try {
      const staticDistricts = {
        "Andhra Pradesh": [
          { id: "AP-1", name: "Anantapur" }, { id: "AP-2", name: "Chittoor" }, 
          { id: "AP-3", name: "East Godavari" }, { id: "AP-4", name: "Guntur" }, 
          { id: "AP-5", name: "Krishna" }, { id: "AP-6", name: "Kurnool" }, 
          { id: "AP-7", name: "Prakasam" }, { id: "AP-8", name: "Srikakulam" }, 
          { id: "AP-9", name: "Visakhapatnam" }, { id: "AP-10", name: "Vizianagaram" },
          { id: "AP-11", name: "West Godavari" }, { id: "AP-12", name: "YSR Kadapa" }, 
          { id: "AP-13", name: "Nellore" }
        ],
        "Delhi": [
          { id: "DL-1", name: "Central Delhi" }, { id: "DL-2", name: "East Delhi" }, 
          { id: "DL-3", name: "New Delhi" }, { id: "DL-4", name: "North Delhi" }, 
          { id: "DL-5", name: "North East Delhi" }, { id: "DL-6", name: "North West Delhi" }, 
          { id: "DL-7", name: "South Delhi" }, { id: "DL-8", name: "South East Delhi" }, 
          { id: "DL-9", name: "South West Delhi" }, { id: "DL-10", name: "West Delhi" }
        ],
        "Karnataka": [
          "Bangalore Urban", "Bangalore Rural", "Belgaum", "Bellary", "Bidar",
          "Vijayapura", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru",
          "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad",
          "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar",
          "Koppal", "Mandya", "Mysore", "Raichur", "Ramanagara",
          "Shivamogga", "Tumkur", "Udupi", "Uttara Kannada", "Yadgir"
        ],
        "Maharashtra": [
          "Mumbai City", "Mumbai Suburban", "Thane", "Palghar", "Raigad",
          "Ratnagiri", "Sindhudurg", "Nashik", "Dhule", "Nandurbar",
          "Jalgaon", "Ahmednagar", "Pune", "Satara", "Sangli", "Solapur",
          "Kolhapur", "Aurangabad", "Beed", "Nanded", "Osmanabad",
          "Latur", "Amravati", "Akola", "Washim", "Buldhana", "Nagpur",
          "Wardha", "Bhandara", "Gondia", "Chandrapur", "Gadchiroli",
          "Yavatmal", "Parbhani", "Hingoli", "Jalna"
        ],
        "Tamil Nadu": [
          "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul",
          "Erode", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri",
          "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur",
          "Pudukkottai", "Ramanathapuram", "Salem", "Sivaganga",
          "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli",
          "Tirunelveli", "Tiruppur", "Tiruvallur", "Tiruvannamalai",
          "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
        ],
        "Uttar Pradesh": [
          "Agra", "Aligarh", "Prayagraj", "Ambedkar Nagar", "Amethi",
          "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich",
          "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly",
          "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr",
          "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah",
          "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad",
          "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda",
          "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras",
          "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat",
          "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar",
          "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj",
          "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur",
          "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh",
          "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar",
          "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar",
          "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"
        ],
        "Gujarat": [
          "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha",
          "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod",
          "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath",
          "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar",
          "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal",
          "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat",
          "Surendranagar", "Tapi", "Vadodara", "Valsad"
        ]
      };

      // If we have districts for the selected state, use them
      if (staticDistricts[selectedState]) {
        setDistricts(staticDistricts[selectedState]);
        // If the array is of objects, extract city names; if strings, use as is
        if (typeof staticDistricts[selectedState][0] === 'object') {
          setCities(staticDistricts[selectedState].map(d => d.name));
        } else {
          setCities(staticDistricts[selectedState]);
        }
      } else {
        // For states without predefined districts, set generic districts with IDs
        setDistricts([
          { id: "GEN-1", name: "District Headquarters" },
          { id: "GEN-2", name: "Central District" },
          { id: "GEN-3", name: "North District" },
          { id: "GEN-4", name: "South District" },
          { id: "GEN-5", name: "East District" },
          { id: "GEN-6", name: "West District" }
        ]);
        setCities(["District Headquarters", "Central District", "North District", "South District", "East District", "West District"]);
      }
      setDistrict(""); // Reset selected district
      setCity(""); // Reset selected city
    } catch (error) {
      console.error("Error setting districts:", error);
      Toast.fire({
        icon: "error",
        title: "Error loading districts",
        text: "Please try again"
      });
      setDistricts([
        { id: "FALL-1", name: "District Headquarters" },
        { id: "FALL-2", name: "Central District" },
        { id: "FALL-3", name: "Main District" }
      ]); // Fallback districts with IDs
      setCities(["District Headquarters", "Central District", "Main District"]);
    }
  };

  const handlePatientLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      emailId: email,
      password: password,
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/login/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        if (data.token) {
          localStorage.clear();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userType", data.userType);
          localStorage.setItem("userData", JSON.stringify(data.userData));
        }

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have logged in successfully!",
        }).then(() => {
          navigate("/patient");
        });
      } else {
        console.error("Login failed:", data.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  // global toast property prevent from DRY

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const handlePatientSignup = async (e) => {
    e.preventDefault();

    const patientData = {
      name: name,
      emailId: email,
      password: password,
      phoneNumber: contact,
      age: age,
      medicalCondition: medicalCondition,
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/signup/patient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);

        Toast.fire({
          icon: "success",
          html: "<strong>Signup successful</strong>",
          timer: 2000,
        });

        setTimeout(async () => {
            Toast.fire({
            icon: "info",
            html: "<strong>Redirecting...</strong>",
            timer: 2000,
          });
          window.location.reload();
        }, 3000);
      } else {
        console.error("Signup failed:", data.message);
        Toast.fire({
          icon: "error",
          html: `<strong style="font-weight:bold;">${data.message}</strong>`,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Toast.fire({
        icon: "error",
        html: `<strong style="font-weight:bold;">${
          error.message || "Something went wrong."
        }</strong>`,
      });
    }
  };

  const handleDonorLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      emailId: email,
      password: password,
    };

    try {
      const response = await fetch(`${BASE_URL}/login/donor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        if (data.token) {
          localStorage.clear();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userType", data.userType);
        }

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have logged in successfully!",
        }).then(() => {
          // Redirect user after login (Modify as needed)
          navigate("/donor");
        });
      } else {
        console.error("Login failed:", data.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  const handleDonorSignup = async (e) => {
    e.preventDefault();

    const donorData = {
      name: name,
      emailId: email,
      password: password,
      phoneNumber: contact,
      age: age,
    };

    try {
      const response = await fetch(`${BASE_URL}/auth/signup/donor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(donorData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);

        Toast.fire({
          icon: "success",
          html: "<strong>Signup successful</strong>",
          timer: 2000,
        });
        Toast.fire({
          icon: "success",
          title: "Signed up successfully",
        });
        setTimeout(async () => {
          Toast.fire({
            icon: "info",
            html: "<strong>Redirecting...</strong>",
            timer: 2000,
          });
          window.location.reload();
        }, 3000);
      } else {
        console.error("Signup failed:", data.message);
        Toast.fire({
          icon: "error",
          html: `<strong style="font-weight:bold;">${data.message}</strong>`,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Toast.fire({
        icon: "error",
        html: `<strong style="font-weight:bold;">${
          error.message || "Something went wrong."
        }</strong>`,
      });
    }
  };

  const handleHospitalLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      emailId: email,
      password: password,
    };

    try {
      const response = await fetch(`${BASE_URL}/login/hospital`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        if (data.token) {
          localStorage.clear();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userType", data.userType);
        }

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "You have logged in successfully!",
        }).then(() => {
          // Redirect user after login (Modify as needed)
          navigate("/hospital");
        });
      } else {
        console.error("Login failed:", data.message);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  const handleHospitalSignup = async (e) => {
    e.preventDefault();

    const hospitalData = {
      name: name,
      emailId: email,
      password: password,
      phoneNumber: contact,
      licenseNumber: license,
      state: state,
      city: city,
      district: district
    };

    console.log('Hospital signup data:', hospitalData);

    try {
      const response = await fetch(`${BASE_URL}/auth/signup/hospital`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hospitalData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);

        Toast.fire({
          icon: "success",
          html: "<strong>Signup successful</strong>",
          timer: 2000,
        });
        Toast.fire({
          icon: "success",
          title: "Signed up successfully",
        });
        setTimeout(async () => {
          Toast.fire({
            icon: "info",
            html: "<strong>Redirecting...</strong>",
            timer: 2000,
          });
          // window.location.reload();
        }, 3000);
      } else {
        console.error("Signup failed:", data.message);
        Toast.fire({
          icon: "error",
          html: `<strong style="font-weight:bold;">${data.message}</strong>`,
        });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      Toast.fire({
        icon: "error",
        html: `<strong style="font-weight:bold;">${
          error.message || "Something went wrong."
        }</strong>`,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    switch (userType) {
      case "Patient":
        handlePatientSignup(e);
        break;
      case "Donor":
        handleDonorSignup(e);
        break;
      case "Hospital":
        handleHospitalSignup(e);
        break;
      default:
        break;
    }
  };

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry"
  ];

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setContact("");
    setMedicalCondition("");
    setState("");
    setLicense("");
    setDistrict("");
    setCity("");
    // Only reset age if not hospital type
    if (userType !== "Hospital") {
      setAge("");
    }
  };

  useEffect(() => {
    resetForm();
  }, [userType, isSignup]);

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100 p-4">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,0,0,0.1),transparent_50%)]"></div>
          
          {/* Animated blood drop shapes */}
          <div className="absolute top-1/4 left-1/5 w-64 h-64 rounded-full bg-red-500/5 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/5 w-96 h-96 rounded-full bg-red-500/5 blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 z-10 mt-20"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="relative w-20 h-20 mx-auto mb-3"
            >
              <img
                src="/Blood.png"
                alt="Bleed for a Cause"
                className="w-full h-full object-contain"
              />
              <motion.div 
                className="absolute inset-0 rounded-full bg-red-500/10" 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent"
            >
              {isSignup ? "Create Account" : "Welcome Back"}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 mt-2"
            >
              {isSignup ? "Join our community today" : "Login to your account"}
            </motion.p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-gray-100/70 backdrop-blur-sm shadow-inner">
              {["Patient", "Donor", "Hospital"].map((type) => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserTypeChange(type)}
                  className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    userType === type
                      ? "bg-white text-red-600 shadow"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  {type}
                  {userType === type && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Toggle between Login and Signup */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex p-1 rounded-xl bg-gray-100/70 backdrop-blur-sm shadow-inner">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSignup(false)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  !isSignup
                    ? "bg-white text-red-600 shadow"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                Login
                {!isSignup && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsSignup(true)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isSignup
                    ? "bg-white text-red-600 shadow"
                    : "text-gray-600 hover:text-red-500"
                }`}
              >
                Sign Up
                {isSignup && (
                  <motion.div
                    layoutId="authTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.button>
            </div>
          </div>

          {isSignup ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              key="signup-form"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <TextInput
                  label={null}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                />
                {/* City (only for Hospital) */}
                {userType === "Hospital" && (
                  <SelectInput
                    label={null}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    options={cities}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  />
                )}
                {/* Age - Only for Patient and Donor */}
                {(userType === "Patient" || userType === "Donor") && (
                  <TextInput
                    label={null}
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  />
                )}
                {/* Contact */}
                <TextInput
                  label={null}
                  type="tel"
                  placeholder="Contact Number"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                />
                {/* Email */}
                <TextInput
                  label={null}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                />
                {/* Password */}
                <PasswordInput
                  label={null}
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300 pr-12"
                />
                {/* Password Checks */}
                <div className="space-y-2 text-sm">
                  {Object.entries(passwordChecks).map(([check, passed]) => (
                    <div
                      key={check}
                      className={`flex items-center ${
                        passed ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {passed ? "✓" : "○"} {check === "length"
                        ? "At least 8 characters"
                        : check === "upper"
                        ? "One uppercase letter"
                        : check === "lower"
                        ? "One lowercase letter"
                        : check === "number"
                        ? "One number"
                        : "One special character"}
                    </div>
                  ))}
                </div>
                {/* Conditional Fields based on userType */}
                {userType === "Patient" && (
                  <TextInput
                    label={null}
                    type="text"
                    placeholder="Medical Condition (if any)"
                    value={medicalCondition}
                    onChange={(e) => setMedicalCondition(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                  />
                )}
                {userType === "Hospital" && (
                  <>
                    <TextInput
                      label={null}
                      type="text"
                      placeholder="License Number"
                      value={license}
                      onChange={(e) => setLicense(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    />
                    {/* State (for all types) */}
                    <SelectInput
                      label={null}
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        fetchDistricts(e.target.value);
                      }}
                      required
                      options={indianStates}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    />
                    {/* City (only for Hospital) */}
                    <SelectInput
                      label={null}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      options={cities}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    />
                    <SelectInput
                      label={null}
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      options={districts.map(dist => dist.name || dist)}
                      className="w-full px-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
                    />
                  </>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold 
                    shadow-lg shadow-red-500/30 hover:shadow-red-500/40 
                    transition-all duration-300"
                >
                  Create Account
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              key="login-form"
            >
              <LoginForm
                userType={userType}
                onSuccess={(token, type) => {
                  localStorage.setItem("authToken", token);
                  localStorage.setItem("userType", type.toLowerCase());
                  navigate(`/${type.toLowerCase()}`);
                }}
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
}

export default Auth;
