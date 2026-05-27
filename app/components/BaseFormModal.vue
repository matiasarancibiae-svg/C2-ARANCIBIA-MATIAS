<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

defineProps<{
    title: string
    description?: string
}>()
</script>

<template>
    <UModal v-model:open="open" :title="title" :description="description" :ui="{
        content: 'bg-course-surface',
        header: 'bg-course-surface',
        title: 'text-gray-800',
        description: 'text-course-text-muted',
        body: 'bg-course-surface',
        footer: 'bg-course-surface'
    }">
        <template #body>
            <slot />
        </template>
    </UModal>
</template>
