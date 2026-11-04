// import { NavLink } from "react-router-dom";
import {Menu, Users2, X } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Button from "./Button";
export default function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
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

                    {/* <Button
                        to="https://www.google.com"
                        className="btn btn-sm btn-outline-light"
                    >
                        Logout
                    </Button> */}
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
                            Members & Expenses
                        </NavLink>
                        {/* <Button
                            to="https://www.google.com"
                            className="btn btn-sm btn-outline-light"
                        >
                            Logout
                        </Button> */}
                    </div>
                )}
            </div>
        </nav>
    );
}
