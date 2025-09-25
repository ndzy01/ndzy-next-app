import { getPostBySlug, getAllPostMetadata } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import MDXContent from '@/components/MDXContent';
import TOC from '@/components/TOC';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
            <span>{post.date}</span>
            <span>作者: {post.author}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <TOC items={post.toc} />
            </div>
          </aside>

          {/* Main Content */}
          <article className="max-w-none flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 prose prose-lg dark:prose-invert max-w-none">
              <MDXContent content={post.mdxContent} />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPostMetadata();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: '文章未找到',
    };
  }

  return {
    title: `${post.title} | ndzy的博客`,
    description: post.excerpt,
  };
}
