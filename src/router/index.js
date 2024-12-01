import { createRouter, createWebHistory } from "vue-router"
import RouterComponent from "@/components/RouterComponent.vue"

const routes = [
    {
        path: '/router',
        name: 'home',
        component: RouterComponent
    },
    {
        path: "/:pathMatch(.*)*",
        component: RouterComponent
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router