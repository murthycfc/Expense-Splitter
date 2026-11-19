import { Home } from "lucide-react";
import { Link } from "react-router";
export default function BreadCrumb({items=[]}){
    return(
        <nav aria-label="breadcrumb" className="mb-3 ">
            <ol className="breadcrumb align-items-center mb-0">
                <li className="breadcrumb-item">
                    <Link
                        to="/"
                        className="text-decoration-none text-muted d-flex align-items-center"
                    >
                        <Home size={16}/>
                    </Link>
                </li>
                {items.map((item, index)=>{
                    const isLast = index === items.length - 1;
                    return(
                        <li
                            key={index}
                            className={`breadcrumb-item ${
                                isLast ? "active fw-semibold" : ""
                            }`}
                            aria-current={isLast ? "page" : undefined}
                        >
                            {!isLast && item.to ? (
                                <Link
                                    to={item.to}
                                    className="text-decoration-none"
                                >
                                    {item.label}
                                </Link>
                            ):(
                                <span className="">{item.label}</span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}