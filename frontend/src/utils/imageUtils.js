// Image utility functions

/**
 * Generate a placeholder image data URL
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display on placeholder
 * @param {string} bgColor - Background color
 * @param {string} textColor - Text color
 * @returns {string} Data URL for the placeholder image
 */
export const generatePlaceholder = (
  width = 300, 
  height = 200, 
  text = 'No Image', 
  bgColor = '#f8f9fa',
  textColor = '#6c757d'
) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="${bgColor}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
            font-family="Arial, sans-serif" font-size="14" fill="${textColor}">
        ${text}
      </text>
    </svg>
  `
  
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Get restaurant image with fallback to placeholder
 * @param {Object} shop - Shop object
 * @param {number} width - Desired image width
 * @param {number} height - Desired image height
 * @returns {string} Image URL or placeholder
 */
export const getRestaurantImage = (shop, width = 300, height = 200) => {
  // Check if shop has photos (frontend format)
  if (shop?.photos && Array.isArray(shop.photos) && shop.photos.length > 0) {
    const photo = shop.photos[0]
    return photo?.url || photo || generatePlaceholder(width, height, 'Restaurant')
  }
  
  // Check if shop has images (backend format)
  if (shop?.images && Array.isArray(shop.images) && shop.images.length > 0) {
    const image = shop.images[0]
    // If it's a string that looks like a URL or path, use it directly
    if (typeof image === 'string' && image.trim()) {
      // If it already looks like a full URL, use it
      if (image.startsWith('http')) {
        return image
      }
      // If it starts with /, use it as is (Vite proxy will handle it)
      if (image.startsWith('/')) {
        return image
      }
      // Otherwise treat it as a relative path from uploads
      return `/uploads/${image}`
    }
    return generatePlaceholder(width, height, 'Restaurant')
  }
  
  // Check if shop has a main image property
  if (shop?.image) {
    if (typeof shop.image === 'string' && shop.image.trim()) {
      if (shop.image.startsWith('http')) {
        return shop.image
      }
      if (shop.image.startsWith('/')) {
        return shop.image
      }
      return `/uploads/${shop.image}`
    }
  }
  
  // Return placeholder with restaurant name if available
  const placeholderText = shop?.shopName || shop?.name || 'Restaurant'
  return generatePlaceholder(width, height, placeholderText)
}

/**
 * Handle image error by setting a placeholder
 * @param {Event} event - Image error event
 * @param {string} fallbackText - Text for fallback placeholder
 */
export const handleImageError = (event, fallbackText = 'Image Not Found') => {
  const img = event.target
  if (img && !img.src.startsWith('data:image/svg+xml')) {
    img.src = generatePlaceholder(300, 200, fallbackText)
  }
}

/**
 * Get image URL with fallback support
 * @param {string|Object} image - Image path, URL, or object with URL property
 * @param {number} width - Desired image width for placeholder
 * @param {number} height - Desired image height for placeholder
 * @returns {string} Image URL or placeholder
 */
export const getImageUrl = (image, width = 300, height = 200) => {
  // If no image provided, return placeholder
  if (!image) {
    return generatePlaceholder(width, height, 'No Image')
  }
  
  // If it's a string
  if (typeof image === 'string') {
    const trimmedImage = image.trim()
    if (!trimmedImage) {
      return generatePlaceholder(width, height, 'No Image')
    }
    
    // If it already looks like a full URL, use it
    if (trimmedImage.startsWith('http')) {
      return trimmedImage
    }
    
    // If it starts with /, use it as is (Vite proxy will handle it)
    if (trimmedImage.startsWith('/')) {
      return trimmedImage
    }
    
    // If it's a placeholder filename, return placeholder
    if (trimmedImage === 'placeholder.jpg' || trimmedImage === 'placeholder') {
      return generatePlaceholder(width, height, 'Restaurant')
    }
    
    // Otherwise treat it as a relative path from uploads
    return `/uploads/${trimmedImage}`
  }
  
  // If it's an object with url property
  if (typeof image === 'object' && image.url) {
    return getImageUrl(image.url, width, height)
  }
  
  // Fallback to placeholder
  return generatePlaceholder(width, height, 'Restaurant')
}
