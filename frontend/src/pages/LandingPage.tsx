
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Zap, Trophy, Users, ArrowRight, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Success!",
        description: "Welcome back to CodeJudge!",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-800 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-purple-900/20 border-b border-purple-300/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Code className="w-7 h-7 text-white" />
              </div>
              <div className="text-3xl font-bold">
                <span className="text-white">Code</span>
                <span className="text-cyan-300">Judge</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-purple-100 hover:text-cyan-300 transition-colors duration-300 font-medium">
                Home
              </Link>
              <Link to="/about" className="text-purple-100 hover:text-cyan-300 transition-colors duration-300 font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Embedded Login */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                Solve. Submit. Succeed.
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
                Test your code against the best. Challenge yourself with thousands of 
                programming problems and elevate your coding skills to the next level.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white px-8 py-4 text-lg font-semibold shadow-lg shadow-purple-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-2 border-cyan-400 text-cyan-200 hover:bg-cyan-400/20 hover:text-white px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  View Problems
                </Button>
              </div>
            </div>

            {/* Login Form */}
            <div className="flex justify-center lg:justify-end animate-scale-in">
              <Card className="w-full max-w-md bg-purple-900/40 backdrop-blur-md border-purple-300/30 shadow-2xl shadow-purple-500/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white font-bold">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-purple-200">
                    Sign in to continue your coding journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-purple-800/50 border-purple-300/50 text-white placeholder:text-purple-200 focus:border-cyan-400 focus:ring-cyan-400/50 h-12 text-lg backdrop-blur-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white font-medium">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-purple-800/50 border-purple-300/50 text-white placeholder:text-purple-200 focus:border-cyan-400 focus:ring-cyan-400/50 h-12 text-lg backdrop-blur-sm"
                        placeholder="Enter your password"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white font-semibold h-12 text-lg shadow-lg shadow-purple-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Signing in...
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                  <div className="mt-6 text-center">
                    <p className="text-purple-200">
                      New to CodeJudge?{" "}
                      <Link to="/signup" className="text-cyan-300 hover:text-white transition-colors font-semibold">
                        Create an account
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose CodeJudge?
            </h2>
            <p className="text-xl text-purple-200 max-w-2xl mx-auto">
              Everything you need to master competitive programming and ace technical interviews.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code,
                title: "Rich Problem Set",
                description: "Thousands of problems across all difficulty levels and categories.",
                gradient: "from-purple-400 to-violet-500"
              },
              {
                icon: Zap,
                title: "Instant Feedback",
                description: "Lightning-fast execution with detailed test results and hints.",
                gradient: "from-cyan-400 to-teal-500"
              },
              {
                icon: Trophy,
                title: "Competitions",
                description: "Regular contests to challenge yourself against other coders.",
                gradient: "from-purple-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Community",
                description: "Connect with fellow programmers and learn together.",
                gradient: "from-teal-400 to-purple-500"
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-purple-900/40 backdrop-blur-md border-purple-300/30 hover:border-cyan-300/50 transition-all duration-300 group hover:scale-105 shadow-lg shadow-purple-500/10">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-purple-200 text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-purple-950/60 backdrop-blur-md border-t border-purple-300/20 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold">
                <span className="text-white">Code</span>
                <span className="text-cyan-300">Judge</span>
              </div>
            </div>
            <div className="text-purple-200 flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>© 2024 CodeJudge. Elevating coders worldwide.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
