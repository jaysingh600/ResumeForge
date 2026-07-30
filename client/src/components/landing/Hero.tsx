import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, FileText, Upload } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-slate-900 pt-[120px] pb-[100px] text-white">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-slate-300">AI-Powered Resume Builder</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400"
          >
            Build a winning resume in minutes, not hours.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Instantly generate a 100% ATS-friendly professional resume. Build from scratch or upload your existing resume and let our AI do the heavy lifting.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/builder"
              className="group relative flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all w-full sm:w-auto"
            >
              <FileText className="w-5 h-5" />
              Build from Scratch
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              to="/register"
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-medium transition-all w-full sm:w-auto"
            >
              <Upload className="w-5 h-5" />
              Upload Existing Resume
            </Link>
          </motion.div>
        </div>

        {/* Animated UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-20 mx-auto max-w-5xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-2 md:p-4 shadow-2xl backdrop-blur-xl">
            <div className="bg-white rounded-xl h-[400px] md:h-[600px] w-full overflow-hidden relative shadow-inner">
              {/* Fake UI elements */}
              <div className="absolute top-0 left-0 w-64 h-full border-r border-slate-100 bg-slate-50 p-4 hidden md:block">
                <div className="w-24 h-4 bg-slate-200 rounded mb-8" />
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded bg-slate-200" />
                      <div className="w-32 h-3 bg-slate-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:ml-64 p-8 flex justify-center">
                <div className="w-full max-w-[500px] bg-white shadow-[0_0_40px_rgba(0,0,0,0.05)] rounded-sm h-[800px] p-8 border border-slate-100">
                  <div className="w-1/2 h-8 bg-slate-800 rounded mb-4 mx-auto" />
                  <div className="w-1/3 h-4 bg-blue-600 rounded mb-12 mx-auto" />
                  
                  <div className="w-32 h-5 bg-slate-800 rounded mb-4" />
                  <div className="w-full h-3 bg-slate-200 rounded mb-2" />
                  <div className="w-full h-3 bg-slate-200 rounded mb-2" />
                  <div className="w-3/4 h-3 bg-slate-200 rounded mb-8" />
                  
                  <div className="w-32 h-5 bg-slate-800 rounded mb-4" />
                  <div className="flex justify-between mb-2">
                    <div className="w-40 h-4 bg-slate-800 rounded" />
                    <div className="w-24 h-4 bg-slate-400 rounded" />
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded mb-2" />
                  <div className="w-5/6 h-3 bg-slate-200 rounded mb-8" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
