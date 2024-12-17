<script setup lang="ts">
const payRules = [
  '下訂成功會收到##LINE官方 or IG##回覆訂單詳情，\n確認無誤後，請匯款至蜜絲晴，並提供##銀行末5碼##以便我們確認是否收到款項',
  '訂單的最終處理需由店家確認後方可執行。',
  '目前付款方式僅接受##匯款##。',
  '本店部分產品可能含有##過敏原（如堅果、乳製品、麩質等）##，\n詳情請見商品包裝標籤！顧客需自行負責確認產品成分是否符合個人需求。',
  '所有產品的價格均以網站上標示的價格為準，並不包括運費等附加費用。',
  '我們尊重顧客的隱私，所有個人資料將僅用於處理顧客的訂單，並不會透露給第三方。',
  '購物過程中收集的所有資料將根據我們的隱私政策進行保護。',
  '若您##未滿18歲##，請在父母或法定監護人的同意下使用我們的網站進行訂購。',
  '訂單狀態為##『已付款』##，無法修改或取消。\n如果需要修改或取消訂單，請於付款前盡快聯繫我們，我們將為您處理。'
]

const shipRules = [
  '目前僅提供##『全家店到店』##配送。',
  '所有商品在配送過程中，\n若遇到損壞、遺失或延遲等問題，\n我們將盡力協助顧客與物流公司協調處理，\n但本店對於配送過程中的損失不負責。',
  '因目前為檔期限定販售，\n配送時間為限定檔期出貨日後的##2-3天##到貨（花東及外島地區除外），\n如遇天災、交通阻塞、疫情等不可抗力因素，\n可能會影響配送時間或造成延誤，我們無法對此負責，敬請見諒。',
  '若遇到配送延誤或無法按時交付，\n我們會主動聯繫顧客進行協調。',
  '請在訂購前確認提供的取件店鋪是否正確。\n如果配送店鋪錯誤或不完整，導致商品無法送達或退回，\n顧客需自行承擔額外的配送費用，敬請見諒。',
  '若需修改配送店鋪，請於訂單##『付款前』##立即與我們聯繫。發貨後將無法修改店鋪。',
  '烘焙產品屬於食品類商品，通常不提供退換服務，除非產品存在明顯瑕疵或誤送情況。',
  '若收到的商品存在問題（如錯誤配送、破損等），\n請在##『24小時』##內與我們聯繫，提供訂單編號和問題照片，我們會處理退款或更換。',
  '若發生任何配送問題（如商品丟失、損壞、延遲等），\n請聯繫我們的客服。我們將在48小時內回應並協助處理。',
  '在收到顧客報告後，我們將與物流公司協商解決方案。\n若確認為配送方責任，我們將提供賠償或替換商品。'
]
</script>
<template>
  <div class="container flex flex-col justify-center my-6 text-primary-900 text-2xl font-extrabold px-6">
    <div
        class="h-9 w-full px-3 flex items-center justify-between mt-6 bg-[#F1E1C5] rounded-lg"
      >
        <img src="/images/products/detail/cake.png" class="w-5 h-5" />
        <span class="text-base font-bold text-[#4C3232]">歡迎您蒞臨蜜絲晴MS.CHING官方網站</span>
        <img src="/images/products/detail/cake.png" class="w-5 h-5" />
    </div>
    <div class="flex items-center mt-8 mx-2 pb-1 border-b-[1px] border-solid border-[#B99F85]">
       <NuxtImg
          src="/images/terms/paper.png"
          width="26"
          height="26"
          alt=""
        />
        <div class="ml-1 text-[#A38669] font-bold text-base">訂購條款</div>
    </div>
    <div class="flex mx-8 mt-2 text-[#4C3232] text-sm">
      <ul class="list-disc">
        <li class="mt-3" v-for="(rule, index) in payRules" :key="`pay_${index}`"><HighlightedText :text="rule" /></li>
      </ul>
    </div>
    <div class="flex items-center mt-12 mx-2 pb-1 border-b-[1px] border-solid border-[#B99F85]">
       <NuxtImg
          src="/images/terms/store.png"
          width="26"
          height="26"
          alt=""
        />
        <div class="ml-1 text-[#A38669] font-bold text-base">商品配送風險相關</div>
    </div>
    <div class="flex mx-8 mt-2 text-[#4C3232] text-sm">
      <ul class="list-disc">
        <li class="mt-3" v-for="(rule,index) in shipRules" :key="`ship_${index}`"><HighlightedText :text="rule" /></li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.container{
  background: url('../public/images/watermark_1.png') center/50% no-repeat fixed; /*背景需要浮水印*/
}
</style>
