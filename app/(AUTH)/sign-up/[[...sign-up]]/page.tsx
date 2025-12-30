import SignUpPage from "@/components/auth/SignUp"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account on Jifwa to get started.",
};

const page = () => {
  return (
    <SignUpPage />
  )
}
export default page