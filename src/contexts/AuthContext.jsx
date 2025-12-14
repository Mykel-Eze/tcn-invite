import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check active session
        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔄 Auth state changed:', {
                event,
                hasSession: !!session,
                hasUser: !!session?.user
            })

            try {
                if (session?.user) {
                    console.log('✓ Setting user:', session.user.id)
                    setUser(session.user)
                    await fetchProfile(session.user.id)
                } else {
                    console.log('⚠️ No session, clearing user')
                    setUser(null)
                    setProfile(null)
                }
            } catch (error) {
                console.error('❌ Error in auth state change handler:', error)
            } finally {
                console.log('✓ Auth state change complete, setting loading to false')
                setLoading(false)
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const checkUser = async () => {
        try {
            console.log('🔍 Checking user session...')
            const { data: { session }, error } = await supabase.auth.getSession()

            if (error) {
                console.error('❌ Error getting session:', error)
                setUser(null)
                setProfile(null)
                setLoading(false)
                return
            }

            if (session?.user) {
                console.log('✓ Session found for user:', session.user.id)
                setUser(session.user)
                await fetchProfile(session.user.id)
            } else {
                console.log('⚠️ No active session found')
                setUser(null)
                setProfile(null)
            }
        } catch (error) {
            console.error('❌ Error checking user:', error)
            setUser(null)
            setProfile(null)
        } finally {
            console.log('✓ Setting loading to false')
            setLoading(false)
        }
    }

    const fetchProfile = async (userId) => {
        try {
            console.log('📋 Fetching profile for user:', userId)

            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Profile fetch timeout after 5 seconds')), 5000)
            })

            // Race between the actual fetch and the timeout
            const profilePromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            const { data, error } = await Promise.race([profilePromise, timeoutPromise])

            if (error) {
                console.error('❌ Error fetching profile:', error)
                console.error('❌ Error code:', error.code)
                console.error('❌ Error message:', error.message)

                // If profile doesn't exist (PGRST116 is "not found" error)
                if (error.code === 'PGRST116') {
                    console.error('❌ Profile not found for user. User may need to sign up again.')
                    console.error('❌ This could mean:')
                    console.error('   1. The database trigger did not create the profile')
                    console.error('   2. The profile was deleted')
                    console.error('   3. RLS policies are blocking access')
                    // Don't throw - just set profile to null
                    setProfile(null)
                    return null
                }
                throw error
            }

            console.log('✓ Profile fetched successfully:', {
                id: data.id,
                email: data.email,
                full_name: data.full_name,
                role: data.role
            })
            setProfile(data)
            return data
        } catch (error) {
            console.error('❌ Error in fetchProfile:', error)
            console.error('❌ Error type:', error.constructor.name)
            console.error('❌ Error message:', error.message)

            if (error.message?.includes('timeout')) {
                console.error('❌ Profile fetch timed out - possible issues:')
                console.error('   1. Network connectivity problem')
                console.error('   2. RLS policies blocking the query')
                console.error('   3. Database is not responding')
                console.error('   4. Supabase service issue')
            }

            setProfile(null)
            return null
        }
    }

    const signUp = async ({ email, password, fullName, role = 'inviter' }) => {
        console.log('🔵 [1/5] Starting signup process...')

        try {
            // Sign up user with metadata (for database trigger to use)
            console.log('🔵 [2/5] Calling Supabase auth.signUp...')
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`
                }
            })

            console.log('🔵 [2/5] Auth response:', {
                hasUser: !!authData?.user,
                hasSession: !!authData?.session,
                hasError: !!authError,
                userEmail: authData?.user?.email
            })

            if (authError) {
                console.error('❌ Auth error:', authError)
                console.error('❌ Auth error code:', authError.code)
                console.error('❌ Auth error message:', authError.message)
                throw authError
            }

            // Ensure user was created
            if (!authData.user) {
                console.error('❌ No user returned from signup')
                throw new Error('User creation failed - no user returned')
            }

            console.log('✓ [2/5] User created:', authData.user.id)
            console.log('✓ User email:', authData.user.email)
            console.log('✓ Email confirmed at:', authData.user.email_confirmed_at || 'Not confirmed yet')
            console.log('✓ Metadata sent:', { full_name: fullName, role })

            // Check if email confirmation is required
            if (!authData.session) {
                console.log('⚠️ Email confirmation required!')
                console.log('📧 Confirmation email should be sent to:', authData.user.email)
                console.log('📧 Check your inbox and spam folder')
                console.log('📧 Redirect URL configured:', `${window.location.origin}/auth/callback`)
                console.log('📧 If no email received, check Supabase Dashboard → Authentication → Settings → Email')
                return {
                    data: authData,
                    error: null,
                    requiresEmailConfirmation: true
                }
            }

            console.log('🔵 [3/5] Waiting 1 second for trigger to complete...')
            // Wait for trigger to complete
            await new Promise(resolve => setTimeout(resolve, 1000))

            console.log('🔵 [4/5] Verifying profile was created...')
            // Verify profile was created by trigger
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single()

            console.log('🔵 [4/5] Profile query result:', {
                hasProfile: !!profileData,
                hasError: !!profileError,
                errorCode: profileError?.code
            })

            if (profileError || !profileData) {
                console.warn('⚠️ Profile not found after trigger, creating manually...')
                console.log('🔵 [5/5] Attempting manual profile creation...')

                // Fallback: Create profile manually if trigger didn't work
                const { data: manualProfile, error: manualError } = await supabase
                    .from('profiles')
                    .insert({
                        id: authData.user.id,
                        email: email,
                        full_name: fullName,
                        role: role,
                    })
                    .select()
                    .single()

                if (manualError) {
                    console.error('❌ Manual profile creation error:', manualError)
                    throw new Error(`Failed to create profile: ${manualError.message}`)
                }

                console.log('✓ [5/5] Profile created manually:', manualProfile)
            } else {
                console.log('✓ [4/5] Profile created by trigger:', profileData)
            }

            console.log('✅ Signup process completed successfully!')
            return { data: authData, error: null }
        } catch (error) {
            console.error('❌ Signup error caught:', error)
            console.error('❌ Error details:', {
                message: error.message,
                code: error.code,
                status: error.status
            })
            return { data: null, error }
        }
    }

    const signIn = async ({ email, password }) => {
        try {
            console.log('🔐 [AuthContext] Starting signIn...')
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            console.log('🔐 [AuthContext] SignIn response:', {
                hasData: !!data,
                hasUser: !!data?.user,
                hasSession: !!data?.session,
                hasError: !!error
            })

            if (error) {
                console.error('❌ [AuthContext] SignIn error:', error)
                throw error
            }

            console.log('✓ [AuthContext] SignIn successful, user:', data.user.id)
            return { data, error: null }
        } catch (error) {
            console.error('❌ [AuthContext] SignIn caught error:', error)
            return { data: null, error }
        }
    }

    const signOut = async () => {
        try {
            console.log('🚪 Signing out...')
            const { error } = await supabase.auth.signOut()
            if (error) {
                console.error('❌ Error during signOut:', error)
                throw error
            }
            console.log('✓ Successfully signed out')
            setUser(null)
            setProfile(null)
        } catch (error) {
            console.error('❌ Error signing out:', error)
            // Force clear state even if signOut fails
            setUser(null)
            setProfile(null)
        }
    }

    const isAdmin = () => {
        return profile?.role === 'admin' || profile?.role === 'pcu_host'
    }

    const value = {
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        isAdmin,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
