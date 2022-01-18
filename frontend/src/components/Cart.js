import React, { useEffect, useState } from 'react'
import Navbaar from './Navbaar'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import Footer from './Footer'  
import { AiFillDelete } from "react-icons/ai";
import Swal from 'sweetalert2'

export default function Cart() {
    const [state, setstate] = useState([])
    const [count, setCount] = useState(0)
	const navigate = useNavigate()

    const [review, setreview] = useState({
        subtotal:0, 
        gst:0,
        orderTotal:0
    })

    const cartId = useSelector(state => state.cartReducer)
    // cartId from state.cart Reducer from redux
    const dispatch = useDispatch();


    useEffect(() => {
        if (localStorage.getItem('cart') != undefined) {

            let data = [...JSON.parse(localStorage.getItem('cart'))]
            setstate([...data])
            subTotal(data)
        }
    }, [cartId.count, count])

    const countUp = (id) => {
        let data = state
        data[id].quantity += 1;
        localStorage.setItem('cart', JSON.stringify(data))
        setCount(count + 1)

    }
    const countDown = (id) => {

        let data = state
        if (data[id].quantity > 0) {

            data[id].quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(data))
            setCount(count + 1)
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'quantity cannot be negative',
              })
        }

 
    }
    const subTotal = (data) => {
        let total = 0;
        data.forEach(ele => {
            total = total + (ele.product_cost * ele.quantity)
        })
        let finalTotal = (total*5)/100
        setreview({subtotal:total,gst:finalTotal,orderTotal:total+finalTotal})

    }
   
    return (
        <div id="cart_page ">  
            <Navbaar />
            {state.length >0 ?
            <div className="row" >
                <div className="col-9" style={{backgroundColor: "white"}}>
                    <div className="cart_container">
                        <nav class="navbar">
                            <div class="container-fluid">
                                <h2 class="navbar-brand heading_cart">Shopping Cart</h2>
                                <form class="d-flex">
                                    <h4 class="heading_cart">{state.length} items</h4>
                                </form>
                            </div> 
                        </nav>

                        <table className='table table-borderless '>
                             
                                <>
                            <thead>
                                <tr>
                                    <th className="table_heading_cart">Products</th>
                                    <th className="table_heading_cart">Quntity</th>
                                    <th className="table_heading_cart">Price</th>
                                    <th className="table_heading_cart">Total</th>
                                    <th className="table_heading_cart">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <>
                                {state.map((data, index) => 
                                    <tr>
                                        <td><img src={`images/${data.product_image}`} height='50px' width='50px' className='cart_img' alt="..."
                                        /><span className='product_cost'>{data.product_name} </span></td> 
 
                                        <td><button className='btn btn-outline-danger mr-1' onClick={() => countDown(index)}> - </button>{data.quantity}<button className='btn btn-outline-success ml-1' onClick={() => countUp(index)}>+</button></td>

                                        <td className="cost_cart"><span>&#8377;</span>{data.product_cost} /-</td> 


                                        <td className="product_cost"><span>&#8377;</span><span >{data.quantity * data.product_cost}</span></td>

                                        <td><button className='btn btn-danger'
                                            onClick={() => dispatch({ type: "deleteInCart", payload: index })}><AiFillDelete /></button></td>
                                    </tr>


                                )}
                                </>
                            </tbody>
                            </>
                               
                        </table>
                    </div>
                </div>
                <div className="col" style={{height:"34rem"}}>
                    <div className='orderSummary_cart'>
                        <h4 className='mx-3 py-4 heading_cart'>Review Order</h4>
                        <hr />
                        <table className='table'>
                            <tbody className="product_cost">
                                <tr>
                                    <td>Subtotal</td>
                                    <td>{review.subtotal}</td>
                                </tr>
                                <tr>
                                    <td>GST (5%)</td>
                                    <td>{review.gst}</td>
                                </tr>
                                <tr> 
                                    <td>Order Total</td>
                                    <td>{review.orderTotal}</td>
                                </tr>
                                {localStorage.getItem('_token') != undefined ?
                                <tr>
                                <td colSpan='2'> <button className='w-100 mt-4 btn btn-primary'  onClick={() =>navigate("/checkout", { state: {review:review,cart:state} })}>Proceed</button></td>

                            </tr>
                                :
                                <td colSpan='2'> <button className='w-100 mt-4 btn btn-primary'  onClick={navigate('/login')}>Proceed</button></td> 
                                }
                              
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
             :
             <div class="d-flex justify-content-center cart_container" style={{backgroundColor:"white"}}> 
                 <img src="https://clickbazar.com/Images/empty-cart.gif" alt="..." className="gif_cart m-5"/>
             </div>
             
             }
            <Footer />
        </div>
    )
}
