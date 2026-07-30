import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useAuthStore } from "../store/auth";
import { useResumeStore } from "../store/resume";
import { Save, Download, ArrowLeft, Loader2, Sparkles, Plus, Trash2 } from "lucide-react";

export default function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { resumes, createResume } = useResumeStore();
  const [isSaving, setIsSaving] = useState(false);

  const { register, control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      title: "Untitled Resume",
      personalInfo: { fullName: "", email: "", phone: "", address: "", linkedin: "", github: "", portfolio: "" },
      summary: "",
      skills: [],
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      achievements: [],
      languages: [],
      interests: [],
      template: "Modern ATS"
    }
  });

  const formData = watch();

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: "experience" });
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: "education" });
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: "projects" });

  useEffect(() => {
    if (id) {
      const existing = resumes.find(r => r._id === id);
      if (existing) reset(existing);
    } else {
      const parsedDataStr = localStorage.getItem("resume_parsed_data");
      if (parsedDataStr) {
        try {
          const parsedData = JSON.parse(parsedDataStr);
          reset((prev) => ({ ...prev, ...parsedData }));
          localStorage.removeItem("resume_parsed_data");
        } catch (e) {
          console.error("Failed to parse resume data from local storage", e);
        }
      }
    }
  }, [id, resumes, reset]);

  const onSave = async (data) => {
    if (!token) return;
    setIsSaving(true);
    try {
      if (id) {
        // Update (API to be added or use standard fetch)
      } else {
        const newId = await createResume(token, data);
        navigate(`/builder/${newId}`, { replace: true });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById("resume-preview");
      if (!element) return;
      
      // Dynamic import to avoid SSR issues if ever used in Next.js, though this is Vite.
      // But html2pdf.js might have issues with strict ES modules sometimes, we'll try default import.
      const html2pdf = (await import("html2pdf.js")).default;
      
      const opt = {
        margin: 0,
        filename: `${formData.personalInfo?.fullName || "resume"}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error("Failed to generate PDF", e);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <input
            type="text"
            {...register("title")}
            className="text-lg font-bold text-slate-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 w-64"
            placeholder="Resume Title"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 transition-colors">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Optimize</span>
          </button>
          <button
            onClick={handleSubmit(onSave)}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Save</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane - Form Editor */}
        <div className="w-full lg:w-[45%] h-full overflow-y-auto border-r border-slate-200 bg-white p-6 pb-32">
          <form className="space-y-8 max-w-2xl mx-auto">
            
            {/* Personal Info */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input {...register("personalInfo.fullName")} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input {...register("personalInfo.email")} type="email" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input {...register("personalInfo.phone")} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input {...register("personalInfo.address")} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                  <input {...register("personalInfo.linkedin")} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">GitHub / Portfolio URL</label>
                  <input {...register("personalInfo.github")} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </section>

            {/* Summary */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                Professional Summary
                <button type="button" className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded hover:bg-purple-100 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Rewrite
                </button>
              </h2>
              <textarea {...register("summary")} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="A brief summary of your professional background..."></textarea>
            </section>

            {/* Experience & Internships */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Experience & Internships</h2>
              {expFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-slate-200 rounded-xl mb-4 bg-slate-50 relative group">
                  <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                      <input {...register(`experience.${index}.company`)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Position</label>
                      <input {...register(`experience.${index}.position`)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                      <input {...register(`experience.${index}.startDate`)} placeholder="e.g. Jan 2020" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                      <input {...register(`experience.${index}.endDate`)} placeholder="e.g. Present" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                  </div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    Description
                    <button type="button" className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Optimize bullets
                    </button>
                  </label>
                  <textarea {...register(`experience.${index}.description`)} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" placeholder="- Achieved X by doing Y..."></textarea>
                </div>
              ))}
              <button type="button" onClick={() => appendExp({ company: "", position: "", location: "", startDate: "", endDate: "", description: "" })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Experience
              </button>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Education / Qualification</h2>
              {eduFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-slate-200 rounded-xl mb-4 bg-slate-50 relative group">
                  <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                      <input {...register(`education.${index}.institution`)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Degree / Course</label>
                      <input {...register(`education.${index}.degree`)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                      <input {...register(`education.${index}.startDate`)} placeholder="e.g. 2018" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                      <input {...register(`education.${index}.endDate`)} placeholder="e.g. 2022" className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendEdu({ institution: "", degree: "", startDate: "", endDate: "" })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Projects</h2>
              {projFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-slate-200 rounded-xl mb-4 bg-slate-50 relative group">
                  <button type="button" onClick={() => removeProj(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                      <input {...register(`projects.${index}.name`)} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                      <textarea {...register(`projects.${index}.description`)} rows={3} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"></textarea>
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => appendProj({ name: "", description: "", technologies: [] })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            {/* Skills & Others */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Additional Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    Skills (Comma separated)
                  </label>
                  <textarea {...register("skills")} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" placeholder="React, Node.js, Project Management..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    Certifications (Comma separated)
                  </label>
                  <textarea {...register("certifications")} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" placeholder="AWS Certified Developer, PMP..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex justify-between">
                    Hobbies & Interests (Comma separated)
                  </label>
                  <textarea {...register("interests")} rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white" placeholder="Photography, Traveling, Reading..."></textarea>
                </div>
              </div>
            </section>

          </form>
        </div>

        {/* Right Pane - Live Preview */}
        <div className="hidden lg:flex w-[55%] h-full bg-slate-200 p-8 overflow-y-auto justify-center">
          {/* A4 Size Paper Simulation */}
          <div id="resume-preview" className="w-[794px] min-h-[1123px] bg-white shadow-2xl shrink-0 p-[40px] text-slate-900 font-sans">
            <div className="border-b-2 border-slate-900 pb-4 mb-4 text-center">
              <h1 className="text-3xl font-bold uppercase tracking-wider">{formData.personalInfo?.fullName || "YOUR NAME"}</h1>
              <div className="flex flex-wrap justify-center gap-3 text-sm mt-2 text-slate-700">
                {formData.personalInfo?.email && <span>{formData.personalInfo.email}</span>}
                {formData.personalInfo?.phone && <span>• {formData.personalInfo.phone}</span>}
                {formData.personalInfo?.address && <span>• {formData.personalInfo.address}</span>}
                {formData.personalInfo?.linkedin && <span>• {formData.personalInfo.linkedin}</span>}
              </div>
            </div>

            {formData.summary && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-300">Professional Summary</h2>
                <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap">{formData.summary}</p>
              </div>
            )}

            {formData.experience && formData.experience.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-300">Experience & Internships</h2>
                <div className="space-y-4">
                  {formData.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900">{exp.position}</h3>
                        <span className="text-sm font-medium text-slate-700">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700 mb-1">{exp.company}</div>
                      <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap ml-4 list-disc">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.education && formData.education.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-300">Education</h2>
                <div className="space-y-4">
                  {formData.education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                        <span className="text-sm font-medium text-slate-700">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <div className="text-sm font-medium text-slate-700">{edu.institution}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.projects && formData.projects.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-300">Projects</h2>
                <div className="space-y-4">
                  {formData.projects.map((proj, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-bold text-slate-900">{proj.name}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap ml-4 list-disc">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.skills && formData.skills.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-300">Skills</h2>
                <p className="text-sm leading-relaxed text-slate-800">
                  {typeof formData.skills === "string" ? formData.skills : formData.skills.join(", ")}
                </p>
              </div>
            )}

            {formData.certifications && formData.certifications.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-300">Certifications</h2>
                <p className="text-sm leading-relaxed text-slate-800">
                  {typeof formData.certifications === "string" ? formData.certifications : formData.certifications.join(", ")}
                </p>
              </div>
            )}

            {formData.interests && formData.interests.length > 0 && (
              <div className="mb-4">
                <h2 className="text-lg font-bold uppercase tracking-wider mb-2 text-slate-900 border-b border-slate-300">Hobbies & Interests</h2>
                <p className="text-sm leading-relaxed text-slate-800">
                  {typeof formData.interests === "string" ? formData.interests : formData.interests.join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
