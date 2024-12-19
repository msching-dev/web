<script setup lang="ts">
const questionsAndAnswers = [
  {
    label: '如何訂購？',
    content:
      '因官方網站開發中，目前我們提供 ##LINE官方帳號 和 IG私訊## 兩種訂購方式。\n請提供訂購人姓名、聯絡電話、全家店到店取貨門市、品項及數量，\n我們將盡快與您確認訂單細節。',
    value: 'Q1',
  },
  {
    label: '商品有提供宅配或自取服務嗎？',
    content: '目前僅提供##常溫全家店到店##服務。',
    value: 'Q2',
  },
  {
    label: '下單後多久會到貨？',
    content:
      '因目前為檔期限定，商品會於檔期開始製作的日期後##2-3天##內到貨，可於LINE官方查詢訂單詳情。',
    value: 'Q3',
  },
  {
    label: '支援哪些付款方式？',
    content: '目前僅提供##轉帳/匯款##。',
    value: 'Q4',
  },
  {
    label: '甜點的保存方式及期限？',
    content: '詳情請見商品外包裝標籤。',
    value: 'Q5',
  },
  {
    label: '如何修改或取消訂單？',
    content:
      '如需修改或取消訂單，請於##『付款前』##通知我們（LINE或IG）。\n已付款的訂單恕無法取消，敬請理解。',
    value: 'Q6',
  },
  {
    label: '是否提供客製化或大量訂購？',
    content:
      '目前為一人手作工作室，無提供大量訂購，\n如需客製化，數量最少為##10份##，並請於##14天前##聯繫我們，謝謝！',
    value: 'Q7',
  },
  {
    label: '遇到商品損壞或問題怎麼辦？',
    content:
      '我們會確保商品妥善包裝出貨，\n但若收到商品有任何 損壞或品質問題，請拍照並於收到商品##『24小時內』##聯繫我們，我們會協助您處理。',
    value: 'Q8',
  },
]
</script>
<template>
  <main
    class="container flex flex-col justify-center py-6 bg-[url('/images/watermark_4.png')] bg-center bg-no-repeat bg-fixed bg-[length:50%] sm:bg-[length:40%] md:bg-[length:30%] lg:bg-[length:20%] xl:max-w-7xl"
  >
    <div
      class="flex justify-center items-center text-center text-primary-900 text-xl font-extrabold"
    >
      <img src="/images/faq/qa.svg" width="26" height="26" alt="qa" />
      <span class="ml-2 text-[#A38669]">訂購Q&A</span>
    </div>
    <Accordion class="w-full text-[#A38669]" type="multiple" collapsible>
      <AccordionItem
        v-for="item in questionsAndAnswers"
        :value="item.value"
        :key="item.value"
      >
        <AccordionTrigger>
          <div class="flex items-center space-x-1 text-base font-bold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <rect
                x="8"
                y="2.34314"
                width="8"
                height="8"
                rx="2"
                transform="rotate(45 8 2.34314)"
                fill="#A38669"
              />
            </svg>
            <span>{{ item.label }}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent class="text-black text-sm">
          <HighlightedText :text="item.content" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </main>
</template>
