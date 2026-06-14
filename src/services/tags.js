import { supabase } from './supabaseClient'

const TABLE = 'tags'

export async function getTags(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) {
    console.error('Failed to fetch tags:', error)
    return []
  }

  return data
}

export async function createTag(tag, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name: tag.name, color: tag.color, user_id: userId })
    .select()
    .single()

  if (error) {
    console.error('Failed to create tag:', error)
    return null
  }

  return data
}

export async function updateTag(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update tag:', error)
    return null
  }

  return data
}

export async function deleteTag(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete tag:', error)
    return false
  }

  return true
}
