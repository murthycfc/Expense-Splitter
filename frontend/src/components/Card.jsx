export default function Card({title,action,icon, children,style, className=""}){
    const hasNoPadding = className.includes("p-0");
    return(
        <div className={`card shadow-sm rounded-3 ${className}`} style={style}>
            {title && (
                <div className="card-header bg-white fw-bold  border-0 d-flex justify-content-between align-items-center mt-2">
                    <div className="d-flex align-items-center gap-2">
                        {icon}
                        <h3 className="mb-0">{title}</h3>
                    </div>
                    
                    {action && <div>{action}</div>}
                </div>
            )}
            {!title && action && (
                <div className="card-header bg-white fw-bold py-2 border-0 d-flex justify-content-end align-items-center">
                    <div>{action}</div>
                </div>
            )}
            <div className={`card-body ${hasNoPadding ? "p-0": ""} `}>
                {children}
            </div>

        </div>
    )
}