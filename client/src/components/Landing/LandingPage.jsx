import React, { useState } from "react";
import HeroSection from "./HeroSection";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Loader from "../ui/Loader";

const LandingPage = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <div
      className="font-sans"
      style={{ background: "var(--bg-main)", color: "var(--text-main)" }}
    >
      {!isVideoLoaded && <Loader />}
      <HeroSection onVideoLoaded={() => setIsVideoLoaded(true)} />
      <Features />
      <HowItWorks />
      {/* Footer is already included in the App layout */}
    </div>
  );
};

export default LandingPage;