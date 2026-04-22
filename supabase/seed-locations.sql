-- ============================================================
-- UNITED Real Estate — Location Hierarchy Seed
-- Run this in your Supabase SQL Editor (project fhzjupmmwmkaodnekxuo)
-- ============================================================

-- Step 0: Clean up old flat entries that don't fit the hierarchy
DELETE FROM locations WHERE slug IN (
  'new-capital', 'new-cairo', 'north-coast',
  'sheikh-zayed', '6th-october', 'el-alamein'
);

-- Step 1: Add temp columns for CSV ID linking
ALTER TABLE locations ADD COLUMN IF NOT EXISTS orig_id bigint;
ALTER TABLE locations ADD COLUMN IF NOT EXISTS orig_parent_id bigint;

-- Step 2: Insert all locations (ordered level 1 → 4)
INSERT INTO locations (name_en, name_ar, slug, level, orig_id, orig_parent_id) VALUES

-- ── Level 1: Country ──────────────────────────────────────
('Egypt', 'مصر', 'egypt', 1, 39, NULL),

-- ── Level 2: Governorates ─────────────────────────────────
('Cairo',          'القاهرة',                   'cairo',          2, 40,    39),
('Giza',           'الجيزة',                    'giza',           2, 41,    39),
('New Cairo',      'مدينة القاهرة الجديدة',     'new-cairo-gov',  2, 42,    39),
('6th of October', 'مدينة السادس من أكتوبر',    '6th-october-gov',2, 43,    39),
('Helwan',         'حلوان',                     'helwan-gov',     2, 44,    39),
('Suez',           'السويس',                    'suez',           2, 45,    39),
('Ismailia',       'الإسماعيلية',               'ismailia',       2, 46,    39),
('Port Said',      'بورسعيد',                   'port-said',      2, 47,    39),
('Damietta',       'دمياط',                     'damietta',       2, 48,    39),
('Mansoura',       'المنصورة',                  'mansoura',       2, 49,    39),
('Tanta',          'طنطا',                      'tanta',          2, 50,    39),
('Alexandria',     'الإسكندرية',                'alexandria-gov', 2, 51,    39),
('Kafr El-Sheikh', 'كفر الشيخ',                 'kafr-el-sheikh', 2, 52,    39),
('Beheira',        'البحيرة',                   'beheira',        2, 53,    39),
('Matrouh',        'مطروح',                     'matrouh',        2, 54,    39),
('Red Sea',        'البحر الأحمر',              'red-sea-gov',    2, 61,    39),
('Hurghada',       'الغردقة',                   'hurghada-gov',   2, 62,    39),
('Sharm El-Sheikh','شرم الشيخ',                 'sharm-gov',      2, 63,    39),
('Dahab',          'داهب',                      'dahab-gov',      2, 64,    39),
('Taba',           'طابا',                      'taba-gov',       2, 65,    39),
('Luxor',          'الأقصر',                    'luxor',          2, 66,    39),
('Aswan',          'أسوان',                     'aswan',          2, 67,    39),
('Qena',           'قنا',                       'qena',           2, 68,    39),
('Sohag',          'سوهاج',                     'sohag',          2, 69,    39),
('Asyut',          'أسيوط',                     'asyut',          2, 70,    39),
('Minya',          'المنيا',                    'minya',          2, 71,    39),
('Beni Suef',      'بني سويف',                  'beni-suef',      2, 72,    39),
('Fayoum',         'الفيوم',                    'fayoum',         2, 73,    39),
('Al Alamein',     'العالمين',                  'al-alamein-gov', 2, 60002, 39),

