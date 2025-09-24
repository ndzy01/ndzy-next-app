export interface BlogPostMeta {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  tags: string[];
  slug: string;
}

export interface MDXBlogPost extends BlogPostMeta {
  mdxContent: string; // For MDX serialized content
  toc: TocItem[]; // Table of contents
}

export interface TocItem {
  id: string;
  text: string;
  depth: number;
}
