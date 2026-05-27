<script setup lang="ts">
const route = useRoute()

const isActive = (to: String) => route.path === to

const navigationItems = [
    { label: 'Inicio', to: '/' },
    { label: 'Eventos', to: '/eventos' },
    { label: 'Administración', to: '/administracion' },
]
</script>

<template>
    
    <div class="min-h-screen bg-linear-to-br from-indigo-100 via-indigo-200 to-indigo-100">
        <!-- Nav -->
        <header class="border-b border-course-line/80 bg-course-surface/85 backdrop-blur shadow">
            <div
                class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                <div>
                    <p class="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-400">Smart Events</p>
                    <h1 class="text-lg font-semibold text-course-text">Eventos</h1>
                </div>

                <nav class="flex flex-wrap gap-2">
                    <!-- Links -->
                    <NuxtLink v-for="item in navigationItems" :key="item.to" :to="item.to"
                        class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
                        :class="isActive(item.to) ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-transparent bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700'">
                        {{ item.label }}
                    </NuxtLink>
                </nav>
            </div>
        </header>

        <!-- Contenido páginas -->
        <main class="p-4 sm:px-6 lg:px-6">
            <slot />
        </main>
    </div>

</template>