-- ── Level 3: Districts ────────────────────────────────────
('East Cairo',                  'شرق القاهرة',                    'east-cairo',           3, 30013, 40),
('West Cairo',                  'غرب القاهرة',                    'west-cairo',           3, 30014, 40),
('South Cairo',                 'جنوب القاهرة',                   'south-cairo',          3, 30015, 40),
('Giza Districts',              'الجيزة',                         'giza-districts',       3, 30016, 41),
('Sheikh Zayed & 6th October',  'الشيخ زايد والسادس من أكتوبر',  'sheikh-zayed-october', 3, 30017, 41),
('North Coast',                 'الساحل الشمالي',                 'north-coast',          3, 30018, 54),
('Alexandria Areas',            'الإسكندرية',                     'alexandria-areas',     3, 30019, 51),
('Red Sea Areas',               'البحر الأحمر',                   'red-sea-areas',        3, 30020, 61),
('South Sinai',                 'جنوب سيناء',                     'south-sinai',          3, 30021, 63),
('Ain Sokhna',                  'عين السخنة',                     'ain-sokhna-dist',      3, 30022, 45),

-- ── Level 4: Areas (East Cairo) ───────────────────────────
('New Administrative Capital', 'العاصمة الإدارية الجديدة', 'area-new-capital',       4, 30023, 30013),
('New Cairo',                  'القاهرة الجديدة',          'area-new-cairo',         4, 30024, 30013),
('Mostakbal City',             'مدينة المستقبل',           'area-mostakbal-city',    4, 30025, 30013),
('Shorouk City',               'مدينة الشروق',             'area-shorouk-city',      4, 30026, 30013),
('Badr City',                  'مدينة بدر',                'area-badr-city',         4, 30027, 30013),
('Obour City',                 'مدينة العبور',             'area-obour-city',        4, 30028, 30013),
('Madinaty',                   'مدينتي',                   'area-madinaty',          4, 30029, 30013),
('El Rehab City',              'مدينة الرحاب',             'area-el-rehab',          4, 30030, 30013),
('Katameya',                   'قطاميا',                   'area-katameya',          4, 30031, 30013),
('Fifth Settlement',           'التجمع الخامس',            'area-fifth-settlement',  4, 30032, 30013),
('Third Settlement',           'التجمع الثالث',            'area-third-settlement',  4, 30033, 30013),
('First Settlement',           'التجمع الأول',             'area-first-settlement',  4, 30034, 30013),
('Nasr City',                  'مدينة نصر',                'area-nasr-city',         4, 30035, 30013),
('Heliopolis',                 'مصر الجديدة',              'area-heliopolis',        4, 30036, 30013),
('Sixth Settlement',           'التجمع السادس',            'area-sixth-settlement',  4, 30122, 30013),

-- ── Level 4: Areas (West Cairo) ───────────────────────────
('Zamalek',       'الزمالك',    'area-zamalek',       4, 30040, 30014),
('Dokki',         'الدقي',      'area-dokki',         4, 30041, 30014),
('Mohandessin',   'المهندسين',  'area-mohandessin',   4, 30042, 30014),
('Agouza',        'العجوزة',    'area-agouza',        4, 30043, 30014),
('Imbaba',        'إمبابة',     'area-imbaba',        4, 30044, 30014),
('Boulaq',        'بولاق',      'area-boulaq',        4, 30045, 30014),
('Downtown Cairo','وسط البلد',  'area-downtown-cairo',4, 30046, 30014),
('Garden City',   'جاردن سيتي','area-garden-city',   4, 30047, 30014),

-- ── Level 4: Areas (South Cairo) ──────────────────────────
('Maadi',              'المعادي',          'area-maadi',           4, 30048, 30015),
('Zahraa El Maadi',    'زهراء المعادي',    'area-zahraa-el-maadi', 4, 30049, 30015),
('Degla',              'دجلة',             'area-degla',           4, 30050, 30015),
('Helwan Area',        'حلوان',            'area-helwan',          4, 30051, 30015),
('15th of May City',   'مدينة 15 مايو',   'area-may-city',        4, 30052, 30015),
('Katameya Heights',   'ارتفاعات قطاميا', 'area-katameya-heights',4, 30053, 30015),
('Uptown Cairo',       'أبتاون كايرو',    'area-uptown-cairo',    4, 30054, 30015),

