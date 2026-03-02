<template>
    <main class="content">
    <section class="section container">
            <div class="section__body">
                  <div class="hero__main">
                        <div class="hero__body">
                              <h2 class="hero__title">
                                    RFID-контроль - решение для учета товаров
                              </h2>
                              <h3 class="hero__description">
                                    Учет товаров на складе при помощи RFID-меток
                              </h3>
                        </div>
                        <img
                              class="hero__image" 
                              src="/images/rfid.svg"
                              alt="rfid image"
                              width="250" height="250" loading="lazy">
                  </div>
            </div>
      </section>

      <section class="section container">
            <h2 class="section__title">
                  Плюсы технологии
            </h2>
            <div class="section__body">
                  <div class="pros">
                        <ul class="pros__list">
                              <li class="pros__item">
                                    <img class="pros__icon" src="/images/icons/Loader.svg" alt="loader icon" width="32" height="32" loading="lazy">
                                    <div class="pros__description">
                                          <h4 class="pros__title">
                                                Автоматическая идентификация  
                                          </h4>
                                          <p>
                                                Повышает надежность учета товаров
                                          </p>
                                    </div>
                              </li>
                              <li class="pros__item">
                                    <img class="pros__icon" src="/images/icons/Clock.svg" alt="loader icon" width="32" height="32" loading="lazy">
                                    <div class="pros__description">
                                          <h4 class="pros__title">
                                                Сокращение времени приемки 
                                          </h4>
                                          <p>
                                                Благодаря автоматическому сканированию
                                          </p>
                                    </div>
                              </li>
                              <li class="pros__item">
                                    <img class="pros__icon" src="/images/icons/Key.svg" alt="loader icon" width="32" height="32" loading="lazy">
                                    <div class="pros__description">
                                          <h4 class="pros__title">
                                                Готовое решение  
                                          </h4>
                                          <p>
                                                Готовая система для вашего склада
                                          </p>
                                    </div>
                              </li>
                        </ul>
                        
                  </div>
            </div>
      </section>
    </main>
</template>

<style lang="scss">
    .hero {
        &__main {
            display: flex;
            justify-content: space-between;
            align-items: start;
            column-gap: 30px;
            background-color: var(--color-light-blue);
            border-radius: var(--border-radius-large);
            padding: var(--base-padding);
        }

        &__body {
            display: flex;
            flex-direction: column;
            row-gap: var(--text-gap);
            align-items: start;
            color: var(--color-dark-blue);
        }
    }

    .pros {
        padding-block: var(--base-padding);
        &__list {
            display: flex;
            justify-content: space-between;
        }
        &__item {
            display: flex;
        }
        &__description {
            padding-left: var(--padding-small);
            justify-content: space-between;
            flex-direction: column;
            display: flex;
            row-gap: var(--padding-small);
        }
    }
</style>