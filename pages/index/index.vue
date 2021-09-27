<template>
    <view class="menu-view">

        <view class="nav">
            <text :class='{active:active=="all"}' @click='active="all"'>全部</text>
            <text v-for="(value,key) in types" :key='key' :class='{active:active==key}'
                @click='active=key'>{{value}}</text>

            <!-- 新增按钮 -->
            <text class='btn' @click="openAddDialog"></text>
        </view>

        <!-- 列表 -->
        <view class="list">
            <view class="list-item" v-for="(item,index) in menulist" :key='index'
                v-if='item.type==active || active=="all"' @click="openEditor(index)">
                <view class="title" :class="item.type">
                    {{item.title}}
                </view>
                <view class="info">
                    {{item.remark}}
                </view>
                <view class="date">
                    {{item.date}}
                </view>

                <!-- 操作按钮 -->
                <view class="btn delete" @click.stop="openDeleteDialog(index,item.key)">
                    删除
                </view>
                <view class="btn editor" @click.stop="openEditorDialog(index)">
                    编辑
                </view>
            </view>
        </view>

        <!-- 弹框(新增、编辑) -->
        <view class="dialog" v-if="dialog.isOpen">
            <view class="view">
                <view class="title">
                    {{dialog.title}}
                </view>
                <view class="input-item">
                    <text class='sub-title'>标题：</text>
                    <input class='input text' type="text" v-model="dialog.value.title" />
                </view>
                <view class="input-item">
                    <text class='sub-title'>说明：</text>
                    <textarea class='input text' v-model="dialog.value.remark" />
                </view>
                <view class="input-item">
                    <text class='sub-title'>分类：</text>
                    <radio-group class='input' @change="e=>{dialog.value.type=e.detail.value}">
                        <label class="radio" v-for="(value,key) in types" :key='key'>
                            <radio :value="key" :checked="dialog.value.type==key" />
                            <text>{{value}}</text>
                        </label>
                    </radio-group>
                </view>
                <view class="btn-list">
                    <button type="default" @click="dialog.isOpen=false">取消</button>
                    <button type="primary" @click="doBack()">确认</button>
                </view>
            </view>
        </view>

    </view>
</template>
<script src="./index.js"></script>
