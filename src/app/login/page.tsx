import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInCard } from "@/components/auth/SignInCard";

export const metadata: Metadata = {
  title: "Sign In | Sales Analytics Dashboard",
  description: "Sign in to continue to your Indian Retail Sales Analytics Dashboard",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <SignInCard />
    </AuthLayout>
  );
}
