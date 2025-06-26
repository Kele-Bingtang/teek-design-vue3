<script setup lang="ts" name="SplitPaneDemo">
import { SplitPane } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace("split-pane-demo");

/**
 * SplitPane 接收的插槽位置为 left、right、top、bottom，即 <div slot="left/right/top/bottom">位置</div>
 *
 * 布局参数：mode
 * mode 为 vertical，代表是竖线分割，即传入 left 和 right 位置的内容。
 * mode 为 horizontal，代表是水平线分割，即传入 top 和 bottom 位置的内容，默认为 horizontal
 * 如果不按照 mode 的规则传入对应的位置，则效果失效，如 mode 为 vertical，却传入 top 和 bottom 位置的内容，页面将会不显示
 *
 * SplitPane 需要绑定一个 v-model 值，值可填入数值、字符串，影响分割线的位置和移动
 * 数值：偏移量多少，0 最小，1 最大
 * 字符串：位移多少 px，如 250 代表分割离位置（看你传入的位置是哪个） 250px。0 最小，页面宽度 width 值最大
 * 如果使用字符串出现一些 bug，请使用数值
 *
 * SplitPane 事件：
 *   1. on-move-start 开始移动的回调，无参数
 *   2. on-move-end 结束移动的回调，无参数
 *   3. on-moving 移动过程的回调，参数为移动的事件
 *
 * 另外 SplitPane 可传入的参数还有 min、max，分别为分割线移动的最小距离和最大距离
 *
 * 如果你想自定义自己的分割线，可传入插槽，name 为 line，即 <div slot="line">分割线</div>
 *
 * 详细代码，请看 src/components/SplitPane/src/index.vue 组件内容
 */
const offset1 = ref(0.4); // 数值单位 1 最大，0 最小
const offset2 = ref("500px"); // 页面宽度最大， 0 最小
const offset3 = ref(0.5);

const handleMoving = (e: any) => {
  console.log(e);
};
</script>

<template>
  <div :class="ns.b()">
    <split-pane v-model="offset1" mode="vertical" @on-moving="handleMoving">
      <template #left>
        <div :class="`${ns.e('pane')} left-pane`">
          <split-pane v-model="offset2" mode="horizontal" @on-moving="handleMoving">
            <template #top>
              <div :class="`${ns.e('pane')} top-pane`"></div>
            </template>
            <template #bottom>
              <div :class="`${ns.e('pane')} bottom-pane`"></div>
            </template>
          </split-pane>
        </div>
      </template>

      <template #right>
        <split-pane v-model="offset3" class="pane right-pane" mode="vertical">
          <template #left>
            <div :class="`${ns.e('pane')} left-pane`"></div>
          </template>
          <template #right>
            <div :class="`${ns.e('pane')} right-pane`"></div>
          </template>
        </split-pane>
      </template>
    </split-pane>
  </div>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(split-pane-demo) {
  height: 100%;
  padding: 20px;

  @include e(pane) {
    width: 100%;
    height: 100%;

    &.left-pane {
      background: sandybrown;
    }

    &.right-pane {
      background: powderblue;
    }

    &.top-pane {
      background: teal;
    }

    &.bottom-pane {
      background: palegreen;
    }
  }
}
</style>
