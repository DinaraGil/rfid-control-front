<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import FilterSection from '@/components/FilterSection.vue'
    import Menu from '@/components/Menu.vue'

    const router = useRouter();

    interface Delivery {
        delivery_id: number
        status: string
        planned_arrival_at: string
        accepted_at: string | null
        created_by: number
        accepted_by: number | null
        created_at: string
        updated_at: string
    }

    const deliveries = ref<Delivery[]>([])
    //const isLoading = ref(false)
    const error = ref<string | null>(null)
    
    const fetchDeliveries = async () => {
        error.value = null
        
        try {
            const response = await fetch('/api/deliveries', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Добавляем токен авторизации, если нужно
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
        
            if (!response.ok) {
                throw new Error(`Ошибка: ${response.status}`)
            }
            
            const data = await response.json()
            deliveries.value = data
            console.log('Получены поставки:', data)
        } catch (err) {
            console.error('Ошибка при загрузке поставок:', err)
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
    const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
        'NEW': 'Новая',
        'IN_PROGRESS': 'В процессе',
        'IN-PROGRESS': 'В процессе',
        'COMPLETED': 'Завершена',
        'CANCELLED': 'Отменена'
    }
    return statusMap[status] || status
}

// Получение цвета для статуса
const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
        'NEW': 'status--new',
        'IN_PROGRESS': 'status--progress',
        'IN-PROGRESS': 'status--progress',
        'COMPLETED': 'status--completed',
        'CANCELLED': 'status--cancelled'
    }
    return colorMap[status] || 'status--default'
}

    onMounted(() => {
        fetchDeliveries()
    })

    const refreshData = () => {
        fetchDeliveries()
    }

    const rowClicked = (delivery_id: number) => {
        router.push({ 
            name: 'deliveriy-lists', 
            params: { id: delivery_id } 
        })
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

                        <table v-else-if="deliveries.length > 0" class="table-section__content">
                            <thead class="table-section__head">
                                <tr>
                                    <th>Индентификатор поставки</th>
                                    <th>Статус</th>
                                    <th>Планируемое время поставки</th>
                                    <th>Время принятия поставки</th>
                                    <th>Создано (id сотрудника)</th>
                                    <th>Принято (id сотрудника)</th>
                                    <th>Время добавления</th>
                                    <th>Время изменения</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="delivery in deliveries" :key="delivery.delivery_id" @click="rowClicked(delivery.delivery_id)" class="table-section--active">
                                    <td>{{ delivery.delivery_id }}</td>
                                    <td>
                                        <span :class="['status', getStatusColor(delivery.status)]">
                                            {{ getStatusText(delivery.status) }}
                                        </span>
                                    </td>
                                    <td>{{ formatDate(delivery.planned_arrival_at) }}</td>
                                    <td>{{ formatDate(delivery.accepted_at) }}</td>
                                    <td>{{ delivery.created_by }}</td>
                                    <td>{{ delivery.accepted_by || '—' }}</td>
                                    <td>{{ formatDate(delivery.created_at) }}</td>
                                    <td>{{ formatDate(delivery.updated_at) }}</td>
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
        
        &--cancelled {
            background-color: #ffebee;
            color: #c62828;
        }
        
        &--default {
            background-color: #f5f5f5;
            color: #616161;
        }
    }
</style>