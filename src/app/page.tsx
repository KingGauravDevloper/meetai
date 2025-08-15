"use client"

import { Button } from "@/components/ui/button";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function Home() {

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    authClient.signUp.email({
      email, name, password,
    },
  {
    onError: () => {
      window.alert("Something wrong");
    },
    onSuccess: () => {
      window.alert("Sucess");
    }
  })
  }

  return (
    <div className="p-4 flex flex-col gap-y ">
      <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
    

    <button onClick={onSubmit}>
      Create User
    </button>
   </div>
  );
}
