"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";

export default function SignOutButton() {
  const { signOut } = useAuthenticator();

  return (
    <button
      onClick={signOut}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
    >
      Sign Out
    </button>
  );
}
