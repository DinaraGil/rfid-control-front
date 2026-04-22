<script setup lang="ts">
import { ref } from 'vue'
import Menu from '@/components/Menu.vue'

const error = ref<string>('')
const loading = ref<boolean>(false)
const success = ref<boolean>(false)
const reportResult = ref<any>(null)

const reportOption = ref('stock')
const dateFrom = ref('2026-04-22')
const dateTo = ref('2026-04-22')

const createReport = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  reportResult.value = null

  try {
    const response = await fetch('/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        report_type: reportOption.value,
        date_from: dateFrom.value,
        date_to: dateTo.value
      })
    })

    if (!response.ok) {
      throw new Error(`Ошибка запроса: ${response.status}`)
    }

    const result = await response.json()
    reportResult.value = result
    success.value = true
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при создании отчета'
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <main class="content">
    <section class="report-section">
      <div class="report-card">
        <div class="report-card__header">
          <h3 class="report-card__subtitle">
            Выберите тип отчета и период
          </h3>
        </div>

        <form class="report-form" @submit.prevent="createReport">
          <div class="report-form__group">
            <label for="report_option" class="report-form__label">
              Вид отчета
            </label>
            <select
              id="report_option"
              name="report_option"
              v-model="reportOption"
              class="report-form__control"
            >
              <option value="stock">По остаткам</option>
              <option value="delivery_errors">Ошибочные поставки</option>
              <option value="deliveries">Все поставки</option>
              <option value="items">Все товары</option>
            </select>
          </div>

          <div class="report-form__row">
            <div class="report-form__group">
              <label for="date_from" class="report-form__label">От</label>
              <input
                type="date"
                id="date_from"
                name="date_from"
                v-model="dateFrom"
                min="2026-01-01"
                max="2026-12-31"
                class="report-form__control"
              />
            </div>

            <div class="report-form__group">
              <label for="date_to" class="report-form__label">До</label>
              <input
                type="date"
                id="date_to"
                name="date_to"
                v-model="dateTo"
                min="2026-01-01"
                max="2026-12-31"
                class="report-form__control"
              />
            </div>
          </div>

          <button
            type="submit"
            class="report-form__button"
            :disabled="loading"
          >
            {{ loading ? 'Загрузка...' : 'Создать отчет' }}
          </button>
        </form>

        <div v-if="error" class="message message--error">
          {{ error }}
        </div>

        <div v-if="success" class="message message--success">
          Отчет успешно создан
        </div>

        <pre v-if="reportResult" class="report-result">{{ reportResult }}</pre>
      </div>
    </section>
  </main>
</template>
<style lang="scss">
.report-section {
  display: flex;
  justify-content: center;
  padding: 32px 16px;
}

.report-card {
  width: 100%;
  max-width: 560px;
  padding: 32px;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.08),
    0 2px 8px rgba(15, 23, 42, 0.06);
  border: 1px solid #eef2f7;

  &__header {
    margin-bottom: 24px;
  }

  &__title {
    margin: 0 0 8px;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.2;
    color: #1f2937;
  }

  &__subtitle {
    margin: 0;
    font-size: 15px;
    color: #6b7280;
  }
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  &__control {
    width: 100%;
    min-height: 46px;
    padding: 0 14px;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    background: #fff;
    font-size: 14px;
    color: #111827;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      background-color 0.2s ease;
    outline: none;

    &:hover {
      border-color: #9ca3af;
    }

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
    }
  }

  &__button {
    min-height: 48px;
    padding: 0 18px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition:
      transform 0.15s ease,
      box-shadow 0.2s ease,
      opacity 0.2s ease;
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.24);

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 12px 24px rgba(37, 99, 235, 0.3);
    }

    &:active:not(:disabled) {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      box-shadow: none;
    }
  }
}

.message {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;

  &--error {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
  }

  &--success {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }
}

.report-result {
  margin-top: 20px;
  padding: 16px;
  border-radius: 14px;
  background: #0f172a;
  color: #e5e7eb;
  font-size: 13px;
  line-height: 1.5;
  overflow-x: auto;
}

@media (max-width: 640px) {
  .report-card {
    padding: 20px;
    border-radius: 16px;

    &__title {
      font-size: 24px;
    }
  }

  .report-form {
    &__row {
      grid-template-columns: 1fr;
    }
  }
}
</style>