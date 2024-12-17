<script setup lang="ts">
const questionsAndAnswers = [
  {
    label: '如何訂購？',
    content: '因官方網站開發中，目前我們提供 LINE官方帳號 和 IG私訊 兩種訂購方式。請提供訂購人姓名、聯絡電話、全家店到店取貨門市、品項及數量，我們將盡快與您確認訂單細節。',
    value: 'Q1'
  },
  {
    label: '商品有提供宅配或自取服務嗎？',
    content: '目前僅提供常溫全家店到店服務。',
    value: 'Q2'
  },
  {
    label: '下單後多久會到貨？',
    content: '因目前為檔期限定，商品會於檔期開始製作的日期後2-3天內到貨，可於LINE官方查詢訂單詳情。',
    value: 'Q3'
  },
  {
    label: '支援哪些付款方式？',
    content: '目前僅提供轉帳。',
    value: 'Q4'
  },
  {
    label: '甜點的保存方式及期限？',
    content: '詳情請見商品外包裝標籤。',
    value: 'Q5'
  },
  {
    label: '如何修改或取消訂單？',
    content: '如需修改或取消訂單，請於『付款前』通知我們（LINE或IG）。已付款的訂單恕無法取消，敬請理解。',
    value: 'Q6'
  },
  {
    label: '是否提供客製化或大量訂購？',
    content: '目前為一人手作工作室，無提供大量訂購，如需客製化，數量最少為10份，並請於14天前聯繫我們，謝謝！',
    value: 'Q7'
  },
  {
    label: '遇到商品損壞或問題怎麼辦？',
    content: '我們會確保商品妥善包裝出貨，但若收到商品有任何 損壞或品質問題，請拍照並於收到商品『24小時內』聯繫我們，我們會協助您處理。',
    value: 'Q8'
  },
]
</script>
<template>
  <div class="flex flex-col justify-center relative py-6 container">
    <div class="flex justify-center items-center text-center my-6 text-primary-900 text-xl font-bold">
      <NuxtImg
        src="/images/faq/QA.svg"
        width="26"
        height="26"
        class="mt-[2px]"
        alt=""
      />
      <div class="ml-2 text-[#A38669]">訂購Q&A</div>
    </div>
    <div class="flex border-y-[1px] border-solid mx-6">
      <Accordion class="w-full text-[#A38669]" type="multiple" collapsible>
        <AccordionItem  v-for="item in questionsAndAnswers" :value="item.value" :key="item.value" >
          <AccordionTrigger class="text-base"> {{ `◆ ${item.label}` }}</AccordionTrigger>
            <AccordionContent class="text-black text-sm">
              {{ item.content }}
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  </div>
</template>
<style scoped>
.container{
  background: url('../public/images/watermark_1.png') center/50% no-repeat fixed; /*背景需要浮水印*/
}
</style>