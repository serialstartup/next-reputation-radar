"use client"

import { useState, useRef, useEffect } from "react"
import { Bell, Search, Loader2, Star, Link2, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

interface AppHeaderProps {
  title: string
  description?: string
}

export function AppHeader({ title, description }: AppHeaderProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Search on input change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 2) {
        setLoading(true)
        fetch(`/api/search?q=${encodeURIComponent(query)}`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data.results)
            setLoading(false)
            setShowResults(true)
          })
          .catch(() => {
            setLoading(false)
          })
      } else {
        setResults(null)
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleResultClick = (type: string, id: string) => {
    setShowResults(false)
    setQuery("")
    if (type === "review") {
      router.push(`/reviews?query=${encodeURIComponent(query)}`)
    } else if (type === "source") {
      router.push("/sources")
    } else if (type === "competitor") {
      router.push("/competitors")
    }
  }

  const totalResults = results
    ? (results.reviews?.length || 0) + (results.sources?.length || 0) + (results.competitors?.length || 0)
    : 0

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex-1">
        <h1 className="text-sm font-semibold">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block" ref={searchRef}>
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reviews, sources..."
            className="h-8 w-64 pl-9 text-xs"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results && totalResults > 0) setShowResults(true)
            }}
          />
          {loading && (
            <Loader2 className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}

          {/* Search Results Dropdown */}
          {showResults && totalResults > 0 && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-md border bg-background shadow-lg z-50">
              <div className="p-2">
                <p className="text-xs text-muted-foreground px-2 py-1">
                  {totalResults} result{totalResults !== 1 ? "s" : ""} for "{query}"
                </p>

                {results.reviews?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium px-2 py-1 text-muted-foreground">Reviews</p>
                    {results.reviews.slice(0, 3).map((review: any) => (
                      <button
                        key={review.id}
                        className="w-full text-left px-2 py-2 hover:bg-muted rounded-md"
                        onClick={() => handleResultClick("review", review.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-amber-500" />
                          <span className="text-xs font-medium truncate">{review.author}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{review.text}</p>
                      </button>
                    ))}
                  </div>
                )}

                {results.sources?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium px-2 py-1 text-muted-foreground">Sources</p>
                    {results.sources.map((source: any) => (
                      <button
                        key={source.id}
                        className="w-full text-left px-2 py-2 hover:bg-muted rounded-md"
                        onClick={() => handleResultClick("source", source.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Link2 className="h-3 w-3 text-blue-500" />
                          <span className="text-xs">{source.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {results.competitors?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium px-2 py-1 text-muted-foreground">Competitors</p>
                    {results.competitors.map((competitor: any) => (
                      <button
                        key={competitor.id}
                        className="w-full text-left px-2 py-2 hover:bg-muted rounded-md"
                        onClick={() => handleResultClick("competitor", competitor.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 text-green-500" />
                          <span className="text-xs">{competitor.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon-sm" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center">
            3
          </span>
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs">JD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
