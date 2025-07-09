import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const HospitalNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userType");
        navigate("/login");
      }
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl shadow-lg border-b border-red-200/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo/Title */}
        <Link to="/hospital" className="flex items-center gap-2">
          <img src="/Blood.png" alt="Bleed for a Cause" className="h-8 w-auto" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
            Hospital Portal
          </span>
        </Link>
        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link
            to="/hospital"
            className={`font-semibold px-4 py-2 rounded-lg transition-all ${location.pathname === "/hospital" ? "bg-gradient-to-r from-red-500 to-orange-400 text-white shadow" : "text-red-700 hover:bg-red-100"}`}
          >
            Dashboard
          </Link>
          <Link
            to="/hospital/requestmanagement"
            className={`font-semibold px-4 py-2 rounded-lg transition-all ${location.pathname.startsWith("/hospital/requestmanagement") ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow" : "text-red-700 hover:bg-red-100"}`}
          >
            Blood Requests
          </Link>
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 font-semibold rounded-lg bg-gradient-to-r from-red-500 to-orange-400 text-white shadow hover:scale-105 transition-transform"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default HospitalNavbar;
