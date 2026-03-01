<template>
  <section id="contact" class="relative bg-[#1A1A1A] py-16 sm:py-24 overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 opacity-5">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-bordeaux-500 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
    </div>

    <div class="relative max-w-4xl mx-auto px-4 sm:px-6">
      <!-- Header -->
      <div class="text-center mb-10 sm:mb-14">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-4 border border-white/10">
          <UIcon name="i-heroicons-envelope" class="w-4 h-4 text-[#C9A962]" />
          <span class="text-sm font-medium text-white/80">{{ t.contact.title }}</span>
        </div>
        <h2 class="font-serif text-3xl sm:text-4xl font-bold text-white mb-3">
          {{ t.contact.title }}
        </h2>
        <p class="text-white/50 text-base sm:text-lg max-w-2xl mx-auto">
          {{ t.contact.subtitle }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="bg-white/5 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-5 sm:mb-6">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-white/70 mb-1.5">{{ t.contact.name }}</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20 outline-none transition-all text-sm"
              :placeholder="t.contact.name"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-white/70 mb-1.5">{{ t.contact.email }}</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20 outline-none transition-all text-sm"
              :placeholder="t.contact.email"
            />
          </div>
        </div>

        <!-- Subject -->
        <div class="mb-5 sm:mb-6">
          <label class="block text-sm font-medium text-white/70 mb-1.5">{{ t.contact.subject }}</label>
          <select
            v-model="form.subject"
            required
            class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20 outline-none transition-all text-sm"
          >
            <option value="suggestion" class="bg-[#1A1A1A] text-white">{{ t.contact.subjectOptions.suggestion }}</option>
            <option value="question" class="bg-[#1A1A1A] text-white">{{ t.contact.subjectOptions.question }}</option>
            <option value="partnership" class="bg-[#1A1A1A] text-white">{{ t.contact.subjectOptions.partnership }}</option>
            <option value="bug" class="bg-[#1A1A1A] text-white">{{ t.contact.subjectOptions.bug }}</option>
            <option value="other" class="bg-[#1A1A1A] text-white">{{ t.contact.subjectOptions.other }}</option>
          </select>
        </div>

        <!-- Message -->
        <div class="mb-6 sm:mb-8">
          <label class="block text-sm font-medium text-white/70 mb-1.5">{{ t.contact.message }}</label>
          <textarea
            v-model="form.message"
            required
            rows="5"
            class="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20 outline-none transition-all text-sm resize-none"
            :placeholder="t.contact.message"
          ></textarea>
        </div>

        <!-- Captcha -->
        <div class="mb-6 sm:mb-8 flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-shield-check" class="w-5 h-5 text-[#C9A962]" />
            <span class="text-white/70 text-sm font-medium">{{ captchaA }} + {{ captchaB }} = </span>
          </div>
          <input
            v-model="captchaAnswer"
            type="number"
            required
            class="w-20 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-center focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20 outline-none transition-all text-sm"
            placeholder="?"
          />
          <button
            type="button"
            @click="refreshCaptcha"
            class="text-white/40 hover:text-[#C9A962] transition-colors cursor-pointer"
          >
            <UIcon name="i-heroicons-arrow-path" class="w-4 h-4" />
          </button>
          <span v-if="captchaError" class="text-red-400 text-xs">{{ captchaErrorText }}</span>
        </div>

        <!-- Submit -->
        <div class="flex flex-col items-center gap-3">
          <button
            type="submit"
            :disabled="sending"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#722F37] hover:bg-[#5a252c] disabled:bg-[#722F37]/40 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-bordeaux-900/20 cursor-pointer"
          >
            <UIcon v-if="!sending" name="i-heroicons-paper-airplane" class="w-4 h-4" />
            <UIcon v-else name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin" />
            {{ sending ? t.contact.sending : t.contact.send }}
          </button>

          <Transition name="fade">
            <p v-if="status === 'success'" class="text-green-400 text-sm font-medium">
              ✅ {{ t.contact.success }}
            </p>
            <p v-else-if="status === 'error'" class="text-red-400 text-sm font-medium">
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
const captchaA = ref(0)
const captchaB = ref(0)
const captchaAnswer = ref('')
const captchaError = ref(false)
const captchaErrorText = ref('')

const refreshCaptcha = () => {
  captchaA.value = Math.floor(Math.random() * 10) + 1
  captchaB.value = Math.floor(Math.random() * 10) + 1
  captchaAnswer.value = ''
  captchaError.value = false
}

// Init captcha
refreshCaptcha()

const handleSubmit = async () => {
  // Verify captcha
  if (parseInt(captchaAnswer.value) !== captchaA.value + captchaB.value) {
    captchaError.value = true
    captchaErrorText.value = '❌'
    refreshCaptcha()
    return
  }

  sending.value = true
  status.value = 'idle'
  captchaError.value = false

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
    refreshCaptcha()
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

/* Hide number input arrows */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
