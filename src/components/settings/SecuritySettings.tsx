import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Key, 
  Eye, 
  EyeOff, 
  Lock, 
  AlertTriangle,
  Smartphone,
  Mail,
  Clock,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SecuritySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    twoFactorMethod: "app", // "app" or "sms"
    sessionTimeout: "30", // minutes
    loginNotifications: true,
    failedLoginAlerts: true,
    passwordExpiryDays: "90",
    requireStrongPassword: true,
    maxLoginAttempts: "5",
    lockoutDuration: "15", // minutes
  });

  const [sessionActivity, setSessionActivity] = useState([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, NY",
      ipAddress: "192.168.1.100",
      lastActive: "2024-01-15 10:30 AM",
      status: "active"
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "New York, NY",
      ipAddress: "192.168.1.101",
      lastActive: "2024-01-15 09:15 AM",
      status: "active"
    },
    {
      id: "3",
      device: "Firefox on Mac",
      location: "Los Angeles, CA",
      ipAddress: "203.0.113.45",
      lastActive: "2024-01-14 03:45 PM",
      status: "expired"
    }
  ]);

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveSecuritySettings = () => {
    toast({
      title: "Security settings saved",
      description: "Your security configuration has been updated.",
    });
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessionActivity(sessionActivity.filter(session => session.id !== sessionId));
    toast({
      title: "Session revoked",
      description: "The selected session has been terminated.",
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Settings</h2>
          <p className="text-muted-foreground">
            Manage account security and authentication
          </p>
        </div>
        <Button onClick={handleSaveSecuritySettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                placeholder="Enter current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={handlePasswordChange}>
            <Key className="h-4 w-4 mr-2" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorEnabled: checked})}
            />
          </div>

          {securitySettings.twoFactorEnabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>2FA Method</Label>
                <Select 
                  value={securitySettings.twoFactorMethod} 
                  onValueChange={(value) => setSecuritySettings({...securitySettings, twoFactorMethod: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">Authenticator App</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Setup Required</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {securitySettings.twoFactorMethod === 'app' 
                    ? 'Scan the QR code with your authenticator app to complete setup.'
                    : 'Enter your phone number to receive SMS codes.'
                  }
                </p>
                <Button variant="outline" size="sm" className="mt-2">
                  Setup 2FA
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Session Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Session Timeout (minutes)</Label>
              <Select 
                value={securitySettings.sessionTimeout} 
                onValueChange={(value) => setSecuritySettings({...securitySettings, sessionTimeout: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Password Expiry (days)</Label>
              <Select 
                value={securitySettings.passwordExpiryDays} 
                onValueChange={(value) => setSecuritySettings({...securitySettings, passwordExpiryDays: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Max Login Attempts</Label>
              <Select 
                value={securitySettings.maxLoginAttempts} 
                onValueChange={(value) => setSecuritySettings({...securitySettings, maxLoginAttempts: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 attempts</SelectItem>
                  <SelectItem value="5">5 attempts</SelectItem>
                  <SelectItem value="10">10 attempts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lockout Duration (minutes)</Label>
              <Select 
                value={securitySettings.lockoutDuration} 
                onValueChange={(value) => setSecuritySettings({...securitySettings, lockoutDuration: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Security Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Notifications</Label>
                <p className="text-sm text-muted-foreground">Email alerts for new logins</p>
              </div>
              <Switch
                checked={securitySettings.loginNotifications}
                onCheckedChange={(checked) => setSecuritySettings({...securitySettings, loginNotifications: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Failed Login Alerts</Label>
                <p className="text-sm text-muted-foreground">Alerts for failed login attempts</p>
              </div>
              <Switch
                checked={securitySettings.failedLoginAlerts}
                onCheckedChange={(checked) => setSecuritySettings({...securitySettings, failedLoginAlerts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Strong Password Required</Label>
                <p className="text-sm text-muted-foreground">Enforce strong password policy</p>
              </div>
              <Switch
                checked={securitySettings.requireStrongPassword}
                onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireStrongPassword: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessionActivity.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{session.device}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{session.location}</p>
                    <p className="text-xs text-muted-foreground">
                      IP: {session.ipAddress} • Last active: {session.lastActive}
                    </p>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRevokeSession(session.id)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings; 