import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const COMPILER_URL = import.meta.env.VITE_COMPILER_URL;

type TestCase = { input: string; expectedOutput: string };
type Problem = {
  _id: string;
  title: string;
  statement: string;
  testCases?: TestCase[];
};

export const SolveProblemPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [code, setCode] = useState(`#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  return 0;\n}`);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/problems/${id}`);
        const data = await res.json();
        setProblem(data);
      } catch {
        toast({ title: "Problem not found", variant: "destructive" });
      }
    };
    fetchProblem();
  }, [id, toast]);

  const handleRun = async () => {
    setOutput("Running...");
    try {
      const res = await fetch(`${COMPILER_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language: "cpp", input: customInput }),
      });
      const data = await res.json();
      setOutput(data.output || data.error || "No output");
    } catch {
      setOutput("Run failed");
    }
  };

  const handleSubmit = async () => {
    if (!problem?.testCases || problem.testCases.length === 0) {
      toast({ title: "❌ No test cases found", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${COMPILER_URL}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: "cpp",
          testCases: problem.testCases,
        }),
      });

      const data = await res.json();

      if (data.success && data.allPassed) {
        toast({ title: "✅ All test cases passed!" });
        setOutput("✅ All test cases passed!");
      } else if (data.success && !data.allPassed) {
        toast({ title: "❌ Some test cases failed", variant: "destructive" });
        setOutput(
          data.results
            .map(
              (r: any, i: number) =>
                `#${i + 1} ${r.passed ? "✅" : "❌"}\nInput:\n${r.input}\nExpected:\n${r.expected}\nOutput:\n${r.actual}\n`
            )
            .join("\n")
        );
      } else {
        toast({ title: "❌ Submit failed", variant: "destructive" });
        setOutput(data.error || "Submit failed");
      }
    } catch {
      toast({ title: "❌ Network error during submit", variant: "destructive" });
      setOutput("Submit failed");
    }
    setSubmitting(false);
  };

  if (!problem) return <p className="text-center text-gray-800 p-6">Loading...</p>;

  const sample = problem.testCases?.[0];

  return (
    <div
      className="flex flex-col min-h-screen text-gray-900"
      style={{ background: "linear-gradient(to bottom right, #c7d2fe, #e0e7ff, #fbcfe8)" }}
    >
      <div className="max-w-7xl mx-auto w-full p-6">
        {/* Back Link */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-black font-medium hover:underline mb-4"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* Content Side-by-Side */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left - Problem */}
          <div className="flex-1 flex flex-col">
            <Card className="bg-white shadow-lg border border-blue-200 flex-1">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap text-gray-800">{problem.statement}</p>

                {sample && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-blue-700 mb-2">Sample Test Case</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3 text-sm">
                      <div>
                        <strong>Input:</strong>
                        <pre className="bg-blue-100 p-2 rounded whitespace-pre-wrap">{sample.input}</pre>
                      </div>
                      <div>
                        <strong>Expected Output:</strong>
                        <pre className="bg-blue-100 p-2 rounded whitespace-pre-wrap">{sample.expectedOutput}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right - Editor */}
          <div className="flex-1 flex flex-col">
            <Card className="bg-white shadow-lg border border-gray-300 flex-1">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Your Solution</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                <Textarea
                  className="h-[260px] font-mono bg-gray-50 text-gray-900 border border-gray-300 shadow resize-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />

                <Textarea
                  placeholder="Custom Input"
                  className="h-[100px] font-mono bg-gray-50 text-gray-900 border border-gray-300 shadow resize-none"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                />

                <div className="flex gap-4">
                  <Button onClick={handleRun} className="bg-blue-700 text-white hover:bg-blue-800">
                    Run
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-green-700 text-white hover:bg-green-800"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>

                <Card className="bg-gray-100 border border-gray-300 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-gray-700 text-base">Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">{output}</pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-4 mt-auto">
        <p className="text-sm">© {new Date().getFullYear()} Beyond code. 🚀 A mindset for better thinking.</p>
      </footer>
    </div>
  );
};
