import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {marketplaceAddress} from '../configuration'
import NFTMarketplace from '../artifacts/contracts/NFT.sol/NFTMarketplace.json'
export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {loadNFTs()}, [])

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    const data = await contract.fetchItemsListed()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))

    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>)
  return (
    <div>
      <div className="container mx-auto px-5 py-24">
         <h2 className="title-font mb-1 text-xl font-medium tracking-widest text-red-400">Items Listed</h2> 
          <div className="-m-4 flex flex-wrap">
          {
            nfts.map((nft, i) => (
              <div key={i} className="p-8 md:w-1/3">
                <div className="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
                <img src={nft.image} className="duration-400 w-full scale-110 object-cover object-center transition-all hover:scale-100 md:h-36 lg:h-48" />
                <div className="p-6">
                  <p className="shadow-cla-violate rounded-lg bg-gradient-to-r from-gray-300 to-gray-400 px-4 py-1 drop-shadow-md hover:scale-105">Price - {nft.price} Eth</p>
              </div>
              </div>

              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}