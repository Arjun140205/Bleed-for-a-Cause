import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

// Core components loaded immediately
import Navbar from "./components/Landing/Navbar";
import Footer from "./components/Landing/Footer";
import Loader from "./components/ui/Loader";

// Lazy loaded components
const LandingPage = lazy(() => import("./components/Landing/LandingPage"));
const Blog = lazy(() => import("./components/Landing/Blog"));
const Donor = lazy(() => import("./components/donor/Donor"));
const About = lazy(() => import("./components/Landing/About"));
const Contact = lazy(() => import("./components/Landing/Contact"));
const Campaigns = lazy(() => import("./components/Landing/Campaigns"));
const FAQ = lazy(() => import("./components/Landing/FAQ"));
const BloodBanks = lazy(() => import("./components/Landing/BloodBank"));
const Auth = lazy(() => import("./components/Auth/Auth"));
const Patient = lazy(() => import("./components/patient/Patient"));
const Requests = lazy(() => import("./components/patient/Requests"));
const PatientProfile = lazy(() => import("./components/patient/PatientProfile"));
const PatientDashboard = lazy(() => import("./components/patient/PatientDashboard"));
const HospitalHome = lazy(() => import("./components/hospital/HospitalHome"));
const HaemoglobinPredictor = lazy(() => import("./components/patient/Haemoglobin"));
const DonorDashboard = lazy(() => import("./components/donor/DonorDashboard"));
const DonorProfile = lazy(() => import("./components/donor/DonorProfile"));
const Donations = lazy(() => import("./components/donor/Donations"));
const EligibilityChecker = lazy(() => import("./components/donor/EligibilityChecker"));
const BloodRequestManagement = lazy(() => import("./components/hospital/BloodRequestManagement"));
const Disease = lazy(() => import("./components/patient/Disease"));
const Eligibility = lazy(() => import("./components/Landing/Eligibility"));
// import Footer from "./components/Landing/Footer";

const AppLayout = () => {
  return (
    <div className="app">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

// Loading fallback component
const LoadingFallback = () => <Loader />;

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <div className="app-container">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/eligibility" element={<Eligibility />} />
              <Route path="/banks" element={<BloodBanks />} />
            </Route>
            <Route path="/login" element={<Auth />} />
            
            {/* Patient Routes */}
            <Route path="/patient" element={<Patient />}>
              <Route index element={<PatientDashboard />} />
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="requests" element={<Requests />} />
              <Route path="haemoglobin" element={<HaemoglobinPredictor />} />
              <Route path="disease" element={<Disease />} />
            </Route>

            {/* Donor Routes */}
            <Route path="/donor" element={<Donor />}>
              <Route index element={<DonorDashboard />} />
              <Route path="dashboard" element={<DonorDashboard />} />
              <Route path="profile" element={<DonorProfile />} />
              <Route path="donations" element={<Donations />} />
              <Route path="eligibility" element={<EligibilityChecker />} />
            </Route>

            {/* Hospital Routes */}
            <Route path="/hospital" element={<HospitalHome />} />
            <Route path="/hospital/requestmanagement" element={<BloodRequestManagement />} />
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
