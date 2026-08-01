import { motion } from "framer-motion";

const templates = [
  {
    name: "Standard ATS",
    description: "A clean, single-column design perfected for Applicant Tracking Systems and human recruiters alike.",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=600&auto=format&fit=crop",
    popular: true,
  },
  {
    name: "Modern Professional",
    description: "Sleek and contemporary layout that highlights your most impactful achievements.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    popular: false,
  },
  {
    name: "Creative Executive",
    description: "Stand out with a subtle touch of color and distinct typography for leadership roles.",
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=600&auto=format&fit=crop",
    popular: false,
  },
];

export default function Templates() {
  return (
    <div id="templates" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
            Professional Templates
          </h2>
          <p className="text-lg text-slate-600">
            Choose from our selection of battle-tested, ATS-friendly designs that get you hired.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {templates.map((template, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-500 transition-colors bg-slate-50"
            >
              {template.popular && (
                <div className="absolute top-4 right-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              
              <div className="aspect-[3/4] overflow-hidden relative">
                {/* Fallback pattern in case image doesn't load immediately */}
                <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-300">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                
                {/* Unsplash abstract image representing a document/template */}
                <img 
                  src={template.image} 
                  alt={template.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 mix-blend-multiply"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-6 bg-white border-t border-slate-200 relative z-20">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{template.name}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {template.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
