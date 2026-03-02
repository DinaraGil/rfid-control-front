<template>
    <div class="menu">
            <ul class="menu__list">
                <li class="menu__item">
                    <a class="menu__link" href="/">
                        <p>Товары</p>
                    </a>
                </li>
                <li class="menu__item">
                    <a class="menu__link" href="/">
                        <p>Движение товаров</p>
                    </a>
                </li>
                <li class="menu__item">
                    <a class="menu__link" href="/">
                        <p>Поставщики</p>
                    </a>
                </li>
            </ul>
        </div>
</template>

<style lang="scss">
    .menu {
    background-color: var(--color-light-blue);
    padding-block: var(--padding-medium);
    padding-inline: var(--base-padding);
    &__list {
        display: flex;
        align-items: start;
        column-gap: var(--base-padding);
    }

    &__link {
        height: var(--button-height);
        align-items: center;
        position: relative;
        display: inline-flex;
        @include hover {
            &::after {
                width: 100%;
            }
        }
        &::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            translate: -50%;
            width: 0;
            height: 2px;
            background-color: currentColor;
            transition-duration: inherit;
        }
    }
}
</style>