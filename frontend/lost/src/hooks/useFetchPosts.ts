// src/hooks/useFetchPosts.ts
import { useQuery } from '@tanstack/react-query';
import api from '../api/api';

interface PostOwner {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  owner_name: string;
  location: string;
  phone_number: string;
  description: string;
  created_at: string;
  owner_id: number;
  owner: PostOwner;
}

interface PostResponse {
  Post: Post;
  votes: number;
}

const fetchPosts = async (search: string): Promise<Post[]> => {
  const response = await api.get<PostResponse[]>('/posts', {
    params: { search },
  });
  // Map through the response to extract the posts
  console.log('response');
  console.log(response.data);
  console.log('response');
  return response.data.map((postResponse: { Post: any; }) => postResponse.Post);
};

// Custom hook to fetch posts using React Query
export const useFetchPosts = (search: string) => {
  return useQuery<Post[], Error>({
    queryKey: ['posts', search], // Unique key for the query
    queryFn: () => fetchPosts(search), // Fetch function
    staleTime: 1000 * 60 * 5, // Cache duration (5 minutes)
  });
};
