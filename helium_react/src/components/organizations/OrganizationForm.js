import React, {Component} from "react";
import Logo from "../../assets/images/login.jpg";
import '../../assets/App.css';
import axios from "axios";
import InviteUser from "./InviteUser";


export default class OrganizationForm extends Component {
    constructor() {
        super()
        this.state = {
            passcode: "",
            invite_user_page: null
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleInputChange(event) {
        this.setState({passcode: event.target.value})
    }

    handleSubmit(event) {
        axios({
            method: "post",
            url: `http://127.0.0.1:5000/surveys/${this.props.survey_slug}/`,
            headers: {
                'Content-type': 'application/json'
            },
            data: {pass_code: this.state.passcode},
        }).then(
            response => {
                console.log(response);
                if (response.data.message === "success") {
                    this.setState({invite_user_page: true})
                }
            }
        ).catch(
            error => {
                console.log(error);
                if (error.response.statusText === "UNAUTHORIZED") {
                    console.log("Wrong password/email!")
                }
            }
        );
    }

    render() {
        return (
            <>
                {
                    this.state.invite_user_page
                        ? <InviteUser survey_slug={this.props.survey_slug}/>
                        : <div className="organization-login-invite-user">
                            <div className="img-div mb-3 mt-5"><img src={Logo} width="300"/></div>
                            <div className="maincenter ">
                                <div className="card marginauto">
                                    <div className="card-body ">

                                        <p className="card-text textp"><b>Sustain 6</b> requires a password for self
                                            registration.
                                            If you do not know the password please talk to your employer.</p>
                                        <label className="lab">Enter Organization Password*</label>
                                        <input type="password" name="passcode" className="form-control mb-3"
                                               onChange={this.handleInputChange}/>
                                        <button className="btn btn-primary"
                                                onClick={this.handleSubmit}>Continue <i className="fa fa-send"/></button>
                                    </div>

                                </div>
                            </div>

                        </div>
                }
            </>
        )
    }
}