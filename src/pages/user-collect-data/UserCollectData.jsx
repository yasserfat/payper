import React, { useEffect, useState } from "react";
import chipCard from "../../assets/overview/chip-card.png";
import chipCardBlack from "../../assets/overview/chip-card-black.png";
import algeriePost from "../../assets/overview/algerie-poste.svg";
import toast, { Toaster } from "react-hot-toast";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
// import { sha256 } from "js-sha256";

function generatePassKey() {
  return Math.floor(1000 + Math.random() * 9000);
}

function generateCardId() {
  return Math.floor(1000000000000000 + Math.random() * 9000000000000000);
}

function UserCollectData() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, role } = state;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userEmail, setUserEmail] = useState(email);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cardId, setCardId] = useState("");
  const [passKey, setPassKey] = useState(generatePassKey());

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    setPassKey(generatePassKey());
    setCardId(generateCardId());
  }, []);

  // const hashPassKey = () => {
  //   return sha256(passKey.toString());
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      passKey === "" ||
      cardId === ""
    ) {
      toast.error("Please enter all the required data correctly!");
    } else {
      try {
        const loadingToastId = toast.loading("Submitting...");
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userEmail,
          password
        );
        const user = userCredential.user;
        const userId = user.uid;

        const userRef = doc(db, "users", userId);
        if (role == "user" || role == "cashier") {
          await setDoc(userRef, {
            id: userId,
            role,
            firstName,
            lastName,
            email,
            cardId,
            passKey,
            balance: 0,
            income: 0,
            expense: 0,
            transactions: [],
            isCardVerified: false,
          });
        } else {
          await setDoc(userRef, {
            id: userId,
            role,
            firstName,
            lastName,
            email,
            password,
            cardId,
          });
        }
        toast.success("User created successfully!", { id: loadingToastId });

        navigate("/payper/home");
      } catch (error) {
        toast.error("Failed to create user!", { id: loadingToastId });
        console.error("Error updating document: ", error);
      }
    }
  };

  return (
    <section>
      <h1 className="text-center text-lg sm:text-xl lg:text-2xl my-[20px] text-second-blue font-semibold">
        Enter the required data please!
      </h1>
      {role == "user" || role == "cashier" ? (
        <div className="flex flex-wrap items-center lg:flex-nowrap p-[30px] my-[30px] md:mx-[30px] gap-[80px] border border-second-blue rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 gap-[20px] w-full md:max-w-[400px]">
            <div className="bg-[#4C49ED] py-[15px] px-[30px] rounded-xl">
              <div className="flex items-center justify-end">
                <div>
                  <img src={chipCard} alt="chip-card" />
                </div>
              </div>
              <div className="flex justify-between mt-[20px]">
                <div>
                  <h3 className="font-bold text-special-white text-sm">Card Holder</h3>
                  <p className="text-white text-sm">
                    {firstName || "******"} {lastName || "******"}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-special-white text-sm">Pass Key</h3>
                  <p className="text-white text-sm">{passKey}</p>
                </div>
              </div>
              <div className="mt-[40px] flex items-center justify-between">
                <p className="text-white text-sm">{cardId || "**** **** **** ****"}</p>
                <div>
                  <img
                    className="w-[20px]"
                    src={algeriePost}
                    alt="algerie-post-logo"
                  />
                </div>
              </div>
            </div>
            <div className="bg-white py-[15px] px-[30px] rounded-xl border">
              <div className="flex items-center justify-end">
                <div>
                  <img src={chipCardBlack} alt="chip-card" />
                </div>
              </div>
              <div className="flex justify-between mt-[20px]">
                <div>
                  <h3 className="font-bold text-third-blue text-sm">Card Holder</h3>
                  <p className="text-second-blue text-sm">
                    {firstName || "******"} {lastName || "******"}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-third-blue">Pass Key</h3>
                  <p className="text-second-blue text-sm">{passKey}</p>
                </div>
              </div>
              <div className="mt-[40px] flex items-center justify-between">
                <p className="text-second-blue text-sm">
                  {cardId || "**** **** **** ****"}
                </p>
                <div>
                  <img
                    className="w-[20px]"
                    src={algeriePost}
                    alt="algerie-post-logo"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full">
            <form
              className="grid grid-cols-1 sm:grid-cols-2 text-sm md:text-base w-full justify-center gap-[20px] lg:w-auto"
              action=""
            >
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="first-name"
                >
                  First Name
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="text"
                  name="first-name"
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="eg: Abdelaziz"
                  maxLength={15}
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="last-name"
                >
                  Last Name
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="text"
                  name="last-name"
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="eg: Bourouaiah"
                  maxLength={15}
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="user-email"
                >
                  Email
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="email"
                  name="user-email"
                  id="user-email"
                  value={userEmail}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="user-password"
                >
                  Your password
                </label>
                <div className="flex items-center justify-between rounded-md p-[8px] border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-main-blue">
                  <input
                    className="outline-none border-none w-[75%]"
                    onChange={(e) => setPassword(e.target.value)}
                    type={`${showPassword ? "text" : "password"}`}
                    name="user-password"
                    id="user-password"
                    placeholder="Your Password"
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
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="card-id"
                >
                  Card Id
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="text"
                  name="card-id"
                  id="card-id"
                  value={cardId}
                  disabled
                  maxLength={16}
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="card-id"
                >
                  Pass key (remember it)
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="text"
                  name="pass-key"
                  id="pass-key"
                  value={passKey}
                  disabled
                  maxLength={4}
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-second-blue text-white p-[8px] rounded-2xl font-semibold hover:bg-main-blue duration-300 ease-in-out"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      ) : null}
      {role == "admin" ? (
        <div className="m-[30px] p-[30px] border border-second-blue rounded-lg overflow-hidden">
          <div>
            <form
              className="grid grid-cols-1 sm:grid-cols-2 text-sm md:text-base justify-center gap-[20px] w-[100%] lg:w-auto"
              action=""
            >
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="first-name"
                >
                  First Name
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="text"
                  name="first-name"
                  id="first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="eg: Abdelaziz"
                  maxLength={15}
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="last-name"
                >
                  Last Name
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="text"
                  name="last-name"
                  id="last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="eg: Bourouaiah"
                  maxLength={15}
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="user-email"
                >
                  Email
                </label>
                <input
                  className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
                  type="email"
                  name="user-email"
                  id="user-email"
                  value={userEmail}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label
                  className="font-semibold text-second-blue"
                  htmlFor="user-password"
                >
                  Your password
                </label>
                <div className="flex justify-between items-center rounded-md p-[8px] border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-main-blue">
                  <input
                    className="outline-none border-none flex-grow"
                    onChange={(e) => setPassword(e.target.value)}
                    type={`${showPassword ? "text" : "password"}`}
                    name="user-password"
                    id="user-password"
                    placeholder="Your Password"
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
                onClick={handleSubmit}
                className="w-full bg-second-blue text-white p-[8px] rounded-2xl font-semibold hover:bg-main-blue duration-300 ease-in-out"
              >
                Next
              </button>
            </form>
          </div>
        </div>
      ) : null}
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
}

export default UserCollectData;
