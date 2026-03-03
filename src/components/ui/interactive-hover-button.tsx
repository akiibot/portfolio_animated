import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
}

const InteractiveHoverButton = React.forwardRef<
    HTMLButtonElement,
    InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                "group relative w-32 cursor-pointer overflow-hidden rounded-full border bg-white p-2 text-center font-semibold text-black",
                className,
            )}
            {...props}
        >
            <span className="relative z-10 inline-block translate-x-1 text-black transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                {text}
            </span>
            <div className="absolute top-0 z-20 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-white opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100">
                <span>{text}</span>
                <ArrowRight className="h-4 w-4" />
            </div>
            <div className="absolute left-[20%] top-[40%] h-2 w-2 scale-[1] rounded-full bg-black transition-transform duration-300 group-hover:scale-[60]"></div>
        </button>
    );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

export { InteractiveHoverButton };
