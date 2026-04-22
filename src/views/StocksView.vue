<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import FilterSection from '@/components/FilterSection.vue'
    import Menu from '@/components/Menu.vue'

    const router = useRouter();

    interface Stock {
        article: string,
        quantity: number,
        updated_at: string
    }

    const stocks = ref<Stock[]>([])
    //const isLoading = ref(false)
    const error = ref<string | null>(null)
    
    const fetchStocks = async () => {
        error.value = null
        
        try {
            const response = await fetch('/api/stocks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`)
            }
            
            const data = await response.json()
            stocks.value = data
            console.log('Получены остатки:', data)
        } catch (err) {
            console.error('Ошибка при загрузке остатков:', err)
            error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
        }
    }
    
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '—'
            return new Date(dateString).toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
    }

    onMounted(() => {
        fetchStocks()
    })

    const refreshData = () => {
        fetchStocks()
    }
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
                        <div v-if="error" class="table-section__error">
                            {{ error }}
                        </div>

                        <table v-else-if="stocks.length > 0" class="table-section__content">
                            <thead class="table-section__head">
                                <tr>
                                    <th>Артикул</th>
                                    <th>Количество</th>
                                    <th>Время изменения</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stock in stocks" :key="stock.article" class="table-section--active">
                                    <td>{{ stock.article }}</td>
                                    <td>{{ stock.quantity }}</td>
                                    <td>{{ formatDate(stock.updated_at) }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="table-section__empty">
                            Нет данных для отображения
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <p>Пагинация</p>
    </main>
</template>

<style lang="scss">
.table {
    &-section {
        &--active {
            @include hover {
                background-color: blue;
                cursor: pointer;
            } 
        }
    }
}
    .status {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        
        &--new {
            background-color: #e3f2fd;
            color: #1976d2;
        }
        
        &--progress {
            background-color: #fff3e0;
            color: #f57c00;
        }
        
        &--completed {
            background-color: #e8f5e8;
            color: #2e7d32;
        }
        
        &--error {
            background-color: #ffebee;
            color: #c62828;
        }
        
        &--default {
            background-color: #f5f5f5;
            color: #616161;
        }
    }
</style>