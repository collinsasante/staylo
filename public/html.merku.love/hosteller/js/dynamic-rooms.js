// Dynamic Rooms - Fetch hostels from API and display them
(function() {
  'use strict';

  let currentPage = 1;
  const limit = 6;

  // Fetch hostels from API
  async function fetchHostels(page = 1) {
    try {
      // Simplified query - remove filters that require indexes
      const response = await fetch(`/api/hostels?page=${page}&limit=${limit}`);
      const data = await response.json();

      if (data.success) {
        renderHostels(data.data);
        renderPagination(data.pagination);
      } else {
        showError('Failed to load hostels. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching hostels:', error);
      showError('Failed to load hostels. Please check your connection.');
    }
  }

  // Clear static content immediately on load
  function clearStaticContent() {
    const roomsList = document.querySelector('.rooms_list');
    if (roomsList) {
      roomsList.innerHTML = `
        <div style="text-align: center; padding: 50px 0; width: 100%;">
          <p style="font-size: 18px; color: #666;">Loading hostels...</p>
        </div>
      `;
    }
  }

  // Render hostels to the page
  function renderHostels(hostels) {
    const roomsList = document.querySelector('.rooms_list');

    if (!roomsList) {
      console.error('Rooms list container not found');
      return;
    }

    if (hostels.length === 0) {
      roomsList.innerHTML = `
        <div style="text-align: center; padding: 50px 0; width: 100%;">
          <p style="font-size: 18px; color: #666;">No hostels available at the moment.</p>
          <p style="font-size: 14px; color: #999;">Check back soon for new listings!</p>
        </div>
      `;
      return;
    }

    roomsList.innerHTML = hostels.map((hostel, index) => {
      const image = hostel.images && hostel.images[0] ? hostel.images[0] : 'img/rooms/01.jpg';
      const amenities = hostel.amenities || [];

      return `
        <li class="rooms_list-item" data-order="${index + 1}" data-aos="fade-up">
          <div class="item-wrapper d-md-flex">
            <div class="media">
              <picture>
                <img
                  src="${image}"
                  alt="${hostel.name}"
                  style="width: 100%; height: 100%; object-fit: cover;"
                  onerror="this.src='img/rooms/01.jpg'"
                >
              </picture>
            </div>
            <div class="main d-md-flex justify-content-between">
              <div class="main_info d-md-flex flex-column justify-content-between">
                <a class="main_title h4" href="room.html?id=${hostel.id}">
                  ${hostel.name}
                </a>
                <p class="main_description">${hostel.description || 'Comfortable hostel accommodation'}</p>
                <div class="main_amenities">
                  <span class="main_amenities-item d-inline-flex align-items-center">
                    <i class="icon-location icon"></i> ${hostel.location}
                  </span>
                  ${amenities.slice(0, 2).map(amenity => `
                    <span class="main_amenities-item d-inline-flex align-items-center">
                      <i class="icon-check icon"></i> ${amenity}
                    </span>
                  `).join('')}
                </div>
              </div>
              <div class="main_pricing d-flex flex-column align-items-md-end justify-content-md-between">
                <div class="wrapper d-flex flex-column">
                  <span class="main_pricing-item">
                    <span class="h2">GH₵${hostel.price}</span> / month
                  </span>
                </div>
                <a class="theme-element theme-element--accent btn" href="room.html?id=${hostel.id}">
                  View Details
                </a>
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

    // Generate page numbers
    for (let i = 1; i <= totalPages; i++) {
      pages.push(`
        <li class="pagination-page">
          <a
            class="pagination-page_link d-flex align-items-center justify-content-center ${i === page ? 'active' : ''}"
            href="#"
            data-page="${i}"
            ${i === page ? 'data-current="true"' : ''}
            style="${i === page ? 'background-color: #dc2626; color: #fff;' : ''}"
          >
            ${i}
          </a>
        </li>
      `);
    }

    paginationContainer.innerHTML = pages.join('');

    // Add click event listeners
    paginationContainer.querySelectorAll('a[data-page]').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = parseInt(this.getAttribute('data-page'));
        currentPage = page;
        fetchHostels(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // Show error message
  function showError(message) {
    const roomsList = document.querySelector('.rooms_list');
    if (roomsList) {
      roomsList.innerHTML = `
        <div style="text-align: center; padding: 50px 0; width: 100%;">
          <p style="font-size: 18px; color: #dc2626;">${message}</p>
        </div>
      `;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      clearStaticContent();
      fetchHostels(currentPage);
    });
  } else {
    clearStaticContent();
    fetchHostels(currentPage);
  }
})();
