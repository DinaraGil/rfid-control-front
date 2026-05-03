<script setup lang="ts">
import { ref } from 'vue'
import Menu from '@/components/Menu.vue'

const fileInput = ref<HTMLInputElement | null>(null)
const error = ref<string>('')
const loading = ref<boolean>(false)
const success = ref<boolean>(false)
const uploadedLists = ref<any[]>([])

const uploadFile = async () => {
  if (!fileInput.value?.files?.length) {
    error.value = 'Пожалуйста, выберите файл'
    return
  }

  const file = fileInput.value.files[0]
  const formData = new FormData()
  formData.append('file', file)

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const response = await fetch('/api/shipment_lists/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`)
    }

    const result = await response.json()

    uploadedLists.value = result
    success.value = true

    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="content">
    <Menu />

    <section class="section container">
      <div class="append">
        <div class="append__content">

          <form class="append__form" @submit.prevent="uploadFile">
            <label>Выберите файл (.csv):</label>

            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              :disabled="loading"
            />

            <button
              type="submit"
              class="append__button button"
              :disabled="loading"
            >
              {{ loading ? 'Загрузка...' : 'Загрузить' }}
            </button>
          </form>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            Файл загружен. Добавлено записей: {{ uploadedLists.length }}
          </div>

          <table v-if="uploadedLists.length" class="result-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Shipment</th>
                <th>Customer</th>
                <th>Supplier</th>
                <th>Expected</th>
                <th>Article</th>
                <th>created_by</th>
                <th>updated_by</th>
                <th>created_at</th>
                <th>updated_at</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in uploadedLists" :key="item.shipment_list_id">
                <td>{{ item.shipment_list_id }}</td>
                <td>{{ item.shipment_id }}</td>
                <td>{{ item.customer_id }}</td>
                <td>{{ item.supplier_id }}</td>
                <td>{{ item.expected_amount }}</td>
                <td>{{ item.article }}</td>
                <td>{{ item.created_by }}</td>
                <td>{{ item.updated_by }}</td>
                <td>{{ item.created_at }}</td>
                <td>{{ item.updated_at }}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
.append {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border: 1px solid #ccc;
    padding: 24px;
    border-radius: 8px;
  }

  &__button {
    margin-top: 10px;
  }
}

.error-message {
  color: red;
  margin-top: 10px;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.result-table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;

  th, td {
    border: 1px solid #ccc;
    padding: 6px;
  }
}
</style>