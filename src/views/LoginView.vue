<template>
    <main class="content">
        <section class="section container">
            <div class="auth">
                <form @submit.prevent="handleLogin" class="auth__form">
                    <div class="auth__field">
                        <div class="auth__description">
                            <p>Username</p>
                        </div>
                        <input
                            type="text"
                            class="auth__input"
                            placeholder="Enter your Username"
                            v-model="username"
                            required
                        />
                        <div class="auth__description">
                            <p>Password</p>
                        </div>
                        <input
                            type="password"
                            class="auth__input"
                            placeholder="Enter your Password"
                            v-model="password"
                            required
                        />
                    </div>
                    <button type="submit" class="auth__button button">
                        <!-- @click="$router.push({ name: 'deliveries' })" -->
                        Войти
                    </button>
                    <div v-if="error">{{  error }}</div>
                </form>
            </div>
      </section>
  </main>
</template>

<style lang="scss">
    .auth {
        display: flex;
        justify-content: center;

        &__form {
            display: flex;
            flex-direction: column;
            gap: var(--text-gap-large);

            border: 1px solid var(--color-grey);
            border-radius: var(--border-radius-small);
            padding: 24px;
        }

        &__field {
            display: flex;
            flex-direction: column;
            gap: var(--text-gap-small);
        }

        &__button {
            margin: var(--padding-medium);
            align-self: center;
        }
    }
</style>

<script lang="ts">
import { useUserStore } from '@/stores/user'

export default {
    data() {
        return {
            username: "",
            password: "",
            error: "",
        };
    },
    methods: {
        async handleLogin() {
            this.error = "";
            try {
                const userStore = useUserStore()
                await userStore.login({ username: this.username, password: this.password });
            } catch (err: any) {
                console.log("error catched in loginVue", err)
                this.error = err.message || "Ошибка";
            }
        },
    },
};
</script>