<template>
    <div class="group-stats-page">
        <!-- Header Section -->
        <div class="page-header">
            <div class="header-left">
                <el-date-picker
                    v-model="param.timeList"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    style="width: 300px; margin-right: 10px;"
                />
                <el-button v-blur type="primary" icon="Search" @click="Query">查询</el-button>
            </div>
            <div class="header-right">
                <el-radio-group v-model="param.radio1" size="large">
                    <el-radio value="1">有效群</el-radio>
                    <el-radio value="2">无效群</el-radio>
                </el-radio-group>
            </div>
        </div>

        <!-- Content Section -->
        <div class="page-content">
            <el-scrollbar height="100%">
                <div class="stats-list" v-if="displayItems.length > 0">
                    <div 
                        v-for="item in displayItems" 
                        :key="item.key"
                        class="stats-item"
                        :class="{ expanded: expandedDates.includes(item.key) }"
                    >
                        <div class="stats-header" @click="toggleExpand(item.key)">
                            <div class="date-info">
                                <i class="el-icon-date date-icon"></i>
                                <span class="date-text">{{ formatDate(item.key) }}</span>
                            </div>
                            <div class="stats-summary">
                                <span class="summary-text">
                                    当日新增{{ getGroupCount(item.value) }}个群体
                                </span>
                            </div>
                            <i class="el-icon-arrow-up expand-icon" :class="{ rotated: expandedDates.includes(item.key) }"></i>
                        </div>
                        
                        <div class="stats-details" v-show="expandedDates.includes(item.key)">
                            <div class="group-list">
                                <div 
                                    v-for="(group, index) in extractGroups(item.value)" 
                                    :key="index"
                                    class="group-item"
                                >
                                    <el-avatar 
                                        :src="group.avatar || group.headimg || ''" 
                                        :size="40"
                                        class="group-avatar"
                                    >
                                        <i class="el-icon-user"></i>
                                    </el-avatar>
                                    <div class="group-info">
                                        <div class="group-name">{{ group.name || group.group_name || group.title || '未知群体' }}</div>
                                        <div class="group-meta">
                                            <span class="meta-text">群主：{{ group.manager || group.owner || group.nickname || group.username || '未知' }}</span>
                                            <span class="meta-text">成员：{{ group.member_count || group.members || group.count || group.memberTotal || 0 }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="extractGroups(item.value).length === 0" class="no-groups">
                                    <el-empty description="暂无群体数据" :image-size="80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <el-empty description="暂无群体统计数据" />
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const param = ref({ timeList: [], radio1: '1' })
    const tableData = ref({})
    const expandedDates = ref([])

    // 标准化列表，兼容对象或数组返回
    const displayItems = computed(() => {
        if (!tableData.value) return []
        if (Array.isArray(tableData.value)) {
            return tableData.value.map((item, index) => {
                const key = item?.date || item?.day || item?.time || item?.created_at || item?.key || item?.title || item?.name || `item-${index}`
                return { key, value: item }
            })
        }
        return Object.entries(tableData.value).map(([key, value]) => ({ key, value }))
    })

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        const payload = { ...param.value }
        if (Array.isArray(param.value.timeList) && param.value.timeList.length === 2) {
            payload.fromDate = param.value.timeList[0]
            payload.toDate = param.value.timeList[1]
        } else {
            payload.fromDate = param.value.fromDate
            payload.toDate = param.value.toDate
        }
        let loading = tips.loading('查询中')
        axios.post('/admin/groups/history', payload).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list || {}
                const dates = displayItems.value.map(item => item.key)
                if (dates.length > 0 && expandedDates.value.length === 0) {
                    expandedDates.value = [dates[0]]
                } else if (dates.length === 0) {
                    expandedDates.value = []
                }
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }

    //切换展开/收起
    function toggleExpand(date){
        const index = expandedDates.value.indexOf(date)
        if (index > -1) {
            expandedDates.value.splice(index, 1)
        } else {
            expandedDates.value.push(date)
        }
    }

    //格式化日期
    function formatDate(dateString){
        if (!dateString) return ''
        const date = new Date(dateString)
        if (Number.isNaN(date.getTime())) return dateString
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }

    //统计数量
    function getGroupCount(entry){
        if (entry === null || entry === undefined) return 0
        if (typeof entry === 'number') return entry
        if (typeof entry === 'string') return Number(entry) || 0
        if (Array.isArray(entry)) return entry.length
        return entry.total || entry.count || (entry.groups?.length ?? entry.list?.length ?? 0)
    }

    //提取群列表
    function extractGroups(entry){
        if (!entry) return []
        if (Array.isArray(entry)) return entry
        return entry.groups || entry.list || []
    }
</script>

<style scoped>
.group-stats-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

/* Header Section */
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-left {
    display: flex;
    align-items: center;
}

.header-right {
    display: flex;
    align-items: center;
}

/* Content Section */
.page-content {
    flex: 1;
    padding: 20px;
    overflow: hidden;
}

.stats-list {
    width: 100%;
    text-align: left;
}

.stats-item {
    margin-bottom: 16px;
}

.stats-header {
    display: flex;
    align-items: center;
    padding: 12px 0;
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid #e4e7ed;
}

.date-info {
    display: flex;
    align-items: center;
    min-width: 140px;
}

.date-icon {
    font-size: 18px;
    color: #409eff;
    margin-right: 8px;
    display: inline-block;
}

.date-text {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
}

.stats-summary {
    flex: 1;
    margin-left: 20px;
}

.summary-text {
    font-size: 14px;
    color: #606266;
}

.expand-icon {
    font-size: 18px;
    color: #909399;
    transition: transform 0.3s ease;
    margin-left: 12px;
    display: inline-block;
    cursor: pointer;
}

.expand-icon.rotated {
    transform: rotate(180deg);
}

/* Details Section */
.stats-details {
    padding: 12px 0;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        max-height: 0;
    }
    to {
        opacity: 1;
        max-height: 1000px;
    }
}

.group-list {
    padding-left: 0;
}

.group-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 8px;
}

.group-item:last-child {
    margin-bottom: 0;
}

.group-avatar {
    margin-right: 12px;
    flex-shrink: 0;
}

.group-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.group-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 4px;
    line-height: 1.4;
}

.group-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.meta-text {
    font-size: 12px;
    color: #909399;
}

.no-groups {
    padding: 20px;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 400px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .stats-header {
        flex-wrap: wrap;
    }
    
    .date-info {
        min-width: auto;
        width: 100%;
        margin-bottom: 8px;
    }
    
    .stats-summary {
        margin-left: 0;
        width: 100%;
    }
}
</style>