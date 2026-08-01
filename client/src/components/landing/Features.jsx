import { motion } from "framer-motion";
import { Zap, ShieldCheck, FileSearch, Download } from "lucide-react";

const features = [
  {
    title: "AI-Powered Parsing",
    description: "Upload any PDF or DOCX resume. Our advanced AI instantly extracts all your details and populates the builder.",
    icon: FileSearch,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    title: "Real-time ATS Preview",
    description: "See your resume update in real-time as you type. Always ATS-friendly, single-column, and perfectly formatted.",
    icon: Zap,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    title: "Smart Content Suggestions",
    description: "Get AI recommendations to improve your summary, bullet points, and action verbs to stand out to recruiters.",
    icon: SparklesIcon,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    title: "100% ATS Compliant PDF",
    description: "Export high-quality, machine-readable PDFs that pass through Applicant Tracking Systems with ease.",
    icon: Download,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

export default function Features() {
  return (
    <div id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Everything you need to land the interview
          </h2>
          <p className="text-lg text-slate-600">
            We've combined beautiful design with powerful AI to create the ultimate resume building experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all bg-white group"
              >
                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
