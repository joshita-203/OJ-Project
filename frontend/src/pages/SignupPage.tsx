import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Code, ArrowLeft, Sparkles } from "lucide-react";

export const SignupPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signup(firstname, lastname, email, password);
      toast({
        title: "Registration Successful",
        description: "You can now log in with your credentials.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-800 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-purple-200 hover:text-cyan-300 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Card className="bg-purple-900/40 backdrop-blur-md border-purple-300/30 shadow-2xl shadow-purple-500/20">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-purple-500/25">
              <Code className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl text-white font-bold">Create Account</CardTitle>
              <CardDescription className="text-purple-200 text-lg mt-2">
                Join and start your coding journey!
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="firstname" className="text-white text-lg">First Name</Label>
                <Input
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  placeholder="Enter your first name"
                  className="bg-white/90 text-black h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastname" className="text-white text-lg">Last Name</Label>
                <Input
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  placeholder="Enter your last name"
                  className="bg-white/90 text-black h-12 text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white text-lg">Email</Label>
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
                <Label htmlFor="password" className="text-white text-lg">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="bg-white/90 text-black h-12 text-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white font-semibold h-12 text-lg hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating your account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Sign Up
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-purple-300/20">
              <p className="text-purple-200 text-lg">
                Already have an account?{" "}
                <Link to="/login" className="text-cyan-300 hover:text-white font-semibold hover:underline">
                  Log in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
