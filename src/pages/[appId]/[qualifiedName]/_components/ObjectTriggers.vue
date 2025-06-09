<script setup lang="ts"></script>

<template>
  <a-dropdown position="tl">
    <a-button type="outline">
      <template #icon>
        <icon-command />
      </template>
      Triggers
    </a-button>
    <template #content>
      <a-doption>Option 1</a-doption>
      <a-doption disabled>Option 2</a-doption>
      <a-doption :value="{ value: 'Option3' }">Option 3</a-doption>
    </template>
  </a-dropdown>
  <a-button status="danger" type="outline">
    <template #icon>
      <icon-delete />
    </template>
    Delete
  </a-button>
</template>
