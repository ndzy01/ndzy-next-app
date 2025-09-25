import { NextRequest, NextResponse } from "next/server";
import { getAllPostMetadata, getPostBySlug } from "@/lib/mdx";
import { BlogPostMeta } from "@/types/blog";

export interface ContentSearchResult extends BlogPostMeta {
  relevanceScore: number;
  matchedContent: string[];
  contentSnippets: string[];
}

// 服务端全文搜索API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean) || [];
    const author = searchParams.get("author");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        results: [],
        message: "搜索关键词至少需要2个字符",
      });
    }

    // 获取所有文章元数据
    const posts = await getAllPostMetadata();
    const results: ContentSearchResult[] = [];

    // 并行搜索所有文章内容
    const searchPromises = posts.map(async (post) => {
      try {
        const fullPost = await getPostBySlug(post.slug);
        if (!fullPost) return null;

        let relevanceScore = 0;
        const matchedContent: string[] = [];
        const contentSnippets: string[] = [];
        const searchQuery = query.toLowerCase().trim();

        // 搜索标题 (权重最高)
        if (post.title.toLowerCase().includes(searchQuery)) {
          relevanceScore += 20;
          matchedContent.push("title");
        }

        // 搜索摘要
        if (post.excerpt.toLowerCase().includes(searchQuery)) {
          relevanceScore += 15;
          matchedContent.push("excerpt");
        }

        // 搜索标签
        const matchedTags = post.tags.filter((tag) =>
          tag.toLowerCase().includes(searchQuery),
        );
        if (matchedTags.length > 0) {
          relevanceScore += matchedTags.length * 10;
          matchedContent.push("tags");
        }

        // 搜索作者
        if (post.author.toLowerCase().includes(searchQuery)) {
          relevanceScore += 5;
          matchedContent.push("author");
        }

        // 搜索文章内容 (权重中等)
        if (fullPost.mdxContent) {
          const contentMatches = findContentMatches(
            fullPost.mdxContent,
            searchQuery,
          );
          if (contentMatches.length > 0) {
            relevanceScore += contentMatches.length * 8;
            matchedContent.push("content");
            contentSnippets.push(...contentMatches);
          }
        }

        // 按标签过滤
        if (tags.length > 0) {
          const hasMatchingTag = tags.some((tag) => post.tags.includes(tag));
          if (!hasMatchingTag) relevanceScore = 0;
        }

        // 按作者过滤
        if (author && post.author !== author) {
          relevanceScore = 0;
        }

        if (relevanceScore > 0) {
          return {
            ...post,
            relevanceScore,
            matchedContent,
            contentSnippets: contentSnippets.slice(0, 3), // 限制片段数量
          };
        }

        return null;
      } catch (error) {
        console.error(`Error searching post ${post.slug}:`, error);
        return null;
      }
    });

    const searchResults = await Promise.all(searchPromises);
    const validResults = searchResults.filter(Boolean) as ContentSearchResult[];

    // 按相关性排序并限制结果数量
    validResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const limitedResults = validResults.slice(0, limit);

    return NextResponse.json({
      results: limitedResults,
      total: validResults.length,
      query,
      message:
        limitedResults.length > 0
          ? `找到 ${validResults.length} 个相关结果`
          : "未找到相关结果",
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "搜索服务暂时不可用" }, { status: 500 });
  }
}

// 在内容中查找匹配片段
function findContentMatches(content: string, query: string): string[] {
  const matches: string[] = [];
  const searchQuery = query.toLowerCase();
  const contentLower = content.toLowerCase();

  // 移除 MDX 语法标记
  const cleanContent = content
    .replace(/^---[\s\S]*?---/m, "") // 移除 frontmatter
    .replace(/```[\s\S]*?```/g, "") // 移除代码块
    .replace(/`[^`]*`/g, "") // 移除行内代码
    .replace(/#{1,6}\s/g, "") // 移除标题标记
    .replace(/\*\*([^*]+)\*\*/g, "$1") // 移除粗体标记
    .replace(/\*([^*]+)\*/g, "$1") // 移除斜体标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // 移除链接标记

  const sentences = cleanContent.split(/[.!?。！？]/);

  sentences.forEach((sentence) => {
    const trimmedSentence = sentence.trim();
    if (
      trimmedSentence.toLowerCase().includes(searchQuery) &&
      trimmedSentence.length > 10
    ) {
      // 创建包含上下文的片段
      const snippet = createSnippet(trimmedSentence, query, 100);
      if (snippet && !matches.includes(snippet)) {
        matches.push(snippet);
      }
    }
  });

  return matches.slice(0, 5); // 限制匹配片段数量
}

// 创建搜索结果片段
function createSnippet(text: string, query: string, maxLength: number): string {
  const queryIndex = text.toLowerCase().indexOf(query.toLowerCase());
  if (queryIndex === -1) return "";

  const start = Math.max(0, queryIndex - 30);
  const end = Math.min(text.length, queryIndex + query.length + 30);

  let snippet = text.slice(start, end);

  // 添加省略号
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";

  // 限制总长度
  if (snippet.length > maxLength) {
    snippet = snippet.slice(0, maxLength - 3) + "...";
  }

  return snippet.trim();
}
