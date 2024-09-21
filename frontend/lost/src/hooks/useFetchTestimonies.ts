// src/hooks/useFetchPosts.ts
import { useQuery } from '@tanstack/react-query';
import api from '../api/api';

interface TestimonyOwner {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface Testimony {
  id: number;
  testimony: string;
  owner_id: number;
  owner: TestimonyOwner;
}

interface TestimonyResponse {
  Testimony: Testimony;
  owner: TestimonyOwner;
}

const fetchTestimonies = async (search: string): Promise<Testimony[]> => {
  const response = await api.get<TestimonyResponse[]>('/testimonies', {
    params: { search },
  });
  // Map through the response to extract the posts
  return response.data.map((testimonyResponse: { Testimony: any; }) => testimonyResponse.Testimony);
};

// Custom hook to fetch posts using React Query
export const useFetchTestimonies = (search: string) => {
  return useQuery<Testimony[], Error>({
    queryKey: ['testimonies', search], // Unique key for the query
    queryFn: () => fetchTestimonies(search), // Fetch function
    staleTime: 1000 * 60 * 5, // Cache duration (5 minutes)
  });
};
