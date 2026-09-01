export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  publishDate?: string;
  publishTime?: string;
  featuredImage?: string;
  categories?: string[];
  tags?: string[];
  updatedAt?: string;
  authorName?: string;
  authorUrl?: string;
  meta?: {
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
    keywords?: string[];
    ogTitle?: string;
    ogDescription?: string;
  };
  customFields?: { readingTime?: string; rating?: number };
};

const API_BASE = 'https://api.upliftai.co/api/public/v1';

async function apiFetch(path: string) {
  const token = process.env.UPLIFTAI_API_TOKEN;
  if (!token) return null;
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`UpliftAI request failed for ${path}`, error);
    return null;
  }
}

export async function getBlogs(limit = 12): Promise<Blog[]> {
  const payload = await apiFetch(`/blogs?status=PUBLISH&limit=${limit}`);
  return payload?.data?.blogs ?? [];
}

export async function getBlog(slug: string): Promise<Blog | null> {
  const payload = await apiFetch(`/blog/${encodeURIComponent(slug)}`);
  return payload?.data?.blog ?? null;
}

export function formatDate(date?: string) {
  if (!date) return 'Recently published';
  return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}

export function readingTime(blog: Blog) {
  if (blog.customFields?.readingTime) return blog.customFields.readingTime;
  const words = (blog.content ?? blog.excerpt ?? '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}
