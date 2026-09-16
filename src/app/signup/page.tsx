import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpCard } from "@/components/auth/SignUpCard";

export const metadata: Metadata = {
  title: "Create Account | Sales Analytics Dashboard",
  description: "Start analyzing your sales performance today with Indian Retail Sales Analytics",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUpCard />
    </AuthLayout>
  );
}
