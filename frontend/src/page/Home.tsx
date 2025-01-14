import { Button } from "@/components/ui/button"
import { WebSocketService } from "../services/WebSocketService"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Bot, Users } from 'lucide-react'

export default function Home() {
  const ws = WebSocketService.getInstance()
  const navigate = useNavigate()
  const [isWaiting, setIsWaiting] = useState(false)
  const [playerCount] = useState({ total: 0, active: 0 })

  useEffect(() => {
    ws.connect(import.meta.env.VITE_WEBSOCKET_URL)

    const handleGameStart = (data: { type: string; color: "white" | "black" }) => {
      if (data.type === "startGame" && data.color) {
        navigate(`/chess-game?color=${data.color}`)
      }
    }

    const handleSpectate = (data: { type: string; boardState: string }) => {
      if (data.type === "spectateGame") {
        navigate(`/chess-game?color=${data.boardState}`)
      }
    }

    ws.on("startGame", handleGameStart)
    ws.on("spectateGame", handleSpectate)

    return () => {
      ws.off("startGame", handleGameStart)
      ws.off("spectateGame", handleSpectate)
    }
  }, [ws, navigate])

  const handlePlay = () => {
    ws.send({ type: "joinGame" })
    setIsWaiting(true)
  }

  const handleSpectate = () => ws.send({ type: "spectate" })

  return (
    <div className="min-h-screen bg-[#312E2B] text-white">
      <nav className="fixed left-0 top-0 h-full w-64 bg-[#272522] p-4 md:static md:w-full md:h-auto">
        <div className="mb-8 flex justify-between md:items-center">
          <h1 className="text-2xl font-bold">Chess Arena</h1>
        </div>
        <div className="space-y-2 md:flex md:space-y-0 md:space-x-4">
          {["Play", "Puzzles", "Learn", "Watch"].map((item) => (
            <Button
              key={item}
              variant="ghost"
              className="w-full text-white hover:bg-[#3E3B38] md:w-auto"
            >
              {item}
            </Button>
          ))}
        </div>
      </nav>
      <main className="ml-64 p-8 md:ml-0">
        <div className="mx-auto max-w-4xl text-center px-4">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">Play Chess Online</h1>
          <h2 className="mb-8 text-xl text-gray-400 md:text-2xl">on Chess Arena!</h2>
          <div className="mb-8 flex flex-col items-center gap-4 text-sm text-gray-400 sm:flex-row sm:justify-center">
            <div>
              <span className="font-bold text-white">{playerCount.total.toLocaleString()}</span> Games Today
            </div>
            <div>
              <span className="font-bold text-white">{playerCount.active.toLocaleString()}</span> Playing Now
            </div>
          </div>
          <div className="grid gap-4">
            <Button
              size="lg"
              onClick={handlePlay}
              disabled={isWaiting}
              className="w-full bg-[#86B817] hover:bg-[#759E15]"
            >
              <Users className="mr-2 h-5 w-5" />
              {isWaiting ? "Waiting for Opponent..." : "Play Online"}
              <span className="ml-2 text-sm opacity-80 hidden sm:inline">
                Play with someone at your level
              </span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSpectate}
              className="w-full bg-[#3E3B38] hover:bg-[#4A4745]"
            >
              <Bot className="mr-2 h-5 w-5" />
              Watch Games
              <span className="ml-2 text-sm opacity-80 hidden sm:inline">
                Spectate live matches
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>

  )
}
