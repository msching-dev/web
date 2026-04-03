import { ShoppingBag, CreditCard, Truck } from 'lucide-react'

const steps = [
  {
    icon: ShoppingBag,
    step: 'Step 1',
    title: '選購商品',
    description: '瀏覽喜歡的甜點，加入購物車',
  },
  {
    icon: CreditCard,
    step: 'Step 2',
    title: '線上付款',
    description: '安全便捷的線上支付',
  },
  {
    icon: Truck,
    step: 'Step 3',
    title: '宅配到府',
    description: '新鮮製作，用心包裝送達',
  },
]

export default function OrderProcessSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <h2 className="text-xl md:text-2xl font-bold text-sandrift-950 text-center mb-6 md:mb-8">
        簡單三步驟，美味送到家
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {steps.map(({ icon: Icon, step, title, description }) => (
          <div key={step} className="text-center">
            <div className="w-14 h-14 rounded-full bg-sandrift-100/60 flex items-center justify-center mx-auto">
              <Icon className="h-6 w-6 text-sandrift-600" />
            </div>
            <p className="text-xs font-medium text-sandrift-400 mt-4">
              {step}
            </p>
            <p className="text-sm font-semibold text-sandrift-900 mt-1">
              {title}
            </p>
            <p className="text-xs text-sandrift-500 mt-1">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
