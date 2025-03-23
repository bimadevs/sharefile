import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Cek apakah kunci dan URL sudah dikonfigurasi
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL atau key tidak tersedia. Periksa variabel lingkungan Anda.')
}

// Buat client Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false
  }
})

// Helper function untuk membuat UUID baru
export const generateUUID = () => {
  return crypto.randomUUID()
} 