import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://enkqotcwlvtbdggyqhlm.supabase.co"
const supabaseAnonKey = "sb_publishable_Epih0UETeF01E-Lzx23aDw_mAn45kC-"

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
