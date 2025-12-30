import SignInPage from "@/components/auth/SignIn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Jifwa account to continue.",
};

const page = () => {
  return <SignInPage />;
};
export default page;
