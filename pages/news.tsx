import { useState, useEffect } from 'react';
import Head from 'next/head';
import { NewsPost } from '../types';

export default function News() {
  const [news, setNews] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Travel', 'Tourist Guide', 'City Sights', 'Communication', 'Events', 'Student Life'];

  useEffect(() => {
    fetchNews();
  }, [currentPage, selectedCategory]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const response = await fetch(`/api/news?page=${currentPage}&limit=9&status=published&sortBy=publishedAt&order=desc${categoryParam}`);
      const data = await response.json();

      if (data.success) {
        setNews(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        setError(data.error || 'Failed to fetch news');
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(err.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1" />
        <title>News | Hosteller</title>
        <link rel="stylesheet" href="/html.merku.love/hosteller/css/preload.min.css" />
        <link rel="stylesheet" href="/html.merku.love/hosteller/css/icomoon.css" />
        <link rel="stylesheet" href="/html.merku.love/hosteller/css/libs.min.css" />
        <link rel="stylesheet" href="/html.merku.love/hosteller/css/news.min.css" />
      </Head>

      <header className="header d-flex align-items-center" data-page="news">
        <div className="container position-relative d-flex justify-content-between align-items-center">
          <a className="brand d-flex align-items-center" href="/html.merku.love/hosteller/index.html">
            <span className="brand_logo theme-element">
              <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.03198 3.80281V7.07652L3.86083 9.75137L0.689673 12.4263L0.667474 6.56503C0.655304 3.34138 0.663875 0.654206 0.686587 0.593579C0.71907 0.506918 1.4043 0.488223 3.87994 0.506219L7.03198 0.529106V3.80281ZM21.645 4.36419V5.88433L17.0383 9.76316C14.5046 11.8966 11.2263 14.6552 9.75318 15.8934L7.07484 18.145V20.3225V22.5H3.85988H0.64502L0.667303 18.768L0.689673 15.036L2.56785 13.4609C3.60088 12.5946 6.85989 9.85244 9.81009 7.36726L15.1741 2.84867L18.4096 2.8464L21.645 2.84413V4.36419ZM21.645 15.5549V22.5H18.431H15.217V18.2638V14.0274L15.4805 13.7882C15.8061 13.4924 21.5939 8.61606 21.6236 8.61248C21.6353 8.61099 21.645 11.7351 21.645 15.5549Z" fill="currentColor" />
              </svg>
            </span>
            <span className="brand_name">Hosteller</span>
          </a>
          <nav className="header_nav">
            <ul className="header_nav-list">
              <li className="header_nav-list_item">
                <a className="nav-item" href="/html.merku.love/hosteller/index.html">Home</a>
              </li>
              <li className="header_nav-list_item">
                <a className="nav-item" href="/html.merku.love/hosteller/about.html">About</a>
              </li>
              <li className="header_nav-list_item">
                <a className="nav-item" href="/rooms">Rooms</a>
              </li>
              <li className="header_nav-list_item">
                <a className="nav-item" href="/news" style={{ color: '#dc2626', fontWeight: 'bold' }}>News</a>
              </li>
              <li className="header_nav-list_item">
                <a className="nav-item" href="/html.merku.love/hosteller/contacts.html">Contacts</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <header className="page">
        <div className="container">
          <ul className="breadcrumbs d-flex flex-wrap align-content-center">
            <li className="list-item">
              <a className="link" href="/html.merku.love/hosteller/index.html">Home</a>
            </li>
            <li className="list-item">
              <a className="link" href="#">News</a>
            </li>
          </ul>
          <h1 className="page_title">News</h1>
        </div>
      </header>

      <main className="news-section section">
        <div className="sticky-parent container d-lg-flex justify-content-between align-items-start">
          <div className="news">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '50px 0', width: '100%' }}>
                <p style={{ fontSize: '18px', color: '#666' }}>Loading news...</p>
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '50px 0', width: '100%' }}>
                <p style={{ fontSize: '18px', color: '#dc2626' }}>{error}</p>
              </div>
            ) : news.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 0', width: '100%' }}>
                <p style={{ fontSize: '18px', color: '#666' }}>No news posts available at the moment.</p>
                <p style={{ fontSize: '14px', color: '#999' }}>Check back soon for updates!</p>
              </div>
            ) : (
              <>
                <ul className="news_list">
                  {news.map((post, index) => (
                    <li key={post.id} className="news_list-item" data-order={index + 1}>
                      <div className="item-wrapper d-sm-flex flex-lg-column flex-xl-row">
                        <div className="media">
                          <picture>
                            <img
                              src={post.featuredImage || '/html.merku.love/hosteller/img/news/01.jpg'}
                              alt={post.title}
                              style={{ width: '100%', height: '250px', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/html.merku.love/hosteller/img/news/01.jpg';
                              }}
                            />
                          </picture>
                          {post.category && (
                            <span className="media_label">{post.category}</span>
                          )}
                        </div>
                        <div className="main d-sm-flex d-xl-block flex-column justify-content-between">
                          <a className="main_title h4" href={`/post/${post.slug}`}>
                            {post.title}
                          </a>
                          <p className="main_preview">
                            {post.excerpt}
                          </p>
                          <div className="main_metadata">
                            <span className="main_metadata-item d-inline-flex align-items-center">
                              <i className="icon-calendar icon"></i> {formatDate(post.publishedAt || post.createdAt)}
                            </span>
                            <span className="main_metadata-item d-inline-flex align-items-center">
                              <i className="icon-user icon"></i> {post.author}
                            </span>
                            {post.views > 0 && (
                              <span className="main_metadata-item d-inline-flex align-items-center">
                                <i className="icon-eye icon"></i> <span className="number">{post.views}</span> <span className="text">views</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {totalPages > 1 && (
                  <ul className="pagination d-flex align-items-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className="pagination-page">
                        <a
                          className="pagination-page_link d-flex align-items-center justify-content-center"
                          href="#"
                          data-current={page === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{
                            backgroundColor: page === currentPage ? '#dc2626' : 'transparent',
                            color: page === currentPage ? '#fff' : '#000',
                          }}
                        >
                          {page}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="widgets" data-sticky="true" data-stop="90">
            <div className="widgets_item widgets_item--categories">
              <h4 className="widgets_item-header">Categories</h4>
              <ul className="list">
                {categories.map((category) => (
                  <li
                    key={category}
                    className={`list-item d-flex align-items-center ${selectedCategory === category ? 'current' : ''}`}
                  >
                    <a
                      className="link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryChange(category);
                      }}
                      style={{
                        color: selectedCategory === category ? '#dc2626' : 'inherit',
                        fontWeight: selectedCategory === category ? 'bold' : 'normal',
                      }}
                    >
                      {category === 'all' ? 'All Categories' : category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer accent">
        <div className="container">
          <div className="footer_main d-sm-flex flex-wrap flex-lg-nowrap justify-content-between">
            <div className="footer_main-block footer_main-block--about col-sm-7 col-lg-auto d-flex flex-column">
              <a className="brand d-flex align-items-center" href="/html.merku.love/hosteller/index.html">
                <span className="brand_name">Hosteller</span>
              </a>
              <p className="footer_main-block_text">
                Stay updated with the latest news, tips, and guides for students and travelers.
              </p>
            </div>
          </div>
        </div>
        <div className="footer_copyright">
          <div className="container">
            <p className="footer_copyright-text">
              <span className="linebreak">Staylo © Hostel Management</span>
              <span className="linebreak">All rights reserved {new Date().getFullYear()}</span>
            </p>
          </div>
        </div>
      </footer>

      <script src="/html.merku.love/hosteller/js/common.min.js"></script>
    </>
  );
}
