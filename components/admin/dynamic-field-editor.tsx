'use client'

export interface FieldConfig {
  key: string
  label: string
  multiline?: boolean
  placeholder?: string
}

interface DynamicFieldEditorProps {
  fields: FieldConfig[]
  values: Record<string, string>
  onChange: (values: Record<string, string>) => void
}

export default function DynamicFieldEditor({
  fields,
  values,
  onChange,
}: DynamicFieldEditorProps) {
  const handleChange = (key: string, val: string) => {
    onChange({ ...values, [key]: val })
  }

  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {field.label}
          </label>
          {field.multiline ? (
            <textarea
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none resize-y"
            />
          ) : (
            <input
              type="text"
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-sandrift-300 focus:outline-none"
            />
          )}
        </div>
      ))}
    </div>
  )
}
