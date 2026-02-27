import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Star } from "lucide-react"

type ReviewCardProps = {
  name: string
  role?: string
  avatarUrl?: string
  initials?: string
  rating?: number
  text: string
  date?: string
  highlight?: boolean
  className?: string
}

export default function ReviewCard({
  name,
  role,
  avatarUrl,
  initials,
  rating = 5,
  text,
  date,
  highlight = false,
  className,
}: ReviewCardProps) {
  const safeRating = Math.max(0, Math.min(5, Math.round(rating)))

  return (
    <Card
      className={cn(
        "bg-white dark:bg-gray-900",
        highlight ? "border-app-primary/30 shadow-[0_0_0_3px_rgba(36,84,255,0.06)]" : "",
        className
      )}
    >
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{initials || name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{name}</p>
            {role ? <p className="text-xs text-muted-foreground truncate">{role}</p> : null}
          </div>
        </div>

        {safeRating > 0 ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < safeRating ? "fill-app-primary text-app-primary" : "text-gray-300 dark:text-white/20"
                )}
              />
            ))}
          </div>
        ) : null}

        <p className="text-sm leading-6 text-foreground">{text}</p>

        {date ? <p className="text-xs text-muted-foreground">{date}</p> : null}
      </CardContent>
    </Card>
  )
}
