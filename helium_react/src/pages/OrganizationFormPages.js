import React, {Component} from "react";
import NavBar from "../components/layout/NavBar"
import {Footer} from "../components/layout/Footer";
import axios from "axios";
import OrganizationForm from "../components/organizations/OrganizationForm";
import {DefaultErrorPage} from "./DefaultErrorPage";
import {useParams} from "react-router-dom";
import {NotFound} from "../components/general/NotFound";

class OrganizationFormClass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_valid: null
        }
    }

    componentDidMount() {
        axios(
            {
                url: `http://127.0.0.1:5000/surveys/${this.props.survey_slug}/`,
                method: "get",
            }).then(
            response => {
                console.log(response);
                if (response.data.message === 'success') {
                    this.setState({is_valid: true})
                }
            }
        ).catch(
            error => {
                console.log(error);
            })
    }

    render() {
        return (
            <>
                {
                    this.state.is_valid
                        ? <OrganizationForm survey_slug={this.props.survey_slug}/>
                        : <NotFound/>
                }
            </>
        )
    }
}


export default function OrganizationFormPages() {
    const {survey_slug} = useParams()
    return (
        <OrganizationFormClass survey_slug={survey_slug}/>
    )
}