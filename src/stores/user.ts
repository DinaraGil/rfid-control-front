import { defineStore } from 'pinia'
import router from '@/router'

interface User {
    id: number
    username: string
    role_id: number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),
  getters: {
    isAdmin: (state) => state.user?.role_id === 1,

    isWorker: (state) => state.user?.role_id === 2,
  },
  actions: {
    async login({ username, password }) {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            if (!response.ok) {
                console.error('Login failed');
                const errorData = await response.json();
                throw new Error(errorData.error || "Ошибка авторизации");
            }

            const data = await response.json();

            this.user = {
                id: data.id,
                username: data.username,
                role_id: data.role_id
            }
           
            this.isAuthenticated = true;

            router.push({ name: 'all-deliveries' });
            return data;
        } catch (error) {
            throw error;
        }
    },
    async logout() {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        this.user = null;
        this.isAuthenticated = false;

        router.push({ name: 'home' });
        
        console.log('Пользователь вышел из системы');
    },
    async fetchMe() {
        try {
            const response = await fetch("/api/auth/me", {
                credentials: "include",
            });

            if (!response.ok) {
                this.user = null;
                this.isAuthenticated = false;
                return;
            }

            const data = await response.json();

            this.user = data;
            this.isAuthenticated = true;
        } catch {
            this.user = null;
            this.isAuthenticated = false;
        }
    }
  }
})
