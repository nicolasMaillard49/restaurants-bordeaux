<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-50 dark:via-white dark:to-blue-50">
    <NuxtPage />
  </div>
</template>

<style>
html, body {
  background: linear-gradient(to bottom right, #f8fafc, #ffffff, #eff6ff) !important;
}

html.dark, html.dark body {
  background: linear-gradient(to bottom right, #f8fafc, #ffffff, #eff6ff) !important;
}
</style>
