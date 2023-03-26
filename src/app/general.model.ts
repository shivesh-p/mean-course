export interface Posts {
  id: string;
  title: string;
  content: string;
}

export interface PostsDto {
  message: string;
  posts: Posts[];
}
