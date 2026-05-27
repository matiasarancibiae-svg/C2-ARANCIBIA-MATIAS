export const modalFormFieldUi = {
  label: 'font-semibold text-course-text'
} as const

export const modalInputUi = {
  base: 'bg-course-surface text-course-text placeholder:text-course-text-muted ring-course-line focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-course-line-accent'
} as const

export const modalSelectUi = {
  base: 'bg-course-surface text-course-text ring-course-line hover:bg-course-surface focus:bg-course-surface data-[state=open]:bg-course-surface focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-course-line-accent',
  value: 'text-course-text',
  placeholder: 'text-course-text-muted',
  input: 'border-course-line-soft bg-course-surface-soft text-course-text placeholder:text-course-text-muted',
  content: 'bg-course-surface-soft ring-course-line shadow-lg',
  viewport: 'divide-y divide-course-line-soft',
  item: 'text-course-text before:bg-course-surface-soft data-highlighted:not-data-disabled:text-course-text data-highlighted:not-data-disabled:before:bg-course-surface-accent',
  itemLabel: 'text-course-text',
  itemDescription: 'text-course-text-muted group-data-highlighted:text-course-text-soft',
  itemTrailingIcon: 'text-course-accent',
  trailingIcon: 'text-course-text-muted'
} as const