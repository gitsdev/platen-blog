import type { MetadataRoute } from 'next';
import { getBlogs } from '@/lib/uplift';
import { getSiteUrl } from '@/lib/site';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base=getSiteUrl(); const blogs=await getBlogs(100); return [{url:base,lastModified:new Date(),changeFrequency:'weekly',priority:1},...blogs.map(blog=>({url:`${base}/blog/${blog.slug}`,lastModified:blog.updatedAt?new Date(blog.updatedAt):new Date(blog.publishDate??Date.now()),changeFrequency:'monthly' as const,priority:.8}))]; }
