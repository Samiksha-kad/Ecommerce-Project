import React, { useState, useEffect } from 'react'
import { useLocation,Navigate } from 'react-router-dom'
import { checkOutService } from '../config/MyProductService'
import jwtdecode from 'jwt-decode'; 
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'
import { cartSaveService } from '../config/Myservice' 
import Navbaar from './Navbaar';
import Footer from './Footer';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Swal from 'sweetalert2'

function Checkout() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

 
    const [state, setState] = useState({ cardNum: '', cvv: '', name: '', expDate: '', userEmail: '' })

    const [addresses, setaddress] = useState([])
    const [errors, setErrors] = useState({ cardNum: '', cvv: '', name: '', expDate: '' })
    const [isSumbit, setIsSubmit] = useState(false)
    const [values, setValues] = useState([])


    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setState({ ...state, userEmail: decode.email })
            setaddress(decode.addresses)

        }
        else {
            navigate('/login')
        }
    }, [])
    const checkout = () => { 
        setErrors(null)
        setIsSubmit(true)
        let temp = validate(state)
        
        if (state.cardNum != '' && state.cvv != '' && state.expDate != '' && state.name != '' && state.userEmail != '' && temp.length === 0 ) {
            if(values!= null){

                let formData = {
                    user_email: state.userEmail,
                    card_name: state.name,
                    subtotal: location.state.review.subtotal,
                    gst: location.state.review.gst,
                    totalCart: location.state.cart,
                    addresses: [addresses[values]],
                }
                checkOutService(formData)
                    .then(res => {
                        cartSaveService({ data: [], email: state.userEmail })
                            .then(res => {
                                localStorage.setItem('_token', res.data.token)
                            })
                            Swal.fire({
                                icon: 'success',
                                title: res.data.msg,
                                
                              })
                        localStorage.removeItem('cart')
                        dispatch({ type: "emptyCart", payload: 0 })
                        navigate('/product')
                    })
            }
            else{
                Swal.fire(
                    'Empty?',
                    'Addresss required?',
                    'question'
                  ) 
            }


        }
        else {
            Swal.fire(
                'Empty?',
                'All fields are required?',
                'question'
              )
        }
    }


    const validate = (values) => {
        const e = []
        const errors = {};
        if (!values.cardNum) {
            e.push({ cardNum: "card number required" })
            errors.cardNum = "Card Number is required"
        } else if (values.cardNum.length !== 16) {
            e.push({ cardNum: "Card number should be  16 digits" })
            errors.cardNum = "Card number should be  16 digits"
        }
        if (!values.cvv) {
            e.push({ cvv: "cvv is required" })
            errors.cvv = "CVV  is required"
        } else if (values.cvv.length !== 3) {
            e.push({ cvv: "CVV  should be  3 digits" })
            errors.cvv = "CVV  should be  3 digits"
        }
        if (!values.name) {
            e.push({ name: "Name is required" })
            errors.name = "Name  is required"
        } else if (values.name.length < 3) {
            e.push({ name: "Name  should be greater than 3 letter" })
            errors.name = "Name  should be greater than 3 letter"
        }
        if (!values.expDate) {
            e.push({ expDate: "Expiration Date is required" })
            errors.expDate = "Expiration Date  is required"
        }


        setErrors(errors)
        return e

    }

    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSumbit) {
            console.log(errors);
        }
    }, [errors])
    return (
        <>
        {localStorage.getItem('_token') != undefined ?
        <div style={{ backgroundColor: "white" }}>
            <Navbaar />
            <div className="row" >
                <div className="col-8 mb-3" >
                    <div>
                        <div className="d-flex justify-content-center mt-3">
                    {errors.cardNum && <p className="alert alert-danger  w-50">{errors.cardNum}</p> || errors.name && <p className="alert alert-danger  w-50">{errors.name}</p> || errors.cvv && <p className="alert alert-danger  w-50">{errors.cvv}</p>|| errors.expDate && <p className="alert alert-danger  w-50">{errors.expDate}</p>}
                    </div>
                        <div className="cardPayment" >
                            <header>
                                <h3 className="card-title_payment mt-2">Payment Details</h3>
                                <img width="128" alt="Visa Inc. logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/128px-Visa_Inc._logo.svg.png" className="logo_payment" />
                            </header>

                            <div className="form_payment">
                                <div className="card-number_payment">
                                    <label for="number" className="label_payment">Card Number</label> 

                                    <input id="number" type="number" size="40" value={state.cardNum} className="_input" placeholder="1234 1234 1234 1234"  name='cardNum' onChange={e => setState({ ...state, cardNum: e.target.value })} maxLength={16} />

                                   
                                   
                                </div>

                                <div className="card-name_payment">
                                    <label for="name" className="label_payment">Name</label>

                                    <input id="name" type="text" size="40" required placeholder="Your Name"name='name' value={state.name} className="_input" onChange={e => setState({ ...state, name: e.target.value })} />

                              
                                </div>

                                <div className="input-row">
                                    <div className="select-date_payment">
                                        <label for="date" className="label_payment">Expiration</label>                              
                                       
                                    <input type="date" className="form-control _input" name='expDate' value={state.expDate} placeholder="Expiration Date" onChange={e => setState({ ...state, expDate: e.target.value })}  />
                                  
                                    </div>

                                    <div className="card-payment-cvc">
                                        <label for="cvc" className="label_payment">CVV</label>

                                        <input id="cvc" type="text" size="5" placeholder="123" required name='cvv' value={state.cvv}  onChange={e => setState({ ...state, cvv: e.target.value })} className="_input" />

                                       
                                      
                                 
                                    </div>

                                    <button className="buy-button" onClick={() => checkout()}>Complete Purchase</button>
                                </div>
                            </div>

                        </div>
                    </div>
                   

                </div>
                <div className="col-4" >
                    <div className="card " style={{ height: "100%", width: "100%", backgroundColor: "#f2f3f4" }}>
                        <div >
                            <h4 className='m-3' style={{ fontFamily: "'Roboto Slab', serif" }}>Summary</h4>
                            <hr />
                            <table className='table'>
                                <tbody style={{ fontFamily: "'Roboto Slab', serif" }}>
                                    <tr>
                                        <td>Subtotal</td>
                                        <td>{location.state.review.subtotal}</td>
                                    </tr>
                                    <tr>
                                        <td>GST (5%)</td>
                                        <td>{location.state.review.gst}</td>
                                    </tr>
                                    <tr>
                                        <td>Order Total</td>
                                        <td>{location.state.review.orderTotal}</td>
                                    </tr>


                                </tbody>
                            </table>

                        </div>


                        <Accordion className="mx-3 mt-3 shadowCus" defaultExpanded={true}>
                            <AccordionSummary

                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                            >
                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                    Address
                                </Typography>

                            </AccordionSummary>
                            <AccordionDetails>
                                {addresses.length != 0 ?
                                    <Typography>

                                        {addresses.map((ele, index) =>
                                            <>
                                                <p>
                                                    <input type="radio" name="address" value={index}
                                                        onClick={(e) => setValues(e.target.value)} />
                                                    &nbsp; &nbsp;
                                                    {ele.address + " " + ele.city + " " + ele.pincode + " " + ele.states + " " + ele.country}
                                                </p>
                                                <hr />

                                            </>
                                        )}
                                    </Typography>
                                    :
                                    <button className="btn btn-primary" onClick={() => navigate('/account/address')}>Add address</button>}
                            </AccordionDetails>
                        </Accordion>
                        <button className='btn btn-danger my-4 w-25' style={{ marginLeft: '1rem' }} onClick={() => checkout()}>Pay {location.state.review.orderTotal}</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
         :
         <Navigate to="/login"></Navigate>
         }
        </>
    )
}

export default Checkout
