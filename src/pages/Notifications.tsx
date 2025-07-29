import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Send, 
  Trash2, 
  Check, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  AlertTriangle,
  User,
  MessageSquare,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";
import { useNotifications, type Notification } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Notifications = () => {
  const { user } = useAuth();
  const { notifications, sendNotification, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useNotifications();
  const { toast } = useToast();
  
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    to: '',
    priority: 'medium' as const
  });

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info': return <Info className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'success': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message || !newNotification.to) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    sendNotification({
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      from: user?.id || '',
      to: newNotification.to,
      priority: newNotification.priority
    });

    toast({
      title: "Notification sent",
      description: "Your notification has been sent successfully.",
    });

    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      to: '',
      priority: 'medium'
    });
    setIsSendDialogOpen(false);
  };

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    toast({
      title: "Marked as read",
      description: "Notification marked as read.",
    });
  };

  const handleDeleteNotification = (id: string) => {
    deleteNotification(id);
    toast({
      title: "Notification deleted",
      description: "Notification has been removed.",
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "All marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleClearAll = () => {
    clearAllNotifications();
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared.",
    });
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your notifications and communicate with team members
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMarkAllAsRead}
            disabled={unreadNotifications.length === 0}
          >
            <Check className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your notifications.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll}>Clear all</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to another team member.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter notification title"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter notification message"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="to">Send to</Label>
                  <Select
                    value={newNotification.to}
                    onValueChange={(value) => setNewNotification(prev => ({ ...prev, to: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="1">Administrator</SelectItem>
                      <SelectItem value="2">Cashier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newNotification.type}
                      onValueChange={(value: Notification['type']) => setNewNotification(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newNotification.priority}
                      onValueChange={(value: Notification['priority']) => setNewNotification(prev => ({ ...prev, priority: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendNotification}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadNotifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{readNotifications.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {unreadNotifications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Unread Notifications</h3>
            <div className="space-y-2">
              {unreadNotifications.map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="mt-1 flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm sm:text-base break-words">{notification.title}</h4>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className={`text-xs ${getTypeColor(notification.type)}`}>
                                {notification.type}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 break-words">{notification.message}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3 flex-shrink-0" />
                              <span>From: {notification.from === user?.id ? 'You' : 'Other'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end sm:justify-start space-x-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete notification?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteNotification(notification.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {readNotifications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Read Notifications</h3>
            <div className="space-y-2">
              {readNotifications.map((notification) => (
                <Card key={notification.id} className="opacity-75">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        <div className="mt-1 flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm sm:text-base break-words">{notification.title}</h4>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className={`text-xs ${getTypeColor(notification.type)}`}>
                                {notification.type}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getPriorityColor(notification.priority)}`}>
                                {notification.priority}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 break-words">{notification.message}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3 flex-shrink-0" />
                              <span>From: {notification.from === user?.id ? 'You' : 'Other'}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span>{formatTimestamp(notification.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-end sm:justify-start space-x-1 flex-shrink-0">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete notification?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteNotification(notification.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any notifications yet. Send a notification to get started.
              </p>
              <Button onClick={() => setIsSendDialogOpen(true)}>
                <Send className="h-4 w-4 mr-2" />
                Send your first notification
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Notifications; 