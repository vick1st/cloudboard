<script setup lang="ts">
import type { ArchNodeData } from '../../../types/diagram'

defineProps<{ data: ArchNodeData }>()
</script>

<template>
  <div>{{ data.label }}</div>
</template>
