export default function Card({title, children, className=""}){
    return(
        <div className={`card shadow-sm border-0 rounded-3 ${className}`}>
            {title && (
                <div className="card-header bg-white fw-bold py-2">
                    {title}
                </div>
            )}
            <div className="card-body">
                {children}
            </div>

        </div>
    )
}