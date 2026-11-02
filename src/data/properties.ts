import { Property } from '../types/property';

export const PROPERTIES: Property[] = [
  {
    id: 'azure-villa',
    title: 'The Azure Villa',
    titleAr: 'فيلا أزور الفاخرة',
    type: 'villa',
    price: 1850000,
    location: 'Coastal Heights, Malibu',
    locationAr: 'مرتفعات الساحل، ماليبو',
    city: 'Malibu',
    cityAr: 'ماليبو',
    beds: 4,
    baths: 3,
    sqft: 3450,
    tag: 'Featured',
    tagAr: 'مميز',
    image: '/src/assets/images/azure_villa_1793547682292.jpg',
    gallery: [
      '/src/assets/images/azure_villa_1793547682292.jpg',
      '/src/assets/images/hero_modern_villa_1793547681326.jpg',
      '/src/assets/images/lifestyle_home_interior_1793547682714.jpg'
    ],
    description: 'An architectural coastal masterpiece perched above crystal waters. The Azure Villa blends minimalist white geometries with panoramic ocean vistas, private infinity-edge swimming pool, heated sundeck, and floor-to-ceiling glass pavilions.',
    descriptionAr: 'تحفة معمارية ساحلية تطل على المياه الكريستالية. تجمع فيلا أزور بين الهندسة البسيطة والإطلالات البانورامية على المحيط، مع مسبح لا متناهي خاص، وتراس مشمس واسع، وجدران زجاجية ممتدة.',
    features: [
      'Private Oceanfront Infinity Pool',
      'Smart Climate & Lighting Automation',
      'Designer Italian Marble Kitchen',
      'Outdoor Kitchen & Fire Lounge',
      'Solar Microgrid Integration',
      'Double Gated Security'
    ],
    featuresAr: [
      'مسبح لا متناهي خاص بإطلالة على المحيط',
      'نظام ذكي للتحكم بالإضاءة والتكييف',
      'مطبخ بتشطيبات رخام إيطالي فاخر',
      'مطبخ خارجي ومنطقة موقد نار دافئ',
      'نظام ألواح شمسية متكامل',
      'بوابة أمنية مزدوجة على مدار الساعة'
    ],
    yearBuilt: 2024,
    agent: {
      name: 'Elena Vance',
      role: 'Principal Luxury Advisor',
      roleAr: 'مستشارة عقارات فاخرة',
      phone: '+1 (310) 849-2104',
      email: 'elena.vance@everlighthomes.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    floorPlan: {
      levels: 2,
      parkingSpaces: 3,
      hoaMonthly: 380
    }
  },
  {
    id: 'skyline-residences',
    title: 'Skyline Residences',
    titleAr: 'أبراج السكاي لاين',
    type: 'apartment',
    price: 1250000,
    location: 'Midtown East, Manhattan',
    locationAr: 'وسط المدينة، مانهاتن',
    city: 'New York',
    cityAr: 'نيويورك',
    beds: 3,
    baths: 2,
    sqft: 2100,
    tag: 'New Launch',
    tagAr: 'جديد وحصري',
    image: '/src/assets/images/skyline_residences_1793547682352.jpg',
    gallery: [
      '/src/assets/images/skyline_residences_1793547682352.jpg',
      '/src/assets/images/lifestyle_home_interior_1793547682714.jpg',
      '/src/assets/images/hero_modern_villa_1793547681326.jpg'
    ],
    description: 'Elevated urban living featuring commanding views of the bridge and illuminated metropolitan skyline. Features an expansive private terrace, custom acoustic insulation, private elevator foyer, and bespoke walnut cabinetry.',
    descriptionAr: 'حياة حضرية راقية بإطلالات استثنائية على أفق المدينة والجسور المضيئة. تضم شرفة خاصة واسعة، عزل صوتي متطور، مصعد خاص، وخزائن خشب الجوز المخصصة.',
    features: [
      'Wraparound Sunset Terrace',
      '24/7 White-Glove Doorman & Concierge',
      'Private Health & Wellness Spa',
      'Direct Elevator Key-Card Access',
      'Wine Cellar with Climate Control',
      'Automated Somfy Shades'
    ],
    featuresAr: [
      'شرفة بانورامية واسعة عند الغروب',
      'خدمة حراسة واستقبال فندقية 24/7',
      'نادي صحي وسبا خاص للسكان',
      'دخول مباشر بالمصعد الذكي',
      'غرفة خاصة لحفظ المشروبات بحرارة مضبوطة',
      'ستائر كهربائية آلية بالكامل'
    ],
    yearBuilt: 2025,
    agent: {
      name: 'Marcus Sterling',
      role: 'Metropolitan Specialist',
      roleAr: 'أخصائي العقارات الحضرية',
      phone: '+1 (212) 658-4491',
      email: 'marcus.sterling@everlighthomes.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
    },
    floorPlan: {
      levels: 1,
      parkingSpaces: 2,
      hoaMonthly: 620
    }
  },
  {
    id: 'serene-bungalow',
    title: 'Serene Bungalow',
    titleAr: 'بنغلو سيرين الهادئ',
    type: 'bungalow',
    price: 2400000,
    location: 'Whispering Pines, Aspen',
    locationAr: 'ويسبرينغ باينز، أسبن',
    city: 'Aspen',
    cityAr: 'أسبن',
    beds: 5,
    baths: 4,
    sqft: 4800,
    tag: 'Exclusive',
    tagAr: 'حصري ومميز',
    image: '/src/assets/images/serene_bungalow_1793547682872.jpg',
    gallery: [
      '/src/assets/images/serene_bungalow_1793547682872.jpg',
      '/src/assets/images/lifestyle_home_interior_1793547682714.jpg',
      '/src/assets/images/azure_villa_1793547682292.jpg'
    ],
    description: 'A harmonious blend of handcrafted timber, natural flagstone masonry, and lush botanical gardens. Offers sprawling cedar wrap-around porches, stone outdoor fireplace, cathedral exposed rafters, and heated garden flagstones.',
    descriptionAr: 'تناغم مذهل بين خشب الأرز المصنوع يدوياً، والحجر الطبيعي، والحدائق النباتية الغنّاء. يوفر شرفة خشبية محيطة، ومدفأة حجرية خارجية، وأسقف مرتفعة رائعة الجمال.',
    features: [
      'Mature Botanical English Gardens',
      'Heated Flagstone Pathways',
      'Dual Master Bedroom Suites',
      'Handcrafted Riverstone Fireplace',
      'Cedar Barrel Sauna & Cold Plunge',
      'Detached Artisan Studio'
    ],
    featuresAr: [
      'حدائق نباتية إنجليزية ناضجة',
      'ممرات حجرية مدفأة لمنع الجليد',
      'جناحان رئيسيان مستقلان',
      'مدفأة حجرية منحوتة يدوياً',
      'ساونا برميل الأرز مع حوض غمر بارد',
      'استوديو فني منفصل للعمل والإبداع'
    ],
    yearBuilt: 2023,
    agent: {
      name: 'Nora Lindqvist',
      role: 'Estate Architect & Partner',
      roleAr: 'مهندسة وشريكة عقارية',
      phone: '+1 (970) 319-8822',
      email: 'nora.lindqvist@everlighthomes.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
    },
    floorPlan: {
      levels: 2,
      parkingSpaces: 4,
      hoaMonthly: 210
    }
  },
  {
    id: 'glass-pavilion',
    title: 'The Glass Pavilion Estate',
    titleAr: 'قصر البافيليون الزجاجي',
    type: 'villa',
    price: 3650000,
    location: 'Beverly Crest, Los Angeles',
    locationAr: 'بيفرلي كريست، لوس أنجلوس',
    city: 'Los Angeles',
    cityAr: 'لوس أنجلوس',
    beds: 5,
    baths: 6,
    sqft: 6200,
    tag: 'Trophy Estate',
    tagAr: 'قصر استثنائي',
    image: '/src/assets/images/hero_modern_villa_1793547681326.jpg',
    gallery: [
      '/src/assets/images/hero_modern_villa_1793547681326.jpg',
      '/src/assets/images/lifestyle_home_interior_1793547682714.jpg',
      '/src/assets/images/azure_villa_1793547682292.jpg'
    ],
    description: 'An iconic architectural trophy home with 14-foot motorized glass curtain walls opening into an eighty-foot illuminated reflection pool. Positioned to capture sunset canyon views with ultimate privacy and museum-grade finishes.',
    descriptionAr: 'قصر معماري أيقوني يتميز بجدران زجاجية كهربائية بارتفاع 14 قدماً تنفتح على مسبح انعكاسي مضاء بطول 80 قدماً مع خصوصية مطلقة وإطلالات خلابة على الوادي.',
    features: [
      '80-Foot Reflection Infinity Pool',
      'Museum-Grade Ambient Lighting',
      'Underground 6-Car Gallery Garage',
      'Screening Room with Dolby Atmos',
      'Commercial Grade Bulthaup Kitchen',
      'Guard House with Biometric Access'
    ],
    featuresAr: [
      'مسبح انعكاسي بطول 80 قدماً',
      'إضاءة محيطية بمستوى صالات العرض الفنية',
      'مرآب صالة عرض تحت الأرض يتسع لـ 6 سيارات',
      'سينما منزلية بنظام صوت دولبي أتموس',
      'مطبخ تجاري ألماني فاخر Bulthaup',
      'غرفة حراسة مستقلة مع وصول بيومتري'
    ],
    yearBuilt: 2025,
    agent: {
      name: 'Elena Vance',
      role: 'Principal Luxury Advisor',
      roleAr: 'مستشارة عقارات فاخرة',
      phone: '+1 (310) 849-2104',
      email: 'elena.vance@everlighthomes.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    },
    floorPlan: {
      levels: 3,
      parkingSpaces: 6,
      hoaMonthly: 540
    }
  },
  {
    id: 'solaria-penthouse',
    title: 'Solaria Sky Penthouse',
    titleAr: 'بنتهاوس سولاريا الفاخر',
    type: 'penthouse',
    price: 2950000,
    location: 'Brickell Avenue, Miami',
    locationAr: 'شارع بريكل، ميامي',
    city: 'Miami',
    cityAr: 'ميامي',
    beds: 4,
    baths: 4,
    sqft: 3800,
    tag: 'Waterfront',
    tagAr: 'واجهة مائية',
    image: '/src/assets/images/skyline_residences_1793547682352.jpg',
    gallery: [
      '/src/assets/images/skyline_residences_1793547682352.jpg',
      '/src/assets/images/lifestyle_home_interior_1793547682714.jpg'
    ],
    description: 'Perched on the 48th floor overlooking Biscayne Bay, this penthouse features double-height 22-foot ceilings, a private rooftop plunge pool, floating sculptural staircase, and automated shades throughout.',
    descriptionAr: 'يتربع في الطابق 48 مطلاً على خليج بيسكاين، مع أسقف مضاعفة الارتفاع (22 قدماً)، ومسبح خاص على السطح، وسلم عائم منحوت، وستائر آلية بالكامل.',
    features: [
      'Private Rooftop Plunge Pool',
      'Private Yacht Marina Slip',
      'Custom Floating Oak Staircase',
      'Sub-Zero & Wolf Appliance Suite',
      'Direct Keyed High-Speed Elevators',
      'Valet & Private Chauffeur Service'
    ],
    featuresAr: [
      'مسبح غطس خاص على السطح',
      'مرسى خاص لليخوت في المارينا',
      'سلم عائم خشبي مصمم خصيصاً',
      'أجهزة مطبخ ألمانية متطورة Wolf & Sub-Zero',
      'مصاعد مشفرة فائقة السرعة',
      'خدمة صف سيارات وسائق خاص'
    ],
    yearBuilt: 2024,
    agent: {
      name: 'Marcus Sterling',
      role: 'Metropolitan Specialist',
      roleAr: 'أخصائي العقارات الحضرية',
      phone: '+1 (212) 658-4491',
      email: 'marcus.sterling@everlighthomes.com',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200'
    },
    floorPlan: {
      levels: 2,
      parkingSpaces: 3,
      hoaMonthly: 890
    }
  },
  {
    id: 'meadow-haven',
    title: 'Meadowbrook Natural Haven',
    titleAr: 'ملاذ ميدوبروك الريفي العصري',
    type: 'bungalow',
    price: 1450000,
    location: 'Sonoma Valley, California',
    locationAr: 'وادي سونوما، كاليفورنيا',
    city: 'Sonoma',
    cityAr: 'سونوما',
    beds: 3,
    baths: 3,
    sqft: 2850,
    tag: 'Eco-Living',
    tagAr: 'صديق للبيئة',
    image: '/src/assets/images/serene_bungalow_1793547682872.jpg',
    gallery: [
      '/src/assets/images/serene_bungalow_1793547682872.jpg',
      '/src/assets/images/lifestyle_home_interior_1793547682714.jpg'
    ],
    description: 'Surrounded by century-old olive groves and organic vineyards. Built using rammed earth, local redwood, and passive thermal regulation with zero net carbon footprint.',
    descriptionAr: 'محاط بكروم الزيتون العريقة ومزارع العنب العضوية. مبني بالتراب المدكوك وخشب السيكويا المحلي مع عزل حراري طبيعي وبصمة كربونية صفرية.',
    features: [
      'Private 2-Acre Olive Grove',
      'Geothermal Heating & Cooling',
      'Tesla Powerwall Solar Battery Storage',
      'Natural Chemical-Free Swimming Pond',
      'Artisan Wine Tasting Cellar',
      'Outdoor Pizza Oven & Herb Garden'
    ],
    featuresAr: [
      'بستان زيتون خاص بمساحة فدانين',
      'تدفئة وتبريد حراري أرضي طبيعي',
      'بطاريات تخزين الطاقة الشمسية تسلا',
      'بحيرة سباحة طبيعية خالية من الكيماويات',
      'قبو خاص لتذوق العصائر والمنتجات العضوية',
      'فرن بيتزا حجري وحديقة أعشاب عطرية'
    ],
    yearBuilt: 2024,
    agent: {
      name: 'Nora Lindqvist',
      role: 'Estate Architect & Partner',
      roleAr: 'مهندسة وشريكة عقارية',
      phone: '+1 (970) 319-8822',
      email: 'nora.lindqvist@everlighthomes.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200'
    },
    floorPlan: {
      levels: 1,
      parkingSpaces: 2,
      hoaMonthly: 120
    }
  }
];
