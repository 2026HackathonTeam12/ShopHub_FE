import { Camera, MapPin } from 'lucide-react'

export interface StoreProfile {
  id: string
  name: string
  category: string
  neighborhood: string
  address: string
  phone: string
  hours: string
  initials: string
  accent: string
  description: string
  menu: string[]
  tone: string
  reviewCount: number
}

export const initialStores: StoreProfile[] = [
  {
    id: 'momo-yeonnam',
    name: '모모커피 연남',
    category: '카페 · 디저트',
    neighborhood: '서울 마포구 연남동',
    address: '서울 마포구 성미산로 190',
    phone: '02-332-1205',
    hours: '매일 10:00 - 22:00',
    initials: 'Y',
    accent: 'bg-[#ebd7cd]',
    description: '연남동 골목의 느린 오후를 위한 커피와 디저트.',
    menu: ['모모 라떼', '버터 휘낭시에', '디카페인 플랫화이트'],
    tone: '따뜻하고 담백한 동네 카페의 말투',
    reviewCount: 128,
  },
  {
    id: 'momo-seongsu',
    name: '모모커피 성수',
    category: '카페 · 디저트',
    neighborhood: '서울 성동구 성수동',
    address: '서울 성동구 연무장길 31',
    phone: '02-465-2307',
    hours: '매일 11:00 - 21:00',
    initials: 'S',
    accent: 'bg-[#b9d9cf]',
    description: '성수의 바쁜 하루에 잠시 머무는 커피 바.',
    menu: ['오트 크림 라떼', '에스프레소 토닉', '레몬 파운드'],
    tone: '활기차되 차분한 커피 바의 말투',
    reviewCount: 86,
  }
]
