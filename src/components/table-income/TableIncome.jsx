import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function TableIncome() {
  const [payeeTransactions, setPayeeTransactions] = useState([]);
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
            setPayeeTransactions(
              doc
                .data()
                .transactions.filter(
                  (transaction) => transaction.type === "payee"
                ) || []
            );
            setLoading(false); // set loading to false when data is fetched
          });
        }
      });
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : payeeTransactions.length === 0 ? (
        <div>No transactions found.</div>
      ) : (
        <table className="w-full mt-[20px] text-[10px] sm:text-sm md:text-base">
          <thead>
            <tr>
              <th className="border text-left bg-white p-2">Date</th>
              <th className="border text-left bg-white p-2">Amount</th>
              <th className="border text-left bg-white p-2">Type</th>
              <th className="border text-left bg-white p-2">With</th>
            </tr>
          </thead>
          <tbody>
            {payeeTransactions.map((transaction, index) => (
              <tr key={index}>
                <td className="border-2 p-2">{transaction.date}</td>
                <td className="border-2 p-2 font-bold text-special-green">
                  DZD {transaction.amount}
                </td>
                <td className="border-2 p-2">{transaction.type}</td>
                <td className="border-2 p-2">{transaction.with}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TableIncome;
