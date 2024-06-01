<template>
  <div class="wrapper">
    <div :style="labelStyle" class="prepend">{{ label }}</div>
    <slot class="slot-main"></slot>
  </div>
</template>
<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    labelWidth: string | number;
  }>(),
  {
    label: "",
    labelWidth: "",
  }
);

const labelStyle = computed(() => {
  return props.labelWidth ? `width: ${props.labelWidth}px;` : "";
});
</script>
<style lang="scss" scoped>
.wrapper {
  display: inline-flex;
  align-items: center;
  border: 1px solid;
  @include border_color(B1);
  border-radius: 4px;
  .prepend {
    font-size: 14px;
    text-align: center;

    @include unify-theme-parent() using ($element-var, $theme) {
      $border-color: map-deep-get($element-var, $theme, "--border-color-base");
      color: map-deep-get($element-var, $theme, "--el-menu-active-color");
      border: 0px solid $border-color;
      background: map-deep-get($element-var, $theme, "bg-card");
    }
    @include font_color(ZS);
    line-height: 30px;
    height: 32px;

    white-space: nowrap;
    padding: 0 16px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    box-sizing: border-box;

    + div {
      // for date-picker
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
  }
  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0 var(--el-input-hover-border-color) inset !important;
  }
  :deep() {
    // for el-select & input
    .el-select .el-input.is-focus .el-input__wrapper {
      box-shadow: 0 0 0 0 var(--el-input-hover-border-color) inset !important;
    }
    input {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }
    .el-input__inner:focus + .wrapper {
      @include border_color(ZS);
    }
  }
  &:hover {
    @include border_color(ZS);
  }
}
</style>
