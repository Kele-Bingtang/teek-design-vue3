<script setup lang="ts">
import { Tooltip } from "@/components";
</script>

<template>
  <el-space fill alignment="normal" style="width: 100%">
    <el-card shadow="never" class="tk-card-minimal" header="文字溢出提示组件">
      <div>
        <Tooltip>
          请将鼠标放到我身上，请将鼠标放到我身上，
          <span style="color: var(--el-color-primary)">我没有溢出当前一行，所以鼠标悬停没有提示</span>
        </Tooltip>
      </div>
      <el-divider />
      <div>
        <Tooltip :line="2">
          请将鼠标放到我身上，请将鼠标放到我身上，请将鼠标放到我身上，请将鼠标放到我身上，请将鼠标放到我身上，请将鼠标放到我身上，请将鼠标放到我身上，请将鼠标放到我身上，请将鼠标放到我身上，
          <span style="color: var(--el-color-primary)">我没有溢出当前两行，所以鼠标悬停没有提示</span>
        </Tooltip>
      </div>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal" header="文字溢出提示组件">
      <div style="width: 400px">
        <Tooltip>
          请将鼠标放到我身上，可以看到单行文字溢出提示，单行文字溢出提示，单行文字溢出提示，单行文字溢出提示
        </Tooltip>
      </div>
      <el-divider />
      <div style="width: 400px">
        <Tooltip :line="2">
          请将鼠标放到我身上，可以看到多行文字溢出提示，多行文字溢出提示，多行文字溢出提示，多行文字溢出提示，多行文字溢出提示
        </Tooltip>
      </div>
    </el-card>

    <el-card shadow="never" class="tk-card-minimal">
      <el-descriptions title="配置项 📚" :column="1" border>
        <el-descriptions-item label="line">
          多少行文字溢出开始省略并气泡提示。`number` 类型，默认为 1
        </el-descriptions-item>
        <el-descriptions-item label="realTime">
          是否开启每次鼠标悬停时判断文字是否溢出（适用于元素默认隐藏，需要鼠标悬停触发的场景），如果不开启，则初始化页面时只判断一次，并缓存是否文字溢出提示，不会因为后续文字变化而重新判断是否溢出。`boolean`
          类型，默认为 `false`
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </el-space>
</template>

<style lang="scss" scoped></style>
