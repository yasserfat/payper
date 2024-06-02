import React from "react";

import landingImg from "../../assets/landing/landing-payment.png";
import { Link } from "react-router-dom";

function Landing() {

  return (
    <section className="pt-[70px]">
      <h1 className="md:text-5xl text-4xl uppercase text-second-blue font-bold text-center">
        Save when you send worldwide
      </h1>
      <p className="text-center text-lg text-second-gray my-[30px]">
        Get your money moving internationally. Save up to 5x when you send with
        Payper.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-[15px]">
        <button
          className="text-white text-[15px] font-semibold bg-third-blue hover:bg-main-blue border border-third-blue px-[20px] py-[10px] rounded-3xl duration-150 ease-in-out"
        >
          Send money now
        </button>
        <button className="text-white bg-second-blue text-[15px] font-semibold px-[20px] py-[10px] rounded-3xl border border-second-blue hover:border-main-blue hover:bg-main-blue duration-150 ease-in-out">
          <Link to="/payper/menu/register">Open an account</Link>
        </button>
      </div>
      <div className="flex justify-center mt-[50px]">
        <img className="w-[500px]" src={landingImg} alt="payment" />
      </div>
    </section>
  );
}

export default Landing;
