import Link from "next/link";
import { Children } from "react";

export default function TopBar({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div>
    <div className="flex items-center justify-around text-gray-900 p-2 mt-5 bg-gray-50">
      {/* Customer Link */}
      <Link href="/khata/screens/customer" className="flex items-center space-x-2 hover:text-gray-300">
        <CustomerIcon className="h-6 w-6" />
        <span>Customer</span>
      </Link>

      {/* Supplier Link */}
      <Link href="/khata/screens/supplier" className="flex items-center space-x-2 hover:text-gray-300">
        <SupplierIcon className="h-6 w-6" />
        <span>Supplier</span>
      </Link>
    </div>
        {children}
    </div>
  );
}

// SVG Icons
function CustomerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SupplierIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
      <path d="M12 3v4" />
      <path d="M16 5h-4" />
    </svg>
  );
}