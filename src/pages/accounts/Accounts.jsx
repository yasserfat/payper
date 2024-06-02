import React, { useEffect, useState } from "react";
import chipCard from "../../assets/overview/chip-card.png";
import chipCardBlack from "../../assets/overview/chip-card-black.png";
import algeriePost from "../../assets/overview/algerie-poste.svg";
import balance from "../../assets/accounts/balance.png";
import income from "../../assets/accounts/income.png";
import expense from "../../assets/accounts/expense.png";
import transaction from "../../assets/overview/transaction.png";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ThreeDots } from "react-loader-spinner";
import { auth, db } from "../../firebase";
import TransactionItem from "../../components/transactions-item/TransactionItem";
import WaitCard from "../../components/wait-card/WaitCard";
import toast, { Toaster } from "react-hot-toast";

function Accounts() {
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
            if (
              userData.role !== "admin" &&
              userData?.isCardVerified === false
            ) {
              appUsers.push(userData);
            }
          });
          setPayperUsers(appUsers);
          setLoading(false);
        }
      });
    };
    fetchData();
  }, [payperUsers]);

  const verifyAccount = (accountId) => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src="https://cdn3d.iconscout.com/3d/premium/thumb/debit-card-9801608-7946527.png?f=webp"
                alt="card-scan"
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">Payper Team</p>
              <p className="mt-1 text-sm text-gray-500">Scan the card</p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => verifiedAccount(accountId)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Scan Now
          </button>
        </div>
      </div>
    ));
  };

  const verifiedAccount = async (accountId) => {
    try {
      const userToVerify = payperUsers.find((user) => user.id == accountId);
      if (!userToVerify) {
        toast.error("User not found");
        return;
      }

      const userRef = doc(db, "users", accountId);
      await updateDoc(userRef, {
        isCardVerified: true,
      });

      toast.success("Account verified successfully");

      setPayperUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.cardId == userToVerify.cardId
            ? { ...user, isCardVerified: true }
            : user
        )
      );
    } catch (error) {
      console.error("Error verifying account:", error);
      toast.error("Failed to verify account");
    }
  };

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
              Accounts to verify
            </h2>
            <input
              type="text"
              placeholder="Search by anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border p-2 rounded-lg text-sm"
            />
          </div>

          {searchResults.length != 0 ? (
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
                    {!payperUser.isCardVerified ? (
                      <td className="border-2 bg-third-blue">
                        <button
                          onClick={() => verifyAccount(payperUser.id)}
                          className="w-full"
                        >
                          Verify
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm md:text-base my-[10px] text-center md:text-left">No users to verify</p>
          )}
        </div>
      ) : (
        <div>
          <div>
            <div className="flex flex-col md:flex-row gap-[20px] text-sm">
              <div className="bg-white flex items-center justify-center gap-[20px] p-[20px] rounded-lg">
                <div className="bg-third-gray w-[50px] h-[50px] p-[5px] rounded-full">
                  <img className="w-full" src={balance} alt="balance" />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <h4 className="text-main-gray">My Balance</h4>
                  <p className="text-second-blue font-semibold text-xl">
                    {!userDoc ? (
                      <div className="flex justify-center items-center">
                        <ThreeDots
                          height="30"
                          width="30"
                          color="#343C6A"
                          ariaLabel="loading"
                        />
                      </div>
                    ) : (
                      <>DZD {userDoc?.balance}</>
                    )}
                  </p>
                </div>
              </div>
              <div className="bg-white flex items-center justify-center gap-[20px] p-[20px] rounded-lg">
                <div className="bg-third-gray w-[50px] h-[50px] p-[5px] rounded-full">
                  <img className="w-full" src={income} alt="income" />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <h4 className="text-main-gray">Income</h4>
                  <p className="text-second-blue font-semibold text-xl">
                    {!userDoc ? (
                      <div className="flex justify-center items-center">
                        <ThreeDots
                          height="30"
                          width="30"
                          color="#343C6A"
                          ariaLabel="loading"
                        />
                      </div>
                    ) : (
                      <p className="text-special-green">
                        DZD {userDoc?.income}
                      </p>
                    )}
                  </p>
                </div>
              </div>
              <div className="bg-white flex items-center justify-center gap-[20px] p-[20px] rounded-lg">
                <div className="bg-third-gray w-[50px] h-[50px] p-[5px] rounded-full">
                  <img className="w-full" src={expense} alt="expense" />
                </div>
                <div className="flex flex-col gap-[2px]">
                  <h4 className="text-main-gray">Expense</h4>
                  <p className="text-second-blue font-semibold text-xl">
                    {!userDoc ? (
                      <div className="flex justify-center items-center">
                        <ThreeDots
                          height="30"
                          width="30"
                          color="#343C6A"
                          ariaLabel="loading"
                        />
                      </div>
                    ) : (
                      <p className="text-special-red">DZD {userDoc?.expense}</p>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[20px]">
              <div className="mt-[40px]">
                <h2 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl mb-[15px]">
                  Last Transaction
                </h2>
                <div className="bg-white p-[30px] rounded-xl flex flex-col gap-[40px]">
                  {userDoc?.transactions?.length === 0 ? (
                    <p className="text-second-blue text-center font-semibold text-sm: text-base">
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
              <div>
                <h2 className="text-second-blue font-semibold text-2xl mb-[15px]">
                  My Cards
                </h2>
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
              </div>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
}

export default Accounts;
