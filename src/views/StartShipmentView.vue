<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import FilterSection from '@/components/FilterSection.vue'
import Menu from '@/components/Menu.vue'
import StockComponent from '@/components/StockComponent.vue'

const route = useRoute()
const shipmentID = ref(route.params.id)
const userStore = useUserStore()

const socket = ref<WebSocket | null>(null)
const isScanning = ref(false)
const scannerId = ref('')
const scannerError = ref<string | null>(null)

interface ShipmentList {
  shipment_list_id: number
  shipment_id: number
  customer_id: number
  supplier_id: number
  expected_amount: number
  real_amount: number
  article: string
  status: string
  created_by: number
  updated_by: number
  created_at: string
  updated_at: string
  scanned?: boolean
}

const shipmentLists = ref<ShipmentList[]>([])
const error = ref<string | null>(null)

const fetchShipmentLists = async () => {
  error.value = null

  try {
    const response = await fetch(`/api/shipments/${shipmentID.value}/lists`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`)
    }

    const data = await response.json()
    shipmentLists.value = data
  } catch (err) {
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
  fetchShipmentLists()
})

onBeforeUnmount(() => {
  socket.value?.close()
})

const refreshData = () => {
  fetchShipmentLists()
}

const handleScanEvent = (data: any) => {
  const updated = data
  const item = shipmentLists.value.find(l => l.article === updated.article)
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

  const wsUrl = `ws://localhost:8080/ws/shipment/${shipmentID.value}/scanners/${encodeURIComponent(trimmedScannerId)}`

  socket.value = new WebSocket(wsUrl)

  socket.value.onopen = () => {
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
    socket.value = null
    isScanning.value = false
  }

  socket.value.onerror = () => {
    scannerError.value = 'Ошибка подключения к WebSocket'
  }
}

const completeShipment = async () => {
  try {
    const response = await fetch(`/api/shipments/${shipmentID.value}/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Ошибка завершения отгрузки')
    }
  } catch (err) {
    console.error(err)
  }
}

const finishScan = async () => {
  socket.value?.close()
  await completeShipment()
}

const getRowClass = (status: string, scanned?: boolean) => {
  return {
    'row--completed': status?.toLowerCase() === 'completed',
    'row--in-progress': status?.toLowerCase() === 'not_enough',
    'row--over-shipped': status?.toLowerCase() === 'over_shipped',
    'row--scanned': !!scanned
  }
}

const translateStatus = (status: string) => {
  const map: Record<string, string> = {
    'NEW': 'Новая',
    'NOT_ENOUGH': 'Недостаток',
    'COMPLETED': 'Завершена',
    'OVER_SHIPPED': 'Излишек'
  }
  return map[status] || status
}
</script>

<template>
  <main class="content">
    <Menu />

    <h3 style="padding-inline: var(--base-padding);">
      Отгрузка {{ shipmentID }}
    </h3>

    <StockComponent />

    <FilterSection />

    <section class="section container">
      <div class="section__body">

        <div v-if="userStore.isWorker" class="scanner-form">
          <label>Номер сканнера:</label>

          <input v-model="scannerId" type="text" :disabled="isScanning" />

          <button v-if="!isScanning" @click="connectSocket">
            Начать отгрузку
          </button>

          <button v-else @click="finishScan">
            Завершить отгрузку
          </button>

          <div v-if="scannerError" class="table-section__error">
            {{ scannerError }}
          </div>
        </div>

        <div class="table-section">
          <div class="table-section__body">

            <button class="table-section__icon" @click="refreshData">
              <img src="/images/icons/refresh.svg" width="24" />
            </button>

            <div v-if="error" class="table-section__error">
              {{ error }}
            </div>

            <table v-else-if="shipmentLists.length" class="table-section__content">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Shipment</th>
                  <th>Customer</th>
                  <th>Expected</th>
                  <th>Real</th>
                  <th>Article</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="item in shipmentLists"
                  :key="item.shipment_list_id"
                  :class="getRowClass(item.status, item.scanned)"
                >
                  <td>{{ item.shipment_list_id }}</td>
                  <td>{{ item.shipment_id }}</td>
                  <td>{{ item.customer_id }}</td>
                  <td>{{ item.expected_amount }}</td>
                  <td>{{ item.real_amount }}</td>
                  <td>{{ item.article }}</td>
                  <td>{{ translateStatus(item.status) }}</td>
                  <td>{{ formatDate(item.created_at) }}</td>
                  <td>{{ formatDate(item.updated_at) }}</td>
                </tr>
              </tbody>
            </table>

            <div v-else class="table-section__empty">
              Нет данных
            </div>

          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<style lang="scss">
.row--completed { background: #d4edda; }
.row--in-progress { background: #fff3cd; }
.row--over-shipped { background: #f8d7da; }

.row--scanned {
  animation: flash 0.8s ease;
}

@keyframes flash {
  0% { box-shadow: inset 0 0 0 999px rgba(255,255,0,0.4); }
  100% { box-shadow: none; }
}

.table-section__error {
  background: #fdecea;
  color: #b71c1c;
  border: 1px solid #f5c6cb;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 14px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>