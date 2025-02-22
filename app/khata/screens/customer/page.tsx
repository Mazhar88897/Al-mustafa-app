'use client';
import useGlobalStore from '@/store/zustandStore.js';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function CustomerPage() {
























 const {globalData, setSupp, Supp, user,AccountId, selectedValue, setCust, setGlobalData, setselectedAccountId } = useGlobalStore();


  type ID={
    _id: string
  }

  
  useEffect(() => {
    // const fetchAccountData = async () => {
      const getAccountsListByProfileId = async () => {
        console.log("globalstate",user )
        try {
          const response = await axios.get(`https://khata-backend-express.vercel.app/api/accounts/by-profile/${localStorage.getItem("account")}`);

          console.log('pak',response.data[0].profileId);

          const accountData = response.data;

          // setUserDataContext({ ...userData, accountId: accountData[0] });
          
          console.log("Accounts: total", accountData);  
          (accountData || []).forEach((item:ID )=> {
            if (item._id === AccountId) {
              setGlobalData(item); // Set item when the _id matches
              setselectedAccountId(item._id);
            
            }})
          
         
         
          
         
        } catch (error) {
          console.error('Error fetching accounts by profile ID:', error);
        }
      };
      getAccountsListByProfileId();
    
  }, []); 










  // const saveData = async () => {
  //   try {

  //     // setIsLoading(true);
  //     // const uploadedImageUrl = await receiptImageUri; // Assuming receiptImage is defined somewhere in your code
  
      
  //     setUserDataContext({ ...userData, amountSend: response.data });
  
  //     navigation.navigate('CustomerDetailsScreen', {
  //       customerId: custId,
  //     });
  //   } catch (error) {
  //     console.error('Error during data upload or axios request:', error);
  //   }finally {
  //     setIsLoading(false); // Set loading state to false when the operation is completed
  //   }

  //   if (!isButtonDisabled) {
  //     setIsButtonDisabled(true);

  //     setTimeout(() => {
  //       setIsButtonDisabled(false);
  //     }, 2000);
  //   }
  // };








  type DataEntry = {
    amount: string;
    comand: number;
  };
  const router = useRouter();
  
  const HandleClick = (item: any) =>{
    setCust(item._id);
    router.push("/khata/screens/customer/singleuser"); 
    // console.log(Cust);
  }
  const [customers, setCustomers] = useState(globalData.customers || [] );
  const [valueShown,setValueshown] = useState(0);
//   if (globalData){
//     const data = globalData.customers.amount ;
//     let total = 0;

//     data.forEach((entry: DataEntry) => {
//   if (entry.amount === "I got") {
//     total += entry.comand;
//   } else if (entry.amount === "i gave") {
//     total -= entry.comand;
//   }
// });
// setValueshown(total)
//   }

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phoneNumber: '',
    amount: '',
    type: 'I got',
    item: '',
    date: dayjs().format('YYYY-MM-DD'),
  });

  


  // const totalCredit = customers.filter((c: { balance: number; }) => c.balance >= 0).reduce((acc: any, c: { balance: any; }) => acc + c.balance, 0);
  // const totalDebit = customers.filter((c: { balance: number; }) => c.balance < 0).reduce((acc: number, c: { balance: number; }) => acc + Math.abs(c.balance), 0);

  const handleAddCustomer = () => {
    const amount = parseFloat(newCustomer.amount);
    if (!newCustomer.name || !newCustomer.phoneNumber || isNaN(amount)) return;
    const updatedCustomers = [...customers];
    
    const existingIndex = updatedCustomers.findIndex(c => c.phoneNumber === newCustomer.phoneNumber);
    if (existingIndex !== -1) {
      updatedCustomers[existingIndex].balance += newCustomer.type === 'credit' ? amount : -amount;
    } else {
      updatedCustomers.push({
        name: newCustomer.name,
        phoneNumber: newCustomer.phoneNumber,
        balance: newCustomer.type === 'credit' ? amount : -amount,
      });
    }
    
    console.log('New Transaction:', newCustomer);
    setCustomers(updatedCustomers);
    setIsModalOpen(false);
    // const datafor = { name: '', phoneNumber: '', amount: '', type: 'credit', item: '', date: dayjs().format('YYYY-MM-DD') }
    // const postData = {
    //   amount: name,
    //   comand: amount,
    //   time: Date,
    //   itemName: itemName,
    //   quantity: quantity,
    //   image: uploadedImageUrl,
    // };

    // const postUrl = `https://khataapp-backend.vercel.app/api/customers/${custId}/add-amount`;

    // const response = await axios.post(postUrl, postData);

    // console.log('Response:', response.data);
    setNewCustomer({ name: '', phoneNumber: '', amount: '', type: 'credit', item: '', date: dayjs().format('YYYY-MM-DD') });
  };

  const saveData = async () => {

    if (!newCustomer.amount.trim()) {
      alert('Amount is required');
      return;
    }

    if (!/^\d+$/.test(newCustomer.amount)) {
      alert('Amount should contain only numeric characters');
      return;
    }

  
    
      
    const postData = {
    name: newCustomer.name,
    phoneNumber: newCustomer.phoneNumber,
    commandTime: newCustomer.date,
    accountId: AccountId,
    amount: [
        {
          amount: newCustomer.type,
          comand: newCustomer.amount,
          time: newCustomer.date,
          // itemName: itemName,
          // quantity: quantity,
          // image: uploadedImageUrl,
        }
      ]
    };
    
    const postUrl = 'https://khata-backend-express.vercel.app/api/customerss'; // Replace with your actual API endpoint
    
    axios.post(postUrl, postData)
      .then(response => {
        console.log('Response:', response.data);
        
       
        })
      
      .catch(error => {
        console.error('Error making the request:', error);
      })
      .finally(() => {
        
      });

      
  };

  type Transaction = {
    amount: string;
    comand: number;
};

