"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="container">
      {session ? (
        <>
          <h2>Welcome, {session.user.name}</h2>
          <img src={session.user.image} alt="Profile Picture" />
          <p>Email: {session.user.email}</p>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <>
          <h2>Please Sign In</h2>
          <button onClick={() => signIn("google")}>Sign In with Google</button>
        </>
      )}
    </div>
  );
}
