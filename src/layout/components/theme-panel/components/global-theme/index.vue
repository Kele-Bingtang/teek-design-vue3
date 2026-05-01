<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { CircleCheckFilled } from "@element-plus/icons-vue";
import { useNamespace, useTheme } from "@/composables";
import { useSettingStore } from "@/pinia";
import { serviceConfig } from "@/common/config";
import { GlobalThemeEnum } from "@/common/enums";
import lightTheme from "@/common/assets/images/system-theme/light.png";
import darkTheme from "@/common/assets/images/system-theme/dark.png";
import systemTheme from "@/common/assets/images/system-theme/system.png";

defineOptions({ name: "GlobalTheme" });

const ns = useNamespace("global-theme");

const { changeGlobalTheme, changeThemeSurface, changeFunctionalColor, changeGreyOrWeak } = useTheme();
const settingStore = useSettingStore();
const { t } = useI18n();

const { theme } = storeToRefs(settingStore);

const globalThemeModeList = [
  { name: computed(() => t("_setting.theme.modeSelect.light")), theme: GlobalThemeEnum.Light, img: lightTheme },
  {
    name: computed(() => t("_setting.theme.modeSelect.dark")),
    theme: GlobalThemeEnum.Dark,
    img: darkTheme,
  },
  { name: computed(() => t("_setting.theme.modeSelect.system")), theme: GlobalThemeEnum.System, img: systemTheme },
];

/**
 * 主题外观选项
 */
const surfaceOptions = [
  { value: "teek-brand", labelKey: "_setting.theme.surfaceSelect.teekBrand", color: "#395ae3" }, // 默认品牌主题
  { value: "cloud-white", labelKey: "_setting.theme.surfaceSelect.cloudWhite", color: "#f8fafc" }, // 纯净、普适
  { value: "mono-minimal", labelKey: "_setting.theme.surfaceSelect.monoMinimal", color: "#4b5563" }, // 经典黑白灰
  { value: "slate-pro", labelKey: "_setting.theme.surfaceSelect.slatePro", color: "#4b5563" }, // 专业、中性
  { value: "steel-cool", labelKey: "_setting.theme.surfaceSelect.steelCool", color: "#4b5563" }, // 现代、工业
  { value: "ocean-breeze", labelKey: "_setting.theme.surfaceSelect.oceanBreeze", color: "#0ea5e9" }, // 清新、自然
  { value: "forest-moss", labelKey: "_setting.theme.surfaceSelect.forestMoss", color: "#2e7d32" }, // 护眼、自然
  { value: "sunset-dune", labelKey: "_setting.theme.surfaceSelect.sunsetDune", color: "#c44536" }, // 温暖、舒适
  { value: "warm-paper", labelKey: "_setting.theme.surfaceSelect.warmPaper", color: "#b45309" }, // 复古、舒适
  { value: "lilac-mist", labelKey: "_setting.theme.surfaceSelect.lilacMist", color: "#b39ddb" }, // 柔和、淡雅
  { value: "velvet-rose", labelKey: "_setting.theme.surfaceSelect.velvetRose", color: "#ad1457" }, // 深沉、优雅
  { value: "berry-sweet", labelKey: "_setting.theme.surfaceSelect.berrySweet", color: "#db2777" }, // 友好、女性
  { value: "nord-aurora", labelKey: "_setting.theme.surfaceSelect.nordAurora", color: "#5e81ac" }, // 冷静、专注
  { value: "deep-space", labelKey: "_setting.theme.surfaceSelect.deepSpace", color: "#6366f1" }, // 沉浸、夜间
  { value: "vintage-tech", labelKey: "_setting.theme.surfaceSelect.vintageTech", color: "#d97706" }, // 怀旧、独特
  { value: "deep-wood", labelKey: "_setting.theme.surfaceSelect.deepWood", color: "#166534" }, // 沉稳、自然
  { value: "midnight-lavender", labelKey: "_setting.theme.surfaceSelect.midnightLavender", color: "#8b5cf6" }, // 神秘、优雅
  { value: "jade-luxe", labelKey: "_setting.theme.surfaceSelect.jadeLuxe", color: "#059669" }, // 高级、东方
  { value: "desert-sand", labelKey: "_setting.theme.surfaceSelect.desertSand", color: "#ca8a04" }, // 极简、中性
  { value: "dusk-horizon", labelKey: "_setting.theme.surfaceSelect.duskHorizon", color: "#7c3aed" }, // 浪漫、艺术
  { value: "obsidian-glass", labelKey: "_setting.theme.surfaceSelect.obsidianGlass", color: "#06b6d4" }, // 现代、科技
  { value: "candy-floss", labelKey: "_setting.theme.surfaceSelect.candyFloss", color: "#ec4899" }, // 活泼、童趣
  { value: "pop-art", labelKey: "_setting.theme.surfaceSelect.popArt", color: "#ea0c7e" }, // 鲜艳、艺术
  { value: "cyberpunk-electric", labelKey: "_setting.theme.surfaceSelect.cyberpunkElectric", color: "#9d00ff" }, // 高饱和、未来
  { value: "hacker-terminal", labelKey: "_setting.theme.surfaceSelect.hackerTerminal", color: "#00ff00" }, // 极客、技术
];

