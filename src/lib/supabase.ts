import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mtqigaodyzoilnjjsbqd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_bDDrexJoieVYRI2o_gAHzg__xvugfh8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);