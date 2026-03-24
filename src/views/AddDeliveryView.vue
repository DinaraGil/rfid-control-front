<script setup lang="ts">
import { ref } from 'vue';
import Menu from '@/components/Menu.vue';

const fileInput = ref<HTMLInputElement | null>(null);
const error = ref<string>('');
const loading = ref<boolean>(false);
  const success = ref<boolean>(false);
const uploadedLists = ref<any[]>([]);

const uploadFile = async () => {
  if (!fileInput.value?.files?.length) {
    error.value = 'Пожалуйста, выберите файл';
    return;
  }

  const file = fileInput.value.files[0];
  const formData = new FormData();
  formData.append('file', file);

  loading.value = true;
  error.value = '';
  success.value = false;

  try {
    const response = await fetch('/api/delivery_lists/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const result = await response.json();

    uploadedLists.value = result;
    success.value = true;

    if (fileInput.value) {
      fileInput.value.value = '';
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Произошла ошибка при загрузке';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="content">
    <Menu />
    
    <section class="section container">
      <div class="append">
      <div class="append__content">
        <form class="append__form" @submit.prevent="uploadFile">
          <label for="fileInput">Выберите файл (.csv):</label>
          <input 
            id="fileInput" 
            ref="fileInput"
            type="file" 
            accept=".csv"
            :disabled="loading"
          >
          <button 
            type="submit" 
            class="append__button button"
            :disabled="loading"
          >
            {{ loading ? 'Загрузка...' : 'Загрузить' }}
          </button>
        </form>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">
  Файл успешно загружен. Добавлено записей: {{ uploadedLists.length }}
</div>

<table v-if="uploadedLists.length" class="result-table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Delivery</th>
      <th>Supplier</th>
      <th>Amount</th>
      <th>Article</th>
      <th>created_by</th>
      <th>updated_by</th>
      <th>created_at</th>
      <th>updated_at</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in uploadedLists" :key="item.id">
      <td>{{ item.delivery_list_id }}</td>
      <td>{{ item.delivery_id }}</td>
      <td>{{ item.supplier_id }}</td>
      <td>{{ item.amount }}</td>
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
  row-gap: var(--padding-medium);
  align-items: center;

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--text-gap-large);
    border: 1px solid var(--color-grey);
    border-radius: var(--border-radius-small);
    padding: 24px;
  }

  &__button {
    margin: var(--padding-medium);
    align-self: center;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.success-message {
  color: green;
  margin-top: 10px;
  text-align: center;
}

.result-table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;

  th, td {
    border: 1px solid #ccc;
    padding: 6px 10px;
  }
}

</style>