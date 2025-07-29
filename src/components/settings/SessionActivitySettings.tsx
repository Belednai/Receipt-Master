import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  Monitor, 
  Smartphone,
  Tablet,
  Globe,
  AlertTriangle,
  CheckCircle,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Session {
  id: string;
  device: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  status: 'active' | 'expired' | 'suspended';
  browser: string;
  os: string;
  loginTime: string;
  duration: string;
}

const SessionActivitySettings = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      device: "Chrome on Windows",
      location: "New York, NY",
      ipAddress: "192.168.1.100",
      lastActive: "2024-01-15 10:30 AM",
      status: "active",
      browser: "Chrome 120.0.0.0",
      os: "Windows 11",
      loginTime: "2024-01-15 09:00 AM",
      duration: "1h 30m"
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "New York, NY",
      ipAddress: "192.168.1.101",
      lastActive: "2024-01-15 09:15 AM",
      status: "active",
      browser: "Safari 17.0",
      os: "iOS 17.2",
      loginTime: "2024-01-15 08:45 AM",
      duration: "30m"
    },
    {
      id: "3",
      device: "Firefox on Mac",
      location: "Los Angeles, CA",
      ipAddress: "203.0.113.45",
      lastActive: "2024-01-14 03:45 PM",
      status: "expired",
      browser: "Firefox 121.0",
      os: "macOS 14.0",
      loginTime: "2024-01-14 02:30 PM",
      duration: "1h 15m"
    },
    {
      id: "4",
      device: "Edge on Windows",
      location: "Chicago, IL",
      ipAddress: "198.51.100.123",
      lastActive: "2024-01-13 11:20 AM",
      status: "suspended",
      browser: "Edge 120.0.0.0",
      os: "Windows 10",
      loginTime: "2024-01-13 10:00 AM",
      duration: "1h 20m"
    }
  ]);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'suspended' as const }
        : session
    ));
    toast({
      title: "Session revoked",
      description: "The selected session has been terminated.",
    });
  };

  const handleRevokeAllSessions = () => {
    setSessions(sessions.map(session => ({ ...session, status: 'suspended' as const })));
    toast({
      title: "All sessions revoked",
      description: "All active sessions have been terminated.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('iPhone') || device.includes('Android')) {
      return <Smartphone className="h-4 w-4" />;
    } else if (device.includes('iPad') || device.includes('Tablet')) {
      return <Tablet className="h-4 w-4" />;
    } else {
      return <Monitor className="h-4 w-4" />;
    }
  };

  const activeSessions = sessions.filter(session => session.status === 'active');
  const expiredSessions = sessions.filter(session => session.status === 'expired');
  const suspendedSessions = sessions.filter(session => session.status === 'suspended');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Session Activity</h2>
          <p className="text-muted-foreground">
            Monitor your active sessions and login activity
          </p>
        </div>
        <Button variant="outline" onClick={handleRevokeAllSessions}>
          <X className="h-4 w-4 mr-2" />
          Revoke All Sessions
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Sessions</p>
                <p className="text-2xl font-bold">{activeSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Expired Sessions</p>
                <p className="text-2xl font-bold">{expiredSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Suspended Sessions</p>
                <p className="text-2xl font-bold">{suspendedSessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Sessions</p>
                <p className="text-2xl font-bold">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Active Sessions ({activeSessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                             {activeSessions.map((session) => (
                 <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-green-50 gap-4">
                   <div className="flex items-center space-x-4">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                       {getDeviceIcon(session.device)}
                     </div>
                     <div className="min-w-0 flex-1">
                       <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                         <h3 className="font-medium truncate">{session.device}</h3>
                         <Badge variant="outline" className={`text-xs ${getStatusColor(session.status)}`}>
                           {session.status}
                         </Badge>
                       </div>
                       <p className="text-sm text-muted-foreground truncate">{session.browser} • {session.os}</p>
                       <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground mt-1">
                         <div className="flex items-center space-x-1">
                           <MapPin className="h-3 w-3" />
                           <span className="truncate">{session.location}</span>
                         </div>
                         <div className="flex items-center space-x-1">
                           <Globe className="h-3 w-3" />
                           <span className="truncate">IP: {session.ipAddress}</span>
                         </div>
                         <div className="flex items-center space-x-1">
                           <Clock className="h-3 w-3" />
                           <span>Duration: {session.duration}</span>
                         </div>
                       </div>
                     </div>
                   </div>
                   
                   <div className="text-right">
                     <p className="text-sm font-medium">Last Active</p>
                     <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="mt-2"
                       onClick={() => handleRevokeSession(session.id)}
                     >
                       <X className="h-4 w-4 mr-1" />
                       Revoke
                     </Button>
                   </div>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
                         {sessions.map((session) => (
               <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                 <div className="flex items-center space-x-4">
                   <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                     {getDeviceIcon(session.device)}
                   </div>
                   <div className="min-w-0 flex-1">
                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                       <h3 className="font-medium truncate">{session.device}</h3>
                       <Badge variant="outline" className={`text-xs ${getStatusColor(session.status)}`}>
                         {session.status}
                       </Badge>
                     </div>
                     <p className="text-sm text-muted-foreground truncate">{session.browser} • {session.os}</p>
                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground mt-1">
                       <div className="flex items-center space-x-1">
                         <MapPin className="h-3 w-3" />
                         <span className="truncate">{session.location}</span>
                       </div>
                       <div className="flex items-center space-x-1">
                         <Globe className="h-3 w-3" />
                         <span className="truncate">IP: {session.ipAddress}</span>
                       </div>
                       <div className="flex items-center space-x-1">
                         <Clock className="h-3 w-3" />
                         <span>Login: {session.loginTime}</span>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="text-right">
                   <p className="text-sm font-medium">Last Active</p>
                   <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                   {session.status === 'active' && (
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="mt-2"
                       onClick={() => handleRevokeSession(session.id)}
                     >
                       <X className="h-4 w-4 mr-1" />
                       Revoke
                     </Button>
                   )}
                 </div>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Security Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Regularly review your active sessions and revoke any suspicious ones.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Use strong, unique passwords for your account.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Enable two-factor authentication for additional security.
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground">
              Log out from shared devices and public computers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SessionActivitySettings; 