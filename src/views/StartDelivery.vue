<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { useRoute, useRouter } from 'vue-router'
    import FilterSection from '@/components/FilterSection.vue'
    import Menu from '@/components/Menu.vue'

    const route = useRoute()
    const router = useRouter()
    const deliveryID = ref(route.params.id)
    const userStore = useUserStore()

    interface DeliveryList {
        delivery_list_id: number
        delivery_id: number
        supplier_id: number
        amount: number
        article: string
        created_by: number
        updated_by: number
        created_at: string
        updated_at: string
    }

    const deliveryLists = ref<DeliveryList[]>([])
    //const isLoading = ref(false)
    const error = ref<string | null>(null)
    
    const fetchDeliveryLists = async () => {
        error.value = null
        
        try {
            const response = await fetch(`/api/deliveries/${deliveryID.value}/lists`, {
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
            deliveryLists.value = data
            console.log('Получены поставки:', data)
        } catch (err) {
            console.error('Ошибка при загрузке листов поставки:', err)
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
        fetchDeliveryLists()
    })

    const refreshData = () => {
        fetchDeliveryLists()
    }



</script>

<template>
    <main class="content">
        <Menu />

        <FilterSection />
        
        <section class="section container">
            <div class="section__body">
                <button v-if="userStore.isWorker" type="button" class="start__button button" @click="$router.push({ name: 'start-deliveriy-lists' })">
                    Закончить прием
                </button>
                <div class="table-section">
                    <div class="table-section__body">
                        <a href="/" class="table-section__icon">
                            <img class="table-section__refresh" src="/images/icons/refresh.svg" alt="refresh" width="24"
                                height="24" loading="lazy" />
                        </a>
                        <div v-if="error" class="table-section__error">
                            {{ error }}
                        </div>

                        <table v-else-if="deliveryLists.length > 0" class="table-section__content">
                            <thead class="table-section__head">
                                <tr>
                                    <th>Индентификатор листа поставки</th>
                                    <th>Идентификатор поставки</th>
                                    <th>Идентификатор поставщика</th>
                                    <th>Количество</th>
                                    <th>Артикул</th>
                                    <th>ID добавившего сотрудника</th>
                                    <th>ID изменившего сотрудника</th>
                                    <th>Время добавления</th>
                                    <th>Время изменения</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="list in deliveryLists" :key="list.delivery_list_id">
                                    <td>{{ list.delivery_list_id }}</td>
                                    <td>{{ list.delivery_id }}</td>
                                    <td>{{ list.supplier_id }}</td>
                                    <td>{{ list.amount }}</td>
                                    <td>{{ list.article }}</td>
                                    <td>{{ list.created_by }}</td>
                                    <td>{{ list.updated_by }}</td>
                                    <td>{{ formatDate(list.created_at) }}</td>
                                    <td>{{ formatDate(list.updated_at) }}</td>
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
    .start {
        &__button {
            background-color: var(--color-green);
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