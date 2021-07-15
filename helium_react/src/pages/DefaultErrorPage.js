import React from "react";
import NavBar from "../components/layout/NavBar";
import {Footer} from "../components/layout/Footer";
import {NotFound} from "../components/general/NotFound";


export function DefaultErrorPage() {
    return (
        <>
            <NotFound/>
        </>
    )
}