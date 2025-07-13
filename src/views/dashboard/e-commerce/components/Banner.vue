<script setup lang="ts">
import { storeToRefs } from "pinia";
import { TopRight } from "@element-plus/icons-vue";
import bannerCover from "@/common/assets/images/login/login_left0.png";
import { BannerCard } from "@/components";
import { useUserStore } from "@/pinia";
import { useNamespace } from "@/composables";

const ns = useNamespace();
const userStore = useUserStore();

const { userInfo } = storeToRefs(userStore);

const handleBannerClick = () => {};
</script>

<template>
  <BannerCard
    class="banner"
    height="13.3rem"
    :title="`欢迎回来 ${userInfo.username}`"
    :backgroundColor="ns.cssVarEl('color-primary-light-9')"
    :titleColor="ns.cssVar('gray-900')"
    :decoration="false"
    :meteorConfig="{
      enabled: true,
      count: 10,
    }"
    :buttonConfig="{
      show: false,
      text: '',
    }"
    :imageConfig="{
      src: bannerCover,
      width: '18rem',
      bottom: '-7.5rem',
    }"
    @click="handleBannerClick"
  >
    <div class="banner-slot">
      <div class="item">
        <p class="title">
          ¥2,340
          <Icon :icon="TopRight" class="icon-sys" :class="ns.join('text-success')" />
        </p>
        <p class="subtitle">今日销售额</p>
      </div>
      <div class="item">
        <p class="title">
          35%
          <Icon :icon="TopRight" class="icon-sys" :class="ns.join('text-success')" />
        </p>
        <p class="subtitle">较昨日</p>
      </div>
    </div>
  </BannerCard>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/function" as *;

.banner {
  justify-content: center;

  .banner-slot {
    display: flex;
    margin-top: 24px;

    .item {
      margin-right: 30px;

      &:first-of-type {
        padding-right: 30px;
        border-right: 1px solid cssVar(gray-300);
      }

      .title {
        font-size: 30px;
        color: cssVar(gray-900) !important;

        i {
          position: relative;
          top: -10px;
          margin-left: 10px;
          font-size: 16px;
        }
      }

      .subtitle {
        margin-top: 4px;
        font-size: 14px;
        color: cssVar(gray-700) !important;
      }
    }
  }
}
</style>
