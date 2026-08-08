import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/auth";
import { useResumeStore } from "../store/resume";
import { 
  Briefcase, Search, MapPin, DollarSign, Clock, Building2, 
  Sparkles, CheckCircle2, ChevronRight, X, FileText, ArrowRight, Home, Upload, Plus
} from "lucide-react";
import Navbar from "../components/landing/Navbar";

// Dummy Data
const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "TechNova Solutions",
    location: "San Francisco, CA (Hybrid)",
    salary: "$140k - $180k",
    type: "Full-time",
    logo: "T",
    color: "from-blue-500 to-indigo-600",
    tags: ["React", "TypeScript", "Tailwind"],
    postedAt: "2 hours ago",
    match: 94
  },
  {
    id: 2,
    title: "Product Designer",
    company: "CreativeFlow",
    location: "Remote",
    salary: "$120k - $150k",
    type: "Full-time",
    logo: "C",
    color: "from-purple-500 to-pink-500",
    tags: ["Figma", "UI/UX", "Prototyping"],
    postedAt: "5 hours ago",
    match: 88
  },
  {
    id: 3,
    title: "Backend Developer",
    company: "DataSync",
    location: "New York, NY",
    salary: "$130k - $170k",
    type: "Contract",
    logo: "D",
    color: "from-emerald-400 to-teal-500",
    tags: ["Node.js", "MongoDB", "AWS"],
    postedAt: "1 day ago",
    match: 91
  },
  {
    id: 4,
    title: "Full Stack Engineer",
    company: "StartupX",
    location: "Remote",
    salary: "$110k - $160k",
    type: "Full-time",
    logo: "S",
    color: "from-orange-400 to-red-500",
    tags: ["React", "Node.js", "GraphQL"],
    postedAt: "2 days ago",
    match: 85
  },
  {
    id: 5,
    title: "Marketing Manager",
    company: "GrowthLabs",
    location: "Austin, TX (On-site)",
    salary: "$90k - $120k",
    type: "Full-time",
    logo: "G",
    color: "from-yellow-400 to-orange-500",
    tags: ["SEO", "Campaigns", "Analytics"],
    postedAt: "3 days ago",
    match: 75
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "AI Dynamics",
    location: "Remote",
    salary: "$150k - $200k",
    type: "Full-time",
    logo: "A",
    color: "from-cyan-400 to-blue-500",
    tags: ["Python", "Machine Learning", "SQL"],
    postedAt: "4 days ago",
    match: 97
  }
];

