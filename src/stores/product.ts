import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useProductStore = defineStore("product", () => {
  const productId = ref(0);
  const isJumpProduct = ref(false);
  function changeProductId(id: number) {
    productId.value = id;
  }
  function changeJumpProductStatus(val: boolean) {
    isJumpProduct.value = val;
  }

  return { productId,isJumpProduct, changeProductId,changeJumpProductStatus };
});
