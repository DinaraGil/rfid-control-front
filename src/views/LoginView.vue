<template>
    <main class="content">
        <section class="section container">
            <div class="auth">
                <form class="auth__form">
                    <div class="auth__field">
                        <div class="auth__description">
                            <p>Username</p>
                        </div>
                        <input type="text" class="auth__input" placeholder="Enter your Username" required/>
                        <div class="auth__description">
                            <p>Password</p>
                        </div>
                        <input type="password" class="auth__input" placeholder="Enter your Password" required/>
                    </div>
                    <button class="auth__button button" type="button">
                        Войти
                    </button>
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

