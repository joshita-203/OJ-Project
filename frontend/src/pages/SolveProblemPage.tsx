import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";

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
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(
    `#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  return 0;\n}`
  );
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("");
  const [review, setReview] = useState("Click 'AI Review' to get code feedback");
  const [reviewLoading, setReviewLoading] = useState(false);
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
    setOutput("⏳ Running...");

    const inputToSend = customInput.trim()
      ? customInput
      : problem?.testCases?.[0]?.input || "";

    try {
      const res = await fetch(`${COMPILER_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          input: inputToSend,
          testCases: problem?.testCases || [],
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOutput(data.output || "✅ No output");
      } else {
        const errorMessage =
          data.output || data.stderr || "❌ Unknown runtime/compile error";
        setOutput(`❌ Error:\n${errorMessage}`);
      }
    } catch {
      setOutput("❌ Run failed due to network/server error");
    }
  };

  const handleSubmit = async () => {
    if (!problem?.testCases || problem.testCases.length === 0) {
      toast({ title: "❌ No test cases found", variant: "destructive" });
      return;
    }

    setSubmitting(true);

    let allPassed = true;
    let failedCase = null;
    let compileError = null;

    for (const testCase of problem.testCases) {
      try {
        const res = await fetch(`${COMPILER_URL}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            language,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
          }),
        });

        const data = await res.json();

        if (!data.success) {
          // Compilation/runtime error detected
          compileError = data.stderr || data.error || "Unknown compilation/runtime error";
          allPassed = false;
          break;
        }

        const expected = testCase.expectedOutput.trim();
        const actual = (data.actualOutput || "").trim();

        if (expected !== actual) {
          failedCase = { ...testCase, actual };
          allPassed = false;
          break;
        }
      } catch (err) {
        toast({ title: "❌ Submit failed", variant: "destructive" });
        setOutput("❌ Submit failed due to network/server error");
        setSubmitting(false);
        return;
      }
    }

    if (allPassed) {
      toast({ title: "✅ All test cases passed!" });
      setOutput("✅ All test cases passed!");
    } else {
      toast({ title: "❌ Submission failed", variant: "destructive" });

      if (compileError) {
        setOutput(`❌ Compilation/Runtime Error:\n${compileError}`);
      } else if (failedCase) {
        setOutput(
          `❌ Test Case Failed\nInput:\n${failedCase.input}\nExpected:\n${failedCase.expectedOutput}\nGot:\n${failedCase.actual}`
        );
      } else {
        setOutput("❌ Some test cases failed");
      }
    }

    setSubmitting(false);
  };

  const handleAIReview = async () => {
    setReviewLoading(true);
    setReview("Generating review...");

    try {
      const res = await fetch(`${COMPILER_URL}/ai-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();
      if (data.success) {
        setReview(data.review);
      } else {
        setReview("❌ Failed to get review.");
      }
    } catch {
      setReview("❌ AI review request failed.");
    }

    setReviewLoading(false);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (lang === "cpp") {
      setCode(
        `#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n  return 0;\n}`
      );
    } else if (lang === "java") {
      setCode(
        `public class Main {\n  public static void main(String[] args) {\n    // your code here\n  }\n}`
      );
    } else if (lang === "py") {
      setCode(`print("Hello, Python!")`);
    }
  };

  if (!problem)
    return <p className="text-center text-gray-800 p-6">Loading...</p>;

  const sample = problem.testCases?.[0];

  return (
    <div className="flex flex-col min-h-screen text-gray-900 bg-gradient-to-br from-indigo-200 via-indigo-100 to-pink-100">
      <div className="max-w-7xl mx-auto w-full p-6">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-black font-medium hover:underline mb-4"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left - Problem */}
          <div className="flex-1 flex flex-col">
            <Card className="bg-white shadow-lg border border-blue-200 flex-1">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{problem.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 whitespace-pre-wrap text-gray-800">
                  {problem.statement}
                </p>
                {sample && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-blue-700 mb-2">
                      Sample Test Case
                    </h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3 text-sm">
                      <div>
                        <strong>Input:</strong>
                        <pre className="bg-blue-100 p-2 rounded whitespace-pre-wrap">
                          {sample.input}
                        </pre>
                      </div>
                      <div>
                        <strong>Expected Output:</strong>
                        <pre className="bg-blue-100 p-2 rounded whitespace-pre-wrap">
                          {sample.expectedOutput}
                        </pre>
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
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Your Solution
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {/* Language Selector */}
                <div className="flex gap-4 items-center">
                  <label className="text-sm font-medium text-gray-700">
                    Language:
                  </label>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded text-sm bg-white shadow"
                  >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="py">Python</option>
                  </select>
                </div>

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

                <div className="flex gap-4 flex-wrap">
                  <Button
                    onClick={handleRun}
                    className="bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Run
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-green-700 text-white hover:bg-green-800"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    onClick={handleAIReview}
                    className="bg-purple-700 text-white hover:bg-purple-800"
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? "Reviewing..." : "AI Review"}
                  </Button>
                </div>

                <Card className="bg-gray-100 border border-gray-300 shadow-md">
                  <CardHeader>
                    <CardTitle className="text-gray-700 text-base">Output</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {output}
                    </pre>
                  </CardContent>
                </Card>

                <Card className="bg-purple-50 border border-purple-300 shadow-md mt-4">
                  <CardHeader>
                    <CardTitle className="text-purple-800 text-base">
                      🔎 AI Code Review
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm text-gray-800 whitespace-pre-wrap">
                      <ReactMarkdown>{review}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white text-center py-4 mt-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Beyond code. 🚀 A mindset for better
          thinking.
        </p>
      </footer>
    </div>
  );
};
