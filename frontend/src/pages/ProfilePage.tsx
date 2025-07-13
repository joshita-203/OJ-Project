import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface TimeSpent {
  [date: string]: number;
}

export const ProfilePage = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [timeSpent, setTimeSpent] = useState<TimeSpent>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 🔹 Fetch time spent
  useEffect(() => {
    const fetchTime = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: { timeSpent?: TimeSpent } = await res.json();
        setTimeSpent(data?.timeSpent || {});
      } catch (err) {
        console.error("Failed to load time spent", err);
      }
    };

    fetchTime();
  }, [token]);

  // 🔹 Change password
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return;

    setIsChangingPassword(true);
    try {
      const res = await fetch(`${BASE_URL}/api/user/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      toast({ title: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      toast({
        title: "Error changing password",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-pink-100 to-blue-100 relative overflow-hidden">
      {/* Glowing Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-2/3 right-1/3 w-80 h-80 bg-pink-300/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/2 w-64 h-64 bg-blue-300/20 rounded-full blur-2xl animate-pulse" />
      </div>

      {/* Back Link */}
      <Link
        to="/dashboard"
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 text-black hover:text-purple-600 text-lg font-semibold transition-colors duration-300 group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
        <span>Back to Dashboard</span>
      </Link>

      <main className="flex-grow flex items-center justify-center px-4 pt-24 pb-8">
        <div className="w-full max-w-3xl">
          <Card className="bg-white border border-purple-200 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <UserCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl text-black font-bold">
                Profile
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-8 px-6 py-4">
              {/* User Info */}
              <div className="space-y-2">
                <p className="text-black text-lg">
                  <strong>Name:</strong> {user?.firstname} {user?.lastname}
                </p>
                <p className="text-black text-lg">
                  <strong>Email:</strong> {user?.email}
                </p>
              </div>

              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-black">Change Password</h3>
                <div className="space-y-2">
                  <Label className="text-black">Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-blue-100 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-black">New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-blue-100 text-black"
                  />
                </div>
                <Button
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                  className="bg-gradient-to-r from-purple-400 to-cyan-500 text-white hover:scale-105 transition-transform"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>

              {/* Time Spent */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-black">Time You've Turned Into Talent 🎯 The hours of Dedication !</h3>
                {Object.keys(timeSpent).length === 0 ? (
                  <p className="text-gray-500">No data recorded yet.</p>
                ) : (
                  <>
                    <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                      <table className="w-full text-left text-black">
                        <thead className="bg-blue-200 text-sm uppercase">
                          <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Minutes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(timeSpent)
                            .sort((a, b) => (a[0] < b[0] ? 1 : -1))
                            .map(([date, minutes]) => (
                              <tr key={date} className="border-t">
                                <td className="px-4 py-2">{date}</td>
                                <td className="px-4 py-2">{minutes}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-right text-sm text-gray-600 mt-2">
                      Total: {Object.values(timeSpent).reduce((a, b) => a + b, 0)} minutes
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full text-center text-sm text-white py-6 bg-black border-t border-white/10 z-10">
        © {new Date().getFullYear()} Beyond code. 🚀 A mindset for better thinking.
      </footer>
    </div>
  );
};
