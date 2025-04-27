import { CollageProvider } from './layout/collageContext'
import LayoutContent from './layout/layoutContent'

export default function Layout() {
  return (
    <CollageProvider>
      <LayoutContent />
    </CollageProvider>
  )
}
