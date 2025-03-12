<script setup lang="ts">
const { formatTimestampToDateRange, formatTimeStampToDate } = useHelpers();
const menus = [
    {
        title:'全部消息',
        icon:'new_icon',
        type: 'all'
    },
    {
        title:'新品上市',
        icon:'new_icon',
        type: 'new'
    },
    {
        title:'優惠折扣',
        icon:'discount',
        type: 'discount'
    },
    {
        title:'節慶活動',
        icon:'festival',
        type: 'festival'
    },
]

const testActivities = [
    {
        title:'新品上市',
        content:'新品上市新品上市新品上市新品上市新品上市新品上市新品上市新品上市新品上市新品上市新品上市新品上市',
        'activity_type':'newItem',
        item:'almondCookie',
        'release_time':1741731677,
        'period_start_time':12312313123,
        'period_end_time': 12313132123
    },
    {
        title:'折扣活動',
        content:'折扣活動折扣活動折扣活動折扣活動折扣活動折扣活動折扣活動折扣活動折扣活動折扣活動折扣活動',
        'activity_type':'discount',
        item:'thaiTeaMadeleine',
        'release_time':null,
        'period_start_time':1741731677,
        'period_end_time': 1741904477
    },
    {
        title:'節慶活動',
        content:'節慶活動節慶活動節慶活動節慶活動節慶活動節慶活動節慶活動節慶活動節慶活動節慶活動節慶活動',
        'activity_type':'festival',
        item:'quartetMadeleine',
        'release_time':null,
        'period_start_time':1741731677,
        'period_end_time': 1741904477
    }
]

const getActivityClass = (activityType)=>{
    switch(activityType){
        case 'newItem':
            return {
                card:'new-item-card',
                button: 'new-item-btn'
            }
        case 'discount':
            return {
                card:'discount-card',
                button: 'discount-btn'
            }
        case 'festival':
            return {
                card:'festival-card',
                button: 'festival-btn'
            }
    }
}

const formatActivityTime = (row) =>{
    if(row.activity_type === 'newItem') {
       return `發佈日期: ${formatTimeStampToDate(row.release_time)}`
    }else {
        return `${row.activity_type === 'discount'? '折扣期間:':'節慶期間:'} ${formatTimestampToDateRange(row.period_start_time,row.period_end_time)}`
    }
}
</script>
<template>
  <main class="container relative py-6 xl:max-w-7xl font-[Inter]">
   <div class="flex flex-col mt-6">
        <div class="flex justify-between space-x-2">
            <div v-for="(menu,idx) in menus" :key="`news_menu_${idx}`" class="flex flex-1 relative w-auto h-full bg-[#E1DBD0] p-3 justify-center items-center rounded-[10px]">
                <span class="text-[#4C3232] font-semibold text-[13px]">
                    {{ menu.title }}
                </span>
            </div>
        </div>
   </div>
   <div class="flex flex-col mt-8 space-y-6">
        <div v-for="(activity,idx) in testActivities" :key="`activity_${idx}`" class="flex space-x-4 p-5 w-full h-[184px] rounded-[5px]" :class="[getActivityClass(activity.activity_type).card]">
            <div class="flex basis-[40%] flex-col space-y-4">
                <img class="w-[123px] h-[102px] rounded-[5px] object-cover" :src="`/images/products/${activity.item}/2.png`"/>
                <div class="text-[10px] font-[500]">{{ formatActivityTime(activity) }}</div>
            </div>
            <div class="flex relative flex-col basis-[60%]">
                <img class="w-[60px] h-auto absolute top-[-36px] right-[-40px] rotate-[20deg]" :src="`/images/news/${activity.activity_type}.png`"/>
                <div class="mb-2 text-base font-semibold text-[#4C3232] text-start">{{ activity.title }}</div>
                <p class="text-sm font-[400] text-[#4C3232] text-start">
                    {{ activity.content }}
                </p>
                <button class="absolute right-0 bottom-[-6px] w-[96px] h-auto py-2  text-white rounded-[4px]" :class="[getActivityClass(activity.activity_type).button]">查看詳情</button>
            </div>
        </div>
   </div>
  </main>
</template>
<style scoped>
.new-item-card{
    background-color: #F1E1C5;
    border: 3px solid #DFC69E;
}
.new-item-btn{
    background-color: #9C7E5F;
    border: 2px solid #866255;
}
.discount-card{
    background-color: #F1D4C5;
    border: 3px solid #CEA96D;
}
.discount-btn{
    background-color: #965413;
    border: 2px solid #866255;
}
.festival-card{
    background-color: #F1E1C5;
    border: 3px solid #DFC69E;
}
.festival-btn{
    background-color: #965413;
    border: 2px solid #866255;
}
</style>