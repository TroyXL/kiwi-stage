<script setup lang="ts">
import type { KiwiSchema } from '@/kiwi'
import { i18nKey } from '@/lib/i18n'
import { computed } from 'vue'
import ObjectEditor from './ObjectEditor.vue'

const props = defineProps<{
  schema: KiwiSchema
  data?: KiwiObject[]
}>()

const hasParameters = !!props.schema?.constructorParameters.length
const type = props.schema.qualifiedName
const itemsCount = computed(() => props.data?.length || 0)
</script>

<template>
  <template v-if="hasParameters">
    <a-row class="mb-2 flex !items-center">
      <a-col class="text-right pr-4" :span="5">
        <span class="font-medium">{{ schema.label }}</span>
        <a-divider direction="vertical" />
        <span class="text-muted-foreground">{{ schema.name }}</span>
      </a-col>
      <a-col :span="16" class="text-right">
        <a-button v-if="!itemsCount" type="primary" size="mini">
          <template #icon>
            <icon-plus />
          </template>
        </a-button>
      </a-col>
    </a-row>
    <div v-if="data?.length" class="border-t py-5">
      <div v-for="(item, index) in data" :key="item.id">
        <ObjectEditor :schema="schema" :data="item" />
        <a-row class="pb-5">
          <a-col class="flex justify-end gap-2" :span="21">
            <a-button v-if="index === itemsCount - 1" type="primary">
              <template #icon>
                <icon-plus />
              </template>
              {{ $t(i18nKey.addLabel) }}
            </a-button>
            <a-button type="secondary" status="danger">
              <template #icon>
                <icon-delete />
              </template>
              {{ $t(i18nKey.removeLabel) }}
            </a-button>
          </a-col>
        </a-row>
      </div>
    </div>
  </template>
</template>
