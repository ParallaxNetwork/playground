
import dynamic from 'next/dynamic'
const ExplorePage = dynamic(() => import('../../src/pages/explore/ExplorePage'), {
  ssr: true,
})
export default function Explore() {
  return <ExplorePage />
}
