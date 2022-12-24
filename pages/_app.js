import '../styles/globals.css'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { NavBar } from '../src/components/navBar/NavBar'
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
    <NavBar />
    <Component
      {...pageProps} />
  </WagmiConfig>
}

export default MyApp
