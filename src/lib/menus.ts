import { Category, type MenuItem } from '@/types'

export const menuItems: MenuItem[] = [
  {
    name: '首頁',
    path: '/',
    icon: '/images/menu/home.png',
  },
  {
    name: '最新消息',
    icon: '/images/menu/news.png',
    children: [
      {
        name: '更多活動',
        path: '/news/activities',
      },
    ],
  },
  {
    name: '線上訂購',
    icon: '/images/menu/online_order.png',
    children: [
      {
        name: '熱門商品',
        path: `/?category=${Category.Hot}`,
      },
      {
        name: '餅乾',
        path: `/?category=${Category.Cookie}`,
      },
      {
        name: '瑪德蓮',
        path: `/?category=${Category.Madeleine}`,
      },
      {
        name: '節慶禮盒',
        path: `/?category=${Category.Festival}`,
      },
    ],
  },
  {
    name: '訂購QA/相關條款',
    icon: '/images/menu/order_help.png',
    children: [
      {
        name: '訂購Q&A',
        path: '/faq',
      },
      {
        name: '購買須知',
        path: '/terms',
      },
      {
        name: '服務條款及退換貨流程',
        path: '/service-and-return-terms',
      },
    ],
  },
  {
    name: '關於我們',
    path: '/about',
    icon: '/images/menu/about_us.png',
  },
]
