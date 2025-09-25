import { NextResponse } from 'next/server';
import { getAllPostMetadata } from '@/lib/mdx';

export async function GET() {
  try {
    const posts = await getAllPostMetadata();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}
