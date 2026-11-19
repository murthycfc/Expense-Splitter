import ExpenseCompoent from "../components/ExpenseCompoent";
import Card from "../components/Card";
import BreadCrumb from "../components/Breadcrumb";
import { useParams } from "react-router";
export default function EditExpense(){
    const {groupId, expenseId} = useParams();
    return(

        <div className="container m-0 mx-md-5 my-md-3">
            <BreadCrumb
                items={[
                    {
                        label:"Groups",
                        to:"/"
                    },
                    {
                        label:"View Group",
                        to:`/groups/${groupId}/view`
                    },
                    {
                        label:"view Expense",
                        to:`/expenses/${expenseId}/view`
                    },
                    {
                        label: "Update Expense"
                    }
                ]}
            />
            <Card>
                <ExpenseCompoent isEdit={true} />
            </Card>
            
        </div>
    )
}