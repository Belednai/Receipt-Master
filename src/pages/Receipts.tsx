import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Receipt, 
  Search, 
  Download, 
  Send, 
  Eye,
  Calendar,
  User,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { downloadPDF, sendEmailWithReceipt, type ReceiptData } from "@/lib/receipt-utils";

const Receipts = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);

  useEffect(() => {
    // Load receipts from localStorage
    const savedReceipts = JSON.parse(localStorage.getItem('receipts') || '[]');
    
    // Apply role-based filtering
    let filteredReceipts = savedReceipts;
    if (user?.role === 'cashier') {
      // Cashiers can only see their own receipts
      filteredReceipts = savedReceipts.filter((receipt: ReceiptData) => 
        receipt.createdBy === user.id
      );
    }
    // Admins can see all receipts (no filtering needed)
    
    setReceipts(filteredReceipts);
  }, [user]);

  const filteredReceipts = receipts.filter(receipt =>
    receipt.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = async (receipt: ReceiptData) => {
    setIsDownloading(receipt.id);
    try {
      await downloadPDF(receipt);
      toast({
        title: "PDF Downloaded",
        description: "Receipt PDF has been downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(null);
    }
  };

  const handleSendEmail = async (receipt: ReceiptData) => {
    if (!receipt.customerInfo.email) {
      toast({
        title: "Missing Email",
        description: "This receipt doesn't have a customer email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(receipt.id);
    try {
      await sendEmailWithReceipt(receipt);
      toast({
        title: "Email Sent",
        description: "Email client opened with receipt details.",
      });
    } catch (error) {
      toast({
        title: "Email Failed",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">Receipts</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all your receipts
            </p>
          </div>
          <div className="mt-4 sm:mt-0 animate-slide-up">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receipts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid gap-6 mb-8 ${user?.role === 'admin' ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Receipts</p>
                  <p className="text-2xl font-bold">{receipts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Revenue Card - Only visible to admins */}
          {user?.role === 'admin' && (
            <Card className="animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(receipts.reduce((sum, receipt) => sum + receipt.total, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Unique Customers</p>
                  <p className="text-2xl font-bold">
                    {new Set(receipts.map(r => r.customerInfo.email)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {receipts.filter(r => {
                      const receiptDate = new Date(r.createdAt);
                      const now = new Date();
                      return receiptDate.getMonth() === now.getMonth() && 
                             receiptDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receipts List */}
        <div className="space-y-4">
          {filteredReceipts.length === 0 ? (
            <Card className="animate-slide-up">
              <CardContent className="p-12 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm ? 'No receipts found' : 'No receipts yet'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm 
                    ? 'Try adjusting your search terms.' 
                    : 'Create your first receipt to get started.'
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReceipts.map((receipt, index) => (
              <Card key={receipt.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {receipt.customerInfo.name || 'Unnamed Customer'}
                        </h3>
                        <Badge variant="outline">{receipt.id}</Badge>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{receipt.customerInfo.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{receipt.createdAt}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-medium text-foreground">
                            {formatCurrency(receipt.total)}
                          </span>
                        </div>
                      </div>
                      {receipt.notes && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {receipt.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(receipt)}
                        disabled={isDownloading === receipt.id}
                      >
                        {isDownloading === receipt.id ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendEmail(receipt)}
                        disabled={isSendingEmail === receipt.id || !receipt.customerInfo.email}
                      >
                        {isSendingEmail === receipt.id ? (
                          <>
                            <div className="w-4 h-4 mr-2 animate-spin border-2 border-current border-t-transparent rounded-full" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Email
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Receipts; 