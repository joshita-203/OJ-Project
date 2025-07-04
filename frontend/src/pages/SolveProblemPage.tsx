import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Code } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const SolveProblemPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [problem, setProblem] = useState<any>(null);

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

  if (!problem) return null;

  return (
    <div className="min-h-screen p-6 flex items-center justify-center bg-gradient-to-br from-slate-950 to-gray-900 text-white relative">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-80 h-80 bg-green-500/20 rounded-full blur-3xl top-1/3 left-1/4 animate-pulse" />
        <div className="absolute w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl bottom-1/4 right-1/3 animate-pulse delay-1000" />
      </div>

      <Link
        to="/dashboard"
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-slate-200 hover:text-green-300 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Dashboard</span>
      </Link>

      <div className="relative z-10 w-full max-w-3xl">
        <Card className="bg-gray-900/50 backdrop-blur-md border-gray-300/20">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">
              {problem.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-lg leading-relaxed text-gray-200 whitespace-pre-wrap">
              {problem.statement}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
