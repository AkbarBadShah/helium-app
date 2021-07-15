import React from "react";
import {useHistory, useParams} from "react-router-dom";
import axios from "axios";
import {login} from "../utilities/auth";
import {routes} from "../project/Const";
import {Login} from "./LoginPages";
import ProfilePage from "./ProfilePage";
import {LoginForm, LoginFormFooter} from "../components/users/LoginForm";

export function LoginByTokenPage() {
    const {token} = useParams()
    let is_token_valid = false
    axios({
        method: "get",
        url: `http://127.0.0.1:5000/send_login_link/${token}/`,
        headers: {
            'Content-type': 'application/json'
        },
    }).then(
        response => {
            console.log(response);
            if (response.data.message === 'success') {
                login(response.data.access_token)
                // history.push(routes['profile'])
                is_token_valid = true
            }
        }
    ).catch(
        error => {
            console.log(error);
            if (error.response) {
                if (error.response.statusText === "UNAUTHORIZED") {
                    console.log("Wrong password/email!")
                }
            }
            // history.push(routes['login'])
        }
    );
    return (
        <>
            {is_token_valid ? <ProfilePage/> : <Login form_type={<LoginForm/>} footer={<LoginFormFooter/>}/>
            }
        </>
    )
}