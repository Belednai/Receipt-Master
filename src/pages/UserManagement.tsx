import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  UserPlus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddUserModal from "@/components/AddUserModal";
import ResetPasswordModal from "@/components/ResetPasswordModal";

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  status: 'active' | 'inactive';
  createdAt: string;
}

const UserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Initial users data
  const initialUsers: User[] = [
    {
      id: '1',
      name: 'John Admin',
      email: 'john.admin@receiptmaster.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Sarah Cashier',
      email: 'sarah.cashier@receiptmaster.com',
      role: 'cashier',
      status: 'active',
      createdAt: '2024-01-05'
    },
    {
      id: '3',
      name: 'Mike Manager',
      email: 'mike.manager@receiptmaster.com',
      role: 'admin',
      status: 'active',
      createdAt: '2024-01-10'
    },
    {
      id: '4',
      name: 'Lisa Cashier',
      email: 'lisa.cashier@receiptmaster.com',
      role: 'cashier',
      status: 'inactive',
      createdAt: '2024-01-15'
    }
  ];

  // Load users from localStorage or use initial data
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with default users if no data exists
      setUsers(initialUsers);
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      const updatedUsers = users.filter(u => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      toast({
        title: "User deleted",
        description: `${userToDelete.name} has been removed from the system.`,
      });
      setUserToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setShowResetModal(true);
  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, user]);
    setShowAddModal(false);
    toast({
      title: "User created",
      description: `${user.name} has been added to the system.`,
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground';
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage system users and their permissions
            </p>
          </div>
          <div className="mt-4 sm:mt-0 animate-slide-up">
            <Button asChild>
              <Link to="/admin-dashboard/users/create">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Admins</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cashiers</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'cashier').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="animate-slide-up">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <CardTitle>System Users</CardTitle>
                <CardDescription>
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr 
                      key={user.id} 
                      className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                    >
                      <td className="py-3 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-sm text-muted-foreground">{user.email}</td>
                      <td className="py-3 px-6">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-6">
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-6 text-sm text-muted-foreground">{user.createdAt}</td>
                      <td className="py-3 px-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add User Modal */}
      <AddUserModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal}
        onSubmit={handleAddUser}
      />

      {/* Reset Password Modal */}
      <ResetPasswordModal
        open={showResetModal}
        onOpenChange={setShowResetModal}
        user={selectedUser}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement; 