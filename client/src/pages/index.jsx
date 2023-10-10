import AuthWrapper from "@/components/AuthWrapper";
import Companies from "@/components/Landing/Companies";
import Everything from "@/components/Landing/Everything";
import FiverrBusiness from "@/components/Landing/FiverrBusiness";
import HeroBanner from "@/components/Landing/HeroBanner";
import JoinFiverr from "@/components/Landing/JoinFiverr";
import PopularServices from "@/components/Landing/PopularServices";
import Services from "@/components/Landing/Services";
import { useStateProvider } from "@/context/StateContext";
import React from "react";

const index = () => {
  const [{ showLoginModal, showSignupModel }] = useStateProvider();
  return (
    <div>
      <HeroBanner />
      <Companies />
      <PopularServices />
      <Everything />
      <Services />
      <FiverrBusiness />
      <JoinFiverr />
      {(showSignupModel || showLoginModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
    </div>
  );
};

export default index;
