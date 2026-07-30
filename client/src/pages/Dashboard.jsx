import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useResumeStore } from "../store/resume";
import { 
  FileText, Upload, LayoutTemplate, User, Settings, LogOut, 
  Plus, MoreVertical, Trash2, Edit, Download, FileCheck2
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const navigate = useNavigate();

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
    { label: "Upload Resume", icon: Upload, path: "/upload" }, // to be implemented
    { label: "Templates", icon: LayoutTemplate, path: "#" },
    { label: "Profile", icon: User, path: "#" },
    { label: "Settings", icon: Settings, path: "#" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900">ResumeForge</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  item.active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`w-5 h-5 ${item.active ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors text-sm font-medium w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="text-slate-500 mt-1">Here is what's happening with your resumes today.</p>
          </div>
          <Link
            to="/builder"
            className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create New
          </Link>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Resumes</p>
                  <p className="text-2xl font-bold text-slate-900">{resumes.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <FileCheck2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">ATS Score Avg</p>
                  <p className="text-2xl font-bold text-slate-900">85%</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Downloads</p>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Resumes</h2>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No resumes yet</h3>
              <p className="text-slate-500 mb-6">Create your first resume to get started.</p>
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Build from Scratch
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div key={resume._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all group">
                  <div className="h-48 bg-slate-50 border-b border-slate-100 relative p-4 flex flex-col items-center justify-center">
                    <FileText className="w-16 h-16 text-slate-300 mb-4" />
                    <span className="text-sm font-mono text-slate-400">Template: {resume.template}</span>
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Link to={`/builder/${resume._id}`} className="p-2 bg-white rounded-lg hover:bg-blue-50 text-blue-600 transition-colors shadow-sm">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button className="p-2 bg-white rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shadow-sm">
                        <Download className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => resume._id && deleteResume(token, resume._id)}
                        className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600 transition-colors shadow-sm"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 truncate mb-1">{resume.title || "Untitled Resume"}</h3>
                    <p className="text-sm text-slate-500">
                      Updated {new Date(resume.updatedAt || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}
