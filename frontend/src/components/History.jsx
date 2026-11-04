import { useEffect, useState } from "react"
import { deleteExpense, getAllExpenses } from "../api/apis";
import { Edit, Trash2 } from "lucide-react";
import Modal from "react-bootstrap/Modal";
import Button from "./Button";
import { useNavigate } from "react-router";
import DateFormatter from "../utils/dateFormatter";

export default function History({expenses, fetchExpenses}){

    // const [expenses, setExpenses] = useState([]);

    // async function fetchAllExpenses() {
    //     const data = await getAllExpenses();
    //     setExpenses(data)
    // }
    // useEffect(()=>{
    //     fetchAllExpenses();
    // },[tempData])
    const [error, setError] = useState();
    const [selectedExpense, setSelectedExpense] = useState();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    function handleDelete(expense){
        setSelectedExpense(expense);
        setShowModal(true)
    }
    async function confirmeDelete() {
        setError("");
        try {
            console.log(selectedExpense.id);
            const data = await deleteExpense(selectedExpense.id);
            fetchExpenses();
        } catch (error) {
            setError(error?.response?.data?.message);
        }
        finally{
            setShowModal(false)
        }
    }
    return(
<>

         {expenses.length===0 ? (
            <tr className="text-center d-flex justify-content-center">
                <img src="/no_expense2.png" width="400" height="300" className="center" />
            </tr>
        ) : (

                       
        <div className="container mb-4">
            <div className="">
                {error && (
                    <div className="alert alert-danger mt-3">
                        {error}
                    </div>
                )}
                <div className="table-responsive border rounded">
                <table className="table align-middle table-hover">
                    <colgroup>
                        <col style={{width: "5%"}}/>
                        <col style={{width: "10%"}}/>
                        <col style={{width: "10%"}}/>
                        <col style={{width: "10%"}}/>
                        <col style={{width: "10%"}}/>
                        <col style={{width: "15%"}}/>
                        <col style={{width: "35%"}}/>
                        <col style={{width: "10%"}}/>

                    </colgroup>
                    <thead className="table-light ">
                        <tr>
                            <th className="px-3">#</th>
                            <th>Description</th>
                            <th>Amount(₹)</th>
                            <th>Paid By</th>
                            <th>Split Type</th>
                            <th>Date</th>
                            <th>Participants</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    
                    
                    <tbody className="">
                        {expenses.map((expense, index)=>(
                            
                                <tr key={expense.id}>
                                    <td className="px-3">{index+1}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.amount}</td>
                                    <td>{expense.paidBy}</td>
                                    <td>{expense.status}</td>
                                    <td><DateFormatter date={expense.date}/></td>
                                    <td>{expense.participants.join(", ")}</td>
                                    <td className="d-flex gap-3">
                                        <span className="text-primary" onClick={()=>navigate(`/expense/edit/${expense.id}`)}>
                                            <Edit className="hover-scale"/>
                                        </span>
                                        <span className="text-danger" onClick={()=>handleDelete(expense)}>
                                            <Trash2 className="hover-scale"/>
                                        </span>
                                    </td>
                                </tr>
                            ))
                        }
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
                        Delete Expense
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to Delete this expense?</p>
                    {selectedExpense && (
                        <div className="bg-light rounded p-3">
                            <strong>
                                {selectedExpense?.description}
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
                        onClick={confirmeDelete}
                    >
                        Confirm Delete
                    </Button>
                </Modal.Footer>

           </Modal>
        </div>
         )}

    </>
    )
}