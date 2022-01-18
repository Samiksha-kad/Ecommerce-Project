import React, { useEffect, useState } from 'react'
import { Modal, Card, Button } from 'react-bootstrap'
import { profileeditService, profilePicService } from '../config/Myservice'
import { Link } from 'react-router-dom';

import { IoCloseCircle } from "react-icons/io5";
import { useDispatch } from 'react-redux'

import jwtdecode from 'jwt-decode';
export default function Profile() {
    const [state, setstate] = useState({ data: {}, firstname: '', lastname: '', gender: '', mobile: '', email: '' })

    const [show, setShow] = useState({ flag: false, count: 1 });

    const handleClose = () => setShow({ ...show, flag: false });
    const dispatch = useDispatch();


    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setstate({
                data: decode, firstname: decode.firstname, lastname: decode.lastname, gender: decode.gender, mobile: decode.mobile, email: decode.email,
                profileImg: decode.profilepic
            })
        }

    }, [show.count])

    const edit = () => { 
        setShow({ ...show, flag: true })
    } 

    const updateProfile = () => {
        let formData = {
            firstname: state.firstname,
            lastname: state.lastname,
            gender: state.gender,
            mobile: state.mobile,
            email: state.email,
            originalEmail: state.data.email 
        }
        profileeditService(formData)
            .then(res => {
                dispatch({ type: "updateProfile", payload: state.firstname + " " + state.lastname })
                localStorage.setItem("_token", res.data.token);
                setstate({ ...state, data: res.data.values })

            })
        setShow({ flag: false })



    }
    const handler = (event) => {
        const { name, value } = event.target;
        setstate({ ...state, [name]: value })
    }
    const filechange = (e) => {
        const formData = new FormData()
        formData.append('profileImg', state.profileImg)
        formData.append('email', state.data.email)
        profilePicService(formData)
            .then((res) => {
                dispatch({ type: "updatePicture", payload: res.data.values.profilepic })
                localStorage.setItem("_token", res.data.token);
                setstate({ ...state, data: res.data.values });
            });
        setShow({ flag: false });
    }

    return (
        <div>
            <div>
                <h3 className="heading_name" >{state.data.firstname}&nbsp;&nbsp;{state.data.lastname}</h3>
                <div >
                    <ul class="nav mt-3">
                        <li class="nav-item">
                            <Link to="/account/address"
                                style={{ color: "#1e90ff", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold", marginLeft: "2.4rem" }}>Address
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to="/account/profile"
                                style={{ color: "#1e90ff", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold", marginLeft: "2.4rem" }}>Profile
                            </Link>
                        </li>

                    </ul>
                </div>

            </div>
            <hr style={{ height: "1px", color: "gray", backgroundColor: "gray", width: "90%", marginTop: "0rem" }} />
            <div style={{ border: "2px solid black", borderRadius: " 10px", boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px", fontFamily: "'Bree Serif', serif", width: "90%", maxHeight: '80vh', overflow: 'auto' }} className="mx-5 p-3">

                <table>
                    <tr>
                        <td>
                            <h5 className="mt-2">
                                First Name
                            </h5>
                        </td>
                        <td>
                            <h5 className="entry_data_profile mt-3">
                                {state.data.firstname}
                            </h5>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h5 className="mt-2">
                                Last Name
                            </h5>
                        </td>
                        <td>
                            <h5 className="entry_data_profile mt-3">
                                {state.data.lastname}
                            </h5>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h5 className="mt-2">
                                Gender
                            </h5>
                        </td>
                        <td>
                            <h5 className="entry_data_profile  mt-3">
                                {state.data.gender}
                            </h5>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h5 className="mt-2">
                                Mobile
                            </h5>
                        </td>
                        <td>
                            <h5 className="entry_data_profile mt-3">
                                {state.data.mobile}
                            </h5>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h5 className="mt-2">
                                Email
                            </h5>
                        </td>
                        <td>
                            <h5 className="entry_data_profile mt-3">
                                {state.data.email}
                            </h5>
                        </td>
                    </tr>


                </table>


                <Button variant="primary" className='button_fun mt-2' onClick={() => edit()}>Edit Profile</Button>
            </div>



            <Modal show={show.flag} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>Edit Profile</Modal.Title>
                    <IoCloseCircle onClick={handleClose} className="close" style={{ width: "5rem", height: "4rem" }} />
                </Modal.Header>
                <Modal.Body>             
                        <div class="form-row">
                            <div class="form-group col-md-6">
                                <label for="firstname">First Name :</label>
                                <input type="text" class="form-control" id="firstname" name="firstname" value={state.firstname} onChange={handler}/>
                            </div>
                            <div class="form-group col-md-6">
                                <label for="lastname">Last Name :</label>
                                <input type="text" class="form-control" id="lastname"  name="lastname" value={state.lastname} onChange={handler}/>
                            </div>
                        </div>
                  


                    <Card.Text>
                        Mobile Number : <input type="text" name="mobile" value={state.mobile} onChange={handler} className="form-control"/>
                    </Card.Text>

                    <Card.Text>
                        Email : <input type="text" name="email" value={state.email} onChange={handler} className="form-control"/>
                    </Card.Text>

                    <Card.Text>
                        Gender : &nbsp;
                        <input type="radio" id="male" name="gender" value="male" onClick={handler} /> <span className='mr-3'> Male</span>
                        <input type="radio" id="female" name="gender" value="female" onClick={handler} /> <span className='mr-3'> Female</span>
                    </Card.Text>

                </Modal.Body>
                <Modal.Footer>

                    <button className="btn btn-success" onClick={() => updateProfile()}>
                        Save Changes
                    </button>
                </Modal.Footer>
                <Card.Text>
                    <span className="ml-2">Profile Picture :</span>
                    <input type="file" className='form-control' onChange={(e) => setstate({ ...state, profileImg: e.target.files[0] })} name="profilepic" />
                </Card.Text>
                <Modal.Footer style={{ backgroundColor: "whitesmoke" }}>
                    <button className="btn btn-info" variant="primary" onClick={() => filechange()}>
                        Update Profile Picture
                    </button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}
