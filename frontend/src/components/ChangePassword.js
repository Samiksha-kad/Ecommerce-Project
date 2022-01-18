import React, { useState, useEffect } from 'react'
import jwtdecode from 'jwt-decode';
import { changePasswordService } from '../config/Myservice'
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'

export default function ChangePassword() {
    const [state, setstate] = useState({ oldpassword: "", newpassword: "", confpassword: "" })
    const [pass, setpass] = useState({ password: '', email: '' })
    const handler = (event) => {
        const { name, value } = event.target
        setstate({ ...state, [name]: value })
    }
    useEffect(() => {
        if (localStorage.getItem('_token') !== undefined) {
            let token = localStorage.getItem('_token');
            let decode = jwtdecode(token)
            setpass({ password: decode.password, email: decode.email })
        }
    }, [])

    const submit = () => {
        if (state.oldpassword !== '' && bcrypt.compareSync(state.oldpassword, pass.password)) {
            if (state.newpassword !== '' && state.confpassword !== ''&& state.newpassword === state.confpassword) {
                changePasswordService({ email: pass.email, password: state.newpassword })
                    .then(res => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Password updated successfully!',
                          })
                          setstate({ oldpassword: "", newpassword: "", confpassword: "" })
                        localStorage.setItem("_token", res.data.token);
                    })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Password mismatch!',
                  })
            }
        }
        else {
            Swal.fire(
                'Empty?',
                'Please enter details?',
              )
        }
    }

    return (
        <>
        <div className='changepass'>

            <h2 className="heading_change_password mt-2">Change password</h2>
            <div className="text-center">
                <input type="password" className="change_input_password" id="oldpassword" placeholder="Old password" name="oldpassword" onChange={handler}
                    value={state.oldpassword} />
                    <br/>

                <input type="password" className="change_input_password" id="newpassword"
                    placeholder="New password" name="newpassword"
                    value={state.newpassword} onChange={handler} />
                    <br/>

                <input type="password" className="change_input_password" id="confpassword"
                    placeholder="Confirm password" name="confpassword" onChange={handler}
                    value={state.confpassword} />
                    <br/>
                <div class="col-12">
                    <button className=" btn btn-success changePass_Submit" onClick={() => submit()}>Submit</button>
                </div>
            </div>

        </div>
        </>
    )
}
 