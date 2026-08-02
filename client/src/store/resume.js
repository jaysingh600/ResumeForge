import { create } from 'zustand';
import axios from 'axios';

export const useResumeStore = create((set) => ({
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
    } catch (err) {
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
