import React,{useState,useEffect} from 'react'
import Footer from './Footer' 
import Navbaar from './Navbaar'
import {useLocation } from 'react-router-dom' 
import ReactStars from 'react-stars'; 
import { useDispatch} from 'react-redux'
import Magnifier from "react-magnifier";
import {fetchRateProduct} from '../config/MyProductService'
import { BsStarFill,BsStarHalf,BsShareFill } from 'react-icons/bs';
import {rateProductService} from '../config/MyProductService'
import {WhatsappShareButton, FacebookShareButton, TwitterShareButton, FacebookIcon,TwitterIcon,WhatsappIcon,EmailShareButton,PinterestShareButton,PinterestIcon,EmailIcon} from 'react-share';
import Swal from 'sweetalert2'

function ProductDetails() {
	const location = useLocation();
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0)
  const [state, setstate] = useState({})


  useEffect(() => {
    fetchRateProduct({id:location.state._id}).then(res=>{
     setstate(res.data)
 
   })
 }, [])
    const rating = (ele) => {
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
      rateProductService({ value: (state.product_rating + value), rated: state.rated_by + 1,id:state._id }).then(res =>
          setstate(res.data)
       )
       Swal.fire({
        title: 'Sweet!',
        text: 'Thanks for Rating',
        imageUrl: 'https://c.tenor.com/Cn1-7YTiY7QAAAAC/thank-you-thanks.gif',
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: 'Custom image',
      })
    }
   

    
    return (
        <div style={{ backgroundColor: "white",fontFamily: "'Signika', sans-serif" }}>
        <Navbaar/>
            {state != {} &&
                <div className="container-fluid mt-2 row">
                    <div className="col-sm-12 col-md-5 col-lg-5" >
                        <Magnifier src={`./images/${location.state.product_subimages[index]}`} height={400} width={400} className='d-block mx-auto  mt-5 shadow' />
                        <div className='d-flex justify-content-evenly ml-5 mt-5'>
                            {  location.state.product_subimages.map((val, i) =>
                                <img key={val} src={`./images/${location.state.product_subimages[i]}`} height='100' width='100' onClick={() => setIndex(i)} alt="..."  style={{marginRight:"2rem"}}/>
                            )}
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-7 col-lg-7" >
                        <h3><strong>{location.state.product_name}</strong></h3>
                        <ReactStars {...rating(state)} />
                        <hr />
                        <h5>Price : <span className='text-success'>₹{location.state.product_cost}</span></h5>
                        <h5>Color : <span style={{ display: "inline-block", height: '20px', width: "50px", borderRadius: "10px", background: location.state.color_id.color_code }} ></span></h5>
                        <h5 style={{ display: "inline-block" }}>Share </h5> &nbsp; <BsShareFill style={{ fontSize: "25px", display: "inline-block" }}/>
                        <div className='d-flex justify-content-between mb-2' style={{  width: "40%" }}>
                            <FacebookShareButton
                                url={"https://github.com/Samiksha-kad"}>
                                <FacebookIcon size={50} round />
                            </FacebookShareButton>

                            <TwitterShareButton
                                url={"https://github.com/Samiksha-kad"} >
                                <TwitterIcon size={50} round />
                            </TwitterShareButton>

                            <EmailShareButton
                                url={"https://github.com/Samiksha-kad"}>
                                <EmailIcon size={50} round />
                            </EmailShareButton>

                            <WhatsappShareButton
                                url={"https://github.com/Samiksha-kad"}>
                                <WhatsappIcon size={50} round />
                            </WhatsappShareButton>

                            <PinterestShareButton
                                url={"https://github.com/Samiksha-kad"}>
                                <PinterestIcon size={50} round />
                            </PinterestShareButton>
                        </div>
                        <button className='btn btn-primary my-1' variant="contained" color='error' size='lg' onClick={() => dispatch({ type: "addCartDispatch", payload: location.state })}> &nbsp; Add To Cart</button>
                        <button className="btn btn-warning m-2 p-1" >
                            <ReactStars {...rateProduct} /></button>

                        <h5>Description : </h5> 
                        <ul >
                            <li><strong>Category :</strong>  {location.state.category_id.category_name}</li>
                            <li><strong>Color :</strong> {location.state.color_id.color_name}
                            </li>
                        </ul>
                        <p >{location.state.product_desc}</p>
                        <p >{location.state.product_features}</p>
                    </div>
                </div>
            }
            <Footer/>
        </div>
    )
}

export default ProductDetails
