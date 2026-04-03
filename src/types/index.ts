export interface Author {
  username: string;
}

export interface Category {
  name: string;
  postCount?: number;
  count?: number;
  icon?: string;
}

export interface Menu {
  title: string;
  url: string;
  icon?: string;
}

export interface Post {
  title: string;
  author?: Author;
  category?: Category;
  chapters: number;
  views?: number;
  description?: string;
  color?: string;
  badge?: string;
  status?: string;
  time?: string;
}

export interface HomepageData {
  featured: Post[] | null;
  hotNovels: Post[] | null;
  newUpdates: Post[] | null;
  rankings: { daily: Post[] } | null;
  categoryList: Category[] | null;
  menus: Menu[] | null;
}
