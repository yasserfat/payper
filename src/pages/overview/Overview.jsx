import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase";

import chipCard from "../../assets/overview/chip-card.png";
import chipCardBlack from "../../assets/overview/chip-card-black.png";
import algeriePost from "../../assets/overview/algerie-poste.svg";

import { FaMoneyBillTransfer, FaWallet, FaPaperPlane } from "react-icons/fa6";
import { ThreeDots } from "react-loader-spinner";
import { Link } from "react-router-dom";
import TransactionItem from "../../components/transactions-item/TransactionItem";
import WaitCard from "../../components/wait-card/WaitCard";

function Overview() {
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const [payperUsers, setPayperUsers] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
          const appUsers = [];
          const allUsers = await getDocs(collection(db, "users"));
          allUsers.forEach((doc) => {
            const userData = doc.data();
            if (userData.role !== "admin") {
              appUsers.push(userData);
            }
          });
          setPayperUsers(appUsers);
          setLoading(false);
        }
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (payperUsers) {
      const filteredUsers = payperUsers.filter((user) =>
        Object.values(user).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setSearchResults(filteredUsers);
    }
  }, [searchQuery, payperUsers]);

  if (loading) {
    return (
      <section className="ml-[100px] lg:ml-[20%] p-[15px] md:p-[30px] bg-special-one min-h-[85vh]">
        <p className="text-sm md:text-base">waiting ...</p>
      </section>
    );
  }

  if (userDoc?.isCardVerified == false) {
    return <WaitCard />;
  }

  return (
    <section className="ml-[100px] lg:ml-[20%] p-[15px] md:p-[30px] bg-special-one min-h-[85vh]">
      {userDoc?.role === "admin" ? (
        <div>
          <div className="flex flex-col md:flex-row gap-[10px] items-center justify-between">
            <h2 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl">
              Users
            </h2>
            <input
              type="text"
              placeholder="Search by anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded-lg text-sm"
            />
          </div>
          <table className="w-full mt-[20px] text-[10px] sm:text-base">
            <thead>
              <tr>
                <th className="border text-left bg-white p-2">First Name</th>
                <th className="border text-left bg-white p-2">Last Name</th>
                <th className="border text-left bg-white p-2 hidden md:table-cell">Email</th>
                <th className="border text-left bg-white p-2 hidden md:table-cell">Card Id</th>
                <th className="border text-left bg-white p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((payperUser, index) => (
                <tr key={index}>
                  <td className="border-2 p-2">{payperUser.firstName}</td>
                  <td className="border-2 p-2">{payperUser.lastName}</td>
                  <td className="border-2 p-2 hidden md:table-cell">{payperUser.email}</td>
                  <td className="border-2 p-2 hidden md:table-cell">{payperUser.cardId}</td>
                  <td
                    className={`border-2 p-2 ${
                      payperUser.isCardVerified
                        ? "bg-special-green"
                        : "bg-special-red"
                    }`}
                  >
                    {payperUser.isCardVerified ? "Verified" : "Not Verified"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
          <div>
            <h2 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl mb-[15px]">
              My Cards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div className="bg-[#4C49ED] py-[15px] px-[30px] rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">Balance</h3>
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
                    <img className="w-[20px] lg:w-[30px]" src={chipCard} alt="chip-card" />
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
                    <h3 className="font-bold text-third-blue text-sm md:text-base">Balance</h3>
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
                    <img className="w-[20px] lg:w-[30px]" src={chipCardBlack} alt="chip-card" />
                  </div>
                </div>
                <div className="flex justify-between mt-[20px]">
                  <div>
                    <h3 className="font-bold text-third-blue text-sm md:text-base">Card Holder</h3>
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
          <div className="my-[50px]">
            <h2 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl mb-[15px]">
              Recent Transactions
            </h2>
            <div className="flex flex-col gap-[30px] items-center bg-white p-[30px] rounded-xl">
              {userDoc?.transactions?.length === 0 ? (
                <p className="text-second-blue font-semibold">
                  No transactions yet!
                </p>
              ) : userDoc ? (
                userDoc?.transactions?.map((item) => (
                  <TransactionItem
                    name={item.with}
                    date={item.date}
                    amount={item.amount}
                    type={item.type}
                  />
                ))
              ) : (
                <div className="flex justify-center items-center">
                  <ThreeDots
                    height="25"
                    width="25"
                    color="#343C6A"
                    ariaLabel="loading"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="mt-[50px]">
            <h2 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl mb-[15px]">
              Quick Actions
            </h2>
            <div className="flex flex-col md:flex-row gap-[20px] text-second-blue">
              <Link
                to="send-money"
                className="bg-white md:w-[200px] p-[20px] flex flex-col gap-[15px] rounded-xl font-semibold"
              >
                <FaPaperPlane className="text-xl" />
                <h2>Send Money</h2>
              </Link>
              <Link
                to="accounts"
                className="bg-white md:w-[200px] p-[20px] flex flex-col gap-[15px] rounded-xl font-semibold"
              >
                <FaWallet className="text-xl" />
                <h2>Wallet Details</h2>
              </Link>
              <Link
                to="transactions"
                className="bg-white md:w-[200px] p-[20px] flex flex-col gap-[15px] rounded-xl font-semibold"
              >
                <FaMoneyBillTransfer className="text-xl" />
                <h2>All transfers</h2>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Overview;
