[
    {
        id: 1,
        level: 1,           //层级  1是一级菜单 2是子子菜单
        upId: null,         //上级id
        icon: 'HomeFilled', //菜单图标（你不用管 这个字段反给我 我来操作）
        name:'主页',    //菜单名字
        path:'home',   //前端页面的路径（你不用管 这个字段反给我 我来操作）
        status: 1,     //状态 1正常 0关闭（默认1）
        control: [],   //控制的功能（你不用管 这个字段反给我 我来操作）
        childs:[]      //下级菜单（你不用管 这个字段反给我 我来操作）
    },
    {
        id: 2,
        level: 1,
        icon: 'Menu',
        name:'团体',
        childs:[
            { 
                id: 21,
                level: 2,
                upId: 2, 
                name:'群组管理', 
                path:'groupList',
                status: 1,
                control: ['查询', '新增'，'编辑', '删除'] 
            },
            { 
                id: 22,
                level: 2, 
                upId: 2,
                name:'群体统计', 
                path:'groupTJ',
                status: 1, 
                control: ['查询', '新增'，'编辑', '删除']
            }
        ]
    },
    ...等等
]