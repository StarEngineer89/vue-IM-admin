<template>
    <el-dialog :title="title" v-model="isshow" width="500px" top="5vh" >
        <el-form label-width="80px">
            <el-form-item label="层级">
                <el-select v-model="param.level" placeholder="请选择" clearable>
                    <el-option label="一级菜单" :value="1" />
                    <el-option label="二级菜单" :value="2" />
                    <el-option label="页面按钮" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="一级菜单" v-if="param.level == 3">
                 <el-select v-model="one" placeholder="请选择" clearable @change="ChangeOne()">
                    <el-option :label="item.name" :value="item.id" v-for="(item, index) in menuList1" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="上级ID" v-if="param.level == 3">
                 <el-select v-model="param.parent_id" placeholder="请选择" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="(item, index) in menuList2" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="上级ID" v-if="param.level == 2">
                <!-- <el-input  v-model="param.parent_id" placeholder="请输入" clearable /> -->
                 <el-select v-model="param.parent_id" placeholder="请选择" clearable>
                    <el-option :label="item.name" :value="item.id" v-for="(item, index) in menuList1" :key="index" />
                </el-select>
            </el-form-item>
            <el-form-item label="菜单名称">
                <el-input  v-model="param.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="图标" v-if="param.level != 3">
                <el-input  v-model="param.icon" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="路径">
                <el-input  v-model="param.path" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="param.status" placeholder="请选择" clearable>
                    <el-option label="开启" :value="1" />
                    <el-option label="关闭" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="param.remark" placeholder="备注" :autosize="{ minRows: 2, maxRows: 4 }" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="isshow = false">取消</el-button>
                <el-button type="primary" @click="Submit()">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const isshow = ref(false);
    const title = ref('')
    const param = ref({})
    const menuList1 = inject('menuList1')
    const one = ref('')
    const menuList2 = ref([])
    const emit = defineEmits(['query']); //emit('query'); 
    defineExpose({ Open })
    

    function Open(data){
        param.value = {path:'', status: 1};
        if(data){
            title.value = '编辑菜单'
            let json = JSON.parse(JSON.stringify(data))
            delete json.children;
            json.parent_id = json.upId;
            delete json.upId;
            param.value = json; 
        }
        else{
            title.value = '新增菜单'
        }
        isshow.value = true;
    }
    function Submit(){
        if(title.value == '新增菜单'){
            let loading = tips.loading('提交中');
            axios.post('admin/links/add', param.value).then( res => {
                if (res.status == 200) {
                    tips.success('新增成功')
                    isshow.value = false;
                    emit('query')
                }
                else tips.error(res.msg)
            }).finally(()=>{ loading.close(); });
        }
        else{
            let loading = tips.loading('提交中');
            axios.post('/admin/links/edit', param.value).then( res => {
                if (res.status == 200) {
                    tips.success('编辑成功')
                    isshow.value = false;
                    emit('query')
                }
                else tips.error(res.msg)
            }).finally(()=>{ loading.close(); });
        }
    }

    function ChangeOne(){
        //console.log(menuList1.value);
        //console.log(one.value);
        let list = JSON.parse(JSON.stringify(menuList1.value)).find(item => item.id == one.value).children;
        //console.log(list);
        menuList2.value = list;
    }
</script>

<style scoped></style>