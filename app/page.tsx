import { ArrowRight, Clock3 } from 'lucide-react';
import { formatDate, getBlogs, readingTime, type Blog } from '@/lib/uplift';

const previews: Blog[] = [
  { id:'preview-1', slug:'', title:'A Practical Guide to Planning for Long-Term Care', excerpt:'The essential decisions, documents, and conversations that can help your family move forward with confidence.', categories:['Planning Guides'], publishDate:'2026-08-28', customFields:{readingTime:'7 min read'} },
  { id:'preview-2', slug:'', title:'What Families Should Know Before Applying for Benefits', excerpt:'A clear look at common requirements, avoidable delays, and ways to prepare before you begin.', categories:['Benefits'], publishDate:'2026-08-21', customFields:{readingTime:'5 min read'} },
  { id:'preview-3', slug:'', title:'How to Organize Important Financial Records', excerpt:'A straightforward checklist for gathering the information your family and advisors may need.', categories:['Resources'], publishDate:'2026-08-14', customFields:{readingTime:'6 min read'} },
];

function PostMeta({post}:{post:Blog}) { return <div className="post-meta"><span>{formatDate(post.publishDate)}</span><span><Clock3 size={14}/> {readingTime(post)}</span></div>; }
function PostLink({post,children,className}:{post:Blog;children:React.ReactNode;className?:string}) { return post.slug ? <a className={className} href={`/blog/${post.slug}`}>{children}</a> : <span className={className}>{children}</span>; }

export default async function Home() {
  const livePosts = await getBlogs(12);
  const posts = livePosts.length ? livePosts : previews;
  const featured = posts[0];
  return <main>
    <div className="announcement"><p>Clear guidance for life’s most important care decisions.</p><a href="#latest">EXPLORE ARTICLES <ArrowRight size={15}/></a></div>
    <header className="site-header"><a className="brand" href="/" aria-label="Platinum Benefit Journal home"><img src="/brand-logo.webp" alt="Platinum Benefit Services"/><span className="journal-label">THE JOURNAL</span></a><nav aria-label="Main navigation"><a href="#latest">LATEST</a><a href="#guides">PLANNING GUIDES</a><a href="#resources">RESOURCES</a><a href="https://platben.com/">MAIN WEBSITE</a></nav></header>
    <section className="hero"><div className="hero-inner"><p className="eyebrow">THE PLATINUM BENEFIT JOURNAL</p><h1>Clear answers for<br/>life’s <em>next chapter.</em></h1><p className="hero-copy">Trusted insights on long-term care, Medicaid benefits, financial preparation, and the decisions that shape your family’s future.</p><a className="primary-button" href="#latest">READ THE LATEST <ArrowRight size={17}/></a></div><div className="hero-seal" aria-hidden="true"><span>30+</span>YEARS OF<br/>EXPERIENCE</div></section>
    <section className="articles" id="latest">
      <div className="section-heading"><div><p className="eyebrow">LATEST INSIGHTS</p><h2>{livePosts.length ? 'Featured reading' : 'The journal is taking shape'}</h2></div><a href="#all-articles">VIEW ALL ARTICLES <ArrowRight size={15}/></a></div>
      {!livePosts.length && <p className="feed-note">Your UpliftAI connection is working. There are no published posts yet, so these editorial previews show how the journal will look when your first articles go live.</p>}
      <article className="featured-card"><div className="featured-art" style={featured.featuredImage?{backgroundImage:`linear-gradient(145deg,rgba(16,47,73,.22),rgba(16,47,73,.7)),url(${featured.featuredImage})`}:undefined} aria-hidden="true"><span>PLANNING WITH<br/>CLARITY</span></div><div className="featured-content"><span className="category">{featured.categories?.[0] ?? 'Insights'}</span><h3>{featured.title}</h3><p>{featured.excerpt}</p><PostMeta post={featured}/><PostLink post={featured}>READ ARTICLE <ArrowRight size={16}/></PostLink></div></article>
      <div className="post-grid" id="all-articles">{posts.slice(1).map((post,index)=><article className="post-card" key={post.id}><PostLink post={post} className={`post-art art-${index+1}`}><span>PB</span></PostLink><div className="post-body"><span className="category">{post.categories?.[0] ?? 'Insights'}</span><PostLink post={post}><h3>{post.title}</h3></PostLink><p>{post.excerpt}</p><PostMeta post={post}/></div></article>)}</div>
    </section>
    <footer><a className="brand footer-brand" href="/"><img src="/brand-logo.webp" alt="Platinum Benefit Services"/><span className="journal-label">THE JOURNAL</span></a><p>Educational information for families navigating long-term care decisions.</p><p>© {new Date().getFullYear()} Platinum Benefit Services. All rights reserved.</p></footer>
  </main>;
}
