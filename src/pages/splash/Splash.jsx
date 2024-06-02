import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import logo from "../../assets/payper.png";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/payper/home", { replace: true });
      } else {
        navigate("/payper/menu", { replace: true });
      }
    });
  }, []);
  return (
    <section className="bg-special-one w-screen h-screen flex items-center flex-col gap-[20px] justify-center">
      <div>
        <img src={logo} alt="logo" />
      </div>
      <div>
        <RotatingLines
          visible={true}
          height="20"
          width="20"
          strokeColor="#2D60FF"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    </section>
  );
}

export default Splash;
