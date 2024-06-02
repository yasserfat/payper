import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase";

import toast, { Toaster } from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const loginInWithUser = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/payper/home");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <section className="md:w-[70%] lg:w-[50%] md:mx-auto">
      <div>
        <h2 className="text-second-blue text-2xl md:text-3xl text-center font-semibold">
          Welcome Back
        </h2>
        <div className="flex justify-center gap-[5px] text-sm my-[20px]">
          <p className="text-second-gray">New to Payper?</p>
          <Link
            to="/payper/menu/register"
            className="text-second-blue underline font-semibold"
          >
            Sign up
          </Link>
        </div>
      </div>
      <form className="mb-[20px]" action="">
        <div className="flex flex-col gap-[8px]">
          <label className="text-second-gray text-sm" htmlFor="user-email">
            Your email adress
          </label>
          <input
            className="rounded-[5px] p-[8px] border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-main-blue"
            type="email"
            name="user-email"
            id=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-[8px] my-[30px]">
          <label className="text-second-gray text-sm" htmlFor="user-password">
            Your password
          </label>
          <div className="flex justify-between items-center rounded-md p-[8px] border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-main-blue">
            <input
              className="outline-none border-none flex-grow"
              onChange={(e) => setPassword(e.target.value)}
              type={`${showPassword ? "text" : "password"}`}
              name="user-password"
              id=""
              value={password}
            />
            <div
              onClick={handleTogglePassword}
              className="text-second-gray cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>
        </div>
        <button
          onClick={loginInWithUser}
          className="w-full p-[10px] text-white text-[15px] font-semibold bg-second-blue rounded-3xl hover:bg-main-blue duration-150 ease-in-out"
        >
          Login
        </button>
      </form>
      <Link className="text-main-black font-semibold underline">
        Trouble logging in?
      </Link>
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
}

export default Login;
