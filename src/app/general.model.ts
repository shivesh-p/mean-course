export interface Posts {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  createdBy: string;
}

export interface PostsDto {
  message: string;
  posts: Posts[];
  totalPosts: number;
}