export default function Jobs() {
  const { user, token, isAuthenticated } = useAuthStore();
  const { resumes, fetchResumes, isLoading: resumesLoading } = useResumeStore();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchResumes(token);
    }
  }, [isAuthenticated, token, fetchResumes]);

  const filteredJobs = MOCK_JOBS.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { returnUrl: "/jobs" } });
      return;
    }
    setSelectedJob(job);
    setIsApplyModalOpen(true);
    setApplicationSuccess(false);
    setSelectedResumeId(null);
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedResumeId(null); // Clear selected app resume
    }
  };

  const submitApplication = () => {
    if (!selectedResumeId && !selectedFile) return;
    
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setApplicationSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setIsApplyModalOpen(false);
        setApplicationSuccess(false);
        setSelectedJob(null);
        setSelectedFile(null);
      }, 3000);
    }, 1500);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 relative overflow-hidden flex flex-col">
      {!isAuthenticated && <Navbar />}
      
      {/* Background Orbs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {isAuthenticated && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200">
           <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">ResumeForge</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-4 py-2 rounded-xl transition-all shadow-sm">
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className={`container mx-auto px-4 sm:px-6 lg:px-8 py-12 ${!isAuthenticated ? 'pt-32' : ''} max-w-7xl relative z-10 flex-1`}>
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-semibold text-sm mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Discover Your Next Opportunity
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6"
          >
            Find a job you <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">love</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium"
          >
            Explore top roles at leading companies. Apply instantly with your tailored ResumeForge resumes.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="relative group flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 md:py-5 border-2 border-white bg-white/70 backdrop-blur-md rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg font-medium shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              placeholder="Search by job title, company, or skills..."
            />
          </div>
        </motion.div>

        {/* Job Listings */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid gap-6"
        >
          {filteredJobs.length === 0 ? (
            <div className="text-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-white shadow-sm">
              <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
              <p className="text-slate-500 font-medium">Try adjusting your search criteria</p>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <motion.div 
                key={job.id} 
                variants={itemVariants}
                className="group bg-white/80 backdrop-blur-md border border-white rounded-[2rem] p-6 md:p-8 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
              >
                {/* Decorative background hover effect */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                <div className="flex items-start gap-6 relative z-10 w-full md:w-auto">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${job.color} flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                    <span className="text-2xl font-black text-white">{job.logo}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h2>
                      {isAuthenticated && (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {job.match}% Match
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm font-medium mb-4">
                      <span className="flex items-center gap-1.5 text-slate-700 font-bold">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        {job.salary}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {job.postedAt}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto flex flex-col md:items-end gap-3 relative z-10 shrink-0">
                  <span className="hidden md:block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">
                    {job.type}
                  </span>
                  <button 
                    onClick={() => handleApplyClick(job)}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/30 hover:-translate-y-1 group/btn"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </main>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {applicationSuccess ? (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-4">Application Sent!</h3>
                  <p className="text-slate-500 text-lg font-medium">
                    Your resume has been successfully submitted to <span className="text-slate-900 font-bold">{selectedJob.company}</span>.
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 mb-1">Apply for {selectedJob.title}</h3>
                      <p className="text-slate-500 font-medium">at {selectedJob.company}</p>
                    </div>
                    <button 
                      onClick={() => setIsApplyModalOpen(false)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-6 sm:p-8 overflow-y-auto">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Select a Resume to Apply With
                    </h4>

                    {resumesLoading ? (
                      <div className="py-12 flex justify-center">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
                      </div>
                    ) : resumes.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-900 font-bold mb-1">No resumes found</p>
                        
                        <label className={`mt-4 inline-flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-white ${selectedFile ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                          <Upload className={`w-8 h-8 mb-2 ${selectedFile ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="font-bold text-slate-700 text-center">
                            {selectedFile ? selectedFile.name : 'Upload Resume (PDF)'}
                          </span>
                          <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                        </label>
                        
                        <div className="mt-4">
                           <Link to="/builder" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1">
                             <Plus className="w-4 h-4" /> Or create a new resume
                           </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          {resumes.map(resume => (
                            <label 
                              key={resume._id} 
                              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedResumeId === resume._id 
                                  ? 'border-blue-600 bg-blue-50' 
                                  : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                selectedResumeId === resume._id ? 'border-blue-600' : 'border-slate-300'
                              }`}>
                                {selectedResumeId === resume._id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                <input type="radio" name="resume" className="hidden" onChange={() => { setSelectedResumeId(resume._id); setSelectedFile(null); }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-900 truncate">{resume.title || 'Untitled Resume'}</p>
                                <p className="text-xs text-slate-500">Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
                              </div>
                              <div className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100">
                                {resume.template || 'Standard'}
                              </div>
                            </label>
                          ))}
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500 font-medium">Or</span>
                          </div>
                        </div>

                        <label className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all bg-white ${selectedFile ? 'border-blue-600 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                          <Upload className={`w-8 h-8 mb-2 ${selectedFile ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="font-bold text-slate-700 text-center">
                            {selectedFile ? selectedFile.name : 'Upload Resume (PDF)'}
                          </span>
                          <span className="text-sm text-slate-500 mt-1">
                            {selectedFile ? 'Click to change file' : 'Browse files from your computer'}
                          </span>
                          <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                        </label>

                        <div className="flex justify-center mt-2">
                          <Link to="/builder" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Create a new resume instead
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button 
                      onClick={() => setIsApplyModalOpen(false)}
                      className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={submitApplication}
                      disabled={!selectedResumeId || isApplying}
                      className="px-8 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2 min-w-[140px] justify-center"
                    >
                      {isApplying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
