<template>
    <main class="content">
        <section class="section container">
            <div class="auth">
                <form @submit.prevent="login" class="auth__form">
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
export default {
    data() {
        return {
            username: "",
            password: "",
            error: "",
        };
    },
    methods: {
        async login() {
            this.error = "";
            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password,
                    }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // Сохранить токен/данные пользователя
                    // Перенаправить на страницу deliveries
                    this.$router.push({ name: 'deliveries' });
                } else {
                    // Обработка ошибки авторизации
                    console.error('Login failed');
                    const errorData = await response.json();
                    this.error = errorData.error;
//                    this.error = await response.text();
                }
            } catch (err) {
                console.error('Network error:', err);
                this.error = "Ошибка авторизации";
            }
        },
    },
};
</script>