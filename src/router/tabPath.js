export default {
    home: ()=>import('../views/home.vue'),

    groupList: ()=>import('../views/group/groupList.vue'),
    groupTJ: ()=>import('../views/group/groupTJ.vue'),

    chatGroup: ()=>import('../views/chat/chatGroup.vue'),
    chatOne: ()=>import('../views/chat/chatOne.vue'),

    inviteCode: ()=>import('../views/invite/inviteCode.vue'),

    redZDTJ: ()=>import('../views/red/redZDTJ.vue'),
    redYH: ()=>import('../views/red/redYH.vue'),
    redCZ: ()=>import('../views/red/redCZ.vue'),
    redTJ: ()=>import('../views/red/redZDTJ.vue'),
    redYZ: ()=>import('../views/red/redYZ.vue'),
    redJL: ()=>import('../views/red/redJL.vue'),

    dataDX: ()=>import('../views/data/data-dx.vue'),
    dataCG: ()=>import('../views/data/data-cg.vue'),
    dataOSS: ()=>import('../views/data/data-oss.vue'),
    dataHY: ()=>import('../views/data/data-hy.vue'),
    dataXL: ()=>import('../views/data/data-xl.vue'),
    dataMGC: ()=>import('../views/data/data-mgc.vue'),
    dataHMD: ()=>import('../views/data/data-hmd.vue'),

    operationTS: ()=>import('../views/operation/operationTS.vue'),

    userList: ()=>import('../views/sys/userList.vue'),
    sysDLTJ: ()=>import('../views/sys/DLTJ_List.vue'),
    sysDLRZ: ()=>import('../views/sys/DLRZ_List.vue'),
    menuList: ()=>import('../views/sys/menuList.vue'),
    roleList: ()=>import('../views/sys/roleList.vue'),

    userGL: ()=>import('../views/user/userGL.vue'),
    userDL: ()=>import('../views/user/userDL.vue'),
    userZC: ()=>import('../views/user/userZC.vue'),
    userDLTJ: ()=>import('../views/user/userDLTJ.vue'),
}