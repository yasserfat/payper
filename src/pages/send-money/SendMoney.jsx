import {
  RecaptchaVerifier,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import CurrencyInput from "react-currency-input-field";
import { auth, db } from "../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyPDF from "../../assets/Pdf";
import WaitCard from "../../components/wait-card/WaitCard";
// import { hash } from "bcryptjs";

function SendMoney() {
  const [loading, setLoading] = useState(true);
  const [cardId, setCardId] = useState("");
  const [amount, setAmount] = useState(0);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [recipientData, setRecipientData] = useState(null);
  const [transferData, setTransferData] = useState(null);
  const [payperUsers, setPayperUsers] = useState([]);
  const [usersCardIds, setUsersCardIds] = useState([]);
  const [enteredPassKey, setEnteredPassKey] = useState("");
  const [userDoc, setUserDoc] = useState(null);
  const [isMoneySent, setIsMoneySent] = useState(false);
  const [isPdfDownloaded, setIsPdfDownloaded] = useState(false);

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

          const usersCards = [];
          const allUsersCards = await getDocs(collection(db, "users"));
          allUsersCards.forEach((doc) => {
            usersCards.push(doc.data().cardId.toString());
          });
          setUsersCardIds(usersCards);

          const appUsers = [];
          const allUsers = await getDocs(collection(db, "users"));
          allUsers.forEach((doc) => {
            appUsers.push(doc.data());
          });
          setPayperUsers(appUsers);
          setLoading(false);
        }
      });
    };
    fetchData();
  }, []);

  const handleChangeCardId = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    setCardId(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cardId || !amount) {
      toast.error("Enter the required data please!");
    } else if (amount > userDoc?.balance) {
      toast.error("No enough money to send!");
    } else if (cardId == userDoc?.cardId) {
      toast.error("you can't send money to yourself, idiot!");
    } else if (!usersCardIds.includes(cardId)) {
      toast.error("Invalid card ID!");
    } else {
      if (enteredPassKey == userDoc?.passKey) {
        setRecipientData(payperUsers.find((user) => user.cardId == cardId));
        const newSenderTransaction = {
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          amount: +amount,
          with: `${recipientData?.firstName} ${recipientData?.lastName}`,
          type: "payer",
        };

        const updatedSenderTransactions = [
          ...userDoc?.transactions,
          newSenderTransaction,
        ];
        const senderRef = doc(db, "users", userDoc?.id);
        updateDoc(senderRef, {
          balance: +userDoc?.balance - +amount,
          expense: +userDoc?.expense + +amount,
          transactions: updatedSenderTransactions,
        });
        const newRecieverTransaction = {
          date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),

          amount: +amount,
          with: `${userDoc?.firstName} ${userDoc?.lastName}`,
          type: "payee",
        };

        const updatedRecieverTransactions = [
          ...userDoc?.transactions,
          newRecieverTransaction,
        ];

        const recipientRef = doc(db, "users", recipientData?.id);
        updateDoc(recipientRef, {
          balance: +recipientData?.balance + +amount,
          income: +recipientData?.income + +amount,
          transactions: updatedRecieverTransactions,
        });
        toast.success("Money sent successfully!");
        setIsMoneySent(true);
        setTransferData({
          senderFirstName: userDoc?.firstName,
          senderLastName: userDoc?.lastName,
          senderId: userDoc?.cardId,
          recipientFirstName: recipientData?.firstName,
          recipientLastName: recipientData?.lastName,
          recipientId: cardId,
          amount: amount,
        });
        setAmount(0);
        setCardId("");
        setEnteredPassKey("");
      } else {
        toast.error("wrong passkey!");
      }
    }
  };

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
      <h1 className="text-second-blue font-semibold text-lg sm:text-xl lg:text-2xl">
        Send money now!
      </h1>
      <form
        onSubmit={handleSubmit}
        className="mt-[40px] grid grid-cols-1 sm:grid-cols-2 justify-center gap-[20px] w-[100%] lg:w-auto"
      >
        <div className="flex flex-col gap-[10px]">
          <label
            className="font-semibold text-second-blue text-sm md:text-base"
            htmlFor="baridi-num"
          >
            Card Id
          </label>
          <input
            className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
            type="number"
            name="card-id"
            id="card-id"
            value={cardId}
            onChange={handleChangeCardId}
            placeholder="eg: 7900054912308282"
            maxLength={16}
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <label className="font-semibold text-second-blue text-sm md:text-base" htmlFor="amount">
            Amount
          </label>
          <CurrencyInput
            className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
            id="amount"
            name="amount"
            placeholder="Please enter a number"
            defaultValue={0}
            decimalsLimit={2}
            prefix="DZD "
            value={amount}
            onValueChange={(value) => setAmount(value)}
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <label
            className="font-semibold text-second-blue text-sm md:text-base"
            htmlFor="baridi-num"
          >
            Pass Key
          </label>
          <input
            className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
            type="password"
            name="pass-key"
            id="pass-key"
            value={enteredPassKey}
            onChange={(e) => setEnteredPassKey(e.target.value)}
            placeholder="eg: 1112"
            maxLength={4}
          />
        </div>
        <button
          type="submit"
          className="text-center col-span-full bg-second-blue p-[8px] text-white rounded-xl font-semibold hover:bg-main-blue duration-300 ease-in-out cursor-pointer"
        >
          Send money!
        </button>
      </form>
      <div id="recaptcha-container"></div>
      {isMoneySent &&(
        <button
          className="m-auto bg-second-blue hover:bg-main-blue text-white w-full p-[8px] rounded-xl mt-[50px] duration-300 ease-in-out"
        >
          <PDFDownloadLink
            document={<MyPDF transferData={transferData} />}
fileName={`transaction_${transferData.senderFirstName}_${transferData.recipientFirstName}_${new Date(transferData.date).toLocaleString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(/:/g, '-').replace(/\//g, '-')}.pdf`}            onLoadSuccess={() => setIsPdfDownloaded(true)}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download recipient pdf!"
            }
          </PDFDownloadLink>
        </button>
      )}
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
}

export default SendMoney;
