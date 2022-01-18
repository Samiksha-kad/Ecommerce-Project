import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Form, FormControl, NavDropdown } from 'react-bootstrap'
import { MdAccountBox, MdAccountCircle } from 'react-icons/md'
import { BiLogIn, BiLogOut, BiUserPlus } from "react-icons/bi";
import { useSelector } from 'react-redux'
import { cartSaveService } from '../config/Myservice';
import jwtDecode from 'jwt-decode';
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
export default function Navbaar() {

    const [login, setlogin] = useState(false)
    const [state, setState] = useState({})
    const [searchKey, setsearchKey] = useState('')
    const cartData = useSelector(state => state.cartReducer)

    const dispatch = useDispatch();


    useEffect(() => {
        // decode data from token
        if (localStorage.getItem('_token') != undefined) {
            setlogin(true)
            let token = localStorage.getItem('_token');
            let decode = jwtDecode(token)
            setState(decode)
        }
        


    }, [])

    const logout = () => {
        // remove data from token and cart and save exsisting data in cart save service
        let token = localStorage.getItem('_token');
        let data = JSON.parse(localStorage.getItem('cart'))
        let decode = jwtDecode(token)
        cartSaveService({ data: data, email: decode.email })
            .then(res => {
                console.log(res.data)
            })
        localStorage.removeItem('_token');
        localStorage.removeItem('cart');
        dispatch({ type: "emptyCart", payload: 0 })

    }
    const searchDispatch = () => {
        // dispatch data from search keyword
        dispatch({
          type: "searchKeyword",
          payload: searchKey,
        });
        setsearchKey("")
      };
    return (
        <div>
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark " style={{backgroundColor:"black"}}>
                    <div className="container-fluid">
                        <Link className="navbar-brand font-weight-bold" to="/dashboard" style={{ fontSize: "1.6rem" }}>Neo<span style={{ color: "red" }}>STORE</span></Link>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav">

                                <li className="nav-item ">
                                    <NavLink className="nav-link" activclassname="active_navbar" to="/">Home</NavLink>
                                </li>

                                <li className="nav-item ml-3">
                                    <NavLink className="nav-link" activeclassname="active_navbar" to="/product">Product</NavLink>
                                </li>
                                <li className="nav-item ml-3">
                                    {login ?
                                        <NavLink className="nav-link" activeclassname="active_navbar" to="/account/order">Order</NavLink>
                                        :
                                        <NavLink className="nav-link" activeclassname="active_navbar" to="/login">Order</NavLink>
                                    }
                                </li>
                            </ul>
                        </div>

                        <Form className="d-flex">
                            <FormControl
                                type="search"
                                placeholder="Search"
                                className="me-2"
                                aria-label="Search"
                                value={searchKey}
                                onChange={(e)=>setsearchKey(e.target.value)}
                            />
                            <Button variant="outline-success" className='ml-2 mr-4' onClick={()=>searchDispatch()}>Search</Button>
                        </Form>
                        <div> 
                            <Link to="/cart" style={{ color: "white", textDecoration: "none" }}> <IconButton aria-label="cart">
                                <StyledBadge badgeContent={cartData.count} color="secondary">
                                    <ShoppingCartIcon style={{ color: "white" }}/>
                                </StyledBadge>
                            </IconButton>
                            <span className="ml-2 ">Cart </span>
                            </Link>
                        </div>
                        {login ?
                            <NavDropdown title={<MdAccountBox style={{ backgroundColor: 'white', color: 'black', width: '30px', height: '27px' }} />} id="navbarScrollingDropdown" style={{ marginLeft: '1vw', width: '50px', height: '40px', backgroundColor: "white", borderRadius: '5px' }}>
                                <NavDropdown.Item ><Link to="/account/profile" style={{ color: "black", textDecoration: "none" }} ><MdAccountCircle /> My Account</Link></NavDropdown.Item>
                                <NavDropdown.Item ><Link to="/" style={{ color: "black", textDecoration: "none" }} onClick={() => logout()}><BiLogOut />&nbsp;&nbsp; Signout</Link></NavDropdown.Item>
                            </NavDropdown>
                            :
                            <NavDropdown title={<MdAccountBox style={{ backgroundColor: 'white', color: 'black', width: '30px', height: '27px' }} />} id="navbarScrollingDropdown" style={{ marginLeft: '1vw', width: '50px', height: '40px', backgroundColor: "white", borderRadius: '5px' }}>
                                <NavDropdown.Item ><Link to="/login" style={{ color: "black", textDecoration: "none" }} ><BiLogIn />&nbsp;&nbsp;Login</Link></NavDropdown.Item>
                                <NavDropdown.Item ><Link to="/registration" style={{ color: "black", textDecoration: "none" }}><BiUserPlus />&nbsp;&nbsp; Register</Link></NavDropdown.Item>
                            </NavDropdown>
                        }

                    </div>
                </nav>
            </div>
        </div>
    )
}