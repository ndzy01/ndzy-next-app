import Link from 'next/link';
import { BlogPostMeta } from '../types/blog';

interface BlogPostCardProps {
  post: BlogPostMeta;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 mb-2">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{post.date}</span>
        <span>作者: {post.author}</span>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
