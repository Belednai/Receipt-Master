import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2, Shield, User, Receipt } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['admin', 'cashier'] as const)
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      role: 'cashier'
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.username, data.password, data.role);
      
      if (success) {
        toast({
          title: 'Login successful',
          description: `Welcome back, ${data.username}!`,
        });
        
        // Redirect based on role
        if (data.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/cashier-dashboard');
        }
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid credentials. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <Receipt className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Receipt Master</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Select Role</Label>
                <RadioGroup
                  value={selectedRole}
                  onValueChange={(value) => setValue('role', value as UserRole)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="cashier"
                      id="cashier"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cashier"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <User className="mb-3 h-6 w-6" />
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-medium leading-none">Cashier</p>
                        <p className="text-xs text-muted-foreground">
                          Create receipts and manage transactions
                        </p>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="admin"
                      id="admin"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="admin"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                    >
                      <Shield className="mb-3 h-6 w-6" />
                      <div className="space-y-1 text-center">
                        <p className="text-sm font-medium leading-none">Admin</p>
                        <p className="text-xs text-muted-foreground">
                          Full system access and management
                        </p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  {...register('username')}
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  {...register('password')}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>



              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2024 Receipt Master. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 