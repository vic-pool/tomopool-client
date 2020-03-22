import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: 'dashboard',
        component: DashboardLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue')
            },
            {
                path: '/staker/:address',
                name: 'stakerView',
                component: () => import(/* webpackChunkName: "demo" */ './views/Staker.vue')
            },
            {
                path: '/profile',
                name: 'profile',
                component: () => import(/* webpackChunkName: "demo" */ './views/UserProfile.vue')
            }
        ]
    },
    {
        path: '/',
        redirect: 'staking',
        component: DashboardLayout,
        children: [
            {
                path: '/staking/:address',
                name: 'staking',
                component: () => import(/* webpackChunkName: "demo" */ './views/Staking.vue')
            },
            {
                path: '/unStaking/:address',
                name: 'unstaking',
                component: () => import(/* webpackChunkName: "demo" */ './views/UnStaking.vue')
            },
            {
                path: '/voteResign/:address',
                name: 'voteResign',
                component: () => import(/* webpackChunkName: "demo" */ './views/VoteResign.vue')
            },
            {
                path: '/unVoteResign/:address',
                name: 'unVoteResign',
                component: () => import(/* webpackChunkName: "demo" */ './views/UnVoteResign.vue')
            },
            {
                path: '/transferStake/:address',
                name: 'transferStake',
                component: () => import(/* webpackChunkName: "demo" */ './views/TransferStake.vue')
            },
            {
                path: '/result/:type/:candidate/:amount/:hash',
                name: 'Result',
                component: () => import(/* webpackChunkName: "demo" */ './views/Result.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
