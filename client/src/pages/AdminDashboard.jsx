import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import { 
  Settings, LogOut, Briefcase, User, Search, 
  CheckCircle2, Edit, Trash2, Users, FileText, X, Check
} from "lucide-react";

export default function AdminDashboard() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs"); // 'jobs', 'users', 'applications'
  const [searchQuery, setSearchQuery] = useState("");

  // Jobs State
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: '', company: '', location: '', salary: '', description: '', status: 'open'
  });
  const [isEditingJob, setIsEditingJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [loadingJob, setLoadingJob] = useState(false);

  // Users State
  const [users, setUsers] = useState([]);

  // Applications State
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (user?.role !== 'admin') {
      navigate("/dashboard");
      return;
    }
    fetchJobs();
    fetchUsers();
    fetchApplications();
  }, [token, navigate, user?.role]);

  // --- API Calls ---

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/jobs/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // --- Jobs Handlers ---

  const handleJobChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setLoadingJob(true);
    try {
      const url = isEditingJob 
        ? `http://localhost:5000/api/jobs/${editingJobId}`
        : 'http://localhost:5000/api/jobs';
      
      const method = isEditingJob ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setFormData({ title: '', company: '', location: '', salary: '', description: '', status: 'open' });
        setIsEditingJob(false);
        setEditingJobId(null);
        fetchJobs();
      }
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setLoadingJob(false);
    }
  };

  const handleEditJob = (job) => {
    setIsEditingJob(true);
    setEditingJobId(job._id);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary || '',
      description: job.description,
      status: job.status
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  // --- Users Handlers ---
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // --- Applications Handlers ---
  const handleUpdateApplicationStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchApplications();
    } catch (error) {
      console.error('Error updating application:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { id: "jobs", label: "Manage Jobs", icon: Briefcase },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "applications", label: "Applications", icon: FileText },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // --- Filters ---
  const filteredJobs = jobs.filter(j => j.title?.toLowerCase().includes(searchQuery.toLowerCase()) || j.company?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredUsers = users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredApplications = applications.filter(a => a.job?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || a.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()));


  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-10">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">AdminPanel</span>
          </Link>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "text-blue-700 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? "text-blue-600" : "text-slate-400"}`} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                {user?.name?.charAt(0) || "A"}
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
            <p className="text-slate-500 text-sm mt-0.5">Manage platform data and activity.</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm outline-none"
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          
          {/* TAB: JOBS */}
          {activeTab === 'jobs' && (
            <>
              {/* Job Form */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  {isEditingJob ? 'Edit Job Posting' : 'Post a New Job'}
                </h2>
                <form onSubmit={handleJobSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                      <input type="text" name="title" value={formData.title} onChange={handleJobChange} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="e.g. Senior Frontend Engineer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                      <input type="text" name="company" value={formData.company} onChange={handleJobChange} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="e.g. Acme Corp" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input type="text" name="location" value={formData.location} onChange={handleJobChange} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="e.g. Remote, NY" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Salary Range</label>
                      <input type="text" name="salary" value={formData.salary} onChange={handleJobChange} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" placeholder="e.g. $100k - $120k" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleJobChange} required className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm h-24 resize-none" placeholder="Detailed job description..." />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-slate-700">Status</label>
                      <select name="status" value={formData.status} onChange={handleJobChange} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm">
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {isEditingJob && (
                        <button type="button" onClick={() => { setIsEditingJob(false); setEditingJobId(null); setFormData({ title: '', company: '', location: '', salary: '', description: '', status: 'open' }); }} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors w-full sm:w-auto">
                          Cancel
                        </button>
                      )}
                      <button type="submit" disabled={loadingJob} className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto">
                        {loadingJob ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {isEditingJob ? 'Update Job' : 'Post Job'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Manage Postings</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  {filteredJobs.length} Job{filteredJobs.length !== 1 && 's'}
                </span>
              </div>

              {filteredJobs.length === 0 ? (
                 <div className="text-center py-16 bg-white rounded-xl border border-dashed border-slate-300">
                   <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                   <h3 className="text-sm font-bold text-slate-900 mb-1">No jobs found</h3>
                   <p className="text-slate-500 text-sm">You haven't posted any jobs that match this criteria.</p>
                 </div>
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="divide-y divide-slate-100">
                    {filteredJobs.map(job => (
                      <div key={job._id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 truncate">{job.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${job.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                              {job.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs flex items-center gap-2">
                            <span className="font-medium text-slate-700">{job.company}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" /> {job.location} 
                            {job.salary && <><span className="w-1 h-1 bg-slate-300 rounded-full" /> {job.salary}</>}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => handleEditJob(job)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100" title="Edit Job">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteJob(job._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" title="Delete Job">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Manage Users</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  {filteredUsers.length} User{filteredUsers.length !== 1 && 's'}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-slate-700">User</th>
                        <th className="px-6 py-3 font-semibold text-slate-700">Role</th>
                        <th className="px-6 py-3 font-semibold text-slate-700">Joined</th>
                        <th className="px-6 py-3 font-semibold text-slate-700 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900">{u.name}</div>
                            <div className="text-slate-500 text-xs">{u.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteUser(u._id)} 
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100" 
                              title="Delete User"
                              disabled={u._id === user.id} // Don't allow deleting self
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB: APPLICATIONS */}
          {activeTab === 'applications' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Manage Applications</h2>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                  {filteredApplications.length} Application{filteredApplications.length !== 1 && 's'}
                </span>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="text-sm font-bold text-slate-900 mb-1">No applications found</h3>
                    </div>
                  ) : (
                    filteredApplications.map(app => (
                      <div key={app._id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900 truncate">{app.user?.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${
                              app.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                              app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                              app.status === 'reviewed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                              'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs flex flex-wrap items-center gap-2 mb-1">
                            <span>Applied for: <strong className="text-slate-700">{app.job?.title}</strong> at {app.job?.company}</span>
                          </p>
                          <p className="text-slate-400 text-xs flex flex-wrap items-center gap-2">
                            <span>{app.user?.email}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" /> 
                            <span className="flex items-center gap-1">
                              Resume: 
                              {app.resumeFile ? (
                                <a href={`http://localhost:5000${app.resumeFile}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-bold">
                                  View Uploaded PDF
                               </a>
                              ) : app.resume ? (
                                <span className="text-slate-600 font-medium">{app.resume.title} (Built)</span>
                              ) : (
                                <span>N/A</span>
                              )}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" /> 
                            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select 
                            value={app.status} 
                            onChange={(e) => handleUpdateApplicationStatus(app._id, e.target.value)}
                            className="px-2 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 outline-none focus:border-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
