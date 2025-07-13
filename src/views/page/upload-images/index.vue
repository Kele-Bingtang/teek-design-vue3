<script setup lang="ts" name="ImageUploadDemo">
import type { FormInstance } from "element-plus";
import type { SuccessFun } from "@/components";
import { ref, reactive, useTemplateRef } from "vue";
import { Avatar, Picture } from "@element-plus/icons-vue";
import { uploadLocal } from "@/common/utils";
import { ImageUpload } from "@/components";
import { useNamespace } from "@/composables";

const ns = useNamespace("images-upload-demo");

const fileList = ref([{ name: "img", url: "https://vp.teek.top/blog/bg1.webp" }]);
const fileList1 = ref([]);

const avatar1 = ref("");
const avatar2 = ref("");
const avatar3 = ref("");
const avatar4 = ref("");
const avatar5 = ref("https://vp.teek.top/blog/bg3.webp");

const rules = reactive({
  avatar: [{ required: true, message: "请上传用户头像" }],
  photo: [{ required: true, message: "请上传用户照片" }],
  username: [{ required: true, message: "请填写用户姓名" }],
  idCard: [{ required: true, message: "请填写身份证号" }],
  email: [{ required: true, message: "请填写邮箱" }],
});

const fromModel = ref({
  avatar: "",
  photo: [{ name: "img", url: "https://vp.teek.top/blog/bg2.webp" }],
  username: "",
  idCard: "",
  email: "",
});
const fromModel1 = ref({
  avatar: "",
  photo: [{ name: "img", url: "https://vp.teek.top/blog/bg2.webp" }],
  username: "",
  idCard: "",
  email: "",
});
const ruleFormRef = useTemplateRef<FormInstance>("ruleFormRef");
const submit = () => {
  ruleFormRef.value!.validate(valid => {
    console.log(valid);
  });
};

const uploadImg = async (file: File, callback: SuccessFun) => {
  // 上传到本地
  const { file: f } = await uploadLocal(file);
  const url = URL.createObjectURL(f);
  callback(url); // 传回 url
};
</script>

