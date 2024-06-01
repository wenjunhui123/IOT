import type { Ref } from "vue"

interface UsePaginationResponse {
    currentPage: Ref<number>
    pageSize: Ref<number>
    pageSizes:Ref<number[]>
    totalCount: Ref<number>
    layout:Ref<string>
    skipCount: Ref<number>
    sizeChange: (val:number) => void
    currentChange: (val:number) => void
    reset: () => void
  }
interface PageParams {
    currentPage?: Ref<number>
    pageSize?: Ref<number>
    pageSizes?:Ref<number[]>
    totalCount?: Ref<number>
    layout?: Ref<string>
}

export function usePagination(pageParams?: PageParams): UsePaginationResponse{
    const pageSize = ref(pageParams?.pageSize ?? 10)
    const pageSizes = ref(pageParams?.pageSizes ?? [10, 20, 50, 100])
    const currentPage = ref(pageParams?.currentPage ?? 1)
    const totalCount = ref(pageParams?.totalCount ?? 0)
    const layout = ref(pageParams?.layout ?? "total, sizes, prev, pager, next, jumper")
    const skipCount = computed(() => (currentPage.value - 1) * pageSize.value)

    function sizeChange(val: number) {
        pageSize.value = val
    }
     
    function currentChange(val: number) {
        currentPage.value = val
    }

    function reset() {
        currentPage.value = 1
        totalCount.value = 0
      }
  
    return { currentPage, pageSize,pageSizes, totalCount, layout,skipCount,sizeChange,currentChange, reset }

  }