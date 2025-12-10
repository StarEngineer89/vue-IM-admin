export const menuDate = [
    {
        index:'1',
        icon: 'HomeFilled',
        name:'主页',
        path:'home'
    },
    {
        index:'2',
        icon: 'Menu',
        name:'团体',
        childs:[
            { index:'2-1', name:'群组管理', path:'groupList' },
            { index:'2-2', name:'群体统计', path:'groupTJ' }
        ]
    },
    {
        index:'3',
        icon: 'Menu',
        name:'消息管理',
        childs:[
            { index:'3-1', name:'群聊记录', path:'chatGroup' },
            { index:'3-2', name:'单聊记录', path:'chatOne' }
        ]
    },
    {
        index:'4',
        icon: 'Menu',
        name:'邀请码',
        childs:[
            { index:'4-1', name:'邀请码管理', path:'inviteCode' }
        ]
    },
    // {
    //     index:'5',
    //     icon: 'Menu',
    //     name:'红包红包',
    //     childs:[
    //         { index:'5-1', name:'账单统计', path:'redZDTJ' },
    //         { index:'5-2', name:'使用账户', path:'redYH' },
    //         { index:'5-3', name:'充值记录', path:'redCZ' },
    //         { index:'5-4', name:'提现记录', path:'redTJ' },
    //         { index:'5-5', name:'一周记录', path:'redYZ' },
    //         { index:'5-6', name:'红包记录', path:'redJL' },
    //     ]
    // },
    // {
    //     index:'6',
    //     icon: 'Menu',
    //     name:'参数配置',
    //     childs:[
    //         { index:'6-1', name:'短信配置', path:'dataDX' },
    //         { index:'6-2', name:'常规配置', path:'dataCG' },
    //         { index:'6-3', name:'OSS配置', path:'dataOSS' },
    //         { index:'6-4', name:'全体会议', path:'dataHY' },
    //         { index:'6-5', name:'红包路线配置', path:'dataXL' },
    //         { index:'6-6', name:'敏感词管理', path:'dataMGC' },
    //         { index:'6-7', name:'黑名单', path:'dataHMD' }
    //     ]
    // },
    {
        index:'7',
        icon: 'Menu',
        name:'运营管理',
        childs:[
            { index:'7-1', name:'投诉管理', path:'operationTS' }
        ]
    },
    {
        index:'8',
        icon: 'Menu',
        name:'后台管理',
        childs:[
            { index:'8-1', name:'后台用户管理', path:'userList' },
            { index:'8-2', name:'后台登入统计', path:'sysDLTJ' },
            { index:'8-3', name:'后台登入日志', path:'sysDLRZ' },
            { index:'8-4', name:'菜单管理', path:'menuList' },
            { index:'8-5', name:'角色权限管理', path:'roleList' }
        ]
    },
    {
        index:'9',
        icon: 'Menu',
        name:'用户',
        childs:[
            { index:'9-1', name:'用户管理', path:'userGL' },
            { index:'9-2', name:'登录日志', path:'userDL' },
            { index:'9-3', name:'注册统计', path:'userZC' },
            { index:'9-4', name:'登录统计', path:'userDLTJ' }
        ]
    }
]