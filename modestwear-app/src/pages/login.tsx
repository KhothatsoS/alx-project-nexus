"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { login } from '@/services/auth';
// [API: POST /auth/login] - User login

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // [API: POST /auth/login]
    try {
      const response = await login(email, password);
      console.log('Login response:', response);
    } catch (error) {
      toast.error('Login failed');
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const User = {
        id: '1',
        name: 'Kayla Smith',
        email: email,
      };
      dispatch(setUser(User));
      toast.success('Login successful!');
      setIsLoading(false);
      router.push('/account');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl mb-2">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your ModestWear account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-accent hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-accent hover:underline">
              Sign up
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t">
            <p className="text-xs text-center text-muted-foreground mb-4">Or continue with</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline">Google</Button>
              <Button variant="outline">Facebook</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}