import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import React from 'react'

interface MDXContentProps {
  content: string
  className?: string
}

// Custom components for MDX
const components = {
  // Add custom styling to ensure proper rendering
  h1: (props: React.ComponentPropsWithoutRef<'h1'>) => (
    <h1 className='text-4xl font-bold mt-8 mb-4' {...props} />
  ),
  h2: (props: React.ComponentPropsWithoutRef<'h2'>) => (
    <h2 className='text-3xl font-semibold mt-6 mb-3' {...props} />
  ),
  h3: (props: React.ComponentPropsWithoutRef<'h3'>) => (
    <h3 className='text-2xl font-medium mt-4 mb-2' {...props} />
  ),
  h4: (props: React.ComponentPropsWithoutRef<'h4'>) => (
    <h4 className='text-xl font-medium mt-3 mb-2' {...props} />
  ),
  p: (props: React.ComponentPropsWithoutRef<'p'>) => (
    <p className='mb-4 leading-relaxed' {...props} />
  ),
  ul: (props: React.ComponentPropsWithoutRef<'ul'>) => (
    <ul className='list-disc list-inside mb-4 space-y-2' {...props} />
  ),
  ol: (props: React.ComponentPropsWithoutRef<'ol'>) => (
    <ol className='list-decimal list-inside mb-4 space-y-2' {...props} />
  ),
  li: (props: React.ComponentPropsWithoutRef<'li'>) => (
    <li className='ml-4' {...props} />
  ),
  blockquote: (props: React.ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className='border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4'
      {...props}
    />
  ),
  code: (props: React.ComponentPropsWithoutRef<'code'>) => {
    // Inline code
    if (!props.className) {
      return (
        <code
          className='bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm'
          {...props}
        />
      )
    }
    // Code blocks are handled by pre
    return <code {...props} />
  },
  pre: (props: React.ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className='hljs bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto mb-4 text-sm'
      {...props}
    />
  ),
  table: (props: React.ComponentPropsWithoutRef<'table'>) => (
    <div className='overflow-x-auto mb-4'>
      <table
        className='min-w-full border-collapse border border-gray-300 dark:border-gray-700'
        {...props}
      />
    </div>
  ),
  th: (props: React.ComponentPropsWithoutRef<'th'>) => (
    <th
      className='border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold'
      {...props}
    />
  ),
  td: (props: React.ComponentPropsWithoutRef<'td'>) => (
    <td
      className='border border-gray-300 dark:border-gray-700 px-4 py-2'
      {...props}
    />
  ),
  a: (props: React.ComponentPropsWithoutRef<'a'>) => (
    <a
      className='text-blue-600 dark:text-blue-400 hover:underline'
      {...props}
    />
  ),
  hr: (props: React.ComponentPropsWithoutRef<'hr'>) => (
    <hr className='my-8 border-gray-300 dark:border-gray-700' {...props} />
  ),
}

export default function MDXContent({
  content,
  className = '',
}: MDXContentProps) {
  return (
    <div className={className}>
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              rehypeHighlight,
            ],
          },
        }}
        components={components}
      />
    </div>
  )
}
