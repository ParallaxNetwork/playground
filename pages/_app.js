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
import { Orbis } from '@orbisclub/orbis-sdk'
import { OrbisProvider } from '../src/context/OrbisContext'
import { UserProvider } from '../src/context/UserContext'
import { UnlockProvider } from '../src/context/UnlockContext'
import { IdolProvider } from '../src/context/IdolContext'

const orbisOptions = {
  PINATA_API_KEY: process.env.PINATA_API_KEY,
  PINATA_SECRET_API_KEY: process.env.PINATA_SECRET_API_KEY
}
const orbis = new Orbis(orbisOptions)
const { chains, provider, webSocketProvider } = configureChains(
  process.env.NEXT_PUBLIC_STATE === 'production' ? [polygon] : [polygonMumbai],
  [
    infuraProvider({ apiKey: process.env.INFURA_API_KEY }),
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

function MyApp({ Component, pageProps }) {

  return (
    <WagmiConfig client={wagmiClient}>
      <OrbisProvider orbis={orbis}>
        <UnlockProvider>
          <UserProvider>
            <IdolProvider>
              <Toaster
                gutter={15}
                toastOptions={{
                  duration: 3000,
                }} />
              <NavBar />

              <Component
                {...pageProps} />
            </IdolProvider>
          </UserProvider>
        </UnlockProvider>
      </OrbisProvider>
    </WagmiConfig>
  )
}

export default MyApp
