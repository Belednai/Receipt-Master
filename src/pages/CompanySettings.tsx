import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Save,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CompanySettings as CompanySettingsType, 
  saveCompanySettings, 
  getCompanySettings 
} from "@/lib/product-utils";

const CompanySettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<CompanySettingsType>({
    name: "",
    address: "",
    phone: "",
    email: "",
    footer: "",
    logo: "",
    updatedAt: "",
    updatedBy: ""
  });

  // Load company settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const savedSettings = await getCompanySettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load company settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings.name || !settings.address || !settings.phone || !settings.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Company Name, Address, Phone, Email).",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      await saveCompanySettings({
        name: settings.name,
        address: settings.address,
        phone: settings.phone,
        email: settings.email,
        footer: settings.footer,
        logo: settings.logo
      });
      
      toast({
        title: "Settings Saved",
        description: "Company settings have been updated successfully!",
      });
      
      // Reload settings to get the updated timestamp
      await loadSettings();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof CompanySettingsType, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">Company Details</h1>
          <p className="text-muted-foreground mt-1">
            Configure your company information that will appear on all receipts
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Company Information */}
              <Card className="animate-slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      value={settings.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Belednai Technology"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company-address">Address *</Label>
                    <Textarea
                      id="company-address"
                      value={settings.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your company address"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company-phone">Phone Number *</Label>
                      <Input
                        id="company-phone"
                        value={settings.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="e.g., (555) 123-4567"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="company-email">Email Address *</Label>
                      <Input
                        id="company-email"
                        type="email"
                        value={settings.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="e.g., contact@company.com"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Receipt Footer */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Receipt Footer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="receipt-footer">Footer Text (Optional)</Label>
                    <Textarea
                      id="receipt-footer"
                      value={settings.footer}
                      onChange={(e) => handleInputChange('footer', e.target.value)}
                      placeholder="e.g., Thank you for your business! Terms and conditions apply."
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      This text will appear at the bottom of all receipts
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Card className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <CardContent className="pt-6">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full"
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving Settings...
                      </>
                    ) : (
                      <>
                                            <Save className="w-4 h-4 mr-2" />
                    Save Company Details
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Last Updated Info */}
              {settings.updatedAt && (
                <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">
                      <p>Last updated: {new Date(settings.updatedAt).toLocaleString()}</p>
                      <p>Updated by: {settings.updatedBy}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanySettings; 