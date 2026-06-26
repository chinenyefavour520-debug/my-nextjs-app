-- seed-images.sql
-- Adds one primary image per product using Unsplash photos
-- Run: mysql -u root boutique_db < seed-images.sql

DELETE FROM product_images WHERE product_id >= 3;

INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES

-- ── HEELS (1-8) ──────────────────────────────────────────────────────────────
(1,  'https://images.unsplash.com/photo-1572804013309-59a88b8e9e8c?w=600', 1, 1),
(2,  'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', 1, 1),
(3,  'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600', 1, 1),
(4,  'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=600', 1, 1),
(5,  'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600', 1, 1),
(6,  'https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?w=600', 1, 1),
(7,  'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=600', 1, 1),
(8,  'https://images.unsplash.com/photo-1605812860427-4024433a70fd?w=600', 1, 1),

-- ── SNEAKERS (9-15) ──────────────────────────────────────────────────────────
(9,  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 1, 1),
(10, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600', 1, 1),
(11, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600', 1, 1),
(12, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600', 1, 1),
(13, 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=600', 1, 1),
(14, 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600', 1, 1),
(15, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600', 1, 1),

-- ── BOOTS (16-22) ────────────────────────────────────────────────────────────
(16, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600', 1, 1),
(17, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 1, 1),
(18, 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600', 1, 1),
(19, 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600', 1, 1),
(20, 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600', 1, 1),
(21, 'https://images.unsplash.com/photo-1611010344444-5f9e4d86a6e1?w=600', 1, 1),
(22, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600', 1, 1),

-- ── FLATS & SANDALS (23-27) ──────────────────────────────────────────────────
(23, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600', 1, 1),
(24, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600', 1, 1),
(25, 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600', 1, 1),
(26, 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=600', 1, 1),
(27, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600', 1, 1),

-- ── DRESSES (28-35) ──────────────────────────────────────────────────────────
(28, 'https://images.unsplash.com/photo-1572804013309-59a88b8e9e8c?w=600', 1, 1),
(29, 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600', 1, 1),
(30, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600', 1, 1),
(31, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600', 1, 1),
(32, 'https://images.unsplash.com/photo-1594938298603-c8148c4b4f7b?w=600', 1, 1),
(33, 'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=600', 1, 1),
(34, 'https://images.unsplash.com/photo-1548549557-dbe9946621da?w=600', 1, 1),
(35, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600', 1, 1),

-- ── TOPS & BLOUSES (36-43) ───────────────────────────────────────────────────
(36, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600', 1, 1),
(37, 'https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600', 1, 1),
(38, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600', 1, 1),
(39, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600', 1, 1),
(40, 'https://images.unsplash.com/photo-1551163943-3f7253a97e52?w=600', 1, 1),
(41, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600', 1, 1),
(42, 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600', 1, 1),
(43, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600', 1, 1),

-- ── PANTS & JEANS (44-50) ────────────────────────────────────────────────────
(44, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', 1, 1),
(45, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600', 1, 1),
(46, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600', 1, 1),
(47, 'https://images.unsplash.com/photo-1594938374182-a55e3c5e3b6e?w=600', 1, 1),
(48, 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600', 1, 1),
(49, 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600', 1, 1),
(50, 'https://images.unsplash.com/photo-1594938374182-a55e3c5e3b6e?w=600', 1, 1),

-- ── SKIRTS (51-54) ───────────────────────────────────────────────────────────
(51, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', 1, 1),
(52, 'https://images.unsplash.com/photo-1594938374182-a55e3c5e3b6e?w=600', 1, 1),
(53, 'https://images.unsplash.com/photo-1551163943-3f7253a97e52?w=600', 1, 1),
(54, 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600', 1, 1),

-- ── JACKETS (55-58) ──────────────────────────────────────────────────────────
(55, 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', 1, 1),
(56, 'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600', 1, 1),
(57, 'https://images.unsplash.com/photo-1594938374182-a55e3c5e3b6e?w=600', 1, 1),
(58, 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=600', 1, 1),

-- ── BAGS (59-78) ─────────────────────────────────────────────────────────────
(59, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 1, 1),
(60, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', 1, 1),
(61, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', 1, 1),
(62, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 1, 1),
(63, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600', 1, 1),
(64, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600', 1, 1),
(65, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600', 1, 1),
(66, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 1, 1),
(67, 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600', 1, 1),
(68, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 1, 1),
(69, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', 1, 1),
(70, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', 1, 1),
(71, 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600', 1, 1),
(72, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600', 1, 1),
(73, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 1, 1),
(74, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', 1, 1),
(75, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 1, 1),
(76, 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600', 1, 1),
(77, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', 1, 1),
(78, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600', 1, 1),

-- ── JEWELRY – NECKLACES (79-84) ──────────────────────────────────────────────
(79, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', 1, 1),
(80, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600', 1, 1),
(81, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600', 1, 1),
(82, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', 1, 1),
(83, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', 1, 1),
(84, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600', 1, 1),

-- ── JEWELRY – EARRINGS (85-90) ───────────────────────────────────────────────
(85, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600', 1, 1),
(86, 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600', 1, 1),
(87, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600', 1, 1),
(88, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600', 1, 1),
(89, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600', 1, 1),
(90, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', 1, 1),

-- ── JEWELRY – RINGS (91-95) ──────────────────────────────────────────────────
(91, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', 1, 1),
(92, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600', 1, 1),
(93, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600', 1, 1),
(94, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600', 1, 1),
(95, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600', 1, 1),

-- ── JEWELRY – BRACELETS & ANKLETS (96-100) ───────────────────────────────────
(96,  'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600', 1, 1),
(97,  'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600', 1, 1),
(98,  'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=600', 1, 1),
(99,  'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600', 1, 1),
(100, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', 1, 1),

-- ── HEADWEAR (101-110) ───────────────────────────────────────────────────────
(101, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600', 1, 1),
(102, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600', 1, 1),
(103, 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=600', 1, 1),
(104, 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=600', 1, 1),
(105, 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600', 1, 1),
(106, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600', 1, 1),
(107, 'https://images.unsplash.com/photo-1589571894960-20bbe2828d0a?w=600', 1, 1),
(108, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600', 1, 1),
(109, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600', 1, 1),
(110, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600', 1, 1),

-- ── CAPS (111-117) ───────────────────────────────────────────────────────────
(111, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600', 1, 1),
(112, 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600', 1, 1),
(113, 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600', 1, 1),
(114, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600', 1, 1),
(115, 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600', 1, 1),
(116, 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600', 1, 1),
(117, 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600', 1, 1),

-- ── BELTS (118-124) ──────────────────────────────────────────────────────────
(118, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 1, 1),
(119, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', 1, 1),
(120, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', 1, 1),
(121, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 1, 1),
(122, 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600', 1, 1),
(123, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600', 1, 1),
(124, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 1, 1);
