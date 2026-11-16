"use client";
import dynamic from "next/dynamic";

// react-paystack touches `window` when imported, so load the signup UI in the browser only.
const SignupClient = dynamic(() => import("./SignupClient"), { ssr: false });

export default function SignupPage() {
  return <SignupClient />;
}
