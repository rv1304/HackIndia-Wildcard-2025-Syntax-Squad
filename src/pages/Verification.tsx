import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Clock, ArrowRight, FileSearch } from "lucide-react";

const Verification = () => {
  const pendingInspections = [
    { id: 1, name: "Quantum NFT #234", status: "processing", risk: "low", value: "2.5 ETH" },
    { id: 2, name: "Meta Artifact", status: "pending", risk: "medium", value: "1.8 ETH" },
    { id: 3, name: "Digital Relic", status: "review", risk: "low", value: "3.2 ETH" }
  ];

  const fraudAlerts = [
    { id: 1, asset: "Fake Collection #12", severity: "high", detected: "2 hours ago" },
    { id: 2, asset: "Suspicious Transfer", severity: "medium", detected: "5 hours ago" }
  ];

  const provenanceSteps = [
    { status: "Minted", date: "2024-01-15", verified: true },
    { status: "Listed", date: "2024-01-20", verified: true },
    { status: "Sold", date: "2024-02-01", verified: true },
    { status: "Verified", date: "2024-02-02", verified: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark py-8 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Verification Control Panel</h1>
          <p className="text-muted-foreground">Monitor and verify asset authenticity</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pending Inspections */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Pending Inspections</h2>
              <FileSearch className="w-5 h-5 text-primary" />
            </div>
            
            <div className="space-y-3">
              {pendingInspections.map((item) => (
                <Card key={item.id} className="glass-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{item.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={item.status === "processing" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.status}
                        </Badge>
                        <Badge 
                          variant={item.risk === "low" ? "outline" : "destructive"}
                          className="text-xs"
                        >
                          Risk: {item.risk}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{item.value}</p>
                      <Button size="sm" variant="ghost" className="mt-1">
                        Review
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Fraud Monitoring */}
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Fraud Monitoring</h2>
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            
            <div className="space-y-3">
              {fraudAlerts.map((alert) => (
                <Card key={alert.id} className="glass-card p-4 border-destructive/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{alert.asset}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{alert.detected}</p>
                    </div>
                    <Badge 
                      variant="destructive"
                      className={alert.severity === "high" ? "bg-red-500" : "bg-orange-500"}
                    >
                      {alert.severity} risk
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            <Button className="w-full mt-4 bg-destructive/20 hover:bg-destructive/30 text-destructive border border-destructive/30">
              View All Alerts
            </Button>
          </Card>
        </div>

        {/* Provenance Timeline */}
        <Card className="glass-panel p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Provenance Timeline</h2>
            <p className="text-sm text-muted-foreground">Track complete asset history and verification</p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />
            
            <div className="space-y-6">
              {provenanceSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                    step.verified ? 'bg-primary/20' : 'bg-muted'
                  }`}>
                    {step.verified ? (
                      <CheckCircle className="w-8 h-8 text-primary" />
                    ) : (
                      <Clock className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <Card className="flex-1 glass-card p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{step.status}</h3>
                      <p className="text-sm text-muted-foreground">{step.date}</p>
                    </div>
                    {step.verified && (
                      <Badge variant="outline" className="text-primary border-primary">
                        Verified
                      </Badge>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Inspector Signatures */}
        <Card className="glass-panel p-8 mt-8">
          <h2 className="text-xl font-semibold mb-6">Inspector Signatures</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Primary Inspector</h3>
                <p className="text-sm text-muted-foreground">Verified 142 assets</p>
              </div>
              <Badge className="ml-auto bg-primary/20 text-primary">Active</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Secondary Validator</h3>
                <p className="text-sm text-muted-foreground">Verified 98 assets</p>
              </div>
              <Badge className="ml-auto bg-accent/20 text-accent">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Verification;