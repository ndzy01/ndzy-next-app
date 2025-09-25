import { BlogPostMeta, MDXBlogPost } from '@/types/blog';

export interface SearchResult extends BlogPostMeta {
  relevanceScore: number;
  matchedFields: string[];
  highlightedTitle?: string;
  highlightedExcerpt?: string;
}

export interface SearchOptions {
  query: string;
  searchInContent?: boolean;
  tags?: string[];
  author?: string;
  limit?: number;
}

// 客户端搜索函数 - 用于快速搜索元数据
export function searchPostsMetadata(
  posts: BlogPostMeta[],
  query: string,
  options: Partial<SearchOptions> = {}
): SearchResult[] {
  if (!query.trim()) return [];

  const searchQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  posts.forEach(post => {
    let relevanceScore = 0;
    const matchedFields: string[] = [];
    let highlightedTitle = post.title;
    let highlightedExcerpt = post.excerpt;

    // 搜索标题 (权重最高)
    if (post.title.toLowerCase().includes(searchQuery)) {
      relevanceScore += 10;
      matchedFields.push('title');
      highlightedTitle = highlightText(post.title, searchQuery);
    }

    // 搜索摘要
    if (post.excerpt.toLowerCase().includes(searchQuery)) {
      relevanceScore += 5;
      matchedFields.push('excerpt');
      highlightedExcerpt = highlightText(post.excerpt, searchQuery);
    }

    // 搜索标签
    const matchedTags = post.tags.filter(tag => 
      tag.toLowerCase().includes(searchQuery)
    );
    if (matchedTags.length > 0) {
      relevanceScore += matchedTags.length * 3;
      matchedFields.push('tags');
    }

    // 搜索作者
    if (post.author.toLowerCase().includes(searchQuery)) {
      relevanceScore += 2;
      matchedFields.push('author');
    }

    // 按标签过滤
    if (options.tags && options.tags.length > 0) {
      const hasMatchingTag = options.tags.some(tag => 
        post.tags.includes(tag)
      );
      if (!hasMatchingTag) relevanceScore = 0;
    }

    // 按作者过滤
    if (options.author && post.author !== options.author) {
      relevanceScore = 0;
    }

    if (relevanceScore > 0) {
      results.push({
        ...post,
        relevanceScore,
        matchedFields,
        highlightedTitle,
        highlightedExcerpt,
      });
    }
  });

  // 按相关性排序
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // 限制结果数量
  if (options.limit) {
    return results.slice(0, options.limit);
  }

  return results;
}

// 高亮匹配文本
function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
}

// 转义正则表达式特殊字符
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 提取搜索建议
export function getSearchSuggestions(posts: BlogPostMeta[], query: string): string[] {
  if (!query.trim()) return [];

  const suggestions = new Set<string>();
  const searchQuery = query.toLowerCase();

  posts.forEach(post => {
    // 从标题提取建议
    const titleWords = post.title.toLowerCase().split(/\s+/);
    titleWords.forEach(word => {
      if (word.includes(searchQuery) && word !== searchQuery) {
        suggestions.add(word);
      }
    });

    // 从标签提取建议
    post.tags.forEach(tag => {
      if (tag.toLowerCase().includes(searchQuery) && tag.toLowerCase() !== searchQuery) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, 5);
}

// 获取热门搜索词
export function getPopularTags(posts: BlogPostMeta[]): { tag: string; count: number }[] {
  const tagCounts = new Map<string, number>();

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}
