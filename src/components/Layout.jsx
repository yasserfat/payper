import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { getDatabase, ref, onValue, update } from "firebase/database";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore"; // Import Firestore functions
import UsegetProductData from "../components/costum-ook/getCollections"; // Ensure this path is correct

function Layout() {
  const [rfid, setRfid] = useState(null);
  const [users, setUsers] = useState([]);
  const db = getDatabase();
  const firestore = getFirestore();

  useEffect(() => {
    const starCountRef = ref(db, "rfid");
    const unsubscribe = onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      setRfid((prevRfid) => {
        if (prevRfid !== data) {
          return data;
        }
        return prevRfid;
      });
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firestore, "users"));
      const userList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let rfidObj = null;
    if (rfid) {
      if (typeof rfid === "string") {
        try {
          rfidObj = JSON.parse(rfid);
        } catch (error) {
          console.error("Failed to parse rfid data:", error);
        }
      } else if (typeof rfid === "object") {
        rfidObj = rfid;
      }
    }

    if (rfidObj && rfidObj.data && rfidObj.data.uid) {
      console.log("RFID UID:", rfidObj.data.uid);

      let userExists = false;
      let passwordCorrect = false;
      let currentUser;
      if (users && Array.isArray(users)) {
        currentUser = users.find((item) => item.cardId == rfidObj.data.uid);
        if (currentUser && currentUser.passKey == rfidObj.password?.key) {
          passwordCorrect = true;
        }
        users.forEach((item) => {
          if (item.cardId == rfidObj.data.uid) {
            userExists = true;
          }
        });

        console.log("User Exists:", userExists);
        console.log("Password Correct:", passwordCorrect);

        const isExistRef = ref(db, "rfid/data");
        const isCorrectRef = ref(db, "rfid/password");
  console.log(userExists, "currentUser.balance");
        // Check if we need to update to avoid unnecessary writes
        if (
          rfidObj.data.isExist != userExists ||
          rfidObj.password.isCorrect != passwordCorrect ||
          rfidObj.amount.amount
        ) {
          console.log("ffffffffffffffffffffddd");
          // Prepare updates for isExist and isCorrect properties
          const updates = {
            "data/isExist": userExists,
            "password/isCorrect": passwordCorrect,
          };

          // Apply updates
          update(ref(db, "rfid"), updates)
            .then(async () => {
              console.log("Properties updated successfully.");

              // Check if currentUser.balance is greater than rfidObj.amount.amount

              if (
                rfidObj.amount?.amount != "" &&
                +currentUser.balance >= +rfidObj.amount?.amount &&
                passwordCorrect
              ) {
                const isDoableRef = ref(db, "rfid/amount");
                update(isDoableRef, { isDoable: true })
                  .then(() => {
                    console.log(
                      "isDoable property updated to false successfully."
                    );
                  })
                  .catch((error) => {
                    console.error("Error updating isDoable property:", error);
                  });
                // Subtract amount from current user's balance
                const currentUserRef = doc(firestore, "users", currentUser.id);
                const newBalance =
                  +currentUser.balance - +rfidObj.amount.amount;
                await updateDoc(currentUserRef, { balance: newBalance });
                console.log("Current user balance updated successfully.");

                // Find the user with email "y@devflows.eu"
                const targetUser = users.find(
                  (user) => user.email === "yasser.fatt19@gmail.com"
                );

                if (targetUser) {
                  // Add amount to target user's balance
                  const targetUserRef = doc(firestore, "users", targetUser.id);
                  const targetNewBalance =
                    +targetUser.balance + +rfidObj.amount.amount;

                  await updateDoc(targetUserRef, {
                    balance: targetNewBalance,
                    transactions: [{ amout: +rfidObj.amount.amount }],
                  });
                  console.log("Target user balance   updated successfully.");
                } else {
                  console.error("Target user not found.");
                }
              } else {
                // If not, set isDoable to false
                const isDoableRef = ref(db, "rfid/amount");
                update(isDoableRef, { isDoable: false })
                  .then(() => {
                    console.log(
                      "isDoable property updated to false successfully."
                    );
                  })
                  .catch((error) => {
                    console.error("Error updating isDoable property:", error);
                  });
              }
            })
            .catch((error) => {
              console.error("Error updating properties:", error);
            });
        }
      }
    }
  }, [rfid, users, firestore]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default Layout;
