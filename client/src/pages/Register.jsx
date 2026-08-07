import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FileText, Loader2, Mail, Lock, User, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../store/auth";
import axios from "axios";
import { motion } from "framer-motion";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError(null);
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password
      });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
        >
          <div className="mb-10 text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-8 bg-slate-100/50 hover:bg-slate-100 px-4 py-2 rounded-full">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20 mb-6">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Create an Account</h2>
            <p className="text-slate-500 font-medium">Join ResumeForge and build your professional resume in minutes.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  {...register("name")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${
                    errors.name ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                  } rounded-xl text-slate-900 focus:outline-none focus:bg-white transition-all font-medium`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                  } rounded-xl text-slate-900 focus:outline-none focus:bg-white transition-all font-medium`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                  } rounded-xl text-slate-900 focus:outline-none focus:bg-white transition-all font-medium`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-500 font-medium">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500"
                  } rounded-xl text-slate-900 focus:outline-none focus:bg-white transition-all font-medium`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-slate-900 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-8 hover:-translate-y-0.5"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIiBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-30 mix-blend-overlay" />
        
        <div className="relative z-10 max-w-lg p-12">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 leading-tight">
              Your Professional Journey Starts Here
            </h2>
            <p className="text-lg text-blue-100 font-medium mb-12 max-w-md">
              Join thousands of professionals landing their dream jobs with ResumeForge's intelligent builder.
            </p>
            
            {/* Glassmorphism Testimonial */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/90 text-lg font-medium leading-relaxed mb-6">
                "ResumeForge helped me land a Senior Developer role at a top tech company. The templates are clean and the builder is incredibly intuitive."
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg border border-white/30">
                  SA
                </div>
                <div>
                  <h4 className="text-white font-bold">Sarah Anderson</h4>
                  <p className="text-blue-200 text-sm font-medium">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4">
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Free to get started</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">ATS-friendly templates</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="font-medium">Export to PDF instantly</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
