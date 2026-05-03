<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
    import { useUserStore } from '@/stores/user'
    import { useRoute, useRouter } from 'vue-router'
    import FilterSection from '@/components/FilterSection.vue'
    import Menu from '@/components/Menu.vue'

    const route = useRoute()
    const router = useRouter()
    const deliveryID = ref(route.params.id)
    const userStore = useUserStore()
    const socket = ref<WebSocket | null>(null)
    const isScanning = ref(false)
    const scannerId = ref('')
    const scannerError = ref<string | null>(null)

    interface DeliveryList {
        delivery_list_id: number
        delivery_id: number
        supplier_id: number
        expected_amount: number
        real_amount: number
        article: string
        scanned?: boolean
        created_by: number
        updated_by: number
        created_at: string
        updated_at: string
        status: string
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

    onBeforeUnmount(() => {
      socket.value?.close()
    })

    const refreshData = () => {
        fetchDeliveryLists()
    }

const handleScanEvent = (data: any) => {
  const updated = data
  const item = deliveryLists.value.find(l => l.article === updated.article)
  if (!item) return 

  item.scanned = true
  item.real_amount = updated.real_amount
  item.updated_at = updated.updated_at
  item.updated_by = updated.updated_by
  item.status = updated.status

  setTimeout(() => {
    item.scanned = false
  }, 800)
}

const connectSocket = () => {
  scannerError.value = null

  const trimmedScannerId = scannerId.value.trim()

  if (!trimmedScannerId) {
    scannerError.value = 'Введите номер сканнера'
    return
  }

  if (!/^\d+$/.test(trimmedScannerId)) {
    scannerError.value = 'Номер сканнера должен быть числом'
    return
  }

  const wsUrl = `ws://localhost:8080/ws/delivery/${deliveryID.value}/scanners/${encodeURIComponent(trimmedScannerId)}`

  socket.value = new WebSocket(wsUrl)

  socket.value.onopen = () => {
    console.log('WS connected')
    isScanning.value = true
  }

  socket.value.onmessage = (event) => {
  const data = JSON.parse(event.data)

  if (data.error) {
    scannerError.value = data.error
    return
  }

  scannerError.value = null

  handleScanEvent(data)
}

  socket.value.onclose = () => {
    console.log('WS closed')
    socket.value = null
    isScanning.value = false
    completeDelivery()
  }

  socket.value.onerror = () => {
    scannerError.value = 'Ошибка подключения к WebSocket'
  }
}

const completeDelivery = async () => {
  try {
    const response = await fetch(`/api/deliveries/${deliveryID.value}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Ошибка завершения поставки')
    }

    console.log('Поставка завершена')
  } catch (err) {
    console.error(err)
  }
}

const finishScan = async () => {
  socket.value?.close()
  await completeDelivery()
}

const getRowClass = (status: string, scanned?: boolean) => {
  return {
    'row--not-enough': status?.toLowerCase() === 'not_enough',
    'row--completed': status?.toLowerCase() === 'completed',
    'row--overmuch': status?.toLowerCase() === 'overmuch',
    'row--scanned': !!scanned
  }
}

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    'NEW': 'Новая',
    'NOT_ENOUGH': 'Недостаток',
    'COMPLETED': 'Завершена',
    'OVERMUCH': 'Излишек'
  }

  return map[status] || status
}

</script>

<template>
  <main class="content">
    <Menu />

    <h3 style="padding-inline: var(--base-padding);">Поставка {{ deliveryID }}</h3>

    <FilterSection />

    <section class="section container">
      <div class="section__body">
        <div v-if="userStore.isWorker" class="scanner-form">
          <label for="scanner">Номер сканнера:</label>
          <input
            id="scanner"
            v-model="scannerId"
            type="text"
            name="scanner"
            placeholder="1"
            required
            :disabled="isScanning"
          />

          <button @click="connectSocket" v-if="!isScanning">
            Начать прием
          </button>

          <button @click="finishScan" v-else>
            Завершить прием
          </button>

          <div v-if="scannerError" class="table-section__error">
            {{ scannerError }}
          </div>
        </div>

        <div class="table-section">
          <div class="table-section__body">
            <button type="button" class="table-section__icon" @click="refreshData">
              <img
                class="table-section__refresh"
                src="/images/icons/refresh.svg"
                alt="refresh"
                width="24"
                height="24"
                loading="lazy"
              />
            </button>

            <div v-if="error" class="table-section__error">
              {{ error }}
            </div>

            <table v-else-if="deliveryLists.length > 0" class="table-section__content">
              <thead class="table-section__head">
                <tr>
                  <th>Индентификатор листа поставки</th>
                  <th>Идентификатор поставки</th>
                  <th>Идентификатор поставщика</th>
                  <th>Ожидаемое количество</th>
                  <th>Полученное количество</th>
                  <th>Артикул</th>
                  <th>ID добавившего сотрудника</th>
                  <th>ID изменившего сотрудника</th>
                  <th>Статус</th>
                  <th>Время добавления</th>
                  <th>Время изменения</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="list in deliveryLists"
                  :key="list.delivery_list_id"
                  :class="getRowClass(list.status, list.scanned)"
                >
                  <td>{{ list.delivery_list_id }}</td>
                  <td>{{ list.delivery_id }}</td>
                  <td>{{ list.supplier_id }}</td>
                  <td>{{ list.expected_amount }}</td>
                  <td>{{ list.real_amount }}</td>
                  <td>{{ list.article }}</td>
                  <td>{{ list.created_by }}</td>
                  <td>{{ list.updated_by }}</td>
                  <td>{{ translateStatus(list.status) }}</td>
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
.row--not-enough {
  background-color: #fff3cd;
}

.row--completed {
  background-color: #d4edda;
}

.row--overmuch {
  background-color: #f8d7da;
}

.row--scanned {
  animation: flashOutline 0.8s ease;
}

@keyframes flashOutline {
  0% {
    box-shadow: inset 0 0 0 9999px rgba(255, 245, 157, 0.9);
  }
  100% {
    box-shadow: inset 0 0 0 9999px rgba(255, 245, 157, 0);
  }
}

.breadcrumbs {
  margin-bottom: 20px;

  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  &__link {
    color: #1976d2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &__current {
    color: #616161;
    font-weight: 500;
  }

  &__separator {
    color: #9e9e9e;
  }
}

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