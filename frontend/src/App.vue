<script setup lang="ts">
import ComponentPalette from './components/canvas/ComponentPalette.vue'
import FlowCanvas from './components/canvas/FlowCanvas.vue'
import SavedDesignsPanel from './components/canvas/SavedDesignsPanel.vue'
</script>

<template>
  <div class="flex h-screen w-screen">
    <ComponentPalette />
    <div class="min-w-0 flex-1">
      <FlowCanvas />
    </div>
    <SavedDesignsPanel />
  </div>
</template>
