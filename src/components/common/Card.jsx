import { cn } from "../../lib/utils";

export function Card({
  children,
  className,
  title,
  subtitle,
  action,
  padding = "p-5",
  bodyClassName,
  headerClassName,
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",
        className,
      )}
    >
      {(title || subtitle || action) && (
        <div
          className={cn(
            "flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-4",
            headerClassName,
          )}
        >
          <div className="min-w-0">
            {title ? (
              <h3 className="text-sm font-semibold tracking-tight text-gray-900">
                {title}
              </h3>
            ) : null}
            {subtitle ? (
              <p className="mt-1 text-xs text-gray-600">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}

      <div className={cn(padding, bodyClassName)}>{children}</div>
    </section>
  );
}
