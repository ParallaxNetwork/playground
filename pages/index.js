
import dynamic from 'next/dynamic'
const IndexPage = dynamic(() => import('../src/pages/explore/ExplorePage'), {
  ssr: true
})
export default function Home() {
  return <IndexPage />
}
