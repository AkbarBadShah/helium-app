import React from "react";
import Logo from "../../assets/images/login.jpg";
import {routes} from "../../project/Const";
import axios from "axios";
import {login} from "../../utilities/auth";


export default function InviteUser(props) {
    let email = ""

    function handleInputChange(event) {
        email = event.target.value
    }

    function handleSubmit(event) {
        if (email !== "") {
            axios({
                method: "post",
                url: `http://127.0.0.1:5000/${props.survey_slug}/invite/`,
                headers: {
                    'Content-type': 'application/json'
                },
                data: {email: email},
            }).then(
                response => {
                    console.log(response);
                    console.log(response.data.message)
                }
            ).catch(
                error => {
                    console.log(error);
                }
            );
        }
    }

    return (
        <div className="organization-login">
            <div className="mb-3 mt-5"><img src={Logo} alt="logo" width="300"/></div>
            <div className="card marginauto">
                <div className="card inside p-3">
                    <label className="lab">Email</label>
                    <input type="text" name="something" className="form-control mb-3" onChange={handleInputChange}/>
                    <button className="btn btn-primary mb-2" style={{width: "150px;"}} onClick={handleSubmit}>Create
                        Survey<i
                            className="fa fa-send"/></button>
                </div>
                <div className="card-footer" style={{padding: "2 !important"}}><a
                    href={routes['forgot_password']}><i
                    className="fa fa-lock" style={{fontSize: "16px"}}/> Forget Password?</a></div>
            </div>
        </div>
    )
}