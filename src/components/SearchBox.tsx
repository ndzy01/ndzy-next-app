"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { BlogPostMeta } from "@/types/blog";
import {
  searchPostsMetadata,
  getSearchSuggestions,
  SearchResult,
} from "@/lib/search";

interface SearchBoxProps {
  posts: BlogPostMeta[];
  placeholder?: string;
  showSuggestions?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchBox({
  posts,
  placeholder = "搜索博客文章...",
  showSuggestions = true,
  onSearch,
  className = "",
}: SearchBoxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [quickResults, setQuickResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖搜索
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        setIsLoading(true);

        // 快速搜索元数据
        const metadataResults = searchPostsMetadata(posts, query, { limit: 5 });
        setQuickResults(metadataResults);

        // 获取搜索建议
        if (showSuggestions) {
          const searchSuggestions = getSearchSuggestions(posts, query);
          setSuggestions(searchSuggestions);
        }

        setIsLoading(false);
        setIsOpen(true);
      } else {
        setQuickResults([]);
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, posts, showSuggestions]);

  // 点击外部关闭搜索框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && query.trim()) {
      handleSearch(query);
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/blog/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleResultClick = (slug: string) => {
    setIsOpen(false);
    router.push(`/blog/${slug}`);
  };

  const clearSearch = () => {
    setQuery("");
    setQuickResults([]);
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索输入框 */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {/* 搜索结果下拉框 */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              搜索中...
            </div>
          ) : (
            <>
              {/* 快速搜索结果 */}
              {quickResults.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    快速结果
                  </div>
                  {quickResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result.slug)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                    >
                      <div
                        className="font-medium text-gray-900 dark:text-white text-sm"
                        dangerouslySetInnerHTML={{
                          __html: result.highlightedTitle || result.title,
                        }}
                      />
                      <div
                        className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: result.highlightedExcerpt || result.excerpt,
                        }}
                      />
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs text-gray-400">
                          {result.date}
                        </span>
                        {result.matchedFields.length > 0 && (
                          <span className="text-xs text-blue-500">
                            匹配: {result.matchedFields.join(", ")}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* 搜索建议 */}
              {suggestions.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    搜索建议
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                    >
                      <MagnifyingGlassIcon className="inline h-4 w-4 mr-2 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {/* 查看全部结果 */}
              {query.trim() && (
                <button
                  onClick={() => handleSearch(query)}
                  className="w-full px-3 py-3 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 border-t border-gray-200 dark:border-gray-700"
                >
                  <MagnifyingGlassIcon className="inline h-4 w-4 mr-2" />
                  查看 "{query}" 的全部搜索结果
                </button>
              )}

              {/* 无结果提示 */}
              {quickResults.length === 0 &&
                suggestions.length === 0 &&
                query.trim() && (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    未找到相关结果
                  </div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
