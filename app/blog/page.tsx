'use client';

import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ScrollAnimationWrapper } from '@/components/scroll-animation-wrapper';

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Modern Luxury Hospitality',
    excerpt: 'Discover how The Myriad Hotel combines timeless elegance with contemporary comfort to create unforgettable guest experiences.',
    author: 'Sarah Mitchell',
    date: 'January 15, 2024',
    category: 'Hospitality',
    image: '/hero.jpg',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Culinary Excellence: Our Chef\'s Journey',
    excerpt: 'Meet our award-winning chefs and learn about their philosophy of creating extraordinary dishes that delight the palate.',
    author: 'James Chen',
    date: 'January 10, 2024',
    category: 'Dining',
    image: '/hero.jpg',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Wedding Perfection: Real Stories from Our Events',
    excerpt: 'Read heartwarming stories from couples who celebrated their special day at The Myriad Hotel with flawless execution.',
    author: 'Emma Wilson',
    date: 'January 5, 2024',
    category: 'Events',
    image: '/hero.jpg',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Travel Tips: Making the Most of Your City Stay',
    excerpt: 'Expert travel advice for exploring the city while enjoying the comfort and luxury of The Myriad Hotel.',
    author: 'Marcus Johnson',
    date: 'December 28, 2023',
    category: 'Travel',
    image: '/hero.jpg',
    readTime: '4 min read',
  },
  {
    id: 5,
    title: 'Sustainable Luxury: Our Green Initiative',
    excerpt: 'Learn about The Myriad Hotel\'s commitment to environmental sustainability without compromising on luxury.',
    author: 'Dr. Lisa Patel',
    date: 'December 20, 2023',
    category: 'Sustainability',
    image: '/hero.jpg',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'Wellness at The Myriad: Spa & Fitness Programs',
    excerpt: 'Rejuvenate your mind and body with our comprehensive wellness programs and luxury spa treatments.',
    author: 'Victoria Hayes',
    date: 'December 15, 2023',
    category: 'Wellness',
    image: '/hero.jpg',
    readTime: '5 min read',
  },
];

export default function BlogPage() {
  const categories = ['All', ...new Set(blogPosts.map((post) => post.category))];

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

      {/* Featured Post */}
      <section className="py-20 px-4 bg-background">
        <ScrollAnimationWrapper className="max-w-6xl mx-auto mb-16" animation="fadeUp">
          <div className="grid md:grid-cols-2 gap-8 items-center bg-card rounded-lg overflow-hidden shadow-lg border border-border transition-smooth hover:shadow-2xl hover:-translate-y-2">
            <div className="relative h-96">
              <Image
                src={blogPosts[0].image || "/placeholder.svg"}
                alt={blogPosts[0].title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8">
              <span className="inline-block bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium mb-4">
                Featured
              </span>
              <h2 className="text-4xl font-serif font-bold text-primary mb-4 text-balance">
                {blogPosts[0].title}
              </h2>
              <p className="text-lg text-foreground/80 mb-6 leading-relaxed">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-foreground/70 mb-6">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {blogPosts[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {blogPosts[0].date}
                </div>
                <span>{blogPosts[0].readTime}</span>
              </div>
              <button className="text-primary hover:text-accent font-medium transition-colors flex items-center gap-2">
                Read Article
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </ScrollAnimationWrapper>

        {/* Blog Grid */}
        <div className="max-w-6xl mx-auto">
          <ScrollAnimationWrapper animation="fadeUp">
            <h2 className="text-3xl font-serif font-bold text-primary mb-8">Latest Articles</h2>
          </ScrollAnimationWrapper>
          <div className="grid md:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <ScrollAnimationWrapper key={post.id} animation="fadeUp" delay={index * 100}>
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
                    <span className="inline-block bg-muted text-foreground/70 px-2 py-1 rounded text-xs font-medium mb-3">
                      {post.category}
                    </span>
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
                    <button className="text-primary hover:text-accent font-medium text-sm transition-colors flex items-center gap-2">
                      Read More
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card p-12 rounded-lg border border-border text-center">
            <h2 className="text-3xl font-serif font-bold text-primary mb-4">
              Stay Updated
            </h2>
            <p className="text-foreground/80 mb-8">
              Subscribe to The Myriad Journal for the latest news, travel tips, and exclusive offers delivered to your inbox.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
            <p className="text-foreground/60 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Highlight */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-primary mb-12 text-center">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {['Hospitality', 'Dining', 'Events'].map((cat) => (
              <button
                key={cat}
                className="p-8 rounded-lg border border-border hover:border-primary hover:bg-muted/50 transition-all text-center"
              >
                <h3 className="text-xl font-serif font-bold text-primary mb-2">{cat}</h3>
                <p className="text-foreground/70 text-sm mb-4">
                  {blogPosts.filter((p) => p.category === cat).length} articles
                </p>
                <span className="text-primary hover:text-accent font-medium transition-colors">
                  Explore →
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

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
