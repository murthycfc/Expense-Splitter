import ExpenseCompoent from "../components/ExpenseCompoent";
import Card from "../components/Card";
export default function EditExpense(){
    return(

        <div className="m-5">
            <Card>
                <ExpenseCompoent isEdit={true} />
            </Card>
            
        </div>
    )
}