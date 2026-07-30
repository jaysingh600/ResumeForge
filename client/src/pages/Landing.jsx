import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";

export default function Landing() {
  return (
    <div className="min-h-screen font-sans selection:bg-blue-200">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <footer className="bg-slate-900 py-12 text-center text-slate-400 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <p>© {new Date().getFullYear()} ResumeForge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
