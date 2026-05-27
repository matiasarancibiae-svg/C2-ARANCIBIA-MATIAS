import type { TableRow } from "@nuxt/ui"

export const headerClass = 'text-course-header font-semibold'
export const cellClass = 'text-course-text-soft'

export const defaultColumnMeta = {
    class: {
        th: headerClass,
        td: cellClass
    }
}

export const createTableMeta = <T>() => ({
    class: {
        tr: (_row: TableRow<T>) => 'cursor-pointer transition-colors duration-150 hover:bg-course-surface-accent'
    }
})