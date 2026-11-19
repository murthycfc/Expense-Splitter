import { useParams } from "react-router";
import BreadCrumb from "../components/Breadcrumb";
import Card from "../components/Card";
import ExpenseCompoent from "../components/ExpenseCompoent";

export default function CreateExpense(){
    const {groupId} = useParams();
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
                        label: "Create Expense"
                    }
                ]}
            />
            
            <Card>
                <ExpenseCompoent  isEdit={false} />
            </Card>
            
        </div>
    )
}