// link-handler.js
class LinkHandlerV2 {
  constructor() {
    this.isCanonical = window.location.hostname === 'bizlink-id.blogspot.com';
    this.isDuplicate = window.location.hostname === 'bizlink.my.id';
    this.init();
  }

  init() {
    // Handle klik link
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Handle hash URL saat load
    this.handleInitialHash();
    
    console.log('Link Handler initialized on:', this.isCanonical ? 'Canonical' : 'Duplicate');
  }

  handleClick(event) {
    const link = event.target.closest('a[data-link-type]');
    if (!link) return;

    event.preventDefault();
    event.stopPropagation();

    const linkType = link.getAttribute('data-link-type');
    
    switch(linkType) {
      case 'canonical': this.handleCanonicalLink(link); break;
      case 'anchor': this.handleAnchorLink(link); break;
      case 'whatsapp': this.handleWhatsAppLink(link); break;
      default: this.handleDefaultLink(link);
    }
  }

  handleCanonicalLink(link) {
    const url = link.getAttribute('href');
    
    if (this.isCanonical) {
      // Navigasi normal di canonical
      window.location.href = url;
    } else {
      // Buka di tab baru dari duplicate
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }

  handleAnchorLink(link) {
    const hash = link.getAttribute('href'); // #section-id
    const pageSlug = link.getAttribute('data-canonical-page');
    
    if (this.isCanonical) {
      // Scroll ke section
      this.scrollToSection(hash);
    } else {
      // Redirect ke canonical dengan hash
      this.redirectToCanonicalWithHash(pageSlug, hash);
    }
  }

  handleWhatsAppLink(link) {
    const originalUrl = link.getAttribute('href');
    const waNumber = this.extractPhoneNumber(originalUrl);
    const customMessage = link.getAttribute('data-wa-message');
    
    // Default message
    let message = customMessage || `Halo, saya dari ${window.location.href}`;
    
    // Tambahkan info produk jika ada
    const productName = link.getAttribute('data-product') || 
                       document.title || 
                       'produk ini';
    
    if (!customMessage) {
      message = `Halo, saya tertarik dengan ${productName}. Dapat info dari ${window.location.href}`;
    }
    
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }

  scrollToSection(hash) {
    const sectionId = hash.substring(1);
    const section = document.getElementById(sectionId);
    
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Update URL
      history.pushState(null, '', hash);
    }
  }

  redirectToCanonicalWithHash(pageSlug, hash) {
    // Mapping slug ke URL canonical
    const slugMap = {
      'kosmetik-hana': '2025/12/kosmetik-hana.html',
      'home': '', // homepage
      // Tambahkan mapping lainnya
    };
    
    let canonicalPath = slugMap[pageSlug];
    
    if (!canonicalPath && pageSlug) {
      // Generate otomatis jika tidak ada di mapping
      const year = new Date().getFullYear();
      const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
      canonicalPath = `${year}/${month}/${pageSlug}.html`;
    }
    
    const canonicalUrl = `https://bizlink-id.blogspot.com/${canonicalPath}${hash}`;
    window.location.href = canonicalUrl;
  }

  extractPhoneNumber(url) {
    const match = url.match(/\d{10,}/);
    return match ? match[0] : '6281234567890'; // Default fallback
  }

  handleDefaultLink(link) {
    window.location.href = link.getAttribute('href');
  }

  handleInitialHash() {
    if (this.isCanonical && window.location.hash) {
      setTimeout(() => {
        this.scrollToSection(window.location.hash);
      }, 500);
    }
  }
}

// Auto-init saat DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.linkHandler = new LinkHandlerV2();
});
