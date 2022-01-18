import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'
import { addAddressService } from '../config/Myservice';
import { IoCloseCircle } from "react-icons/io5"; 
import { Alert } from '@mui/material';
import {useLocation,useNavigate} from 'react-router-dom'
import Swal from 'sweetalert2'

const regForAddress = RegExp(/^([A-Za-z]|[0-9]|[\w\s])+$/);
const regForPincode = RegExp(/^[1-9][0-9]{5}/); 
const regForName = RegExp(/^[a-zA-Z]/);

export default function Address() {
	const location = useLocation();
	const navigate = useNavigate();

    const [add, setadd] = useState({})
    const [flagProceed,setFlagProceed] = useState(false)
    const [state, setstate] = useState({ addresses: [], address: '', city: '', pincode: '', states: '', country: '', flag1: false, flag2: false, index: null })
    const [errors, seterrors] = useState('')

    const handleClose = () => {
        setstate({ ...state, address: '', city: '', pincode: '', states: '', country: '', flag1: false, flag2: false })
    }

    useEffect(() => {
        if (localStorage.getItem('_token') != undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            setadd(decode)
            setstate({ ...state, addresses: decode.addresses })
        } 
        if(location.state!=null){
            setFlagProceed(true)
        }
    }, [])
    const SelectAddress = (ele)=>{
        navigate("/checkout", { state: {review:location.state.review,cart:location.state.cart,address:ele} })

    }
    const updateAddress = () => {
        if (state.address != '' && state.city != '' && state.pincode != '' && state.states != '' && state.country != '') {

            let data = state.addresses
            let formData = {
                address: state.address,
                city: state.city,
                pincode: parseInt(state.pincode),
                states: state.states,
                country: state.country
            }
            data[state.index] = formData
            setstate({ ...state, addresses: data, flag2: false, address: '', city: '', pincode: '', states: '', country: '' })
            addAddressService({ data: state.addresses, email: add.email })
                .then(res => {
                    localStorage.setItem("_token", res.data.token);
                })
                setstate({ ...state, address:'', city: '', pincode: '', states: '', country: '', flag1: false, flag2: false })
        }
        else{
            seterrors("Enter All Fields")
        } 

    }
    const handler = (event) => {
        const { name, value } = event.target;
        let error = ''
        switch (name) {
            case "address":
                error = regForAddress.test(value) ? "" : "Invalid Address";
                seterrors(error);
                break;

            case "pincode":
                error = regForPincode.test(value) ? "" : "Invalid Pincode";
                seterrors(error);
                break;

            case "city":
                error = regForName.test(value) ? "" : "Invalid City";
                seterrors(error);
                break;

            case "states":
                error = regForName.test(value) ? "" : "Invalid State";
                seterrors(error);
                break;

            case "country":
                error = regForName.test(value) ? "" : "Invalid Country Name";
                seterrors(error);
                break;
            default:
                break;
        }
        setstate({ ...state, [name]: value })
    }
    const addAddress = () => {
        const email = add.email;
        if (state.address !== '' && state.city !== '' && state.pincode !== '' && state.states !== '' && state.country !== '') {
            let formData = {
                address: state.address,
                city: state.city,
                pincode: parseInt(state.pincode),
                states: state.states,
                country: state.country,
            }
            if (state.addresses.find(ele => JSON.stringify(ele) === JSON.stringify(formData)) === undefined) {
                let data = state.addresses
                data.push(formData)
                setstate({ ...state, addresses: data, flag1: true })
                addAddressService({ data: data, email })
                    .then(res => {
                        localStorage.setItem("_token", res.data.token);
                    })

            }
            else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Address already added!',
                  })
            }
            setstate({ ...state, flag1: false, flag2: false, address: '', city: '', pincode: '', states: '', country: '' })
           
        }
        else{
            seterrors("Enter All fields")
        }
    }

    const editAddress = (ele, index) => {
        seterrors('');
        setstate({ ...state,flag1:true, flag2: false, index: index, address: ele.address, city: ele.city, pincode: ele.pincode, states: ele.states, country: ele.country })

    }

    const deleteaddress = (index) => {
        let data = state.addresses
        data.splice(index, 1)

        setstate({ ...state, addresses: data, address: '', city: '', pincode: '', states: '', country: '' })
        addAddressService({ data: data, email: add.email })
            .then(res => {
                localStorage.setItem("_token", res.data.token);
            })

    }

    return (
        <div>
            <div>
                <h3 className="heading_name_address" >{add.firstname}&nbsp;&nbsp;{add.lastname}</h3>
                <div >
         

                    <ul class="nav mt-3">
                        <li class="nav-item">
                            <Link to="/account/address"
                                style={{ color: "#1e90ff", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold", marginLeft: "2.4rem" }}>Address
                            </Link>
                        </li>
                        <li class="nav-item">
                            <Link to="/account/profile"
                                style={{ color: "#1e90ff", fontSize: "1.3em", paddingLeft: "1rem", fontWeight: "bold", marginLeft: "2rem" }}>Profile
                            </Link>
                        </li>

                    </ul>
                </div>  

            </div>
            <hr style={{ height: "1px", color: "gray", backgroundColor: "gray", width: "90%", marginTop: "0rem", }} />
            <div style={{ border: "2px solid black", borderRadius: " 10px",boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",fontFamily: "'Bree Serif', serif", width: "90%" ,maxHeight:'60vh',overflow:'auto'}} className="mx-5 p-3">
                <hr />
                {state.addresses.map((ele, index) =>
                    <>
                        <div>
                            <h5>{ele.address}</h5>
                            <h6>{ele.city} - {ele.pincode}</h6>
                            <h6>{ele.states} - {ele.country}</h6>
                            
                            <button className="btn btn-outline-info" onClick={() => editAddress(ele, index)}>Edit</button> &nbsp;&nbsp;
                            <button className="btn btn-outline-danger" onClick={() => deleteaddress(index)}>delete</button> &nbsp;&nbsp;
                            {flagProceed &&
                            <button className="btn btn-outline-success" onClick={() => SelectAddress(ele)}>Select</button>
                                        }
                        </div>
                        <hr />
                    </>
                )}

<Button variant="primary" className='button_fun' onClick={() => setstate({ ...state, flag1: true, flag2: true })}>Add New Address</Button>
            </div>

            <Modal show={state.flag1} onHide={handleClose}>
                <Modal.Header >
                    <Modal.Title>Edit Address</Modal.Title>
                    <IoCloseCircle onClick={handleClose} className="close_address" style={{ width: "2rem", height: "2rem",cursor:"pointer" }} />
                </Modal.Header>

                <Modal.Body>
                    {errors.length != 0 &&
                        <Alert severity="error">{errors}</Alert>}
                    Address :
                    <input type="text" className='form-control' name='address' value={state.address} onChange={handler} />
                    City :
                    <input type="text" className='form-control' name='city' value={state.city} onChange={handler} />

                    Pincode :
                    <input type="text" className='form-control' name='pincode' value={state.pincode} onChange={handler} />

                    State :
                    <input type="text" className='form-control' name='states' value={state.states} onChange={handler} />

                    Country :
                    <input type="text" className='form-control' name='country' value={state.country} onChange={handler} />
                </Modal.Body>
                <Modal.Footer>
                    {state.flag2 ?
                        <Button className='button_fun' variant="primary" onClick={() => addAddress()}>Save</Button>
                        :
                        <Button className='button_fun' variant="primary" onClick={() => updateAddress()}>Update</Button>
                    }
                </Modal.Footer>
            </Modal>
        </div >
    )
}
