<script setup lang="ts" name="UserAvatar">
import type { UserInfo } from "@/pinia";
import { Cropper } from "@/components";
import defaultAvatar from "@/common/assets/images/default.png";
import { useNamespace } from "@/composables";

const ns = useNamespace("user-avatar");

const props = defineProps<{ user: UserInfo }>();
const { user } = toRefs(props);
const dialogVisible = ref(false);

const openDialog = () => {
  dialogVisible.value = true;
};

const handleClose = () => {
  dialogVisible.value = false;
};
const uploadImage = (imgData: FormData) => {
  console.log(imgData);
};
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('header')" @click="openDialog">
      <el-image :src="user.avatar" title="点击上传头像" :class="ns.e('avatar')" alt="头像">
        <template #error>
          <el-image :src="defaultAvatar" :class="ns.e('avatar')" alt="头像" />
        </template>
      </el-image>
    </div>

    <el-dialog
      title="修改头像"
      v-model="dialogVisible"
      width="800px"
      append-to-body
      @close="handleClose"
      destroy-on-close
      :close-on-click-modal="false"
    >
      <Cropper
        :imgLink="user.avatar"
        :crop-width="200"
        :crop-height="200"
        :crop-container-height="350"
        image-type="base64"
        @upload-image="uploadImage"
      />
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@use "./index";
</style>
