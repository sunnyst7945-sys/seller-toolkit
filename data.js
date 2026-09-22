/* =============================================================
 * HS 海关编码数据库（10 位中国海关税则编码，仅供参考）
 * 说明：编码依据《中华人民共和国进出口税则》（HS2022）整理，
 * 前 6 位为国际通用 HS 编码，第 7-8 位为中国税则细分，
 * 第 9-10 位为附加码（监管/统计用，常见 00/90）。
 * 实际申报请以中国海关最新税则为准。
 * 结构：HS_CHAPTERS = [{code: 2位章, cn, en}]
 *       HS_CODES = [{code: 10位, cn, en}]
 * ============================================================= */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    var d = factory();
    root.HS_CHAPTERS = d.HS_CHAPTERS;
    root.HS_CODES = d.HS_CODES;
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var HS_CHAPTERS = [
    { code: '01', cn: '活动物', en: 'Live animals' },
    { code: '02', cn: '肉及食用杂碎', en: 'Meat and edible meat offal' },
    { code: '03', cn: '鱼、甲壳动物、软体动物及其他水生无脊椎动物', en: 'Fish and crustaceans, molluscs and other aquatic invertebrates' },
    { code: '04', cn: '乳品；蛋品；天然蜂蜜；其他食用动物产品', en: 'Dairy produce; eggs; natural honey; edible products of animal origin' },
    { code: '05', cn: '其他动物产品', en: 'Products of animal origin, not elsewhere specified' },
    { code: '06', cn: '活树及其他活植物；鳞茎、根及类似品', en: 'Live trees and other plants; bulbs, roots and the like' },
    { code: '07', cn: '食用蔬菜、根及块茎', en: 'Edible vegetables and certain roots and tubers' },
    { code: '08', cn: '食用水果及坚果；柑橘属水果或甜瓜的果皮', en: 'Edible fruit and nuts; peel of citrus fruit or melons' },
    { code: '09', cn: '咖啡、茶、马黛茶及调味香料', en: 'Coffee, tea, maté and spices' },
    { code: '10', cn: '谷物', en: 'Cereals' },
    { code: '11', cn: '制粉工业产品；麦芽；淀粉；菊粉；面筋', en: 'Products of the milling industry; malt; starches; inulin; wheat gluten' },
    { code: '12', cn: '含油子仁及果实；杂项子仁及果实；工业用或药用植物；稻草、秸秆及饲料', en: 'Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit' },
    { code: '13', cn: '虫胶；树胶、树脂及其他植物液、汁', en: 'Lac; gums, resins and other vegetable saps and extracts' },
    { code: '14', cn: '编结用植物材料；其他植物产品', en: 'Vegetable plaiting materials; vegetable products not elsewhere specified' },
    { code: '15', cn: '动、植物油、脂及其分解产品；精制的食用油脂；动、植物蜡', en: 'Animal or vegetable fats and oils and their cleavage products' },
    { code: '16', cn: '肉、鱼、甲壳动物、软体动物及其他水生无脊椎动物的制品', en: 'Preparations of meat, fish, crustaceans, molluscs' },
    { code: '17', cn: '糖及糖食', en: 'Sugars and sugar confectionery' },
    { code: '18', cn: '可可及可可制品', en: 'Cocoa and cocoa preparations' },
    { code: '19', cn: '谷物、粮食粉、淀粉或乳的制品；糕饼点心', en: 'Preparations of cereals, flour, starch or milk; pastrycooks products' },
    { code: '20', cn: '蔬菜、水果、坚果或植物其他部分的制品', en: 'Preparations of vegetables, fruit, nuts or other parts of plants' },
    { code: '21', cn: '杂项食品', en: 'Miscellaneous edible preparations' },
    { code: '22', cn: '饮料、酒及醋', en: 'Beverages, spirits and vinegar' },
    { code: '23', cn: '食品工业的残渣及废料；配制的动物饲料', en: 'Residues and waste from the food industries; prepared animal fodder' },
    { code: '24', cn: '烟草及烟草代用品的制品', en: 'Tobacco and manufactured tobacco substitutes' },
    { code: '25', cn: '盐；硫磺；泥土及石料；石膏料、石灰及水泥', en: 'Salt; sulphur; earths and stone; plastering materials, lime and cement' },
    { code: '26', cn: '矿砂、矿渣及矿灰', en: 'Ores, slag and ash' },
    { code: '27', cn: '矿物燃料、矿物油及其蒸馏产品；沥青物质；矿物蜡', en: 'Mineral fuels, mineral oils and products of their distillation' },
    { code: '28', cn: '无机化学品；贵金属、稀土金属、放射性元素及其同位素的化合物', en: 'Inorganic chemicals; compounds of precious metals' },
    { code: '29', cn: '有机化学品', en: 'Organic chemicals' },
    { code: '30', cn: '药品', en: 'Pharmaceutical products' },
    { code: '31', cn: '肥料', en: 'Fertilisers' },
    { code: '32', cn: '鞣料浸膏及染料浸膏；染料、颜料及其他着色料；油漆及清漆', en: 'Tanning or dyeing extracts; dyes, pigments; paints and varnishes' },
    { code: '33', cn: '精油及香膏；芳香料制品及化妆盥洗品', en: 'Essential oils and resinoids; perfumery, cosmetic or toilet preparations' },
    { code: '34', cn: '肥皂、有机表面活性剂、洗涤剂、润滑剂、人造蜡', en: 'Soap, organic surface-active agents, washing preparations, lubricating preparations' },
    { code: '35', cn: '蛋白类物质；改性淀粉；胶；酶', en: 'Albuminoidal substances; modified starches; glues; enzymes' },
    { code: '36', cn: '炸药；烟火制品；火柴；引火合金', en: 'Explosives; pyrotechnic products; matches; pyrophoric alloys' },
    { code: '37', cn: '照相及电影用品', en: 'Photographic or cinematographic goods' },
    { code: '38', cn: '杂项化学产品', en: 'Miscellaneous chemical products' },
    { code: '39', cn: '塑料及其制品', en: 'Plastics and articles thereof' },
    { code: '40', cn: '橡胶及其制品', en: 'Rubber and articles thereof' },
    { code: '41', cn: '生皮（毛皮除外）及皮革', en: 'Raw hides and skins (other than furskins) and leather' },
    { code: '42', cn: '皮革制品；鞍具及挽具；旅行用品、手提包及类似容器', en: 'Articles of leather; saddlery and harness; travel goods, handbags' },
    { code: '43', cn: '毛皮、人造毛皮及其制品', en: 'Furskins and artificial fur; manufactures thereof' },
    { code: '44', cn: '木及木制品；木炭', en: 'Wood and articles of wood; wood charcoal' },
    { code: '45', cn: '软木及软木制品', en: 'Cork and articles of cork' },
    { code: '46', cn: '稻草、秸秆、针茅或其他编结材料制品；篮筐及柳条编结品', en: 'Manufactures of straw, esparto or other plaiting materials' },
    { code: '47', cn: '木浆或其他纤维状纤维素浆；回收（废碎）纸或纸板', en: 'Pulp of wood or other fibrous cellulosic material' },
    { code: '48', cn: '纸及纸板；纸浆、纸或纸板制品', en: 'Paper and paperboard; articles of paper pulp' },
    { code: '49', cn: '书籍、报纸、印刷图画及其他印刷品', en: 'Printed books, newspapers, pictures and other products of the printing industry' },
    { code: '50', cn: '蚕丝', en: 'Silk' },
    { code: '51', cn: '羊毛、动物细毛或粗毛；马毛纱线及其机织物', en: 'Wool, fine or coarse animal hair; horsehair yarn and woven fabric' },
    { code: '52', cn: '棉花', en: 'Cotton' },
    { code: '53', cn: '其他植物纺织纤维；纸纱线及其机织物', en: 'Other vegetable textile fibres; paper yarn' },
    { code: '54', cn: '化学纤维长丝', en: 'Man-made filaments' },
    { code: '55', cn: '化学纤维短纤', en: 'Man-made staple fibres' },
    { code: '56', cn: '絮胎、毡呢及无纺织物；特种纱线', en: 'Wadding, felt and nonwovens; special yarns' },
    { code: '57', cn: '地毯及纺织材料的其他铺地制品', en: 'Carpets and other textile floor coverings' },
    { code: '58', cn: '特种机织物；簇绒织物；花边；装饰毯', en: 'Special woven fabrics; tufted textile fabrics; lace' },
    { code: '59', cn: '浸渍、涂布、包覆或层压的纺织物', en: 'Impregnated, coated, covered or laminated textile fabrics' },
    { code: '60', cn: '针织物及钩编织物', en: 'Knitted or crocheted fabrics' },
    { code: '61', cn: '针织或钩编的服装及衣着附件', en: 'Articles of apparel and clothing accessories, knitted or crocheted' },
    { code: '62', cn: '非针织或非钩编的服装及衣着附件', en: 'Articles of apparel and clothing accessories, not knitted or crocheted' },
    { code: '63', cn: '其他纺织制成品；成套物品；旧衣着及旧纺织品', en: 'Other made up textile articles; sets' },
    { code: '64', cn: '鞋靴、护腿和类似品及其零件', en: 'Footwear, gaiters and the like; parts' },
    { code: '65', cn: '帽类及其零件', en: 'Headgear and parts thereof' },
    { code: '66', cn: '雨伞、阳伞、手杖、鞭子、马鞭及其零件', en: 'Umbrellas, sun umbrellas, walking-sticks' },
    { code: '67', cn: '已加工羽毛、羽绒及其制品；人造花；人发制品', en: 'Prepared feathers and down; artificial flowers; articles of human hair' },
    { code: '68', cn: '石料、石膏、水泥、石棉、云母及类似材料的制品', en: 'Articles of stone, plaster, cement, asbestos, mica' },
    { code: '69', cn: '陶瓷产品', en: 'Ceramic products' },
    { code: '70', cn: '玻璃及其制品', en: 'Glass and glassware' },
    { code: '71', cn: '天然或养殖珍珠、宝石或半宝石、贵金属、包贵金属及其制品；仿首饰', en: 'Pearls, precious stones, precious metals; imitation jewellery' },
    { code: '72', cn: '钢铁', en: 'Iron and steel' },
    { code: '73', cn: '钢铁制品', en: 'Articles of iron or steel' },
    { code: '74', cn: '铜及其制品', en: 'Copper and articles thereof' },
    { code: '75', cn: '镍及其制品', en: 'Nickel and articles thereof' },
    { code: '76', cn: '铝及其制品', en: 'Aluminium and articles thereof' },
    { code: '78', cn: '铅及其制品', en: 'Lead and articles thereof' },
    { code: '79', cn: '锌及其制品', en: 'Zinc and articles thereof' },
    { code: '80', cn: '锡及其制品', en: 'Tin and articles thereof' },
    { code: '81', cn: '其他贱金属、金属陶瓷及其制品', en: 'Other base metals; cermets; articles thereof' },
    { code: '82', cn: '贱金属工具、器具、利口器、餐匙、餐叉及其零件', en: 'Tools, implements, cutlery, spoons and forks, of base metal' },
    { code: '83', cn: '贱金属杂项制品', en: 'Miscellaneous articles of base metal' },
    { code: '84', cn: '核反应堆、锅炉、机器、机械器具及其零件', en: 'Nuclear reactors, boilers, machinery and mechanical appliances' },
    { code: '85', cn: '电机、电气设备及其零件', en: 'Electrical machinery and equipment and parts thereof' },
    { code: '86', cn: '铁道及电车道机车、车辆及其零件', en: 'Railway or tramway locomotives, rolling-stock and parts' },
    { code: '87', cn: '车辆及其零件、附件，但铁道及电车道车辆除外', en: 'Vehicles other than railway or tramway rolling-stock' },
    { code: '88', cn: '航空器、航天器及其零件', en: 'Aircraft, spacecraft, and parts thereof' },
    { code: '89', cn: '船舶及浮动结构体', en: 'Ships, boats and floating structures' },
    { code: '90', cn: '光学、照相、电影、计量、检验、医疗或外科用仪器及设备', en: 'Optical, photographic, cinematographic, measuring, checking, precision, medical instruments' },
    { code: '91', cn: '钟表及其零件', en: 'Clocks and watches and parts thereof' },
    { code: '92', cn: '乐器及其零件、附件', en: 'Musical instruments; parts and accessories' },
    { code: '93', cn: '武器、弹药及其零件、附件', en: 'Arms and ammunition; parts and accessories' },
    { code: '94', cn: '家具；寝具、褥垫、弹簧床垫、软坐垫及类似填充制品；灯具及照明装置', en: 'Furniture; bedding, mattresses; lamps and lighting fittings' },
    { code: '95', cn: '玩具、游戏品、运动用品及其零件、附件', en: 'Toys, games and sports requisites; parts and accessories' },
    { code: '96', cn: '杂项制品', en: 'Miscellaneous manufactured articles' },
    { code: '97', cn: '艺术品、收藏品及古物', en: 'Works of art, collectors pieces and antiques' }
  ];

  var HS_CODES = [
    // 第33章 香水/化妆品（8位税则号准确，附加码默认 00）
    { code: '3303000000', cn: '香水及花露水', en: 'Perfumes and toilet waters' },
    { code: '3304100000', cn: '唇用化妆品', en: 'Lip make-up preparations' },
    { code: '3304200000', cn: '眼用化妆品', en: 'Eye make-up preparations' },
    { code: '3304300000', cn: '指（趾）甲化妆品', en: 'Manicure or pedicure preparations' },
    { code: '3304910000', cn: '香粉，不论是否压紧', en: 'Powders, whether or not compressed' },
    { code: '3304990000', cn: '其他美容品或化妆品及护肤品（面霜、防晒等）', en: 'Other beauty or make-up preparations and skin care' },
    { code: '3305100000', cn: '洗发剂', en: 'Shampoos' },
    { code: '3305200000', cn: '烫发剂', en: 'Preparations for permanent waving or straightening' },
    { code: '3305300000', cn: '定型剂', en: 'Hair lacquers' },
    { code: '3305900000', cn: '其他护发品', en: 'Other preparations for use on the hair' },
    { code: '3306101000', cn: '洁齿品（牙膏）', en: 'Dentifrices (toothpaste)' },
    { code: '3306109000', cn: '其他洁齿品', en: 'Other dentifrices' },
    { code: '3307100000', cn: '剃须用制剂', en: 'Pre-shave, shaving or after-shave preparations' },
    { code: '3307200000', cn: '人体除臭剂及止汗剂', en: 'Personal deodorants and antiperspirants' },
    { code: '3307300000', cn: '香浴盐及其他沐浴用制剂', en: 'Perfumed bath salts and other bath preparations' },
    { code: '3307410000', cn: '室内散香或除臭制品', en: 'Preparations for perfuming or deodorising rooms' },
    { code: '3307490000', cn: '其他室内除臭制品', en: 'Other preparations for perfuming or deodorising rooms' },
    // 第34章 洗涤
    { code: '3401110000', cn: '盥洗用皂及有机表面活性产品（条状）', en: 'Soap and organic surface-active products, in bars, for toilet use' },
    { code: '3401200000', cn: '其他形状的肥皂', en: 'Soap in other forms' },
    { code: '3401300000', cn: '洁肤用有机表面活性产品及制剂（液体或膏状）', en: 'Organic surface-active products for washing the skin, liquid or cream' },
    { code: '3402500000', cn: '零售包装的洗涤剂及清洁制品', en: 'Washing and cleaning preparations, put up for retail sale' },
    // 第39章 塑料
    { code: '3923100000', cn: '塑料制盒、箱及类似品', en: 'Boxes, cases, crates of plastics' },
    { code: '3923300000', cn: '塑料制坛、瓶及类似品', en: 'Carboys, bottles, flasks of plastics' },
    { code: '3923500000', cn: '塑料制塞子、盖子及类似品', en: 'Stoppers, lids, caps of plastics' },
    { code: '3924900000', cn: '塑料制家庭及盥洗用具', en: 'Household and toilet articles of plastics' },
    { code: '3926909090', cn: '其他塑料制品', en: 'Other articles of plastics' },
    // 第42章 箱包
    { code: '4202129000', cn: '塑料或纺织材料作面的衣箱、手提箱', en: 'Trunks, suitcases with outer surface of plastics or textile materials' },
    { code: '4202210000', cn: '皮革、再生皮革或漆皮作面的手提包', en: 'Handbags with outer surface of leather' },
    { code: '4202220000', cn: '塑料片作面的手提包', en: 'Handbags with outer surface of plastic sheeting' },
    { code: '4202310000', cn: '皮革作面的钱包、钥匙包等', en: 'Articles carried in the pocket or handbag, leather' },
    { code: '4202320000', cn: '塑料片作面的钱包等', en: 'Articles carried in the pocket or handbag, plastic sheeting' },
    { code: '4202920000', cn: '塑料或纺织材料作面的其他容器（背包等）', en: 'Other containers with outer surface of plastics or textiles' },
    { code: '4203100000', cn: '皮革制衣服', en: 'Articles of apparel, of leather' },
    // 第61章 针织服装
    { code: '6109100000', cn: '棉制针织或钩编T恤衫、汗衫', en: 'T-shirts, singlets and other vests, of cotton, knitted' },
    { code: '6110200000', cn: '棉制针织或钩编套头衫、开襟衫', en: 'Sweaters, pullovers, cardigans of cotton, knitted' },
    { code: '6110300000', cn: '化学纤维制针织套头衫', en: 'Sweaters of man-made fibres, knitted' },
    { code: '6103430000', cn: '合成纤维制男式长裤（针织）', en: 'Men trousers of synthetic fibres, knitted' },
    { code: '6104620000', cn: '棉制女式长裤（针织）', en: 'Women trousers of cotton, knitted' },
    // 第62章 梭织服装
    { code: '6203420000', cn: '棉制男式长裤', en: 'Men trousers of cotton, not knitted' },
    { code: '6204620000', cn: '棉制女式长裤', en: 'Women trousers of cotton, not knitted' },
    { code: '6204430000', cn: '合成纤维制女式连衣裙', en: 'Women dresses of synthetic fibres, not knitted' },
    { code: '6205200000', cn: '棉制男式衬衫', en: 'Men shirts of cotton, not knitted' },
    { code: '6206300000', cn: '棉制女式衬衫', en: 'Women blouses of cotton, not knitted' },
    { code: '6212100000', cn: '胸罩', en: 'Brassieres' },
    // 第64章 鞋
    { code: '6402990000', cn: '其他橡胶或塑料制外底及鞋面的鞋靴', en: 'Other footwear with outer soles and uppers of rubber or plastics' },
    { code: '6403990000', cn: '其他橡胶/塑料或皮革外底、皮革鞋面的鞋靴', en: 'Other footwear with leather uppers' },
    { code: '6404110000', cn: '橡胶/塑料外底、纺织材料鞋面的运动鞋靴', en: 'Sports footwear; tennis shoes, textile uppers' },
    { code: '6404190000', cn: '橡胶/塑料外底、纺织材料鞋面的其他鞋靴', en: 'Other footwear with textile uppers' },
    // 第71章 首饰
    { code: '7113110000', cn: '银制首饰及其零件', en: 'Jewellery of silver' },
    { code: '7113190000', cn: '其他贵金属制首饰及其零件', en: 'Jewellery of other precious metal' },
    { code: '7117190000', cn: '贱金属制仿首饰', en: 'Imitation jewellery, of base metal' },
    { code: '7117900000', cn: '其他材料制仿首饰', en: 'Imitation jewellery, of other materials' },
    // 第73/76章 金属制品
    { code: '7323930000', cn: '不锈钢制餐桌、厨房或其他家用器具', en: 'Table, kitchen or household articles of stainless steel' },
    { code: '7615100000', cn: '铝制餐桌、厨房或其他家用器具', en: 'Table, kitchen or household articles of aluminium' },
    // 第82章 工具
    { code: '8211910000', cn: '刃面固定的餐刀', en: 'Table knives having fixed blades' },
    { code: '8212100000', cn: '剃刀', en: 'Razors' },
    // 第85章 电器（常用，8位税则号）
    { code: '8504401400', cn: '静止式变流器（充电器、电源适配器）', en: 'Static converters (chargers, power adapters)' },
    { code: '8507600000', cn: '锂离子蓄电池', en: 'Lithium-ion accumulators' },
    { code: '8517120000', cn: '蜂窝网络或其他无线网络的电话机（智能手机）', en: 'Telephones for cellular networks (smartphones)' },
    { code: '8518300000', cn: '耳机、耳塞及头戴受话器', en: 'Headphones and earphones' },
    { code: '8523510000', cn: '固态非易失性存储器件（U盘/存储卡）', en: 'Solid-state non-volatile storage devices' },
    { code: '8544421100', cn: '带接头的数据线、连接线', en: 'Electric conductors fitted with connectors' },
    // 第90章 光学
    { code: '9004100000', cn: '太阳镜', en: 'Sunglasses' },
    { code: '9004900000', cn: '其他眼镜、护目镜及类似品（含矫正眼镜）', en: 'Other spectacles, goggles and the like' },
    { code: '9019100000', cn: '按摩器具', en: 'Mechano-therapy appliances; massage apparatus' },
    // 第91章 钟表
    { code: '9102110000', cn: '机械手表（仅机械显示）', en: 'Wrist-watches, electrically operated, mechanical display' },
    { code: '9102120000', cn: '光电显示手表', en: 'Wrist-watches, electrically operated, opto-electronic display' },
    { code: '9102190000', cn: '其他电动手表', en: 'Other wrist-watches, electrically operated' },
    { code: '9105210000', cn: '电动挂钟', en: 'Wall clocks, electrically operated' },
    // 第94章 家具灯具
    { code: '9403200000', cn: '金属制其他家具', en: 'Other metal furniture' },
    { code: '9403300000', cn: '办公用木家具', en: 'Wooden furniture of a kind used in offices' },
    { code: '9403600000', cn: '其他木家具', en: 'Other wooden furniture' },
    { code: '9404900000', cn: '寝具及类似填充制品（枕头、靠垫）', en: 'Articles of bedding and similar furnishing' },
    { code: '9405190000', cn: '枝形吊灯及天花板或墙壁上的电气照明装置', en: 'Chandeliers and other electric ceiling or wall lighting fittings' },
    { code: '9405200000', cn: '电气的台灯、床头灯或落地灯', en: 'Electric table, desk, bedside or floor-standing lamps' },
    { code: '9405400000', cn: '其他电气灯具及照明装置（LED灯串等）', en: 'Other electric lamps and lighting fittings' },
    // 第95章 玩具运动
    { code: '9503000000', cn: '玩具（玩偶、积木、模型等）', en: 'Toys (dolls, building blocks, models)' },
    { code: '9504400000', cn: '扑克牌', en: 'Playing cards' },
    { code: '9504900000', cn: '其他游戏用品（桌游等）', en: 'Other games' },
    { code: '9506910000', cn: '健身器械（哑铃、跑步机等）', en: 'Articles and equipment for general physical exercise' },
    // 第96章 杂项
    { code: '9603210000', cn: '牙刷', en: 'Tooth brushes' },
    { code: '9603309090', cn: '化妆刷、粉扑及类似化妆用刷', en: 'Cosmetic brushes and pads' },
    { code: '9608100000', cn: '圆珠笔', en: 'Ball point pens' },
    { code: '9608200000', cn: '毡尖笔、荧光笔', en: 'Felt tipped and other porous-tipped pens and markers' },
    { code: '9609101000', cn: '铅笔及彩色铅笔', en: 'Pencils and crayons' },
    { code: '9615110000', cn: '硬质橡胶或塑料制梳子、发夹', en: 'Combs, hair-slides of hard rubber or plastics' },
    { code: '9616100000', cn: '香水喷雾器及类似盥洗喷雾器', en: 'Scent sprays and similar toilet sprays' },
    { code: '9617001100', cn: '保温瓶及其他真空容器', en: 'Vacuum flasks and other vacuum vessels' },
    { code: '9619000000', cn: '卫生巾、婴儿尿布等（卫生用品）', en: 'Sanitary towels, napkins and diapers' }
  ];

  return { HS_CHAPTERS: HS_CHAPTERS, HS_CODES: HS_CODES };
}));
