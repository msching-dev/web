<script setup lang="ts">
const brandFeatures = [
  '可愛溫馨\n使用##奶油白、粉色、香檳金##等的柔和色彩，營造溫暖療癒的氛圍',
  '品牌標語強調幸福感\n##入口即是愛的滋味##。',
  '嚴選天然食材\n採用無人工添加物、無防腐劑的天然原料，##強調健康與安心##',
  '純手工製作\n每一道甜點皆為##手工精心製作##，保留食材的原味，傳遞手作的溫度',
  '用甜點傳遞幸福與愛\n不只是美味，更是傳遞溫暖與祝福的最佳媒介',
]

const brandStories = [
  '    老闆是一位碼農(軟體工程師),在打磨網頁每一段程式碼的同時,她也是一位對烘焙著迷的熱愛者，\n她心中懷抱著一個浪漫的夢想，於是創造了一個讓人們能感受愛與情感的烘焙品牌---##MS.CHING##,\n她將每一次研發產品的熱情都轉化為烘焙藝術,使每一樣商品都滲透著浪漫與情感。',
  '    她花了無數個日夜研究與嘗試用心烘焙出一個又一個令人心動的甜點，\n每一個來自MS.CHING的甜點都是老闆用心挑選##頂級的食材##及##純手工##製作創造出來的，\n她相信這樣有溫度的甜點，每一口都能夠傳遞她對愛和情感的表達，也許幸福，也許苦澀，也許心酸，也許悲傷，都是情感的一部份。',
  '    選擇MS.CHING的甜點不僅是因為它們美味，更是因為它們帶來的是一種無法言喻的情感體驗及溫度，\n可以作為婚禮小物、送禮、平常的點心，畢竟情感無時無刻都存在著！',
  '    每一次與MS.CHING的相遇，都是一次與浪漫和情感共舞的時刻，願大家能和老闆一樣感受自己的情感和這世界的溫度。'
]

const logoDesigns = [
  '    慵懶的法鬥與精緻的蛋糕巧妙地融合了##香檳金##的色調，不僅營造出一種放鬆悠閒的氛圍，更展現出MS.CHING品牌對生活質感的講究與溫度。',
  '    法鬥象徵著慵懶而自在的生活態度，搭配手工精緻的甜點，彷彿邀請顧客在繁忙的日常中，##放慢腳步、細細品味每一口甜蜜滋味##。香檳金的柔和光澤則為整體風格注入一抹優雅與精緻感，讓甜點不僅是味覺的享受，更是一場視覺與心靈的饗宴！',
  '    MS.CHING希望透過這樣的設計與氛圍，傳遞出品牌的初心：用甜點療癒生活、##用溫暖陪伴每個重要時刻##'
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
        >關於蜜絲晴MS.CHING</span
      >
      <img src="/images/products/detail/cake.png" class="w-5 h-5" />
    </div>
    <div
      class="flex items-center mt-6 pb-1 border-b-[1px] border-solid border-[#B99F85]"
    >
      <img src="/images/about/brand_feature.png" width="26" height="26" alt="paper" />
      <span class="ml-1 text-[#A38669] font-bold text-base">品牌特色</span>
    </div>
    <div class="flex mx-8 mt-2 text-[#4C3232] text-sm">
      <ul class="list-disc">
        <li
          class="mt-3"
          v-for="(rule, index) in brandFeatures"
          :key="`brand_features_${index}`"
        >
          <HighlightedText :text="rule" />
        </li>
      </ul>
    </div>
    <div
      class="flex items-center mt-6 pb-1 border-b-[1px] border-solid border-[#B99F85]"
    >
      <img src="/images/about/brand_story.png" width="26" height="26" alt="" />
      <div class="ml-1 text-[#A38669] font-bold text-base">
        品牌故事
      </div>
    </div>
    <div class="flex mx-8 mt-2 text-[#4C3232] text-sm">
      <div class="flex flex-col gap-4">
        <HighlightedText v-for="(content,idx) in brandStories" :key="`brand_story_${idx}`" :text="content" />
      </div>
    </div>
    <div
      class="flex items-center mt-6 pb-1 border-b-[1px] border-solid border-[#B99F85]"
    >
      <img src="/images/about/logo_design.png" width="26" height="26" alt="" />
      <div class="ml-1 text-[#A38669] font-bold text-base">
        LOGO設計理念
      </div>
    </div>
    <div class="flex mx-8 mt-2 text-[#4C3232] text-sm">
      <div class="flex flex-col gap-4">
        <HighlightedText v-for="(content,idx) in logoDesigns" :key="`logo_design_${idx}`" :text="content" />
      </div>
    </div>
  </main>
</template>