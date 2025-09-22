import { listDesigners, Designer } from './designerService';

export const getFeaturedDesigners = async (limit: number = 3): Promise<Designer[]> => {
  return await listDesigners({ 
    verified: true, 
    sortBy: 'popularity', 
    limit 
  });
};