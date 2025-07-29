import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  User, 
  Receipt, 
  Settings, 
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'login' | 'receipt' | 'settings' | 'user' | 'system';
  severity: 'low' | 'medium' | 'high';
  details: string;
  ipAddress: string;
  userAgent: string;
}

const AuditLogsSettings = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: "1",
      timestamp: "2024-01-15 10:30 AM",
      user: "John Admin",
      action: "User Login",
      category: "login",
      severity: "low",
      details: "Successful login from Chrome on Windows",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0 Windows"
    },
    {
      id: "2",
      timestamp: "2024-01-15 10:25 AM",
      user: "Sarah Cashier",
      action: "Receipt Created",
      category: "receipt",
      severity: "low",
      details: "Created receipt #REC-2024-0001 for $125.50",
      ipAddress: "192.168.1.101",
      userAgent: "Safari/17.0 iPhone"
    },
    {
      id: "3",
      timestamp: "2024-01-15 10:20 AM",
      user: "John Admin",
      action: "Settings Updated",
      category: "settings",
      severity: "medium",
      details: "Updated receipt template settings",
      ipAddress: "192.168.1.100",
      userAgent: "Chrome/120.0.0.0 Windows"
    },
    {
      id: "4",
      timestamp: "2024-01-15 10:15 AM",
      user: "Mike Manager",
      action: "User Suspended",
      category: "user",
      severity: "high",
      details: "Suspended user account: lisa.cashier@receiptmaster.com",
      ipAddress: "192.168.1.102",
      userAgent: "Firefox/121.0.0 Mac"
    },
    {
      id: "5",
      timestamp: "2024-01-15 10:10 AM",
      user: "System",
      action: "Backup Completed",
      category: "system",
      severity: "low",
      details: "Daily backup completed successfully",
      ipAddress: "127.0.0.1",
      userAgent: "System/1.0"
    },
    {
      id: "6",
      timestamp: "2024-01-15 10:05 AM",
      user: "Unknown",
      action: "Failed Login Attempt",
      category: "login",
      severity: "high",
      details: "Failed login attempt for admin account from suspicious IP",
      ipAddress: "203.0.113.45",
      userAgent: "Unknown"
    }
  ]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const handleExportLogs = () => {
    toast({
      title: "Logs exported",
      description: "Audit logs have been exported successfully.",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'login': return <User className="h-4 w-4" />;
      case 'receipt': return <Receipt className="h-4 w-4" />;
      case 'settings': return <Settings className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      case 'system': return <Activity className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'login': return 'bg-blue-100 text-blue-800';
      case 'receipt': return 'bg-green-100 text-green-800';
      case 'settings': return 'bg-purple-100 text-purple-800';
      case 'user': return 'bg-orange-100 text-orange-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Audit Logs</h2>
          <p className="text-muted-foreground">
            Monitor system activity and user actions
          </p>
        </div>
        <Button onClick={handleExportLogs}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Logs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by user, action, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="receipt">Receipt</SelectItem>
                  <SelectItem value="settings">Settings</SelectItem>
                  <SelectItem value="user">User Management</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Logs</p>
                <p className="text-2xl font-bold">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">High Severity</p>
                <p className="text-2xl font-bold">
                  {auditLogs.filter(log => log.severity === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Users</p>
                <p className="text-2xl font-bold">
                  {new Set(auditLogs.filter(log => log.category === 'login').map(log => log.user)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Today's Activity</p>
                <p className="text-2xl font-bold">
                  {auditLogs.filter(log => log.timestamp.includes('2024-01-15')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {getCategoryIcon(log.category)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium">{log.action}</h3>
                    <Badge variant="outline" className={getCategoryColor(log.category)}>
                      {log.category}
                    </Badge>
                    <Badge variant="outline" className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>{log.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3" />
                      <span>IP: {log.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No logs found</h3>
                <p className="text-muted-foreground">
                  No audit logs match your current filters.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Log Retention Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Log Retention Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Retention Period</Label>
              <Select defaultValue="90">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Auto Cleanup</Label>
              <Select defaultValue="enabled">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enabled">Enabled</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Export Frequency</Label>
              <Select defaultValue="weekly">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsSettings; 