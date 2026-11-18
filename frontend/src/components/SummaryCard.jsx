export default function SummaryCard({title, value, description, icon, valueColor=""}){
    return(
        <div className="summary-card h-100">
            <div className="d-flex justify-content-between align-items-start">
                <div>
                    <p className="summary-label mb-2">
                        {title}
                    </p>
                    <h3 className={`summary-value mb-1 ${valueColor}`}>
                        {value}
                    </h3>
                    <small className="text-muted">
                        {description}
                    </small>
                </div>

                <div className="summary-icon">
                    {icon}
                </div>

            </div>
        </div>
    )
}