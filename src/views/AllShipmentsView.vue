<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FilterSection from '@/components/FilterSection.vue'
import Menu from '@/components/Menu.vue'

const router = useRouter()

interface Shipment {
    shipment_id: number
    status: string
    completed_at: string | null
    created_by: number
    completed_by: number | null
    created_at: string
    updated_at: string
}

const shipments = ref<Shipment[]>([])
const error = ref<string | null>(null)

const fetchShipments = async () => {
    error.value = null

    try {
        const response = await fetch('/api/shipments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`)
        }

        const data = await response.json()
        shipments.value = data

        console.log('Получены отгрузки:', data)
    } catch (err) {
        console.error('Ошибка при загрузке отгрузок:', err)
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
    const map: Record<string, string> = {
        'NEW': 'Новая',
        'IN_PROGRESS': 'В процессе',
        'COMPLETED': 'Завершена',
        'ERROR': 'Ошибка'
    }
    return map[status] || status
}

const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
        'NEW': 'status--new',
        'IN_PROGRESS': 'status--progress',
        'COMPLETED': 'status--completed',
        'ERROR': 'status--error'
    }
    return map[status] || 'status--default'
}

onMounted(() => {
    fetchShipments()
})

const refreshData = () => {
    fetchShipments()
}

const rowClicked = (shipment_id: number) => {
    router.push({
        name: 'start-shipment-lists',
        params: { id: shipment_id }
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

                        <!-- refresh -->
                        <button class="table-section__icon" @click="refreshData">
                            <img
                                class="table-section__refresh"
                                src="/images/icons/refresh.svg"
                                alt="refresh"
                                width="24"
                                height="24"
                            />
                        </button>

                        <div v-if="error" class="table-section__error">
                            {{ error }}
                        </div>

                        <table v-else-if="shipments.length > 0" class="table-section__content">
                            <thead class="table-section__head">
                                <tr>
                                    <th>ID отгрузки</th>
                                    <th>Статус</th>
                                    <th>Дата завершения</th>
                                    <th>Создано (worker)</th>
                                    <th>Завершено (worker)</th>
                                    <th>Создано</th>
                                    <th>Обновлено</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="shipment in shipments"
                                    :key="shipment.shipment_id"
                                    @click="rowClicked(shipment.shipment_id)"
                                    class="table-section--active"
                                >
                                    <td>{{ shipment.shipment_id }}</td>

                                    <td>
                                        <span :class="['status', getStatusColor(shipment.status)]">
                                            {{ getStatusText(shipment.status) }}
                                        </span>
                                    </td>

                                    <td>{{ formatDate(shipment.completed_at) }}</td>
                                    <td>{{ shipment.created_by }}</td>
                                    <td>{{ shipment.completed_by || '—' }}</td>
                                    <td>{{ formatDate(shipment.created_at) }}</td>
                                    <td>{{ formatDate(shipment.updated_at) }}</td>
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