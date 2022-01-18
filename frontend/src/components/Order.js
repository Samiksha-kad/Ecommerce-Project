import React, { useEffect, useState } from 'react'
import { orderService } from '../config/MyProductService'
import jwtdecode from 'jwt-decode';
import { useNavigate } from 'react-router'

function Order() {
    const [state, setState] = useState([])
    const navigate = useNavigate()
 
    useEffect(() => {
        let token = localStorage.getItem('_token');
        let decode = jwtdecode(token)
        orderService({email:decode.email}).then(res => {
            setState(res.data)
        })

    }, [])
    return (
        <> 
        {state.length >0 ?
            <div className='container-justify p-4 mt-5' style={{ border: "2px solid black", borderRadius: " 10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", fontFamily: "'Bree Serif', serif", width: "90%", maxHeight: '66vh', overflow: 'auto',backgroundColor: "white"}}>
                {
                    state.map(ele =>
                        <>
                            <h4 className="mt-3">TRANSIT ORDER BY:{ele.card_name}</h4>
                            <h6>Placed On {ele.created_at} / Rs. {ele.subtotal+ele.gst}</h6>
                            <hr />
                            <div>
                                {ele.totalCart.map(data =>
                                    <>
                                        <img src={`/images/${data.product_image}`} height='100px' width='100px' className="ml-3" alt="..." />
                                    </>
                                )}
                            </div>
                            <hr />
                           
                            <button className='btn btn-primary' onClick={() =>navigate('/invoice',{state:ele})}>Download Invoice as pdf</button>
                           
                        </>
                    )
                }

                

            </div>
            :<img src="https://cdn.dribbble.com/users/2207588/screenshots/5560830/snoozey-final.gif" alt="..." style={{ width: "36rem",marginLeft: "6rem",marginTop: "2rem"}}></img>}

        </>
    )
}

export default Order