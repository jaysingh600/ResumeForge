import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { 
  FileText, Upload, LayoutTemplate, User, Settings, LogOut, 
  Plus, Sparkles, CheckCircle2, Phone, MapPin, GraduationCap, 
  Briefcase, Save, Loader2, BookOpen
} from "lucide-react";
import { motion } from "framer-motion";

export default function Profile() {
  const { user, token, logout, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    academics: "",
    bio: "",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        location: user.location || "",
        academics: user.academics || "",
        bio: user.bio || "",
      });
    }
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { label: "My Resumes", icon: FileText, path: "/dashboard" },
    { label: "Build Resume", icon: Plus, path: "/builder" },
    { label: "Upload Resume", icon: Upload, path: "/upload" },
    { label: "Job Portal", icon: Briefcase, path: "/jobs" },
    { label: "Profile", icon: User, path: "/profile", active: true },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg("");
    setErrorMsg("");
    
    try {
      await updateProfile(formData, token);
      setSuccessMsg("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      setErrorMsg("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Sidebar - Copied from Dashboard for consistency */}
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
        <header className="sticky top-0 z-20 bg-slate-50/80 backdrop-blur-lg border-b border-slate-200/50 px-10 py-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Profile
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your personal details and professional background.</p>
        </header>

        <div className="p-10 max-w-4xl mx-auto">
          
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl flex items-center gap-2 font-bold"
            >
              <CheckCircle2 className="w-5 h-5" />
              {successMsg}
            </motion.div>
          )}

          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl flex items-center gap-2 font-bold"
            >
              {errorMsg}
            </motion.div>
          )}

          <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b border-slate-100 pb-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/20 text-white text-5xl font-black border-4 border-white">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-black text-slate-900 mb-2">{user?.name}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-medium">
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> {user?.email}</span>
                  {user?.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location}</span>}
                </div>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-600/30"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl text-slate-900 font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                {/* Email Address (Disabled) */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl text-slate-900 font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      disabled={!isEditing}
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. San Francisco, CA"
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl text-slate-900 font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                {/* Academics */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Highest Academic Qualification</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="academics"
                      disabled={!isEditing}
                      value={formData.academics}
                      onChange={handleChange}
                      placeholder="e.g. B.Sc. in Computer Science, Stanford University"
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl text-slate-900 font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                {/* Professional Bio */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Professional Bio</label>
                  <div className="relative group">
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                      <BookOpen className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <textarea
                      name="bio"
                      disabled={!isEditing}
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us a little about your professional background and goals..."
                      className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-xl text-slate-900 font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || "",
                        phone: user.phone || "",
                        location: user.location || "",
                        academics: user.academics || "",
                        bio: user.bio || "",
                      });
                    }}
                    className="px-6 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 min-w-[140px] justify-center"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
