// src/components/forms/LoginForm.tsx
"use client";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Email</label>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium text-slate-600">Password</label>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
}
