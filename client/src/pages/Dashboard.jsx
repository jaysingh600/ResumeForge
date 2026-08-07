import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useResumeStore } from "../store/resume";
import { 
  FileText, Upload, LayoutTemplate, User, Settings, LogOut, 
  Plus, MoreVertical, Trash2, Edit, Download, FileCheck2,
  Search, Sparkles, Clock, ArrowUpRight, CheckCircle2, Briefcase
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchResumes(token);
  }, [token, navigate, fetchResumes]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "My Resumes", icon: FileText, path: "/dashboard", active: true },
    { label: "Build Resume", icon: Plus, path: "/builder" },
    { label: "Upload Resume", icon: Upload, path: "/upload" },
    { label: "Job Portal", icon: Briefcase, path: "/jobs" },
    { label: "Profile", icon: User, path: "/profile" },
  ];

  // Dynamic Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Animation variants use
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
// Item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const filteredResumes = resumes.filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 flex relative overflow-hidden font-sans">
      {/* Dynamic Background Elements for Premium Feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple-500/10 blur-[100px] pointer-events-none" />

      {/* Sidebar - Glassmorphic */}
      <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-white hidden md:flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 mb-12 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">ResumeForge</span>
          </Link>

          <nav className="space-y-2">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden ${
                  item.active
                    ? "text-blue-700 bg-blue-50 shadow-sm border border-blue-100"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white hover:shadow-sm"
                }`}
              >
                {item.active && (
                  <motion.div layoutId="activeNav" className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-transparent pointer-events-none" />
                )}
                <item.icon className={`w-5 h-5 z-10 ${item.active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`} />
                <span className="z-10">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8">
          <div className="bg-white/50 border border-white p-4 rounded-2xl shadow-sm backdrop-blur-md mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-white flex items-center justify-center font-bold text-slate-700 text-lg shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50 bg-white transition-colors text-sm font-bold w-full py-2.5 rounded-xl border border-slate-100 shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto z-10 relative">
        <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/50 px-10 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{user?.name?.split(" ")[0]}</span> 👋
            </h1>
            <p className="text-slate-500 mt-1 font-medium">Let's craft the perfect resume for your next opportunity.</p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resumes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm font-medium text-sm outline-none"
              />
            </div>
            <Link
              to="/builder"
              className="hidden sm:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Create
            </Link>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {/* Enhanced Stats */}
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-bold">
                  <ArrowUpRight className="w-3 h-3" />
                  +2 this week
                </div>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 mb-1">{resumes.length}</p>
                <p className="text-sm font-bold text-slate-500">Total Resumes</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-full">
                  Average
                </div>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 mb-1">85<span className="text-2xl text-slate-400">%</span></p>
                <p className="text-sm font-bold text-slate-500">ATS Score Optimization</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(139,92,246,0.1)] transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <p className="text-4xl font-black text-slate-900 mb-1">12</p>
                <p className="text-sm font-bold text-slate-500">Total PDF Exports</p>
              </div>
            </motion.div>
          </motion.div>

          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-slate-900">Recent Resumes</h2>
            {resumes.length > 0 && (
              <span className="text-sm font-bold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                {filteredResumes.length} Document{filteredResumes.length !== 1 && 's'}
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              </div>
              <p className="mt-6 text-slate-500 font-medium">Loading your masterpieces...</p>
            </div>
          ) : resumes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white/60 backdrop-blur-md rounded-3xl border-2 border-dashed border-slate-300 shadow-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:20px_20px]" />
              <div className="relative z-10">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <FileText className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No resumes yet</h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">You haven't created any resumes yet. Start building your perfect professional story today.</p>
                <Link
                  to="/builder"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Resume
                </Link>
              </div>
            </motion.div>
          ) : filteredResumes.length === 0 ? (
             <div className="text-center py-20">
               <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Search className="w-8 h-8 text-slate-400" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 mb-2">No results found</h3>
               <p className="text-slate-500">We couldn't find any resumes matching "{searchQuery}"</p>
             </div>
          ) : (
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="show"
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {filteredResumes.map((resume) => (
                <motion.div 
                  variants={itemVariants}
                  key={resume._id} 
                  className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:border-blue-200 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 group relative flex flex-col"
                >
                  {/* Premium Badge */}
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur shadow-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 group-hover:translate-y-0 duration-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">ATS Ready</span>
                  </div>

                  <div className="h-60 bg-gradient-to-br from-slate-50 to-slate-100 relative p-6 flex flex-col items-center justify-center overflow-hidden">
                    {/* Abstract decorative element */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-50 pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                    
                    <FileText className="w-20 h-20 text-slate-300 mb-6 drop-shadow-sm group-hover:text-blue-400 transition-colors duration-500" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">
                      {resume.template || "Standard"}
                    </span>
                    
                    {/* Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                      <Link 
                        to={`/builder/${resume._id}`} 
                        className="w-12 h-12 bg-white rounded-2xl hover:bg-blue-600 hover:text-white text-slate-800 transition-colors shadow-lg flex items-center justify-center translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                        title="Edit Resume"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button 
                        className="w-12 h-12 bg-white rounded-2xl hover:bg-emerald-500 hover:text-white text-slate-800 transition-colors shadow-lg flex items-center justify-center translate-y-4 group-hover:translate-y-0 duration-300 delay-100"
                        title="Download PDF"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => resume._id && deleteResume(token, resume._id)}
                        className="w-12 h-12 bg-white rounded-2xl hover:bg-red-500 hover:text-white text-slate-800 transition-colors shadow-lg flex items-center justify-center translate-y-4 group-hover:translate-y-0 duration-300 delay-150"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-white flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">{resume.title || "Untitled Resume"}</h3>
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Clock className="w-4 h-4" />
                        <span>Updated {new Date(resume.updatedAt || "").toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
