"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/services/api";
import { GoogleLogin } from "@react-oauth/google";
import { login } from "@/services/auth";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Manual Login

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password);

      dispatch(
        setUser({
          id: response.user.id,
          name: response.user.username || response.user.email,
          email: response.user.email,
        })
      );

      localStorage.setItem("token", response.access);
      localStorage.setItem("refreshToken", response.refresh);

      toast.success("Login successful!");
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
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
      localStorage.setItem("refreshToken", response.refresh);

      toast.success("Google login successful!");
      router.push("/account");
    } catch (error: any) {
      toast.error(error.message || "Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">
              Sign in to your ModestWear account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/register" className="text-accent">
              Sign up
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}