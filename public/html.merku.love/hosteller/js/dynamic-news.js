// Dynamic News - Fetch news posts from API and display them
(function() {
  'use strict';

  let currentPage = 1;
  const limit = 9; // 9 posts per page

  // Clear static content immediately on load
  function clearStaticContent() {
    const newsList = document.querySelector('.news_list');
    if (newsList) {
      newsList.innerHTML = `
        <div style="text-align: center; padding: 50px 0; width: 100%; grid-column: 1 / -1;">
          <p style="font-size: 18px; color: #666;">Loading news...</p>
        </div>
      `;
    }
  }

  // Fetch news from API
  async function fetchNews(page = 1) {
    try {
      const response = await fetch(`/api/news?page=${page}&limit=${limit}&status=published`);
      const data = await response.json();

      if (data.success) {
        renderNews(data.data);
        renderPagination(data.pagination);
      } else {
        showError('Failed to load news. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      showError('Failed to load news. Please check your connection.');
    }
  }

  // Render news posts to the page
  function renderNews(posts) {
    const newsList = document.querySelector('.news_list');

    if (!newsList) {
      console.error('News list container not found');
      return;
    }

    if (posts.length === 0) {
      newsList.innerHTML = `
        <div style="text-align: center; padding: 50px 0; width: 100%; grid-column: 1 / -1;">
          <p style="font-size: 18px; color: #666;">No news posts available at the moment.</p>
          <p style="font-size: 14px; color: #999;">Check back soon for updates!</p>
        </div>
      `;
      return;
    }

    newsList.innerHTML = posts.map((post, index) => {
      const image = post.featuredImage || 'img/news/01.jpg';
      const publishedDate = post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt);
      const excerpt = post.excerpt || truncateText(post.content, 150);

      return `
        <li class="news_list-item col-sm-6 col-lg-4" data-order="${index + 1}" data-aos="fade-up">
          <div class="item-wrapper d-flex flex-column">
            <div class="media">
              <a href="post.html?slug=${post.slug}">
                <picture>
                  <img
                    src="${image}"
                    alt="${escapeHtml(post.title)}"
                    style="width: 100%; height: 250px; object-fit: cover;"
                    onerror="this.src='img/news/01.jpg'"
                  >
                </picture>
              </a>
            </div>
            <div class="main d-flex flex-column flex-grow-1">
              <div class="main_info d-flex align-items-center">
                <span class="main_info-item">
                  <i class="icon-calendar icon"></i> ${publishedDate}
                </span>
                <span class="main_info-item">
                  <i class="icon-user icon"></i> ${escapeHtml(post.author)}
                </span>
                ${post.category ? `
                  <span class="main_info-item">
                    <i class="icon-tag icon"></i> ${escapeHtml(post.category)}
                  </span>
                ` : ''}
              </div>
              <a class="main_title h4" href="post.html?slug=${post.slug}">
                ${escapeHtml(post.title)}
              </a>
              <p class="main_excerpt">${escapeHtml(excerpt)}</p>
              <div class="main_footer d-flex align-items-center justify-content-between" style="margin-top: auto;">
                <a class="link link--arrow d-inline-flex align-items-center" href="post.html?slug=${post.slug}">
                  Read more <i class="icon-arrow_right icon"></i>
                </a>
                ${post.views > 0 ? `
                  <span class="views" style="font-size: 14px; color: #999;">
                    <i class="icon-eye"></i> ${post.views} views
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
        </li>
      `;
    }).join('');
  }

  // Render pagination
  function renderPagination(pagination) {
    const paginationContainer = document.querySelector('.pagination');

    if (!paginationContainer || !pagination || pagination.totalPages <= 1) {
      if (paginationContainer) {
        paginationContainer.innerHTML = '';
      }
      return;
    }

    const { page, totalPages } = pagination;
    let pages = [];

    // Always show first page
    pages.push(createPageLink(1, page === 1));

    // Show ellipsis if needed
    if (page > 3) {
      pages.push('<li class="pagination-page"><span style="padding: 0 10px;">...</span></li>');
    }

    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(createPageLink(i, i === page));
    }

    // Show ellipsis if needed
    if (page < totalPages - 2) {
      pages.push('<li class="pagination-page"><span style="padding: 0 10px;">...</span></li>');
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(createPageLink(totalPages, page === totalPages));
    }

    paginationContainer.innerHTML = pages.join('');

    // Add click event listeners
    paginationContainer.querySelectorAll('a[data-page]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageNum = parseInt(this.getAttribute('data-page'));
        currentPage = pageNum;
        fetchNews(pageNum);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // Helper function to create page link
  function createPageLink(pageNum, isActive) {
    return `
      <li class="pagination-page">
        <a
          class="pagination-page_link d-flex align-items-center justify-content-center ${isActive ? 'active' : ''}"
          href="#"
          data-page="${pageNum}"
          ${isActive ? 'data-current="true"' : ''}
          style="${isActive ? 'background-color: #dc2626; color: #fff;' : ''}"
        >
          ${pageNum}
        </a>
      </li>
    `;
  }

  // Format date to readable format
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  // Truncate text to specified length
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength).trim() + '...';
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Show error message
  function showError(message) {
    const newsList = document.querySelector('.news_list');
    if (newsList) {
      newsList.innerHTML = `
        <div style="text-align: center; padding: 50px 0; width: 100%; grid-column: 1 / -1;">
          <p style="font-size: 18px; color: #dc2626;">${message}</p>
        </div>
      `;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      clearStaticContent();
      fetchNews(currentPage);
    });
  } else {
    clearStaticContent();
    fetchNews(currentPage);
  }
})();
