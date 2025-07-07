import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Edit, Trash2, Play, Award, Sparkles } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface Problem {
  _id: string;
  title: string;
  statement: string;
  difficulty: "Easy" | "Medium" | "Hard";
  createdBy: {
    _id: string;
    firstname: string;
    lastname: string;
  };
  createdAt: string;
}

export const Dashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/problems`);
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    }
  };

  const deleteProblem = async (id: string) => {
    await fetch(`${BASE_URL}/api/problems/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setProblems((prev) => prev.filter((p) => p._id !== id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-600";
      case "Medium":
        return "bg-amber-500";
      case "Hard":
        return "bg-rose-600";
      default:
        return "bg-gray-500";
    }
  };

  const getPoints = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return 10;
      case "Medium":
        return 25;
      case "Hard":
        return 50;
      default:
        return 0;
    }
  };

  const filteredProblems =
    tab === "all"
      ? problems
      : problems.filter((p) => p.difficulty.toLowerCase() === tab);

  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
    points: problems.reduce((sum, p) => sum + getPoints(p.difficulty), 0),
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-950 via-purple-800 via-60% to-blue-900 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-80 h-80 bg-purple-500/20 rounded-full blur-3xl top-1/3 left-1/4 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl bottom-1/4 right-1/3 animate-pulse delay-1000" />
        <div className="absolute w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl top-0 right-0 animate-pulse delay-1500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 pt-12">
        {/* Header */}
        <div className="mb-10 text-center animate-bounce">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="text-cyan-300" /> Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10 px-6">
          <Card className="bg-gradient-to-br from-purple-900 via-purple-950 to-black border border-purple-800 shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-white">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-700 border border-emerald-600 shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.easy}</div>
              <div className="text-white/80">Easy</div>
            </CardContent>
          </Card>
          <Card className="bg-amber-600 border border-amber-500 shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.medium}</div>
              <div className="text-white/80">Medium</div>
            </CardContent>
          </Card>
          <Card className="bg-rose-700 border border-rose-600 shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{stats.hard}</div>
              <div className="text-white/80">Hard</div>
            </CardContent>
          </Card>
          <Card className="bg-indigo-700 border-indigo-600 shadow-lg hover:scale-105 transition-transform">
            <CardContent className="p-4 text-center">
              <Award className="mx-auto mb-1 text-white" />
              <div className="text-2xl font-bold text-white">{stats.points}</div>
              <div className="text-white/80">Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Button */}
        {user && (
          <div className="mb-6 flex justify-end px-6">
            <Button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              + Create New Problem
            </Button>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="mb-8 px-6">
          <TabsList className="grid grid-cols-4 bg-gradient-to-r from-purple-900 via-black to-purple-950 border border-purple-700 text-white">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>

          <TabsContent value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredProblems.map((p) => (
                <Card
                  key={p._id}
                  className="bg-gradient-to-br from-purple-900 via-purple-950 to-black border border-purple-800 shadow-md transition-transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-white">{p.title}</CardTitle>
                        <CardDescription className="text-purple-300">
                          {p.createdBy.firstname} {p.createdBy.lastname}
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
                    <p className="text-purple-200 mb-4 line-clamp-2">
                      {p.statement}
                    </p>

                    {/* Solve Button (redirect to login if not logged in) */}
                    <Button
                      onClick={() =>
                        navigate(user ? `/solve/${p._id}` : "/login")
                      }
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-105 transition-transform mb-2 text-white"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {user ? "Solve Problem" : "Login to Solve"}
                    </Button>

                    {/* Edit/Delete if owner */}
                    {user?._id === p.createdBy._id && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 transition-transform hover:scale-105"
                          onClick={() => navigate(`/update/${p._id}`)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 transition-transform hover:scale-105"
                          onClick={() => deleteProblem(p._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sticky Footer */}
      <footer className="bg-gradient-to-r from-black via-purple-900 to-black text-white text-center py-6">
        <p className="text-sm">
          © {new Date().getFullYear()} Beyond code. 🚀 A mindset for better thinking.
        </p>
      </footer>
    </div>
  );
};
