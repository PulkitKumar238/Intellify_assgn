import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase.from('dashboard_data').select('*')
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { category, value, type } = await request.json()
  
  const { data, error } = await supabase
    .from('dashboard_data')
    .insert({ category, value, type })
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function PUT(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id, category, value, type } = await request.json()
  
  const { data, error } = await supabase
    .from('dashboard_data')
    .update({ category, value, type })
    .eq('id', id)
    .select()
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function DELETE(request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { id } = await request.json()
  
  const { error } = await supabase
    .from('dashboard_data')
    .delete()
    .eq('id', id)
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ message: 'Data deleted successfully' })
}