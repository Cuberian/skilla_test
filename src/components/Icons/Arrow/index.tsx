import type {FC, SVGProps} from "react";
import ArrowUp from "@/assets/arrow-up.svg?react";
import ArrowDown from "@/assets/arrow-down.svg?react";

type Direction = "up" | "down" | "left" | "right";

interface ArrowProps {
    direction?: Direction;
    size?: number;
    className?: string;
}

const Arrow: FC<ArrowProps> =
    ({ direction = "up", size = 16,className = "" }) => {
    let rotation = "";
    let Icon: FC<SVGProps<SVGSVGElement>>;

    switch (direction) {
        case "down":
            Icon = ArrowDown;
            break;
        case "left":
            Icon = ArrowUp;
            rotation = "rotate-[-90deg]";
            break;
        case "right":
            Icon = ArrowUp;
            rotation = "rotate-[90deg]";
            break;
        case "up":
        default:
            Icon = ArrowUp;
            break;
    }

    return (
        <Icon
            className={`${rotation} ${className}`}
            width={size}
            height={size}
        />
    );
};

export default Arrow;