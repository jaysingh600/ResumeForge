import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateProfile: async (data, token) => {
        try {
          const response = await fetch("http://localhost:5000/api/auth/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error("Failed to update profile");
          const result = await response.json();
          set({ user: result.user });
          return result.user;
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
