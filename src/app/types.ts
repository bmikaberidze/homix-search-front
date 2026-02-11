export interface Property {
    id: string
    title: string
    address: string
    price: number
    priceType: 'month' | 'sale'
    beds: number
    baths: number
    size: string
    popular?: boolean
    featured?: boolean
    images?: string[]
    description?: string
    amenities?: string[]
    url?: string
    owner: {
        id: string
        name: string
        type: 'individual' | 'broker' | 'company'
        tier: 'free' | 'starter' | 'professional' | 'enterprise'
        responseTime: string
    }
}

export interface Message {
    id: string
    type: 'user' | 'ai' | 'owner'
    content: string
    timestamp: string
    properties?: Property[]
    thinking?: string
    showPlaceholders?: boolean
}

export interface OwnerChat {
    id: string
    owner: {
        id: string
        name: string
        type: 'individual' | 'broker' | 'company'
        tier: 'free' | 'starter' | 'professional' | 'enterprise'
        responseTime: string
    }
    property?: {
        id: string
        title: string
    }
    messages: Message[]
    lastMessage: string
    unread: number
}

export interface ScheduledVisit {
    id: string
    propertyName: string
    date: Date
    time: string
    address: string
}

export type Page =
    | 'home'
    | 'conversation'
    | 'property'
    | 'features'
    | 'pricing'
    | 'contact'
    | 'products'
    | 'profile'
    | 'saved-properties'
    | 'messages'
    | 'settings'
    | 'signin'
    | 'signup'
    | 'onboarding'
