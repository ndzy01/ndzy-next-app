import { getAllPostMetadata } from '@/lib/mdx';
import BlogPostCard from '@/components/BlogPostCard';
import Link from 'next/link';

export default async function BlogPage() {
  const posts = await getAllPostMetadata();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-900 py-4 -mx-4 px-4 mb-4 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline">
            ← 返回首页
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">ndzy的博客</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">分享技术心得、生活感悟和有趣的内容</p>
        </header>

        <div className="grid gap-6">
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">暂无博客文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
