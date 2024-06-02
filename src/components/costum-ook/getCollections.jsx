import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
export default function UsegetProductData(colName) {
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  const collectionRef = collection(db, colName);
  useEffect(() => {
    const getData = async () => {
      await onSnapshot(collectionRef, (snapshot) => {
        setData(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })));
        setLoader(true);
      });
    };
    getData();
  }, []);
  return { data, loader };
}
