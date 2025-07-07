import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";
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
      case "Easy": return "bg-emerald-600";
      case "Medium": return "bg-amber-500";
      case "Hard": return "bg-rose-600";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 via-60% to-blue-900 text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Explore Problems</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((p) => (
          <Card
            key={p._id}
            className="bg-gradient-to-br from-purple-900 via-purple-950 to-black border border-purple-800 shadow-md transition-transform hover:scale-[1.02]"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white">{p.title}</CardTitle>
                  <CardDescription className="text-purple-300 line-clamp-2">
                    {p.statement}
                  </CardDescription>
                </div>
                <Badge className={`${getDifficultyColor(p.difficulty)} text-white`}>
                  {p.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105 transition-transform mb-2 text-white"
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
  );
};
