import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {marketplaceAddress,link_id} from '../configuration'
import NFTMarketplace from '../artifacts/contracts/NFT.sol/NFTMarketplace.json'

const Home = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [fullscreen,setfullscreen] = useState(false);
  const [image,setimage]=useState('');
  useEffect(() => { loadNFTs() }, []);

  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider(link_id);
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider);
    const data = await contract.fetchMarketItems();

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
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
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    console.log("nfts",items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  const imageClick = (img) => {
    console.log('Click');
    setfullscreen(true)
    setimage(img);
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
  return (
    <section className="body-font text-gray-600">
    <div className="container mx-auto px-5 py-24">
      {fullscreen? 
      <div>
         <img src={image} className="w-4/12 h-4/12 rounded-lg mx-auto" onMouseOut={()=>setfullscreen(false)}/>
         
      </div> :
      <div className="-m-4 flex flex-wrap">
          {
            nfts.map((nft, i) => (
              <div key={i} className="p-8 md:w-1/3">
                <div className="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
                 <img src={nft.image} className={"duration-400 w-full scale-110 object-cover object-center transition-all hover:scale-100 md:h-36 lg:h-48"} onMouseOver={() => imageClick(nft.image)} />
                <div className="p-6">
                  <h2 className="title-font mb-1 text-xs font-medium tracking-widest text-gray-400"> {nft.description}</h2>
                  <h1  className="title-font mb-3 text-lg font-medium text-gray-600">{nft.name}</h1>
                  <p className="mb-3 leading-relaxed">{nft.price} ETH</p>
                  <div className="flex flex-wrap items-center ">
                    <button className="shadow-cla-violate rounded-lg bg-gradient-to-r from-blue-300 to-blue-400 px-4 py-1 drop-shadow-md hover:scale-105" onClick={() => buyNft(nft)}>Buy</button>
                  </div>
                </div>
                </div>
              </div>
            ))
          }
          </div>}
    </div>
    </section>

  )
}

export default Home


