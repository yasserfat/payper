import React from "react";
import transaction from "../../assets/overview/transaction.png";

function TransactionItem({ name, date, amount, type }) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between">
      <div className=" w-[60px] h-[60px] bg-third-gray p-[10px] rounded-full">
        <img src={transaction} alt="transaction" />
      </div>
      <div>
        <h2 className="text-special-black font-semibold text-center text-sm">With: {name}</h2>
        <p className="text-third-blue text-center text-sm">{date}</p>
      </div>
      <div className="flex gap-[3px] text-sm">
        <p
          className={`${
            type === "payer" ? "text-special-red" : "text-special-green"
          } font-semibold overflow-hidden`}
        >
          {type === "payer" ? `-${amount}` : `+${amount}`}
        </p>
        <p
          className={`${
            type === "payer" ? "text-special-red" : "text-special-green"
          } font-semibold overflow-hidden`}
        >
          DZD
        </p>
      </div>
    </div>
  );
}

export default TransactionItem;
