export interface priceDTO {
  avgPrice: number;
  date: Date;
  maxPrice: number;
  minPrice: number;
  unit: string;
  kindName?: string;
  rankName: string;
  region: string;
  tradeTypeName?: string;
  changeRate?: number;
}

export interface priceListDTO extends priceDTO {
  category: string;
  unitSz: string;
  itemName: string;
}

export interface productDTO extends priceDTO, priceListDTO {
  productId: bigint;
  preAvgPrice: number;
  changeRate: number;
  viewCount: number;
}

export interface UserJoinDTO {
  id: string;
  password: string;
  name: string;
  email?: string;
  userRegion?: string;
}

// prettier-ignore
export const REGIONS = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "수원", "성남", "고양", "용인", "강원", "춘천", "강릉", 
  "충북", "청주", "충남", "천안", "전북", "전주", "전남", "순천", 
  "경북", "포항", "안동", "경남", "창원", "김해", "제주", "전국"
];

// prettier-ignore
export const ANALYSIS_ITEMS = [
  "가지", "감자", "갓", "건고추", "경종배추", "고구마", "고사리", "고추", "곰취", "귤",
  "근대", "나물송이", "단호박", "당근", "당조고추", "대파", "더덕", "도라지", "돌나물", "동아",
  "딸기", "땅콩", "마", "마늘", "만가닥버섯", "망고", "매실", "머위", "멜론", "무",
  "미나리", "바나나", "방울토마토", "배", "배추", "백선버섯", "버섯", "번행초", "보리", "브로콜리",
  "블루베리", "비트", "사과", "산마늘", "상추", "생강", "샤인머스캣", "석류", "세발나물", "셀러리",
  "송이버섯", "수박", "순무", "시금치", "아로니아", "아스파라거스", "아욱", "아이순", "안찬", "알타리무",
  "애호박", "양배추", "양상추", "양파", "얼갈이배추", "연근", "열무", "엽경채류", "오렌지", "오이",
  "옥수수", "완두콩", "우엉", "울타리콩", "원추리", "유채", "음나무순", "참나물", "참외", "창출",
  "청경채", "치커리", "카라향", "토마토", "파프리카", "팽이버섯", "포도", "표고버섯", "피망", "한라봉",
  "호박", "홍고추", "황금팽이버섯"
];

export interface ProductAnalysisDetailDTO {
  productId: number;
  itemName: string;
  category: string;
  kindName?: string;
  unitSz?: string;
  unit?: string;
  avgPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  viewCount?: number;

  costEffectiveScore: number;
  priceVolatility: number;
  priceRiskLevel: string;
}
