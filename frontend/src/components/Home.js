import React, { useState, useEffect } from 'react'
import Footer from './Footer'
import Navbaar from './Navbaar'
import { useNavigate } from 'react-router'
import { Card } from 'react-bootstrap'  
import ReactStars from 'react-rating-stars-component';
import { IoIosCart } from "react-icons/io";
import { useDispatch } from 'react-redux'

import { fetchProductService } from '../config/MyProductService'

export default function Home() {
    const [state, setstate] = useState([])
    const dispatch = useDispatch();

    const navigate = useNavigate()

    useEffect(() => { 
        let prod = []
        fetchProductService()
            .then(res => {
                prod = res.data
                setstate(prod.allproduct)
            })
    }, [])
    const rating = (ele) => {

        return {
            edit: false,
            color: "rgba(20,20,20,0.1)",
            activeColor: "#FFA41C",
            size: window.innerWidth < 600 ? 20 : 25,
            value: ele.product_rating/ele.rated_by,
            isHalf: true,
        };

    }
  
    return (
        <div style={{ backgroundColor: "white" }}>
            <Navbaar />
            <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner my-3">
                    <div style={{ width: "100%", height: "80%" }}>

                        <div className="carousel-item active" >
                            <img src="https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/1/10/cec0b2ae-c3c2-4bd7-bf41-5464acc6f4931641832422171-The-Travel-Store_Desk.jpg" alt="First slide" style={{ width: "100%" }} />
                            <button className="seeMore_home" onClick={() => navigate("/product")}> See More...
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </button>
                        </div>


                        <div className="carousel-item">
                            <img src="https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/1/10/c647c96a-15d8-4eba-a04b-b4a011d565931641832422157-Casual-Shoes_Desk.jpg" alt="Second slide" style={{ width: "100%" }} />
                            <button className="seeMore_home" onClick={() => navigate("/product")}> See More...
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </button>

                        </div>
                        <div className="carousel-item">
                            <img src="https://assets.myntassets.com/f_webp,w_980,c_limit,fl_progressive,dpr_2.0/assets/images/2022/1/10/e2abb25c-5de9-40de-968b-6e3998897cb61641832422164-A-Line-Kurtas_Desk.jpg" alt="..." style={{ width: "100%" }} />
                            <button className="seeMore_home" onClick={() => navigate("/product")}> See More...
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"></path></svg>
                                </div>
                            </button>

                        </div>
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
            <div>
                <h3 className="heading_popular m-3 text-center">Deal of the Day</h3>
                <div className="row m-3">
                    {
                        state &&
                        state.map((ele, index) =>

                        index < 6 &&
                        <> 
                            <div className="col my-2">
                                <Card className="carts_home ml-4">

                                    <img variant="top" src={"./images/" + ele.product_image} height="350" className="productsImg_home" alt="..." onClick={() => navigate("/productDetails", { state: ele })} />
                                    <Card.Body> 
                                        <Card.Title> {ele.product_name}</Card.Title>
                                        <h6 className="features" onClick={()=>navigate("/productDetails", { state: ele })}>   
                                            {ele.product_features.slice(0,100)}....
                                        </h6>
                                       
                                        <Card.Title > <span>&#8377;</span>{ele.product_cost}</Card.Title>
                                        <Card.Title>
                                            <ReactStars {...rating(ele)} /></Card.Title>
                                        <button className="addCart_home row"
                                            onClick={() => dispatch({ type: "addCartDispatch", payload: ele })}
                                        >
                                            <div className="col" style={{ marginLeft: " -2.1rem", marginTop: " 0.3rem" }}>
                                                <IoIosCart style={{ width: " 3.2rem", height: "1.6rem" }} />
                                            </div>
                                            <div className="col" style={{ marginLeft: " -14rem", marginTop: " 0.5rem" }}>
                                                Add Cart
                                            </div>
                                        </button>
                                    </Card.Body>
                                </Card>
                            </div>
                        </>

                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
