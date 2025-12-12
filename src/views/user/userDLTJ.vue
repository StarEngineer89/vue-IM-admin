<template>
    <div class="login-stats-page">
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
        </div>

        <!-- Content Section -->
        <div class="page-content">
            <el-scrollbar height="100%">
                <div class="stats-list" v-if="Object.keys(tableData).length > 0">
                    <div 
                        v-for="(value, key) in tableData" 
                        :key="key"
                        class="stats-item"
                        :class="{ expanded: expandedDates.includes(key) }"
                    >
                        <div class="stats-header" @click="toggleExpand(key)">
                            <div class="date-info">
                                <i class="el-icon-date date-icon"></i>
                                <span class="date-text">{{ formatDate(key) }}</span>
                            </div>
                            <div class="stats-summary">
                                <span class="summary-text">
                                    当日{{ value.total || value.users_count || 0 }}人登录(共{{ value.count || value.total_count || 0 }}次记录)
                                </span>
                            </div>
                            <i class="el-icon-arrow-up expand-icon" :class="{ rotated: expandedDates.includes(key) }"></i>
                        </div>
                        
                        <div class="stats-details" v-show="expandedDates.includes(key)">
                            <div class="user-list">
                                <div 
                                    v-for="(user, index) in (value.users || value.list || [])" 
                                    :key="index"
                                    class="user-item"
                                >
                                    <el-avatar 
                                        :src="user.avatar || user.headimg || ''" 
                                        :size="40"
                                        class="user-avatar"
                                    >
                                        <i class="el-icon-user"></i>
                                    </el-avatar>
                                    <div class="user-info">
                                        <div class="user-name">{{ user.name || user.username || user.nickname || '未知用户' }}</div>
                                        <div class="user-login-count">{{ user.count || user.login_count || 1 }}次登录</div>
                                    </div>
                                </div>
                                <div v-if="(!value.users || value.users.length === 0) && (!value.list || value.list.length === 0)" class="no-users">
                                    <el-empty description="暂无用户数据" :image-size="80" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="empty-state">
                    <el-empty description="暂无登录统计数据" />
                </div>
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({});
    const tableData = ref({})
    const expandedDates = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('/admin/analyse/countLogins', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list || {};
                // Auto-expand the first date if available
                const dates = Object.keys(tableData.value)
                if (dates.length > 0 && expandedDates.value.length === 0) {
                    expandedDates.value = [dates[0]]
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
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
    }
</script>

<style scoped>
.login-stats-page {
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

.user-list {
    padding-left: 0;
}

.user-item {
    display: flex;
    align-items: center;
    padding: 10px 0;
    margin-bottom: 8px;
}

.user-item:last-child {
    margin-bottom: 0;
}

.user-avatar {
    margin-right: 12px;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.user-name {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
    margin-bottom: 4px;
    line-height: 1.4;
}

.user-login-count {
    font-size: 12px;
    color: #909399;
}

.no-users {
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
