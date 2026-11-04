import { useEffect, useState } from "react"
import { getTotoalExpenses } from "../api/apis";

export default function TotalExpenses(){

    const [total, setTotal] = useState(0);
    const [error, setError] = useState("");
    async function fetchTotalExpenses() {
        try {
            const data = await getTotoalExpenses();
            setTotal(data);
        } catch (error) {
            setError(error.response.data.message);
        }
    }
    useEffect(()=>{
        fetchTotalExpenses();
    },[])
    if(error){
        return(
            <div className="alert alert-danger">
                {error}
            </div>
        )
    }
    return(
        <div className="container">
            <p className="fw-semibold">Total Expenses</p>
            <p className="fw-bold text-primary">₹ {total}</p>
        </div>
    )
}