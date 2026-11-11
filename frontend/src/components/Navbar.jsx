// import { NavLink } from "react-router-dom";
import {CircleUserRound, LogOut, Mail, Menu, User, Users2, X } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Button from "./Button";
import { getProfile, logout } from "../api/apis";
import Modal from "react-bootstrap/Modal";
import {  FaUsers } from "react-icons/fa";
import Card from "./Card";
// import '../App.css'

export default function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [error, setError] = useState();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"))
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [userInfo, setUserInfo] = useState();


    function handleLogout(){
        setShowLogoutModal(true);
    }

    async function handleProfile(){
        setShowProfileModal(true);
        try {
            const data = await getProfile();
            console.log(data);
            setUserInfo(data);
        } catch (error) {
            setError(error?.response?.data?.message ?? "Something went wrong");
        }
    }

    async function confirmLogout() {
        try {
            const data = await logout();
            localStorage.clear();
            console.log(data);
            setToken(null);
            navigate("/login")

        } catch (error) {
            setError(error?.response?.data?.message);
        }
    }
    return (
        <nav className="navbar navbar-expand-lg navbar-dark py-3 app-navbar" >
            <div className="container">
                <div 
                    className="navbar-brand d-flex align-items-center gap-2 m-0 p-0" 
                    onClick={()=>navigate("/")} 
                    style={{cursor: "pointer"}}
                >
                    <FaUsers className="navbar-logo" size={40}/>
                    <span className="fw-bold">Expense Splitter</span>
                </div>

                <div className="d-none d-sm-flex align-items-center gap-3 ms-auto">
                    {/* <NavLink
                        to="/" 
                        className={({ isActive }) => `nav-link  ${isActive ? 'text-white text-decoration-underline ' : 'text-white opacity-50'}`}
                    >
                        Members & Expenses
                    </NavLink>

                    <NavLink 
                        to="/balances" 
                        className={({ isActive }) => `nav-link  ${isActive ? 'text-white text-decoration-underline' : 'text-white opacity-50'}`}
                    >
                        Balances
                    </NavLink> */}

                    <Button
                        className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold p-0"
                        onClick={handleProfile}
                    >
                         <CircleUserRound size={32}/>
                    </Button>


                    {token ? (
                        <Button
                        onClick={handleLogout}
                        className="btn btn-sm btn-outline-light"
                    >
                        <LogOut />
                        <span className="ms-2">Logout</span>
                    </Button>
                    ) : (
                        <Button
                            onClick={()=>navigate("/login")}
                            className="btn btn-sm btn-outline-light"
                        >
                            Login
                        </Button>
                        )
                    }
                    
                </div>
                <Button
                    className="btn text-white d-sm-none"
                    onClick={()=>setMenuOpen(prev=>!prev)}
                    aria-label="Toggle navigation"
                >
                    {menuOpen ? (
                        <X size={28}/>
                    ) : ( 
                        <Menu size={28}/>
                    )}
                </Button>

                {menuOpen && (
                    <div className="d-flex d-sm-none flex-column align-items-center gap-2 mt-2 w-100">
                        
                        {/* <NavLink
                            to="/"
                            onClick={()=>setMenuOpen(prev =>!prev)}
                            className={({isActive})=>
                                `nav-link ${isActive ? "text-white text-decoration-underline" : "text-white opacity-50"} `
                            }
                        >
                            Members & Expenses
                        </NavLink> */}
                        {/* <NavLink
                            to="/balances"
                            onClick={()=>setMenuOpen(prev =>!prev)}
                            className={({isActive})=>
                                `nav-link ${isActive ? "text-white text-decoration-underline" : "text-white opacity-50"} `
                            }
                        >
                            Balances
                        </NavLink> */}
                        <Button
                            className="d-flex align-items-center justify-content-center rounded-circle text-white fw-bold p-0"
                            onClick={handleProfile}
                        >
                            {/* <CircleUserRound size={32}/> */}
                            <span>Profile</span>
                        </Button>
                        {token ? (
                            <Button
                                onClick={handleLogout}
                                className="btn btn-sm btn-outline-light"
                            >
                                <LogOut /> Logout
                            
                            </Button>
                        ) : (
                                <Button
                                    onClick={()=>navigate("/login")}
                                    className="btn btn-sm btn-outline-light"
                                >
                                    Login
                                </Button>
                        )}
                        
                    </div>
                )}
            </div>
            <Modal
                show={showLogoutModal}
                onHide={()=>setShowLogoutModal(false)}
                centered
            >
                <Modal.Header closeButton className="position-relative p-4">
                    <Modal.Title className="position-absolute start-50">
                        Logout <span className="text-danger mx-1 mb-1"><TriangleAlert /></span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p className="text-center">Are you sure want to logout!</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        onClick={()=>setShowLogoutModal(false)}
                        className="btn btn-secondary"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={()=>confirmLogout()}
                        className="btn btn-danger"
                    >
                        Logout
                    </Button>
                </Modal.Footer>
                
            </Modal>
            <Modal
                show={showProfileModal}
                onHide={()=>{
                    setShowProfileModal(false)
                    setError()
                }}
                centered    
            >
                <Modal.Header 
                    closeButton
                    className="text-center"
                    style={{backgroundColor: "#6b36c0"}}
                >
                    <Modal.Title className="w-100 text-center m-0">
                        <div className="d-flex justify-content-center align-items-center">
                            <div
                                className="d-flex align-items-center justify-content-center rounded-circle  text-white fw-bold"
                                style={{width: "52px", height:"52px", fontSize: "26px", backgroundColor: "#ec403d"}}
                            >
                                {userInfo?.name.trim().charAt(0).toUpperCase()}
                            </div>

                        </div>
                    </Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column" >
                        <div className="d-flex flex-column align-items-center">
                            <div className="fw-bold fs-4">{userInfo?.name}</div>
                            <div><Mail size={18}/> {userInfo?.email}</div>
                        </div>

                        <div>
                            <Card className="mt-2">
                                <div className="table-responsive">
                                    <table className="table align-middle">
                                        <colgroup>
                                            <col style={{width: "40%"}}/>
                                            <col style={{width: "60%"}}/>
                                        </colgroup>
                                        <thead >
                                            <tr>
                                                <th 
                                                    colSpan="2" className="py-2 px-3 border-0 fw-bold text-white text-center" style={{backgroundColor:"#8539d6"}}
                                                >
                                                    Personal information
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <User size={20}/>
                                                        <span>Name</span>
                                                    </div>
                                                </td>
                                                <td>{userInfo?.name}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <div className="d-flex align-items-center gap-1">
                                                        <Mail size={20}/>
                                                        <span>Email</span>
                                                    </div>
                                                </td>
                                                <td>{userInfo?.email}</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <div className="d-flex justify-content-center w-100">
                        <Button
                            className="btn-phonepe hover-scale w-75"
                            onClick={()=>{
                                setShowProfileModal(false)
                            }}
                        >
                            Close
                        </Button>
                    </div>
                    
                </Modal.Footer>

            </Modal>
        </nav>

    );
}
