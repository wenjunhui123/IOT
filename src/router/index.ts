import { createRouter, createWebHistory,  } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'



// 静态路由
export const constantRoutes: RouteRecordRaw[] = [  
    {
      path: '/',
      component: () => import('@/layout/index.vue'),
      children: [
       
      ]
    }
  ];

export const router = createRouter({
  history: createWebHistory(),
    routes: constantRoutes as RouteRecordRaw[],
   // 刷新时，滚动条位置还原
   scrollBehavior: () => ({ left: 0, top: 0 })
})

/**
 * 重置路由
 */
export function resetRouter() {
    router.replace({ path: '/login' });
    location.reload();
  }
  
router.beforeEach((to, from, next) => { 
    next();
}) 

export default router;
