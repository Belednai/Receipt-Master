import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Mail, 
  Smartphone, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Clock,
  Save,
  TestTube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationSettings = () => {
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState({
    // Transaction Alerts
    largeTransactionAlerts: true,
    largeTransactionThreshold: "1000",
    failedTransactionAlerts: true,
    
    // Sales Reports
    dailySalesSummary: true,
    weeklySalesReport: false,
    monthlySalesReport: true,
    salesReportTime: "18:00",
    salesReportEmail: "admin@receiptmaster.com",
    
    // System Notifications
    systemMaintenanceAlerts: true,
    backupCompletionAlerts: true,
    errorAlerts: true,
    securityAlerts: true,
    
    // User Activity
    newUserLoginAlerts: true,
    failedLoginAlerts: true,
    userSuspensionAlerts: true,
    
    // Receipt Notifications
    receiptConfirmationEmails: true,
    receiptErrorAlerts: true,
    receiptBackupAlerts: true,
    
    // Delivery Methods
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    desktopNotifications: true,
    
    // Frequency Settings
    notificationFrequency: "immediate", // immediate, hourly, daily
    quietHoursEnabled: false,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00"
  });

  const handleSaveSettings = () => {
    toast({
      title: "Notification settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleTestNotification = (type: string) => {
    toast({
      title: "Test notification sent",
      description: `A test ${type} notification has been sent.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Settings</h2>
          <p className="text-muted-foreground">
            Configure notification preferences and alerts
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Transaction Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Transaction Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Large Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for transactions above threshold</p>
              </div>
              <Switch
                checked={notificationSettings.largeTransactionAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, largeTransactionAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Failed Transaction Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for failed transactions</p>
              </div>
              <Switch
                checked={notificationSettings.failedTransactionAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, failedTransactionAlerts: checked})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="threshold">Large Transaction Threshold ($)</Label>
            <Input
              id="threshold"
              type="number"
              value={notificationSettings.largeTransactionThreshold}
              onChange={(e) => setNotificationSettings({...notificationSettings, largeTransactionThreshold: e.target.value})}
              placeholder="1000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sales Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Sales Summary</Label>
                <p className="text-sm text-muted-foreground">Daily sales report via email</p>
              </div>
              <Switch
                checked={notificationSettings.dailySalesSummary}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, dailySalesSummary: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Sales Report</Label>
                <p className="text-sm text-muted-foreground">Weekly detailed sales report</p>
              </div>
              <Switch
                checked={notificationSettings.weeklySalesReport}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, weeklySalesReport: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Monthly Sales Report</Label>
                <p className="text-sm text-muted-foreground">Monthly comprehensive report</p>
              </div>
              <Switch
                checked={notificationSettings.monthlySalesReport}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, monthlySalesReport: checked})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Time</Label>
              <Input
                type="time"
                value={notificationSettings.salesReportTime}
                onChange={(e) => setNotificationSettings({...notificationSettings, salesReportTime: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Report Email</Label>
              <Input
                type="email"
                value={notificationSettings.salesReportEmail}
                onChange={(e) => setNotificationSettings({...notificationSettings, salesReportEmail: e.target.value})}
                placeholder="admin@receiptmaster.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            System Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>System Maintenance Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify about system maintenance</p>
              </div>
              <Switch
                checked={notificationSettings.systemMaintenanceAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, systemMaintenanceAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Backup Completion Alerts</Label>
                <p className="text-sm text-muted-foreground">Notify when backups complete</p>
              </div>
              <Switch
                checked={notificationSettings.backupCompletionAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, backupCompletionAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Error Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for system errors</p>
              </div>
              <Switch
                checked={notificationSettings.errorAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, errorAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for security events</p>
              </div>
              <Switch
                checked={notificationSettings.securityAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, securityAlerts: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Activity Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            User Activity Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New User Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for new user logins</p>
              </div>
              <Switch
                checked={notificationSettings.newUserLoginAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newUserLoginAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Failed Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for failed login attempts</p>
              </div>
              <Switch
                checked={notificationSettings.failedLoginAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, failedLoginAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Suspension Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert when users are suspended</p>
              </div>
              <Switch
                checked={notificationSettings.userSuspensionAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, userSuspensionAlerts: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Receipt Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Receipt Confirmation Emails</Label>
                <p className="text-sm text-muted-foreground">Send confirmation emails for receipts</p>
              </div>
              <Switch
                checked={notificationSettings.receiptConfirmationEmails}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, receiptConfirmationEmails: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Receipt Error Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for receipt creation errors</p>
              </div>
              <Switch
                checked={notificationSettings.receiptErrorAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, receiptErrorAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Receipt Backup Alerts</Label>
                <p className="text-sm text-muted-foreground">Alert for receipt backup issues</p>
              </div>
              <Switch
                checked={notificationSettings.receiptBackupAlerts}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, receiptBackupAlerts: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Delivery Methods
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via email</p>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Send notifications via SMS</p>
              </div>
              <Switch
                checked={notificationSettings.smsNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Send push notifications</p>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Desktop Notifications</Label>
                <p className="text-sm text-muted-foreground">Show desktop notifications</p>
              </div>
              <Switch
                checked={notificationSettings.desktopNotifications}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, desktopNotifications: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frequency Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Frequency Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Notification Frequency</Label>
              <Select 
                value={notificationSettings.notificationFrequency} 
                onValueChange={(value) => setNotificationSettings({...notificationSettings, notificationFrequency: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">Disable notifications during quiet hours</p>
              </div>
              <Switch
                checked={notificationSettings.quietHoursEnabled}
                onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, quietHoursEnabled: checked})}
              />
            </div>
          </div>
          
          {notificationSettings.quietHoursEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quiet Hours Start</Label>
                <Input
                  type="time"
                  value={notificationSettings.quietHoursStart}
                  onChange={(e) => setNotificationSettings({...notificationSettings, quietHoursStart: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Quiet Hours End</Label>
                <Input
                  type="time"
                  value={notificationSettings.quietHoursEnd}
                  onChange={(e) => setNotificationSettings({...notificationSettings, quietHoursEnd: e.target.value})}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleTestNotification("email")}>
              <Mail className="h-4 w-4 mr-2" />
              Test Email
            </Button>
            <Button variant="outline" onClick={() => handleTestNotification("sms")}>
              <Smartphone className="h-4 w-4 mr-2" />
              Test SMS
            </Button>
            <Button variant="outline" onClick={() => handleTestNotification("push")}>
              <Bell className="h-4 w-4 mr-2" />
              Test Push
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSettings; 