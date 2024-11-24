export type Child = {
  id: string
  icon: string
  label: string
  to: string
}

export type MenuItem = {
  id: string
  label: string
  to: string
  iconImg?: string
  hidden?: boolean
  children?: Child[]
}

// TODO: hidden 待開發項，完成再開啟
export const menus: MenuItem[] = [
  {
    id: 'home',
    label: '首頁',
    to: '/',
    iconImg: '/images/menu/about_us.png',
  },
  {
    id: 'news',
    label: '最新消息',
    to: '/news',
    iconImg: '/images/menu/news.png',
    hidden: true,
  },
  {
    id: 'onlineOrder',
    label: '線上訂購',
    to: '',
    iconImg: '/images/menu/online_order.png',
    children: [
      {
        id: 'hotItems',
        icon: 'heroicons-outline:fire',
        label: '熱賣中',
        to: `/?category=${Category.Hot}`,
      },
      {
        id: 'cookies',
        icon: 'heroicons-outline:lifebuoy',
        label: '餅乾',
        to: `/?category=${Category.Cookie}`,
      },
      {
        id: 'madeleines',
        icon: 'heroicons-outline:cake',
        label: '瑪德蓮',
        to: `/?category=${Category.Madeleine}`,
      },
      {
        id: 'festiveGifts',
        icon: 'heroicons-outline:archive',
        label: '節慶禮盒',
        to: `/?category=${Category.Festival}`,
      },
    ],
  },
  {
    id: 'orderHelp',
    label: '訂購QA/條款',
    to: '',
    iconImg: '/images/menu/order_help.png',
    children: [
      {
        id: 'orderQa',
        icon: 'heroicons-outline:clipboard-document-list',
        label: '訂購Q&A',
        to: '/faq',
      },
      {
        id: 'purchaseTerms',
        icon: 'heroicons-outline:shopping-bag',
        label: '購買條款',
        to: '/terms',
      },
    ],
    hidden: true,
  },
  {
    id: 'aboutUs',
    label: '關於我們',
    to: '/about',
    iconImg: '/images/menu/about_us.png',
    hidden: true,
  },
] as const
