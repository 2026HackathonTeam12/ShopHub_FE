export interface BusinessHour {
    dayOfWeek: string // "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"
    openTime: string  // "10:00"
    closeTime: string // "21:00"
    open: boolean
}

export interface MenuItem {
    id: string
    name: string
    description: string
}

export interface StoreProfile {
    id: string
    name: string
    phone: string
    introduction: string
    address: string
    category: string
    toneOfVoice: string
    businessHours: BusinessHour[]
    menuItems: MenuItem[]
    googlePlaceId: string | null
    googleReviewUrl: string | null
    googleTotalReviews: number
    updatedAt: string
}
