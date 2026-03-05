
<template>
    <header class="header">
      <div class="header__inner container">
            <div class="header__menu">
                <router-link :to="{ name: 'home'}" class="header__logo logo">
                    <img
                            class="logo__image"
                            src = "/images/logo.svg"
                            alt="RFID-control"
                            width="50" height="50" loading="lazy"
                    />
                </router-link>
                <div v-if="userStore.isAuthenticated">
                    <router-link :to="{ name: 'deliveries'}" class="header__section">
                        <div class="header__icon">
                            <img
                                class="logo__image"
                                src="/images/icons/shopping_cart.svg"
                                alt="products_icon"
                                width="24"
                                height="24"
                                loading="lazy"
                            />
                        </div>
                        <div class="header__description">
                            <p>Поставки</p>
                        </div>
                    </router-link>
                </div>    
            </div>
            <div v-if="userStore.isAuthenticated" class="header__authorized">
                <div class="header__user">
                    <div class="header__avatar">
                        <img src="/images/icons/user.svg" alt="User" width="24" height="24" />
                    </div>
                    <span class="header__username">
                        {{ userStore.user?.username || "пользователь" }}
                    </span>
                </div>
                <button @click="handleLogout" class="header__button button" type="button">
                  Выйти
                </button>
            </div>
            <button v-else @click="$router.push({ name: 'login' })" class="header__button button" type="button">
                  Войти
            </button>
      </div>
  </header>
</template>

<style lang="scss">
    .header {
    &__inner {
        padding-block: 16px;
        padding-inline: 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--color-dark-blue);
    }
    &__menu {
        justify-content: space-between;
        display: flex;
        align-items: center;
        column-gap: var(--base-padding);
        align-items: center;
    }
    &__section {
        align-items: center;
        color: var(--color-blue);
        flex-direction: column;
        display: flex;
        row-gap: var(--padding-small);
        @include hover{
            background-color: rgba(255, 255, 255, 0.1);
        }   

    }
    &__logo {
        @include hover{
            background-color: rgba(255, 255, 255, 0.1);
        }    
    }

    &__user {
        justify-content: space-between;
        display: flex;
        column-gap: var(--padding-medium);
        // @include hover{
        //     background-color: rgba(255, 255, 255, 0.1);
        // }
    }
    &__username {
        color: var(--color-light-blue);
    }
    &__authorized {
        justify-content: space-between;
        display: flex;
        column-gap: var(--padding-medium);
        align-items: center;        
    }
}
</style>

<script setup lang="ts">
    import { useUserStore } from '@/stores/user'
    import { useRouter } from 'vue-router'

    const userStore = useUserStore()
    const router = useRouter()

    const handleLogout = () => {
        userStore.logout()
        router.push({ name: 'home' })
    }

</script>