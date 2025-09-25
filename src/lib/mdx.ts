import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { MDXBlogPost, BlogPostMeta } from "@/types/blog";
import { extractToc } from "./toc";

const contentDirectory = path.join(process.cwd(), "src/content/blog");

export async function getAllPostMetadata(): Promise<BlogPostMeta[]> {
  const fileNames = fs.readdirSync(contentDirectory);

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx$/, "");
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      id: slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      tags: data.tags || [],
      slug: slug,
    };
  });

  // Sort by date
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export async function getPostBySlug(slug: string): Promise<MDXBlogPost | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Extract table of contents from the content
    const toc = extractToc(content);

    return {
      id: slug,
      title: data.title,
      excerpt: data.excerpt,
      date: data.date,
      author: data.author,
      tags: data.tags || [],
      slug: slug,
      mdxContent: content,
      toc, // Add table of contents
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}

export async function getPostsByTag(tag: string): Promise<BlogPostMeta[]> {
  const posts = await getAllPostMetadata();
  return posts.filter((post) => post.tags.includes(tag));
}