-- ── Level 4: Areas (Giza) ─────────────────────────────────
('Giza City',       'مدينة الجيزة',  'area-giza-city',    4, 30055, 30016),
('Haram',           'الهرم',         'area-haram',         4, 30056, 30016),
('Faisal',          'فيصل',          'area-faisal',        4, 30057, 30016),
('Pyramids Area',   'منطقة الأهرامات','area-pyramids',     4, 30058, 30016),
('Hadayek El Ahram','حدائق الأهرامات','area-hadayek-ahram',4, 30059, 30016),
('Ard El Lewa',     'أرض اللواء',    'area-ard-el-lewa',   4, 30060, 30016),

-- ── Level 4: Areas (Sheikh Zayed & 6th October) ───────────
('Sheikh Zayed City',   'مدينة الشيخ زايد',          'area-sheikh-zayed-city',   4, 30061, 30017),
('Beverly Hills',       'بيفرلي هيلز',                'area-beverly-hills-sz',    4, 30062, 30017),
('Allegria',            'أليغريا',                    'area-allegria',            4, 30063, 30017),
('Westown',             'ويستاون',                    'area-westown',             4, 30064, 30017),
('6th October City',    'مدينة السادس من أكتوبر',    'area-sixth-october-city',  4, 30065, 30017),
('October Gardens',     'حدائق أكتوبر',               'area-october-gardens',     4, 30066, 30017),
('Hadayek October',     'حدائق أكتوبر الجديدة',      'area-hadayek-october',     4, 30067, 30017),
('Zayed Dunes',         'كثبان زايد',                 'area-zayed-dunes',         4, 30068, 30017),
('Palm Hills October',  'بالم هيلز أكتوبر',          'area-palm-hills-october',  4, 30069, 30017),
('Dreamland',           'دريم لاند',                  'area-dreamland',           4, 30070, 30017),

-- ── Level 4: Areas (North Coast) ──────────────────────────
('Sidi Abdel Rahman',  'سيدي عبد الرحمن',  'area-sidi-abdel-rahman', 4, 30071, 30018),
('Alamein',            'العلمين',           'area-alamein',           4, 30072, 30018),
('New Alamein',        'العلمين الجديدة',   'area-new-alamein',       4, 30073, 30018),
('Marsa Matrouh',      'مرسى مطروح',        'area-marsa-matrouh',     4, 30074, 30018),
('Ras El Hekma',       'رأس الحكمة',        'area-ras-el-hekma',      4, 30075, 30018),
('Hacienda Bay',       'هاسيندا باي',       'area-hacienda-bay',      4, 30076, 30018),
('Marassi',            'مراسي',             'area-marassi',           4, 30077, 30018),
('Sidi Heneish',       'سيدي حنيش',         'area-sidi-heneish',      4, 30078, 30018),
('Diplo',              'ديبلو',             'area-diplo',             4, 30079, 30018),
('Fouka Bay',          'فوكا باي',          'area-fouka-bay',         4, 30080, 30018),
('Amwaj',              'أمواج',             'area-amwaj',             4, 30081, 30018),
('Marina North Coast', 'مارينا',            'area-marina-nc',         4, 30082, 30018),
('Agami North Coast',  'العجمي',            'area-agami-nc',          4, 30083, 30018),

-- ── Level 4: Areas (Alexandria) ───────────────────────────
('Smouha',          'سموحة',        'area-smouha',        4, 30084, 30019),
('Gleem',           'جليم',         'area-gleem',         4, 30085, 30019),
('San Stefano',     'سان ستيفانو',  'area-san-stefano',   4, 30086, 30019),
('Roushdy',         'روشدي',        'area-roushdy',       4, 30087, 30019),
('Mandara',         'المندرة',      'area-mandara',       4, 30088, 30019),
('Montazah',        'المنتزه',      'area-montazah',      4, 30089, 30019),
('Sidi Bishr',      'سيدي بشر',     'area-sidi-bishr',    4, 30090, 30019),
('Miami Alexandria','ميامي',        'area-miami-alex',    4, 30091, 30019),
('Stanley',         'ستانلي',       'area-stanley',       4, 30092, 30019),
('Cleopatra',       'كليوباترا',    'area-cleopatra',     4, 30093, 30019),
('Ibrahimiya',      'إبراهيمية',    'area-ibrahimiya',    4, 30094, 30019),
('Moharam Bek',     'محرم بك',      'area-moharam-bek',   4, 30095, 30019),
('Sidi Gaber',      'سيدي جابر',    'area-sidi-gaber',    4, 30096, 30019),
('Agami Alexandria','العجمي',       'area-agami-alex',    4, 30097, 30019),
('Borg El Arab',    'برج العرب',    'area-borg-el-arab',  4, 30098, 30019),

