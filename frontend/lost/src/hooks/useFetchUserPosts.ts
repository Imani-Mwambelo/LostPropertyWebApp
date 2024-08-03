// src/hooks/useFetchUserPosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  image_url: string;
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

// Fetch user posts
const fetchUserPosts = async (): Promise<Post[]> => {
  const response = await api.get<PostResponse[]>('/posts/by-owner');
  return response.data.map((postResponse: { Post: any; }) => postResponse.Post);
};

// Delete post function
const deletePost = async (postId: number): Promise<void> => {
  await api.delete(`/posts/${postId}`);
};

export const useFetchUserPosts = () => {
  const queryClient = useQueryClient();

  // Fetching user posts
  const userPostsQuery = useQuery<Post[], Error>({
    queryKey: ['userPosts'],
    queryFn: fetchUserPosts,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutation for deleting a post
  const deletePostMutation = useMutation<void, Error, number>({
    mutationFn: deletePost,
    onSuccess: () => {
      // Invalidate and refetch user posts after a successful deletion
      queryClient.invalidateQueries({queryKey:['userPosts']});
    },
  });

  return {
    ...userPostsQuery,
    deletePost: deletePostMutation.mutate, // Expose the mutate function to the component
  };
};
