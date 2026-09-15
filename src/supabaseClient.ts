import { createClient } from '@supabase/supabase-js';

// Menggunakan URL dan Kunci Publik yang sudah kamu dapatkan dari Supabase
const supabaseUrl = 'https://plgwwegtegntlqsisedv.supabase.co';
const supabaseKey = 'sb_publishable__aX7LdpVOz_D3Q3aG0axLQ_HQQPf5UO';

// Membuat klien Supabase untuk digunakan di seluruh aplikasi kita
export const supabase = createClient(supabaseUrl, supabaseKey);
