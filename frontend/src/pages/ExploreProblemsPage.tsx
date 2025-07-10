import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface Problem {
  _id: string;
  title: string;
  statement: string;
  difficulty: string;
}

export const ExploreProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${BASE_URL}/api/problems`)
      .then((res) => res.json())
      .then((data) => setProblems(data))
      .catch((err) => console.error("Error loading problems:", err));
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-500";
      case "Medium":
        return "bg-amber-500";
      case "Hard":
        return "bg-rose-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen text-gray-900 animate-fade-in"
      style={{
        background:
          "linear-gradient(to bottom right, #c7d2fe, #e0e7ff, #fbcfe8)",
      }}
    >
      <div className="max-w-7xl mx-auto w-full p-6 transition-all duration-500">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="text-purple-600 animate-bounce" />
            Explore Problems
          </h1>
        </div>

        {/* Problem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p) => (
            <Card
              key={p._id}
              className="bg-white shadow-md border border-gray-300 hover:shadow-lg transition-transform hover:scale-[1.02] duration-300"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-gray-900">{p.title}</CardTitle>
                    <CardDescription className="text-gray-500 line-clamp-2">
                      {p.statement}
                    </CardDescription>
                  </div>
                  <Badge
                    className={`${getDifficultyColor(p.difficulty)} text-white`}
                  >
                    {p.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:scale-105 transition-transform duration-300 active:scale-95 mb-2"
                >
                  <Link to={user ? `/solve/${p._id}` : "/login"}>
                    <Play className="w-4 h-4 mr-2" />
                    {user ? "Solve Problem" : "Login to Solve"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-4 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Beyond code. 🚀 A mindset for better thinking.
        </p>
      </footer>
    </div>
  );
};
