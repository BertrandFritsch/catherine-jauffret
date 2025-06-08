import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useMatch } from 'react-router'
import { useDerivedStateFromProps } from '#app/shared/useDerivedStateFromProps'

type ActiveCollage = {
  slug: string
  title: string
}

type CollageContextType = {
  showLayoutOverlay: boolean
  activeCollage: ActiveCollage | null
  isCollagesPage: boolean
  onToggleLayoutOverlayChange: () => void
  onActiveCollageChange: (activeCollage: ActiveCollage | null) => void
}

const CollageContext = createContext<CollageContextType>({
  showLayoutOverlay: true,
  activeCollage: null,
  isCollagesPage: false,
  onToggleLayoutOverlayChange: () => {
    // no-op
  },
  onActiveCollageChange: () => {
    // no-op
  },
})

type CollageProviderProps = {
  children: ReactNode
}

type CollageProviderState = {
  showLayoutOverlay: boolean
  lastShowLayoutOverlay: boolean
  activeCollage: ActiveCollage | null
}

export function CollageProvider({ children }: CollageProviderProps) {
  const isCollagesPage = useMatch('/collages') !== null
  const isCollagePage = useMatch('/collage/:slug') !== null

  const enableLayoutOverlay = isCollagesPage || isCollagePage

  const [{ showLayoutOverlay, activeCollage }, setCollageProviderState] =
    useDerivedStateFromProps<CollageProviderState>((prevState) => {
      if (prevState === null) {
        return {
          showLayoutOverlay: true,
          lastShowLayoutOverlay: true,
          activeCollage: null,
        }
      }

      const nextActiveCollage = !enableLayoutOverlay
        ? null
        : prevState.activeCollage

      const nextShowLayoutOverlay = !enableLayoutOverlay
        ? true
        : prevState.showLayoutOverlay

      if (
        prevState.activeCollage !== nextActiveCollage ||
        prevState.showLayoutOverlay !== nextShowLayoutOverlay
      ) {
        return {
          ...prevState,
          showLayoutOverlay: nextShowLayoutOverlay,
          activeCollage: nextActiveCollage,
        }
      }

      return prevState
    })

  const onToggleLayoutOverlayChange = useCallback(() => {
    setCollageProviderState((prevState) => ({
      ...prevState,
      showLayoutOverlay: !prevState.showLayoutOverlay,
      lastShowLayoutOverlay: !prevState.showLayoutOverlay,
    }))
  }, [setCollageProviderState])

  const onActiveCollageChange = useCallback(
    (activeCollage: ActiveCollage | null) => {
      setCollageProviderState((prevState) => ({
        ...prevState,
        activeCollage,
        showLayoutOverlay:
          prevState.activeCollage === null
            ? prevState.lastShowLayoutOverlay
            : prevState.showLayoutOverlay,
      }))
    },
    [setCollageProviderState],
  )

  const value = useMemo<CollageContextType>(
    () => ({
      showLayoutOverlay,
      activeCollage,
      isCollagesPage,
      onToggleLayoutOverlayChange,
      onActiveCollageChange,
    }),
    [
      showLayoutOverlay,
      activeCollage,
      isCollagesPage,
      onToggleLayoutOverlayChange,
      onActiveCollageChange,
    ],
  )

  return (
    <CollageContext.Provider value={value}>{children}</CollageContext.Provider>
  )
}

export const useCollageContext = (): CollageContextType => {
  const context = useContext(CollageContext)
  return context
}
