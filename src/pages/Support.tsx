import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Headphones, 
  Mail, 
  Phone, 
  MessageSquare, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Info,
  Send,
  User,
  Building2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Support Request Sent",
      description: "Your support request has been submitted successfully. We'll get back to you soon.",
    });
    
    setContactForm({
      name: user?.name || '',
      email: user?.email || '',
      subject: '',
      message: '',
      priority: 'medium'
    });
    setIsSubmitting(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Need help? Contact system administrator or view documentation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {user?.role === 'admin' ? 'Administrator' : 'Cashier'}
          </Badge>
        </div>
      </div>

      {/* Support Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Quick Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">support@receiptmaster.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Mon-Fri 9AM-6PM EST</span>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Application</span>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Receipt Generation</span>
              <Badge className="bg-green-100 text-green-800">Operational</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-purple-600" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <MessageSquare className="w-4 h-4 mr-2" />
                User Guide
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Building2 className="w-4 h-4 mr-2" />
                Admin Manual
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Headphones className="w-4 h-4 mr-2" />
                FAQ
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Send Support Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactForm.subject}
                onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={contactForm.priority === priority ? "default" : "outline"}
                    size="sm"
                    onClick={() => setContactForm(prev => ({ ...prev, priority }))}
                    className="capitalize"
                  >
                    {priority}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Please describe your issue in detail..."
                rows={5}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Request
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <a href="mailto:support@receiptmaster.com?subject=Support Request">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Support
                </a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="w-5 h-5" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-orange-700 mb-3">
            For urgent system issues or critical problems, contact the system administrator immediately.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="tel:+15551234567">
                <Phone className="w-4 h-4 mr-2" />
                Call Admin
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:admin@receiptmaster.com?subject=URGENT: System Issue">
                <Mail className="w-4 h-4 mr-2" />
                Email Admin
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support; 