-- ── Level 4: Areas (Red Sea) ──────────────────────────────
('Hurghada City',      'الغردقة',        'area-hurghada',          4, 30099, 30020),
('Hurghada Downtown',  'وسط الغردقة',   'area-hurghada-downtown', 4, 30100, 30020),
('Hurghada Marina',    'مارينا الغردقة','area-hurghada-marina',   4, 30101, 30020),
('Sahl Hasheesh',      'سهل حشيش',      'area-sahl-hasheesh',     4, 30102, 30020),
('El Gouna',           'الجونة',         'area-el-gouna',          4, 30103, 30020),
('Makadi Bay',         'مكادي باي',      'area-makadi-bay',        4, 30104, 30020),
('Soma Bay',           'سوما باي',       'area-soma-bay',          4, 30105, 30020),
('Safaga',             'سفاجا',          'area-safaga',            4, 30106, 30020),
('El Quseir',          'القصير',         'area-el-quseir',         4, 30107, 30020),
('Marsa Alam',         'مرسى علم',       'area-marsa-alam',        4, 30108, 30020),

-- ── Level 4: Areas (South Sinai) ──────────────────────────
('Sharm El-Sheikh City','شرم الشيخ',   'area-sharm-el-sheikh', 4, 30109, 30021),
('Naama Bay',           'نعمة باي',    'area-naama-bay',       4, 30110, 30021),
('Nabq Bay',            'نبق باي',     'area-nabq-bay',        4, 30111, 30021),
('Ras Nasrani',         'رأس نصراني',  'area-ras-nasrani',     4, 30112, 30021),
('Dahab City',          'دهب',         'area-dahab',           4, 30113, 30021),
('Nuweiba',             'نويبع',       'area-nuweiba',         4, 30114, 30021),
('Taba City',           'طابا',        'area-taba',            4, 30115, 30021),

-- ── Level 4: Areas (Ain Sokhna) ───────────────────────────
('Ain Sokhna',           'عين السخنة',        'area-ain-sokhna',      4, 30116, 30022),
('Galala City',          'مدينة الجلالة',     'area-galala-city',     4, 30117, 30022),
('Zafarana',             'الزعفرانة',         'area-zafarana',        4, 30118, 30022),
('Porto Sokhna',         'بورتو السخنة',      'area-porto-sokhna',    4, 30119, 30022),
('La Vista Sokhna',      'لا فيستا',          'area-la-vista-sokhna', 4, 30120, 30022),
('Mountain View Sokhna', 'ماونتن فيو السخنة', 'area-mv-sokhna',       4, 30121, 30022)

ON CONFLICT (slug) DO NOTHING;

-- Step 3: Link parent_id using orig_id mapping
UPDATE locations AS child
SET parent_id = parent.id
FROM locations AS parent
WHERE child.orig_parent_id = parent.orig_id
  AND child.parent_id IS NULL
  AND child.orig_parent_id IS NOT NULL;

-- Step 4: Remove temp columns
ALTER TABLE locations DROP COLUMN IF EXISTS orig_id;
ALTER TABLE locations DROP COLUMN IF EXISTS orig_parent_id;

-- Step 5: Add RLS policy for admin inserts (service role bypasses this anyway)
DROP POLICY IF EXISTS "Admin insert locations" ON locations;
CREATE POLICY "Admin insert locations" ON locations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin update locations" ON locations;
CREATE POLICY "Admin update locations" ON locations
  FOR UPDATE USING (true);

-- Done! Verify:
SELECT level, count(*) FROM locations GROUP BY level ORDER BY level;
