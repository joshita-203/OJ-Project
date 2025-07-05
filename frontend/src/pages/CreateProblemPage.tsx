import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Code, ArrowLeft, Sparkles, Plus, Trash } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const CreateProblemPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/problems`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, statement, difficulty, testCases }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to create problem");
      }

      toast({
        title: "Problem Created",
        description: "Your coding problem has been added.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCaseChange = (index: number, field: "input" | "expectedOutput", value: string) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const addTestCase = () => {
    setTestCases([...testCases, { input: "", expectedOutput: "" }]);
  };

  const removeTestCase = (index: number) => {
    const updated = [...testCases];
    updated.splice(index, 1);
    setTestCases(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-800 relative overflow-hidden">
      {/* Glowing Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-2xl animate-fade-in-up" />
        <div className="absolute bottom-1/3 left-1/2 w-64 h-64 bg-indigo-400/10 rounded-full blur-2xl animate-scale-in-slow" />
      </div>

      {/* Back to Dashboard */}
      <Link
        to="/dashboard"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-purple-200 hover:text-cyan-300 transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span className="font-medium">Back to Dashboard</span>
      </Link>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-8">
        <div className="relative z-10 w-full max-w-4xl animate-fade-in-up">
          <Card className="bg-gradient-to-r from-violet-500 to-emerald-600 backdrop-blur-md border border-cyan-300/30 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <Code className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl text-white font-bold drop-shadow-[1px_1px_2px_black]">
                Create New Problem
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 px-6 py-2">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-white text-lg">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="bg-white/90 text-black h-12 text-lg"
                    placeholder="Enter problem title"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="statement" className="text-white text-lg">Statement</Label>
                  <Textarea
                    id="statement"
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    required
                    className="bg-white/90 text-black h-40 text-sm"
                    placeholder="Enter problem description"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="difficulty" className="text-white text-lg">Difficulty</Label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-white/90 text-black h-12 w-full text-lg rounded px-4"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>

                {/* Test Cases */}
                <div className="space-y-3">
                  <Label className="text-white text-lg">Test Cases</Label>
                  {testCases.map((tc, index) => (
                    <div key={index} className="bg-white/10 p-3 rounded space-y-1 relative border border-white/20">
                      <Label className="text-white">Input</Label>
                      <Textarea
                        className="bg-white/90 text-black h-20 text-sm"
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                        placeholder="Input"
                        required
                      />
                      <Label className="text-white">Expected Output</Label>
                      <Textarea
                        className="bg-white/90 text-black h-20 text-sm"
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(index, "expectedOutput", e.target.value)}
                        placeholder="Expected Output"
                        required
                      />
                      {testCases.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeTestCase(index)}
                          variant="destructive"
                          className="absolute top-2 right-2"
                        >
                          <Trash size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addTestCase}
                    className="bg-white text-purple-900 font-semibold hover:bg-slate-100 shadow-lg hover:scale-105 transition-all"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Test Case
                  </Button>
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
                      <span className="text-sm">Creating Problem...</span>
                    </div>
                  ) : (
                    <div className="flex items-center animate-bounce">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Problem
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="w-full text-center text-sm text-white py-6 bg-gradient-to-r from-black via-purple-900 to-black border-t border-white/10 z-10 backdrop-blur-md">
  © {new Date().getFullYear()} Beyond code. 🚀 A mindset for better thinking.
</footer>


      {/* Custom Animations */}
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

          .animate-fade-in-up {
            animation: fadeInUp 1s ease-out;
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
