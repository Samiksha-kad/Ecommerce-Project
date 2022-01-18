import React, { useState, useEffect } from 'react'
import { Link, Outlet,Navigate } from 'react-router-dom';
import jwtdecode from 'jwt-decode';
import Footer from './Footer'; 
import Navbaar from './Navbaar';
import { useDispatch, useSelector } from 'react-redux'
import { BsFillCartCheckFill } from "react-icons/bs";
import { IoLockOpen } from "react-icons/io5";
import { GrLocation } from "react-icons/gr";
import { ImProfile } from "react-icons/im";

import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Account() {
    const [state, setstate] = useState({})
    const profileName = useSelector(state => state.profileReducer)
    const dispatch = useDispatch();
    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setstate(decode)
            dispatch({ type: "updateProfile", payload: decode.firstname + " " + decode.lastname })
            dispatch({ type: "updatePicture", payload: decode.profilepic })
 

        }
    }, [])
    return ( 
        <>
        {localStorage.getItem('_token') != undefined ?
        <div style={{ backgroundColor: "white" }}>
            <Navbaar />
            <div style={{ width: "100%", height: "80vh" }}>
                <div className="row " >
                    <div className="col-3" > 
                        <div className="img_box1_account" >
                            <div className='text-center bg_img' id='bg_img'>
                                {profileName.profile === undefined ?
                                    <img src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQJxKGGpPc9-5g25KWwnsCCy9O_dlS4HWo5A&usqp=CAU`} alt='Profile' className='profileImg_account' />
                                    : <img src={`../images/${profileName.profile}`} alt='Profile' className='profileImg_account' />}
                            </div>

 
                        </div>
                        <div className="container mt-2">
                            <h3 className="heading_name_profile">{profileName.name}</h3>
                            

                            <ul>

                                <div>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <Typography  style={{ color: "black", fontSize: "1em", fontWeight: "bold" }}>My Account</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <li>
                                                    <GrLocation
                                                        style={{ width: "1.7rem", height: "3rem", marginBottom: " -0.7rem" }} />
                                                    <Link to="address"
                                                        style={{ color: "black", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold" }}>Address
                                                    </Link>
                                                </li>
                                            </Typography>
                                            <Typography>
                                                <li>
                                                    <ImProfile
                                                        style={{ width: "1.7rem", height: "3rem", marginBottom: " -0.7rem" }} />
                                                    <Link to="profile"
                                                        style={{ color: "black", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold" }}>Profile
                                                    </Link>
                                                </li>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>


                                </div>

                                <li style={{marginLeft:"1rem"}}>
                                    <BsFillCartCheckFill
                                        style={{ width: "1.7rem", height: "3rem", marginBottom: " -0.7rem" }} />
                                    <Link to="/account/order"
                                        style={{ color: "black", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold" ,marginLeft:"1rem"}}>Order
                                    </Link>
                                </li>
                                <li style={{marginLeft:"1rem"}} >
                                    <IoLockOpen
                                        style={{ width: "2rem", height: "3rem", marginBottom: " -0.7rem" }} />
                                    <Link to="/account/changePass"
                                        style={{ color: "black", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold"}}>Change Password
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-9">

                        <Outlet />
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
