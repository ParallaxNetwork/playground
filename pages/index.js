
import dynamic from 'next/dynamic'
const IndexPage = dynamic(() => import('../src/pages/index/index'), {
  ssr: false
})
export default function Home() {
  return <IndexPage />
}
