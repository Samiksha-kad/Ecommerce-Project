import React,{useState,useEffect} from 'react'
import {addPosts} from '../config/Myservice'
import SocialButton from './SocialButton';
import {Link} from 'react-router-dom'
import {useNavigate} from 'react-router'
import Navbaar from './Navbaar' 
import Footer from './Footer'
import Swal from 'sweetalert2'
const passFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; 
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const mobileFormat = /^(0|91)?[7-9][0-9]{9}$/;
 
export default function Registration() {
    const navigate = useNavigate()

    const [values, setValues] = useState({ 
        fname: "",
        lname: "",
        email: "",
        mobile: "",
        password: "",
        confpassword: ""
    })
    const [errors, seterrors] = useState({})
    const [isSubmit, setisSubmit] = useState(false)

    const handler = (event) => {
        const { name, value } = event.target
        setValues({ ...values, [name]: value })
    }
    const submit = async (event) => {
    
        seterrors(null)
        let temp = validate(values)
        if (temp.length === 0) {
            
            setisSubmit(true)
            if (values.fname !== '' && values.lname !== '' && values.mobile !== '' && values.email !== '' && values.address !== '' && values.password !== '' && values.confpassword !== '') {
                // check if data is not empty in states
                
                let formData = {  
                    fname: values.fname,
                    lname: values.lname,
                    email: values.email,
                    mobile: values.mobile,
                    password: values.password,
                    confpassword: values.confpassword,
                    gender:values.gender
                }
                // add data in addPosts routes
                await addPosts(formData)
                .then(res =>{
                    if (res.data.err === 0){
                        Swal.fire({
                            icon: 'success',
                            title: res.data.msg,
                            showConfirmButton: false,
                            timer: 1500,
                            width: 600, 
                          })
                        navigate("/login")
                    }
                    else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.msg,
                           
                          })
                    }
                })

            }
        }

    }
    const handleSocialLogin = async (user) => {
                // add data in addPosts routes

        let formData = {
            fname: user._profile.firstName,
            lname: user._profile.lastName,
            email: user._profile.email,
            mobile: 9999999999,
            password: user._profile.id,
            gender: 'undefined'
          };
         await addPosts(formData)
         .then(res =>{
             if (res.data.err === 0){
                Swal.fire({
                    icon: 'success',
                    title: res.data.msg,
                    showConfirmButton: false,
                    timer: 1500,
                    width: 600, 
                  })
                 navigate("/")
             }
             else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.data.msg,
                   
                  })
             }
         })
  };

const handleSocialLoginFailure = (err) => {
    console.error(err);
  };
    const validate = (values) => {
        const e = [];
        const err = {};
        if (!values.fname) {
            e.push({ fname: "first name is required" })
            err.fname = "first name is required"
        }
        if (!values.lname) {
            e.push({ lname: "last name is required" })
            err.lname = "name is required"
        }
        if (!values.email) {
            e.push({ email: "email required" })
            err.email = "email required"
        }
        else if (!mailformat.test(values.email)) {
            e.push({ email: "invalid email" })
            err.email = "invalid email"
        }
        if (!values.password) {
            e.push({ password: "password required" })
            err.password = "password required"
        }
        else if (!passFormat.test(values.password)) {
            e.push({ password: "invalid password" })
            err.password = "invalid password"
        }
        if(!values.confpassword){
            e.push({ confpassword: "confpassword required"})
            err.confpassword = "confpassword required"
        }
        if (!values.mobile) {
            e.push({ mobile: "mobile required" })
            err.mobile = "mobile required"

        }
        else if (!mobileFormat.test(values.mobile)) {
            e.push({ mobile: "invalid phone number" })
            err.mobile = "invalid number"
        }


        seterrors(err)
        return e;
    }
    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmit) {
            console.log(values)
        }
    }, [errors])
    return (
        <div style={{ backgroundColor: "white" }}>
        <Navbaar />
        <div className="container mb-4">
            <div className="row register_box">
                <div className="col">
                <h2 className="heading_register">Register</h2>
                <span className="mt-3 ml-3">Redesign your home enivronment with our premium line of furniture!!</span> 
                <SocialButton
                provider="facebook"
                appId="2171649733000264"
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}  
                className="facebook_logo_register mt-3" >
                <img src="https://westwind.org/wp-content/uploads/2018/11/facebook-logo-png.png" alt="google" style={{ width: "13%",marginRight: "0.3rem"}}/>
                Continue With facebook 
            </SocialButton>

            <SocialButton 
                provider="google"
                appId="420321224046-je2rf4df9mqcua73ve0usqqvrsoqvdi5.apps.googleusercontent.com" 
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}
                className="google_logo_register mt-3">
                     <img src="google.png" alt="google" style={{ width: "13%", padding: "3px", marginLeft: "11px" }}/>
              Continue With Google
            </SocialButton>
            <div className="separator mt-4">
                                    <div class="line"></div>
                                    <p><strong>or Register using</strong></p>
                                    <div class="line"></div>
                                </div>
            <input type="text" 
                           id='fname' 
                           className='input_register mt-3' 
                           name='fname' 
                           placeholder='First Name'
                           value = {values.fname}
                           onChange={handler}
                           
                    />
                    {<span className="text-danger">{errors.fname}</span>}
                    <input type="text" 
                           id='lname' 
                           className='input_register mt-3' 
                           name='lname' 
                           placeholder='Last Name' 
                           value = {values.lname}
                           onChange={handler}
                    />
                    {<span className="text-danger">{errors.lname}</span>}
                    <input type="text" 
                           id='email' 
                           className='input_register mt-3' 
                           name='email' 
                           placeholder='Email Address'
                           value = {values.email}
                           onChange={handler}
                    />
                    {<span className="text-danger">{errors.email}</span>}
                    <input  type="text" 
                            id='contact' 
                            className='input_register mt-3' 
                            name='mobile' 
                            placeholder='Contact'
                            value = {values.mobile}
                           onChange={handler} 
                    />
                    {<span className="text-danger">{errors.mobile}</span>}
                    <input  type="password" 
                            id='password' 
                            className='input_register mt-3' 
                            name='password' 
                            placeholder='Password'
                            value = {values.password}
                           onChange={handler}
                    />
                    {<span className="text-danger">{errors.password}</span>}
                    <input  type="password" 
                            id='cpassword' 
                            className='input_register mt-3' 
                            name='confpassword' 
                            placeholder='Confirm Password'
                            value = {values.confpassword}
                           onChange={handler}
                    />
                    {<span className="text-danger">{errors.confpassword}</span>}
                    <br/>
                    <input type="radio" id="male" name="gen" value="male" onClick={e=> setValues({...values, gender: e.target.value})} className="radio_btn male" /> Male  
                    <input type="radio" id="female" name="gen" value="female" onClick={e=> setValues({...values, gender: e.target.value})} className="radio_btn female"/> Female <br/>
                    <button className='register_btn' onClick={()=>submit()}>Register</button>
                    <div className='text-center mt-3'>
                        <p><strong>Already registered?</strong> &nbsp;&nbsp;&nbsp; <Link to="/login" >Login</Link></p>
                    </div> 
                </div> 
               
                <div className="col_register_box ">
                <img src="http://cdn.shopify.com/s/files/1/0581/8153/articles/rift-composition-sofa-patricia-urquiola-moroso-8_1024x1024.jpg?v=1500514640" alt="..." />
                </div>
            </div>
        </div>
       <Footer />
        </div>
    )
}
