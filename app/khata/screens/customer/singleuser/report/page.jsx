"use client";

import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import useGlobalStore from "@/store/zustandStore.js";
import { useRouter } from "next/navigation";
const data = {
  customerName: "Chacha",
  customerPhone: "3311331688",
  businessName: "AL - MUSTAFA GARMENTS",
  transactions: [
    {
      date: "9 Dec 2023",
      details: "Chawal",
      quantity: 36,
      debit: 693,
      credit: 0,
      balance: -693,
    },
    {
      date: "4 Feb 2024",
      details: "Kakal",
      quantity: 90,
      debit: 369,
      credit: 0,
      balance: -1062,
    },
  ],
  totalDebit: 1062,
  totalCredit: 0,
  balance: -1062,
};

const CustomerReport = () => {
  const reportRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => reportRef.current,
  });

  const {
    globalData,
    setSupp,
    Supp,
    user,
    AccountId,
    selectedValue,
    Cust,
    setGlobalData,
    setselectedAccountId,
  } = useGlobalStore();

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();
  const [transactionType, setTransactionType] = useState("gave");
  const [selectedTransaction, setSelectedTransaction] = useState(null); // For editing transactions

  const [datax, setDatax] = useState(null);

  useEffect(() => {
    const foundItem = (globalData.customers || []).find(
      (item) => item._id === Cust
    );
    setDatax(foundItem || null);
  }, [Cust, globalData]);

  const formattedTransactions = datax?.amount || [];

  const balance = formattedTransactions.reduce((acc, transaction) => {
    return transaction.amount === "I got"
      ? acc - transaction.comand
      : acc + transaction.comand;
  }, 0);

  const { totalCredit, totalDebit } = formattedTransactions.reduce(
    (acc, transaction) => {
      if (transaction.amount.toLowerCase() === "i got") {
        acc.totalCredit += transaction.comand;
      } else if (transaction.amount.toLowerCase() === "i gave") {
        acc.totalDebit += transaction.comand;
      }
      return acc;
    },
    { totalCredit: 0, totalDebit: 0 }
  );

  console.log("Total Credit:", totalCredit);
  console.log("Total Debit:", totalDebit);

  return (
    <div className=" border rounded-lg shadow-lg w-full  ">
      <div ref={reportRef} className="bg-white py-4">
        <button
          onClick={() => {
            router.back();
          }}
          className="  text-black p-2 rounded"
        >
          く
        </button>
        <div className="bg-blue-700 p-4 text-white">
          <div className=" flex justify-between">
            <h1 className="text-sm  font-bold ">{datax?.name || "unknown"}</h1>
            <h2 className="text-sm font-semibold ">AL - MUSTAFA GARMENTS</h2>
          </div>
          <p className="text-sm text-gray-100">
            {datax?.phoneNumber || "03333333333"}
          </p>
        </div>
        <table className="w-full border-collapse border mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border text-sm p-1">Date</th>
              <th className="border text-sm p-1">Detail</th>
              <th className="border text-sm p-1">Quant</th>
              <th className="border text-sm p-1">Debt</th>
              <th className="border text-sm p-1">Cr</th>
              <th className="border text-sm p-1">Bal</th>
            </tr>
          </thead>
          <tbody>
            {datax?.amount.map((tx, index) => (
              <tr key={index} className="border">
                <td className="p-1 text-sm border">{tx.time.split("T")[0]}</td>
                <td className="p-1 text-sm border">{tx.itemName || "none"}</td>
                <td className="p-1 text-sm border">{tx.quantity || 0}</td>
                <td className="p-1 text-sm border">
                  {tx.amount === "i gave" ? tx.comand : "0"}
                </td>
                <td className="p-1 text-sm border">
                  {tx.amount === "I got" ? tx.comand : "0" || 0}
                </td>
                <td className="p-1 text-sm border">
                  {tx.comand > 0 ? tx.comand : tx.comand * -1 || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm ml-2 font-bold">
          <p>Grand Total Debit: {totalDebit}</p>
          <p>Grand Total Credit: {totalCredit}</p>
          <p>Balance: {balance}</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerReport;
