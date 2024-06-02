import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { IoLogOut, IoNotifications } from "react-icons/io5";
import { auth, db } from "../../firebase";
import toast from "react-hot-toast";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

function MainNavbar() {
  const navigate = useNavigate();
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
  }, [userDoc]);
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/payper/menu/login", { replace: true });
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <nav className="ml-[100px] lg:ml-[20%] nav-shadow flex justify-between gap-[20px] items-center p-[20px]">
      <div>
        <h2 className="text-sm sm:text-lg font-semibold text-main-black">
          Hello {userDoc?.firstName}
        </h2>
        <p className="text-xs sm:text-sm lg:text-base text-main-gray">See what's happening today </p>
      </div>
      <div className="flex items-center gap-[20px] text-second-gray text-lg sm:text-xl lg:text-2xl">
        <div>
          <IoNotifications />
        </div>
        <div>
          <FaUserCircle />
        </div>
        <div className="cursor-pointer" onClick={handleSignOut}>
          <IoLogOut />
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;
