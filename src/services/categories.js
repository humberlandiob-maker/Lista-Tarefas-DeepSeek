import { supabase } from './supabaseClient'

const TABLE = 'categories'

export async function getCategories(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('name')

  if (error) {
    console.error('Failed to fetch categories:', error)
    return []
  }

  return data
}

export async function createCategory(category, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ name: category.name, color: category.color, user_id: userId })
    .select()
    .single()

  if (error) {
    console.error('Failed to create category:', error)
    return null
  }

  return data
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update category:', error)
    return null
  }

  return data
}

export async function deleteCategory(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete category:', error)
    return false
  }

  return true
}
