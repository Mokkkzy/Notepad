import './index.scss';
import dateToString from '../../tool/dateToString.js';
let _index = -1;
export default {
    data() {
        return {
            menulist: [],
            active: "all",
            dialog: {
                isOpen: false,
                title: "",
                type: "",
                value: {
                    title: "",
                    remark: "",
                    type: ""
                }
            },
            types: {
                remark: "随笔",
                work: "工作",
                study: "学习",
                willdo: "代办"
            }
        }
    },
    onLoad() {
        this.menulist = JSON.parse(uni.getStorageSync('notepad-menu') || "[]");
    },
    methods: {

        // 弹框确认
        doBack() {
            this.dialog.isOpen = false;

            // type=add 新增
            if (this.dialog.type == 'add') {
                let newKey = new Date().valueOf();
                this.menulist.push({
                    key: newKey,
                    title: this.dialog.value.title,
                    remark: this.dialog.value.remark,
                    type: this.dialog.value.type,
                    date: dateToString()
                });
                uni.setStorageSync('notepad-editor-' + newKey, '');
            }

            // type=editor修改
            else if (this.dialog.type == 'editor') {
                this.menulist[_index].title = this.dialog.value.title;
                this.menulist[_index].remark = this.dialog.value.remark;
                this.menulist[_index].type = this.dialog.value.type;
                this.menulist[_index].date = dateToString();
            }

            // 存储起来
            uni.setStorageSync('notepad-menu', JSON.stringify(this.menulist));

        },

        // 打开删除弹框
        openDeleteDialog(index, key) {

            uni.showModal({
                title: '温馨提示',
                content: '是否删除此备忘页',
                success: res => {
                    if (res.confirm) {
                        this.menulist.splice(index, 1);
                        uni.setStorageSync('notepad-menu', JSON.stringify(this.menulist));
                        uni.removeStorageSync('notepad-editor-' + key);
                    }
                }
            });

        },

        // 打开编辑弹框
        openEditorDialog(index) {
            _index = index;
            let curItem = this.menulist[_index];
            this.dialog = {
                isOpen: true,
                title: "编辑",
                type: "editor",
                value: {
                    title: curItem.title,
                    remark: curItem.remark,
                    type: curItem.type
                }
            }
        },

        // 打开新增弹框
        openAddDialog() {
            this.dialog = {
                isOpen: true,
                title: "新增",
                type: "add",
                value: {
                    title: "",
                    remark: "",
                    type: this.active == 'all' ? "remark" : this.active
                }
            }
        },

        // 打开编辑内容界面
        openEditor(index) {
            let item = this.menulist[index];
            uni.navigateTo({
                url: `/pages/editor/editor?key=${item.key}&name=${item.title}`,
                fail: error => {
                    console.log(error);
                }
            });
        }

    }
}
