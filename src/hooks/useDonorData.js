import { fetchDonorData } from '@/api';
import { useQuery } from '@tanstack/react-query';


export const useDonorData = () => {
  return useQuery({
    queryKey: ['donorData'],
    queryFn: fetchDonorData,
  });
};