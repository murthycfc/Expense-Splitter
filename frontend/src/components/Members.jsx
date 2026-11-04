import { use, useEffect, useState } from "react"
import { deleteUser, getAllUsers } from "../api/apis";
import { Delete, Trash2 } from "lucide-react";
import Button from "./Button";
import '../App.css'

import Modal from "react-bootstrap/Modal";


export default function Members({members, fetchUsers}){
    const [error, setError] = useState();
    const [selectedUser, setSelectedUser] = useState();
    const [showModal, setShowModal] = useState(false);

    function handleDelete(user){
        setSelectedUser(user);
        setShowModal(true)
    }
    
    async function confirmDelete() {
        setError("");
        try {
            await deleteUser(selectedUser.id);
            fetchUsers();   
        } catch (error) {
            setError(error?.response?.data?.message);
        }
        finally{
            setShowModal(false)
        }
        
    }
    return(
        <div className="container mb-4">
            <div className="">
                {error && (
                    <div className="alert alert-danger mt-2">
                        {error}
                    </div>
                )}
                <div className="table-responsive border rounded">
                    <table className="table align-middle table-hover mb-0">
                    <colgroup>
                        <col style={{width: "10%"}}/>
                        <col style={{width: "30%"}}/>
                        <col style={{width: "30%"}}/>
                        <col style={{width: "30%"}}/>
                    </colgroup>
                    <thead className="table-light">
                        <tr>
                            <th className="px-3">#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    
                    <tbody className="">
                        {members.map((user, index)=>(
                            
                            <tr key={user.id}>
                                <td className="px-3">{index+1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td 
                                    className="text-danger " 
                                    onClick={()=>handleDelete(user)}
                                ><Trash2 className="hover-scale" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Delete user
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to Delete this user?</p>
                    {selectedUser && (
                        <div className="bg-light rounded p-3">
                            <strong>
                                {selectedUser.name}
                            </strong>
                        </div>
                    )}
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                    >
                        Close
                    </Button>
                    <Button
                        className="btn btn-danger"
                        onClick={confirmDelete}
                    >
                        Confirm Delete
                    </Button>
                </Modal.Footer>

           </Modal>
        </div>
    )
}