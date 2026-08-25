import { cn } from "@/lib/cn";

/** `wide` is the browsing width, `narrow` the reading width. */

const WIDTHS = {
  wide: "max-w-6xl",
  narrow: "max-w-5xl",
} as const;

export type PageContainerProps = React.ComponentProps<"div"> & {
  width?: keyof typeof WIDTHS;
  as?: "div" | "article";
};

export function PageContainer({
  width = "wide",
  as: Tag = "div",
  className,
  ...props
}: PageContainerProps) {
  return (
    <Tag
      {...props}
      className={cn("mx-auto flex flex-col gap-8", WIDTHS[width], className)}
    />
  );
}
