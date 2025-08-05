import { Shield, Activity } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary rounded-lg">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AML Rules Engine</h1>
              <p className="text-sm text-muted-foreground">Anti-Money Laundering Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-success/10 rounded-full">
              <Activity className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;