"use client"; // Mark as a Client Component
import useGlobalStore from '@/store/zustandStore.js';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, Plus } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
export default function DynamicDropdownScreen() {
    const { user, setUser ,globalData, setGlobalData, setselectedAccountId} = useGlobalStore();

    
    useEffect(() => {
      getAccountsListByProfileId();
    }, []);




  const getAccountsListByProfileId = async () => {
    console.log("globalstate",user )
    try {
      const response = await axios.get(`https://khata-backend-express.vercel.app/api/accounts/by-profile/${localStorage.getItem("account")}`);
      
      console.log('pak',response.data[0].profileId)
      
      const accountData = response.data;
     
      // setUserDataContext({ ...userData, accountId: accountData[0] });
      setOptions(accountData)
      console.log("Accounts:", accountData);  
      // console.log("Accountsabc:", response.data[0].customers[0].accountId);
      
     
     
      
     
    } catch (error) {
      console.error('Error fetching accounts by profile ID:', error);
    }
  };




  const logAccount = () => {
    const account = localStorage.getItem("account");
    console.log("Stored Account ID:", account, options);
  };




  const handleSave = async () => {
    // onTextChange(accountName);
    try {
      
      const accountResponse = await axios.post('https://khata-backend-express.vercel.app/api/accounts', {
        name: newUserName,
        profileId: user.profileId,
      });
      console.log('Account created:', accountResponse.data);
      
      return accountResponse.data;
      

      
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }



       
      };



// useEffect(() => {
//   getAccountsListByProfileId();
// }, [ ]);




  const router = useRouter();
  interface Option {
    customers: any[];  // You can replace `any` with a more specific type if you know the structure of customer objects
    name: string;
    profileId: string;
    suppliers: any[];  // Similarly, replace `any` with the appropriate type for suppliers
    __v: number;
    _id: string;
  }
  
  const [options, setOptions] = useState<Option[]>([]);
  const [newUserName, setNewUserName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    getAccountsListByProfileId();
  }, [newUserName ]);
  // Handle signout
  const handleSignOut = () => {
    localStorage.clear();

    router.push("/"); // Redirect to the home page
    
  };

  // Handle dropdown selection
  const handleUserSelect = (selectedValue: string) => {
    console.log("Selected User:", selectedValue);
    options.forEach(item => {
      if (item._id === selectedValue) {
        setGlobalData(item); // Set item when the _id matches
        setselectedAccountId(item._id);
      
      }
    });
    
    
  };

  // Handle adding a new user
  const handleAddUser = async () => {
    if (!newUserName.trim()) return; // Prevent empty names

    setIsSaving(true);
    handleSave()
    // Simulate an API call or async operation
    setTimeout(() => {
      

       // Add the new user to the dropdown
      setNewUserName(""); // Clear the input field
      setIsSaving(false);
      setIsModalOpen(false); // Close the modal
    }, 1000); // Simulate a 1-second delay
  };

  return (
    <div className="flex flex-col items-center  min-h-screen bg-gray-100">
      <div className=" p-8 rounded-lg mt-8 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Select a User</h1>

        {/* Dropdown */}
        <Select onValueChange={handleUserSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option._id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Add User Button */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full flex items-center bg-black text-white  justify-center gap-2" variant="outline">
              <Plus className="w-4 h-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="username">User Name</Label>
              <Input
                id="username"
                placeholder="Enter user name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
              <Button onClick={()=> {handleAddUser();
                                     
              }} className="w-full" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Signout Button */}
        <Button
          onClick={handleSignOut}
          className="mt-6 w-full flex bg-black text-white  items-center justify-center gap-2"
          variant="outline"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </div>
    </div>
  );
}