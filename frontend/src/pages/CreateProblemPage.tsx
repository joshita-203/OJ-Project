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
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-violet-900 to-purple-800 p-6 flex items-center justify-center text-white relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl top-1/4 left-1/3 animate-pulse" />
        <div className="absolute w-72 h-72 bg-purple-500/20 rounded-full blur-3xl bottom-1/3 right-1/4 animate-pulse delay-500" />
      </div>

      <Link
        to="/dashboard"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-purple-200 hover:text-cyan-300 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Dashboard</span>
      </Link>

      <div className="relative z-10 w-full max-w-3xl">
        <Card className="bg-purple-900/40 backdrop-blur-md border-purple-300/30">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Create New Problem</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg font-medium">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-white/90 text-black h-12 text-lg"
                  placeholder="Enter problem title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="statement" className="text-lg font-medium">Statement</Label>
                <Textarea
                  id="statement"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  className="bg-white/90 text-black h-36 text-lg"
                  placeholder="Enter problem description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-lg font-medium">Difficulty</Label>
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

              {/* Testcases */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">Test Cases</Label>
                {testCases.map((tc, index) => (
                  <div key={index} className="bg-purple-800/50 p-4 rounded space-y-2 relative">
                    <Label>Input</Label>
                    <Textarea
                      className="bg-white/90 text-black"
                      value={tc.input}
                      onChange={(e) => handleTestCaseChange(index, "input", e.target.value)}
                      placeholder="Input"
                      required
                    />
                    <Label>Expected Output</Label>
                    <Textarea
                      className="bg-white/90 text-black"
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
                  className="bg-green-500 text-white hover:bg-green-600"
                >
                  <Plus size={16} className="mr-2" />
                  Add Test Case
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-500 to-cyan-600 hover:from-purple-600 hover:to-cyan-700 text-white shadow-lg hover:scale-105 transition-all"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Problem
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
