
import dynamic from 'next/dynamic'
const HomePage = dynamic(() => import('../src/pages/home/HomePage'), {
  ssr: true,
})
export default function Home() {
  return <HomePage />
}
