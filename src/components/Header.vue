
<template>
    <header class="header">
      <div class="header__inner container">
            <router-link :to="{ name: 'home'}" class="header__logo logo" href="/">
                  <img
                        class="logo__image"
                        src = "/images/logo.svg"
                        alt="RFID-control"
                        width="50" height="50" loading="lazy"
                  />
            </router-link>
            <button @click="$router.push({ name: 'login' })" class="header__button button" type="button">
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
        @include hover{
            background-color: rgba(255, 255, 255, 0.1);
        }
    }
    &__username {
        color: var(--color-light-blue);
    }
}
</style>
