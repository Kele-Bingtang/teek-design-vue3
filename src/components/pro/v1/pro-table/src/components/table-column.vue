<script setup lang="tsx">
import type { TableColumnProps, TableRenderScope, HeaderRenderScope } from "../interface";
import { inject, ref, useSlots } from "vue";
import { ElCheckTag, ElTag, ElTableColumn, ElButton } from "element-plus";
import { tableEnumMapKey } from "../interface";
import { filterEnum, filterEnumLabel, formatCellValue, lastProp, handleRowAccordingToProp } from "../helper";
import { useHeaderFilter } from "./plugins/header-filter";
import { useRowInlineEdit } from "./plugins/row-inline-edit";

defineOptions({ name: "TableColumn" });

const props = defineProps<{ column: TableColumnProps }>();

const slots = useSlots();

const enumMap = inject(tableEnumMapKey, ref(new Map<string, Record<string, any>[]>()));

const getEnumData = (item: TableColumnProps, scope: TableRenderScope<any>) => {
  return enumMap.value.get(item.prop!) && item.isFilterEnum
    ? filterEnum(handleRowAccordingToProp(scope.row, item.prop!), enumMap.value.get(item.prop!), item.fieldNames)
    : "";
};

const renderCellData = (item: TableColumnProps, scope: TableRenderScope<any>, enumData: any) => {
  return enumMap.value.get(item.prop!) && item.isFilterEnum
    ? filterEnumLabel(enumData, item.fieldNames)
    : formatCellValue(handleRowAccordingToProp(scope.row, item.prop!));
};

// 获取 tag 标签
const renderTag = (item: any, data: any, last = true, index?: number) => {
  const { tagEl, tagType, tagEffect } = item;

  if (["el-check-tag", "ElCheckTag"].includes(tagEl)) {
    // 直接 index ? : 是不行的，因为这样 index = 0 是 false
    return (
      <>
        <ElCheckTag key={index} checked type={tagType || "primary"}>
          {data}
        </ElCheckTag>
        {last ? "" : " "}
      </>
    );
  }
  return (
    <>
      <ElTag key={index} type={tagType} effect={tagEffect || "light"}>
        {data}
      </ElTag>
      {last ? "" : " "}
    </>
  );
};

const { useFilter, renderHeaderFilter } = useHeaderFilter(props.column);
const { useEdit, renderRowInlineEdit } = useRowInlineEdit(props.column);

const RenderTableColumn = (item: TableColumnProps) => {
  return (
    <>
      {item.isShow && (
        <ElTableColumn
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: TableRenderScope<any>) => {
              // 行内编辑功能
              if (useEdit.value && scope.row._edit) return renderRowInlineEdit(scope);
              if (item._children) return item._children.map(child => RenderTableColumn(child));
              if (item.render) return item.render(scope);
              if (slots[lastProp(item.prop!)]) return slots[lastProp(item.prop!)]!(scope);

              const enumData = getEnumData(item, scope);
              const data = renderCellData(item, scope, enumData);

              if (item.tag && enumData) {
                // data 是从 enumData 取出来的，如果 enumData 是数组，那么 data 必然是数组
                if (Array.isArray(enumData)) {
                  return enumData.map((e, index) => renderTag(e, data[index], enumData.length - 1 === index, index));
                }
                return renderTag(enumData, data);
              }
              const defaultRender = Array.isArray(data) ? data.join(",") : data;

              // 判断是否使用 ElButton Link 属性渲染单元格
              return item.link ? (
                <ElButton
                  type="primary"
                  link
                  {...{ ...item.linkProps, onClick: undefined }}
                  onClick={() => item.linkProps?.onClick && item.linkProps.onClick(scope)}
                >
                  {defaultRender}
                </ElButton>
              ) : (
                defaultRender
              );
            },
            header: (scope: HeaderRenderScope<any>) => {
              let headerSlot = <>{item.label}</>;

              if (item.headerRender) headerSlot = item.headerRender(scope);
              if (slots[`${lastProp(item.prop!)}Header`]) headerSlot = slots[`${lastProp(item.prop!)}Header`]!(scope);

              return (
                <>
                  {headerSlot}
                  {useFilter.value ? renderHeaderFilter() : undefined}
                </>
              );
            },
          }}
        </ElTableColumn>
      )}
    </>
  );
};
</script>

<template>
  <RenderTableColumn v-bind="column" />
</template>
