import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import AuthContext from './AuthContext'

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null)
    const [ profile, setProfile ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ profileLoading, setProfileLoading ] = useState(false)
    // Tracks which user id the current `profile` belongs to, so token
    // refreshes for the same user never wipe or refetch it.
    const profileUserIdRef = useRef(null)

    useEffect(() => {
        let mounted = true

        // Safety net: if INITIAL_SESSION never fires, stop blocking the UI
        const safetyTimeout = setTimeout(() => {
            if (mounted) setLoading(false)
        }, 10000)

        // IMPORTANT: this callback must stay synchronous. supabase-js holds an
        // internal lock while dispatching auth events; awaiting a supabase
        // query in here deadlocks until it times out. That deadlock was
        // wiping the profile on every TOKEN_REFRESHED (~hourly), making the
        // avatar/session appear to "log out" until a page refresh.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (!mounted) return
            clearTimeout(safetyTimeout)

            if (event === 'SIGNED_OUT' || !session?.user) {
                setUser(null)
                setProfile(null)
                profileUserIdRef.current = null
            } else {
                setUser(session.user)
            }
            setLoading(false)
        })

        return () => {
            mounted = false
            clearTimeout(safetyTimeout)
            subscription?.unsubscribe()
        }
    }, [])

    // Fetch the profile outside the auth callback, and only when the signed-in
    // user actually changes — not on every token refresh.
    useEffect(() => {
        if (!user?.id || profileUserIdRef.current === user.id) return

        let cancelled = false
        setProfileLoading(true)

        const loadProfile = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (cancelled) return

            if (data) {
                setProfile(data)
                profileUserIdRef.current = user.id
            } else if (error?.code === 'PGRST116') {
                // Profile genuinely doesn't exist
                console.error('Profile not found for user')
                setProfile(null)
                profileUserIdRef.current = user.id
            } else if (error) {
                // Transient/network error: keep whatever profile we had and
                // leave profileUserIdRef unset so a later render retries.
                console.error('Error fetching profile:', error.message)
            }
            setProfileLoading(false)
        }

        loadProfile()
        return () => { cancelled = true }
    }, [ user?.id ])

    const signUp = async ({ email, password, fullName, phone }) => {
        try {
            // NOTE: never send `role` in signup metadata — roles are assigned
            // server-side (DB default 'inviter'; admins promote via dashboard).
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName, phone: phone || null },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            if (authError) throw authError
            if (!authData.user) throw new Error('User creation failed - no user returned')

            // Email confirmation required — no session yet
            if (!authData.session) {
                return {
                    data: authData,
                    error: null,
                    requiresEmailConfirmation: true
                }
            }

            // Wait briefly for the DB trigger to create the profile
            await new Promise(resolve => setTimeout(resolve, 1000))

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single()

            if (profileError || !profileData) {
                // Fallback: create profile manually if the trigger didn't run.
                // Role is intentionally omitted — the column default applies.
                const { error: manualError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        email: email,
                        full_name: fullName,
                        phone: phone || null,
                    })

                if (manualError) {
                    throw new Error(`Failed to create profile: ${manualError.message}`)
                }
            }

            return { data: authData, error: null }
        } catch (error) {
            console.error('Signup error:', error.message)
            return { data: null, error }
        }
    }

    const signIn = async ({ email, password }) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('SignIn error:', error.message)
            return { data: null, error }
        }
    }

    const signOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
        } catch (error) {
            console.error('Error signing out:', error.message)
        } finally {
            // Clear state even if the network call failed
            setUser(null)
            setProfile(null)
            profileUserIdRef.current = null
        }
    }

    const isAdmin = () => {
        return profile?.role === 'admin' || profile?.role === 'pcu_host'
    }

    const resetPasswordForEmail = async (email) => {
        try {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Error sending reset email:', error.message)
            return { data: null, error }
        }
    }

    // Update the signed-in user's own profile. Only whitelisted fields are
    // sent — role/email/id can never be changed through this path.
    const updateProfile = async ({ fullName, phone }) => {
        if (!user?.id) return { data: null, error: new Error('Not signed in') }

        const updates = {}
        if (fullName !== undefined) updates.full_name = fullName
        if (phone !== undefined) updates.phone = phone || null

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single()

            if (error) throw error
            setProfile(data)
            return { data, error: null }
        } catch (error) {
            console.error('Error updating profile:', error.message)
            return { data: null, error }
        }
    }

    const updatePassword = async (newPassword) => {
        try {
            const { data, error } = await supabase.auth.updateUser({
                password: newPassword
            })
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Error updating password:', error.message)
            return { data: null, error }
        }
    }

    const value = {
        user,
        profile,
        loading,
        profileLoading,
        signUp,
        signIn,
        signOut,
        isAdmin,
        resetPasswordForEmail,
        updateProfile,
        updatePassword,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
