<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import FilterSection from '@/components/FilterSection.vue'
    import Menu from '@/components/Menu.vue'

    interface Counterparty {
        counterparty_id: number
        full_name: string
        legal_form: string
        inn: string
        kpp: string
        ogrn: string
        legal_address: string
        bank_name: string
        bik: string
        bank_account_number: string
        contact_person: string
        phone: string
        role_id: number
    }

    const counterparties = ref<Counterparty[]>([])
    //const isLoading = ref(false)
    const error = ref<string | null>(null)
    
    const fetchCounterparties = async () => {
        error.value = null
        
        try {
            const response = await fetch('/api/counterparties', {
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
            counterparties.value = data
            console.log('Получены поставщики:', data)
        } catch (err) {
            console.error('Ошибка при загрузке поставщиков:', err)
            error.value = err instanceof Error ? err.message : 'Неизвестная ошибка'
        }
    }

    onMounted(() => {
        fetchCounterparties()
    })

    const refreshData = () => {
        fetchCounterparties()
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

                        <table v-else-if="counterparties.length > 0" class="table-section__content">
                            <thead class="table-section__head">
                                <tr>
                                    <th>Индентификатор поставщика</th>
                                    <th>Полное название</th>
                                    <th>Правовая форма</th>
                                    <th>ИНН</th>
                                    <th>КПП</th>
                                    <th>ОГРН</th>
                                    <th>Юридический адрес</th>
                                    <th>Название банка</th>
                                    <th>БИК</th>
                                    <th>Банковский номер</th>
                                    <th>Контактное лицо</th>
                                    <th>Номер телефона</th>
                                    <th>Идентификатор роли</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="counterparty in counterparties" :key="counterparty.counterparty_id">
                                    <td>{{ counterparty.counterparty_id }}</td>
                                    <td> {{ counterparty.full_name }}</td>
                                    <td>{{ counterparty.legal_form }}</td>
                                    <td>{{ counterparty.inn }}</td>
                                    <td>{{ counterparty.kpp }}</td>
                                    <td>{{ counterparty.ogrn }}</td>
                                    <td>{{ counterparty.legal_address }}</td>
                                    <td>{{ counterparty.bank_name }}</td>
                                    <td>{{ counterparty.bik }}</td>
                                    <td>{{ counterparty.bank_account_number }}</td>
                                    <td>{{ counterparty.contact_person }}</td>
                                    <td>{{ counterparty.phone }}</td>
                                    <td>{{ counterparty.role_id }}</td>
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
