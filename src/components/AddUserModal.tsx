import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserPlus, Loader2 } from 'lucide-react';

const addUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'cashier'] as const),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (user: Omit<{ id: string; name: string; email: string; role: 'admin' | 'cashier'; status: 'active' | 'inactive'; createdAt: string }, 'id' | 'createdAt'>) => void;
}

const AddUserModal = ({ open, onOpenChange, onSubmit }: AddUserModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      role: 'cashier'
    }
  });

  const selectedRole = watch('role');

  const handleFormSubmit = async (data: AddUserFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({
        name: data.name,
        email: data.email,
        role: data.role,
        status: 'active' as const
      });
      
      reset();
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New User
          </DialogTitle>
          <DialogDescription>
            Create a new user account with appropriate permissions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter full name"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Role</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => setValue('role', value as 'admin' | 'cashier')}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="cashier"
                  id="modal-cashier"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="modal-cashier"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium leading-none">Cashier</p>
                    <p className="text-xs text-muted-foreground">
                      Create receipts
                    </p>
                  </div>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="admin"
                  id="modal-admin"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="modal-admin"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-primary/10 hover:text-primary peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <div className="space-y-1 text-center">
                    <p className="text-sm font-medium leading-none">Admin</p>
                    <p className="text-xs text-muted-foreground">
                      Full access
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserModal; 