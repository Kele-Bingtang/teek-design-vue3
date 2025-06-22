<script setup lang="ts">
import type { DescriptionColumn, ProDescriptionsEmits, ProDescriptionsProp } from "./types";
import { toValue } from "vue";
import { filterOptions, filterOptionsValue, getProp } from "@/components/pro/helper";
import { useOptions } from "@/components/pro/use-options";
import { isArray } from "@/utils";
import { useNamespace } from "@/composables";

defineOptions({ name: "ProDescriptions" });

const props = withDefaults(defineProps<ProDescriptionsProp>(), {
  data: () => ({}),
  columns: () => [],
  descriptionsItemProps: () => ({}),
  formProps: () => ({}),
  card: false,
});

const emits = defineEmits<ProDescriptionsEmits>();

const ns = useNamespace("pro-descriptions");

const { optionsMap, initOptionsMap } = useOptions();
const { availableColumns } = useDescriptionsInit();

function useDescriptionsInit() {
  let timer: ReturnType<typeof setTimeout> | null = null;

  // 计算属性：过滤掉需要销毁的表单项
  const availableColumns = computed(() => props.columns.filter(item => !item.hidden) || []);

  watch(availableColumns, columns => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(async () => {
      columns.forEach((column, index) => {
        // 初始化枚举数据
        initOptionsMap(column.options, column.prop || "");
        // 设置配置项排序默认值
        column && (column.order = column.order ?? index + 5);
      });

      // 排序配置项
      columns.sort((a, b) => a.order! - b.order!);
    }, 10);
  });

  return { availableColumns };
}

const getValue = (column: DescriptionColumn) => {
  const { data } = props;
  const { prop = "", label, optionsProp, optionField, transformOption } = column;

  const options = unref(optionsMap.value.get(optionsProp || prop));

  if (!options) return toValue(label);

  const option = transformOption
    ? transformOption(getProp(data, prop), options, data)
    : filterOptions(getProp(data, prop), options, optionField);

  const labelValue = filterOptionsValue(option, optionField?.label || "label");

  // 如果当前值为数组，使用 / 分隔符拼接（根据需求自定义分隔符）
  if (isArray(labelValue)) return labelValue.length ? labelValue.join(" / ") : "--";
  return labelValue ?? "--";
};
</script>

<template>
  <el-descriptions v-bind="$attrs" :class="[ns.b(), { 'tk-card': card }]">
    <slot>
      <el-descriptions-item
        v-for="(column, index) in availableColumns"
        :key="index"
        v-bind="{ ...descriptionsItemProps, ...column, formProps: undefined }"
        :label="toValue(column.label)"
      >
        <!-- 描述 label 插槽 -->
        <template #label>
          <component
            v-if="column.renderLabel"
            :is="column.renderLabel"
            :label="toValue(column.label || '')"
            :column
            :data
          />

          <!-- 自定义插槽 -->
          <slot :name="`${column.prop}-label`" :label="toValue(column.label)" :column :data>
            {{ toValue(column.label) }}
          </slot>
        </template>

        <!-- 描述默认插槽 -->
        <component :is="column.render" v-if="column.render" :value="getValue(column)" :column :data />
        <!-- 自定义插槽 -->
        <slot v-else-if="$slots[column.prop || '']" :name="column.prop || ''" :value="getValue(column)" :column :data />
        <!-- 默认值 -->
        <template v-else>
          {{ getValue(column) }}
        </template>
      </el-descriptions-item>
    </slot>

    <template #title>
      <slot name="title" />
    </template>

    <template #extra>
      <slot name="extra" />
    </template>
  </el-descriptions>
</template>
