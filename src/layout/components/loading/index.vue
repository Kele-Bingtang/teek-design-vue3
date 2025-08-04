<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { serviceConfig } from "@/common/config";
import { useNamespace } from "@/composables";

defineOptions({ name: "Loading" });

// firstLoad：是否只在页面首次加载触发动画，后续路由跳转不会触发动画
const props = defineProps<{ route?: boolean }>();

const ns = useNamespace("layout-loading");
const router = useRouter();

const loadedPaths = new Set<string>();

// 页面首次加载状态
const isFirstLoad = ref(!props.route);
// 路由切换加载状态
const routeLoading = ref(false);

// 监听路由导航事件，控制加载状态
router.beforeEach((to, _from, next) => {
  if (props.route && !loadedPaths.has(to.path)) {
    routeLoading.value = true;
  }
  next();
});

router.afterEach(to => {
  loadedPaths.add(to.path);

  hideLoading();
});

router.onError(() => {
  hideLoading();
});

const hideLoading = () => {
  if (isFirstLoad.value) isFirstLoad.value = false;
  setTimeout(() => {
    if (props.route) routeLoading.value = false;
  }, 500);
};

// 检测热重载情况
onMounted(() => {
  if (!loadedPaths.has(router.currentRoute.value.fullPath)) loadedPaths.add(router.currentRoute.value.fullPath);
  // 如果是热重载，自动关闭首次加载状态
  if (import.meta.hot) {
    if (isFirstLoad.value) isFirstLoad.value = false;
  }
});
</script>

<template>
  <Transition name="loading">
    <div v-if="isFirstLoad || routeLoading" :class="[ns.b(), ns.is('route', route)]" class="flx-column-center">
      <div :class="ns.e('wrap')">
        <span class="dot dot-spin">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
      <span v-if="isFirstLoad" :class="ns.e('text')">{{ serviceConfig.layout.name }}</span>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
