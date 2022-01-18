import React, { useState } from 'react'
import { validation, forgetService } from '../config/Myservice'
import { useNavigate } from 'react-router'
import SocialButton from './SocialButton';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux'
import Navbaar from './Navbaar'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import Footer from './Footer'
export default function Login() { 
    const dispatch = useDispatch();     //dispatch redux 

    const navigate = useNavigate()      //navigation
    const [state, setstate] = useState({    //setstate for email and password
        email: "",
        password: "",
    })
    const handler = (event) => {    //handler
        const { name, value } = event.target
        setstate({ ...state, [name]: value })
    } 
 
    const checkdata = (event) => {      
        // passing data to validation  in post routes 
        if (state.email !== '' && state.password !== '') {
            validation({ email: state.email, password: state.password })
                .then(res => {
                    if (res.data.err === 0)  {
                        localStorage.setItem("_token", res.data.token);
                    let decode = jwtDecode(res.data.token)
                    dispatch({ type: "onLoginDispatch", payload:decode.cart}) 
                    //for adding cart data through redux
                    navigate("/")
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Email or Password does not match!',
                          })
                    }
                })
        }
        else {
            Swal.fire(
                'Empty!!?',
                'Please enter data!!!',
                'question'
              )
        }
    }

    const handleSocialLogin = (user) => {
        // passing data to validation  in post routes 

        validation({ email: user._profile.email, password: user._profile.id })
            .then(res => {
                if (res.data.err === 0) {
                    localStorage.setItem("_token", res.data.token);
                    let decode = jwtDecode(res.data.token)
                    dispatch({ type: "onLoginDispatch", payload:decode.cart})
                    navigate("/")
                    
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: res.data.msg,
                      })
                }
            })
    }

    const handleSocialLoginFailure = (err) => { 
        console.error(err); 
    };
    const forget = () => { 
        // check if email is not empty and pass to forgetService route
        if (state.email !== '') {
            forgetService({ email: state.email })
                .then(res => {
                    if (res.data.err === 0) {
                        navigate("/forgetpassword", { state: { email: state.email, otp: res.data.otp } })
                    }
                    else {
                        Swal.fire({ 
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.msg,
                          })
                    }
                })
        }
        else {
            Swal.fire(
                'Empty!!?',
                'Please enter Email!!!',
                'question'
              )
        }
    }
    return (
        <div style={{backgroundColor:"white"}}>
        <Navbaar />

            <div className="container">
                <div className="row login_box mb-5">

                    <div className=" col_box">
                        <img src="https://images.pexels.com/photos/2079249/pexels-photo-2079249.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="..." />
                    </div>
                    <div className="col" >

                        <div className='container-fluid col_box'>
                            <div >
                                <h2 className="heading_login">Login</h2>
                                <span className="mt-3">Redesign your home enivronment with our premium line of furniture!!</span> 
                                <div className="mt-4">
                                    <SocialButton
                                        provider="facebook"
                                        appId="2171649733000264"
                                        onLoginSuccess={handleSocialLogin}
                                        onLoginFailure={handleSocialLoginFailure}
                                        className="facebook_logo_login">
                                        <img src="https://westwind.org/wp-content/uploads/2018/11/facebook-logo-png.png" alt="google" style={{ width: "15%", padding: "3px", marginLeft: "-2px" }}
                                        />

                                        <strong>Continue With facebook</strong>
                                    </SocialButton>

                                    <SocialButton
                                        provider="google"
                                        appId="420321224046-je2rf4df9mqcua73ve0usqqvrsoqvdi5.apps.googleusercontent.com"
                                        onLoginSuccess={handleSocialLogin}
                                        onLoginFailure={handleSocialLoginFailure}
                                        className="google_logo_login">
                                        <img src="google.png" alt="google" style={{ width: "15%", padding: "3px", marginLeft: "13px" }}
                                        />

                                        <strong>Continue With Google</strong>
                                    </SocialButton>
                                </div>
                                <div className="separator mt-4">
                                    <div class="line"></div>
                                    <p><strong>or Login using</strong></p>
                                    <div class="line"></div>
                                </div>
                                <input className='mt-4 input'
                                    type="text"
                                    name="email"
                                    value={state.email}
                                    onChange={handler}
                                    placeholder='Email Address' />

                                <input className='mt-4 input'
                                    type="password"
                                    name="password"
                                    value={state.password}
                                    onChange={handler}
                                    placeholder='Password' />

                                <br />
                                <p className='m-2' onClick={() => forget()} style={{color:"blue",cursor: "pointer"}}>Forget password?</p>

                                <button className='login_btn' onClick={()=>checkdata()}>Login</button>


                            </div>
                            <div className='text-center mt-3'>
                                <p><strong>Not registered yet?</strong> &nbsp;&nbsp;&nbsp; <Link to="/registration" >Create Account</Link></p>
                                
                                
                            </div>




                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
        
    )
}
