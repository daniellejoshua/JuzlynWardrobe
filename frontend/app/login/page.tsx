"use client"
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { useEffect } from "react";


export default function LoginPage() {
    const {user,loading,signIn} = useAuth()
    const router = useRouter()

    useEffect(() => {
      if(!loading && user) router.push("/wardrobe");
    }, [user,loading])

    if (loading) return <p>Loading....</p>
    if(user) return null
    return(<div>
        <div className="min-h-screen flex items-center justify-center bg-background">
      <button onClick={signIn}
        className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90"
      >
        Sign in with Google
      </button>
    </div>
    </div>)

}

