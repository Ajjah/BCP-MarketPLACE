import '../styles/globals.css'
import Link from 'next/link'

const MyApp = ({ Component, pageProps }) => {
  return (
    <div className="">
      <nav className="px-2 sm:px-4 py-2.5 rounded  border-solid">
        <div className="container flex flex-wrap justify-between items-center mx-auto">
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Vaulti - Home"
              className="h-20 cursor-pointer"
            />
          </Link>
          <p className="text-xl  text-black truncate ">Discover, collect, and sell extraordinary NFTs</p>

          <div className="hidden w-full md:block md:w-auto">
            <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
              <Link href="/">
                <li>
                  <a className=" text-xl block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    Buy NFT
                  </a>
                </li>
              </Link>

              <Link href="/create-nft">
                <li>
                  <a className=" text-xl block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    Sell NFT
                  </a>
                </li>
              </Link>
              <Link href="/my-nfts">
                <li>
                  <a className="text-xl block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    My NFTs
                  </a>
                </li>
              </Link>
              <Link href="/dashboard">
                <li>
                  <a className="text-xl block py-2 pr-4 pl-3 text-black border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                    My Dashboard
                  </a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      <Component {...pageProps} />

    </div>
  )
}

export default MyApp;




