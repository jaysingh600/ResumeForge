import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { useResumeStore } from "../store/resume";
import { 
  FileText, Upload, User, LogOut, 
  Plus, Trash2, Edit, Download,
  Search, Briefcase, BarChart2
} from "lucide-react";

export default function Dashboard() {
  const { user, token, logout } = useAuthStore();
  const { resumes, fetchResumes, deleteResume, isLoading } = useResumeStore();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("resumes");
  const [isLoadingApps, setIsLoadingApps] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user?.role === 'admin') {
      navigate("/admin/dashboard");
      return;
    }
    fetchResumes(token);

    const fetchApplications = async () => {
      setIsLoadingApps(true);
      try {
        const res = await fetch('http://localhost:5000/api/applications/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setIsLoadingApps(false);
      }
    };
    fetchApplications();
  }, [token, navigate, fetchResumes, user?.role]);

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

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const filteredResumes = resumes.filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">ResumeForge</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className={`w-4 h-4 ${item.active ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="truncate">
                <p className="font-medium text-sm text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50" title="Sign Out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto z-10">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {greeting}, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Let's craft the perfect resume for your next opportunity.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resumes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none"
              />
            </div>
            <Link
              to="/builder"
              className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Resumes</p>
                <p className="text-3xl font-bold text-slate-900">{resumes.length}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">ATS Optimization</p>
                <p className="text-3xl font-bold text-slate-900 flex items-baseline gap-1">85<span className="text-lg text-slate-400 font-medium">%</span></p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total PDF Exports</p>
                <p className="text-3xl font-bold text-slate-900">12</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Download className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-slate-200 mb-6">
            <button
              onClick={() => setActiveTab("resumes")}
              className={`pb-3 font-bold transition-colors border-b-2 ${
                activeTab === "resumes" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              My Resumes
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`pb-3 font-bold transition-colors border-b-2 ${
                activeTab === "applications" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Job Applications
            </button>
          </div>

          {activeTab === "resumes" && (
            <>
              {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No resumes yet</h3>
              <p className="text-slate-500 text-sm mb-6">Start building your perfect professional story today.</p>
              <Link to="/builder" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Plus className="w-4 h-4" /> Create Resume
              </Link>
            </div>
          ) : filteredResumes.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
               <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
               <h3 className="text-sm font-bold text-slate-900 mb-1">No results found</h3>
               <p className="text-slate-500 text-sm">We couldn't find any resumes matching "{searchQuery}"</p>
             </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResumes.map((resume) => (
                <div key={resume._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                  <div className="h-48 bg-slate-50 border-b border-slate-100 relative flex items-center justify-center">
                    <FileText className="w-16 h-16 text-slate-200 group-hover:text-blue-500 transition-colors duration-300" />
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link to={`/builder/${resume._id}`} className="w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow text-slate-600 hover:text-blue-600 flex items-center justify-center transition-all" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow text-slate-600 hover:text-emerald-600 flex items-center justify-center transition-all" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={() => resume._id && deleteResume(token, resume._id)} className="w-10 h-10 bg-white rounded-lg shadow-sm hover:shadow text-slate-600 hover:text-red-600 flex items-center justify-center transition-all" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{resume.title || "Untitled Resume"}</h3>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 uppercase shrink-0">
                          {resume.template || "Standard"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">Updated {new Date(resume.updatedAt || "").toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </>
          )}

          {activeTab === "applications" && (
            <>
              {isLoadingApps ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                  <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">No applications yet</h3>
                  <p className="text-slate-500 text-sm mb-6">Explore the job portal and start applying.</p>
                  <Link to="/jobs" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                    <Briefcase className="w-4 h-4" /> Find Jobs
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <div key={app._id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 truncate">{app.job?.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                              app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                              app.status === 'reviewed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs font-medium mb-1">{app.job?.company} • {app.job?.location}</p>
                          <p className="text-slate-400 text-xs">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
