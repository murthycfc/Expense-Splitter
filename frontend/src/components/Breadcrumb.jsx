import { Home } from "lucide-react";
import { Link } from "react-router";
export default function BreadCrumb({items=[]}){
    return(
        <nav aria-label="breadcrumb" className="mb-3 ">
            <ol className="breadcrumb align-items-center mb-0">
                {items.map((item, index)=>{
                    const isLast = index === items.length - 1;
                    return(
                        <li
                            key={index}
                            className={`breadcrumb-item ${
                                isLast ? "fw-semibold" : ""
                            }`}
                            aria-current={isLast ? "page" : undefined}
                        >
                            {!isLast && item.to ? (
                                <Link
                                    to={item.to}
                                >
                                    {item.label}
                                </Link>
                            ):(
                                <span>{item.label}</span>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}