/**
 * 颜色配置项列表
 */
const functionalColorOptions: { type: any; labelKey: string; storeKey: string }[] = [
  { type: "primary", labelKey: "_setting.theme.primaryColor", storeKey: "primaryColor" },
  { type: "success", labelKey: "_setting.theme.successColor", storeKey: "successColor" },
  { type: "warning", labelKey: "_setting.theme.warningColor", storeKey: "warningColor" },
  { type: "danger", labelKey: "_setting.theme.dangerColor", storeKey: "dangerColor" },
  { type: "error", labelKey: "_setting.theme.errorColor", storeKey: "errorColor" },
  { type: "info", labelKey: "_setting.theme.infoColor", storeKey: "infoColor" },
  // 如果还有 secondary，也可以加在这里
  // { type: "secondary", labelKey: "_setting.theme.secondaryColor", storeKey: "secondaryColor" },
];

// 预定义主题颜色
const colorList = computed(() => [
  theme.value.primaryColor,
  theme.value.successColor,
  theme.value.warningColor,
  theme.value.dangerColor,
  theme.value.errorColor,
  theme.value.infoColor,
  ...(serviceConfig.theme.presetsColor ?? []),
]);

/**
 * 圆角选项
 */
const radiusOptions = [
  { value: 0, label: "None" },
  { value: 0.25, label: "Small" },
  { value: 0.5, label: "Medium" },
  { value: 0.75, label: "Large" },
  { value: 1, label: "Round" },
  { value: 1.25, label: "Round Small" },
  { value: 1.5, label: "Round Medium" },
  { value: 1.75, label: "Round Large" },
  { value: 2, label: "Round Plus" },
];
</script>

<template>
  <div :class="ns.b()">
    <div class="flx-wrap gap-15">
      <div
        v-for="item in globalThemeModeList"
        :key="item.theme"
        :class="ns.e('theme-item')"
        @click="changeGlobalTheme(item.theme)"
      >
        <div :class="[ns.e('box'), ns.is('active', item.theme === theme.globalThemeMode)]">
          <img :src="item.img" />
        </div>
        <Icon :class="ns.m('icon')" v-show="item.theme === theme.globalThemeMode"><CircleCheckFilled /></Icon>
        <p :class="ns.m('name')">{{ item.name }}</p>
      </div>
    </div>

    <div :class="ns.e('item')">
      <span>主题外观</span>
      <el-select v-model="theme.surface" placeholder="Select" @change="changeThemeSurface">
        <el-option v-for="item in surfaceOptions" :key="item.value" :label="$t(item.labelKey)" :value="item.value">
          <div class="flx-align-center">
            <span
              :style="{
                display: 'inline-block',
                backgroundColor: item.color,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                marginRight: '8px',
              }"
            />
            <span>{{ $t(item.labelKey) }}</span>
          </div>
        </el-option>

        <template #label>
          <div class="flx-align-center">
            <span
              :style="{
                display: 'inline-block',
                backgroundColor: surfaceOptions.find(item => item.value === theme.surface)?.color,
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                marginRight: '8px',
              }"
            />
            <span>{{ $t(surfaceOptions.find(item => item.value === theme.surface)?.labelKey ?? "") }}</span>
          </div>
        </template>
      </el-select>
    </div>

    <div :class="ns.e('item-two')">
      <template v-for="item in functionalColorOptions" :key="item.type">
        <div>
          <span>{{ $t(item.labelKey) }}</span>
          <el-color-picker
            v-model="(theme as any)[item.storeKey]"
            :predefine="colorList"
            @change="val => val && changeFunctionalColor(val, item.type)"
          />
        </div>
      </template>
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.functionalColorStrictly") }}</span>
      <el-switch v-model="theme.functionalColorStrictly" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.greyMode") }}</span>
      <el-switch v-model="theme.greyMode" @change="changeGreyOrWeak($event as boolean, 'greyMode')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.weakMode") }}</span>
      <el-switch v-model="theme.weakMode" @change="changeGreyOrWeak($event as boolean, 'weakMode')" />
    </div>

    <div :class="ns.e('item')">
      <span>{{ $t("_setting.theme.radius") }}</span>
      <el-select v-model="theme.radius" placeholder="Select">
        <el-option v-for="item in radiusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
