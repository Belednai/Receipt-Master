import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type ReceiptData } from "@/lib/receipt-utils";
import { 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Plus,
  Eye,
  Users,
  Settings,
  BarChart3,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  Key,
  Package,
  Building2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [allReceipts, setAllReceipts] = useState<ReceiptData[]>([]);
  const [users, setUsers] = useState([
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
  ]);

  // Mock data for admin dashboard
  const getStats = () => {
    const baseStats = [
      {
        title: "Total Receipts",
        value: "2,847",
        icon: Receipt,
        change: "+18% from last month",
        changeType: "positive" as const,
      },
      {
        title: "Active Users",
        value: "24",
        icon: Users,
        change: "+3 new this week",
        changeType: "positive" as const,
      },
      {
        title: "System Health",
        value: "98%",
        icon: BarChart3,
        change: "All systems operational",
        changeType: "positive" as const,
      },
    ];

    // Only show revenue for admins
    if (user?.role === 'admin') {
      baseStats.splice(1, 0, {
        title: "Total Revenue",
        value: "$48,230",
        icon: DollarSign,
        change: "+12.5% from last month",
        changeType: "positive" as const,
      });
    }

    return baseStats;
  };

  // Load all receipts
  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
    setAllReceipts(savedReceipts);
  }, []);

  const stats = getStats();

  // Get recent receipts (last 4) for display
  const recentReceipts = allReceipts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map(receipt => {
      // Find the cashier name from users array
      const cashier = users.find(u => u.id === receipt.createdBy);
      return {
        id: receipt.id,
        customer: receipt.customerInfo.name || 'Unnamed Customer',
        amount: `$${receipt.total.toFixed(2)}`,
        date: receipt.createdAt,
        status: receipt.customerInfo.email ? 'Paid' : 'Pending',
        cashier: cashier?.name || 'Unknown Cashier'
      };
    });

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground';
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-secondary-foreground';
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User deleted",
      description: "User has been removed from the system.",
    });
  };

  const handleResetPassword = (user: { email: string }) => {
    toast({
      title: "Password reset",
      description: `Password reset link sent to ${user.email}`,
    });
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Here's your system overview.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-6 mb-8 ${
          user?.role === 'admin' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={stat.title} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <StatsCard {...stat} />
            </div>
          ))}
        </div>

        {/* Recent Receipts */}
        <div className="bg-card rounded-xl shadow-card border border-border animate-slide-up">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent Receipts</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/receipts">
                  <Eye className="w-4 h-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Receipt ID</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Cashier</th>
                </tr>
              </thead>
              <tbody>
                {recentReceipts.map((receipt, index) => (
                  <tr 
                    key={receipt.id} 
                    className="border-b border-border hover:bg-muted/30 transition-colors duration-200"
                  >
                    <td className="py-3 px-6 text-sm font-medium text-primary">{receipt.id}</td>
                    <td className="py-3 px-6 text-sm text-foreground">{receipt.customer}</td>
                    <td className="py-3 px-6 text-sm font-medium text-foreground">{receipt.amount}</td>
                    <td className="py-3 px-6 text-sm text-muted-foreground">{receipt.date}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        receipt.status === 'Paid' ? 'bg-success/20 text-success' :
                        receipt.status === 'Sent' ? 'bg-primary/20 text-primary' :
                        'bg-accent/20 text-accent'
                      }`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-sm text-muted-foreground">{receipt.cashier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin Management Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items Management */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Items Management
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage items that cashiers can use for receipts
                  </p>
                </div>
                <Button size="sm" asChild>
                  <Link to="/admin-dashboard/products">
                    <Plus className="w-4 h-4 mr-2" />
                    Manage Items
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Items Setup</h3>
                <p className="text-muted-foreground mb-4">
                  Define items, prices, and categories for cashiers to use when creating receipts.
                </p>
                <Button asChild>
                  <Link to="/admin-dashboard/products">
                    <Package className="w-4 h-4 mr-2" />
                    Manage Items
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Company Details
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure company information for receipts
                  </p>
                </div>
                <Button size="sm" asChild>
                  <Link to="/admin-dashboard/company-settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Company Information</h3>
                <p className="text-muted-foreground mb-4">
                  Set up your company name, address, and contact details that appear on all receipts.
                </p>
                <Button asChild>
                  <Link to="/admin-dashboard/company-settings">
                    <Building2 className="w-4 h-4 mr-2" />
                    Configure Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <div className="mt-8">
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    User Management
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Manage system users and their permissions
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin-dashboard/users">
                      <Eye className="w-4 h-4 mr-2" />
                      View All Users
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/admin-dashboard/users">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Link>
                  </Button>
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
                    {users.slice(0, 4).map((user) => (
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
                                onClick={() => handleDeleteUser(user.id)}
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
              {users.length > 4 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin-dashboard/users">
                      View All {users.length} Users
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 