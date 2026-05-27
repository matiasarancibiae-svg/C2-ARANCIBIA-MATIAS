<script setup lang="ts">
const route = useRoute()
const eventId = route.params.id

const { data: evento, pending, error } = await useFetch(`/api/eventos/${eventId}`)

const eliminarUsuario = async (userId: number) => {
  if (confirm('¿Estás seguro de eliminar a este usuario?')) {
    try {
      await $fetch(`/api/usuarios/${userId}`, { method: 'DELETE' })
      
      // Actualizar
      await refreshNuxtData('evento-detallado') 
      
      // Por si falla
      window.location.reload() 
    } catch (error) {
      console.error("Error al borrar:", error)
    }
  }
}
</script>

<template>
  <div class="p-8">
    <div v-if="pending">Cargando usuarios...</div>
    <div v-else-if="error">Error al cargar usuarios.</div>
    <div v-else>
      <h1 class="text-2xl font-bold mb-4">Usuarios en el evento: {{ evento.titulo }}</h1>
      
      <table class="min-w-full bg-white border">
        <thead>
          <tr>
            <th class="border-b p-2">Nombre</th>
            <th class="border-b p-2">Correo</th>
            <th class="border-b p-2">RUT</th>
            <th class="border-b p-2">ELIMINAR USUARIO</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in evento.usuarios" :key="user.id">
            <td class="border-b p-2 text-center">{{ user.nombre }}</td>
            <td class="border-b p-2 text-center">{{ user.correo }}</td>
            <td class="border-b p-2 text-center">{{ user.rut }}</td>
            <td class="border-b p-2 text-center">
              <UButton @click="eliminarUsuario(user.id)" icon="i-heroicons-trash" color="error">
                Eliminar usuario
              </UButton>

              
            </td>
            
          </tr>
        </tbody>
      </table>
      
      <button @click="$router.back()" class="mt-6 bg-gray-500 text-white px-4 py-2 rounded">
        Volver
      </button>

      
    </div>
  </div>
</template>

