<script setup lang="ts">
import type { Evento } from '~/types/evento'
import type { Usuario } from '~/types/usuario'

const { data: eventos, pending, error, refresh } = await useFetch<Evento[]>('/api/eventos')

// Guarda el evento que el usuario seleccionó para inscribirse
const eventoSeleccionado = ref<Evento | null>(null)



// Configuración para las cajas de texto (UInput)
const miInputUi = {
  background: 'bg-white text-gray-900',
  border: {
    base: 'ring-1 ring-gray-300 focus:ring-2 focus:ring-primary-500'
  }
}

// Datos del formulario de inscripción
const formInscripcion = reactive({
    nombreUsuario: '',
    correoElectronico: '',
    rutUsuario: ''
})

// Control de errores del formulario
const errorFormulario = ref('')


// Función para seleccionar un evento y limpiar el formulario anterior
function seleccionarEvento(evento: Evento) {
    eventoSeleccionado.value = evento
    formInscripcion.nombreUsuario = ''
    formInscripcion.correoElectronico = ''
    formInscripcion.rutUsuario = ''
}

// Función provisional para cuando el usuario envíe el formulario
async function procesarInscripcion() {
    // Validar que realmente tenga un evento seleccionado antes de mandar
    if (!eventoSeleccionado.value) return

    try {
        errorFormulario.value = '' // Limpiar errores previos

        // Enviar datos
        const respuesta = await $fetch('/api/usuarios', {
            method: 'POST',
            body: {
                nombreUsuario: formInscripcion.nombreUsuario,
                correoElectronico: formInscripcion.correoElectronico,
                rutUsuario: formInscripcion.rutUsuario, // Enviar el RUT
                eventoId: eventoSeleccionado.value.id // Paso el ID del evento para vincularlos
            }
        })

        if (respuesta.ok) {
            alert('¡Inscripción realizada con éxito!')
            eventoSeleccionado.value = null // se cierra el modal
        }
    } catch (error: any) {
        // Si la base de datos falla
        errorFormulario.value = error.statusMessage || 'Hubo un problema al registrar la inscripción.'
    }
}

</script>


<template>
    <div class="mx-auto max-w space-y-4">
        <div class="rounded-xl border border-indigo-200 bg-course-surface p-6 shadow-lg backdrop-blur sm:p-6">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div class="space-y-2">
                    <p class="text-sm font-semibold uppercase tracking-wides text-indigo-400">
                        Eventos publicados
                    </p>
                    <h1 class="text-2xl font-bold tracking-tight text-course-text sm:text-3xl">Eventos</h1>
                    <p class="max-w-2xl text-sm leading-6 text-course-text-soft">
                        Consulta los eventos que fueron publicados. Animate a inscribirte a alguno.
                    </p>
                </div>

                <UButton icon="i-heroicons-arrow-path" color="secondary" variant="soft" :loading="pending"
                    @click="() => refresh()" class="self-start rounded-full px-5 text-indigo-800 shadow-sm">
                    Actualizar
                </UButton>
            </div>
        </div>
    </div>

    <!-- Contenedor de eventos-->
    <div class="w-full mx-auto space-y-6 py-6">
        <!-- Cargando eventos-->
        <div v-if="pending" class="flex flex-col w-full mx-auto py-6 space-y-4 rounded-xl border-indigo-200 bg-course-surface justify-center text-center text-3xl font-bold text-gray-500">
            Cargando la lista de eventos...
        </div>


        <!-- Si no existen eventos dentro del servidor -->
        <div v-else-if="!eventos || eventos.length === 0">
            <div class="flex flex-col max-w mx-auto py-6 space-y-4 rounded-xl border-indigo-200 bg-course-surface justify-center text-center text-3xl font-bold text-gray-500">
                No se han publicado eventos recientemente...
            </div> 
        </div>

        <!-- En caso de error -->
        <div v-else-if="error" class="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-500 text-sm">
            <strong>Error:</strong> {{ error.statusMessage || 'No se pudo conectar a la BD' }}
        </div>



        <!-- Cuando encuentre información dentro de la base de datos, que repita la acción la cantidad de veces que exista -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
            <div v-for="evento in (eventos as any)" :key="evento.id" 
            
                class="flex flex-col gap-2 p-4 rounded-xl border border-course-line bg-course-surface shadow-md hover:shadow-lg transition-shadow">
                <img 
                    :src="evento.imagenURL.startsWith('/images/') ? evento.imagenURL : '/images/' + evento.imagenURL" 
                    alt="Imagen del evento" 
                    class="w-full h-40 object-cover rounded-lg bg-course-line-soft"
                />

                <p class="text-xs font-semibold uppercase tracking-wider text-indigo-400 mt-2">
                    ¡Disponible!
                </p>
                
                <h2 class="text-lg font-bold text-course-text line-clamp-1">
                    {{ evento.titulo }}
                </h2>
                
                <p class="text-sm text-course-text-soft">
                    <strong>Lugar:</strong> {{ evento.lugar }}
                </p>
                
                <p class="text-sm text-course-text-soft">
                    <strong>Valor:</strong> ${{ evento.valor }}
                </p>
                
                <p class="text-sm text-course-text-muted mt-auto pt-2 border-t border-course-line-soft">
                    <h1>Usuarios registrados: {{ evento._count.usuarios }} / {{ evento.topePersonas }} Cupos</h1>
                </p>

                <UButton 
                icon="i-heroicons-pencil-square" color="secondary"
                @click="seleccionarEvento(evento)"
                >   Inscribirse
                </UButton>
            </div>

        </div>
        
    </div>

      

    <BaseFormModal 
        :open="eventoSeleccionado !== null" 
        @update:open="(val) => { if(!val) eventoSeleccionado = null }"
        title="Inscripción de Usuario"
        :description="`Completa tus datos para registrarte en el evento: ${eventoSeleccionado?.titulo || ''}`"
    >
        <form class="space-y-4" @submit.prevent="procesarInscripcion">
            
            <UFormField label="Nombre de Usuario" name="nombreUsuario">
                <UInput 
                    v-model="formInscripcion.nombreUsuario" 
                    color="neutral" 
                    variant="outline" 
                    :ui-slots="miInputUi" 
                    class="w-full bg-white text-gray-900"
                    placeholder="Ej: Juan Perez" 
                    required
                />
            </UFormField>

            <UFormField label="RUT" name="rutUsuario">
                <UInput 
                    v-model="formInscripcion.rutUsuario" 
                    color="neutral" 
                    variant="outline" 
                    :ui-slots="miInputUi" 
                    class="w-full bg-white text-gray-900"
                    placeholder="Ej: 12345678-9" 
                    required
                />
            </UFormField>

            <UFormField label="Correo Electrónico" name="correoElectronico">
                <UInput 
                    v-model="formInscripcion.correoElectronico" 
                    type="email"
                    color="neutral" 
                    variant="outline" 
                    :ui-slots="miInputUi" 
                    class="w-full bg-white text-gray-900"
                    placeholder="ejemplo@correo.com" 
                    required
                />
            </UFormField>

            <UAlert 
                v-if="errorFormulario" 
                color="error" 
                variant="soft" 
                icon="i-heroicons-exclamation-circle"
                :title="errorFormulario" 
            />

            <div class="flex justify-end gap-3 pt-2">
                <UButton type="button" color="neutral" variant="subtle" @click="eventoSeleccionado = null">
                    Cancelar
                </UButton>
                <UButton type="submit" color="secondary" icon="i-heroicons-check">
                    Confirmar Inscripción
                </UButton>
            </div>
        </form>
   </BaseFormModal>
</template>