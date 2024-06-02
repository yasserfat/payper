import React, { useEffect, useState } from "react";
import WaitCard from "../../components/wait-card/WaitCard";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";

function Settings() {
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [cardId, setCardId] = useState("");
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
          setLoading(false);
        }
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFirstName(userDoc?.firstName);
    setLastName(userDoc?.lastName);
    setEmail(userDoc?.email);
    setCardId(userDoc?.cardId);
  }, [userDoc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users", userDoc.id);
    await updateDoc(userRef, {
      firstName: firstName,
      lastName: lastName,
    });
    toast.success("User information updated successfully!")
  };

  if (loading) {
    return (
      <section className="ml-[100px] lg:ml-[20%] p-[15px] md:p-[30px] bg-special-one min-h-[85vh]">
        <p className="text-sm md:text-base">waiting ...</p>
      </section>
    );
  }
  if (userDoc?.isCardVerified === false) {
    return <WaitCard />;
  }
  return (
    <section className="ml-[100px] lg:ml-[20%] p-[15px] md:p-[30px] bg-special-one min-h-[85vh] text-sm md:text-base">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 justify-center gap-[20px] w-[100%] lg:w-auto"
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
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <label className="font-semibold text-second-blue" htmlFor="last-name">
            Last Name
          </label>
          <input
            className="border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
            type="text"
            name="last-name"
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
            value={email}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-[10px]">
          <label className="font-semibold text-second-blue" htmlFor="card-id">
            Card Id
          </label>
          <input
            className="bg-white border-2 border-third-gray hover:border-second-gray duration-500 ease-in-out outline-second-blue p-[8px] rounded-md"
            name="card-id"
            id="card-id"
            value={cardId}
            disabled
            onChange={(e) => setCardId(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-second-blue p-[8px] text-white rounded-2xl font-semibold hover:bg-main-blue duration-300 ease-in-out"
        >
          Save
        </button>
      </form>
      <Toaster position="top-center" reverseOrder={false} />
    </section>
  );
}

export default Settings;
