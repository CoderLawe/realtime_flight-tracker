import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { FlightProvider } from "../components/context/FlightContext";
function MyApp({ Component, pageProps }: AppProps) {
  return(
    <FlightProvider>
    <Component {...pageProps} />

    </FlightProvider>

  )
}

export default MyApp
