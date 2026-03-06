import { defineStore } from 'pinia'
import router from '@/router'

interface User {
    id: number
    username: string
    role_id: number
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null') as User | null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
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
           
            this.token = data.token;
            if (this.token) {
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
            }
            this.isAuthenticated = true;

            router.push({ name: 'all-deliveries' });
            return data;
        } catch (error) {
            throw error;
        }
    },
    logout() {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        router.push({ name: 'home' });
        
        console.log('Пользователь вышел из системы');
    }
  }
})
