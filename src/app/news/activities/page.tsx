'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { formatTimestampToDateRange } from '@/hooks/use-helpers'
import type { ActivityItem } from '@/types'

const categoryTabs = [
  { value: 'all', label: '全部消息' },
  { value: 'newItem', label: '新品上市' },
  { value: 'discount', label: '優惠折扣' },
  { value: 'festival', label: '節慶活動' },
]

const testActivities: ActivityItem[] = [
  {
    id: 1,
    type: 'newItem',
    title: '新品上市',
    description: '全新口味瑪德蓮隆重登場！使用嚴選食材，為您帶來全新的味覺體驗。',
    image: '/images/news/newItem.png',
    startTime: 1710000000,
    endTime: 1712678400,
  },
  {
    id: 2,
    type: 'discount',
    title: '優惠折扣',
    description: '限時優惠活動開跑！指定商品享有特別折扣，數量有限，售完為止。',
    image: '/images/news/discount.png',
    startTime: 1710000000,
    endTime: 1712678400,
  },
  {
    id: 3,
    type: 'festival',
    title: '節慶活動',
    description: '節慶限定禮盒預購開始！精心設計的禮盒包裝，送禮自用兩相宜。',
    image: '/images/news/festival.png',
    startTime: 1710000000,
    endTime: 1712678400,
  },
]

export default function ActivitiesPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredActivities = useMemo(() => {
    if (activeTab === 'all') return testActivities
    return testActivities.filter((activity) => activity.type === activeTab)
  }, [activeTab])

  return (
    <div className="animate-page-enter">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>首頁</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>最新消息</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Page title */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 text-center">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sandrift-950">
          最新消息
        </h1>
        <p className="mt-2 text-[13px] text-sandrift-400">
          掌握最新優惠與活動資訊
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-10">
        {/* Tab filters */}
        <div className="mb-8 flex justify-center">
          <div className="glass-subtle inline-flex items-center rounded-2xl p-1 ring-1 ring-white/30">
            {categoryTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`relative cursor-pointer whitespace-nowrap rounded-xl px-3.5 py-1.5 text-[13px] font-medium transition-all duration-300 ease-out ${
                  activeTab === tab.value
                    ? 'bg-white/80 text-sandrift-900 shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                    : 'text-sandrift-400 hover:text-sandrift-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity cards */}
        {filteredActivities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="group cursor-pointer overflow-hidden rounded-2xl bg-white ring-1 ring-sandrift-100/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(176,141,98,0.08)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-2.5 left-2.5">
                    <span className="inline-block rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-medium text-sandrift-700 backdrop-blur-sm">
                      {formatTimestampToDateRange(activity.startTime, activity.endTime)}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="mb-1.5 text-[15px] font-bold text-sandrift-900">
                    {activity.title}
                  </h3>
                  <p className="mb-3 text-[13px] leading-relaxed text-sandrift-500">
                    {activity.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full cursor-pointer rounded-xl border-sandrift-100 bg-white text-[13px] text-sandrift-600 transition-colors hover:bg-sandrift-50/50 hover:text-sandrift-800"
                  >
                    查看詳情
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="inline-block rounded-2xl bg-white/50 px-8 py-6 ring-1 ring-sandrift-100/40 backdrop-blur-sm">
              <p className="text-[14px] text-sandrift-400">目前沒有相關消息</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
