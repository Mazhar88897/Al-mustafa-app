"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowUp, ArrowDown } from "lucide-react";
import useGlobalStore from "@/store/zustandStore";
import axios from "axios";
import emailjs from "emailjs-com";
export default function TransactionComponent() {
  const [isSending, setIsSending] = useState(false);
  const [openW, setOpenW] = useState(false);
  const [emailW, setEmailW] = useState("");
  const handleSubmit = async () => {
    // e.preventDefault();
    setIsSending(true);
    const totalDebit = formattedTransactions
      .filter((txn) => txn.amount.toLowerCase() === "i gave")
      .reduce((sum, txn) => sum + txn.comand, 0);

    const totalCredit = formattedTransactions
      .filter((txn) => txn.amount.toLowerCase() === "i got")
      .reduce((sum, txn) => sum + txn.comand, 0);
    try {
      const response = await emailjs.send(
        "service_20cx135",
        "template_8juu2oc",
        {
          to_name: data?.name || "Customer",
          to_email: emailW,
          balance: balance,
          debit: totalDebit,
          credit: totalCredit,
        },
        "qliBGChgGi1aEpWI_"
      );

      alert("Email sent successfully!");
      console.log("Success:", response.status, response.text);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("Failed to send email. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("gave");
  const [selectedTransaction, setSelectedTransaction] = useState(null); // For editing transactions

  const [data, setData] = useState(null);

  useEffect(() => {
    const foundItem = (globalData.customers || []).find(
      (item) => item._id === Cust
    );
    setData(foundItem || null);
  }, [Cust, globalData]);

  const formattedTransactions = data?.amount || [];

  const balance = formattedTransactions.reduce((acc, transaction) => {
    return transaction.amount === "I got"
      ? acc - transaction.comand
      : acc + transaction.comand;
  }, 0);

  const saveData = async (postData, isEditing = false) => {
    if (!Cust) {
      console.error("Customer ID is missing!");
      return;
    }

    try {
      const postUrl = isEditing
        ? `https://khata-backend-express.vercel.app/api/customers/${Cust}/edit-amount/${selectedTransaction._id}`
        : `https://khata-backend-express.vercel.app/api/customers/${Cust}/add-amount`;

      const response = isEditing
        ? await axios.put(postUrl, postData)
        : await axios.post(postUrl, postData);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const handleTransaction = (isEditing = false) => {
    const transactionAmount = parseInt(amount, 10);
    if (!transactionAmount || transactionAmount <= 0) return;

    const postData = {
      _id:
        selectedTransaction?.["_id"] || Math.random().toString(36).substr(2, 9),
      time: new Date().toISOString(),
      amount: transactionType === "gave" ? "i gave" : "I got",
      comand: transactionAmount,
      itemName,
      quantity,
    };

    if (isEditing) {
      saveData(postData, true);
      setData((prevData) => ({
        ...prevData,
        amount: prevData.amount.map((tx) =>
          tx._id === selectedTransaction._id ? postData : tx
        ),
      }));
    } else {
      saveData(postData);
      setData((prevData) => ({
        ...prevData,
        amount: [...(prevData.amount || []), postData],
      }));
    }

    setIsModalOpen(false);
    setSelectedTransaction(null);
    setAmount("");
    setItemName("");
    setQuantity("");
  };

  // useEffect(() => {
  //   // const fetchAccountData = async () => {
  //   const getAccountsListByProfileId = async () => {
  //     console.log("globalstate", user);
  //     try {
  //       const response = await axios.get(
  //         `https://khata-backend-express.vercel.app/api/accounts/by-profile/${user.profileId}`
  //       );

  //       console.log("pak", response.data[0].profileId);

  //       const accountData = response.data;

  //       // setUserDataContext({ ...userData, accountId: accountData[0] });

  //       console.log("Accounts: total", accountData);
  //       accountData.forEach((item) => {
  //         if (item._id === AccountId) {
  //           setGlobalData(item); // Set item when the _id matches
  //           setselectedAccountId(item._id);
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Error fetching accounts by profile ID:", error);
  //     }
  //   };
  //   getAccountsListByProfileId();
  // }, [globalData]);

  return (
    <div className="max-w-md h-full mx-auto p-4 space-y-4 flex flex-col min-h-screen">
      <div className="flex justify-between items-center">
        <button className="text-lg font-semibold">Name of the Customer:</button>
        <p className="text-blue-700 font-bold">{data?.name || "Default"}</p>
      </div>

      <div
        className={`p-4 rounded-lg flex justify-between items-center ${
          balance > 0 ? "bg-red-500" : "bg-green-500"
        } text-white`}
      >
        <span className="text-lg font-bold">Rs {Math.abs(balance)}</span>
        <span className="text-sm">
          {balance > 0 ? "I have to give..." : "I have to get..."}
        </span>
      </div>

      {/* <div className="flex space-x-2"> */}
      <div className="flex space-x-2">
        <Button
          onClick={() => setOpenW(true)}
          variant="outline"
          className="flex-1"
        >
          📄 Report
        </Button>

        <Dialog open={openW} onOpenChange={setOpenW}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Your Email</DialogTitle>
            </DialogHeader>

            <Input
              type="email"
              placeholder="Enter email"
              value={emailW}
              onChange={(e) => setEmailW(e.target.value)}
            />

            <DialogFooter>
              <Button
                onClick={() => {
                  handleSubmit();
                  setOpenW(false);
                  setEmailW("");
                }}
              >
                Send Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {/* </div> */}

      {/* Transaction List */}
      <Card className="h-[20rem] overflow-y-auto">
        <CardContent className="p-4 overflow-y-auto">
          <div className="flex justify-between font-semibold">
            <span>Date</span>
            <span>I gave</span>
            <span>I got</span>
          </div>
          <div className="border-t my-2"></div>
          <div>
            {formattedTransactions.map((transaction, index) => (
              <div
                key={transaction._id || index}
                className="flex justify-between py-4 my-2 items-center text-sm cursor-pointer"
                onClick={() => {
                  setSelectedTransaction(transaction);
                  setAmount(transaction.comand.toString());
                  setTransactionType(
                    transaction.amount === "i gave" ? "gave" : "got"
                  );
                  setIsModalOpen(true);
                }}
              >
                <span className="px-2 py-1 rounded bg-gray-300">
                  {new Date(transaction.time).toISOString().split("T")[0]}
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    transaction.amount === "i gave"
                      ? "bg-red-200 text-red-600"
                      : ""
                  }`}
                >
                  {transaction.amount === "i gave" ? transaction.comand : ""}
                </span>
                <span
                  className={`px-2 py-1 rounded ${
                    transaction.amount === "I got"
                      ? "bg-green-200 text-green-600"
                      : ""
                  }`}
                >
                  {transaction.amount === "I got" ? transaction.comand : ""}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Buttons */}
      <div className="flex space-x-2 mt-auto">
        <Button
          className="flex-1 bg-red-500 text-white"
          onClick={() => {
            setTransactionType("gave");
            setIsModalOpen(true);
            setSelectedTransaction(null);
          }}
        >
          <ArrowUp className="mr-2" size={16} /> I GAVE
        </Button>
        <Button
          className="flex-1 bg-green-500 text-white"
          onClick={() => {
            setTransactionType("got");
            setIsModalOpen(true);
            setSelectedTransaction(null);
          }}
        >
          <ArrowDown className="mr-2" size={16} /> I GOT
        </Button>
      </div>

      {/* Transaction Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogTitle>
            {selectedTransaction ? "Edit Transaction" : "Enter Transaction"}
          </DialogTitle>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
          />
          <Input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="Enter item name"
          />
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
          />

          <DialogFooter>
            <Button onClick={() => handleTransaction(!!selectedTransaction)}>
              {selectedTransaction ? "Update" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
