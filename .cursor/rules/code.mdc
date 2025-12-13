---
description: 代码编写规范
globs:
alwaysApply: true
priority: 999
---

## 组件格式

```vue
<script setup lang="ts">
import xxx from "xx";

defineOptions({ name: "Xxx" });

const ns = useNamespace("xx-xx");
</script>

<template>
  <div :class="ns.b()"></div>
</template>

<style scoped lang="scss">
@use "./index";
</style>
```

```scss
@use "@styles/mixins/bem" as *;

@include b(xx-xx) {
}
```

## 带有 props、emits 的写法

```vue
<script setup lang="ts">
defineOptions({ name: "Demo" });

// 按照这种写法
interface DemoProps {
  modelValue: string;
}

// 按照这种写法
interface DemoEmits {
  submit: [value: string];
}

const props = defineProps<DemoProps>();
const emit = defineEmits<DemoEmits>();

const ns = useNamespace("login");
</script>

<template>
  <div></div>
</template>

<style scoped lang="scss">
@use "./index";
</style>
```

## 组件里使用 composables

不推荐 `props`、`emits`、`响应式变量`、`computed`、`watch`、`function`、`生命周期` 的结构写法。

请使用可复用逻辑(composables)写法，即将关联性高的代码放到 `function useXx` 里然后暴露出来使用。

```vue
<script setup lang="ts">
import http from "xx";

defineOptions({ name: "Demo" });

interface DemoProps {
  params: string;
}

interface DemoEmits {
  submit: [value: string];
}

const props = defineProps<DemoProps>();
const emit = defineEmits<DemoEmits>();

const ns = useNamespace("login");

const username = ref("");
const password = ref("");

const { data } = useInitData();

// 核心请看这个 composables
function useInitData() {
  const data = ref<Recore<string, any>[]>([]);

  const request = async () => {
    // 请求数据复制给 data
    const result = await http.get(url, props.params);
    data.value = result.data;
  };

  return { data };
}
</script>

<template>
  <div :class="ns.b()">
    <input v-model="username" />
    <input v-model="password" />
  </div>
</template>

<style scoped lang="scss">
@use "./index";
</style>
```

## 类型引入规范

1. 先引入所有 `type` 类型（按照导入规范顺序引入，不允许类型和函数的引入混杂在一起）
2. 引入第三方依赖（`Vue` 相关生态优先，如 `vue`、`vue-router`、`pinia`、`vue-i18n`、`@vueuse`，然后是组件库如 `ElementPlus`，`@element-plus/icons-vue`，最后是第三方插件）
3. 引入项目目录的其他依赖（如 `@/composables`，路径按照目录结构顺序引入）
4. 引入项目目录的其他组件（如 `@/components/index.vue`，路径按照目录结构顺序引入）
5. 引入相对路径的依赖（如 `./types`）
6. 引入相对路径的组件（如 `./Demo.vue`）
7. 直接引入第三方库（如 `import "vue-cropper/dist/index.css"`）
8. 直接引入绝对路径（如 `import "@/common/styles/common/var.scss"`）
9. 直接引入相对路径（如 `import "./index.scss"`）

如：

```vue
<script setup lang="ts">
import type { xx } from "xx";
import { xx } from "xx";
import { xx } from "@/xx";
import { xx } from "@/xx.vue";
import { xx } from "../xx";
import { xx } from "../xx.vue";

import "xxx";
import "@/xxx";
import "./xxx";
</script>
```
