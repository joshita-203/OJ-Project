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
import { Edit, Trash2, Play, Sparkles } from "lucide-react";

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
  const [searchInput, setSearchInput] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/problems`);
      const data = await res.json();
      setProblems(Array.isArray(data) ? data : data.problems || []);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
    }
  };

  const deleteProblem = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`${BASE_URL}/api/problems/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete problem:", error);
    }
  };

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

  const filteredProblems = problems
    .filter((p) =>
      p.title.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((p) =>
      tab === "all" ? true : p.difficulty.toLowerCase() === tab
    );

  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
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
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <Sparkles className="text-purple-600 animate-bounce" /> Dashboard
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gray-100 border border-gray-300 shadow-md hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-gray-600">Total</div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-100 border border-emerald-300 shadow-md hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-emerald-800">{stats.easy}</div>
              <div className="text-emerald-700">Easy</div>
            </CardContent>
          </Card>

          <Card className="bg-amber-100 border border-amber-300 shadow-md hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-800">{stats.medium}</div>
              <div className="text-amber-700">Medium</div>
            </CardContent>
          </Card>

          <Card className="bg-rose-100 border border-rose-300 shadow-md hover:scale-105 transition-transform duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-rose-800">{stats.hard}</div>
              <div className="text-rose-700">Hard</div>
            </CardContent>
          </Card>
        </div>

        {/* Show Create Problem only if logged in */}
        {user && (
          <div className="mb-6 flex justify-end">
            <Button
              onClick={() => navigate("/create")}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold shadow-md transition-transform active:scale-95"
            >
              + Create New Problem
            </Button>
          </div>
        )}

        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value);
            if (value === "all") {
              setSearchInput("");
              setSearchText("");
            }
          }}
          className="mb-4"
        >
          <TabsList className="grid grid-cols-4 bg-white border border-gray-300 text-gray-700 shadow-md">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="easy">Easy</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="hard">Hard</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search input below tabs */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by title and press Enter"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearchText(searchInput);
              }
            }}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Problems */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg mt-8">
              No results found for your search.
            </div>
          ) : (
            filteredProblems.map((p) => (
              <Card
                key={p._id}
                className="bg-white shadow-md border border-gray-300 hover:shadow-lg transition-transform hover:scale-[1.02] duration-300"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-gray-900">{p.title}</CardTitle>
                      <CardDescription className="text-gray-500">
                        {p.createdBy.firstname} {p.createdBy.lastname}
                      </CardDescription>
                    </div>
                    <Badge className={`${getDifficultyColor(p.difficulty)} text-white`}>
                      {p.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">{p.statement}</p>

                  <Button
                    onClick={() =>
                      navigate(user ? `/solve/${p._id}` : "/login")
                    }
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:scale-105 transition-transform duration-300 active:scale-95 mb-2"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {user ? "Solve Problem" : "Login to Solve"}
                  </Button>

                  {user?._id === p.createdBy._id && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-transform duration-200 active:scale-95"
                        onClick={() => navigate(`/update/${p._id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-red-600 hover:bg-red-700 text-white transition-transform duration-200 active:scale-95"
                        onClick={() => deleteProblem(p._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <footer className="bg-black text-white text-center py-4 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Beyond code. 🚀 A mindset for better thinking.
        </p>
      </footer>
    </div>
  );
};
