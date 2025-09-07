import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { sponsor_id, event_id, package_id, custom_amount, benefits, timeline, notes } = req.body;
      
      // Validate required fields
      if (!sponsor_id || !event_id) {
        return res.status(400).json({ error: 'Sponsor and event are required' });
      }

      // Create proposal document record
      const proposalData = {
        sponsor_id,
        document_type: 'proposal',
        name: `Sponsorship Proposal - ${new Date().toLocaleDateString()}`,
        file_url: 'https://docs.fashionos.com/proposals/generated.pdf', // Would generate actual PDF in production
        metadata: {
          event_id,
          package_id,
          custom_amount,
          benefits,
          timeline,
          notes,
          generated_at: new Date().toISOString()
        }
      };

      const { data: proposal, error } = await supabase
        .from('sponsor_documents')
        .insert([proposalData])
        .select()
        .single();
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      // Also create a sponsor activity record for audit trail
      await supabase
        .from('sponsor_activities')
        .insert([{
          sponsor_id,
          activity_type: 'proposal_created',
          activity_data: {
            document_id: proposal.id,
            event_id,
            package_id,
            custom_amount,
            created_at: new Date().toISOString()
          }
        }]);
      
      return res.status(201).json(proposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}