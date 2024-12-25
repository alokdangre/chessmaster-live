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
    ws.connect("ws://localhost:8000")

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
    }
  }, [ws, navigate])

  const handlePlay = () => {
    ws.send({ type: "joinGame" })
    setIsWaiting(true)
  }

  const handleSpectate = () => ws.send({ type: "spectate" })

  return (
    <div className="min-h-screen bg-[#312E2B] text-white">
      <nav className="fixed left-0 top-0 h-full w-64 bg-[#272522] p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Chess Arena</h1>
        </div>
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#3E3B38]">
            Play
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#3E3B38]">
            Puzzles
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#3E3B38]">
            Learn
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#3E3B38]">
            Watch
          </Button>
        </div>
      </nav>
      <main className="ml-64 p-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-2 text-5xl font-bold">Play Chess Online</h1>
          <h2 className="mb-8 text-2xl text-gray-400">on Chess Arena!</h2>
          <div className="mb-8 flex justify-center gap-4 text-sm text-gray-400">
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
              <span className="ml-2 text-sm opacity-80">Play with someone at your level</span>
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleSpectate}
              className="w-full bg-[#3E3B38] hover:bg-[#4A4745]"
            >
              <Bot className="mr-2 h-5 w-5" />
              Watch Games
              <span className="ml-2 text-sm opacity-80">Spectate live matches</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

