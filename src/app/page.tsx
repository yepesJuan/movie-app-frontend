"use client";

import { useAuthenticator } from "@aws-amplify/ui-react";
import SignOutButton from "@/app/components/SignOut";

export default function Dashboard() {
  const { user } = useAuthenticator();

  return (
    <div className="flex flex-col items-center justify-center bg-[#093545] text-white">
      <h2 className="text-xl font-semibold mb-4">
        Welcome, {user?.signInDetails?.loginId}!
      </h2>
      <h1 className="text-4xl font-bold mb-6">Your movie list is empty</h1>
      <button className="px-6 py-2 bg-[#2AD17E] text-white rounded">
        Add a new movie
      </button>
      <div className="absolute top-4 right-4">
        <SignOutButton />
      </div>
    </div>
  );
}
