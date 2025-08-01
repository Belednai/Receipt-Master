import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Shield, 
  User, 
  Edit3, 
  RotateCcw,
  Eye,
  EyeOff,
  MoreHorizontal,
  Calendar,
  Mail,
  Hash,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateCashierModal } from '@/components/CreateCashierModal';
import { useAuth, User as AuthUser } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

const UserManagement = () => {
  const [isCreateCashierModalOpen, setIsCreateCashierModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, getAllCashiers, deleteCashierAccount } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const cashierList = await getAllCashiers();
      
      // Add the current admin user to the list
      const allUsers = user ? [user, ...cashierList] : cashierList;
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load user accounts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.idNumber && user.idNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateCashier = () => {
    setIsCreateCashierModalOpen(true);
  };

  const handleCashierCreated = () => {
    fetchUsers(); // Refresh the list
  };

  const handleDeleteCashier = async (cashierId: string, cashierName: string) => {
    if (!confirm(`Are you sure you want to delete cashier "${cashierName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteCashierAccount(cashierId);
      
      toast({
        title: 'Cashier deleted',
        description: `Cashier "${cashierName}" has been successfully deleted.`,
      });
      
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting cashier:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete cashier account.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Never';
    
    try {
      // Handle Firestore timestamp
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Only admins can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                Only administrators can access user management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage cashier accounts and their permissions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Admin</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <User className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div className="ml-4">
                                  <p className="text-sm font-medium text-muted-foreground">Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Active Today</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                             <Input
                 placeholder="Search users by name or ID number..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-9"
               />
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
                              onClick={fetchUsers}
              disabled={isLoading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleCreateCashier}>
              <Plus className="w-4 h-4 mr-2" />
              Create Cashier
            </Button>
          </div>
        </div>

                 {/* Users Table */}
         <Card>
           <CardHeader>
             <CardTitle>User Accounts</CardTitle>
             <CardDescription>
               Manage admin and cashier accounts
             </CardDescription>
           </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
                         ) : filteredUsers.length === 0 ? (
               <div className="text-center py-8">
                 <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                 <h3 className="text-lg font-semibold mb-2">No users found</h3>
                 <p className="text-muted-foreground mb-4">
                   {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first cashier account.'}
                 </p>
                 {!searchTerm && (
                   <Button onClick={handleCreateCashier}>
                     <Plus className="w-4 h-4 mr-2" />
                     Create First Cashier
                   </Button>
                 )}
               </div>
             ) : (
               <Table>
                 <TableHeader>
                   <TableRow>
                     <TableHead>Name</TableHead>
                     <TableHead>Email/ID Number</TableHead>
                     <TableHead>Role</TableHead>
                     <TableHead>Created At</TableHead>
                     <TableHead>Last Updated</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                                      {filteredUsers.map((user) => (
                     <TableRow key={user.id}>
                       <TableCell className="font-medium">
                         <div className="flex items-center">
                           <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
                             {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                           </div>
                           {user.name}
                         </div>
                       </TableCell>
                       <TableCell>
                         <div className="flex items-center">
                           {user.role === 'cashier' ? (
                             <>
                               <Hash className="w-4 h-4 mr-2 text-muted-foreground" />
                               {user.idNumber || 'N/A'}
                             </>
                           ) : (
                             <>
                               <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                               {user.email}
                             </>
                           )}
                         </div>
                       </TableCell>
                       <TableCell>
                         <Badge 
                           variant={user.role === 'admin' ? 'default' : 'secondary'}
                           className="capitalize"
                         >
                           {user.role}
                         </Badge>
                       </TableCell>
                       <TableCell className="text-muted-foreground">
                         {formatDate(user.createdAt)}
                       </TableCell>
                       <TableCell className="text-muted-foreground">
                         {formatDate(user.updatedAt)}
                       </TableCell>
                       <TableCell className="text-right">
                         {user.role === 'cashier' && (
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button variant="ghost" className="h-8 w-8 p-0">
                                 <span className="sr-only">Open menu</span>
                                 <MoreHorizontal className="h-4 w-4" />
                               </Button>
                             </DropdownMenuTrigger>
                             <DropdownMenuContent align="end">
                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem 
                                 onClick={() => handleDeleteCashier(user.id, user.name)}
                                 className="text-destructive focus:text-destructive"
                               >
                                 <Trash2 className="w-4 h-4 mr-2" />
                                 Delete Cashier
                               </DropdownMenuItem>
                             </DropdownMenuContent>
                           </DropdownMenu>
                         )}
                       </TableCell>
                     </TableRow>
                   ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Cashier Modal */}
      <CreateCashierModal 
        isOpen={isCreateCashierModalOpen}
        onClose={() => setIsCreateCashierModalOpen(false)}
        onSuccess={handleCashierCreated}
      />
    </div>
  );
};

export default UserManagement; 