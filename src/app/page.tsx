"use client"

import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession()

    if (data.session) {
      router.push("/dashboard")
    }
  }

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    })
  }

  return (
    <div className="flex items-center justify-center h-screen">

      <button
        onClick={login}
        className="bg-blue-500 text-white px-6 py-3 rounded"
      >
        Login with Google
      </button>

    </div>
  )
}
