'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Clock, Share2, Bookmark, Loader2 } from 'lucide-react';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';
import { BlogPost } from '@/lib/models/blog';


export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  useEffect(() => {
    fetchBlogPost();
  }, [postId]);

  async function fetchBlogPost() {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${postId}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        console.error('Failed to fetch blog post');
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
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

  if (!post) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link href="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const images = post.images || (post.image ? [post.image] : []);

  return (
    <main className="bg-background">
      {/* Modern Header with Gradient */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/blog')}
              className="p-2 rounded-full hover:bg-muted transition-colors group"
              aria-label="Back to blog"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <Link 
              href="/blog" 
              className="text-foreground/70 hover:text-foreground transition-colors font-medium"
            >
              Back to Blog
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Share">
              <Share2 size={18} className="text-foreground/70" />
            </button>
            <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Bookmark">
              <Bookmark size={18} className="text-foreground/70" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="relative w-full">
        {images.length > 1 ? (
          <div className="relative h-[70vh] min-h-[500px] w-full">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full h-full"
            >
              <CarouselContent className="h-full ml-0">
                {images.map((img, index) => (
                  <CarouselItem key={index} className="relative h-full w-full pl-0">
                    <div className="relative h-[70vh] min-h-[500px] w-full">
                      <Image
                        src={img}
                        alt={`${post.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        quality={95}
                        priority={index === 0}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                          <div className="max-w-4xl mx-auto">
                            {post.category && (
                              <span className="inline-block bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                                {post.category}
                              </span>
                            )}
                            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 text-balance drop-shadow-lg">
                              {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                              <div className="flex items-center gap-2">
                                <User size={16} />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                <span>{post.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
              <CarouselNext className="right-4 bg-background/80 backdrop-blur-sm border-border hover:bg-background" />
            </Carousel>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
              <div className="flex gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-primary/50"
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-[70vh] min-h-[500px] w-full">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              quality={95}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="max-w-4xl mx-auto">
                <span className="inline-block bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 text-balance drop-shadow-lg">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section with Modern Layout */}
      <article className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid md:grid-cols-12 gap-8 md:gap-12">
          {/* Sidebar - Author & Meta Info */}
          <aside className="md:col-span-3 order-2 md:order-1">
            <div className="sticky top-24 space-y-8">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <p className="text-sm text-foreground/60">Author</p>
                  </div>
                </div>
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <Clock size={16} />
                    <span>{post.readTime}</span>
                  </div>
                </div>
              </div>
              
              {post.category && (
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
                  <h3 className="font-semibold mb-3 text-foreground">Category</h3>
                  <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-9 order-1 md:order-2">
            <ScrollAnimationWrapper animation="fadeUp">
              {/* Blog Content with Enhanced Typography */}
              {post.content && (
                <div 
                  className="prose prose-lg prose-slate max-w-none mb-12
                    [&>p]:text-foreground/80 [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:text-lg
                    [&>h2]:text-3xl [&>h2]:font-serif [&>h2]:font-bold [&>h2]:text-primary [&>h2]:mb-4 [&>h2]:mt-12 [&>h2]:leading-tight
                    [&>h3]:text-2xl [&>h3]:font-serif [&>h3]:font-semibold [&>h3]:text-foreground [&>h3]:mb-3 [&>h3]:mt-8
                    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:space-y-2 [&>ul]:text-foreground/80
                    [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:space-y-2 [&>ol]:text-foreground/80
                    [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-foreground/70"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              )}

              {/* Sections */}
              {post.sections && post.sections.length > 0 && (
                <div className="space-y-12">
                  {post.sections.map((section, index) => (
                    <div key={index} className="space-y-6">
                      <h2 className="text-3xl font-serif font-bold text-primary mb-4 leading-tight">
                        {section.title}
                      </h2>
                      <div className="space-y-4">
                        {section.descriptions.map((description, descIndex) => (
                          <p
                            key={descIndex}
                            className="text-foreground/80 leading-relaxed text-lg mb-6"
                          >
                            {description}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollAnimationWrapper>

            {/* Additional Images Gallery */}
            {images.length > 1 && (
              <div className="mt-16">
                <h2 className="text-2xl font-serif font-bold text-primary mb-6">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.slice(1).map((img, index) => (
                    <div key={index} className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                      <Image
                        src={img}
                        alt={`${post.title} gallery image ${index + 2}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Share & Navigation */}
            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-primary hover:text-accent font-medium transition-colors group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                  Back to All Articles
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground/60">Share this article:</span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Share on Twitter">
                      <Share2 size={18} className="text-foreground/70" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Bookmark">
                      <Bookmark size={18} className="text-foreground/70" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
