import React, { useState, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function generateRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

function RegisterCashier() {
  const navigate = useNavigate();
  const form = useRef();
  const [randomNumber, setRandomNumber] = useState(generateRandomNumber());
  const [email, setEmail] = useState("");
  const [verifyCodeValue, setVerifyCodeValue] = useState("");
  const [showVerificationCodeInput, setShowVerificationCodeInput] =
    useState(false);
  const [showSendverificationCodeButton, shetShowSendverificationCodeButton] =
    useState(true);
  const [showRegisterButton, setShowRegisterButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRandomNumber(generateRandomNumber());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSendVerificationCode = () => {
    emailjs
      .sendForm("service_ddw9jud", "template_yulukwf", form.current, {
        publicKey: "hhmcLXrE3BexHveR_",
      })
      .then(
        () => {
          toast.success("Verification code sent successfully!");
          setShowVerificationCodeInput(true);
          shetShowSendverificationCodeButton(false);
        },
        (err) => {
          toast.error("Enter an exist email please!");
        }
      );
  };

  const handleVerifyCode = () => {
    if (verifyCodeValue == randomNumber) {
      toast.success("Verification code is correct, register now!");
      setShowRegisterButton(true);
      setShowVerificationCodeInput(false);
    } else {
      toast.error("Verification code is incorrect, try again!");
    }
  };

  console.log(verifyCodeValue);
  const handleRegister = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
    } else {
      setLoading(true);
      navigate("/payper/menu/user-collect-data", { state: { email, role: "cashier" } });
    }
  };

  return (
    <section className="md:w-[70%] lg:w-[50%] md:mx-auto">
      <div>
        <h2 className="text-second-blue text-2xl md:text-3xl text-center font-semibold">
          Create your Payper account
        </h2>
        <div className="flex justify-center gap-[5px] text-sm mt-[10px]">
          <p className="text-second-gray">Already have an account?</p>
          <Link
            to="/payper/menu/login"
            className="text-second-blue underline font-semibold"
          >
            Log in
          </Link>
        </div>
      </div>
      <form onSubmit={handleSubmit} ref={form} className="my-[50px]" action="">
        <div className="flex flex-col">
          <label className="text-second-gray text-sm" htmlFor="user-email">
            First, enter your email address
          </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="mt-[10px] rounded-[5px] p-[8px] border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-main-blue"
            type="email"
            name="user-email"
            id="user-email"
            disabled={showRegisterButton}
          />
        </div>
        {showSendverificationCodeButton ? (
          <button
            onClick={handleSendVerificationCode}
            className="mt-4 w-full p-3 text-white font-semibold bg-blue-500 rounded-md hover:bg-blue-600"
          >
            Send Verification code
          </button>
        ) : null}
        {showVerificationCodeInput ? (
          <div className="my-4">
            <input
              type="number"
              placeholder="Enter verification code"
              className="w-full p-3 border rounded-md"
              maxLength={6}
              value={verifyCodeValue}
              onChange={(e) => setVerifyCodeValue(e.target.value)}
            />
            <button
              onClick={handleVerifyCode}
              className="mt-4 w-full p-3 text-white font-semibold bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Verify Code
            </button>
          </div>
        ) : null}
        <div>
          <textarea
            className="hidden"
            name="message"
            value={`You code is ${randomNumber}`}
          />
        </div>

        <button
          onClick={handleRegister}
          className="mt-6 w-full p-[10px] text-main-black text-white text-[15px] font-semibold bg-second-blue rounded-3xl hover:bg-main-blue duration-150 ease-in-out"
          disabled={!showRegisterButton}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="mr-2">Registering...</div>
              <div className="loader"></div>
            </div>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <div className="flex flex-col mb-[20px]">
        <Link
          to="/payper/menu/registerasadmin"
          className="text-main-blue font-semibold underline"
        >
          Register as admin?
        </Link>
        <Link
          to="/payper/menu/register"
          className="text-main-blue font-semibold underline"
        >
          Register as user?
        </Link>
      </div>
      <div>
        <p className="text-sm text-second-gray text-center mt-[40px]">
          By registering, you accept our{" "}
          <Link className="text-main-black underline font-semibold">
            Terms of use
          </Link>{" "}
          and{" "}
          <Link className="text-main-black underline font-semibold">
            Privacy Policy
          </Link>
        </p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
}

export default RegisterCashier;
