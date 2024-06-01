<template>
  <div class="cet-content-aside" :class="{ 'self-active': isCollapsed }">
    <div class="cet-content-aside-sidebar" :style="`width: ${asideWidth}`">
      <slot name="aside" />
    </div>
    <div class="cet-content-aside-line">
      <div class="cet-content-aside-btn" @click="evCollapseBtnClick">
        <svg-icon
          class="cet-content-aside-btn-icon important-w-[12px] important-h-[12px]"
          icon-class="arrow-left"
        />
      </div>
    </div>
    <div class="cet-content-aside-container">
      <slot name="container" />
    </div>
  </div>
</template>
<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon/index.vue";

defineOptions({
  name: "CetAside",
  inheritAttrs: false,
});

/*
事件定义
*/
const emit = defineEmits(["collapse"]);

const props = withDefaults(
  defineProps<{
    asideWidth: string;
  }>(),
  {
    asideWidth: "300px",
  }
);

const isCollapsed = ref<boolean>(false);

function evCollapseBtnClick() {
  isCollapsed.value = !isCollapsed.value;
  emit("collapse", { isCollapsed: isCollapsed.value });
}
</script>
<style lang="scss">
.cet-content-aside {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  &.self-active {
    .cet-content-aside-sidebar {
      width: 10px !important;
      padding: 0;
      visibility: hidden;
    }
    .cet-content-aside-btn {
      left: -10px;
    }
    .cet-content-aside-btn-icon {
      transform: rotate(180deg);
      fill: #fff;
    }
  }
}
.cet-content-aside-sidebar {
  width: 300px;
  box-sizing: border-box;
  transition-duration: 0.3s;
  overflow: hidden;
  flex-shrink: 0;
  padding: 16px;
  @include background_color(BG1);
}
.cet-content-aside-line {
  position: relative;
  width: 1px;
  @include background_color(B1);
}
.cet-content-aside-btn {
  position: absolute;
  top: 50%;
  left: -5px;
  transform: translateY(-50%);
  width: 10px;
  height: 80px;
  border-radius: 4px;
  @include background_color(ZS);
  box-sizing: border-box;
  fill: #fff;
  cursor: pointer;
  transition-property: width;
  transition-duration: 0.3s;
  &-icon.svg-icon {
    width: 12px;
    height: 12px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -6px;
    margin-left: -6px;
  }
  &:hover {
    @include background_color(F1);
  }
}
.cet-content-aside-container {
  display: block;
  flex: 1;
  flex-basis: auto;
  margin-left: 16px;
  padding: 16px;
  overflow: hidden;
  @include background_color(BG1);
}
</style>
