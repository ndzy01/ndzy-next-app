import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            欢迎来到ndzy的个人网站
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            这里是ndzy的技术博客和个人空间
          </p>
          <nav className="flex justify-center gap-6">
            <Link
              href="/blog"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              查看博客
            </Link>
          </nav>
        </header>

        <main className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              关于我
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              我是一名热爱技术的开发者，喜欢探索新技术和解决复杂问题。
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              技术栈
            </h2>
            <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside">
              <li>Next.js</li>
              <li>React</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
            </ul>
          </div>
        </main>

        <footer className="text-center mt-12">
          <span className="text-sm text-gray-500 dark:text-gray-400">@ndzy</span>
        </footer>
      </div>
    </div>
  );
}
