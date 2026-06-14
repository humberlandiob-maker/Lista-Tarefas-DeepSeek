import { supabase } from './supabaseClient'

const TABLE = 'profiles'

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('name')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Failed to fetch profile:', error)
    return null
  }

  return data
}

export async function createProfile(userId, name) {
  const { error } = await supabase
    .from(TABLE)
    .insert({ id: userId, name })

  if (error) {
    console.error('Failed to create profile:', error)
    throw error
  }
}
