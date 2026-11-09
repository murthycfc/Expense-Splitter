// import { NavLink } from "react-router-dom";
import {Menu, Users2, X } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Button from "./Button";
import { logout } from "../api/apis";
import Modal from "react-bootstrap/Modal";

export default function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [error, setError] = useState();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [token, setToken] = useState(localStorage.getItem("token"))


    function handleLogout(){
        setShowLogoutModal(true);
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
        <nav className="navbar navbar-dark bg-dark py-3">
            <div className="container">
                <div 
                    className="d-flex align-items-center gap-2" 
                    onClick={()=>navigate("/")} 
                    style={{cursor: "pointer"}}
                >
                    <Users2 className="text-primary" size={24}/>
                    <h5 className="text-white mb-0">Expense Splitter</h5>
                </div>

                <div className="d-none d-sm-flex align-items-center gap-3 ms-auto">
                    <NavLink
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
                    </NavLink>

                    {token ? (
                        <Button
                        onClick={handleLogout}
                        className="btn btn-sm btn-outline-light"
                    >
                        Logout
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
                    className="btn btn-dark d-sm-none"
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
                        
                        <NavLink
                            to="/"
                            onClick={()=>setMenuOpen(prev =>!prev)}
                            className={({isActive})=>
                                `nav-link ${isActive ? "text-white text-decoration-underline" : "text-white opacity-50"} `
                            }
                        >
                            Members & Expenses
                        </NavLink>
                        <NavLink
                            to="/balances"
                            onClick={()=>setMenuOpen(prev =>!prev)}
                            className={({isActive})=>
                                `nav-link ${isActive ? "text-white text-decoration-underline" : "text-white opacity-50"} `
                            }
                        >
                            Balances
                        </NavLink>
                        {token ? (
                            <Button
                                onClick={handleLogout}
                                className="btn btn-sm btn-outline-light"
                            >
                            Logout
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
        </nav>

    );
}
