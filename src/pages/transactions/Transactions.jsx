import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";
import chipCard from "../../assets/overview/chip-card.png";
import chipCardBlack from "../../assets/overview/chip-card-black.png";
import algeriePost from "../../assets/overview/algerie-poste.svg";

import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import WaitCard from "../../components/wait-card/WaitCard";

function Transactions() {
  const activeStyles = {
    borderBottom: "3px solid #2D60FF",
    color: "#2D60FF",
    fontWeight: "bold",
  };

  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
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
          setLoading(false);
        }
      });
    };
    fetchData();
  }, []);

  const location = useLocation();

  if (loading) {
    return (
      <section className="ml-[100px] lg:ml-[20%] p-[15px] md:p-[30px] bg-special-one min-h-[85vh]">
        <p className="text-sm md:text-base">waiting ...</p>
      </section>
    );
  }

  if (!userDoc?.isCardVerified) {
    return <WaitCard />;
  }

  return (
    <section className="ml-[100px] lg:ml-[20%] p-[15px] md:p-[30px] bg-special-one min-h-[85vh]">
      <div>
        <h2 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl mb-[15px]">
          My Cards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
          <div className="bg-[#4C49ED] py-[15px] px-[30px] rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm md:text-base">
                  Balance
                </h3>
                <p className="text-white flex flex-row items-center gap-[4px] text-sm md:text-base">
                  DA
                  {!userDoc ? (
                    <ThreeDots
                      height="25"
                      width="25"
                      color="white"
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    ` ${userDoc.balance}`
                  )}
                </p>
              </div>
              <div>
                <img
                  className="w-[20px] lg:w-[30px]"
                  src={chipCard}
                  alt="chip-card"
                />
              </div>
            </div>
            <div className="flex justify-between mt-[20px]">
              <div>
                <h3 className="font-bold text-special-white text-sm md:text-base">
                  Card Holder
                </h3>
                <p className="text-white text-sm md:text-base">
                  {!userDoc ? (
                    <ThreeDots
                      height="25"
                      width="25"
                      color="white"
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    ` ${userDoc.firstName} ${userDoc.lastName}`
                  )}
                </p>
              </div>
            </div>
            <div className="mt-[40px] flex items-center justify-between">
              <p className="text-white text-sm md:text-base">
                {!userDoc ? (
                  <ThreeDots
                    height="25"
                    width="25"
                    color="white"
                    ariaLabel="three-dots-loading"
                  />
                ) : (
                  ` ${userDoc.cardId}`
                )}
              </p>
              <div>
                <img
                  className="w-[20px] lg:w-[30px]"
                  src={algeriePost}
                  alt="algerie-post-logo"
                />
              </div>
            </div>
          </div>
          <div className="bg-white py-[15px] px-[30px] rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-third-blue text-sm md:text-base">
                  Balance
                </h3>
                <p className="text-second-blue flex flex-row items-center gap-[4px] text-sm md:text-base">
                  DA
                  {!userDoc ? (
                    <ThreeDots
                      height="25"
                      width="25"
                      color={"#343C6A"}
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    ` ${userDoc.balance}`
                  )}
                </p>
              </div>
              <div>
                <img
                  className="w-[20px] lg:w-[30px]"
                  src={chipCardBlack}
                  alt="chip-card"
                />
              </div>
            </div>
            <div className="flex justify-between mt-[20px]">
              <div>
                <h3 className="font-bold text-third-blue text-sm md:text-base">
                  Card Holder
                </h3>
                <p className="text-second-blue text-sm md:text-base">
                  {!userDoc ? (
                    <ThreeDots
                      height="25"
                      width="25"
                      color={"#343C6A"}
                      ariaLabel="three-dots-loading"
                    />
                  ) : (
                    `${userDoc.firstName} ${userDoc.lastName}`
                  )}
                </p>
              </div>
            </div>
            <div className="mt-[40px] flex items-center justify-between">
              <p className="text-second-blue text-sm md:text-base">
                {!userDoc ? (
                  <ThreeDots
                    height="25"
                    width="25"
                    color={"#343C6A"}
                    ariaLabel="three-dots-loading"
                  />
                ) : (
                  `${userDoc.cardId}`
                )}
              </p>
              <div>
                <img
                  className="w-[20px] lg:w-[30px]"
                  src={algeriePost}
                  alt="algerie-post-logo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[40px]">
        <h2 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl mb-[15px]">
          Recent Transactions
        </h2>
        <ul className="flex items-center gap-[15px] mb-[20px] text-xs sm:text-base">
          <li>
            <NavLink
              className="pb-[5px] text-main-gray"
              activeClassName="font-bold text-second-blue border-b-2 border-second-blue"
              to="/payper/home/transactions"
              style={
                location.pathname === "/payper/home/transactions"
                  ? activeStyles
                  : null
              }
            >
              All Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              className="pb-[5px] text-main-gray"
              activeClassName="font-bold text-second-blue border-b-2 border-second-blue"
              to="/payper/home/transactions/income"
              style={
                location.pathname === "/payper/home/transactions/income"
                  ? activeStyles
                  : null
              }
            >
              Income
            </NavLink>
          </li>
          <li>
            <NavLink
              className="pb-[5px] text-main-gray"
              activeClassName="font-bold text-second-blue border-b-2 border-second-blue"
              to="/payper/home/transactions/expense"
              style={
                location.pathname === "/payper/home/transactions/expense"
                  ? activeStyles
                  : null
              }
            >
              Expense
            </NavLink>
          </li>
        </ul>

        <div>
          <Outlet />
        </div>
      </div>
    </section>
  );
}

export default Transactions;
