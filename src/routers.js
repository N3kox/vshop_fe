import home from './components/home.vue'
import register from './components/register.vue'
import done from './components/done.vue'
import uInfo from './components/uInfo.vue'
import manageLogin from './components/manage_login.vue'
import adminHome from './components/admin_home.vue'

//user
import myOrders from './children/myOrders.vue'
import userSettings from './children/userSettings.vue'
import uploadItem from './children/uploadItem.vue'
import myItems from './children/myItems.vue'

//admin
import userManage from './children/user_manage.vue'
import itemManage from './children/item_manage.vue'

const routers = [
    {
        path: '/',
        component : home,
    },
    {
        path: '/reg',
        component : register,
    },
    {
        path: '/done',
        component : done
    },
    {
        path : '/user',
        component : uInfo,
        name : 'userInfo',
        redirect:'/user/orders',
        children :[
            {path : 'orders', name : '我的订单', component : myOrders},
            {path : 'settings', name : '用户信息', component : userSettings},
            {path : 'myItems', name : '我的商品', component : myItems},
            {path : 'upload', name : '上传商品', component : uploadItem},
        ]
    },
    {
        path : '/mlogin',
        component : manageLogin,
    },
    {
        path : '/adminhome',
        component : adminHome,
        name : 'adminhome',
        redirect : '/adminhome/item_manage',
        children : [
            {path : 'item_manage', name : '商品管理', component : itemManage},
            {path : 'user_manage', name : '用户管理', component : userManage},
        ]
    }

]

export default routers