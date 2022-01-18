import React, { useEffect, useState } from 'react'
import Footer from './Footer'
import Navbaar from './Navbaar'
import { Card } from 'react-bootstrap'
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router'
import { useDispatch,useSelector } from 'react-redux'
import { fetchProductService, applyFilterService } from '../config/MyProductService'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid } from '@mui/material'
import ReactPaginate from 'react-paginate';
import ReactStars from 'react-rating-stars-component';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IoIosCart } from "react-icons/io";

export default function Product() {
    const [state, setstate] = useState({ allproducts: [], colors: [], category: [], searchProduct:[] })
    const [filter, setfilter] = useState({ colors: [], category: '' })
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const reduxStore = useSelector(state => state.profileReducer)
    useEffect(() => { 
        fetchAllProducts()
    }, [])

    useEffect(() => {
       searchFilter(state.searchProduct) 
    }, [reduxStore.searchKeyword])

    const searchFilter = (data) =>{
        if(reduxStore.searchKeyword!=''){
            let cart = data.filter((pro) => {
                if (pro.product_name.toLowerCase()
                    .includes(reduxStore.searchKeyword.trim().toLowerCase())) {
                  return pro;
                }
              })
              setstate({...state,allproducts:cart})
        }
    }
    const fetchAllProducts = () => {
        fetchProductService()
            .then(res => {
                setstate({ allproducts: res.data.allproduct, colors: res.data.color, category: res.data.category,searchProduct:res.data.allproduct })
            })
        dispatch({type: "searchKeyword",payload: ''});
    }

    const applyfilter = () => {
        let formData = {
            category: filter.category,
            colors: filter.colors,
        };
        applyFilterService(formData).then((res) => {
            setstate({ ...state, allproducts: res.data.product });
        });
    };
    const clearFilter = () => {
        if (filter.colors != []) {
            filter.colors.map((ele) => {
                document.getElementById(ele).checked = false;
            });
        }
        if (filter.category != '') {
            document.getElementById(filter.category).checked = false; 
        }
        setfilter({ category: '' , colors: []})
        fetchAllProducts()
    }

   

    function Items({ currentItems }) {
        return (
            <> <div className="row">

            {
                currentItems &&
                currentItems.map(ele =>
                <div className="col my-2">
                    <Card  className="carts_product"> 

                        <img variant="top" src={"./images/" + ele.product_image} height="350" className="productsImg_cart" alt="..." onClick={()=> navigate("/productDetails", { state: ele })
}/>
                        <Card.Body>
                            <Card.Title> {ele.product_name.slice(0,15)}....</Card.Title>
                           <Card.Title > <span>&#8377;</span>{ele.product_cost}</Card.Title>
                            <Card.Title>
                            <h6 className="features_product" onClick={()=> navigate("/productDetails", { state: ele })
}>   
                                            {ele.product_features.slice(0,100)}....
                                        </h6>
                            <ReactStars {...rating(ele)} /></Card.Title>
                            <button className="addCart_product row"
                            onClick={() => dispatch({ type: "addCartDispatch", payload: ele })}
                            >
                                <div className="col" style={{marginLeft:" -2.1rem" ,  marginTop:" 0.3rem"}}>
                                <IoIosCart style={{width:" 3.2rem",height: "1.6rem"}}/>
                                </div>
                                <div className="col" style={{marginLeft:" -12.1rem" ,  marginTop:" 0.5rem"}}>
                                Add Cart

                                </div>
                               
                                
                            </button>
                        </Card.Body>
                    </Card>
                </div>
            )}
        </div>
               
            </>
        );
    }

    function PaginatedItems({ itemsPerPage }) {
        const [currentItems, setCurrentItems] = useState(null);
        const [pageCount, setPageCount] = useState(0);
        const [itemOffset, setItemOffset] = useState(0);

        useEffect(() => {
            const endOffset = itemOffset + itemsPerPage;
            setCurrentItems(state.allproducts.slice(itemOffset, endOffset));
            setPageCount(Math.ceil(state.allproducts.length / itemsPerPage));
        }, [itemOffset, itemsPerPage]);

        const handlePageClick = (event) => {
            const newOffset = (event.selected * itemsPerPage) % state.allproducts.length;
            setItemOffset(newOffset);
        };

        return (
            <>
                <Items currentItems={currentItems} />
                <ReactPaginate
                    className="pagi"
                    breakLabel="..."
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    renderOnZeroPageCount={null}
                />
            </>
        );
    }

    const sortByRating = () =>{
        state.allproducts.sort(function (a, b) {
            return (b.product_rating/b.rated_by) - (a.product_rating/a.rated_by);
          });     
        setstate({...state,allproducts:state.allproducts})
    }
    const sortByPriceUp = () =>{
        state.allproducts.sort(function (a, b) {
            return b.product_cost - a.product_cost;
          });      
        setstate({...state,allproducts:state.allproducts})
    }
    const sortByPriceDown = () =>{
        state.allproducts.sort(function (a, b) {
            return a.product_cost - b.product_cost;
          });  
        setstate({...state,allproducts:state.allproducts})
    }
    

    return (
        <>
            <Navbaar /> 
            <div className="row mt-4 ">
                <div className="col-3 my-2 sidebar_1_product">
                <div className="">
                        <nav className="nav flex-column">
                            <Button variant="contained" className="button_fun m-3" onClick={()=>clearFilter()}>All Products</Button>
                            <Accordion className="mx-3 mt-3 shadowCus" defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header" > 
                                    <Typography className="dropdown">Category</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                        {state.category && state.category.map((cat) => (
                                            <Typography key={cat._id}>
                                                <input
                                                    type="radio"
                                                    id={cat._id}
                                                    onClick={(e) => setfilter({ ...filter, category: e.target.value })}
                                                    name="categories"
                                                    value={cat._id} />
                                                &nbsp;  {cat.category_name}
                                            </Typography>
                                        ))}
                                </AccordionDetails>
                            </Accordion>
                            <Accordion className="mx-3 mt-1 shadowCus" defaultExpanded={true}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel2a-content"
                                    id="panel2a-header" >
                                    <Typography className="dropdown">colors</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                        {state.colors && state.colors.map((cat) => (
                                            <Typography key={cat._id}>
                                                <input
                                                    type="checkbox"
                                                    id={cat._id}
                                                    onClick={(e) => setfilter({ ...filter, colors: [...filter.colors, e.target.value] })}
                                                    name="color"
                                                    value={cat._id} />
                                                &nbsp;{cat.color_name}
                                            </Typography>
                                        ))}
                                </AccordionDetails>
                            </Accordion>
                            <Button variant="contained" className="button_fun mx-5 mt-3" onClick={() => applyfilter()}>Apply</Button>

                        </nav>
                    </div>
                </div>
                <div className='col-9 '>
                <div className='text-right '>
                        <div className='container text-left mt-2' 
                        style={{background:"white", paddingLeft: "1.1rem"}}>
                            Sort By :
                            <i className="fa fa-star mx-2"  onClick={()=>sortByRating()}></i>
                            <span style={{color:"red",fontWeight:"bold",marginLeft:"2px"}}>&#8377;</span><i className="fa fa-arrow-up "  onClick={()=>sortByPriceUp()} ></i>
                            <span style={{color:"red",fontWeight:"bold",marginLeft:"2px"}}>&#8377;</span><i className="fa fa-arrow-down "  onClick={()=>sortByPriceDown()} ></i>
                        </div>
                    </div>
                    <div >

                    <PaginatedItems itemsPerPage={9} />
                    </div>
                </div>
            </div>
           

            <Footer />
        </>
    )
} 



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