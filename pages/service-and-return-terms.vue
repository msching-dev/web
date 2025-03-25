<script setup lang="ts">
const payRules = [
  '我們透過網路平台提供各式烘焙甜點之訂購及超商宅配服務，\n並接受 ##LINE Pay 付款/信用卡付款/ATM轉帳付款##。\n服務適用範圍限於台灣地區（離島配送依實際情況評估）。',
  '所有商品皆為接單現做，訂購後無法取消或更改，\n##請務必確認後再下單##。',
  '##商品圖片僅供參考##，實際產品可能因手工製作而略有差異。',
  '訂購成功後，系統將發送確認通知至您的電子郵件或 LINE 帳戶。',
  '我們提供 ##LINE Pay 付款服務/信用卡付款服務/ATM轉帳付款服務##，\n請於結帳時選擇適合的付款方式。',
  '付款完成後，系統將發送訂單確認通知。',
  '產品皆以##常溫##方式寄送。',
  '商品製作及運送時間約需 ##5-7 個工作天##（不含假日）。',
  '若因不可抗力因素（如天災、物流延誤）導致配送延遲，我們將盡快通知您。',
  '我們對於因不可抗力因素（如天災、交通阻礙等）造成的延遲或配送異常不負責任。',
  '若因訂購人提供錯誤地址或聯絡資訊導致配送失敗，恕不補寄或退款。'
]

const shipRules = [
  '本店採固定出貨日，##每週二及每週五統一出貨##，並僅提供##全家店到店取貨##服務。\n實際配送時間將依照物流運輸進度為準，\n請耐心等待貨運配送至指定門市，並留意簡訊通知以便取貨',
  '退換貨適用範圍\n1.收到的商品與訂購內容不符。\n2.商品於運送過程中嚴重損壞，影響食用。\n3.商品有異味或品質問題（須提供開封照片為證）。',
  '申請退換貨流程\n請於收到商品 ##24 小時內##，\n透過 LINE 官方帳號或客服信箱聯繫我們，並提供\n1.訂單號碼\n2.商品問題照片（含包裝及內容物）\n3.退換貨原因\n經客服確認後，將提供相應處理方案（如補寄或退款）。\n若符合退貨條件，請將問題商品寄回（運費由本店負擔），本店收到後將處理退款或補寄。',
  '退款方式：退款將透過 LINE Pay/信用卡 退還至原付款帳戶，處理時間約需 5-7 個工作天。\n若因消費者個人因素（如口味不符、個人喜好）要求退貨，恕無法受理。',
  '其他注意事項：若發生配送延遲、收件異常等狀況，請立即聯繫客服，我們將協助處理。\n若因物流配送過程造成商品部分外觀損壞但不影響食用，恕不接受退換貨。',
]
</script>
<template>
  <main
    class="container flex flex-col justify-center py-6 bg-[url('/images/watermark_1.png')] bg-center bg-no-repeat bg-fixed bg-[length:50%] sm:bg-[length:40%] md:bg-[length:30%] lg:bg-[length:20%] xl:max-w-7xl"
  >
    <div
      class="h-9 px-3 flex items-center justify-between bg-[#F1E1C5] rounded-lg"
    >
      <img src="/images/products/detail/cake.png" class="w-5 h-5" />
      <span class="text-base font-bold text-[#4C3232]"
        >歡迎您蒞臨蜜絲晴MS.CHING官方網站</span
      >
      <img src="/images/products/detail/cake.png" class="w-5 h-5" />
    </div>
    <div class="flex flex-col mt-4 text-[#A38669] font-bold text-base">
      <div>
            歡迎您使用蜜絲晴MS.CHING的烘焙甜點線上購物服務
      </div>
      <div>
        為保障您的權益，請詳細閱讀以下服務條款，
      </div>
      <div>即表示您已閱讀、理解並同意遵守本條款。</div>
    </div>
    <div
      class="flex items-center mt-6 pb-1 border-b-[1px] border-solid border-[#B99F85]"
    >
      <img src="/images/terms/paper.png" width="26" height="26" alt="paper" />
      <span class="ml-1 text-[#A38669] font-bold text-base">服務條款</span>
    </div>
    <div class="flex mx-8 mt-2 text-[#4C3232] text-sm">
      <ul class="list-disc">
        <li
          class="mt-3"
          v-for="(rule, index) in payRules"
          :key="`pay_${index}`"
        >
          <HighlightedText :text="rule" />
        </li>
      </ul>
    </div>
    <div
      class="flex items-center mt-6 pb-1 border-b-[1px] border-solid border-[#B99F85]"
    >
      <img src="/images/terms/store.png" width="26" height="26" alt="" />
      <div class="ml-1 text-[#A38669] font-bold text-base">
        退換貨流程相關
      </div>
    </div>
    <div class="flex mx-8 mt-2 text-[#4C3232] text-sm">
      <ul class="list-disc">
        <li
          class="mt-3"
          v-for="(rule, index) in shipRules"
          :key="`ship_${index}`"
        >
          <HighlightedText :text="rule" />
        </li>
      </ul>
    </div>
    <div class="flex flex-col mt-8 text-[#4C3232] font-bold text-base">
        <div>本店保留最終解釋權及變更本條款之權利，</div>
        <div>若有任何變更，將公佈於網站或 LINE 官方帳號，</div>
        <div>恕不另行通知。</div>
        <div class="mt-2">客服信箱：msching.handmade@gmail.com</div>
        <div>LINE官方帳號: @msching</div>
        <div>客服時間：週一至週五 10:00 - 19:00（例假日除外）</div>
        <div>感謝您的支持與理解，祝您購物愉快！</div>
    </div>
  </main>
</template>
