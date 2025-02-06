// components/Navbar.tsx
import Link from 'next/link';
// import { Children } from 'react';

const Navbar = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  return (
    <div>
      <div className=''>
        {children}
    </div>
      
      <nav className="fixed bottom-0 left-0 right-0 mt-5 bg-black text-white p-2 flex justify-around items-center border-t border-gray-800 z-50">
    <Link href="/khata/screens/customer" className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        <span className="text-sm">Khata</span>
      </Link>
      
      <Link href="/khata/users" className="flex flex-col items-center gap-1 hover:text-blue-500 transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span className="text-sm">Accounts</span>
      </Link>
      
    </nav>
      </div>
    
 
  );
};

export default Navbar;