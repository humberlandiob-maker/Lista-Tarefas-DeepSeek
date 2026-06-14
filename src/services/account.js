import { supabase } from './supabaseClient'

export async function deleteAccount(email, password) {
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) throw new Error('Email ou senha inválidos')

  const { error: rpcError } = await supabase.rpc('delete_user_account')
  if (rpcError) throw new Error('Erro ao excluir conta. Tente novamente.')

  await supabase.auth.signOut()
}
