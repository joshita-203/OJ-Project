// src/pages/Dashboard.tsx
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
        return "bg-green-500";
      case "Medium":
        return "bg-yellow-500";
      case "Hard":
        return "bg-red-500";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative p-6 text-white">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-80 h-80 bg-fuchsia-600/20 rounded-full blur-3xl top-1/3 left-1/4 animate-pulse" />
        <div className="absolute w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl bottom-1/4 right-1/3 animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 text-fuchsia-300">
          <Sparkles className="inline-block mr-2 text-cyan-300" />
          Dashboard
        </h1>
        <p className="text-gray-400">
          Welcome, {user?.firstname} {user?.lastname}
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <Card className="bg-gray-900 border border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-green-900 border-green-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-300">
              {stats.easy}
            </div>
            <div className="text-green-400">Easy</div>
          </CardContent>
        </Card>
        <Card className="bg-yellow-900 border-yellow-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-300">
              {stats.medium}
            </div>
            <div className="text-yellow-400">Medium</div>
          </CardContent>
        </Card>
        <Card className="bg-red-900 border-red-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-300">
              {stats.hard}
            </div>
            <div className="text-red-400">Hard</div>
          </CardContent>
        </Card>
        <Card className="bg-indigo-900 border-indigo-700">
          <CardContent className="p-4 text-center">
            <Award className="mx-auto mb-1 text-indigo-300" />
            <div className="text-2xl font-bold text-indigo-300">
              {stats.points}
            </div>
            <div className="text-indigo-400">Points</div>
          </CardContent>
        </Card>
      </div>

      {user && (
        <div className="relative z-10 mb-6 flex justify-end">
          <Button
            onClick={() => navigate("/create")}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold shadow-lg hover:scale-105 transition-all"
          >
            + Create New Problem
          </Button>
        </div>
      )}

      <Tabs value={tab} onValueChange={setTab} className="relative z-10 mb-8">
        <TabsList className="grid grid-cols-4 bg-gray-800 border border-gray-700 text-white">
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
                className="bg-gray-900 border border-gray-700 shadow-lg"
              >
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <CardTitle className="text-white">{p.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {p.createdBy.firstname} {p.createdBy.lastname}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${getDifficultyColor(
                        p.difficulty
                      )} text-white`}
                    >
                      {p.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4 line-clamp-2">
                    {p.statement}
                  </p>
                  <Button
                    onClick={() => navigate(`/solve/${p._id}`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105 transition-transform mb-2"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Solve Problem
                  </Button>
                  {user?._id === p.createdBy._id && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate(`/update/${p._id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-red-600 hover:bg-red-700"
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
  );
};
