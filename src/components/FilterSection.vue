<template>
<section class="section container">
            <div class="section__body">
                <div class="filter">
                    <ul class="filter__list">
                        <li class="filter__item">
                            <label class="filter__name">От:</label>
                            <input class="filter__input" type="date" value="2018-07-22" min="2018-01-01"
                                max="2018-12-31" />
                        </li>
                        <li class="filter__item">
                            <label class="filter__name">До:</label>
                            <input class="filter__input" type="date" value="2018-07-22" min="2018-01-01"
                                max="2018-12-31" />
                        </li>
                        <li class="filter__item">
                            <label class="filter__name">Поиск:</label>
                            <form action="" method="get">
                                <input class="filter__input" placeholder="Название товара" type="search">
                                <button class="filter__button" type="button">Поиск</button>
                            </form>
                        </li>
                    </ul>
                    <button class="filter__add button" type="button">
                        Добавить товар
                    </button>
                </div>
            </div>
        </section>
</template>

<style lang="scss">
    .filter {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    &__list {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        align-items: start;
        column-gap: var(--base-padding);
    }
    &__item {
        display: flex;
        flex-direction: column;
    }
    &__input {
        border-radius: var(--border-radius-small);
        border-color: var(--color-grey);
    }
}
</style>