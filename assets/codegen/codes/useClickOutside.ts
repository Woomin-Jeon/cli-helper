import { RefObject, useEffect } from 'react'

interface Params {
  ref: RefObject<HTMLElement>
  isActive: boolean
  onClickOutside: () => void
}

export const useClickOutside = ({ ref, isActive, onClickOutside }: Params) => {
  useEffect(() => {
    const element = ref.current
    if (!element || !isActive) {
      return
    }

    const handleClickOutside = (e: any) => {
      const isClickedInside = element.contains(e.target)
      if (isClickedInside) {
        return
      }

      e.stopPropagation()
      e.preventDefault()
      onClickOutside()
    }

    document.addEventListener('click', handleClickOutside, { capture: true })
    return () => document.removeEventListener('click', handleClickOutside, { capture: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])
}
