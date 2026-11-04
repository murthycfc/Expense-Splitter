import { useState } from "react";
import { register } from "../api/apis";
import Card from "../components/Card";
import RegisterValidation from "../validation/RegistrationValidation";
import { useNavigate } from "react-router";
import Input from "../components/Input";
import Button from "../components/Button";
import { Eye, EyeOff } from "lucide-react";
import bgImage from "../assets/bg123.png";
export default function Registration(){
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword: "",
        phoneNumber:""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors,setErros] = useState({});

    function handleChange(e){
        const {id, value} = e.target;
        setRegisterData(prev =>({
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
        console.log(registerData);
        setErros({})
        const valiadationErrors = RegisterValidation(registerData);
        if(Object.keys(valiadationErrors).length>0){
            setErros(valiadationErrors);
            return ""
        }
        try {
            console.log(registerData);

            const data = await register(registerData);
            localStorage.setItem("role", data.role);
            localStorage.setItem("token", data.token);
            navigate("/");
        } catch (error) {
            setErros({server:error?.response?.data?.message})
        }
    }


    return (
        <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="container-fluid">
                <div className="row align-items-center min-vh-100 justify-content-end">
                    {/* <div className="col-12 col-md-4 text-center">
                        <img 
                            src="/expense.png"
                            className="img-fluid w-75"
                            alt="expense splitter "
                        />
                        <h3 className="fw-bold" style={{color:"#5F259F"}}>Expense Splitter</h3>
                    </div> */}
                    <div className="col-12 col-md-6">
                        <Card className="p-2 m-2">
                            <div className="d-flex flex-column">
                                <h3 className="fw-bold text-center" style={{color:"#5F259F"}}>Register</h3>
                                <h5 className="fw-semibold">Create a new Account</h5>
                                <p>Sign up to manage your shared expenses</p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                <div className="col-12 col-md-6">
                                    <Input 
                                        id="name"
                                        type="text"
                                        label="Name"
                                        required
                                        placeholder="Enter Name"
                                        value={registerData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Input 
                                        id="email"
                                        type="text"
                                        label="Email"
                                        required
                                        placeholder="Enter Email"
                                        value={registerData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Input 
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        label="Password"
                                        required
                                        placeholder="Enter Password"
                                        value={registerData.password}
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
                                </div>
                                <div className="col-12 col-md-6">
                                    <Input 
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        label="Confirm Password"
                                        required
                                        placeholder="Enter Confirm Password"
                                        value={registerData.confirmPassword}
                                        onChange={handleChange}
                                        error={errors.confirmPassword}
                                        eye={
                                            <Button
                                                type="button"
                                                onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
                                                className="border-0 text-muted bg-white"
                                            >
                                                {showPassword ? <Eye /> : <EyeOff />}
                                            </Button>
                                        }
                                    />
                                </div>
                                <div className="col-12 col-md-6">
                                    <Input 
                                        id="phoneNumber"
                                        type="text"
                                        label="Phone Number"
                                        required
                                        placeholder="Enter Phone Number"
                                        value={registerData.phoneNumber}
                                        onChange={handleChange}
                                        error={errors.phoneNumber}
                                    />
                                </div>
                                </div>
                                {errors.server && (
                                    <div className="alert alert-danger mt-2">
                                        {errors.server}
                                    </div>
                                )}

                                <div className="text-center">
                                    <Button className="btn-phonepe  w-50">
                                        Register
                                    </Button>
                                </div>
                            </form>
                            <div className=" text-center mt-3">
                                <span>Already have an account?</span> {' '}
                                <a href="/login">Login</a>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </div>
    )
}