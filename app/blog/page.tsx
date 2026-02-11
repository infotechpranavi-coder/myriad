'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { BlogPost } from '@/lib/models/blog';

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  async function fetchBlogPosts() {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched blog posts:', data);
        // Show all posts (published, draft, or no status)
        // You can filter by status if needed: data.filter((post: BlogPost) => !post.status || post.status === 'published')
        setBlogPosts(data);
      } else {
        console.error('Failed to fetch blog posts');
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <main className="bg-background">
      {/* Header */}
      <section className="py-16 px-4 bg-muted/30">
        <ScrollAnimationWrapper animation="fadeUp" className="max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary mb-4 text-balance">
            The Myriad Journal
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl">
            Stories, insights, and inspiration from the world of luxury hospitality, travel, and dining.
          </p>
        </ScrollAnimationWrapper>
      </section>

      {blogPosts.length === 0 ? (
        <section className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-lg text-foreground/70">No blog posts available yet. Check back soon!</p>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Post */}
          {featuredPost && (
            <section className="py-20 px-4 bg-background">
              <ScrollAnimationWrapper className="max-w-6xl mx-auto mb-16" animation="fadeUp">
                <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-lg overflow-hidden shadow-lg border border-border transition-smooth hover:shadow-2xl hover:-translate-y-2">
                  <div className="relative h-96">
                    <Image
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
                      Featured
                    </span>
                    <h2 className="text-4xl font-serif font-bold text-primary mb-4 text-balance">
                      {featuredPost.title}
                    </h2>
                    <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-foreground/70 mb-6">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        {featuredPost.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {featuredPost.date}
                      </div>
                      {featuredPost.readTime && <span>{featuredPost.readTime}</span>}
                    </div>
                    <Link 
                      href={`/blog/${featuredPost._id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors"
                    >
                      Read Article
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </ScrollAnimationWrapper>

              {/* Blog Grid */}
              {otherPosts.length > 0 && (
                <div className="max-w-6xl mx-auto">
                  <ScrollAnimationWrapper animation="fadeUp">
                    <h2 className="text-3xl font-serif font-bold text-primary mb-8">Latest Articles</h2>
                  </ScrollAnimationWrapper>
                  <div className="grid md:grid-cols-3 gap-8">
                    {otherPosts.map((post, index) => (
                      <ScrollAnimationWrapper key={post._id} animation="fadeUp" delay={index * 100}>
                        <article className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-smooth hover:-translate-y-2 border border-border">
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={post.image || "/placeholder.svg"}
                              alt={post.title}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-6">
                            {post.category && (
                              <span className="inline-block bg-muted text-foreground/70 px-2 py-1 rounded text-xs font-medium mb-3">
                                {post.category}
                              </span>
                            )}
                            <h3 className="text-xl font-serif font-bold text-primary mb-3 line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-foreground/60 mb-4 border-t border-border pt-4">
                              <span>{post.author}</span>
                              <span>{post.date}</span>
                            </div>
                            <Link 
                              href={`/blog/${post._id}`}
                              className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium text-sm transition-colors"
                            >
                              Read More
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </article>
                      </ScrollAnimationWrapper>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-6 text-balance">
            Have a Story to Share?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            We welcome guest contributions and partnership inquiries.
          </p>
          <button className="bg-primary-foreground text-primary px-8 py-4 rounded text-lg font-medium hover:opacity-90 transition-opacity">
            Get in Touch
          </button>
        </div>
      </section>
    </main>
  );
}
