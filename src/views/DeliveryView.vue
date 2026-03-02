<script setup lang="ts">
  import FilterSection from '@/components/FilterSection.vue';
import Menu from '@/components/Menu.vue';
</script>

<template>
    <main class="content">
        <Menu />

        <FilterSection />
        
        <section class="section container">
            <div class="section__body">
                <div class="table-section">
                    <div class="table-section__body">
                        <a href="/" class="table-section__icon">
                            <img class="table-section__refresh" src="/images/icons/refresh.svg" alt="refresh" width="24"
                                height="24" loading="lazy" />
                        </a>
                        <table class="table-section__content">
                            <thead class="table-section__head">
                                <tr>
                                    <th>Индентификатор товара</th>
                                    <th>Стоимость</th>
                                    <th>Поставщик</th>
                                    <th>Количество на складе</th>
                                    <th>Сумма</th>
                                    <th>Время добавления</th>
                                    <th>Время изменения</th>
                                </tr>
                            </thead>
                            <tbody class="table-section__body">
                                <tr>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                    <td>1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
        <p>Пагинация</p>
    </main>
</template>
