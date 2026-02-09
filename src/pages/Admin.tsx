import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Loader2 } from "lucide-react";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminAffiliateLinks from "@/components/admin/AdminAffiliateLinks";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

const Admin = () => {
  const { isAdmin, isChecking } = useAdminAuth();
  const { user, signInWithGoogle } = useAuth();

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 gap-4">
        <Shield className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Admin Access Required</h1>
        <p className="text-sm text-muted-foreground text-center">
          Sign in with an admin account to continue.
        </p>
        <button onClick={signInWithGoogle} className="btn-primary mt-2">
          Sign in with Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 gap-3">
        <Shield className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-semibold text-foreground">Access Denied</h1>
        <p className="text-sm text-muted-foreground text-center">
          Your account does not have admin privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">ShopXAI Admin</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="w-full grid grid-cols-5 h-auto">
            <TabsTrigger value="categories" className="text-xs py-2">Categories</TabsTrigger>
            <TabsTrigger value="products" className="text-xs py-2">Products</TabsTrigger>
            <TabsTrigger value="affiliates" className="text-xs py-2">Affiliates</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs py-2">Settings</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs py-2">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="categories"><AdminCategories /></TabsContent>
          <TabsContent value="products"><AdminProducts /></TabsContent>
          <TabsContent value="affiliates"><AdminAffiliateLinks /></TabsContent>
          <TabsContent value="settings"><AdminSettings /></TabsContent>
          <TabsContent value="analytics"><AdminAnalytics /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
