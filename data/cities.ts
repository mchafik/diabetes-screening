export interface City {
  id: number;
  city: string;
  city_name_english: string;
  city_name_arabic: string;
  city_name_french: string;
}

export const LIST_OF_CITIES: City[] = [
  {
    id: 1,
    city: "BENSLIMANE",
    city_name_english: "Benslimane",
    city_name_arabic: "بن سليمان",
    city_name_french: "Benslimane"
  },
  {
    id: 2,
    city: "BERRECHID",
    city_name_english: "Berrechid",
    city_name_arabic: "برشيد",
    city_name_french: "Berrechid"
  },
  {
    id: 3,
    city: "CASABLANCA",
    city_name_english: "Casablanca",
    city_name_arabic: "الدار البيضاء",
    city_name_french: "Casablanca"
  },
  {
    id: 4,
    city: "FES",
    city_name_english: "Fez",
    city_name_arabic: "فاس",
    city_name_french: "Fès"
  },
  {
    id: 5,
    city: "IMINTANOUT",
    city_name_english: "Imintanoute",
    city_name_arabic: "إمنتانوت",
    city_name_french: "Imintanout"
  },
  {
    id: 6,
    city: "KENITRA",
    city_name_english: "Kénitra",
    city_name_arabic: "القنيطرة",
    city_name_french: "Kénitra"
  },
  {
    id: 7,
    city: "KHOURIBGA",
    city_name_english: "Khouribga",
    city_name_arabic: "خريبكة",
    city_name_french: "Khouribga"
  },
  {
    id: 8,
    city: "LARACH",
    city_name_english: "Larache",
    city_name_arabic: "العرائش",
    city_name_french: "Larache"
  },
  {
    id: 9,
    city: "MARAKECH",
    city_name_english: "Marrakech",
    city_name_arabic: "مراكش",
    city_name_french: "Marrakech"
  },
  {
    id: 10,
    city: "MEKNES",
    city_name_english: "Meknes",
    city_name_arabic: "مكناس",
    city_name_french: "Meknès"
  },
  {
    id: 11,
    city: "MOHAMMEDIA",
    city_name_english: "Mohammedia",
    city_name_arabic: "المحمدية",
    city_name_french: "Mohammédia"
  },
  {
    id: 12,
    city: "RABAT",
    city_name_english: "Rabat",
    city_name_arabic: "الرباط",
    city_name_french: "Rabat"
  },
  {
    id: 13,
    city: "SALE",
    city_name_english: "Salé",
    city_name_arabic: "سلا",
    city_name_french: "Salé"
  },
  {
    id: 14,
    city: "TANGER",
    city_name_english: "Tangier",
    city_name_arabic: "طنجة",
    city_name_french: "Tanger"
  },
  {
    id: 15,
    city: "TEMARA",
    city_name_english: "Témara",
    city_name_arabic: "تمارة",
    city_name_french: "Témara"
  },
  {
    id: 16,
    city: "TETOUAN",
    city_name_english: "Tétouan",
    city_name_arabic: "تطوان",
    city_name_french: "Tétouan"
  }
];

export const getCityName = (cityCode: string, language: 'en' | 'fr' | 'ar'): string => {
  const city = LIST_OF_CITIES.find(c => c.city === cityCode);
  if (!city) return cityCode;

  switch (language) {
    case 'ar':
      return city.city_name_arabic;
    case 'fr':
      return city.city_name_french;
    case 'en':
    default:
      return city.city_name_english;
  }
};
