"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/api";
import { GoogleLogin } from "@react-oauth/google";
import { register } from "@/services/auth";

export default function Register() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Manual Sign Up

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!form.agree) {
      return toast.error("Please accept the terms");
    }

    setIsLoading(true);

    try {
      const response = await register(
        form.name,
        form.email,
        form.password
      );

      dispatch(
        setUser({
          id: response.user.id,
          name: response.user.username,
          email: response.user.email,
        })
      );

      localStorage.setItem("token", response.access);
      toast.success("Account created!");
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Google 
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await authAPI.googleLogin(
        credentialResponse.credential
      );

      dispatch(
        setUser({
          id: response.user.id,
          name: response.user.username || response.user.email,
          email: response.user.email,
        })
      );

      localStorage.setItem("token", response.access);
      toast.success("Signed up with Google!");
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message || "Google signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <h1 className="text-3xl mb-6 text-center">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <Input
              placeholder="Confirm password"
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.agree}
                onCheckedChange={(v) =>
                  setForm({ ...form, agree: v as boolean })
                }
              />
              <Label>I agree to the terms</Label>
            </div>

            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-accent">
              Sign in
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google signup failed")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}