<template>
  <el-space fill :class="ns.b()">
    <!-- 单图上传 -->
    <div class="flx-column-center tk-card-minimal">
      <h2>单图片上传组件 🍓🍇🍈🍉</h2>
      <div :class="ns.e('list')">
        <ImageUpload v-model="avatar1" @upload-img="uploadImg" :fileSize="3">
          <template #tip>上传图片最大为 3M</template>
        </ImageUpload>

        <ImageUpload v-model="avatar2" @upload-img="uploadImg" :drag="false" border-radius="50%">
          <template #empty>
            <el-icon><Avatar /></el-icon>
            <span>请上传头像</span>
          </template>
          <template #tip>圆形组件（禁止拖拽上传）</template>
        </ImageUpload>

        <ImageUpload v-model="avatar3" @upload-img="uploadImg" width="250px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传 Banner 图</span>
          </template>
          <template #tip>长方形组件（可拖拽上传）</template>
        </ImageUpload>

        <ImageUpload v-model="avatar4" @upload-img="uploadImg" disabled>
          <template #tip>无图（禁用上传）</template>
        </ImageUpload>

        <ImageUpload v-model="avatar5" @upload-img="uploadImg" disabled>
          <template #tip>有图（禁用编辑、删除）</template>
        </ImageUpload>
      </div>

      <el-descriptions title="属性项 📚" :column="1" border>
        <el-descriptions-item label="imageUrl">
          双向绑定的 imageUrl 值，使用示例： v-model:imageUrl="avatar"
        </el-descriptions-item>
        <el-descriptions-item label="api">
          上传图片的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可（非必传）
        </el-descriptions-item>
        <el-descriptions-item label="drag">是否支持拖拽上传图片，默认为 true</el-descriptions-item>
        <el-descriptions-item label="disabled">是否禁用 上传、删除 功能，可查看图片</el-descriptions-item>
        <el-descriptions-item label="fileSize">单个图片文件大小限制，默认为 5M</el-descriptions-item>
        <el-descriptions-item label="fileType">
          图片类型限制，默认类型为 ["image/jpeg", "image/png", "image/gif"]
        </el-descriptions-item>
        <el-descriptions-item label="height">组件高度样式，默认为 "150px"</el-descriptions-item>
        <el-descriptions-item label="width">组件宽度样式，默认为 "150px"</el-descriptions-item>
        <el-descriptions-item label="borderRadius">组件边框圆角样式，默认为 "8px"</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="插槽项 📚" :column="1" border>
        <el-descriptions-item label="empty">自定义操作区，当内容为空时显示</el-descriptions-item>
        <el-descriptions-item label="tip">自定义提示，显示在文件下方</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="事件项 📚" :column="1" border>
        <el-descriptions-item label="upload-img">
          上传文件时的回调，接收的参数：
          <el-link :style="{ color: ns.cssVarEl('color-primary') }">file: File, callback: SuccessFun</el-link>
          。file 是上传的文件，callback 是个必须的回调函数，参数只有一个，为文件的 url。
        </el-descriptions-item>
        <el-descriptions-item label="check-validate">上传文件成功的校验回调</el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 多图上传 -->
    <div class="flx-column-center tk-card-minimal">
      <h2>多图片上传组件 🍓🍇🍈🍉</h2>
      <div :class="ns.e('list')">
        <ImageUpload v-model="fileList" @upload-img="uploadImg" :drag="false" border-radius="50%">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip>圆形组件，图片最大为 5M（禁止拖拽上传）</template>
        </ImageUpload>

        <ImageUpload v-model="fileList1" @upload-img="uploadImg" width="250px">
          <template #empty>
            <el-icon><Picture /></el-icon>
            <span>请上传照片</span>
          </template>
          <template #tip>长方形组件（可拖拽上传）</template>
        </ImageUpload>
      </div>

      <el-descriptions title="配置项 📚（其它参数和单图上传组件相同）" :column="1" border>
        <el-descriptions-item label="fileList">
          双向绑定的 fileList 值，使用示例： v-model="fileList"
        </el-descriptions-item>
        <el-descriptions-item label="limit">最大图片上传数，默认为 5 张</el-descriptions-item>
      </el-descriptions>

      <el-descriptions title="插槽项 📚（其它参数和单图上传组件相同）" :column="1" border></el-descriptions>

      <el-descriptions title="事件项 📚" :column="1" border>
        <el-descriptions-item label="upload-img">
          上传文件时的回调，接收的参数：
          <el-link :style="{ color: ns.cssVarEl('color-primary') }">file: File, callback: SuccessFun</el-link>
          。file 是上传的文件，callback 是个必须的回调函数，参数只有一个，为文件的 url。
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 表单使用 -->
    <div :class="ns.e('form')">
      <div :class="[ns.em('form', 'card'), 'tk-card-minimal', 'flx-column-center']">
        <el-alert
          title="图片上传组件在 form 表单中使用，上传之后成功会自动重新校验"
          type="warning"
          effect="dark"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <el-form ref="ruleFormRef" label-width="100px" label-suffix=" :" :rules="rules" :model="fromModel">
          <el-form-item label="用户头像" prop="avatar">
            <ImageUpload v-model="fromModel.avatar" @upload-img="uploadImg" width="135px" height="135px" :file-size="3">
              <template #empty>
                <el-icon><Avatar /></el-icon>
                <span>请上传头像</span>
              </template>
              <template #tip>头像大小不能超过 3M</template>
            </ImageUpload>
          </el-form-item>

          <el-form-item label="用户照片" prop="photo">
            <ImageUpload
              v-model="fromModel.photo"
              @upload-img="uploadImg"
              :limit="3"
              height="140px"
              width="140px"
              border-radius="50%"
            >
              <template #empty>
                <el-icon><Picture /></el-icon>
                <span>请上传照片</span>
              </template>
              <template #tip>最多上传 3 张照片</template>
            </ImageUpload>
          </el-form-item>

          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="fromModel.username" placeholder="请填写用户姓名" clearable></el-input>
          </el-form-item>

          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="fromModel.idCard" placeholder="请填写身份证号" clearable></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="fromModel.email" placeholder="请填写邮箱" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div :class="[ns.em('form', 'card'), 'tk-card-minimal', 'flx-column-center']">
        <el-alert
          title="图片上传组件在 form 表单中使用，如果该表单禁用，则上传组件会自动禁用"
          type="warning"
          effect="dark"
          :closable="false"
          style="margin-bottom: 20px"
        />

        <el-form label-width="100px" label-suffix=" :" disabled :model="fromModel1">
          <el-form-item label="用户头像" prop="avatar">
            <ImageUpload v-model="fromModel1.avatar" width="135px" height="135px" :file-size="3">
              <template #empty>
                <el-icon><Avatar /></el-icon>
                <span>请上传头像</span>
              </template>
              <template #tip>头像大小不能超过 3M</template>
            </ImageUpload>
          </el-form-item>

          <el-form-item label="用户照片" prop="photo">
            <ImageUpload
              v-model="fromModel1.photo"
              @upload-img="uploadImg"
              height="140px"
              width="140px"
              border-radius="50%"
            >
              <template #empty>
                <el-icon><Picture /></el-icon>
                <span>请上传照片</span>
              </template>
              <template #tip>照片大小不能超过 5M</template>
            </ImageUpload>
          </el-form-item>

          <el-form-item label="用户姓名" prop="username">
            <el-input v-model="fromModel1.username" placeholder="请填写用户姓名" clearable></el-input>
          </el-form-item>

          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="fromModel1.idCard" placeholder="请填写身份证号" clearable></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="fromModel1.email" placeholder="请填写邮箱" clearable></el-input>
          </el-form-item>

          <el-form-item>
            <el-button>取消</el-button>
            <el-button type="primary" @click="submit">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-space>
</template>

<style lang="scss" scoped>
@use "@styles/mixins/bem" as *;

@include b(images-upload-demo) {
  height: auto;

  :deep(.#{$el-namespace}-descriptions) {
    width: 100%;
    padding: 40px 0 0;
  }

  @include e(list) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 90%;
    margin: 10px 0;
  }

  @include e(form) {
    display: flex;
    justify-content: space-around;
    width: 100%;

    @include m(card) {
      width: 100%;
      padding: 20px;
      margin-right: 10px;
      background-color: #ffffff;

      &:last-child {
        margin-right: 0;
      }

      @include el-joins(form) {
        width: 100%;
      }
    }
  }
}
</style>
