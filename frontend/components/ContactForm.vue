<template>
  <section id="contact" class="relative bg-[#FAF9F6] py-16 sm:py-24">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="text-center mb-10 sm:mb-14">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-bordeaux-50 rounded-full mb-4">
          <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-bordeaux-600" />
          <span class="text-sm font-medium text-bordeaux-700">{{ t.contact.title }}</span>
        </div>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {{ t.contact.title }}
        </h2>
        <p class="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto">
          {{ t.contact.subtitle }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t.contact.name }}</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bordeaux-400 focus:ring-2 focus:ring-bordeaux-100 outline-none transition-all text-sm"
              :placeholder="t.contact.name"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t.contact.email }}</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bordeaux-400 focus:ring-2 focus:ring-bordeaux-100 outline-none transition-all text-sm"
              :placeholder="t.contact.email"
            />
          </div>
        </div>

        <!-- Subject -->
        <div class="mb-5 sm:mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t.contact.subject }}</label>
          <select
            v-model="form.subject"
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bordeaux-400 focus:ring-2 focus:ring-bordeaux-100 outline-none transition-all text-sm bg-white"
          >
            <option value="suggestion">{{ t.contact.subjectOptions.suggestion }}</option>
            <option value="question">{{ t.contact.subjectOptions.question }}</option>
            <option value="partnership">{{ t.contact.subjectOptions.partnership }}</option>
            <option value="bug">{{ t.contact.subjectOptions.bug }}</option>
            <option value="other">{{ t.contact.subjectOptions.other }}</option>
          </select>
        </div>

        <!-- Message -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ t.contact.message }}</label>
          <textarea
            v-model="form.message"
            required
            rows="5"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bordeaux-400 focus:ring-2 focus:ring-bordeaux-100 outline-none transition-all text-sm resize-none"
            :placeholder="t.contact.message"
          ></textarea>
        </div>

        <!-- Submit -->
        <div class="flex flex-col items-center gap-3">
          <button
            type="submit"
            :disabled="sending"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-bordeaux-600 hover:bg-bordeaux-700 disabled:bg-bordeaux-300 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            <UIcon v-if="!sending" name="i-heroicons-paper-airplane" class="w-4 h-4" />
            <UIcon v-else name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
            {{ sending ? t.contact.sending : t.contact.send }}
          </button>

          <Transition name="fade">
            <p v-if="status === 'success'" class="text-green-600 text-sm font-medium">
              ✅ {{ t.contact.success }}
            </p>
            <p v-else-if="status === 'error'" class="text-red-500 text-sm font-medium">
              ❌ {{ t.contact.error }}
            </p>
          </Transition>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useTranslations()

const form = reactive({
  name: '',
  email: '',
  subject: 'suggestion',
  message: ''
})

const sending = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')

const handleSubmit = async () => {
  sending.value = true
  status.value = 'idle'

  try {
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBase}/contact`, {
      method: 'POST',
      body: form
    })
    status.value = 'success'
    form.name = ''
    form.email = ''
    form.subject = 'suggestion'
    form.message = ''
  } catch (e) {
    status.value = 'error'
  } finally {
    sending.value = false
    setTimeout(() => { status.value = 'idle' }, 5000)
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
