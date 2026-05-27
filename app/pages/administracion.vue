<script setup lang="ts">
import type { Evento } from '~/types/evento'
const { data: eventos, pending, error, refresh } = await useFetch<Evento[]>('/api/eventos')

const eliminarEvento = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este evento y todas sus inscripciones?')) {
        await $fetch(`/api/eventos/${id}`, { method: 'DELETE' } as any)
        await refreshNuxtData('eventos') 
    }
}

const limpiarInscritos = async (eventoId: number) => {
    await $fetch(`/api/eventos/${eventoId}/limpiar`, { method: 'PATCH' } as any)
    await refreshNuxtData('eventos') // Importante para que el contador cambie visualmente
}

const irAUsuarios = (id: number) => {
  navigateTo(`/usuarios/${id}`) 
}


// Funciones para el formulario.
const eventoModalOpen = ref(false)
const nuevoEvento = ref({
    titulo: '',
    lugar: '',
    fecha: '',
    hora: '',
    valor: 0,
    topePersonas: 0,
    imagenURL: ''
})

const crearEvento = async () => {
    try {
        await $fetch('/api/eventos', {
            method: 'POST',
            body: nuevoEvento.value
        })
        eventoModalOpen.value = false
        // Limpiar formulario tras éxito
        nuevoEvento.value = { titulo: '', lugar: '', fecha: '', hora: '', valor: 0, topePersonas: 0, imagenURL: '' }
        await refreshNuxtData('eventos')
    } catch (e) {
        console.error("Error al crear:", e)
    }
}

const route = useRoute()
const { data: evento } = await useFetch(`/api/eventos/${route.params.id}`)



// Borrar todos los usuarios de un evento
// 1. Traes todos los usuarios de la base de datos (una sola petición)
const { data: usuarios } = await useFetch('/api/usuarios')

// 2. Definimos el ID del evento que queremos mostrar
const idEventoActual = 1 // Esto vendría de tu ruta o props

// 3. Filtramos manualmente
const usuariosDelEvento = computed(() => {
  if (!usuarios.value) return []
  // Filtramos por el campo que los vincula
  return usuarios.value.filter(u => u.eventos.some(e => e.id === idEventoActual))
})

</script>


<template>
    <div class="mx-auto max-w space-y-6">

        <div class="rounded-xl border border-indigo-200 bg-course-surface p-6 shadow-lg backdrop-blur sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-2">
                    <p class="text-sm font-semibold uppercase tracking-widest text-indigo-400">
                        Administración
                    </p>
                    <h1 class="text-2xl font-bold tracking-tight text-course-text sm:text-3xl">Panel Administrativo</h1>
                    <p class="max-w-2xl text-sm leading-6 text-course-text-soft">
                        Aquí podrás gestionar eventos y usuarios. Puedes Publicar, modificar o eliminar eventos. Tambien, lo mismo para los usuarios que están inscritos
                        en dicho evento.
                    </p>
                </div>

                <UButton icon="i-heroicons-arrow-path" color="secondary" variant="soft" :loading="pending"
                    @click="() => refresh()" class="self-start rounded-full px-5 text-indigo-800 shadow-sm">
                    Actualizar
                </UButton>
            </div>
        </div>
        

        <!-- Apartado para poder crear un evento -->
        <UButton @click="eventoModalOpen = true" icon="i-heroicons-plus" color="secondary">
            Agregar Nuevo Evento
        </UButton>

        
        <BaseFormModal 
        :open="eventoModalOpen" 
        @update:open="(val) => { eventoModalOpen = val }"
        title="Crear Nuevo Evento"
        description="Ingresa los detalles del nuevo evento para publicarlo en la plataforma."
    >
        <form class="space-y-4" @submit.prevent="crearEvento">
            
            <UFormField label="Título del Evento" name="titulo">
                <UInput v-model="nuevoEvento.titulo" required placeholder="Ej: Workshop de Vue" />
            </UFormField>

            <div class="grid grid-cols-2 gap-4">
                <UFormField label="Lugar" name="lugar">
                    <UInput v-model="nuevoEvento.lugar" placeholder="Ej: Auditorio Central" />
                </UFormField>
                
                <UFormField label="Fecha del Evento" name="fecha">
                    <UInput 
                        v-model="nuevoEvento.fecha" 
                        placeholder="Ej: 25 de mayo, 2026" 
                        class="w-full"
                    />
                </UFormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <UFormField label="Precio" name="valor">
                    <UInput v-model.number="nuevoEvento.valor" type="number" placeholder="0" />
                </UFormField>
                <UFormField label="Cupos Máximos" name="topePersonas">
                    <UInput v-model.number="nuevoEvento.topePersonas" type="number" placeholder="50" required />
                </UFormField>
            </div>

            <!-- Para insertar una imagen desde la carpeta public -->

            <UFormField label="Nombre de la imagen" name="imagenURL">
                 <UInput 
                v-model="nuevoEvento.imagenURL" 
                placeholder="Ej: evento-verano.jpg" 
            />
                <template #help>
                    <span class="text-xs text-gray-400">
                        Asegúrate de que la imagen esté en la carpeta /public/images/
                    </span>
                </template>
            </UFormField>




            <div class="flex justify-end gap-3 pt-2">
                <UButton type="button" color="neutral" variant="subtle" @click="eventoModalOpen = false">
                    Cancelar
                </UButton>
                <UButton type="submit" color="secondary" icon="i-heroicons-check">
                    Confirmar Inscripción
                </UButton>
            </div>
        </form>
    </BaseFormModal>



        <!-- Actualizar eventos -->
        <div v-if="pending" class="flex flex-col max-w mx-auto py-6 space-y-4 rounded-xl border-indigo-200 bg-course-surface justify-center text-center text-3xl font-bold text-gray-500"">
            Cargando la lista de eventos...
        </div>
        <!-- Si no existen eventos -->
         <div v-else-if="!eventos || eventos.length === 0">
            <div class="flex flex-col max-w mx-auto py-6 space-y-4 rounded-xl border-indigo-200 bg-course-surface justify-center text-center text-3xl font-bold text-gray-500">
                No existen eventos publicados.
            </div> 
        </div>


        <div class="flex flex-col gap-2">
            <div v-for="evento in (eventos as any)" :key="evento.id" class="p-4 border rounded-xl shadow-sm flex justify-between items-center bg-white">
            
                <h3 class="font-bold">{{ evento.titulo }}</h3>
                <h1>Usuarios registrados: {{ evento._count.usuarios }} / {{ evento.topePersonas }}</h1>
                
                
                <div class="flex gap-8">
                    
                    <!-- <button @click="eliminarEvento(evento.id)" class="text-red-600 hover:text-red-800">Eliminar Evento</button> -->
                    <button @click="irAUsuarios(evento.id)" class="text-blue-600 hover:text-blue-800">Ver Usuarios</button>
                </div>
            </div>
        </div>
    </div>

</template>