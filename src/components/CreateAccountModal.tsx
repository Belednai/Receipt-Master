import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, User, Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import { EmailValidationService } from '@/lib/email-validation';
import { Alert, AlertDescription } from '@/components/ui/alert';

const createAccountSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(254, 'Email cannot exceed 254 characters'), // RFC 5321 limit
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [emailValidationError, setEmailValidationError] = useState<string | null>(null);
  const { createAccount } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    mode: 'onChange'
  });

  const watchedEmail = watch('email');

  // Real-time email validation
  React.useEffect(() => {
    const validateEmailRealTime = async () => {
      if (!watchedEmail || watchedEmail.length < 5) {
        setEmailValidationError(null);
        return;
      }

      if (!EmailValidationService.validateFormatOnly(watchedEmail)) {
        setEmailValidationError('Please enter a valid email format');
        return;
      }

      setIsValidatingEmail(true);
      setEmailValidationError(null);

      try {
        const validation = await EmailValidationService.validateEmail(watchedEmail);
        if (!validation.valid) {
          setEmailValidationError(validation.error || 'Invalid email address');
        } else {
          setEmailValidationError(null);
        }
      } catch (error) {
        console.error('Email validation error:', error);
        setEmailValidationError('Unable to validate email. Please try again.');
      } finally {
        setIsValidatingEmail(false);
      }
    };

    // Debounce the validation
    const timeoutId = setTimeout(validateEmailRealTime, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedEmail]);

  const handleClose = () => {
    reset();
    setEmailValidationError(null);
    onClose();
  };

  const onSubmit = async (data: CreateAccountFormData) => {
    if (emailValidationError) {
      toast({
        title: 'Email Validation Failed',
        description: emailValidationError,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Final email validation before account creation
      const emailValidation = await EmailValidationService.validateEmail(data.email);
      if (!emailValidation.valid) {
        throw new Error(emailValidation.error || 'Invalid email address');
      }

      // Create account using Firebase Auth
      await createAccount({
        email: data.email,
        password: data.password,
        name: data.name
      });
      
      toast({
        title: 'Account Created Successfully',
        description: `Welcome to Receipt Master, ${data.name}!`,
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating account:', error);
      
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('email-already-in-use')) {
          errorMessage = 'An account with this email already exists. Please sign in instead.';
        } else if (error.message.includes('weak-password')) {
          errorMessage = 'Password is too weak. Please choose a stronger password.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('email')) {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Account Creation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <User className="w-6 h-6 mr-2" />
            Create Your Account
          </DialogTitle>
          <DialogDescription>
            Create a new account to access Receipt Master. Your email will be verified for security.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register('name')}
                className={`pl-9 ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
                className={`pl-9 pr-10 ${errors.email || emailValidationError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                disabled={isLoading}
              />
              {isValidatingEmail && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            {errors.email && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email.message}
              </p>
            )}
            {emailValidationError && !errors.email && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {emailValidationError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                {...register('password')}
                className={`pl-9 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register('confirmPassword')}
                className={`pl-9 ${errors.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your account will be created with cashier privileges. Only the first Google sign-in becomes an admin account.
            </AlertDescription>
          </Alert>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isValidatingEmail || !!emailValidationError}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  Create Account
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};