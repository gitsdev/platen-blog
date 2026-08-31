import type { Metadata } from 'next';
import { ArrowLeft, Clock3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDate, getBlog, readingTime } from '@/lib/uplift';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({params}:Props): Promise<Metadata> {
  const {slug} = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title:'Article not found', robots:{index:false,follow:false} };
  const title = blog.meta?.seoTitle ?? blog.meta?.ogTitle ?? blog.title;
  const description = blog.meta?.seoDescription ?? blog.meta?.ogDescription ?? blog.excerpt;
  const images = blog.featuredImage ? [blog.featuredImage] : [];
  return {
    title,
    description,
    keywords: blog.meta?.keywords,
    alternates: { canonical:`/blog/${blog.slug}` },
    openGraph: { title:blog.meta?.ogTitle ?? title, description:blog.meta?.ogDescription ?? description, type:'article', url:`/blog/${blog.slug}`, publishedTime:blog.publishDate, modifiedTime:blog.updatedAt, authors:blog.authorName?[blog.authorName]:undefined, tags:blog.tags, images },
    twitter: { card:'summary_large_image', title:blog.meta?.ogTitle ?? title, description:blog.meta?.ogDescription ?? description, images },
  };
}

export default async function BlogArticle({params}:Props) {
  const {slug} = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();
  const jsonLd = { '@context':'https://schema.org', '@type':'Article', headline:blog.title, description:blog.excerpt, image:blog.featuredImage?[blog.featuredImage]:undefined, datePublished:blog.publishDate, dateModified:blog.updatedAt, author:blog.authorName?{'@type':'Person',name:blog.authorName,url:blog.authorUrl}:undefined, publisher:{'@type':'Organization',name:'Platinum Benefit Services'}, mainEntityOfPage:`${process.env.SITE_URL ?? 'https://blog.platben.com'}/blog/${blog.slug}` };
  return <main>
    <header className="site-header"><a className="brand" href="/"><img src="/brand-logo.webp" alt="Platinum Benefit Services"/><span className="journal-label">THE JOURNAL</span></a><nav aria-label="Main navigation"><a href="/#latest">LATEST</a><a href="https://platben.com/">MAIN WEBSITE</a></nav></header>
    <article className="article-shell">
      <a className="article-back" href="/"><ArrowLeft size={16}/> BACK TO THE JOURNAL</a>
      <header className="article-header"><span className="category">{blog.categories?.[0] ?? 'Insights'}</span><h1>{blog.title}</h1>{blog.excerpt&&<p className="article-deck">{blog.excerpt}</p>}<div className="post-meta"><span>{formatDate(blog.publishDate)}</span><span><Clock3 size={14}/> {readingTime(blog)}</span>{blog.authorName&&<span>By {blog.authorName}</span>}</div></header>
      {blog.featuredImage&&<img className="article-image" src={blog.featuredImage} alt=""/>}
      <div className="article-content" dangerouslySetInnerHTML={{__html:blog.content ?? ''}}/>
      {!!blog.tags?.length&&<div className="article-tags">{blog.tags.map(tag=><span key={tag}>{tag}</span>)}</div>}
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/>
  </main>;
}
