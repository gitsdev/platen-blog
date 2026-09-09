import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { formatDate, getBlog, readingTime } from '@/lib/uplift';
import { getSiteUrl } from '@/lib/site';

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
  const jsonLd = { '@context':'https://schema.org', '@type':'Article', headline:blog.title, description:blog.excerpt, image:blog.featuredImage?[blog.featuredImage]:undefined, datePublished:blog.publishDate, dateModified:blog.updatedAt, author:blog.authorName?{'@type':'Person',name:blog.authorName,url:blog.authorUrl}:undefined, publisher:{'@type':'Organization',name:'Platinum Benefit Services'}, mainEntityOfPage:`${getSiteUrl()}/blog/${blog.slug}` };
  return <main className="article-page">
    <div className="announcement"><p>Free Guide: Ensure You&apos;re Receiving The Best Service Possible When Applying For Medicaid Benefits</p><a href="https://platben.com/free">LEARN HOW <ArrowRight size={15}/></a></div>
    <header className="site-header"><a className="brand" href="/" aria-label="Platinum Benefit Journal home"><img src="/brand-logo.webp" alt="Platinum Benefit Services"/></a><nav aria-label="Main navigation"><a href="https://platben.com/">HOME</a><a href="https://platben.com/about">ABOUT US</a><a href="https://platben.com/success-stories">SUCCESS STORIES</a><a href="https://platben.com/our-difference">OUR DIFFERENCE</a><a href="https://platben.com/work-with-us">WORK WITH US</a><a href="/">ARTICLES</a><a href="https://platben.com/contactus">CONTACT US</a></nav></header>
    <article>
      <header className="article-masthead">
        <div className="article-heading-wrap">
          <a className="article-back" href="/"><ArrowLeft size={16}/> BACK TO THE JOURNAL</a>
          <span className="category">{blog.categories?.[0] ?? 'Insights'}</span>
          <h1>{blog.title}</h1>
          {blog.excerpt&&<p className="article-deck">{blog.excerpt}</p>}
          <div className="article-meta"><span>{formatDate(blog.publishDate)}</span><span aria-hidden="true">•</span><span><Clock3 size={15}/> {readingTime(blog)}</span>{blog.authorName&&<><span aria-hidden="true">•</span><span>By {blog.authorName}</span></>}</div>
        </div>
      </header>
      <div className={`article-media ${blog.featuredImage ? '' : 'article-media-fallback'}`}>
        {blog.featuredImage ? <img className="article-image" src={blog.featuredImage} alt=""/> : <div className="article-fallback-mark" aria-hidden="true">PB</div>}
      </div>
      <div className="article-reading-area">
        <div className="article-rule" aria-hidden="true"><span/></div>
        <div className="article-content" dangerouslySetInnerHTML={{__html:blog.content ?? ''}}/>
        {!!blog.tags?.length&&<div className="article-tags" aria-label="Article topics">{blog.tags.map(tag=><span key={tag}>{tag}</span>)}</div>}
        <div className="article-end">
          <p>Continue exploring practical guidance for your family.</p>
          <a href="/"><ArrowLeft size={16}/> BACK TO ALL ARTICLES</a>
        </div>
      </div>
    </article>
    <footer><a className="brand footer-brand" href="/"><img src="/brand-logo.webp" alt="Platinum Benefit Services"/></a><p>Educational information for families navigating long-term care decisions.</p><p>© {new Date().getFullYear()} Platinum Benefit Services. All rights reserved.</p></footer>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g, '\\u003c')}}/>
  </main>;
}
