import { supabase } from './supabaseClient'

const TABLE = 'templates'

export async function getTemplates(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch templates:', error)
    return []
  }

  return data.map(transformTemplate)
}

export async function createTemplate(template, userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      name: template.name,
      title: template.title,
      description: template.description || null,
      category: template.category || 'trabalho',
      priority: template.priority || 'media',
      remind_me: template.remind_me || false,
      repeat_rule: template.repeat_rule || null,
      color: template.color || '#3B82F6',
      subtitles: template.subtitles || [],
      tag_ids: template.tag_ids || [],
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create template:', error)
    return null
  }

  return transformTemplate(data)
}

export async function updateTemplate(id, updates) {
  const dbUpdates = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.description !== undefined) dbUpdates.description = updates.description
  if (updates.category !== undefined) dbUpdates.category = updates.category
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority
  if (updates.remind_me !== undefined) dbUpdates.remind_me = updates.remind_me
  if (updates.repeat_rule !== undefined) dbUpdates.repeat_rule = updates.repeat_rule
  if (updates.color !== undefined) dbUpdates.color = updates.color
  if (updates.subtitles !== undefined) dbUpdates.subtitles = updates.subtitles
  if (updates.tag_ids !== undefined) dbUpdates.tag_ids = updates.tag_ids

  const { data, error } = await supabase
    .from(TABLE)
    .update(dbUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update template:', error)
    return null
  }

  return transformTemplate(data)
}

export async function deleteTemplate(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete template:', error)
    return false
  }

  return true
}

function transformTemplate(data) {
  return {
    id: data.id,
    name: data.name,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    remindMe: data.remind_me,
    repeatRule: data.repeat_rule,
    color: data.color,
    subtitles: data.subtitles || [],
    tagIds: data.tag_ids || [],
    createdAt: data.created_at,
  }
}
