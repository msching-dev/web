<script setup lang="ts">
import { cn } from '@/lib/utils'
const props = defineProps<{ class: string }>()
</script>

<template>
  <svg
    viewBox="0 0 1440 181"
    fill="xqnone"
    xmlns="http://www.w3.org/2000/svg"
    :class="
      cn(
        'pointer-events-none absolute inset-x-0 w-full transition-all text-primary flex-shrink-0 duration-[400ms] opacity-100',
        props.class
      )
    "
  >
    <mask id="path-1-inside-1_414_5526" fill="white">
      <path d="M0 0H1440V181H0V0Z"></path>
    </mask>
    <path
      d="M0 0H1440V181H0V0Z"
      fill="url(#paint0_linear_414_5526)"
      fill-opacity="0.22"
    ></path>
    <path
      d="M0 2H1440V-2H0V2Z"
      fill="url(#paint1_linear_414_5526)"
      mask="url(#path-1-inside-1_414_5526)"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_414_5526"
        x1="720"
        y1="0"
        x2="720"
        y2="181"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="currentColor"></stop>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_414_5526"
        x1="0"
        y1="90.5"
        x2="1440"
        y2="90.5"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="currentColor" stop-opacity="0"></stop>
        <stop offset="0.395" stop-color="currentColor"></stop>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
  </svg>
</template>
