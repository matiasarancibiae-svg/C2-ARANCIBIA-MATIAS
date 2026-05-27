<script setup lang="ts">
defineProps<{ mensaje: string }>()
</script>

<template>
    <div class="rounded-3xl border border-dashed border-course-line bg-course-surface-soft px-6 py-12 text-center">
        <p class="text-sm font-medium text-course-text-muted">
            {{ mensaje }}.
        </p>
    </div>
</template>