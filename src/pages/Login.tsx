import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Receipt, Mail, Lock, UserPlus, User, Shield } from 'lucide-react';
import { CreateAccountModal } from '@/components/CreateAccountModal';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

const cashierLoginSchema = z.object({
  idNumber: z.string().min(1, 'ID number is required'),
  password: z.string().min(1, 'Password is required')
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
type CashierLoginFormData = z.infer<typeof cashierLoginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isCreateAccountModalOpen, setIsCreateAccountModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'admin' | 'cashier'>('admin');
  const { signInWithGoogle, signInWithEmailPassword, signInWithIdNumber, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const adminForm = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema)
  });

  const cashierForm = useForm<CashierLoginFormData>({
    resolver: zodResolver(cashierLoginSchema)
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/cashier-dashboard');
      }
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    
    try {
      await signInWithGoogle();
      
      toast({
        title: 'Sign in successful',
        description: 'Welcome to Receipt Master!',
      });
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: 'Sign in failed',
        description: error instanceof Error ? error.message : 'Failed to sign in with Google. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const onAdminSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    
    try {
      await signInWithEmailPassword(data.email, data.password);
      
      toast({
        title: 'Admin login successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCashierSubmit = async (data: CashierLoginFormData) => {
    setIsLoading(true);
    
    try {
      await signInWithIdNumber({
        idNumber: data.idNumber,
        password: data.password
      });
      
      toast({
        title: 'Cashier login successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      console.error('Cashier login error:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid ID number or password. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setIsCreateAccountModalOpen(true);
  };

  const handleAccountCreated = () => {
    // Account creation automatically signs in the user
    // The useEffect will handle navigation
    setIsCreateAccountModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Receipt className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Receipt Master</h1>
          <p className="text-gray-600">Professional Receipt Management System</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Choose your login method below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign-In Button */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              variant="outline"
              className="w-full h-12 text-base"
            >
              {isGoogleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or sign in with credentials
                </span>
              </div>
            </div>

            {/* Login Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'admin' | 'cashier')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin
                </TabsTrigger>
                <TabsTrigger value="cashier" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Cashier
                </TabsTrigger>
              </TabsList>

              {/* Admin Login Form */}
              <TabsContent value="admin" className="space-y-4">
                <form onSubmit={adminForm.handleSubmit(onAdminSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@company.com"
                      {...adminForm.register('email')}
                      className={adminForm.formState.errors.email ? 'border-red-500' : ''}
                    />
                    {adminForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{adminForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter your password"
                      {...adminForm.register('password')}
                      className={adminForm.formState.errors.password ? 'border-red-500' : ''}
                    />
                    {adminForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{adminForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Shield className="mr-2 h-4 w-4" />
                    )}
                    Sign In as Admin
                  </Button>
                </form>
              </TabsContent>

              {/* Cashier Login Form */}
              <TabsContent value="cashier" className="space-y-4">
                <form onSubmit={cashierForm.handleSubmit(onCashierSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cashier-id">ID Number</Label>
                    <Input
                      id="cashier-id"
                      type="text"
                      placeholder="Enter your ID number"
                      {...cashierForm.register('idNumber')}
                      className={cashierForm.formState.errors.idNumber ? 'border-red-500' : ''}
                    />
                    {cashierForm.formState.errors.idNumber && (
                      <p className="text-sm text-red-500">{cashierForm.formState.errors.idNumber.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cashier-password">Password</Label>
                    <Input
                      id="cashier-password"
                      type="password"
                      placeholder="Enter your password"
                      {...cashierForm.register('password')}
                      className={cashierForm.formState.errors.password ? 'border-red-500' : ''}
                    />
                    {cashierForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{cashierForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 text-base"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <User className="mr-2 h-4 w-4" />
                    )}
                    Sign In as Cashier
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Create Account Section */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Don't have an account?
              </p>
              <Button
                onClick={handleCreateAccount}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 mx-auto"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Create Account Modal */}
        <CreateAccountModal
          isOpen={isCreateAccountModalOpen}
          onClose={() => setIsCreateAccountModalOpen(false)}
          onSuccess={handleAccountCreated}
        />
      </div>
    </div>
  );
};

export default Login; 