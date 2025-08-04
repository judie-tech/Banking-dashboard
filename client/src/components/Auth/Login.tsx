import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user" as "user" | "admin",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, register, user, fetchUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          if (user?.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          setError("Invalid email or password");
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        if (!formData.name.trim()) {
          setError("Name is required");
          setLoading(false);
          return;
        }

        const success = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );

        if (success) {
          await fetchUser(); // ✅ ensure latest user data is loaded
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

          if (storedUser.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
        } else {
          setError("Registration failed. Please try again.");
        }
      }
    } catch (err) {
      setError(
        isLogin
          ? "Login failed. Please try again."
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });
    setError("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a3b8f] via-[#4e54c8] to-[#8f94fb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NeoBank</h1>
          <p className="text-white/80">Secure Banking Dashboard</p>
        </div>

        {/* Auth Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p className="text-white/70 text-sm">
                {isLogin
                  ? "Welcome back to your banking dashboard"
                  : "Join NeoBank today"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-red-100 text-sm">
                {error}
              </div>
            )}

            {/* Demo Credentials */}
            {isLogin && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-blue-100 text-sm">
                <p className="font-semibold mb-2">Demo Credentials:</p>
                <p>Admin: admin@bank.com / admin123</p>
                <p>User: user@bank.com / user123</p>
              </div>
            )}

            {/* Full Name */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Account Type */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center p-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === "user"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "user",
                        })
                      }
                      className="mr-3"
                    />
                    <User className="w-5 h-5 text-white/80 mr-2" />
                    <span className="text-white/90 font-medium">User</span>
                  </label>

                  <label className="flex items-center p-3 bg-white/10 border border-white/20 rounded-xl cursor-pointer hover:bg-white/20 transition-all">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === "admin"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as "admin",
                        })
                      }
                      className="mr-3"
                    />
                    <UserCheck className="w-5 h-5 text-white/80 mr-2" />
                    <span className="text-white/90 font-medium">Admin</span>
                  </label>
                </div>
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/40 focus:bg-white/20 transition-all"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#00c9b1] to-[#ff6b6b] text-white font-semibold rounded-xl hover:from-[#00b8a5] hover:to-[#ff5555] focus:outline-none focus:ring-4 focus:ring-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>
                    {isLogin ? "Signing In..." : "Creating Account..."}
                  </span>
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Toggle */}
            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                {isLogin ? (
                  <>
                    Don’t have an account?{" "}
                    <span className="font-semibold text-[#00c9b1]">
                      Sign Up
                    </span>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <span className="font-semibold text-[#00c9b1]">
                      Sign In
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60 text-sm">
              Secure login with end-to-end encryption
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
