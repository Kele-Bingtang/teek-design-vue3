import type { ComputedRef, ModelRef, defineComponent } from "vue";
import type { FormSchemaProps, FormFieldNamesProps, PascalCaseComponentName } from "../interface";
import { getProp, hyphenToCamelCase, setProp } from "../helper";
import { componentMap } from "../helper/component-map";

export const useRenderComponent = (
  model: ModelRef<Record<string, any>, string>,
  componentProps: ComputedRef<Record<string, any>>,
  column: FormSchemaProps,
  columnEnum: Record<string, any>[],
  fieldNames: FormFieldNamesProps
) => {
  const renderComponent = () => {
    // 注册自定义的组件
    const Component = componentMap[hyphenToCamelCase(column.el) as PascalCaseComponentName] as ReturnType<
      typeof defineComponent
    >;

    return (
      <Component
        modelValue={getProp(model.value, column.prop, column.valueFormat)}
        onUpdate:modelValue={(v: any) => setProp(model.value, column.prop, v)}
        {...componentProps.value}
        enum={columnEnum}
        fieldNames={fieldNames}
      ></Component>
    );
  };

  return { renderComponent };
};
