import Mock from 'mockjs'


class R {
    code: number;
    data: any;
    message: string;
    constructor(code = 200, data = null, message = "成功") {
        this.code = code;
        this.data = data;
        this.message = message;
    }
    ok(data?: any, message?: string) {
        const l = arguments.length;
        if (l == 1) {
            return new R(200, data, "成功");
        } else if (l == 2) {
            return new R(200, data, message);
        } else {
            return new R(200, null, "成功");
        }
    }
    error(code?: any, message?: string) {
        const l = arguments.length;
        if (l == 1) {
            message = code;
            return new R(501, null, message);
        } else if (l == 2) {
            return new R(code, null, message);
        } else {
            return new R(501, null, "失败");
        }
    }
}
const r = new R();


interface MyObject {
    [key: string]: any;
}
const getParams = (str: string, method = 'get') => {
    if (!str) return {}
    if (method == 'get') {
        str = str.split('?')[1];
    }
    const arr = str.split('&');
    const obj: MyObject = {};
    arr.forEach(item => {
        const arr: string[] = item.split('=');
        obj[arr[0]] = arr[1]
    })
    return obj
}





Mock.setup({
    timeout: '200-500'
})


const permissions = Mock.mock(
    [
        {
            id: 1,
            parentId: 0, // 父菜单id
            type: 1, // 1目录、2菜单、3按钮
            isMenu: 1, // 是否在侧边显示为菜单
            path: '/system', // 路由路径
            // name: 'system',  // 路由组件名称
            label: '系统管理', // 路由名称
            sort: 2,  // 排序
            status: 1, // 路由状态0停用、1启用
            auth: '',  // 权限标识
            icon: 'Setting',  // 图标
            createDate: Mock.mock('@datetime'), // 创建时间
        },
        {
            id: 2,
            parentId: 1,
            type: 2,
            isMenu: 1,
            path: '/system/user',
            name: 'user', // 路由组件名称
            label: '用户管理',
            sort: 1,
            status: 0,
            auth: '',
            icon: 'User',
            createDate: Mock.mock('@datetime'),
        },
        {
            id: 3,
            parentId: 1,
            type: 2,
            isMenu: 1,
            path: '/system/role',
            name: 'role',
            label: '角色管理',
            sort: 2,
            status: 1,
            auth: '',
            icon: 'UserFilled',
            createDate: Mock.mock('@datetime'),
        },
        {
            id: 4,
            parentId: 1,
            type: 2,
            isMenu: 1,
            path: '/system/menu',
            name: 'menu',
            label: '菜单管理',
            sort: 1,
            status: 1,
            auth: '',
            icon: 'Menu',
            createDate: Mock.mock('@datetime'),
        },
        {
            id: 5,
            parentId: 0,
            type: 1,
            isMenu: 0,
            path: '/tool',
            name: 'tool',
            label: '系统工具',
            sort: 1,
            status: 0,
            auth: '',
            icon: '',
            createDate: Mock.mock('@datetime'),
        },

        {
            id: 6,
            parentId: 2,
            type: 3,
            isMenu: 0,
            label: '用户查询',
            sort: 1,
            status: 1,
            auth: 'system:user:query',
            createDate: Mock.mock('@datetime'),
        },
        {
            id: 7,
            parentId: 2,
            type: 3,
            isMenu: 0,
            label: '用户新增',
            sort: 2,
            status: 1,
            auth: 'system:user:add',
            createDate: Mock.mock('@datetime'),
        },
        {
            id: 8,
            parentId: 2,
            type: 3,
            isMenu: 0,
            label: '用户修改',
            sort: 3,
            status: 1,
            auth: 'system:user:edit',
            createDate: Mock.mock('@datetime'),
        },
        {
            id: 9,
            parentId: 2,
            type: 3,
            isMenu: 0,
            label: '用户删除',
            sort: 4,
            status: 1,
            auth: 'system:user:remove',
            createDate: Mock.mock('@datetime'),
        },
    ]
)

let userInfo1 = Mock.mock({
    "token": 'admin',
    "avatar": Mock.Random.image('200x200'),
    "username": 'admin',
    "nickname": '超级管理员'
})
let userInfo2 = Mock.mock({
    "token": '123456',
    "avatar": Mock.Random.image('200x200'),
    "username": '123456',
    "nickname": '普通用户'
})

// 登录 获取用户信息
Mock.mock('/api/login', 'post', (res: any) => {
    const params = getParams(res.body, 'post');
    if (params.username == 'admin' && params.password == 'admin') {
        return r.ok(userInfo1)
    } else if (params.username == '123456' && params.password == '123456') {
        return r.ok(userInfo2)
    }
    return r.error(501, '账号或密码有误')

})





// 获取路由菜单
Mock.mock(RegExp("/api/getRoutes" + ".*"), 'get', (res: any) => {
    const list = permissions;
    return r.ok(list)
})


// 获取用户信息
Mock.mock(RegExp("/api/getInfo" + ".*"), 'get', (res: any, a: any) => {
    const params = getParams(res.url);
    let data = {};
    console.log(params)
    if (params.token == 'admin') {
        data = {
            userInfo: userInfo1,
            permissions: [
                'system:user:query',
                'system:user:add',
                'system:user:edit',
                'system:user:remove',
            ],
            roles: ["admin"]
        };
    } else {
        data = {
            userInfo: userInfo2,
            permissions: [
                'system:user:query',
            ],
            roles: ["common"]
        };
    }

    return r.ok(data)

})
















// Mock.mock(RegExp("/api/*" + ".*"), (res: any) => {
//     let msg = '演示模式，不允许操作'
//     return r.error(500, msg)
// })

Mock.mock(RegExp("/api/*" + ".*"), 'put', (res: any) => {
    let msg = '演示模式，不允许操作'
    return r.error(500, msg)
})
Mock.mock(RegExp("/api/*" + ".*"), 'delete', (res: any) => {
    let msg = '演示模式，不允许操作'
    return r.error(500, msg)
})

