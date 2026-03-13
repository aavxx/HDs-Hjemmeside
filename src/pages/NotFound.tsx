import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center stagger-children space-y-6">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <p className="text-lg text-muted-foreground">
          Siden blev ikke fundet
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-foreground link-underline group"
        >
          <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
          Tilbage til forsiden
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
