"use client"; // Required for client-side interactivity
import useGlobalStore from '@/store/zustandStore.js';
import { useState, useEffect, cloneElement } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from 'axios';
export default function MobileNumberPage() {
  const [showForm, setShowForm] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const { user, setUser } = useGlobalStore();
  const router = useRouter();

  // Simulate a splash screen delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 100); // 3 seconds splash screen

    return () => clearTimeout(timer);
  }, []);


  const getAccountsListByProfileId = async () => {
    console.log("globalstate",user )
    try {
      const response = await axios.get(`https://khataapp-backend.vercel.app/api/accounts/by-profile/${user.profileId}`);
      
      console.log('pak',response.data[0].profileId)
      const accountData = response.data;
     
      // setUserDataContext({ ...userData, accountId: accountData[0] });
   
      console.log("Accounts:", accountData);  
      // console.log("Accountsabc:", response.data[0].customers[0].accountId);
      
     
     
      
     
    } catch (error) {
      console.error('Error fetching accounts by profile ID:', error);
    }
  };




  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Remove any non-digit characters (e.g., spaces, hyphens, country code)
    const cleanedMobileNumber = mobileNumber.replace(/\D/g, '');
  
    // Validate mobile number
    if (!/^\d+$/.test(cleanedMobileNumber)) {
      setError("Mobile number should contain only digits.");
    } else if (cleanedMobileNumber.length < 10) {
      setError("Mobile number must be at least 10 digits.");
    } else {
      setError("");
      // alert(`OTP sent to: ${cleanedMobileNumber}`);
      setOtpSent(true);
    }
  };


const onPressContinue = async () => {
  if (mobileNumber.length <= 8) {
    console.warn('Invalid mobile number');
    return;
  }

  try {
    console.log('Sending request to create/fetch profile...');
    
    const response = await axios.post('https://khata-backend-express.vercel.app/api/profiles', {
      phoneNumber: mobileNumber,
      // phoneNumber:"03328244939"
      
    });

    console.log('Response received:', response.data);
    setUser(response.data)
  

    // Check if profile already exists
    if (response.data?.message === 'Profile already exists') {
      console.log('Profile already exists');
      // navigation.navigate('login', { data: response.data });
      localStorage.setItem("account", response.data.profileId);
      return;
    }

    // Proceed with account creation if profile is new
    if (response.data?.profileId) {
      console.log('Creating default account for new profile...');
      
      const accountResponse = await axios.post('https://khataapp-backend.vercel.app/api/accounts', {
        name: 'Default Account',
        profileId: response.data.profileId,
      });

      console.log('Account created:', accountResponse.data);
      localStorage.setItem("account", response.data.profileId);
    } else {
      console.warn('Unexpected response: Profile ID missing.');
    }

  } catch (error: any) {
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error(`API Error [${error.response.status}]:`, error.response.data);
      if (error.response.status === 403) {
        console.warn('Maximum allowed profiles reached');
      }
    } else if (error.request) {
      // Request was made, but no response was received
      console.error('Network Error: No response received from the server.');
    } else {
      // Something else happened
      console.error('Unexpected Error:', error.message);
    }
  }
};



const handledemo = () =>{console.log(user)}



  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if the OTP is correct
    if (otp === "0321") {
      setOtpSubmitted(true);
      setError(""); // Clear any previous error
      // alert("OTP is correct! Redirecting...");
      router.push("/khata/users"); // Route to the other page
    } else {
      setError("Wrong OTP. Please try again.");
    }
  };






  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-88 space-y-6">
        {!showForm ? (
          // Splash Screen
          <div className="text-4xl font-bold animate-pulse text-center">
            Welcome to Al Mustafa website.
          </div>
        ) : (
          // Mobile Number Form
          <form onSubmit={otpSent ? handleOtpSubmit : handleMobileSubmit} className="w-full">
          {/* <form onSubmit={otpSent ? handleOtpSubmit : handleMobileSubmit} className="w-full"> */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-center">
                {otpSent ? "Enter OTP" : "Enter Your Mobile Number"}
              </h1>
              {!otpSent ? (
                <Input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full p-3 text-lg"
                  inputMode="numeric" // Opens numeric keypad on mobile
                />
              ) : (
                <Input
                  type="text"
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 text-lg"
                  inputMode="numeric" // Opens numeric keypad on mobile
                />
              )}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <Button
                type="submit"
                onClick={()=> {onPressContinue();
                              
                }}
                className={`w-full p-3 text-lg ${
                  otpSubmitted ? "bg-black" : "bg-black"
                }`}
                disabled={otpSubmitted}
              >
                {otpSent ? "Submit OTP" : "Send OTP"}
              </Button>
              {/* <button onClick={handledemo}>click</button> */}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}