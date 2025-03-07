"use client";
import { FiLogOut } from "react-icons/fi";

import { useAuthenticator } from "@aws-amplify/ui-react";

export default function SignOutButton() {
  const { signOut } = useAuthenticator();

  return (
    <button onClick={signOut} className="text-white flex items-center">
      <span>Logout</span>
      <FiLogOut className="ml-2" />
    </button>
  );
}
