<template>
    <div class="menu">
            <ul class="menu__list">
                <li 
                    v-for="item in currentItems" 
                    :key="item.path"
                    class="menu__item"
                    :class="{ 'menu__item--active': isActive(item.path) }"
                >
                    <router-link :to="item.path" class="menu__link">
                        {{ item.title }}
                    </router-link>
                </li>
<!--                 
                <li class="menu__item">
                    <a class="menu__link" href="/">
                        <p>Просмотр поставок</p>
                    </a>
                </li>
                <li class="menu__item">
                    <a class="menu__link" href="/">
                        <p>Добавить поставку</p>
                    </a>
                </li> -->
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
        &__item {
            position: relative;
            @include hover {
                color: var(--color-blue);
            }
            &--active {
                .menu__link {
                     &::after {
                        width: 100%;
                    }
                    @include hover {
                        &::after {
                            color: var(--color-blue);
                        }
                    }
                }
            }
        }
    }
</style>

<script setup lang="ts">
    import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const menuItems: Record<string, Array<{path: string, title: string}>> = {
    'deliveries': [{path: '/deliveries/all', title: 'Просмотр поставок'}, {path: '/deliveries/add', title: 'Добавление поставок'}],
    'suppliers': [{path: '/suppliers/all', title: 'Просмотр поставщиков'}, {path: '/suppliers/add', title: 'Добавление поставщика'}],
}


const currentSection = computed(() => {
    return route.meta?.section as string || null
})

const currentItems = computed(() => {
    if (!currentSection.value) return []

    return menuItems[currentSection.value] || []
})

const isActive = (path: string) => {
    return route.path === path || route.path.startsWith(path + '/')
}
</script>