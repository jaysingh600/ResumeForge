import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Choose Your Path",
    description: "Start from scratch or simply upload your existing PDF/DOCX resume.",
  },
  {
    number: "02",
    title: "AI Extraction",
    description: "Our AI automatically reads your file and fills every form field instantly.",
  },
  {
    number: "03",
    title: "Edit & Optimize",
    description: "Use the side-by-side editor to refine your content. Get real-time AI suggestions.",
  },
  {
    number: "04",
    title: "Download PDF",
    description: "Export a perfectly formatted, ATS-compliant PDF ready for your next application.",
  },
];

export default function HowItWorks() {
  return (
    <div id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            How ResumeForge AI Works
          </h2>
          <p className="text-lg text-slate-600">
            Four simple steps to a professional, interview-winning resume.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 -translate-y-1/2 z-0" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-lg mb-6 relative">
                <span className="text-xl font-black text-blue-600">{step.number}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
