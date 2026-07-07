"use client"
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});


export function AuthProvider({children}:{children:React.ReactNode}){
    const [user,setUser] = useState<User | null>(null)
    const [loading,setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
      supabase.auth.getUser().then(({data})=>{
        setUser(data.user)
        setLoading(false)
      })
    }, [])

    const signIn = async ()=>{
        await supabase.auth.signInWithOAuth({
            provider:"google",
            options:{redirectTo: `${window.location.origin}/auth/callback`}
        })
    }

    const signOut = async ()=>{
        await supabase.auth.signOut()
        setUser(null)
        router.push("/login")
    }
    
    return(
        <AuthContext.Provider value ={{user,loading,signIn,signOut}}>
            {children}
        </AuthContext.Provider>
    )
    
}

export const useAuth = () => useContext(AuthContext);