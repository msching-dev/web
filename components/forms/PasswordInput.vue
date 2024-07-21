<script setup lang="ts">
const showPassword = ref(true)

const { modelValue, className, placeholder, required } = defineProps({
  modelValue: { type: String, required: true },
  className: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const handleInputChanged = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
<template>
  <div class="relative flex items-center w-full">
    <UFormGroup class="w-full">
      <UInput
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        size="lg"
        placeholder="密碼"
        :ui="{ icon: { trailing: { pointer: '' } } }"
      >
        <template #trailing>
          <UButton
            v-if="showPassword"
            color="gray"
            variant="link"
            icon="i-heroicons-eye"
            :padded="false"
            @click="showPassword = !showPassword"
          />
          <UButton
            v-else
            color="gray"
            variant="link"
            icon="i-heroicons-eye-slash"
            :padded="false"
            @click="showPassword = !showPassword"
          />
        </template>
      </UInput>
    </UFormGroup>
  </div>
</template>
