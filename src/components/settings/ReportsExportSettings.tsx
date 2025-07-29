import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Download, 
  FileText, 
  BarChart3, 
  Calendar,
  Mail,
  Cloud,
  Database,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReportsExportSettings = () => {
  const { toast } = useToast();
  const [exportSettings, setExportSettings] = useState({
    // Export Formats
    defaultFormat: "pdf",
    includeLogo: true,
    includeCharts: true,
    includeSummary: true,
    
    // Auto Export
    autoExportEnabled: false,
    autoExportFrequency: "daily", // daily, weekly, monthly
    autoExportTime: "18:00",
    autoExportEmail: "",
    
    // Backup Settings
    autoBackupEnabled: true,
    backupFrequency: "daily",
    backupRetention: "30", // days
    cloudBackupEnabled: false,
    
    // Report Settings
    defaultReportPeriod: "monthly",
    includeTaxBreakdown: true,
    includePaymentMethods: true,
    includeCashierPerformance: true,
    
    // Email Reports
    emailReportsEnabled: false,
    emailFrequency: "weekly",
    emailRecipients: "",
    includeAttachments: true
  });

  const [recentExports, setRecentExports] = useState([
    {
      id: "1",
      name: "Sales Report - January 2024",
      type: "PDF",
      size: "2.4 MB",
      date: "2024-01-15 10:30 AM",
      status: "completed"
    },
    {
      id: "2",
      name: "Receipt Export - CSV",
      type: "CSV",
      size: "1.8 MB",
      date: "2024-01-14 09:15 AM",
      status: "completed"
    },
    {
      id: "3",
      name: "Monthly Summary - Excel",
      type: "Excel",
      size: "3.2 MB",
      date: "2024-01-13 16:45 PM",
      status: "completed"
    }
  ]);

  const handleExportNow = (format: string) => {
    toast({
      title: "Export started",
      description: `Exporting data in ${format.toUpperCase()} format...`,
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Export and backup settings have been updated.",
    });
  };

  const handleTestBackup = () => {
    toast({
      title: "Backup test",
      description: "Test backup completed successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reports & Export</h2>
          <p className="text-muted-foreground">
            Configure data export and backup settings
          </p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>

      {/* Export Formats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Formats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Default Export Format</Label>
              <Select 
                value={exportSettings.defaultFormat} 
                onValueChange={(value) => setExportSettings({...exportSettings, defaultFormat: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Report Period</Label>
              <Select 
                value={exportSettings.defaultReportPeriod} 
                onValueChange={(value) => setExportSettings({...exportSettings, defaultReportPeriod: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Logo</Label>
                <p className="text-sm text-muted-foreground">Add company logo to exports</p>
              </div>
              <Switch
                checked={exportSettings.includeLogo}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, includeLogo: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Charts</Label>
                <p className="text-sm text-muted-foreground">Add visual charts to reports</p>
              </div>
              <Switch
                checked={exportSettings.includeCharts}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, includeCharts: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Include Summary</Label>
                <p className="text-sm text-muted-foreground">Add summary section to reports</p>
              </div>
              <Switch
                checked={exportSettings.includeSummary}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, includeSummary: checked})}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleExportNow('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExportNow('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExportNow('excel')}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Auto Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Auto Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Auto Export</Label>
              <p className="text-sm text-muted-foreground">Automatically export reports on schedule</p>
            </div>
            <Switch
              checked={exportSettings.autoExportEnabled}
              onCheckedChange={(checked) => setExportSettings({...exportSettings, autoExportEnabled: checked})}
            />
          </div>

          {exportSettings.autoExportEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Export Frequency</Label>
                <Select 
                  value={exportSettings.autoExportFrequency} 
                  onValueChange={(value) => setExportSettings({...exportSettings, autoExportFrequency: value})}
                >
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

              <div className="space-y-2">
                <Label>Export Time</Label>
                <Input
                  type="time"
                  value={exportSettings.autoExportTime}
                  onChange={(e) => setExportSettings({...exportSettings, autoExportTime: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Email Recipients</Label>
                <Input
                  type="email"
                  value={exportSettings.autoExportEmail}
                  onChange={(e) => setExportSettings({...exportSettings, autoExportEmail: e.target.value})}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backup Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Backup</Label>
                <p className="text-sm text-muted-foreground">Automatically backup data</p>
              </div>
              <Switch
                checked={exportSettings.autoBackupEnabled}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, autoBackupEnabled: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cloud Backup</Label>
                <p className="text-sm text-muted-foreground">Backup to cloud storage</p>
              </div>
              <Switch
                checked={exportSettings.cloudBackupEnabled}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, cloudBackupEnabled: checked})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select 
                value={exportSettings.backupFrequency} 
                onValueChange={(value) => setExportSettings({...exportSettings, backupFrequency: value})}
              >
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

            <div className="space-y-2">
              <Label>Retention Period (days)</Label>
              <Select 
                value={exportSettings.backupRetention} 
                onValueChange={(value) => setExportSettings({...exportSettings, backupRetention: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={handleTestBackup}>
                <Cloud className="h-4 w-4 mr-2" />
                Test Backup
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tax Breakdown</Label>
                <p className="text-sm text-muted-foreground">Include detailed tax information</p>
              </div>
              <Switch
                checked={exportSettings.includeTaxBreakdown}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, includeTaxBreakdown: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Payment Methods</Label>
                <p className="text-sm text-muted-foreground">Include payment method analysis</p>
              </div>
              <Switch
                checked={exportSettings.includePaymentMethods}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, includePaymentMethods: checked})}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Cashier Performance</Label>
                <p className="text-sm text-muted-foreground">Include cashier performance metrics</p>
              </div>
              <Switch
                checked={exportSettings.includeCashierPerformance}
                onCheckedChange={(checked) => setExportSettings({...exportSettings, includeCashierPerformance: checked})}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Reports
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Reports</Label>
              <p className="text-sm text-muted-foreground">Send reports via email</p>
            </div>
            <Switch
              checked={exportSettings.emailReportsEnabled}
              onCheckedChange={(checked) => setExportSettings({...exportSettings, emailReportsEnabled: checked})}
            />
          </div>

          {exportSettings.emailReportsEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Email Frequency</Label>
                <Select 
                  value={exportSettings.emailFrequency} 
                  onValueChange={(value) => setExportSettings({...exportSettings, emailFrequency: value})}
                >
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

              <div className="space-y-2">
                <Label>Recipients</Label>
                <Input
                  value={exportSettings.emailRecipients}
                  onChange={(e) => setExportSettings({...exportSettings, emailRecipients: e.target.value})}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Include Attachments</Label>
                  <p className="text-sm text-muted-foreground">Attach report files</p>
                </div>
                <Switch
                  checked={exportSettings.includeAttachments}
                  onCheckedChange={(checked) => setExportSettings({...exportSettings, includeAttachments: checked})}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExports.map((exportItem) => (
              <div key={exportItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Download className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{exportItem.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(exportItem.status)}`}>
                        {exportItem.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exportItem.type} • {exportItem.size} • {exportItem.date}
                    </p>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsExportSettings; 