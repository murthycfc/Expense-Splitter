import { useState } from "react";
import Card from "../components/Card";
import Input from "../components/Input";
import { Eye, EyeOff } from "lucide-react";
import Button from "../components/Button";
import { login } from "../api/apis";
import { useNavigate } from "react-router";
import LoginValidation from "../validation/LoginValidation";
import "../css/Login.css";
import bgImage from "../assets/bg123.png";
export default function Login(){
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email:"",
        password:""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors,setErros] = useState({});

    function handleChange(e){
        const {id, value} = e.target;
        setLoginData(prev =>({
            ...prev,
            [id]: value
        }))
        setErros(prev=>({
            ...prev,
            [id]:""
        }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setErros({})
        const valiadationErrors = LoginValidation(loginData.email, loginData.password);
        if(Object.keys(valiadationErrors).length>0){
            setErros(valiadationErrors);
            return ""
        }
        try {
            console.log(loginData);

            const data = await login(loginData);
            localStorage.setItem("role", data.role);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (error) {
            setErros({server:error?.response?.data?.message})
        }
    }

    return(
        <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="container-fluid">
                
                <div className="row min-vh-100 align-items-center justify-content-end">
                    {/* <div className="col-12 col-md-6 text-center">
                        <img  
                            src="/expense.png"
                            className="img-fluid w-75"
                            alt="expense splitter "
                        />
                        <h3 className="fw-bold" style={{color:"#5F259F"}}>Expense Splitter</h3>
                    </div> */}
                    <div className="col-12 col-md-5">
                        <Card className="p-2">
                            <div className="d-flex flex-column">
                                <h3 className="fw-bold text-center" style={{color:"#5F259F"}}>Login</h3>
                                <h5 className="fw-semibold">Welcome Back!</h5>
                                <p>Sign in to manage your shared expenses</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <Input 
                                    id="email"
                                    type="text"
                                    label="Email"
                                    required
                                    placeholder="Enter Email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    error={errors.email}
                                />
                                <Input 
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    label="Password"
                                    required
                                    placeholder="Enter Password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    eye={
                                        <Button
                                            type="button"
                                            onClick={()=>setShowPassword(!showPassword)}
                                            className="border-0 text-muted bg-white"
                                        >
                                            {showPassword ? <Eye /> : <EyeOff />}
                                        </Button>
                                    }
                                />

                                {errors.server && (
                                    <div className="alert alert-danger mt-2">
                                        {errors.server}
                                    </div>
                                )}

                                <div className="text-center">
                                    <Button className="btn-phonepe  w-50">
                                        Login
                                    </Button>
                                </div>
                            </form>

                            <div className=" text-center mt-3">
                                <span>Don't have an account?</span> {' '}
                                <a href="/register">Register</a>
                            </div>
                            
                        </Card>
                    </div>

                </div>
                
            </div>
        </div>
    )
}