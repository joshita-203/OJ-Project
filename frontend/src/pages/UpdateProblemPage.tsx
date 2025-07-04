// src/pages/UpdateProblemPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Code, Trash, Plus } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const UpdateProblemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [testCases, setTestCases] = useState([{ input: "", expectedOutput: "" }]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/problems/${id}`);
        const data = await res.json();

        if (!res.ok || !data) throw new Error("Problem not found");

        if (user && data.createdBy?._id !== user._id) {
          toast({ title: "Unauthorized", variant: "destructive" });
          navigate("/dashboard");
          return;
        }

        setTitle(data.title);
        setStatement(data.statement);
        setDifficulty(data.difficulty);
        setTestCases(data.testCases || [{ input: "", expectedOutput: "" }]);
      } catch (err) {
        toast({ title: "Problem not found", variant: "destructive" });
        navigate("/dashboard");
      }
    };

    if (id) fetchProblem();
  }, [id, user, navigate, toast]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/problems/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, statement, difficulty, testCases }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast({ title: "Problem Updated Successfully" });
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
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-indigo-950 to-blue-900 text-white relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl top-1/3 left-1/4 animate-pulse" />
        <div className="absolute w-72 h-72 bg-blue-400/20 rounded-full blur-3xl bottom-1/4 right-1/3 animate-pulse delay-1000" />
      </div>

      <Link
        to="/dashboard"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-blue-200 hover:text-cyan-300 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Dashboard</span>
      </Link>

      <div className="relative z-10 w-full max-w-2xl">
        <Card className="bg-blue-900/40 backdrop-blur-md border-blue-300/30">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Update Problem</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="bg-white/90 text-black h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statement">Statement</Label>
                <Textarea
                  id="statement"
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  required
                  className="bg-white/90 text-black h-36"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-white/90 text-black h-12 w-full rounded px-4"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              {/* Test Cases Section */}
              <div className="space-y-4">
                <Label className="text-lg font-medium">Test Cases</Label>
                {testCases.map((tc, index) => (
                  <div key={index} className="bg-blue-800/50 p-4 rounded space-y-2 relative">
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
                      onChange={(e) =>
                        handleTestCaseChange(index, "expectedOutput", e.target.value)
                      }
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
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:scale-105"
              >
                {isLoading ? "Updating..." : "Update Problem"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
