import React, { useState,useEffect } from 'react'
import {useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { resetPassService } from '../config/Myservice';
import Swal from 'sweetalert2'
import {forgetService} from '../config/Myservice'
const passFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;  

export default function Forgetpassword() {
	const [state, setstate] = useState({ otp: null, flag: false, pass: '', cpass: '' })
	const [Otp, setOtp] = useState(0)
	const location = useLocation();
	const navigate = useNavigate()
	useEffect(()=>{ 
        setOtp(location.state.otp)

    },[])

	const submitotp = () => {
		if (state.otp != null) {
			if (state.otp == Otp) {
				Swal.fire({
					icon: 'success',
					title: 'Otp Match',
				  })
				
				setstate({ ...state, flag: true })
			}
			else {
				Swal.fire({
					icon: 'error',
					title: 'Oops...',
					text: 'OTP does not match!',
				  })
			}
		}
		else {
			Swal.fire(
                'Empty!!?',
                'Enter OTP!!!',
                'question'
              )
		}
	}
	const resendotp = () => {
        forgetService({ email: location.state.email })
            .then(res => {
                setOtp(res.data.otp)
            }) 


    }
	const resetpass = () => {
		if (passFormat.test(state.pass) && state.pass === state.cpass) {
			resetPassService({ email: location.state.email, password: state.pass })
				.then(res => {
					Swal.fire({
						text: res.data.msg,
					  })
					navigate('/login') 
				})
		}
		else {
			Swal.fire(
                'Empty!!?',
                'Enter Details !!!',
                'question'
              )
		}
	}

	return (
		<div id="forgetPass">
			<div className="container-fluid">
				<div className="row">
					{state.flag !== true ?
						<div className="col-lg-6 col-md-6 form-container">
							<div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box">
								<div className="reset-form d-block">
									<div className="reset-password-form">
										<h4 className="mb-3 heading_reset_pass">Reset Your Password</h4>
										<p className="mb-3 otp_email">
											An 4 digit OTP is sent to your registered email address
										</p>
										<div className="form-input">
											<input type="email" placeholder="Email Address" value={location.state.email} disabled className="input_pass email" 
											style={{width: "20rem",padding: "0.2rem",    borderRadius: "20px",marginLeft: "3rem",    fontSize:" 1rem"}}/>
										</div>
										<div className="form-input">
											<input type="text" value={state.otp} onChange={(e) => setstate({ ...state, otp: e.target.value })} placeholder="Enter OTP"
											className="input_pass mt-2" 
											style={{width: "20rem",padding: "0.2rem",    borderRadius: "20px",marginLeft: "3rem",    fontSize:" 1rem"}}/>
										</div>
										<div className="mb-3">
											<button className="btn submit_pass_forget" onClick={() => submitotp()}>Submit</button>
											<button className="btn resend_forget_pass" onClick={() => resendotp()}>Resend Otp</button>
										</div>
									</div>
								</div>

							</div>
						</div>
						:

						<div className="col-lg-6 col-md-6 form-container">
							<div className="col-lg-8 col-md-12 col-sm-9 col-xs-12 form-box p-5">
								<div className="reset-form d-block">
									<div className="reset-password-form">
										<h4 className="mb-3 heading_reset">Reset Your Password</h4>
										<p className="mb-3 otp_email">
											Enter Your New Password
										</p>
										<div className="form-input">
										
											<input type="password" placeholder="New Password" onChange={(e) => setstate({ ...state, pass: e.target.value })} value={state.pass} className="input_pass"/>
										</div>
										<div className="form-input"> 
										
											<input type="password" value={state.cpass} onChange={(e) => setstate({ ...state, cpass: e.target.value })} placeholder="Confirm Password" className="input_pass"/>
										</div>
										<div className="mb-3">
											<button className="reset_pass_forget" onClick={() => resetpass()}>Reset</button>
										</div>
									</div>
								</div>

							</div>
						</div>

					}

					<div className="col-lg-6 col-md-6 d-none d-md-block image-container2"></div>
				</div>
			</div>
		</div>

	)
}

