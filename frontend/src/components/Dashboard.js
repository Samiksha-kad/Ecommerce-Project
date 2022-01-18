import React, { useState, useEffect } from 'react'
import Footer from './Footer';
import Navbaar from './Navbar';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useLocation } from 'react-router-dom';
// import ReactStars from 'react-rating-stars-component';
import ReactStars from 'react-stars';
import { WhatsappShareButton, FacebookShareButton, TwitterShareButton, PinterestShareButton, FacebookIcon, PinterestIcon, TwitterIcon, WhatsappIcon, EmailShareButton, EmailIcon } from 'react-share';
import { useDispatch} from 'react-redux'
import { FaRupeeSign } from "react-icons/fa";
import Magnifier from "react-magnifier";
import { BsStarFill,BsStarHalf } from 'react-icons/bs';
import { BsFillShareFill } from "react-icons/bs";
import { rateProductService,fetchRateProduct } from '../config/MyProductService';



 
function ProductDetails() {
  const location = useLocation()
  const [index, setIndex] = useState(0)
  const [state, setstate] = useState({})
  const [value, setValue] = useState('1');
  const dispatch = useDispatch();

useEffect(() => {
   fetchRateProduct({id:location.state._id}).then(res=>{
    setstate(res.data)

  })
}, [])


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const rating = (ele) => {
    console.log(ele.product_rating/ele.rated_by,'42');
    return {
        edit: false,
        color: "rgba(20,20,20,0.1)",
        activeColor: "tomato",
        size: window.innerWidth < 600 ? 20 : 25,
        value: ele.product_rating/ele.rated_by,
        isHalf: true,
    };
}

  const rateProduct = {
    size: 20,
    count: 5,
    color: "black",
    activeColor: "red",
    value: 7.5,
    a11y: true,
    isHalf: true,
    emptyIcon: <BsStarFill />,
    halfIcon: <BsStarHalf />,
    filledIcon: <BsStarFill />,
    onChange: newValue => {
        chngeRating(newValue)
    }
};
const chngeRating = (value) => {
  rateProductService({ value: ((state.product_rating + value)/state.rated_by), rated: state.rated_by + 1,id:state._id }).then(res =>
      setstate(res.data)
   )

      alert("thanks for the rating")
      // window.location.reload(false)
}
  const props = {width: 250, height: 350,opacity:1, background:'white', zoomWidth: 500, zoomStyle:{opacity: 1,backgroundColor: 'black'}, img: `images/${state.product_image}`};

  return (
    <>
    
      <Navbaar />
      {console.log(state)}
    {state !={} &&
      <div className="container">
        {console.log(state)}
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6  mt-5">
           
          <div className="col-sm-12 col-md-5 col-lg-5" >
                        <Magnifier src={`./images/${location.state.product_subimages[index]}`} height={350} width={350} className='d-block mx-auto mb-3 shadow' />
                        <div className='d-flex justify-content-evenly'>
                            {location.state.product_subimages.map((val, i) =>
                                <img key={val} src={`./images/${location.state.product_subimages[i]}`} height='100' width='100' onClick={() => setIndex(i)} />
                            )}
                        </div>
                    </div>
           

          </div>
          <div className="col-sm-12 col-md-6 col-lg-6  mt-3">
            <h2 className="mt-5">{state.product_name}</h2>
            <ReactStars {...rating(state)} />
            <hr />
            <div className='mt-4'>
              <h6 >Price: <span  style={{color:'green'}}><FaRupeeSign/>{state.product_cost} /-</span></h6>
              <h6 className='mt-2'>Color:<span className='ml-2' style={{display:'inline-block', background:location.state.color_id.color_code,height:'20px',width:'45px'}}></span>  </h6> 
            </div>
            <div>
              <h5 className="mt-3">Share</h5>
              <div>
                <WhatsappShareButton
                  url="https://www.amazon.in/"
                  hashtag="#react">
                  <WhatsappIcon
                    logofillColor="white"
                    round={true} size='2.5rem'
                  ></WhatsappIcon>
                </WhatsappShareButton>

                <FacebookShareButton
                  url="https://www.amazon.in/"
                  hashtag="#react"
                  className='mx-2'>
                  <FacebookIcon
                    logofillColor="white"
                    round={true} size='2.5rem'
                  ></FacebookIcon>
                </FacebookShareButton>

                <TwitterShareButton
                  url="https://www.amazon.in/"
                  hashtag="#react">
                  <TwitterIcon
                    logofillColor="white"
                    round={true} size='2.5rem'
                  ></TwitterIcon>
                </TwitterShareButton>

                <EmailShareButton
                hashtag="#react"
                                url={"https://www.amazon.in/"}>
                                <EmailIcon size={40} round />
                            </EmailShareButton>

                            <PinterestShareButton
                            hashtag="#react"
                                url={"https://www.amazon.in/"}>
                                <PinterestIcon size={40} round />
                            </PinterestShareButton>

              </div>
              <div className="mt-4">
                <button className="btn btn-info mr-3" onClick={() => dispatch({ type: 'addCart', payload: state })} >Add to Cart</button>
                <button className="btn btn-danger"><ReactStars {...rateProduct}/></button>
              </div>
            </div>
          </div>
        </div>
    
        <div>

          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Description" value="1" />
                <Tab label="Features" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">{state.product_desc}</TabPanel>
            <TabPanel value="2">{state.product_feature}</TabPanel>
          </TabContext>
        </div>
      </div>
}
      <Footer />

    </>
  )
}

export default ProductDetails