export default function Card({title,action, children,style, className=""}){
    return(
        <div className={`card shadow-sm border-0 rounded-3 ${className}`} style={style}>
            {title && (
                <div className="card-header bg-white fw-bold py-2 border-0 d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">{title}</h3>
                    {action && <div>{action}</div>}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>

        </div>
    )
}