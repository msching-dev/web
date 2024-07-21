<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const formView = ref<'login' | 'register' | 'forgotPassword'>('login')
const form = ref()
const state = reactive({
  email: '',
  password: '',
})

function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  console.log(event.data)
}
</script>
<template>
  <div class="mx-auto">
    <UForm ref="form" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup class="w-full">
        <UInput size="lg" placeholder="Email" />
      </UFormGroup>
      <PasswordInput v-model="state.password" />
    </UForm>
  </div>
</template>
