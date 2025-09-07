import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { data: sponsors, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(200).json(sponsors);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  if (req.method === 'POST') {
    try {
      const sponsorData = {
        ...req.body,
        slug: req.body.company_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: sponsor, error } = await supabase
        .from('sponsors')
        .insert([sponsorData])
        .select()
        .single();
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(201).json(sponsor);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}