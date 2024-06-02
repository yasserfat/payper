import React, { useEffect, useState } from "react";
import logo from "../../assets/payper.png";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaMoneyBill,
  FaCog,
  FaUserAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function MainSidebar() {
  const activeStyles = {
    color: "#2D60FF",
  };

  const [userDoc, setUserDoc] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const usersQuery = query(
            collection(db, "users"),
            where("email", "==", user.email)
          );
          const querySnapshot = await getDocs(usersQuery);
          querySnapshot.forEach((doc) => {
            setUserDoc(doc.data());
          });
        }
      });
    };
    fetchData();
  }, []);

  const location = useLocation();

  return (
    <div className="fixed mainsidebar-shadow p-[30px] left-0 top-0 h-full w-[100px] lg:w-[20%]">
      <div className="flex items-center justify-center md:justify-normal md:gap-[8px]">
        <img className="w-[30px]" src={logo} alt="logo" />
        <h3 className="text-main-red hidden lg:block font-bold">PayPer</h3>
      </div>
      <ul className="flex flex-col mt-[40px] gap-[20px]">
        <li className="hover:bg-fourth-red font-semibold text-main-gray hover:text-second-red text-lg rounded-lg">
          <NavLink
            to="/payper/home"
            className="flex items-center gap-[8px] px-[10px] py-[8px] rounded-lg"
            style={location.pathname === "/payper/home" ? activeStyles : null}
          >
            <FaHome />
            <p className="hidden lg:block">Overview</p>
          </NavLink>
        </li>
        {userDoc?.role !== "admin" && (
          <li className="hover:bg-fourth-red text-main-gray hover:text-second-red font-semibold text-lg rounded-lg">
            <NavLink
              to="/payper/home/transactions"
              className="flex items-center gap-[8px] px-[10px] py-[8px] rounded-lg"
              style={
                location.pathname === "/payper/home/transactions" ||
                location.pathname === "/payper/home/transactions/income" ||
                location.pathname === "/payper/home/transactions/expense"
                  ? activeStyles
                  : null
              }
            >
              <FaMoneyBill />
              <p className="hidden lg:block">Transactions</p>
            </NavLink>
          </li>
        )}
        {userDoc?.role !== "admin" && (
          <li className="hover:bg-fourth-red text-main-gray hover:text-second-red font-semibold text-lg rounded-lg">
            <NavLink
              to="/payper/home/send-money"
              className="flex items-center gap-[8px] px-[10px] py-[8px] rounded-lg"
              style={
                location.pathname === "/payper/home/send-money"
                  ? activeStyles
                  : null
              }
            >
              <FaPaperPlane />
              <p className="hidden lg:block">Send Money</p>
            </NavLink>
          </li>
        )}
        <li className="hover:bg-fourth-red text-main-gray hover:text-second-red font-semibold text-lg rounded-lg">
          <NavLink
            to="/payper/home/accounts"
            className="flex items-center gap-[8px] px-[10px] py-[8px] rounded-lg"
            style={
              location.pathname === "/payper/home/accounts"
                ? activeStyles
                : null
            }
          >
            <FaUserAlt />
            <p className="hidden lg:block">Accounts</p>
          </NavLink>
        </li>
        <li className="hover:bg-fourth-red text-main-gray hover:text-second-red font-semibold text-lg rounded-lg">
          <NavLink
            to="/payper/home/settings"
            className="flex items-center gap-[8px] px-[10px] py-[8px] rounded-lg"
            style={
              location.pathname === "/payper/home/settings"
                ? activeStyles
                : null
            }
          >
            <FaCog />
            <p className="hidden lg:block">Settings</p>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default MainSidebar;
