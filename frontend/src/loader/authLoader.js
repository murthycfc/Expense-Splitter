import { redirect } from "react-router";

export default function AuthLoader(){
    const token = localStorage.getItem("token");
    if(!token){
        throw redirect("/login");
    }
    return null;
}