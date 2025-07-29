import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/StatsCard";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  FileText,
  Plus,
  Eye,
  Clock,
  User,
  ShoppingCart
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { type ReceiptData } from "@/lib/receipt-utils";

const CashierDashboard = () => {
  const { user } = useAuth();
  const [cashierReceipts, setCashierReceipts] = useState<ReceiptData[]>([]);

  // Load cashier's receipts
  useEffect(() => {
    const savedReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
    const userReceipts = savedReceipts.filter((receipt: ReceiptData) => 
      receipt.createdBy === user?.id
    );
    setCashierReceipts(userReceipts);
  }, [user]);

  // Calculate stats based on actual receipts
  const getStats = () => {
    const totalReceipts = cashierReceipts.length;
    const totalRevenue = cashierReceipts.reduce((sum, receipt) => sum + receipt.total, 0);
    const pendingReceipts = cashierReceipts.filter(receipt => 
      receipt.customerInfo.name && !receipt.customerInfo.email
    ).length;
    const uniqueCustomers = new Set(cashierReceipts.map(r => r.customerInfo.email)).size;

    return [
      {
        title: "My Receipts",
        value: totalReceipts.toString(),
        icon: Receipt,
        change: "+8 from yesterday",
        changeType: "positive" as const,
      },
      {
        title: "Today's Sales",
        value: `$${totalRevenue.toFixed(2)}`,
        icon: DollarSign,
        change: "+12% from yesterday",
        changeType: "positive" as const,
      },
      {
        title: "Pending",
        value: pendingReceipts.toString(),
        icon: Clock,
        change: "2 overdue",
        changeType: "neutral" as const,
      },
      {
        title: "Customers",
        value: uniqueCustomers.toString(),
        icon: User,
        change: "+5 today",
        changeType: "positive" as const,
      },
    ];
  };

    const stats = getStats();

  // Get recent receipts (last 4) for display
  const recentReceipts = cashierReceipts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)
    .map(receipt => ({
      id: receipt.id,
      customer: receipt.customerInfo.name || 'Unnamed Customer',
      amount: `$${receipt.total.toFixed(2)}`,
      date: receipt.createdAt,
      status: receipt.customerInfo.email ? 'Paid' : 'Pending'
    }));

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground">Cashier Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Here's your daily overview.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Quick Actions */}
        <div className="mb-8">
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                  <p className="text-muted-foreground mt-1">
                    Create a new receipt using admin-defined products
                  </p>
                </div>
                <Button size="lg" asChild>
                  <Link to="/cashier-receipt">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Create Receipt
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Receipts */}
        <div className="bg-card rounded-xl shadow-card border border-border animate-slide-up">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">My Recent Receipts</h2>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashierDashboard; 