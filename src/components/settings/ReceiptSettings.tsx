import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Receipt, 
  Building2, 
  Download, 
  Upload, 
  Eye,
  FileText,
  QrCode,
  Image,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReceiptSettings = () => {
  const { toast } = useToast();
  const [receiptConfig, setReceiptConfig] = useState({
    // Header Settings
    businessName: "Belednai Technology",
    businessAddress: "123 Business Street, Tech City, TC 12345",
    businessPhone: "+1 (555) 123-4567",
    businessEmail: "contact@belednai.com",
    businessWebsite: "www.belednai.com",
    
    // Receipt Format
    receiptNumberFormat: "REC-{YYYY}-{0000}",
    currency: "USD",
    currencySymbol: "$",
    taxRate: "8.5",
    
    // Display Options
    showLogo: true,
    showQRCode: true,
    showTaxBreakdown: true,
    showPaymentMethod: true,
    showCashierInfo: true,
    showBusinessInfo: true,
    
    // Footer Settings
    footerText: "Thank you for your business!",
    termsAndConditions: "All sales are final. No returns or exchanges.",
    
    // Template Settings
    template: "modern",
    fontSize: "medium",
    paperSize: "80mm",
    
    // Auto-save Settings
    autoSave: true,
    autoBackup: true,
    previewBeforePrint: true
  });

  const handleSave = () => {
    toast({
      title: "Receipt settings saved",
      description: "Your receipt configuration has been updated successfully.",
    });
  };

  const handleTestPrint = () => {
    toast({
      title: "Test print",
      description: "A test receipt has been generated and sent to the printer.",
    });
  };

  const handleExportConfig = () => {
    toast({
      title: "Configuration exported",
      description: "Receipt settings have been exported successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Receipt Settings</h2>
          <p className="text-muted-foreground">
            Customize receipt appearance and format
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleTestPrint}>
            <Eye className="h-4 w-4 mr-2" />
            Test Print
          </Button>
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Export Config
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={receiptConfig.businessName}
                onChange={(e) => setReceiptConfig({...receiptConfig, businessName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPhone">Phone Number</Label>
              <Input
                id="businessPhone"
                value={receiptConfig.businessPhone}
                onChange={(e) => setReceiptConfig({...receiptConfig, businessPhone: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Address</Label>
            <Textarea
              id="businessAddress"
              value={receiptConfig.businessAddress}
              onChange={(e) => setReceiptConfig({...receiptConfig, businessAddress: e.target.value})}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessEmail">Email</Label>
              <Input
                id="businessEmail"
                type="email"
                value={receiptConfig.businessEmail}
                onChange={(e) => setReceiptConfig({...receiptConfig, businessEmail: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessWebsite">Website</Label>
              <Input
                id="businessWebsite"
                value={receiptConfig.businessWebsite}
                onChange={(e) => setReceiptConfig({...receiptConfig, businessWebsite: e.target.value})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Format */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Receipt Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receiptNumberFormat">Receipt Number Format</Label>
              <Input
                id="receiptNumberFormat"
                value={receiptConfig.receiptNumberFormat}
                onChange={(e) => setReceiptConfig({...receiptConfig, receiptNumberFormat: e.target.value})}
                placeholder="REC-{YYYY}-{0000}"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={receiptConfig.currency} onValueChange={(value) => setReceiptConfig({...receiptConfig, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={receiptConfig.taxRate}
                onChange={(e) => setReceiptConfig({...receiptConfig, taxRate: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={receiptConfig.template} onValueChange={(value) => setReceiptConfig({...receiptConfig, template: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select value={receiptConfig.fontSize} onValueChange={(value) => setReceiptConfig({...receiptConfig, fontSize: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Paper Size</Label>
              <Select value={receiptConfig.paperSize} onValueChange={(value) => setReceiptConfig({...receiptConfig, paperSize: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="58mm">58mm</SelectItem>
                  <SelectItem value="80mm">80mm</SelectItem>
                  <SelectItem value="A4">A4</SelectItem>
                  <SelectItem value="Letter">Letter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Display Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Logo</Label>
                <p className="text-sm text-muted-foreground">Display company logo on receipts</p>
              </div>
              <Switch
                checked={receiptConfig.showLogo}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, showLogo: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show QR Code</Label>
                <p className="text-sm text-muted-foreground">Include QR code for digital payments</p>
              </div>
              <Switch
                checked={receiptConfig.showQRCode}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, showQRCode: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Tax Breakdown</Label>
                <p className="text-sm text-muted-foreground">Display detailed tax information</p>
              </div>
              <Switch
                checked={receiptConfig.showTaxBreakdown}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, showTaxBreakdown: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Payment Method</Label>
                <p className="text-sm text-muted-foreground">Display payment method used</p>
              </div>
              <Switch
                checked={receiptConfig.showPaymentMethod}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, showPaymentMethod: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Cashier Info</Label>
                <p className="text-sm text-muted-foreground">Display cashier name and ID</p>
              </div>
              <Switch
                checked={receiptConfig.showCashierInfo}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, showCashierInfo: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Business Info</Label>
                <p className="text-sm text-muted-foreground">Display business contact information</p>
              </div>
              <Switch
                checked={receiptConfig.showBusinessInfo}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, showBusinessInfo: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Text</Label>
            <Textarea
              id="footerText"
              value={receiptConfig.footerText}
              onChange={(e) => setReceiptConfig({...receiptConfig, footerText: e.target.value})}
              rows={2}
              placeholder="Thank you for your business!"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
            <Textarea
              id="termsAndConditions"
              value={receiptConfig.termsAndConditions}
              onChange={(e) => setReceiptConfig({...receiptConfig, termsAndConditions: e.target.value})}
              rows={3}
              placeholder="All sales are final. No returns or exchanges."
            />
          </div>
        </CardContent>
      </Card>

      {/* Auto-save Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-save Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save Receipts</Label>
                <p className="text-sm text-muted-foreground">Automatically save receipts</p>
              </div>
              <Switch
                checked={receiptConfig.autoSave}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, autoSave: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup data</p>
              </div>
              <Switch
                checked={receiptConfig.autoBackup}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, autoBackup: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Preview Before Print</Label>
                <p className="text-sm text-muted-foreground">Show preview before printing</p>
              </div>
              <Switch
                checked={receiptConfig.previewBeforePrint}
                onCheckedChange={(checked) => setReceiptConfig({...receiptConfig, previewBeforePrint: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReceiptSettings; 