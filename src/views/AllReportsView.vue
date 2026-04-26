<script setup lang="ts">
import Menu from '@/components/Menu.vue'
import { ref, onMounted } from 'vue'

interface Report {
  report_id: number
  report_type: string
  file_name: string
  link: string
  date_from: string
  date_to: string
  created_at: string
}

const reports = ref<Report[]>([])

const fetchReports = async () => {
  const response = await fetch('/api/reports', {
    method: 'GET'
  })

  if (!response.ok) {
    throw new Error(`Ошибка загрузки отчетов: ${response.status}`)
  }

  reports.value = await response.json()
}

onMounted(() => {
  fetchReports()
})

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>
    <template>
    <main class="content">
        <Menu />
        <section class="reports-list section">
            <h3 class="reports-list__title">Мои отчеты</h3>

            <div v-if="reports.length === 0" class="reports-list__empty">
                Отчетов пока нет
            </div>

            <div
                v-for="report in reports"
                :key="report.report_id"
                class="reports-list__item"
            >
                <div class="reports-list__info">
                <a
                    :href="report.link"
                    target="_blank"
                    class="reports-list__file"
                >
                    📄 {{ report.file_name }}
                </a>

                <div class="reports-list__meta">
                    {{ report.report_type }} · from: {{ formatDate(report.date_from) }} — to: {{ formatDate(report.date_to) }}
                </div>

                <div class="reports-list__time">
                🕒 {{ formatDateTime(report.created_at) }}
                </div>

                </div>

                <a
                :href="report.link"
                target="_blank"
                class="reports-list__download"
                >
                скачать
                </a>
            </div>
    </section>
  </main>
</template>
<style lang="scss">
.reports-list {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid #e5e7eb;

  &__time {
    margin-top: 2px;
    font-size: 12px;
    color: #9ca3af;
  }
  
  &__title {
    margin: 0 0 14px;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
  }

  &__empty {
    font-size: 14px;
    color: #6b7280;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  &__file {
    color: #111827;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: #2563eb;
      text-decoration: underline;
    }
  }

  &__meta {
    margin-top: 4px;
    font-size: 12px;
    color: #6b7280;
  }

  &__download {
    flex-shrink: 0;
    color: #2563eb;
    font-size: 13px;
    text-decoration: underline;
  }
}
</style>