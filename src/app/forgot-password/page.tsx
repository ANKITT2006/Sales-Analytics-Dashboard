import type { Metadata } from "next";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { ForgotPasswordCard } from "@/components/auth/ForgotPasswordCard";

export const metadata: Metadata = {
  title: "Forgot Password | Sales Analytics Dashboard",
  description: "Reset your password for Indian Retail Sales Analytics Dashboard",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordCard />
    </AuthLayout>
  );
}
