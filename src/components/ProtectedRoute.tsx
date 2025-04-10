
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isConfigured } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Supabase Configuration Missing</h1>
        <p className="max-w-md mb-4">
          Your Supabase environment variables are not set. To connect to Supabase, you need to:
        </p>
        <ol className="text-left max-w-md space-y-2 mb-4">
          <li>1. Open your Supabase project</li>
          <li>2. Go to Project Settings &gt; API</li>
          <li>3. Copy the URL and anon key</li>
          <li>4. Set these values in your Lovable project settings</li>
        </ol>
        <p className="text-sm text-gray-600 mb-4">
          In Lovable, environment variables are managed through the project settings, not through .env files.
        </p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
