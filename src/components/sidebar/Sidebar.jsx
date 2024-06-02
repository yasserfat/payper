import React from "react";
import { Link } from "react-router-dom";

function Sidebar({isSideBarShown}) {
  return (
    <section className={`fixed sidebar-shadow bg-white pt-[120px] px-[20px] top-0 ${isSideBarShown ? 'left-0' : 'left-[-100%]'} z-10 h-full w-full duration-1000 ease-in-out`}>
      <button className="block text-white text-left w-full text-[15px] font-semibold bg-second-blue p-[10px] rounded-2xl hover:bg-main-blue duration-150 ease-in-out">
        Personal
      </button>
      <ul className="mt-[20px] gap-[10px] flex flex-col text-forest-green font-semibold">
        <li className="flex-grow hover:bg-third-gray p-[10px] rounded-2xl duration-150 ease-in-out">
          <a
            href=""
          >
            Pricing
          </a>
        </li>
        <li className="flex-grow hover:bg-third-gray p-[10px] rounded-2xl duration-150 ease-in-out">
          <a
            href=""
          >
            Help
          </a>
        </li>
      </ul>
      <div className="absolute w-full bottom-0 left-0 flex flex-col gap-[15px] px-[20px] pb-[20px]">
        <Link
          className="flex-grow text-center border border-main-black bg-third-gray p-[10px] rounded-2xl duration-150 ease-in-out"
          to="/payper/menu/login"
        >
          Log in
        </Link>
        <Link
          className="flex-grow text-center text-white text-[15px] font-semibold bg-second-blue p-[10px] rounded-2xl hover:bg-main-blue duration-150 ease-in-out"
          to="/payper/menu/register"
        >
          Register
        </Link>
      </div>
    </section>
  );
}

export default Sidebar;
