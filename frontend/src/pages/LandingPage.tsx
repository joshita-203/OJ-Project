import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code, Zap, Trophy, Users, ArrowRight, Sparkles, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Particle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  opacity: number;
}

export const LandingPage = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const numParticles = 80;
    let particles: Particle[] = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        dx: Math.random() * 0.5 - 0.25,
        dy: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();
      });
    };

    const update = () => {
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
    };

    const animate = () => {
      draw();
      update();
      requestAnimationFrame(animate);
    };

    const particleDiv = document.getElementById("particle-canvas");
    if (particleDiv) {
      particleDiv.innerHTML = "";
      particleDiv.appendChild(canvas);
    }

    animate();
    setParticles(particles);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-indigo-900 to-teal-900 relative overflow-hidden text-white">
      {/* Particle Canvas */}
      <div id="particle-canvas" className="absolute inset-0 -z-10 pointer-events-none" />

      {/* Gradient blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-96 h-96 bg-emerald-400/20 rounded-full blur-2xl animate-fade-in-up" />
        <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-purple-300/10 rounded-full blur-2xl animate-scale-in-slow" />
      </div>

      {/* Header */}
      <header className="relative z-10 backdrop-blur-sm bg-violet-900/30 border-b border-purple-300/10 animate-fade-in-up">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
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

      {/* Hero */}
      <section className="relative z-10 py-20 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-lime-100 via-cyan-100 to-fuchsia-200 bg-clip-text text-transparent leading-tight">
              Solve. Submit. Succeed.
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 leading-relaxed">
              Test your code against the best. Challenge yourself with thousands of programming problems and elevate your skills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-violet-500 to-emerald-600 hover:from-violet-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:scale-105 transition-all duration-300">
                  Get Started Free <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button size="lg" className="bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border-2 border-cyan-300 text-cyan-200 hover:bg-cyan-400/20 hover:text-white px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300">
                <Sparkles className="w-5 h-5 mr-2" /> View Problems
              </Button>
            </div>
          </div>
          {/* Login Card */}
     <div className="flex justify-center lg:justify-end animate-scale-in-slow">
  <Card className="w-full max-w-md bg-gradient-to-br from-violet-500 to-emerald-600 hover:from-violet-600 hover:to-emerald-700 transition-all duration-300 backdrop-blur-md border border-emerald-200/30 shadow-2xl">
    <CardHeader className="text-center">
      <CardTitle className="text-2xl text-white font-bold drop-shadow-[1px_1px_2px_black]">
        Welcome Back
      </CardTitle>
      <CardDescription className="text-white drop-shadow-[1px_1px_2px_black]">
        Sign in to continue your journey
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-medium drop-shadow-[1px_1px_2px_black]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
            className="bg-white/70 text-black placeholder:text-gray-700 border border-white/30 h-12 text-lg"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white font-medium drop-shadow-[1px_1px_2px_black]">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
            className="bg-white/70 text-black placeholder:text-gray-700 border border-white/30 h-12 text-lg"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-purple-900 font-semibold h-12 text-lg transition-all duration-300 hover:bg-slate-100"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-900 rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
      <div className="mt-6 text-center text-white drop-shadow-[1px_1px_2px_black]">
        New to CodeJudge?{" "}
        <Link to="/signup" className="font-semibold underline underline-offset-4 hover:text-purple-100">
          Create an account
        </Link>
      </div>
    </CardContent>
  </Card>
</div>


        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 animate-fade-in-up">
        <div className="container mx-auto text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Why Choose CodeJudge?</h2>
          <p className="text-xl text-sky-200 max-w-2xl mx-auto">
            Everything you need to master competitive programming and ace technical interviews.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Code,
              title: "Rich Problem Set",
              description: "Thousands of problems across all difficulty levels and categories.",
              gradient: "from-indigo-400 to-purple-500"
            },
            {
              icon: Zap,
              title: "Instant Feedback",
              description: "Lightning-fast execution with detailed test results and hints.",
              gradient: "from-emerald-400 to-teal-500"
            },
            {
              icon: Trophy,
              title: "Competitions",
              description: "Regular contests to challenge yourself against others.",
              gradient: "from-cyan-500 to-sky-500"
            },
            {
              icon: Users,
              title: "Community",
              description: "Connect with fellow programmers and grow together.",
              gradient: "from-violet-400 to-fuchsia-500"
            }
          ].map(({ icon: Icon, title, description, gradient }, index) => (
            <Card key={index} className="bg-slate-900/40 backdrop-blur-md border-indigo-300/20 hover:border-teal-300 transition-transform duration-300 group hover:scale-105 shadow-xl">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-xl font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-indigo-200 text-center">{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-tr from-slate-950 via-indigo-950 to-violet-900 border-t border-purple-300/20 py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold">
              <span className="text-white">Code</span>
              <span className="text-cyan-300">Judge</span>
            </div>
          </div>
          <div className="text-sky-300 flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span> Beyond code. 🚀 A mindset for better thinking.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
