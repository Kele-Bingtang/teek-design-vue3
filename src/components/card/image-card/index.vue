<!-- 图片卡片 -->
<script setup lang="ts">
import { useNamespace } from "@/composables";
import type { ImageCardEmits, ImageCardProps } from "./types";
import { Picture, View, ChatLineRound } from "@element-plus/icons-vue";

defineOptions({ name: "ImageCard" });

const props = defineProps<ImageCardProps>();
const emit = defineEmits<ImageCardEmits>();

const ns = useNamespace("image-card");

const handleClick = () => {
  emit("click", props);
};
</script>

<template>
  <div :class="ns.b()" @click="handleClick">
    <el-card :body-style="{ padding: '0px' }" shadow="hover" :class="ns.join('card-secondary')">
      <div :class="ns.e('wrapper')">
        <el-image :src="props.imageUrl" fit="cover" loading="lazy">
          <template #placeholder>
            <div :class="ns.e('placeholder')">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>

        <div class="read-time" v-if="props.readTime">{{ props.readTime }} 阅读</div>
      </div>

      <div :class="ns.e('content')">
        <div :class="ns.em('content', 'category')" v-if="props.category">
          {{ props.category }}
        </div>
        <p :class="ns.em('content', 'title')">{{ props.title }}</p>

        <div :class="ns.em('content', 'stats')">
          <span class="views" v-if="props.views">
            <el-icon><View /></el-icon>
            {{ props.views }}
          </span>

          <span class="comments" v-if="props.comments">
            <el-icon><ChatLineRound /></el-icon>
            {{ props.comments }}
          </span>

          <span class="date">{{ props.date }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
