export default function DateFormatter({date}){
    if(!date) {
        return null;
    }
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(new Date(date));
    return(
        <div>
            {formattedDate}
        </div>
    )
}