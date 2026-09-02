import { icons } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconName = keyof typeof icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number | string;
  strokeWidth?: number;
  className?: string;
}

export function Icon({
  name,
  size = 24,
  strokeWidth = 1.5,
  className,
  ...props
}: IconProps) {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in lucide-react`);
    return null;
  }

  return (
    <LucideIcon
      size={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
