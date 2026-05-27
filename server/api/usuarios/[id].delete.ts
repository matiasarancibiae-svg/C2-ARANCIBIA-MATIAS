import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) throw createError({ statusCode: 400, statusMessage: 'ID requerido' })
    
    const userId = parseInt(id)

    try {
        // Esto elimina las filas en la tabla intermedia sin borrar al usuario ni al evento
        await prisma.usuario.update({
            where: { id: userId },
            data: {
                eventos: {
                    set: [] // Vacía la lista de eventos vinculados
                }
            }
        })

        return await prisma.usuario.delete({
            where: { id: userId }
        })

    } catch (e) {
        console.error(e) // Útil para depurar en consola
        throw createError({ 
            statusCode: 500, 
            statusMessage: 'Error al intentar eliminar el usuario.' 
        })
    }
})