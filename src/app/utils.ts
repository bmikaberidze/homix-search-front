import { Property } from './types'
import { sampleProperties } from './data'

// Backend Listing type based on API schema
interface Listing {
    title?: string
    description?: string
    price?: number
    currency?: string
    rooms?: number
    area_sqm?: number
    city?: string
    district?: string
    url: string
    images?: string[]
    posted_at?: string
    source?: string
    score?: number
    reasons?: string[]
}

// Convert backend Listing to frontend Property
export function convertListingToProperty(
    listing: Listing,
    index: number,
): Property {
    // Generate a unique ID from URL or index
    const id = listing.url
        ? `suggestion-${listing.url.split('/').pop() || index}`
        : `suggestion-${index}`

    // Create address from city and district
    const address =
        [listing.district, listing.city].filter(Boolean).join(', ') ||
        'Location not specified'

    // Format area with unit
    const size = listing.area_sqm ? `${listing.area_sqm} sqm` : 'N/A'

    // Create a generic owner (since Listing doesn't have owner info)
    const owner = {
        id: `owner-${id}`,
        name: listing.source || 'Property Agent',
        type: 'broker' as const,
        tier: 'professional' as const,
        responseTime: '< 1 hour',
    }

    return {
        id,
        title: listing.title || 'Property Listing',
        address,
        price: listing.price || 0,
        priceType: 'sale', // Default to sale, could be inferred from price range
        beds: listing.rooms || 0,
        baths: Math.max(1, Math.floor((listing.rooms || 0) / 2)), // Estimate baths
        size,
        images: listing.images || [],
        description: listing.description,
        url: listing.url, // Include the external URL
        owner,
        featured: (listing.score || 0) > 0.8, // Mark high-scoring as featured
        popular: (listing.score || 0) > 0.6, // Mark medium-scoring as popular
    }
}

// Timestamp helper
export function getCurrentTime() {
    const now = new Date()
    return now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

// Property matching based on AI response and query
export function matchPropertiesFromResponse(
    response: string,
    query: string,
): Property[] {
    const text = (response + ' ' + query).toLowerCase()
    let matchedProperties: Property[] = []

    // Price filtering
    if (text.includes('luxury') || text.includes('penthouse')) {
        matchedProperties = sampleProperties.filter(p => p.price >= 4000)
    } else if (text.includes('affordable') || text.includes('cheap')) {
        matchedProperties = sampleProperties.filter(p => p.price <= 2000)
    } else if (text.includes('mid-range') || text.includes('moderate')) {
        matchedProperties = sampleProperties.filter(
            p => p.price >= 2000 && p.price <= 3500,
        )
    }

    // Bedroom filtering
    if (text.includes('2 bed') || text.includes('two bed')) {
        matchedProperties = sampleProperties.filter(p => p.beds === 2)
    } else if (text.includes('3 bed') || text.includes('three bed')) {
        matchedProperties = sampleProperties.filter(p => p.beds === 3)
    } else if (text.includes('4 bed') || text.includes('four bed')) {
        matchedProperties = sampleProperties.filter(p => p.beds === 4)
    } else if (text.includes('1 bed') || text.includes('studio')) {
        matchedProperties = sampleProperties.filter(p => p.beds === 1)
    }

    // Type filtering
    if (
        text.includes('buy') ||
        text.includes('purchase') ||
        text.includes('sale')
    ) {
        const forSale = sampleProperties.filter(p => p.priceType === 'sale')
        if (forSale.length > 0) {
            matchedProperties = forSale
        }
    }

    if (text.includes('rent') || text.includes('lease')) {
        const forRent = sampleProperties.filter(p => p.priceType === 'month')
        if (forRent.length > 0) {
            matchedProperties = forRent
        }
    }

    // Location-based
    if (text.includes('new york') || text.includes('nyc')) {
        matchedProperties = sampleProperties.filter(p =>
            p.address.toLowerCase().includes('new york'),
        )
    } else if (text.includes('miami')) {
        matchedProperties = sampleProperties.filter(p =>
            p.address.toLowerCase().includes('miami'),
        )
    } else if (text.includes('los angeles') || text.includes('la')) {
        matchedProperties = sampleProperties.filter(p =>
            p.address.toLowerCase().includes('los angeles'),
        )
    }

    // Default fallback - return first 3 properties if query contains property-related keywords
    if (
        matchedProperties.length === 0 &&
        (text.includes('buy') ||
            text.includes('rent') ||
            text.includes('property') ||
            text.includes('apartment') ||
            text.includes('house') ||
            text.includes('home') ||
            text.includes('looking') ||
            text.includes('find') ||
            text.includes('search'))
    ) {
        matchedProperties = sampleProperties.slice(0, 3)
    }

    return matchedProperties
}
