import { create } from 'zustand';
import axios from 'axios';

export interface ResumeData {
  _id?: string;
  title: string;
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  summary: string;
  skills: string[];
  education: any[];
  experience: any[];
  projects: any[];
  certifications: any[];
  achievements: string[];
  languages: string[];
  interests: string[];
  template: string;
  updatedAt?: string;
}

interface ResumeState {
  resumes: ResumeData[];
  currentResume: ResumeData | null;
  isLoading: boolean;
  error: string | null;
  fetchResumes: (token: string) => Promise<void>;
  setCurrentResume: (resume: ResumeData | null) => void;
  createResume: (token: string, data: Partial<ResumeData>) => Promise<string>;
  deleteResume: (token: string, id: string) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,
  fetchResumes: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get("http://localhost:5000/api/resume", {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ resumes: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
  setCurrentResume: (resume) => set({ currentResume: resume }),
  createResume: async (token, data) => {
    const response = await axios.post("http://localhost:5000/api/resume/create", data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data._id;
  },
  deleteResume: async (token, id) => {
    await axios.delete(`http://localhost:5000/api/resume/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    set((state) => ({ resumes: state.resumes.filter(r => r._id !== id) }));
  }
}));
