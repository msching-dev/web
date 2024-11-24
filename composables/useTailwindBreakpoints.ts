import { breakpointsTailwind } from '@vueuse/core'

export const useTailwindBreakpoints = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind)
  return breakpoints
}
