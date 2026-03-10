'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, User, Loader2 } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import { BlogPost } from '@/lib/models/blog';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        // Filter only published blogs
        const publishedBlogs = data.filter((blog: BlogPost) => blog.status === 'published');
        setBlogs(publishedBlogs);
      } else {
        console.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
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

  return (
    <main className="bg-background">
      {/* Header Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto text-center">
          <ScrollAnimationWrapper animation="fadeUp">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-6 text-balance">
              Our Blog
            </h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Discover the latest news, stories, and insights from The Myriad Hotel
            </p>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          {blogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <ScrollAnimationWrapper key={blog._id} animation="fadeUp" delay={index * 100}>
                  <Link href={`/blog/${blog._id}`} className="group">
                    <article className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 h-full flex flex-col">
                      {/* Blog Image */}
                      <div className="relative w-full h-64 overflow-hidden bg-muted/20">
                        <Image
                          src={blog.image || blog.images?.[0] || '/hero.jpg'}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>

                      {/* Blog Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Category Badge */}
                        {blog.category && (
                          <div className="mb-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {blog.category}
                            </span>
                          </div>
                        )}

                        {/* Title */}
                        <h2 className="text-2xl font-serif font-bold text-primary mb-3 line-clamp-2 group-hover:text-primary/80 transition-colors">
                          {blog.title}
                        </h2>

                        {/* Excerpt */}
                        <p className="text-foreground/70 mb-4 line-clamp-3 flex-1">
                          {blog.excerpt}
                        </p>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 mt-auto pt-4 border-t border-border">
                          {blog.author && (
                            <div className="flex items-center gap-2">
                              <User size={16} />
                              <span>{blog.author}</span>
                            </div>
                          )}
                          {blog.date && (
                            <div className="flex items-center gap-2">
                              <Calendar size={16} />
                              <span>{new Date(blog.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                          )}
                          {blog.readTime && (
                            <div className="flex items-center gap-2">
                              <Clock size={16} />
                              <span>{blog.readTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </Link>
                </ScrollAnimationWrapper>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-4">No blog posts available yet.</p>
              <p className="text-foreground/60">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
