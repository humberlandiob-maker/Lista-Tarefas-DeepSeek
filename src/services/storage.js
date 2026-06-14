import { supabase } from './supabaseClient'
const TABLE = 'tasks'
const TAG_TABLE = 'task_tags'

export async function getTasks(userId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch tasks:', error)
    return []
  }

  if (data.length === 0) return []

  const taskIds = data.map((t) => t.id)

  const [taskTagsResult, tagsResult] = await Promise.all([
    supabase.from(TAG_TABLE).select('*').in('task_id', taskIds),
    supabase.from('tags').select('*').eq('user_id', userId),
  ])

  const tagMap = {}
  if (!tagsResult.error) {
    for (const tag of tagsResult.data) {
      tagMap[tag.id] = { id: tag.id, name: tag.name, color: tag.color }
    }
  }

  const taskTagMap = {}
  if (!taskTagsResult.error) {
    for (const tt of taskTagsResult.data) {
      if (!taskTagMap[tt.task_id]) taskTagMap[tt.task_id] = []
      if (tagMap[tt.tag_id]) taskTagMap[tt.task_id].push(tagMap[tt.tag_id])
    }
  }

  return data.map((task) => transformTask(task, taskTagMap[task.id] || []))
}

export async function createTask(task, userId, tagIds = []) {
  const { data: maxData } = await supabase
    .from(TABLE)
    .select('position')
    .eq('user_id', userId)
    .order('position', { ascending: false })
    .limit(1)

  const nextPosition = maxData?.[0]?.position != null ? maxData[0].position + 1 : 0

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: task.title,
      description: task.description || null,
      category: task.category,
      priority: task.priority,
      due_date: task.dueDate || null,
      due_time: task.dueTime || null,
      remind_me: task.remindMe || false,
      repeat_rule: task.repeatRule || null,
      parent_id: task.parentId || null,
      position: nextPosition,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create task:', error)
    return null
  }

  if (tagIds.length > 0) {
    const tagInserts = tagIds.map((tagId) => ({ task_id: data.id, tag_id: tagId }))
    const { error: ttError } = await supabase.from(TAG_TABLE).insert(tagInserts)
    if (ttError) console.error('Failed to attach tags:', ttError)
  }

  let tags = []
  if (tagIds.length > 0) {
    const { data: tagData } = await supabase.from('tags').select('*').in('id', tagIds)
    tags = (tagData || []).map((t) => ({ id: t.id, name: t.name, color: t.color }))
  }

  return transformTask(data, tags)
}

export async function createSubtasks(titles, parentId, userId) {
  if (!titles.length) return []

  const subtasks = titles.map((title, i) => ({
    title: title.trim(),
    description: null,
    category: 'pessoal',
    priority: 'media',
    due_date: null,
    due_time: null,
    remind_me: false,
    repeat_rule: null,
    parent_id: parentId,
    position: i,
    user_id: userId,
  }))

  const { data, error } = await supabase.from(TABLE).insert(subtasks).select()

  if (error) {
    console.error('Failed to create subtasks:', error)
    return []
  }

  return data.map((t) => transformTask(t, []))
}

export async function updateTask(id, updates, tagIds) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update task:', error)
    return null
  }

  let tags = []
  if (tagIds !== undefined) {
    await supabase.from(TAG_TABLE).delete().eq('task_id', id)
    if (tagIds.length > 0) {
      const tagInserts = tagIds.map((tagId) => ({ task_id: id, tag_id: tagId }))
      await supabase.from(TAG_TABLE).insert(tagInserts)
      const { data: tagData } = await supabase.from('tags').select('*').in('id', tagIds)
      tags = (tagData || []).map((t) => ({ id: t.id, name: t.name, color: t.color }))
    }
  }

  return transformTask(data, tags)
}

export async function reorderTasks(orderedIds) {
  const updates = orderedIds.map((id, index) => ({
    id,
    position: index,
  }))

  const { error } = await supabase.from(TABLE).upsert(updates, { onConflict: 'id' })

  if (error) {
    console.error('Failed to reorder tasks:', error)
    return false
  }

  return true
}

export async function deleteTask(id) {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete task:', error)
    return false
  }

  return true
}

function transformTask(data, tags = []) {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    category: data.category,
    priority: data.priority,
    dueDate: data.due_date,
    dueTime: data.due_time || null,
    completed: data.completed,
    remindMe: data.remind_me || false,
    repeatRule: data.repeat_rule || null,
    parentId: data.parent_id || null,
    position: data.position ?? 0,
    createdAt: data.created_at,
    tags,
  }
}
