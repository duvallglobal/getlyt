"use client"

import type React from "react"

import { createContext, useState, useEffect } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

// User profile type
export type UserProfile = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  is_admin: boolean | null
}

// Extended user type with profile
export type ExtendedUser = User & {
  profile?: UserProfile | null
}

type AuthContextType = {
  user: ExtendedUser | null
  profile: UserProfile | null
  session: Session | null
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string },
  ) => Promise<{ error: any | null; data: any | null }>
  signOut: () => Promise<void>
  loading: boolean
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, data: null }),
  signOut: async () => {},
  loading: true,
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
      return null
    }
  }

  // Refresh user profile
  const refreshProfile = async () => {
    if (!user) return

    const profile = await fetchUserProfile(user.id)
    if (profile) {
      setProfile(profile)
      setUser((prev) => (prev ? { ...prev, profile } : null))
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)

        // Get current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        if (session) {
          setSession(session)
          setUser(session.user)

          // Fetch user profile
          const profile = await fetchUserProfile(session.user.id)
          if (profile) {
            setProfile(profile)
            setUser((prev) => (prev ? { ...prev, profile } : null))
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user || null)

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        if (profile) {
          setProfile(profile)
          setUser((prev) => (prev ? { ...prev, profile } : null))
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [toast])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error("Error in signIn:", error)
      return { error }
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        return { error, data: null }
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase.from("user_profiles").insert({
          id: data.user.id,
          first_name: metadata?.first_name || null,
          last_name: metadata?.last_name || null,
          is_admin: false,
        })

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }
      }

      return { error: null, data }
    } catch (error) {
      console.error("Error in signUp:", error)
      return { error, data: null }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
    } catch (error) {
      console.error("Error in signOut:", error)
      toast({
        title: "Sign Out Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        signIn,
        signUp,
        signOut,
        loading,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

