import React from "react";
import logo from "../../assets/payper.png";

import { FaBars } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

function NavBar({ isSideBarShown, setIsSideBarShown }) {
  return (
    <nav className="fixed z-20 bg-white w-full flex justify-between nav-shadow items-center px-[32px] xl:px-[130px] py-[30px]">
      <div className="flex items-center gap-[20px]">
        <Link className="flex items-center gap-[9px]" to="/payper/menu">
          <img className="w-[35px]" src={logo} alt="logo" />
          <h3 className="text-second-blue font-bold">PayPer</h3>
        </Link>
      </div>
      <ul className="hidden lg:flex space-x-2 text-forest-green font-semibold">
        <li>
          <a
            className="hover:bg-third-gray p-[6px] rounded-2xl duration-150 ease-in-out"
            href=""
          >
            Help
          </a>
        </li>
        <li>
          <Link
            className="hover:bg-third-gray p-[6px] rounded-2xl duration-150 ease-in-out"
            to="/payper/menu/login"
          >
            Log in
          </Link>
        </li>
        <li>
          <Link
            className=" text-white hover:bg-main-blue bg-second-blue text-[15px] font-semibold px-[10px] py-[5px] rounded-2xl duration-150 ease-in-out"
            to="/payper/menu/register"
          >
            Register
          </Link>
        </li>
      </ul>
      <div
        onClick={() => setIsSideBarShown((prevVal) => !prevVal)}
        className="bg-third-gray w-[40px] h-[40px] lg:hidden flex justify-center items-center rounded-full cursor-pointer"
      >
        {!isSideBarShown ? (
          <FaBars className="text-xl text-second-blue" />
        ) : (
          <FaTimes className="text-xl text-second-blue" />
        )}
      </div>
    </nav>
  );
}

export default NavBar;
