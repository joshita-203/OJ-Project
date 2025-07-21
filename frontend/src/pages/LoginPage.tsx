import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Code, ArrowLeft, Sparkles } from "lucide-react";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      // Handle error message from backend
      let message = "Please check your credentials";
      if (error?.response?.data) {
        // If using axios and error response data contains string message
        message = error.response.data;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-800 relative overflow-hidden flex items-center justify-center p-4 animate-fade-in">
      {/* Glowing Blobs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-2xl animate-fade-in-up" />
        <div className="absolute bottom-1/3 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-scale-in-slow" />
      </div>

      {/* Back to Home */}
      <Link to="/" className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-purple-200 hover:text-cyan-300 transition-colors duration-300 group">
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        <Card className="bg-gradient-to-r from-violet-500 to-emerald-600 backdrop-blur-md border border-cyan-300/30 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl text-white font-bold drop-shadow-[1px_1px_2px_black]">Welcome Back</CardTitle>
              <CardDescription className="text-white text-lg mt-2 drop-shadow-[1px_1px_2px_black]">
                Sign in to continue your journey
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-lg drop-shadow-[1px_1px_2px_black]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="bg-white/90 text-black h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white text-lg drop-shadow-[1px_1px_2px_black]">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="bg-white/90 text-black h-12 text-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-purple-900 font-semibold h-12 text-lg transition-all duration-300 hover:bg-slate-100 shadow-lg hover:scale-105 animate-glow"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="relative w-full bg-purple-200 h-1 rounded overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-1/3 bg-purple-900 animate-[loadingBar_1.2s_linear_infinite]" />
                    </div>
                    <span className="text-sm">Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center animate-bounce">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-cyan-300/20">
              <p className="text-white text-lg drop-shadow-[1px_1px_2px_black]">
                Don’t have an account?{" "}
                <Link to="/signup" className="text-cyan-200 hover:text-white font-semibold underline underline-offset-4">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Styles */}
      <style>
        {`
          @keyframes loadingBar {
            0% { left: 0%; width: 0%; }
            50% { width: 50%; }
            100% { left: 100%; width: 0%; }
          }

          .animate-glow {
            box-shadow: 0 0 10px #a855f7, 0 0 20px #06b6d4;
          }

          .animate-fade-in {
            animation: fadeIn 1s ease-out;
          }

          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }

          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};
