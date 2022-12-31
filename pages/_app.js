import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import dynamic from 'next/dynamic'
const NavBar = dynamic(() => import('../src/components/navBar/NavBar'), {
  ssr: true
})
import '../styles/globals.css'
import { Toaster } from "react-hot-toast";
function MyApp({ Component, pageProps }) {
  const { chains, provider, webSocketProvider } = configureChains(
    [polygon, polygonMumbai],
    [
      infuraProvider({ apiKey: '7950ebd555374a918221ed0a1fdf0376' }),
      publicProvider()
    ]
  )
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new WalletConnectConnector({
        chains,
        options: {
          qrcode: true,
        }
      })
    ],
    provider,
    webSocketProvider
  })

  return <WagmiConfig client={wagmiClient}>
    <Toaster 
    gutter={15}
    toastOptions={{
      duration: 3500,
    }} />
    <NavBar />
    <Component
      {...pageProps} />
  </WagmiConfig>
}

export default MyApp
