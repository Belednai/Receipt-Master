import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase-config";

interface StatItem {
  title: string;
  value: string;
  icon: any;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
}
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
  Building2,
  ArrowRight
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
  const { user, getAllCashiers, deleteCashierAccount } = useAuth();
  const { toast } = useToast();
  const [allReceipts, setAllReceipts] = useState<ReceiptData[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const getStats = async () => {
    try {
      // Get real data from Firestore
      const receiptsQuery = query(collection(db, 'receipts'));
      
      const [receiptsSnapshot, cashiersData] = await Promise.all([
        getDocs(receiptsQuery),
        getAllCashiers()
      ]);

      const totalReceipts = receiptsSnapshot.size;
      const activeCashiers = cashiersData.length;
      
      // Calculate total revenue from receipts
      let totalRevenue = 0;
      receiptsSnapshot.forEach(doc => {
        const data = doc.data();
        totalRevenue += data.total || 0;
      });

      const baseStats = [
        {
          title: "Total Receipts",
          value: totalReceipts.toString(),
          icon: Receipt,
          change: "Real-time data",
          changeType: "neutral" as const,
        },
        {
          title: "Active Cashiers",
          value: activeCashiers.toString(),
          icon: Users,
          change: "Current count",
          changeType: "neutral" as const,
        },
        {
          title: "System Status",
          value: "Online",
          icon: BarChart3,
          change: "System operational",
          changeType: "positive" as const,
        },
      ];

      // Only show revenue for admins
      if (user?.role === 'admin') {
        baseStats.push({
          title: "Total Revenue",
          value: `$${totalRevenue.toFixed(2)}`,
          icon: DollarSign,
          change: "All time",
          changeType: "positive" as const,
        });
      }

      return baseStats;
    } catch (error) {
      console.error('Error loading stats:', error);
      return [];
    }
  };

  const loadData = async () => {
    try {
      // Load receipts
      const receiptsQuery = query(collection(db, 'receipts'), orderBy('createdAt', 'desc'));
      const receiptsSnapshot = await getDocs(receiptsQuery);
      const receiptsData = receiptsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ReceiptData[];
      setAllReceipts(receiptsData);

      // Load only cashiers created by the current admin
      const cashiersData = await getAllCashiers();
      setUsers(cashiersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const statsData = await getStats();
        setStats(statsData);
      } catch (error) {
        console.error('Error loading stats:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
        setStats([]);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [user?.role]);

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'cashier': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      
      // Refresh the data
      loadData();
    } catch (error) {
      console.error('Error deleting cashier:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete cashier account.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {user?.name}. Here's what's happening with your business.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild className="h-11 px-6">
            <Link to="/admin-dashboard/users/create">
              <UserPlus className="w-4 h-4 mr-2" />
              Create Cashier
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-11 px-6">
            <Link to="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          // Loading skeletons
          Array(4).fill(null).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-muted rounded"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-6 bg-muted rounded w-1/2"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link to="/receipts" className="flex items-center space-x-4 group">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  View Receipts
                </h3>
                <p className="text-sm text-muted-foreground">
                  Browse all receipts
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link to="/admin-dashboard/products" className="flex items-center space-x-4 group">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Manage Items
                </h3>
                <p className="text-sm text-muted-foreground">
                  Add/edit products
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link to="/admin-dashboard/company-settings" className="flex items-center space-x-4 group">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  Company Details
                </h3>
                <p className="text-sm text-muted-foreground">
                  Update business info
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Link to="/admin-dashboard/users" className="flex items-center space-x-4 group">
              <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  User Management
                </h3>
                <p className="text-sm text-muted-foreground">
                  Manage team members
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Receipts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Receipts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {allReceipts.slice(0, 5).map((receipt) => (
                <div key={receipt.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Receipt className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Receipt #{receipt.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {receipt.customerInfo.name} • ${receipt.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/receipts/${receipt.id}`}>
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Cashiers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Cashiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersLoading ? (
                // Loading skeletons
                Array(4).fill(null).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-muted rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-muted rounded w-24"></div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-muted rounded"></div>
                  </div>
                ))
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No cashiers found</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any cashier accounts yet.
                  </p>
                  <Button asChild>
                    <Link to="/admin-dashboard/users">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create Cashier
                    </Link>
                  </Button>
                </div>
              ) : (
                users.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-medium">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.idNumber ? `ID: ${user.idNumber}` : user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                      {user.role === 'cashier' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard; 