type Record = {
    accountId: string;
    amount: Transaction[];
};




type TransactionTotal = {
  amount: string;
  comand: number;
};

const calculateTotal = (transactions: TransactionTotal[] = []): number => {
  if (!Array.isArray(transactions)) {
    console.error("calculateTotal error: transactions is not an array", transactions);
    return 0; // Default return value if transactions is not an array
  }

  return transactions.reduce((total, transaction) => {
    return transaction.amount.toLowerCase() === "i got"
      ? total + transaction.comand
      : total - transaction.comand;
  }, 0);
};

let totalDebit= 0;
let totalCredit = 0;

(customers || []).forEach((record: Record) => {
    const total = calculateTotal(record.amount || []);
    if (total > 0) {
        totalCredit += total
    } else {
      totalDebit += total
    }
});
  return (
    <div className="p-4">
      {/* <Button onClick={()=>{console.log(AccountId);console.log(globalData.customers);}} className='bg-black'>concole</Button> */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-red-500 font-bold" onClick={()=> console.log(customers )}>Total Debit: {-1 * totalDebit} </p>
        <p className="text-green-500 font-bold" onClick={()=> console.log(totalCredit )}>Total Credit: {totalCredit} </p>
        {/* <p >on click</p> */}
      </div>
      

      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by name or number"
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
          className="w-2/4"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button >Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <Input placeholder="Name" value={newCustomer.name} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} className="mb-2" />
            <Input placeholder="Number" value={newCustomer.phoneNumber} onChange={(e) => setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })} className="mb-2" />
            <Input placeholder="Amount" type="number" value={newCustomer.amount} onChange={(e) => setNewCustomer({ ...newCustomer, amount: e.target.value })} className="mb-2" />
            <Select value={newCustomer.type} onValueChange={(value) => setNewCustomer({ ...newCustomer, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
              <SelectItem value="I got">Credit</SelectItem>
              <SelectItem value="i gave">Debit</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Item Name" value={newCustomer.item} onChange={(e) => setNewCustomer({ ...newCustomer, item: e.target.value })} className="mb-2" />
            <Input placeholder="Date" type="date" value={newCustomer.date} onChange={(e) => setNewCustomer({ ...newCustomer, date: e.target.value })} className="mb-2" />
            <Button onClick={()=>{
              saveData();
              handleAddCustomer();
                                  
            }}>Add</Button>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-2 mb-14">
      {customers
  .filter((c: { name: string; phoneNumber: string | string[] }) => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  .sort((a: {name: string}, b: {name: string}) => a.name.localeCompare(b.name)) // Sorting customers by name
  .map((customer: any) => (
    <Card onClick={() => HandleClick(customer)} key={customer.phoneNumber} className="p-4 flex justify-between items-center">
      <div>
        <p className="font-bold">{customer.name}</p>
        <p className="text-sm text-gray-500">{customer.phoneNumber}</p>
      </div>
      <p className={calculateTotal(customer.amount) < 0 ? 'text-red-500' : 'text-green-500'}>
        {calculateTotal(customer.amount) < 0 ? -calculateTotal(customer.amount) : calculateTotal(customer.amount)}
      </p>
    </Card>
  ))
}

      </div>
    </div>
  );
}
