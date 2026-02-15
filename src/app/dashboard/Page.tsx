"use client"

import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {

  const router = useRouter()

  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

  // Correct initialization
  useEffect(() => {

    const init = async () => {

      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/")
        return
      }

      await fetchBookmarks()
      setupRealtime()
    }

    init()

  }, [])

  // Fetch bookmarks
  const fetchBookmarks = async () => {

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      console.log("No user found")
      return
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.log("Fetch error:", error.message)
      return
    }

    setBookmarks(data || [])
  }

  // Add bookmark
  const addBookmark = async () => {

    if (!title || !url) {
      alert("Enter title and URL")
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert("User not logged in")
      return
    }

    const { error } = await supabase
      .from("bookmarks")
      .insert({
        title: title,
        url: url,
        user_id: user.id
      })

    if (error) {
      alert("Error: " + error.message)
      return
    }

    await fetchBookmarks()

    setTitle("")
    setUrl("")
  }

  // Delete bookmark
  const deleteBookmark = async (id: string) => {

    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Delete error: " + error.message)
      return
    }

    await fetchBookmarks()
  }

  // Logout
  const logout = async () => {

    await supabase.auth.signOut()
    router.push("/")
  }

  // Realtime updates
  const setupRealtime = () => {

    supabase
      .channel("bookmarks-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks"
        },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()
  }

  return (

  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

    <div className="max-w-xl mx-auto bg-white shadow-xl rounded-2xl p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold text-gray-800">
          Smart Bookmarks
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 active:scale-95 transition transform text-white px-4 py-2 rounded-lg shadow cursor-pointer"
        >
          Logout
        </button>

      </div>

      {/* Add Bookmark Card */}

      <div className="bg-gray-50 p-4 rounded-xl shadow-inner mb-6">

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Bookmark title"
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={addBookmark}
          className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 transition transform text-white p-3 rounded-lg shadow font-semibold cursor-pointer"
        >
          Add Bookmark
        </button>

      </div>

      {/* Bookmark List */}

      <div className="space-y-3">

        {bookmarks.map((bookmark) => (

          <div
            key={bookmark.id}
            className="bg-white border rounded-xl p-4 shadow hover:shadow-lg hover:scale-[1.02] transition transform flex justify-between items-center"
          >

            <div>

              <p className="font-semibold text-gray-800">
                {bookmark.title}
              </p>

              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {bookmark.url}
              </a>

            </div>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="bg-red-100 text-red-600 hover:bg-red-500 hover:text-white active:scale-95 transition transform px-3 py-1 rounded-lg cursor-pointer"
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </div>

  </div>

)

}
