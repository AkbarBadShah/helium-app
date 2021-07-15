import React from "react";
import {routes} from "../../project/Const";
import axios from "axios";


export const ForgotPasswordForm = () => {
    let email = ""

   function handleInputChange(event) {
    email = event.target.value
}

    function handleSubmit(event) {
        if (email === "") {
            console.log("Email field is empty!");
        }
        axios({
            method: "post",
            url: "http://127.0.0.1:5000/forgot_password/",
            headers: {
                'Content-type': 'application/json'
            },
            data: {"email": email},
        }).then(
            response => {
                console.log(response);
                if (response.data.message === 'user_not_found'){
                    console.log("Email doesn't exist!")
                } else if (response.data.message === 'success') {
                    console.log("Success!")
                }
            }
        ).catch(
            error => {
                console.log(error);
            }
        );
    }
 return (
        <>
            <div className="card-body">
					<form>
					 	<div className="form-group">
					    	<label htmlFor="Email">Enter your email to receive a login link</label>
					    	<input type="text" className="form-control" id="email" placeholder="Enter the Email"
                            onChange={handleInputChange}/>
					  	</div>

					</form>
					<button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
   				</div>

        </>
    );
}
export const ForgotPasswordFormFooter = () => {
    return (
            <a href={routes['login']} className="btn card-footer-anchor"><i className="fa fa-lock"/>Back to login</a>
    )
}