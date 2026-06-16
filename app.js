const canvas = document.querySelector("#worldMap");
const ctx = canvas.getContext("2d");

const els = {
  season: document.querySelector("#season"),
  year: document.querySelector("#year"),
  hint: document.querySelector("#mapHint"),
  tip: document.querySelector("#floatTip"),
  mapActionBubble: document.querySelector("#mapActionBubble"),
  sectName: document.querySelector("#sectName"),
  spiritStones: document.querySelector("#spiritStones"),
  grain: document.querySelector("#grain"),
  prestige: document.querySelector("#prestige"),
  power: document.querySelector("#power"),
  actionPoints: document.querySelector("#actionPoints"),
  turnMode: document.querySelector("#turnMode"),
  alchemyMats: document.querySelector("#alchemyMats"),
  forgingMats: document.querySelector("#forgingMats"),
  arrayMats: document.querySelector("#arrayMats"),
  daoPath: document.querySelector("#daoPath"),
  insight: document.querySelector("#insight"),
  barrierBar: document.querySelector("#barrierBar"),
  discipleCount: document.querySelector("#discipleCount"),
  disciples: document.querySelector("#disciples"),
  discipleDetailTitle: document.querySelector("#discipleDetailTitle"),
  discipleDetail: document.querySelector("#discipleDetail"),
  discipleActions: document.querySelector("#discipleActions"),
  inventoryCount: document.querySelector("#inventoryCount"),
  inventory: document.querySelector("#inventory"),
  workshopStatus: document.querySelector("#workshopStatus"),
  workshopDetail: document.querySelector("#workshopDetail"),
  workshopActions: document.querySelector("#workshopActions"),
  refreshStatus: document.querySelector("#refreshStatus"),
  recruitmentPool: document.querySelector("#recruitmentPool"),
  targetTitle: document.querySelector("#targetTitle"),
  targetDetail: document.querySelector("#targetDetail"),
  targetActions: document.querySelector("#targetActions"),
  log: document.querySelector("#log"),
  logCount: document.querySelector("#logCount"),
  nextYearBtn: document.querySelector("#nextYearBtn"),
  recruitBtn: document.querySelector("#recruitBtn"),
  raidBtn: document.querySelector("#raidBtn"),
  allyBtn: document.querySelector("#allyBtn"),
  tournamentBtn: document.querySelector("#tournamentBtn"),
  buildBtn: document.querySelector("#buildBtn"),
  researchBtn: document.querySelector("#researchBtn"),
  marketBtn: document.querySelector("#marketBtn"),
  saveBtn: document.querySelector("#saveBtn"),
  loadBtn: document.querySelector("#loadBtn"),
  guideBtn: document.querySelector("#guideBtn"),
  newGameBtn: document.querySelector("#newGameBtn"),
  refreshRecruitBtn: document.querySelector("#refreshRecruitBtn"),
  startPanel: document.querySelector("#startPanel"),
  startCollapseBtn: document.querySelector("#startCollapseBtn"),
  sectNameInput: document.querySelector("#sectNameInput"),
  randomNameBtn: document.querySelector("#randomNameBtn"),
  multiplayerToggle: document.querySelector("#multiplayerToggle"),
  roomPanel: document.querySelector("#roomPanel"),
  roomCodeInput: document.querySelector("#roomCodeInput"),
  roomConnectBtn: document.querySelector("#roomConnectBtn"),
  roomStatus: document.querySelector("#roomStatus"),
  roomCount: document.querySelector("#roomCount"),
  multiplayerLobby: document.querySelector("#multiplayerLobby"),
  lobbyBackBtn: document.querySelector("#lobbyBackBtn"),
  lobbyRoomCodeInput: document.querySelector("#lobbyRoomCodeInput"),
  lobbyConnectBtn: document.querySelector("#lobbyConnectBtn"),
  lobbyRoomStatus: document.querySelector("#lobbyRoomStatus"),
  lobbyRoomCount: document.querySelector("#lobbyRoomCount"),
  lobbyHostStatus: document.querySelector("#lobbyHostStatus"),
  lobbyPlayerList: document.querySelector("#lobbyPlayerList"),
  lobbyReadyBtn: document.querySelector("#lobbyReadyBtn"),
  lobbyStartBtn: document.querySelector("#lobbyStartBtn"),
  lobbyLoadBtn: document.querySelector("#lobbyLoadBtn"),
  lobbySaveSummary: document.querySelector("#lobbySaveSummary"),
  roomSummary: document.querySelector("#roomSummary"),
  roomPlayerList: document.querySelector("#roomPlayerList"),
  startScreen: document.querySelector("#startScreen"),
  appShell: document.querySelector("#appShell"),
  iconPicker: document.querySelector("#iconPicker"),
  equipmentSlots: document.querySelector("#equipmentSlots"),
  eventModal: document.querySelector("#eventModal"),
  modalKicker: document.querySelector("#modalKicker"),
  modalTitle: document.querySelector("#modalTitle"),
  modalProgress: document.querySelector("#modalProgress"),
  modalBody: document.querySelector("#modalBody"),
  modalActions: document.querySelector("#modalActions"),
  modalCloseBtn: document.querySelector("#modalCloseBtn"),
  waitingOverlay: document.querySelector("#waitingOverlay"),
  waitingText: document.querySelector("#waitingText"),
  otherReadyDot: document.querySelector("#otherReadyDot"),
  feedbackToast: document.querySelector("#feedbackToast"),
  questTitle: document.querySelector("#questTitle"),
  questDetail: document.querySelector("#questDetail"),
  mapTabs: document.querySelector("#mapTabs"),
};

const W = 1040;
const H = 680;
const worldMapImage = new Image();
worldMapImage.src = "./assets/world-map.jpeg";
worldMapImage.onload = () => renderMap();
const surnames = "云 清 玄 星 秦 洛 谢 沈 宁 陆 叶 温 江 白 林 顾 萧 苏 楚 柳 许 孟 方 韩 杜".split(" ");
const givenNames = "霁 衡 照 澜 岫 无咎 明河 惊春 观澜 不归 青蘅 扶桑 雪照 照夜 砚秋 听泉 问尘 逐月 归鸿 守拙 抱朴 临渊 见微 乘风".split(" ");
const sectNames = "玄岳宗 太微宫 沧澜剑院 赤霞门 玉京观 百炼山 丹鼎盟 星河阁 寒江殿 灵鹤谷".split(" ");
const realms = ["炼气", "筑基", "金丹", "元婴", "化神", "炼虚", "合体", "大乘", "渡劫", "真仙"];
const seasons = ["孟春", "仲夏", "白露", "霜降"];
const playerSectPrefixes = ["归元", "问道", "长明", "栖霞", "太初", "扶摇", "玄心", "鸣玉", "照夜", "青冥"];
const qualityNames = ["凡品", "良品", "上品", "极品", "地阶", "天阶"];
const gearQualityNames = ["白", "绿", "蓝", "紫", "红"];
const formationQualityNames = ["九品", "八品", "七品", "六品", "五品", "四品", "三品", "二品", "一品"];
const SAVE_KEY = "cultivation-sect-sim-save-v1";
const SAVE_SLOT_PREFIX = "cultivation-sect-sim-save-slot-v2-";
const SAVE_SLOT_COUNT = 3;
const ROOM_SAVE_PREFIX = "cultivation-sect-room-save-v1-";
const omens = [
  { name: "天降灵雨", text: "本年探索收益提升，探索时更容易获得丹材与机缘。", key: "exploreBonus" },
  { name: "剑星入命", text: "本年对战战力提升，掠夺与大比更容易取胜。", key: "battleBonus" },
  { name: "炉火大旺", text: "本年炼丹炼器品质判定提升，越阶概率增加。", key: "craftBonus" },
  { name: "山门齐心", text: "本年额外获得 1 点行动点。", key: "actionBonus" },
  { name: "商路开市", text: "本年建设与炼制灵石压力降低，年度收入增加。", key: "wealthBonus" },
  { name: "星斗入盘", text: "本年阵法推演更稳，驻守资源点防御提升。", key: "arrayBonus" },
  { name: "清心朗月", text: "本年心魔增长降低，渡劫失败率略降。", key: "mindCalm" },
  { name: "师道昌明", text: "本年羁绊与长老传承收益提升。", key: "legacyBonus" },
  { name: "暗香浮市", text: "本年市集行情更活跃，卖出收益略升。", key: "marketBonus" },
  { name: "仙盟来书", text: "本年仙盟声誉提升，会议与结盟更容易。", key: "councilFavor" },
  { name: "影网初成", text: "本年情报更准确，暗线破坏风险降低。", key: "intelBonus" },
  { name: "拍卖金帖", text: "本年更容易触发拍卖会，拍卖出价压力降低。", key: "auctionBonus" },
  { name: "地脉鼓荡", text: "本年资源点建设费用降低，产出略有提升。", key: "resourceBoom" },
  { name: "凶星照命", text: "本年风险事件更多，但战斗与探索隐藏收益提高。", key: "riskReward" },
  { name: "客卿云集", text: "本年候选弟子多一名，羁绊形成概率提高。", key: "guestBonus" },
  { name: "止戈令影", text: "本年敌宗袭扰概率下降，但掠夺收益降低。", key: "peaceOmen" },
  { name: "天炉回响", text: "本年炼丹炼器材料消耗压力略降。", key: "materialEase" },
  { name: "百工争鸣", text: "本年资源点、阵法、器方相关收益提升。", key: "craftGuild" },
  { name: "魔潮低语", text: "本年心魔事件概率提高，但成功压制会获得更强成长。", key: "demonRisk" },
  { name: "灵契萌生", text: "本年弟子更容易产生羁绊，羁绊弟子修行更快。", key: "bondBonus" },
];
const daoPaths = {
  sword: { name: "剑宗", text: "斗法、大比和攻伐成长更强。" },
  alchemy: { name: "丹宗", text: "炼丹、渡劫辅助和丹材收益更强。" },
  forging: { name: "器宗", text: "炼器、装备和器材收益更强。" },
  array: { name: "阵宗", text: "护山、防守和渡劫稳定性更强。" },
  wander: { name: "逍遥", text: "探索、机缘和随机事件收益更高。" },
};
const opportunityDeck = [
  {
    title: "石门后的呼吸声",
    intro: "石门半开，门后传来像潮水一样的呼吸。墙面刻着古篆：入者舍一念，得一缘。",
    choices: [
      { label: "焚香静听", test: "temper", reward: "insight", text: "弟子盘坐门前，听见自己的心跳与石门同频。片刻后，墙上古篆化为一段心法。" },
      { label: "强推石门", test: "atk", reward: "gear", text: "石门轰然洞开，尘封的兵刃从壁龛中滑落，仍带着未散的杀气。" },
      { label: "以血问路", test: "luck", reward: "rarePill", text: "一滴血落入门缝，门后呼吸骤停，随即吐出一枚温热丹丸。" },
      { label: "谨慎撤步", test: "def", reward: "safe", text: "弟子没有入门，只拓下门侧符痕，虽然收获较小，却避开了门后的吞魂阵。" },
    ],
  },
  {
    title: "倒悬药园",
    intro: "一片药园倒悬在山腹顶端，灵草根须垂落如雨。每一株草都在低声叫出不同弟子的名字。",
    choices: [
      { label: "采成熟灵草", test: "luck", reward: "alchemyMats", text: "弟子辨出真正成熟的灵草，避开那些以幻声诱人的毒株。" },
      { label: "连根移植", test: "aptitude", reward: "building", text: "弟子记下灵草根脉走向，带回可改良药田的种法。" },
      { label: "炼成现场丹", test: "alchemy", reward: "rarePill", text: "炉火临时升起，药香灌满山腹，一枚奇丹在掌中滴溜溜转动。" },
      { label: "听草木低语", test: "temper", reward: "disciple", text: "草木低语指向一名被困散修，其人已在药园中守候多年。" },
    ],
  },
  {
    title: "无字剑碑",
    intro: "剑碑无字，却让靠近者眼前浮现自己最害怕的一战。碑下有三道剑痕，仍在渗出冷光。",
    choices: [
      { label: "直面幻战", test: "atk", reward: "battleExp", text: "弟子踏入幻战，与另一个自己交锋百招，醒来时剑意更凝。" },
      { label: "参悟剑痕", test: "aptitude", reward: "manual", text: "无字碑并非无字，只是字藏在三道剑痕的转折中。" },
      { label: "绕碑布阵", test: "def", reward: "barrier", text: "弟子没有拔剑，而是沿碑布下小阵，将剑意引回护山阵图。" },
      { label: "赌一线灵光", test: "luck", reward: "gear", text: "弟子闭眼伸手，竟从碑影里拔出一截断剑。" },
    ],
  },
  {
    title: "河底仙市",
    intro: "夜半河水分开，河底出现一条灯火长街。摊主皆无面，只收故事、寿数与灵石。",
    choices: [
      { label: "用灵石交易", test: "charm", reward: "market", text: "无面摊主收下灵石，递出一只木匣，匣中有市面难见的材料。" },
      { label: "讲宗门旧事", test: "temper", reward: "prestige", text: "摊主们听完旧事，整条长街向本宗方向拱手一礼。" },
      { label: "赌盲盒木匣", test: "luck", reward: "random", text: "弟子随手选中一只破木匣，打开时河底灯火全部熄灭。" },
      { label: "追问仙市来历", test: "aptitude", reward: "insight", text: "无面摊主沉默许久，写下一段关于旧纪元商路的残章。" },
    ],
  },
  {
    title: "雷池边的婴啼",
    intro: "雷池中央传来婴孩哭声，池边却没有脚印。每一声哭，都让弟子体内灵力震荡。",
    choices: [
      { label: "入池救人", test: "hp", reward: "trib", text: "弟子踏入雷池，才发现哭声来自一枚雷纹丹胚。" },
      { label: "引雷淬体", test: "def", reward: "body", text: "雷光入骨，痛彻心神，但体魄因此被重新锤炼。" },
      { label: "以阵封池", test: "temper", reward: "barrier", text: "弟子稳住心神，把雷池引为护山阵的一处雷眼。" },
      { label: "远观记形", test: "luck", reward: "safe", text: "弟子没有冒进，只记下雷纹变化，带回一份渡劫心得。" },
    ],
  },
  {
    title: "梦中祖师",
    intro: "选中弟子梦见一位自称祖师的人，对方说本宗曾欠他一场因果，如今可以偿还，也可以赖掉。",
    choices: [
      { label: "承认因果", test: "temper", reward: "dao", text: "弟子叩首承因，醒来后识海中多出一盏不灭心灯。" },
      { label: "追问证据", test: "aptitude", reward: "insight", text: "祖师大笑，丢下一卷账册。账册每一页都是残缺功法。" },
      { label: "拔剑斩梦", test: "atk", reward: "battleExp", text: "梦境被剑光劈开，祖师影子碎成漫天剑砂。" },
      { label: "装作没醒", test: "luck", reward: "random", text: "弟子继续装睡，祖师等得不耐烦，竟把一枚旧物塞进枕下。" },
    ],
  },
  {
    title: "白骨莲台",
    intro: "一座莲台浮在枯骨堆上，莲瓣洁白无尘。每靠近一步，弟子耳边就多出一声陌生人的忏悔。",
    choices: [
      { label: "替亡者立碑", test: "temper", reward: "prestige", text: "弟子收拢枯骨立下无名碑，莲台上的怨气一点点散开。" },
      { label: "摘取白莲", test: "luck", reward: "rarePill", text: "白莲离台时没有枯萎，反而凝成一枚带寒香的丹。" },
      { label: "审视骨纹", test: "aptitude", reward: "dao", text: "枯骨并非乱葬，而是一套以身为阵的古法残篇。" },
      { label: "斩破莲台", test: "atk", reward: "gear", text: "莲台碎裂，台心藏着一柄被怨念封住的短刃。" },
    ],
  },
  {
    title: "天外残舟",
    intro: "一截残破飞舟插在山壁中，船舱里没有尸体，只有一面仍在转动的星盘。",
    choices: [
      { label: "修复星盘", test: "aptitude", reward: "insight", text: "星盘重新转动，映出数条早已断绝的古航路。" },
      { label: "拆取舟骨", test: "def", reward: "gear", text: "舟骨坚韧如龙筋，拆下后可作为炼器主材。" },
      { label: "追随星光", test: "luck", reward: "random", text: "星光落到远处一块不起眼的石头上，石中竟有洞天。" },
      { label: "封存残舟", test: "temper", reward: "barrier", text: "弟子以符封舟，残舟成为护山大阵的一枚星锚。" },
    ],
  },
  {
    title: "镜湖问影",
    intro: "湖面如镜，倒影却比本人慢半拍。倒影开口问：你想要现在的力量，还是未来的可能？",
    choices: [
      { label: "索取现在", test: "atk", reward: "battleExp", text: "倒影碎成光屑，涌入弟子经脉，带来短促而猛烈的力量。" },
      { label: "押注未来", test: "aptitude", reward: "dao", text: "倒影沉入湖底，留下一枚种子般的灵光。" },
      { label: "与影对坐", test: "temper", reward: "insight", text: "人与影相对无言，直到湖面泛起第一道晨光。" },
      { label: "让气运决定", test: "luck", reward: "random", text: "弟子闭眼抛出一枚石子，涟漪替他做出了选择。" },
    ],
  },
  {
    title: "赤蛇守炉",
    intro: "废弃丹房中央盘着一条赤蛇，它的鳞片像烧红的丹砂。炉中还有未熄的余火。",
    choices: [
      { label: "以丹香安抚", test: "alchemy", reward: "rarePill", text: "赤蛇嗅到丹香，缓缓让开炉口，炉中余火重新凝丹。" },
      { label: "夺炉而走", test: "atk", reward: "alchemyMats", text: "弟子强行夺炉，赤蛇怒啸，丹房震落大片火砂。" },
      { label: "观察火候", test: "aptitude", reward: "insight", text: "赤蛇吐息暗合火候变化，弟子记下一套控火诀。" },
      { label: "放蛇归山", test: "temper", reward: "disciple", text: "赤蛇离去前吐出一枚蛇蜕，蛇蜕中裹着一名昏迷散修。" },
    ],
  },
  {
    title: "旧王陵寝",
    intro: "地下陵寝中，石俑排成朝会阵列。王座上没有王，只有一枚还在跳动的玉玺。",
    choices: [
      { label: "取玉玺", test: "luck", reward: "prestige", text: "玉玺入手，石俑齐齐低头，仿佛承认了新的山门气数。" },
      { label: "破石俑阵", test: "atk", reward: "gear", text: "石俑阵被击碎，核心机关吐出一件古器。" },
      { label: "读王朝碑", test: "aptitude", reward: "insight", text: "碑文记载一个宗门兴衰循环，读来让人心中发凉。" },
      { label: "祭拜无名王", test: "temper", reward: "barrier", text: "弟子行礼后，陵寝阴风转暖，一缕王朝残运汇入护山阵。" },
    ],
  },
  {
    title: "风雪客栈",
    intro: "山中忽起大雪，雪里出现一间灯火客栈。掌柜说：住一晚，只收一个秘密。",
    choices: [
      { label: "说出宗门秘密", test: "charm", reward: "market", text: "掌柜听完秘密，递出一封写给仙市故人的介绍信。" },
      { label: "编一个假秘密", test: "luck", reward: "random", text: "掌柜笑而不语，似乎假话也能在此地变成真。" },
      { label: "留宿悟雪", test: "temper", reward: "dao", text: "弟子在窗前看了一夜风雪，醒来时心境清明。" },
      { label: "拒住赶路", test: "def", reward: "safe", text: "弟子没有入栈，却在雪地里捡到前人遗落的路引。" },
    ],
  },
];

const materialOpportunityDeck = [
  {
    title: "万药秘圃",
    intro: "雾气散开，一座被藤锁住的药圃露出半角。每一株灵药旁都立着无字木牌，像是在等弟子自己认出药性。",
    choices: [
      { label: "按药性分畦采摘", test: "alchemy", reward: "alchemyMats", text: "弟子先辨寒热，再分君臣佐使，只取药力将满未溢的一批。" },
      { label: "循露水找主药", test: "luck", reward: "alchemyMats", text: "晨露像银线一样流向药圃深处，弟子沿线找到真正的主药。" },
      { label: "誊写残缺药谱", test: "aptitude", reward: "dao", text: "药谱缺页极多，但其中几味药的配伍法足以补全宗门丹道理解。" },
      { label: "封圃不贪", test: "temper", reward: "safe", text: "弟子只取外围药泥与露水，避开药圃深处那股过分甜腻的香气。" },
    ],
  },
];

const worldAdventureThemes = [
  { name: "归墟浮城", place: "沉入云海的旧仙城", relic: "归墟玉册", threat: "无面城主", lure: "失落道统", tone: "城墙在云层里缓缓翻身，像一头醒来的巨兽。" },
  { name: "烛龙眠渊", place: "永夜裂谷下的龙骨河", relic: "烛龙逆鳞", threat: "梦中龙息", lure: "逆命灵髓", tone: "天光在谷口断成两截，谷底却有赤金色潮汐起伏。" },
  { name: "太虚残局", place: "星砂覆盖的棋盘荒原", relic: "太虚棋子", threat: "执棋天魔", lure: "推演天机", tone: "每一步都踩在棋格上，远处有人替众生落子。" },
  { name: "万劫药陵", place: "会呼吸的地下药陵", relic: "万劫青莲", threat: "药傀祖师", lure: "起死回生的丹方", tone: "泥土里传来心跳，药香浓得像能让人忘记姓名。" },
  { name: "白骨仙渡", place: "横跨冥河的白骨渡口", relic: "渡魂灯", threat: "摆渡阴君", lure: "亡者秘闻", tone: "河面没有倒影，只有无数没说完的誓言在水下游动。" },
  { name: "九霄器冢", place: "雷云托举的古代器冢", relic: "九霄炉心", threat: "失控天兵", lure: "天阶法器胚", tone: "残破兵刃插满云层，雷声像铁匠铺的锤音。" },
];

const worldAdventureStages = [
  {
    title: "入界",
    intro: (t, d) => `${d.name}随诸宗弟子踏入${t.place}。${t.tone}入口处有六道痕迹同时亮起，似乎第一步就会决定整段旅途的方向。`,
    choices: [
      { label: "先刻宗门暗记", stat: "temper", risk: 2, death: 1, gain: 7, tag: "steady", success: "暗记与地脉共鸣，后路被稳稳钉住。", fail: "暗记被地脉吞没，心神一阵发寒。" },
      { label: "抢先越过界碑", stat: "speed", risk: 5, death: 4, gain: 12, tag: "bold", success: "身法快过界风，抢到第一缕界内灵机。", fail: "界风割裂衣袍，血珠悬在空中不落。" },
      { label: "观察其他宗门", stat: "charm", risk: 1, death: 0, gain: 5, tag: "social", success: "几名外宗弟子露出破绽，路线情报到手。", fail: "外宗弟子反而盯上了本宗印记。" },
      { label: "拾取门槛碎光", stat: "luck", risk: 4, death: 3, gain: 11, tag: "greed", success: "碎光化作一枚临时护符，藏入袖中。", fail: "碎光里藏着旧咒，指尖浮起黑线。" },
      { label: "以护身阵缓入", stat: "def", risk: 1, death: 0, gain: 6, tag: "guard", success: "护身阵挡住第一波界压。", fail: "阵纹被磨损，灵力损耗加重。" },
      { label: "诵读开界古语", stat: "aptitude", risk: 3, death: 1, gain: 10, tag: "insight", success: "古语回应，显出一条被尘封的小径。", fail: "读音错了一拍，入口猛然收窄。" },
    ],
  },
  {
    title: "第一夜",
    intro: (t) => `夜色落入${t.name}，所有火光都朝同一个方向倾斜。远处传来${t.threat}的低语，队伍必须决定如何过夜。`,
    choices: [
      { label: "守夜不眠", stat: "temper", risk: 2, death: 1, gain: 8, tag: "steady", success: "漫长守夜换来一份危险预兆。", fail: "疲惫钻入骨缝，反应慢了半拍。" },
      { label: "潜入黑暗探路", stat: "speed", risk: 6, death: 6, gain: 15, tag: "bold", success: "黑暗中找到一处捷径与暗藏灵材。", fail: "黑暗里伸出手，差点将魂魄拖走。" },
      { label: "与外宗交换情报", stat: "charm", risk: 2, death: 1, gain: 9, tag: "social", success: "一段路线换来另一段禁忌。", fail: "交易里混入假消息。" },
      { label: "独吞夜露灵珠", stat: "luck", risk: 7, death: 5, gain: 17, tag: "greed", success: "夜露灵珠入口，灵台清明。", fail: "灵珠里有梦魇虫，腹中一阵绞痛。" },
      { label: "布下拒魂阵", stat: "def", risk: 1, death: 0, gain: 7, tag: "guard", success: "拒魂阵护住营地，众人平安过夜。", fail: "阵脚被风吹乱，护符裂开。" },
      { label: "追问低语来源", stat: "aptitude", risk: 4, death: 3, gain: 13, tag: "insight", success: "低语被拆成可理解的古老警告。", fail: "低语反问真名，神魂震荡。" },
    ],
  },
  {
    title: "岔路",
    intro: (t) => `前方出现六条岔路：一条通往${t.relic}的传说，一条像活物的喉咙，其余道路都刻着不同宗门的败笔。`,
    choices: [
      { label: "走最平整的石道", stat: "def", risk: 2, death: 1, gain: 7, tag: "guard", success: "石道虽慢，却避开两处杀阵。", fail: "石道尽头塌陷，退路被封一截。" },
      { label: "追随灵机最盛处", stat: "aptitude", risk: 4, death: 2, gain: 13, tag: "insight", success: "灵机尽头藏着一段残缺心法。", fail: "灵机是假，诱人误入回环。" },
      { label: "抄近路翻过断崖", stat: "speed", risk: 7, death: 8, gain: 18, tag: "bold", success: "断崖后是无人踏足的宝地。", fail: "脚下岩层忽然化灰，险些坠入无底处。" },
      { label: "让气运决定方向", stat: "luck", risk: 5, death: 4, gain: 16, tag: "fate", success: "随手一指竟避开最凶的一线。", fail: "气运摇摆，被卷入旧日幻象。" },
      { label: "说服外宗同行", stat: "charm", risk: 3, death: 1, gain: 10, tag: "social", success: "同行者分担了探路风险。", fail: "同行者暗中留下牵制符。" },
      { label: "独自寻找旁门", stat: "temper", risk: 5, death: 3, gain: 14, tag: "loner", success: "旁门无人争抢，收获清净。", fail: "孤身时更容易听见心魔。" },
    ],
  },
  {
    title: "旧誓",
    intro: (t) => `一面残墙写满旧誓，触碰者会看见自己最想得到的${t.lure}。墙下有枯骨，手里仍攥着未寄出的信。`,
    choices: [
      { label: "替枯骨完成遗愿", stat: "temper", risk: 2, death: 0, gain: 10, tag: "mercy", success: "旧誓散去，枯骨让出一枚温热印记。", fail: "遗愿太重，心头压上一层阴影。" },
      { label: "撕下残墙符文", stat: "atk", risk: 7, death: 6, gain: 18, tag: "greed", success: "符文化作可带走的秘纹。", fail: "残墙反震，血从眼角流下。" },
      { label: "只拓印不触碰", stat: "aptitude", risk: 2, death: 1, gain: 9, tag: "insight", success: "拓印保留了关键线索。", fail: "墨迹自行改写，真假难辨。" },
      { label: "当众分享旧誓", stat: "charm", risk: 3, death: 1, gain: 11, tag: "social", success: "诸宗短暂放下敌意，交换所得。", fail: "有人借机记下你的弱点。" },
      { label: "以阵封存残墙", stat: "def", risk: 1, death: 0, gain: 8, tag: "guard", success: "残墙危险被封住，后续道路更稳。", fail: "阵法只能撑片刻。" },
      { label: "对旧誓发问", stat: "luck", risk: 5, death: 5, gain: 16, tag: "fate", success: "旧誓回答了一个不该知道的问题。", fail: "旧誓要求以寿元作答。" },
    ],
  },
  {
    title: "追猎",
    intro: (t) => `${t.threat}终于显形，像影子一样贴着队伍行走。它不急着杀人，只在每个人耳边说出不同的价码。`,
    choices: [
      { label: "正面斩影", stat: "atk", risk: 7, death: 8, gain: 20, tag: "bold", success: "影子被斩开一线，露出核心碎片。", fail: "剑锋穿影而过，反被影子贴上脊背。" },
      { label: "以守代攻", stat: "def", risk: 3, death: 2, gain: 10, tag: "guard", success: "守势耗尽影子的耐心。", fail: "守得太久，队伍士气低落。" },
      { label: "诱它说出价码", stat: "charm", risk: 4, death: 3, gain: 13, tag: "social", success: "价码暴露了它的执念。", fail: "一句话被它抓住，成了契约缝隙。" },
      { label: "借地形逃脱", stat: "speed", risk: 5, death: 4, gain: 14, tag: "bold", success: "疾行穿过险地，影子被甩在阵后。", fail: "逃路太急，失足撞入暗坑。" },
      { label: "用气运赌空隙", stat: "luck", risk: 6, death: 6, gain: 19, tag: "fate", success: "最危险的一瞬偏偏留出空隙。", fail: "气运没有回应，影子贴近喉间。" },
      { label: "静坐不回应", stat: "temper", risk: 3, death: 2, gain: 12, tag: "steady", success: "沉默让诱惑无处落脚。", fail: "沉默中杂念反而变大。" },
    ],
  },
  {
    title: "祭坛",
    intro: (t) => `中央祭坛浮起${t.relic}的虚影。祭坛要求献上一样东西：血、记忆、法器、机会、善念，或一个谎言。`,
    choices: [
      { label: "献一滴心头血", stat: "hp", risk: 7, death: 7, gain: 21, tag: "blood", success: "心头血点亮祭坛核心。", fail: "祭坛贪得无厌，血线被拉长。" },
      { label: "献一段痛苦记忆", stat: "temper", risk: 4, death: 2, gain: 15, tag: "steady", success: "记忆离身，步伐反而轻了。", fail: "记忆碎裂，梦中不断复现。" },
      { label: "献临时护符", stat: "def", risk: 2, death: 1, gain: 11, tag: "guard", success: "护符替你承受祭坛审视。", fail: "护符不够，祭坛留下裂纹印。" },
      { label: "献一个谎言", stat: "charm", risk: 6, death: 4, gain: 17, tag: "trick", success: "祭坛竟信了谎言，吐出隐秘通道。", fail: "谎言被拆穿，舌尖发麻。" },
      { label: "献放弃宝物的机会", stat: "luck", risk: 3, death: 1, gain: 14, tag: "fate", success: "放弃之处反生福缘。", fail: "机会消失，却没有补偿。" },
      { label: "献一道善念", stat: "aptitude", risk: 2, death: 0, gain: 13, tag: "mercy", success: "善念在祭坛上开出微光。", fail: "善念被祭坛冷冷吞下。" },
    ],
  },
  {
    title: "镜湖",
    intro: (t, d) => `${d.name}来到一片镜湖。湖中倒影不是自己，而是十年后的宗门。倒影伸手，要交换一个未来。`,
    choices: [
      { label: "交换修为捷径", stat: "luck", risk: 7, death: 6, gain: 21, tag: "greed", success: "倒影交出一缕未来修为。", fail: "未来反噬，现在的经脉裂开。" },
      { label: "询问宗门灾厄", stat: "aptitude", risk: 3, death: 1, gain: 14, tag: "insight", success: "湖面显出一场将至的危机。", fail: "画面太乱，只留下头痛。" },
      { label: "拒绝交换", stat: "temper", risk: 1, death: 0, gain: 9, tag: "steady", success: "拒绝本身成为一道护心印。", fail: "倒影冷笑，湖水变黑。" },
      { label: "击碎倒影", stat: "atk", risk: 6, death: 5, gain: 18, tag: "bold", success: "碎影中落出未来残片。", fail: "倒影碎成千万个敌人。" },
      { label: "用阵纹隔湖问答", stat: "def", risk: 2, death: 1, gain: 12, tag: "guard", success: "阵纹隔开代价，只留下答案。", fail: "阵纹倒映成牢。" },
      { label: "邀请外宗共同观看", stat: "charm", risk: 4, death: 2, gain: 13, tag: "social", success: "众人所见互相印证，假象减少。", fail: "外宗窥见本宗未来一角。" },
    ],
  },
  {
    title: "内斗",
    intro: (t) => `宝物越来越近，诸宗弟子开始互相试探。有人提议结伴，有人暗扣剑柄，也有人愿用秘密换活路。`,
    choices: [
      { label: "主持临时盟约", stat: "charm", risk: 3, death: 1, gain: 16, tag: "social", success: "盟约暂成，诸宗减少内耗。", fail: "盟约纸薄，有人暗中背刺。" },
      { label: "先下手夺令牌", stat: "atk", risk: 8, death: 8, gain: 23, tag: "greed", success: "令牌到手，入口权限增加。", fail: "夺牌失败，引来围攻。" },
      { label: "避开人群独行", stat: "speed", risk: 5, death: 4, gain: 15, tag: "loner", success: "独行避开纷争，找到旁路。", fail: "孤身遇敌，援手难至。" },
      { label: "保护弱宗弟子", stat: "def", risk: 4, death: 2, gain: 14, tag: "mercy", success: "弱宗弟子交出保命线索。", fail: "善意拖慢脚步。" },
      { label: "用假情报换时间", stat: "temper", risk: 5, death: 3, gain: 16, tag: "trick", success: "假情报拖住追兵。", fail: "谎言很快被识破。" },
      { label: "赌没人敢动手", stat: "luck", risk: 6, death: 6, gain: 19, tag: "fate", success: "所有人迟疑的一瞬，你抢到先机。", fail: "偏有人敢，第一个目标就是你。" },
    ],
  },
  {
    title: "核心",
    intro: (t) => `${t.relic}终于落到眼前，但它被${t.threat}的残念缠绕。每一次靠近都像在向命数借债。`,
    choices: [
      { label: "强取核心", stat: "atk", risk: 9, death: 10, gain: 28, tag: "blood", success: "核心被硬生生拔出，天地失声。", fail: "残念反咬，血雾遮住视线。" },
      { label: "慢慢剥离残念", stat: "temper", risk: 4, death: 3, gain: 18, tag: "steady", success: "残念一层层脱落，核心趋于稳定。", fail: "耐心被消磨，残念钻入识海。" },
      { label: "以阵承载核心", stat: "def", risk: 3, death: 2, gain: 17, tag: "guard", success: "阵纹托住核心，代价被分散。", fail: "阵纹崩碎，核心震荡。" },
      { label: "让核心自行择主", stat: "luck", risk: 7, death: 6, gain: 24, tag: "fate", success: "核心偏向你，像早已等待。", fail: "核心选择了灾厄。" },
      { label: "与残念谈条件", stat: "charm", risk: 6, death: 5, gain: 21, tag: "social", success: "残念让出一部分权柄。", fail: "条件里藏着魂契。" },
      { label: "先参悟再触碰", stat: "aptitude", risk: 4, death: 2, gain: 20, tag: "insight", success: "参悟指出唯一安全的触点。", fail: "参悟过深，险些忘记自己是谁。" },
    ],
  },
  {
    title: "余烬",
    intro: (t) => `${t.relic}的虚影碎开后，地面露出一层温热余烬。余烬里有脚印、断简、血珠和一枚还在跳动的火核。`,
    choices: [
      { label: "收走跳动火核", stat: "def", risk: 7, death: 6, gain: 24, tag: "greed", success: "火核被灵力包住，化作可带回宗门的炉心。", fail: "火核灼穿护符，掌心焦黑。" },
      { label: "辨认余烬脚印", stat: "aptitude", risk: 3, death: 1, gain: 16, tag: "insight", success: "脚印串起一条安全的旧路。", fail: "脚印忽然倒转，像有人从背后走来。" },
      { label: "以寒息压火", stat: "temper", risk: 4, death: 2, gain: 17, tag: "steady", success: "余烬降温，火里的字迹显现。", fail: "寒息反激火势，衣袖燃起。" },
      { label: "让外宗先取", stat: "charm", risk: 2, death: 0, gain: 13, tag: "social", success: "外宗触发机关，你看清了火核规律。", fail: "外宗取走一半机缘。" },
      { label: "踩过余烬直行", stat: "hp", risk: 6, death: 5, gain: 21, tag: "blood", success: "痛感锻骨，余烬为你让路。", fail: "脚下火线钻入经脉。" },
      { label: "赌火会认主", stat: "luck", risk: 8, death: 8, gain: 27, tag: "fate", success: "火核贴近丹田，像归巢之鸟。", fail: "火核认的是你的影子。" },
    ],
  },
  {
    title: "倒钟",
    intro: (t) => `一口倒悬古钟在空中无声摆动。每摆一次，众人都会忘掉刚才十息。钟下写着：记忆可换路。`,
    choices: [
      { label: "记录每次遗忘", stat: "aptitude", risk: 3, death: 1, gain: 18, tag: "insight", success: "遗忘间隙被拼成完整路线。", fail: "记录也开始被钟声抹去。" },
      { label: "以心性硬抗钟声", stat: "temper", risk: 5, death: 3, gain: 19, tag: "steady", success: "你守住本心，钟声反成磨砺。", fail: "十息空白里藏进陌生念头。" },
      { label: "击钟破局", stat: "atk", risk: 8, death: 7, gain: 26, tag: "bold", success: "古钟裂开，掉出一枚时间铜片。", fail: "钟声炸响，识海翻江倒海。" },
      { label: "替同伴保管记忆", stat: "def", risk: 4, death: 2, gain: 16, tag: "mercy", success: "同伴记忆回归，欠下一份大人情。", fail: "太多记忆压得头痛欲裂。" },
      { label: "偷换外宗记忆", stat: "charm", risk: 7, death: 4, gain: 23, tag: "trick", success: "外宗误入回路，你抢到时间。", fail: "偷换被察觉，引来围堵。" },
      { label: "随钟声随机前进", stat: "luck", risk: 6, death: 6, gain: 24, tag: "fate", success: "遗忘醒来时，你已站在宝光之前。", fail: "醒来时，脚边全是自己的脚印。" },
    ],
  },
  {
    title: "债主",
    intro: (t) => `一位披旧账册的老人拦住去路，自称替${t.threat}收债。账册上竟有每个入界弟子的名字。`,
    choices: [
      { label: "偿还小额灵债", stat: "charm", risk: 2, death: 0, gain: 14, tag: "social", success: "老人划去一笔小债，透露账册漏洞。", fail: "老人嫌债轻，只肯让半步。" },
      { label: "撕毁自己的账页", stat: "atk", risk: 8, death: 7, gain: 27, tag: "bold", success: "账页碎成金粉，命债短暂清空。", fail: "账册反割手掌，血字更深。" },
      { label: "查账册真伪", stat: "aptitude", risk: 3, death: 1, gain: 17, tag: "insight", success: "你发现债主只是旧阵投影。", fail: "真伪交错，判断迟疑。" },
      { label: "替弱者扛一笔债", stat: "def", risk: 5, death: 3, gain: 20, tag: "mercy", success: "弱者交出一枚保命符。", fail: "新债压身，危险增加。" },
      { label: "承认一笔血债", stat: "hp", risk: 7, death: 6, gain: 25, tag: "blood", success: "血债化作力量，短暂灼亮经脉。", fail: "血债认主，魂灯一暗。" },
      { label: "赌账册漏了名字", stat: "luck", risk: 6, death: 5, gain: 22, tag: "fate", success: "账册翻到空页，老人沉默让路。", fail: "空页自己写上你的名字。" },
    ],
  },
  {
    title: "风暴眼",
    intro: (t) => `${t.place}深处升起一枚风暴眼，所有宝光都被卷入其中。越靠近中心，奖励越厚，活路越窄。`,
    choices: [
      { label: "贴地穿越风墙", stat: "speed", risk: 6, death: 5, gain: 23, tag: "bold", success: "你从风墙缝隙钻过，卷走一截灵砂。", fail: "风墙把身体抛向乱石。" },
      { label: "稳住队伍节奏", stat: "temper", risk: 3, death: 1, gain: 17, tag: "steady", success: "队伍没有被风声扰乱，行进稳定。", fail: "风声钻入耳中，心神浮躁。" },
      { label: "用阵钉住风眼", stat: "def", risk: 5, death: 3, gain: 21, tag: "guard", success: "阵钉打入风眼，开出短暂通路。", fail: "阵钉被风眼吞没。" },
      { label: "抢中心宝光", stat: "luck", risk: 9, death: 9, gain: 31, tag: "greed", success: "中心宝光入手，风暴为之一滞。", fail: "宝光是诱饵，中心没有地面。" },
      { label: "救下被卷者", stat: "hp", risk: 6, death: 4, gain: 20, tag: "mercy", success: "被救者留下宗门密令。", fail: "多救一人，自己也被拖入风中。" },
      { label: "以假身引风", stat: "charm", risk: 5, death: 3, gain: 19, tag: "trick", success: "风暴追着假身偏移。", fail: "假身太像真身，反噬本体。" },
    ],
  },
  {
    title: "无声宴",
    intro: (t) => `一座无声宴席摆在荒原中央，杯中是星光，盘中是未发生的战斗。吃下去，可能得到未来，也可能被未来吃掉。`,
    choices: [
      { label: "饮下星光酒", stat: "luck", risk: 7, death: 6, gain: 27, tag: "fate", success: "星光酒照见一条大吉路线。", fail: "星光倒灌，眼前全是凶兆。" },
      { label: "只闻不饮", stat: "temper", risk: 2, death: 0, gain: 14, tag: "steady", success: "香气足够推断酒中药性。", fail: "香气也能醉人。" },
      { label: "试吃未来战斗", stat: "atk", risk: 8, death: 7, gain: 28, tag: "bold", success: "未来战斗被提前消化，攻伐顿悟。", fail: "未来敌人从盘中抬头。" },
      { label: "分食给同行者", stat: "charm", risk: 4, death: 2, gain: 18, tag: "social", success: "同行者各自看见片段，情报拼合。", fail: "片段互相矛盾，引发争执。" },
      { label: "以护符验毒", stat: "def", risk: 3, death: 1, gain: 15, tag: "guard", success: "护符替你吃下最毒的一口。", fail: "护符裂开，余毒仍在。" },
      { label: "把宴席掀翻", stat: "hp", risk: 7, death: 6, gain: 24, tag: "blood", success: "宴席下藏着旧仙钱。", fail: "无声宾客同时回头。" },
    ],
  },
  {
    title: "裂帛天书",
    intro: (t) => `空中垂下一匹裂帛，帛上文字不断改写，像有人在远处重写这场奇遇。每读一行，命数便偏一寸。`,
    choices: [
      { label: "读第一行", stat: "aptitude", risk: 3, death: 1, gain: 19, tag: "insight", success: "第一行给出清晰的因果。", fail: "文字改写太快，眼前一黑。" },
      { label: "读最后一行", stat: "luck", risk: 8, death: 7, gain: 30, tag: "fate", success: "最后一行泄露结局钥匙。", fail: "结局反过来读取你。" },
      { label: "撕下一角带走", stat: "atk", risk: 7, death: 6, gain: 26, tag: "greed", success: "裂帛一角成了可带走的天书残页。", fail: "裂帛割开掌纹，命线紊乱。" },
      { label: "替天书补字", stat: "temper", risk: 5, death: 3, gain: 22, tag: "steady", success: "补上的字稳住一段命数。", fail: "补错一字，整段路歪斜。" },
      { label: "让众人共读", stat: "charm", risk: 4, death: 2, gain: 18, tag: "social", success: "多双眼睛压住文字幻变。", fail: "众人各读出不同贪念。" },
      { label: "用阵框住裂帛", stat: "def", risk: 4, death: 2, gain: 17, tag: "guard", success: "阵框锁住一页真文。", fail: "阵框被文字撑裂。" },
    ],
  },
  {
    title: "魇潮",
    intro: (t, d) => `梦魇像潮水漫来，${d.name}听见许多熟悉声音在身后求救。其中有真的，也有假的。`,
    choices: [
      { label: "逐一辨认真伪", stat: "aptitude", risk: 5, death: 3, gain: 22, tag: "insight", success: "真声与假声被分开，魇潮退去一层。", fail: "辨认太慢，魇潮没过膝盖。" },
      { label: "谁都不回头", stat: "temper", risk: 4, death: 2, gain: 18, tag: "steady", success: "不回头让魇潮失去入口。", fail: "不回头也会留下心结。" },
      { label: "冲回去救人", stat: "speed", risk: 7, death: 7, gain: 25, tag: "mercy", success: "你救到一个真正活人。", fail: "求救声在怀里碎成黑水。" },
      { label: "斩断所有声音", stat: "atk", risk: 8, death: 7, gain: 27, tag: "blood", success: "剑光切开魇潮，天地清净。", fail: "声音断了，魂灯也跟着一暗。" },
      { label: "借魇潮隐藏行踪", stat: "charm", risk: 6, death: 4, gain: 23, tag: "trick", success: "你披着梦魇绕过追兵。", fail: "梦魇披久了便不肯脱下。" },
      { label: "听从最微弱的声音", stat: "luck", risk: 6, death: 5, gain: 24, tag: "fate", success: "最弱的声音竟来自出口方向。", fail: "微弱声音只是饵。" },
    ],
  },
  {
    title: "逆河",
    intro: (t) => `一条河从出口方向倒流而来，河中漂着没发生过的尸体和没得到过的宝物。渡河者必须丢下一样东西。`,
    choices: [
      { label: "丢下部分收获", stat: "temper", risk: 2, death: 0, gain: 15, tag: "steady", success: "舍弃让河面平静，活路变宽。", fail: "舍弃仍不够，河水索要更多。" },
      { label: "丢下一件旧伤", stat: "hp", risk: 4, death: 2, gain: 20, tag: "blood", success: "旧伤离体，体魄反而轻快。", fail: "旧伤连着新血，被河水拉扯。" },
      { label: "骗河水收假名", stat: "charm", risk: 6, death: 4, gain: 24, tag: "trick", success: "假名沉入河底，真身渡过。", fail: "河水念出真名。" },
      { label: "搭阵桥渡河", stat: "def", risk: 5, death: 3, gain: 21, tag: "guard", success: "阵桥短暂成形，众人争相通过。", fail: "阵桥被逆流冲断。" },
      { label: "逆流强渡", stat: "speed", risk: 8, death: 8, gain: 29, tag: "bold", success: "逆流没有追上你的身法。", fail: "河面突然竖起。" },
      { label: "捞取未来宝物", stat: "luck", risk: 9, death: 9, gain: 32, tag: "greed", success: "未来宝物竟愿意留下。", fail: "你捞到的是自己的死相。" },
    ],
  },
  {
    title: "天门税",
    intro: (t) => `出口前出现一座天门，门上写着：过门者缴税。税可以是灵石、功德、血、秘密、敌人的名字，或一次未来失败。`,
    choices: [
      { label: "缴纳灵石税", stat: "charm", risk: 2, death: 0, gain: 16, tag: "social", success: "天门收税后开了一线。", fail: "税额临时上涨。" },
      { label: "缴纳功德税", stat: "def", risk: 3, death: 1, gain: 19, tag: "mercy", success: "善念发光，天门主动放行。", fail: "功德不足，门缝很窄。" },
      { label: "缴纳血税", stat: "hp", risk: 7, death: 6, gain: 28, tag: "blood", success: "血税换来最短出口。", fail: "天门嫌血不够热。" },
      { label: "缴纳秘密税", stat: "aptitude", risk: 5, death: 2, gain: 23, tag: "insight", success: "秘密离口，门后显出真路。", fail: "秘密被天门传给别人。" },
      { label: "缴纳敌名", stat: "atk", risk: 6, death: 4, gain: 24, tag: "trick", success: "敌名替你承了一部分税。", fail: "敌名反咬，因果回身。" },
      { label: "缴纳未来失败", stat: "luck", risk: 8, death: 7, gain: 30, tag: "fate", success: "未来一次失败被提前抵扣。", fail: "失败提前到现在。" },
    ],
  },
  {
    title: "终局前夜",
    intro: (t, d) => `离出口只剩最后一夜，${d.name}的魂灯忽明忽暗。所有路线上积累的善、贪、血、谎与悟，都在此刻排队敲门。`,
    choices: [
      { label: "清点全部收获", stat: "aptitude", risk: 3, death: 1, gain: 22, tag: "insight", success: "收获被整理成可带回宗门的清单。", fail: "清点时发现有东西正在消失。" },
      { label: "疗伤保命", stat: "def", risk: 2, death: 0, gain: 17, tag: "guard", success: "伤势压住，魂灯稳定。", fail: "疗伤只能止住表面。" },
      { label: "再赌最后一签", stat: "luck", risk: 9, death: 9, gain: 34, tag: "fate", success: "最后一签大吉，夜色退去。", fail: "签筒里全是凶。" },
      { label: "以战意镇梦", stat: "atk", risk: 6, death: 5, gain: 25, tag: "bold", success: "战意如火，梦魇不敢靠近。", fail: "战意太盛，烧到自身。" },
      { label: "向同行者托付遗言", stat: "charm", risk: 3, death: 1, gain: 20, tag: "social", success: "遗言变成盟约，诸宗愿助你一程。", fail: "遗言被人当作把柄。" },
      { label: "独坐到天明", stat: "temper", risk: 3, death: 1, gain: 21, tag: "steady", success: "天明时，心魔已经无话可说。", fail: "长夜太长，杂念未尽。" },
    ],
  },
  {
    title: "归途",
    intro: (t, d) => `${t.name}开始坍塌，${d.name}必须带着所有选择的后果离开。出口只开十息，身后还有没来得及带走的东西。`,
    choices: [
      { label: "立刻撤离", stat: "speed", risk: 2, death: 1, gain: 12, tag: "steady", success: "十息未尽，人已越过出口。", fail: "出口擦身而过，险些被夹断。" },
      { label: "回头再取一物", stat: "luck", risk: 8, death: 8, gain: 26, tag: "greed", success: "最后一物竟是最大机缘。", fail: "回头的一瞬，出口开始闭合。" },
      { label: "护送同行者", stat: "def", risk: 5, death: 3, gain: 18, tag: "mercy", success: "被救者以重礼相报。", fail: "多护一人，多担一重塌方。" },
      { label: "封住追来的灾厄", stat: "temper", risk: 5, death: 4, gain: 20, tag: "guard", success: "灾厄被封在界内，本宗声望大涨。", fail: "封印慢了一线，灾厄擦过魂灯。" },
      { label: "留下误导标记", stat: "charm", risk: 4, death: 2, gain: 17, tag: "trick", success: "追兵被误导，归途轻松许多。", fail: "标记反被追兵利用。" },
      { label: "记下坍塌规律", stat: "aptitude", risk: 5, death: 3, gain: 21, tag: "insight", success: "坍塌规律变成一份珍贵图谱。", fail: "图谱未成，余震先至。" },
    ],
  },
];
const itemCatalog = {
  marrowPill: { name: "洗髓丹", kind: "丹药", text: "提升体魄与资质", apply: (d, q = 0) => { d.hp += 14 + q * 8; d.aptitude += 5 + q * 3; } },
  qiPill: { name: "聚气丹", kind: "丹药", text: "温和增加修为进度", apply: (d, q = 0) => { d.exp += 9 + q * 5; d.pillFatigue = (d.pillFatigue || 0) + 2; } },
  minorHealPill: { name: "回春丹", kind: "丹药", text: "恢复体魄，也可在边境讨伐中临时回血", combatHeal: 28, apply: (d, q = 0) => { d.hp += 20 + q * 8; d.pillFatigue = (d.pillFatigue || 0) + 1; } },
  midHealPill: { name: "玉露还元丹", kind: "丹药", text: "中阶恢复丹，适合边境副本与劫伤调养", combatHeal: 52, apply: (d, q = 0) => { d.hp += 38 + q * 10; d.temper += 2 + q; d.pillFatigue = (d.pillFatigue || 0) + 1; } },
  highHealPill: { name: "九转续命丹", kind: "丹药", text: "高阶恢复丹，能大幅恢复体魄但丹毒更重", combatHeal: 86, apply: (d, q = 0) => { d.hp += 66 + q * 14; d.temper += 4 + q; d.pillFatigue = (d.pillFatigue || 0) + 2; } },
  tribPill: { name: "渡厄丹", kind: "丹药", text: "下次渡劫成功率提升", apply: (d, q = 0) => { d.tribBoost = Math.max(d.tribBoost || 0, 8 + q * 4); d.pillFatigue = (d.pillFatigue || 0) + 2; } },
  swordManual: { name: "残缺剑诀", kind: "功法", text: "提升攻击与速度", apply: (d, q = 0) => { d.atk += 10 + q * 5; d.speed += 5 + q * 3; } },
  heartLotus: { name: "净心莲", kind: "灵材", text: "稳固心性与气运", apply: (d, q = 0) => { d.temper += 8 + q * 4; d.luck += 8 + q * 4; } },
  jadeDew: { name: "玉髓露", kind: "丹材", material: true, text: "聚气丹常用主材。来源提示：云海、灵泉、药园类机缘。" },
  moonRoot: { name: "月华根", kind: "丹材", material: true, text: "洗髓丹常用主材。来源提示：古林、药园、旧仙坟类机缘。" },
  fireGanoderma: { name: "地火芝", kind: "丹材", material: true, text: "渡厄丹火性主材。来源提示：地火、丹房、雷池类机缘。" },
  thunderSeed: { name: "雷纹子", kind: "丹材", material: true, text: "渡劫辅助丹材。来源提示：雷池、星陨、剑冢类机缘。" },
  spiritGinseng: { name: "百年灵参", kind: "丹材", material: true, text: "高阶丹药补益主材。来源提示：万药秘圃、药园、散修集会类机缘。" },
  coldIron: { name: "寒铁", kind: "器材", material: true, text: "基础炼器主材。来源提示：矿脉、剑冢、地脉类机缘。" },
  starSand: { name: "星陨砂", kind: "器材", material: true, text: "提升兵刃灵性的器材。来源提示：星陨坑、雷池、荒塔类机缘。" },
  dragonBone: { name: "龙骨片", kind: "器材", material: true, text: "高阶法器骨材。来源提示：龙骨浅滩、旧仙坟、世界奇遇。" },
  redCopper: { name: "赤炼铜", kind: "器材", material: true, text: "火性锻材。来源提示：地火窟、矿脉、丹房类机缘。" },
  nascentBead: { name: "妖婴晶核", kind: "晋升材料", material: true, text: "元婴晋升必需。来源提示：边境金丹级讨伐副本、兽潮精英。" },
  spiritInfantJade: { name: "化神玉胎", kind: "晋升材料", material: true, text: "化神晋升必需。来源提示：边境元婴级讨伐副本、边境首领。" },
  voidScale: { name: "炼虚鳞片", kind: "晋升材料", material: true, text: "炼虚晋升必需。来源提示：边境化神级讨伐副本，刷新较低。" },
  tribulationBone: { name: "合体劫骨", kind: "晋升材料", material: true, text: "合体晋升必需。来源提示：边境炼虚级讨伐副本，刷新稀少。" },
  immortalAsh: { name: "大乘仙灰", kind: "晋升材料", material: true, text: "大乘以上晋升必需。来源提示：边境高阶首领与世界奇遇终局奖励。" },
  spiritBlade: { name: "青锋玄铁剑", kind: "武器", equipment: true, slot: "weapon", text: "提升攻伐与身法", apply: (d, q = 0) => { d.atk += 18 + q * 9; d.speed += 4 + q * 3; }, remove: (d, q = 0) => { d.atk -= 18 + q * 9; d.speed -= 4 + q * 3; } },
  thunderSpear: { name: "惊雷破阵枪", kind: "武器", equipment: true, slot: "weapon", text: "大幅提升攻伐，略增守御", apply: (d, q = 0) => { d.atk += 24 + q * 11; d.def += 5 + q * 3; }, remove: (d, q = 0) => { d.atk -= 24 + q * 11; d.def -= 5 + q * 3; } },
  moonBlade: { name: "寒月流光刃", kind: "武器", equipment: true, slot: "weapon", text: "提升身法与攻伐", apply: (d, q = 0) => { d.speed += 12 + q * 5; d.atk += 14 + q * 8; }, remove: (d, q = 0) => { d.speed -= 12 + q * 5; d.atk -= 14 + q * 8; } },
  starBow: { name: "星砂逐日弓", kind: "武器", equipment: true, slot: "weapon", text: "提升攻伐、气运与身法", apply: (d, q = 0) => { d.atk += 16 + q * 9; d.luck += 5 + q * 2; d.speed += 5 + q * 3; }, remove: (d, q = 0) => { d.atk -= 16 + q * 9; d.luck -= 5 + q * 2; d.speed -= 5 + q * 3; } },
  guardTalisman: { name: "玄龟护身符", kind: "法器", equipment: true, slot: "artifact", text: "提升守御与体魄", apply: (d, q = 0) => { d.def += 14 + q * 8; d.hp += 10 + q * 7; }, remove: (d, q = 0) => { d.def -= 14 + q * 8; d.hp -= 10 + q * 7; } },
  arrayCompass: { name: "七曜阵盘", kind: "法器", equipment: true, slot: "artifact", text: "提升阵道推演、防守与心性", arrayGear: 18, apply: (d, q = 0) => { d.def += 9 + q * 5; d.temper += 7 + q * 3; }, remove: (d, q = 0) => { d.def -= 9 + q * 5; d.temper -= 7 + q * 3; } },
  cloudRobe: { name: "流云护身袍", kind: "防具", equipment: true, slot: "armor", text: "提升体魄与守御" },
  spiritRing: { name: "聚灵戒", kind: "灵器", equipment: true, slot: "spirit", text: "提升资质、气运与功法熟练" },
  shadowBoots: { name: "踏影履", kind: "饰品", equipment: true, slot: "accessory", text: "提升身法与闪避" },
  flameMethod: { name: "焚心诀", kind: "功法", manual: true, text: "火属性攻法，提升攻伐与火伤", method: { id: "flameMethod", name: "焚心诀", role: "火攻", atk: 12, element: "火", elementDamage: 18, damagePct: 6 } },
  waterMethod: { name: "沧浪回春诀", kind: "功法", manual: true, text: "水属性功法，提供回血与减伤", method: { id: "waterMethod", name: "沧浪回春诀", role: "回血", hp: 22, element: "水", heal: 18, reducePct: 5 } },
  thunderMethod: { name: "紫霄雷法", kind: "功法", manual: true, text: "雷属性爆发功法，提升身法与雷伤", method: { id: "thunderMethod", name: "紫霄雷法", role: "雷攻", speed: 8, element: "雷", elementDamage: 24, damagePct: 8 } },
  earthMethod: { name: "厚土玄功", kind: "功法", manual: true, text: "土属性防御功法，提升守御与护盾", method: { id: "earthMethod", name: "厚土玄功", role: "护盾", def: 16, element: "土", shield: 22, reducePct: 7 } },
  refineStone: { name: "洗练灵砂", kind: "洗练材料", material: true, text: "用于重洗装备词条。来源：奇遇、资源点、流浪商人。" },
  affixLock: { name: "定纹玉扣", kind: "洗练材料", material: true, text: "洗练时锁定词条位消耗。锁一位消耗 1，锁二位消耗 2，锁三位消耗 4，锁四位消耗 8。" },
  severingSword: { name: "斩尘剑", kind: "武器", equipment: true, slot: "weapon", text: "适合高速剑修，偏攻伐与身法" },
  bloodAxe: { name: "血魄战斧", kind: "武器", equipment: true, slot: "weapon", text: "重攻武器，偏爆发与体魄" },
  jadeFlute: { name: "青玉灵箫", kind: "法器", equipment: true, slot: "artifact", text: "法器槽装备，偏心性、减伤与辅助" },
  soulLamp: { name: "长明魂灯", kind: "法器", equipment: true, slot: "artifact", text: "法器槽装备，偏守御、气运与续航" },
  scaleArmor: { name: "玄鳞甲", kind: "防具", equipment: true, slot: "armor", text: "厚重防具，偏守御与体魄" },
  phoenixCape: { name: "赤羽披风", kind: "防具", equipment: true, slot: "armor", text: "火性防具，偏体魄与增伤" },
  voidMirror: { name: "太虚镜", kind: "灵器", equipment: true, slot: "spirit", text: "灵器槽装备，偏资质、阴阳属性" },
  thunderSeal: { name: "雷狱印", kind: "灵器", equipment: true, slot: "spirit", text: "灵器槽装备，偏雷伤与爆发" },
  windBelt: { name: "御风带", kind: "饰品", equipment: true, slot: "accessory", text: "饰品槽装备，偏身法与先手" },
  poisonNeedle: { name: "碧落毒针", kind: "饰品", equipment: true, slot: "accessory", text: "饰品槽装备，偏毒伤与奇袭" },
  metalMethod: { name: "庚金破岳诀", kind: "功法", manual: true, text: "金属性破防攻法，攻伐与金伤成长" },
  woodMethod: { name: "青木长生功", kind: "功法", manual: true, text: "木属性续航功法，回血与体魄成长" },
  poisonMethod: { name: "万毒蚀心经", kind: "功法", manual: true, text: "毒属性持续伤害功法，偏毒伤与减防" },
  yinMethod: { name: "太阴玄照录", kind: "功法", manual: true, text: "稀有阴属性功法，偏减伤、控制与阴伤" },
  yangMethod: { name: "太阳真火经", kind: "功法", manual: true, text: "稀有阳属性功法，偏爆发、回血与阳伤" },
  shieldMethod: { name: "琉璃金身诀", kind: "功法", manual: true, text: "护盾型功法，防守和护盾成长明显" },
  hasteMethod: { name: "浮光掠影步", kind: "功法", manual: true, text: "身法型功法，抢先手和连击表现更好" },
  bloodMethod: { name: "血煞燃灵术", kind: "功法", manual: true, text: "高风险增伤功法，偏爆发与攻伐" },
  frostMethod: { name: "玄冰封脉诀", kind: "功法", manual: true, text: "水阴混合控制功法，偏减伤、缓速与冰寒伤害" },
  windMethod: { name: "御风追星步", kind: "功法", manual: true, text: "高速游斗功法，偏身法、先手与少量雷伤" },
  rockMethod: { name: "镇岳搬山经", kind: "功法", manual: true, text: "重防功法，偏体魄、守御和厚土护盾" },
  starMethod: { name: "星河照命录", kind: "功法", manual: true, text: "气运参悟功法，偏暴击、参悟和金雷混合爆发" },
  shadowMethod: { name: "幽影蚀魂诀", kind: "功法", manual: true, text: "阴毒袭杀功法，偏毒伤、阴伤和破防" },
  lifeMethod: { name: "万木回春真经", kind: "功法", manual: true, text: "木属性治疗功法，偏回血、体魄和持续作战" },
  swordStormMethod: { name: "万剑归宗诀", kind: "功法", manual: true, text: "金属性连斩功法，偏攻伐、破防和会心" },
  dragonMethod: { name: "龙象镇狱功", kind: "功法", manual: true, text: "体修镇压功法，偏体魄、守御和爆发反击" },
  voidMethod: { name: "太虚挪移法", kind: "功法", manual: true, text: "稀有身法功法，偏闪避、减伤和阴阳奇袭" },
  lotusMethod: { name: "净世莲华诀", kind: "功法", manual: true, text: "净化辅助功法，偏治疗、护盾和心性稳定" },
  mirrorMethod: { name: "明镜返照功", kind: "功法", manual: true, text: "反制型功法，偏减伤、护盾和反击增伤" },
  beastMethod: { name: "驭兽通灵诀", kind: "功法", manual: true, text: "边境讨伐功法，偏体魄、攻伐和妖兽战增伤" },
  rainMethod: { name: "甘霖渡厄篇", kind: "功法", manual: true, text: "团队续航功法，偏回血、减伤和渡劫稳定" },
  sunMethod: { name: "大日焚天经", kind: "功法", manual: true, text: "顶级阳火功法，偏阳伤、火伤、回血和爆发" },
  moonMethod: { name: "寒月照神章", kind: "功法", manual: true, text: "顶级阴水功法，偏阴伤、减伤、缓速和心性" },
  plagueMethod: { name: "瘟云百厄经", kind: "功法", manual: true, text: "毒属性压制功法，偏持续毒伤、破防和削弱" },
};
const alchemyRecipes = [
  { id: "qiPill", name: "聚气丹方", output: "qiPill", stones: 90, generic: 1, materials: { jadeDew: 1 }, source: "云海秘境、洗髓灵泉、药园类机缘" },
  { id: "minorHealPill", name: "回春丹方", output: "minorHealPill", stones: 75, generic: 1, materials: { jadeDew: 1 }, source: "初始丹方。云海、灵泉、药园类机缘可补主材" },
  { id: "marrowPill", name: "洗髓丹方", output: "marrowPill", stones: 130, generic: 1, materials: { moonRoot: 1, jadeDew: 1 }, source: "南离古林、药园残梦、旧仙坟类机缘" },
  { id: "heartLotus", name: "净心丹方", output: "heartLotus", stones: 120, generic: 1, materials: { moonRoot: 1 }, source: "古碑裂隙、狐仙赌局、药园类机缘" },
  { id: "midHealPill", name: "玉露还元丹方", output: "midHealPill", stones: 190, generic: 1, materials: { spiritGinseng: 1, moonRoot: 1 }, source: "拍卖会、万药秘圃、边境药兽副本" },
  { id: "highHealPill", name: "九转续命丹方", output: "highHealPill", stones: 420, generic: 2, materials: { spiritGinseng: 2, thunderSeed: 1, fireGanoderma: 1 }, source: "高阶拍卖会、世界奇遇、边境首领" },
  { id: "tribPill", name: "渡厄丹方", output: "tribPill", stones: 220, generic: 2, materials: { fireGanoderma: 1, thunderSeed: 1, spiritGinseng: 1 }, source: "雷池幻境、地火窟、万药秘圃、星陨坑类机缘" },
];
const alchemyMaterialIds = ["jadeDew", "moonRoot", "fireGanoderma", "thunderSeed", "spiritGinseng"];
const forgingRecipes = [
  { id: "spiritBlade", name: "青锋玄铁剑图", output: "spiritBlade", stones: 140, generic: 1, materials: { coldIron: 1 }, source: "矿脉、剑冢余响、地脉矿痕类机缘" },
  { id: "moonBlade", name: "寒月流光刃图", output: "moonBlade", stones: 180, generic: 1, materials: { coldIron: 1, starSand: 1 }, source: "寒玉矿脉、星陨坑、荒塔类机缘" },
  { id: "thunderSpear", name: "惊雷破阵枪图", output: "thunderSpear", stones: 240, generic: 2, materials: { redCopper: 1, starSand: 1 }, source: "雷池幻境、地火窟、星陨坑类机缘" },
  { id: "starBow", name: "星砂逐日弓图", output: "starBow", stones: 260, generic: 2, materials: { starSand: 2, dragonBone: 1 }, source: "星陨坑、龙骨浅滩、世界奇遇" },
  { id: "guardTalisman", name: "玄龟护身符图", output: "guardTalisman", stones: 160, generic: 1, materials: { redCopper: 1 }, source: "地火窟、沉舟宝库、矿脉类机缘" },
  { id: "arrayCompass", name: "七曜阵盘图", output: "arrayCompass", stones: 320, generic: 2, materials: { coldIron: 1, starSand: 1, dragonBone: 1 }, source: "荒塔问心、古碑裂隙、龙骨浅滩类机缘" },
  { id: "cloudRobe", name: "流云护身袍图", output: "cloudRobe", stones: 210, generic: 1, materials: { starSand: 1, redCopper: 1 }, source: "云海秘境、世界奇遇、流浪商人" },
  { id: "spiritRing", name: "聚灵戒图", output: "spiritRing", stones: 260, generic: 2, materials: { dragonBone: 1, starSand: 1 }, source: "灵泉、古碑裂隙、拍卖会" },
  { id: "shadowBoots", name: "踏影履图", output: "shadowBoots", stones: 190, generic: 1, materials: { coldIron: 1, redCopper: 1 }, source: "幽谷、妖兽巢穴、流浪商人" },
  { id: "severingSword", name: "斩尘剑图", output: "severingSword", stones: 260, generic: 2, materials: { coldIron: 2, starSand: 1 }, source: "剑冢、拍卖会、流浪商人" },
  { id: "bloodAxe", name: "血魄战斧图", output: "bloodAxe", stones: 300, generic: 2, materials: { redCopper: 2, dragonBone: 1 }, source: "妖兽巢穴、边境、地火窟" },
  { id: "jadeFlute", name: "青玉灵箫图", output: "jadeFlute", stones: 240, generic: 1, materials: { starSand: 1, dragonBone: 1 }, source: "仙市、古碑、云海" },
  { id: "soulLamp", name: "长明魂灯图", output: "soulLamp", stones: 340, generic: 2, materials: { dragonBone: 1, redCopper: 1, starSand: 1 }, source: "旧仙坟、世界奇遇、拍卖会" },
  { id: "scaleArmor", name: "玄鳞甲图", output: "scaleArmor", stones: 310, generic: 2, materials: { dragonBone: 1, coldIron: 2 }, source: "龙骨浅滩、边境首领" },
  { id: "phoenixCape", name: "赤羽披风图", output: "phoenixCape", stones: 330, generic: 2, materials: { redCopper: 2, starSand: 1 }, source: "地火窟、星陨坑、流浪商人" },
  { id: "voidMirror", name: "太虚镜图", output: "voidMirror", stones: 520, generic: 3, materials: { starSand: 2, dragonBone: 2 }, source: "世界奇遇、拍卖会" },
  { id: "thunderSeal", name: "雷狱印图", output: "thunderSeal", stones: 420, generic: 2, materials: { redCopper: 1, starSand: 2 }, source: "雷池、边境、拍卖会" },
  { id: "windBelt", name: "御风带图", output: "windBelt", stones: 220, generic: 1, materials: { starSand: 1, coldIron: 1 }, source: "云海、幽谷、流浪商人" },
  { id: "poisonNeedle", name: "碧落毒针图", output: "poisonNeedle", stones: 260, generic: 1, materials: { redCopper: 1, dragonBone: 1 }, source: "毒沼、妖兽巢穴、黑市" },
];
const forgingMaterialIds = ["coldIron", "starSand", "dragonBone", "redCopper"];
const gearSlots = [
  { key: "weapon", name: "武器" },
  { key: "artifact", name: "法器" },
  { key: "armor", name: "防具" },
  { key: "spirit", name: "灵器" },
  { key: "accessory", name: "饰品" },
  { key: "relic", name: "遗物" },
];
const gearBaseStats = {
  weapon: { atk: 18, speed: 4 },
  artifact: { def: 12, temper: 6 },
  armor: { hp: 24, def: 12 },
  spirit: { aptitude: 7, luck: 7 },
  accessory: { speed: 14, charm: 3 },
};
const affixRarities = [
  { key: "white", name: "白", weight: 40, mult: 1 },
  { key: "green", name: "绿", weight: 30, mult: 1.35 },
  { key: "blue", name: "蓝", weight: 15, mult: 1.8 },
  { key: "purple", name: "紫", weight: 10, mult: 2.45 },
  { key: "red", name: "红", weight: 5, mult: 3.35 },
];
const elementNames = ["金", "木", "水", "火", "土", "雷", "毒", "阴", "阳"];
const gearAffixPool = [
  { key: "atk", name: "攻伐", stat: "atk", base: 8, text: "攻伐提高" },
  { key: "def", name: "守御", stat: "def", base: 7, text: "守御提高" },
  { key: "hp", name: "体魄", stat: "hp", base: 18, text: "体魄提高" },
  { key: "speed", name: "身法", stat: "speed", base: 6, text: "身法提高" },
  { key: "temper", name: "心性", stat: "temper", base: 5, text: "心性提高" },
  { key: "luck", name: "气运", stat: "luck", base: 5, text: "气运提高" },
  { key: "damagePct", name: "增伤", stat: "damagePct", base: 3, pct: true, text: "造成伤害提高" },
  { key: "reducePct", name: "减伤", stat: "reducePct", base: 3, pct: true, text: "受到伤害降低" },
  { key: "critPct", name: "会心", stat: "critPct", base: 3, pct: true, text: "暴击率提高" },
  { key: "critDamage", name: "会伤", stat: "critDamage", base: 8, pct: true, text: "暴击伤害提高" },
  { key: "lifeSteal", name: "饮血", stat: "lifeSteal", base: 3, pct: true, text: "造成伤害时回血" },
  { key: "pierce", name: "破防", stat: "pierce", base: 5, pct: true, text: "忽略部分守御" },
  { key: "shieldPower", name: "护盾", stat: "shieldPower", base: 8, text: "战斗开局护盾" },
  { key: "methodMastery", name: "悟性", stat: "methodMastery", base: 5, pct: true, text: "功法效果提高" },
  { key: "metalDamage", name: "金伤", stat: "金", element: true, base: 8, text: "金属性伤害" },
  { key: "woodDamage", name: "木伤", stat: "木", element: true, base: 8, text: "木属性伤害" },
  { key: "waterDamage", name: "水伤", stat: "水", element: true, base: 8, text: "水属性伤害" },
  { key: "fireDamage", name: "火伤", stat: "火", element: true, base: 9, text: "火属性伤害" },
  { key: "earthDamage", name: "土伤", stat: "土", element: true, base: 8, text: "土属性伤害" },
  { key: "thunderDamage", name: "雷伤", stat: "雷", element: true, base: 10, text: "雷属性伤害" },
  { key: "poisonDamage", name: "毒伤", stat: "毒", element: true, base: 9, text: "毒属性伤害" },
  { key: "yinDamage", name: "阴伤", stat: "阴", element: true, base: 12, rare: true, text: "阴属性伤害" },
  { key: "yangDamage", name: "阳伤", stat: "阳", element: true, base: 12, rare: true, text: "阳属性伤害" },
];
const methodCatalog = {
  swordManual: { id: "swordManual", name: "残缺剑诀", rarity: 1, role: "剑诀", atk: 10, speed: 5, damagePct: 3, element: "金", elementDamage: 8 },
  flameMethod: { id: "flameMethod", name: "焚心诀", rarity: 2, role: "火攻", atk: 12, damagePct: 6, element: "火", elementDamage: 18 },
  waterMethod: { id: "waterMethod", name: "沧浪回春诀", rarity: 2, role: "回血", hp: 22, reducePct: 5, element: "水", heal: 18 },
  thunderMethod: { id: "thunderMethod", name: "紫霄雷法", rarity: 3, role: "雷攻", speed: 8, damagePct: 8, element: "雷", elementDamage: 24 },
  earthMethod: { id: "earthMethod", name: "厚土玄功", rarity: 2, role: "护盾", def: 16, reducePct: 7, element: "土", shield: 22 },
  metalMethod: { id: "metalMethod", name: "庚金破岳诀", rarity: 2, role: "破防", atk: 15, damagePct: 5, element: "金", elementDamage: 20, pierce: 8 },
  woodMethod: { id: "woodMethod", name: "青木长生功", rarity: 2, role: "续航", hp: 30, reducePct: 4, element: "木", heal: 24 },
  poisonMethod: { id: "poisonMethod", name: "万毒蚀心经", rarity: 3, role: "毒伤", atk: 8, damagePct: 5, element: "毒", elementDamage: 28, poison: 18 },
  yinMethod: { id: "yinMethod", name: "太阴玄照录", rarity: 4, role: "控制", def: 10, reducePct: 10, element: "阴", elementDamage: 32, slow: 12 },
  yangMethod: { id: "yangMethod", name: "太阳真火经", rarity: 4, role: "爆发", atk: 18, damagePct: 12, element: "阳", elementDamage: 34, heal: 12 },
  shieldMethod: { id: "shieldMethod", name: "琉璃金身诀", rarity: 3, role: "护盾", def: 24, reducePct: 8, element: "土", shield: 36 },
  hasteMethod: { id: "hasteMethod", name: "浮光掠影步", rarity: 2, role: "先手", speed: 24, damagePct: 3, element: "雷", elementDamage: 10 },
  bloodMethod: { id: "bloodMethod", name: "血煞燃灵术", rarity: 3, role: "爆发", atk: 24, damagePct: 14, element: "火", elementDamage: 20, selfHurt: 8 },
  frostMethod: { id: "frostMethod", name: "玄冰封脉诀", rarity: 3, role: "控制", def: 12, speed: 4, reducePct: 8, element: "水", elementDamage: 24, slow: 12 },
  windMethod: { id: "windMethod", name: "御风追星步", rarity: 2, role: "先手", speed: 28, damagePct: 5, element: "雷", elementDamage: 14 },
  rockMethod: { id: "rockMethod", name: "镇岳搬山经", rarity: 3, role: "重防", hp: 42, def: 22, reducePct: 9, element: "土", shield: 28 },
  starMethod: { id: "starMethod", name: "星河照命录", rarity: 4, role: "会心", luck: 20, speed: 8, damagePct: 10, element: "金", elementDamage: 26, critPct: 8 },
  shadowMethod: { id: "shadowMethod", name: "幽影蚀魂诀", rarity: 4, role: "袭杀", atk: 18, damagePct: 10, element: "阴", elementDamage: 28, poison: 16, pierce: 10 },
  lifeMethod: { id: "lifeMethod", name: "万木回春真经", rarity: 3, role: "治疗", hp: 48, reducePct: 5, element: "木", heal: 34 },
  swordStormMethod: { id: "swordStormMethod", name: "万剑归宗诀", rarity: 4, role: "破防", atk: 28, speed: 8, damagePct: 12, element: "金", elementDamage: 30, pierce: 14 },
  dragonMethod: { id: "dragonMethod", name: "龙象镇狱功", rarity: 4, role: "体修", hp: 60, atk: 18, def: 18, damagePct: 8, element: "土", shield: 24 },
  voidMethod: { id: "voidMethod", name: "太虚挪移法", rarity: 5, role: "奇袭", speed: 36, reducePct: 12, damagePct: 8, element: "阴", elementDamage: 36, slow: 16 },
  lotusMethod: { id: "lotusMethod", name: "净世莲华诀", rarity: 4, role: "辅助", hp: 34, temper: 16, reducePct: 8, element: "木", heal: 30, shield: 18 },
  mirrorMethod: { id: "mirrorMethod", name: "明镜返照功", rarity: 3, role: "反制", def: 22, reducePct: 10, damagePct: 5, element: "水", shield: 30 },
  beastMethod: { id: "beastMethod", name: "驭兽通灵诀", rarity: 3, role: "讨伐", atk: 18, hp: 30, damagePct: 9, element: "木", elementDamage: 18 },
  rainMethod: { id: "rainMethod", name: "甘霖渡厄篇", rarity: 3, role: "续航", hp: 38, temper: 12, reducePct: 7, element: "水", heal: 32 },
  sunMethod: { id: "sunMethod", name: "大日焚天经", rarity: 5, role: "阳火", atk: 32, damagePct: 16, element: "阳", elementDamage: 46, heal: 18 },
  moonMethod: { id: "moonMethod", name: "寒月照神章", rarity: 5, role: "阴水", def: 22, temper: 18, reducePct: 13, element: "阴", elementDamage: 42, slow: 18 },
  plagueMethod: { id: "plagueMethod", name: "瘟云百厄经", rarity: 4, role: "毒压", atk: 16, damagePct: 8, element: "毒", elementDamage: 34, poison: 24, pierce: 8 },
};
Object.assign(itemCatalog, {
  cloudSword: { name: "流云问心剑", kind: "装备", equipment: true, slot: "weapon", stats: { atk: 28, speed: 10 }, text: "剑光如云，适合先手压制。" },
  meteorHammer: { name: "陨星镇岳锤", kind: "装备", equipment: true, slot: "weapon", stats: { atk: 36, hp: 18 }, text: "重器破阵，爆发高但更吃体魄。" },
  jadeFan: { name: "青玉万象扇", kind: "装备", equipment: true, slot: "weapon", stats: { atk: 20, luck: 14, charm: 8 }, text: "攻守兼备，适合机缘探索。" },
  dragonSaber: { name: "蟠龙断海刀", kind: "装备", equipment: true, slot: "weapon", stats: { atk: 34, damagePct: 4 }, text: "刀势大开大合，越战越烈。" },
  voidDagger: { name: "太虚影刃", kind: "装备", equipment: true, slot: "weapon", stats: { atk: 24, speed: 22, pierce: 5 }, text: "贴身破防，适合身法弟子。" },
  sunStaff: { name: "大日扶桑杖", kind: "装备", equipment: true, slot: "weapon", stats: { atk: 26, hp: 24, elementDamage: { "阳": 10 } }, text: "阳火入骨，兼顾回复功法。" },
  moonBell: { name: "寒月摄魂铃", kind: "装备", equipment: true, slot: "artifact", stats: { def: 14, temper: 18, reducePct: 3 }, text: "铃声定魂，可压低心魔风险。" },
  spiritGourd: { name: "紫府纳灵葫", kind: "装备", equipment: true, slot: "artifact", stats: { hp: 32, luck: 12 }, text: "纳灵养身，适合长线副本。" },
  thunderDrum: { name: "九霄雷鼓", kind: "装备", equipment: true, slot: "artifact", stats: { atk: 22, speed: 12, elementDamage: { "雷": 12 } }, text: "雷鼓一响，先手与雷伤并进。" },
  fateBrush: { name: "命书判星笔", kind: "装备", equipment: true, slot: "artifact", stats: { luck: 22, critPct: 4, charm: 8 }, text: "改写一线命数，偏向暴击与奇遇。" },
  soulBanner: { name: "幽都摄魂幡", kind: "装备", equipment: true, slot: "artifact", stats: { atk: 18, def: 12, elementDamage: { "阴": 12 } }, text: "阴属罕见法器，适合控制流。" },
  iceArmor: { name: "玄霜锁灵甲", kind: "装备", equipment: true, slot: "armor", stats: { hp: 44, def: 20, reducePct: 3 }, text: "厚甲锁灵，稳定承伤。" },
  lotusRobe: { name: "净莲无垢衣", kind: "装备", equipment: true, slot: "armor", stats: { hp: 34, temper: 16, luck: 8 }, text: "适合辅助与探索弟子。" },
  demonMail: { name: "镇魔黑鳞铠", kind: "装备", equipment: true, slot: "armor", stats: { hp: 52, def: 18, atk: 8 }, text: "黑鳞护身，偏向近战硬拼。" },
  starMantle: { name: "星河披霞裘", kind: "装备", equipment: true, slot: "armor", stats: { hp: 30, speed: 10, reducePct: 4 }, text: "以星辉卸力，适合高阶斗法。" },
  phoenixPearl: { name: "凤血涅槃珠", kind: "装备", equipment: true, slot: "spirit", stats: { hp: 36, damagePct: 3, lifeSteal: 4 }, text: "涅槃血气，提升续航。" },
  abyssSeal: { name: "渊海归墟印", kind: "装备", equipment: true, slot: "spirit", stats: { def: 18, elementDamage: { "水": 12 }, shieldPower: 16 }, text: "水属镇压，开局护盾更厚。" },
  fiveElementOrb: { name: "五行轮转珠", kind: "装备", equipment: true, slot: "spirit", stats: { atk: 12, def: 12, hp: 24, elementDamage: { "金": 5, "木": 5, "水": 5, "火": 5, "土": 5 } }, text: "五行小成，属性伤害全面。" },
  cloudBoots: { name: "踏云逐月履", kind: "装备", equipment: true, slot: "accessory", stats: { speed: 30, luck: 8 }, text: "极大提升身法先手。" },
  jadePendant: { name: "玄玉养魂佩", kind: "装备", equipment: true, slot: "accessory", stats: { temper: 22, hp: 22, reducePct: 2 }, text: "养魂安神，适合禁地外的长线养成。" },
  bloodCharm: { name: "赤血同心符", kind: "装备", equipment: true, slot: "accessory", stats: { atk: 16, critDamage: 10, lifeSteal: 3 }, text: "血符燃战，爆发与吸血兼顾。" },
});
const extraMethodCatalog = {
  cloudRainMethod: { id: "cloudRainMethod", name: "行云布雨诀", rarity: 2, role: "群疗", hp: 26, reducePct: 4, element: "水", heal: 26, shield: 10 },
  firePhoenixMethod: { id: "firePhoenixMethod", name: "离火凤鸣经", rarity: 4, role: "火爆", atk: 26, speed: 6, damagePct: 13, element: "火", elementDamage: 36 },
  goldenBodyMethod: { id: "goldenBodyMethod", name: "不坏金身录", rarity: 3, role: "重防", hp: 54, def: 26, reducePct: 9, element: "金", shield: 30 },
  thousandShadowMethod: { id: "thousandShadowMethod", name: "千影幻身步", rarity: 3, role: "闪击", speed: 34, damagePct: 6, element: "雷", elementDamage: 18, slow: 8 },
  greenVineMethod: { id: "greenVineMethod", name: "青藤缚灵术", rarity: 2, role: "控制", hp: 24, def: 10, element: "木", elementDamage: 16, slow: 12 },
  deepSeaMethod: { id: "deepSeaMethod", name: "沧海归元诀", rarity: 3, role: "续航", hp: 44, def: 12, reducePct: 7, element: "水", heal: 38 },
  earthPulseMethod: { id: "earthPulseMethod", name: "地脉镇岳功", rarity: 3, role: "护阵", hp: 48, def: 24, element: "土", shield: 34, reducePct: 8 },
  thunderPrisonMethod: { id: "thunderPrisonMethod", name: "紫霄雷狱典", rarity: 4, role: "雷控", atk: 24, speed: 14, damagePct: 10, element: "雷", elementDamage: 38, slow: 10 },
  poisonFogMethod: { id: "poisonFogMethod", name: "碧落毒雾经", rarity: 3, role: "毒耗", atk: 12, damagePct: 6, element: "毒", elementDamage: 24, poison: 26 },
  yinGhostMethod: { id: "yinGhostMethod", name: "玄阴鬼步", rarity: 4, role: "阴袭", speed: 26, reducePct: 8, element: "阴", elementDamage: 34, pierce: 8 },
  yangHeartMethod: { id: "yangHeartMethod", name: "纯阳炼心诀", rarity: 4, role: "阳护", atk: 18, hp: 34, damagePct: 9, element: "阳", elementDamage: 32, heal: 20 },
  fiveElementMethod: { id: "fiveElementMethod", name: "五行归藏录", rarity: 5, role: "五行", atk: 18, def: 18, hp: 36, damagePct: 9, reducePct: 7, element: "土", elementDamage: 40, shield: 18 },
  swordHeartMethod: { id: "swordHeartMethod", name: "一剑生莲诀", rarity: 4, role: "剑修", atk: 32, speed: 10, damagePct: 14, element: "金", elementDamage: 30, critPct: 6 },
  saberSoulMethod: { id: "saberSoulMethod", name: "霸刀断魂经", rarity: 4, role: "重击", atk: 38, hp: 20, damagePct: 15, element: "火", elementDamage: 28, selfHurt: 5 },
  spearRiverMethod: { id: "spearRiverMethod", name: "长河贯日枪", rarity: 3, role: "穿刺", atk: 26, speed: 8, damagePct: 8, element: "水", elementDamage: 22, pierce: 12 },
  bellGuardMethod: { id: "bellGuardMethod", name: "金钟护命篇", rarity: 2, role: "护盾", def: 20, hp: 30, reducePct: 6, element: "金", shield: 28 },
  alchemyBreathMethod: { id: "alchemyBreathMethod", name: "丹息养元法", rarity: 2, role: "养元", hp: 36, temper: 14, element: "木", heal: 30 },
  arrayStarMethod: { id: "arrayStarMethod", name: "星斗布阵录", rarity: 3, role: "阵修", def: 18, luck: 14, reducePct: 7, element: "金", shield: 24 },
  merchantLuckMethod: { id: "merchantLuckMethod", name: "聚财通玄诀", rarity: 2, role: "奇遇", luck: 28, charm: 12, speed: 8, element: "木", heal: 14 },
  beastRoarMethod: { id: "beastRoarMethod", name: "万兽震山吼", rarity: 3, role: "压制", atk: 22, hp: 34, damagePct: 8, element: "土", elementDamage: 22, slow: 8 },
  bloodRiverMethod: { id: "bloodRiverMethod", name: "血河燃魂术", rarity: 4, role: "吸血", atk: 30, damagePct: 12, element: "火", elementDamage: 32, lifeSteal: 10, selfHurt: 6 },
  voidLotusMethod: { id: "voidLotusMethod", name: "虚莲照界篇", rarity: 5, role: "稀有", hp: 38, speed: 20, reducePct: 12, element: "阴", elementDamage: 44, shield: 30 },
  sunMoonMethod: { id: "sunMoonMethod", name: "日月同辉经", rarity: 5, role: "阴阳", atk: 28, def: 22, damagePct: 12, reducePct: 10, element: "阳", elementDamage: 48, heal: 22 },
  chaosSeedMethod: { id: "chaosSeedMethod", name: "混沌种道诀", rarity: 5, role: "极稀", atk: 26, hp: 52, damagePct: 14, reducePct: 8, element: "阴", elementDamage: 52, pierce: 10 },
  frostFireMethod: { id: "frostFireMethod", name: "冰火两仪诀", rarity: 4, role: "双修", atk: 22, def: 14, damagePct: 10, element: "火", elementDamage: 34, slow: 10 },
  windThunderMethod: { id: "windThunderMethod", name: "风雷遁天术", rarity: 4, role: "先手", speed: 40, damagePct: 9, element: "雷", elementDamage: 30, pierce: 6 },
  mountainSeaMethod: { id: "mountainSeaMethod", name: "山海镇灵卷", rarity: 4, role: "坦修", hp: 70, def: 24, reducePct: 11, element: "土", shield: 42 },
  heavenMirrorMethod: { id: "heavenMirrorMethod", name: "照天明镜诀", rarity: 3, role: "反制", def: 24, luck: 12, reducePct: 8, element: "水", shield: 32 },
  demonSealMethod: { id: "demonSealMethod", name: "封魔十二禁", rarity: 4, role: "封禁", atk: 18, def: 18, damagePct: 8, reducePct: 8, element: "阴", elementDamage: 36, slow: 14 },
};
for (const [id, data] of Object.entries(extraMethodCatalog)) {
  methodCatalog[id] = data;
  itemCatalog[id] = {
    name: data.name,
    kind: "功法",
    manual: true,
    text: `${data.role || "功法"}功法，可参悟并随熟练度线性增强。`,
  };
}
const methodItemIds = Object.keys(methodCatalog);
const equipmentItemIds = Object.keys(itemCatalog).filter((id) => itemCatalog[id]?.equipment && itemCatalog[id].slot !== "relic");
const marketGoods = [
  { id: "riceBond", name: "灵米期契", base: 86, volatility: 16, text: "受粮草丰歉与宗门战争影响，波动较稳。" },
  { id: "oreBond", name: "寒铁矿券", base: 128, volatility: 24, text: "矿脉争夺越激烈，价格越容易上冲或崩落。" },
  { id: "pillDust", name: "丹砂票据", base: 112, volatility: 22, text: "炼丹热潮会推高价格，药灾会造成跳水。" },
  { id: "routePermit", name: "商路关牒", base: 158, volatility: 31, text: "外交与战乱高度敏感，适合高风险倒卖。" },
  { id: "spiritWood", name: "灵木牌", base: 96, volatility: 18, text: "建设潮会推高，灾年会回落。" },
];
const resourceUpgradeCatalog = [
  { key: "outpost", name: "镇守营", max: 3, baseCost: 220, text: "提高守点防御，降低 AI 偷袭与夺点成功率。" },
  { key: "arrayEye", name: "阵眼台", max: 3, baseCost: 280, text: "提高驻守弟子与护山大阵联动，灵泉与矿脉会额外产出阵材。" },
  { key: "extractor", name: "采脉司", max: 3, baseCost: 260, text: "提高资源点年度产出，但会让敌宗更想争夺。" },
  { key: "depot", name: "储灵仓", max: 3, baseCost: 240, text: "减少被偷袭损失，并少量提高灵石与粮草收益。" },
];
const councilTopics = [
  { key: "peace", name: "止戈令", text: "未来三年敌宗偷袭概率下降，但主动掠夺收益也会略降。" },
  { key: "relic", name: "开秘境", text: "大地图额外刷新机缘，世界奇遇更容易提前出现。" },
  { key: "trade", name: "商税令", text: "市集价格波动更大，擅长交易的宗门能获利，判断失误也更伤。" },
  { key: "frontier", name: "边境戍守", text: "本宗资源点防守提高，仙盟要求各宗投入资源建设。" },
  { key: "crusade", name: "讨伐强宗", text: "削弱最强敌宗的底蕴与态度，声誉提高但会增加敌意。" },
];
const auctionLotCatalog = [
  { key: "pill", name: "渡劫丹匣", item: "tribPill", quality: 2, base: 360, text: "适合中期压低渡劫风险，但价格不低。" },
  { key: "recipeMarrow", name: "洗髓丹方残卷", recipe: "marrowPill", base: 520, text: "解锁洗髓丹方，长期提升弟子体魄与资质。" },
  { key: "recipeHeart", name: "净心丹方残卷", recipe: "heartLotus", base: 500, text: "解锁净心丹方，压低心魔与渡劫压力。" },
  { key: "recipeMidHeal", name: "玉露还元丹方", recipe: "midHealPill", base: 680, text: "解锁中阶回血丹，是边境讨伐的关键补给。" },
  { key: "recipeHighHeal", name: "九转续命丹方", recipe: "highHealPill", base: 1180, text: "解锁高阶续命丹，昂贵但能撑过高阶副本。" },
  { key: "recipeTrib", name: "渡厄丹方残卷", recipe: "tribPill", base: 760, text: "解锁渡厄丹方，能提高渡劫成功率。" },
  { key: "blade", name: "旧朝名剑", item: "spiritBlade", quality: 2, base: 430, text: "直接入库，可给核心弟子装备。" },
  { key: "talisman", name: "镇山古符", item: "guardTalisman", quality: 2, base: 390, text: "偏防御与守点，适合保护资源。" },
  { key: "robe", name: "流云法袍", item: "cloudRobe", quality: 2, base: 460, text: "防具槽装备，提供体魄、守御与随机词条。" },
  { key: "spiritRing", name: "聚灵古戒", item: "spiritRing", quality: 3, base: 640, text: "灵器槽装备，更容易刷出高价值词条。" },
  { key: "thunderManual", name: "紫霄雷法卷", item: "thunderMethod", quality: 2, base: 620, text: "雷属性功法，可让核心弟子获得爆发能力。" },
  { key: "earthManual", name: "厚土玄功卷", item: "earthMethod", quality: 2, base: 560, text: "防御功法，适合边境副本和宗门大比。" },
  { key: "yinManual", name: "太阴玄照录", item: "yinMethod", quality: 3, base: 980, text: "稀有阴属性功法，控制与减伤兼具。" },
  { key: "yangManual", name: "太阳真火经", item: "yangMethod", quality: 3, base: 1040, text: "稀有阳属性功法，爆发、回血与阳伤兼备。" },
  { key: "voidMirror", name: "太虚镜胚", item: "voidMirror", quality: 3, base: 1120, text: "高阶灵器，可能洗出阴阳属性词条。" },
  { key: "refinePack", name: "洗练匣", item: "refineStone", quality: 0, base: 260, text: "用于重洗装备词条，适合追求红词条。" },
  { key: "lockPack", name: "定纹玉扣", item: "affixLock", quality: 0, base: 360, text: "用于锁定装备词条位，洗练高阶装备时很关键。" },
  { key: "manual", name: "残卷功法", item: "swordManual", quality: 1, base: 310, text: "增加仓库物品，并补充参悟。" },
  { key: "alchemy", name: "异域丹材包", grant: "alchemy", base: 260, text: "随机获得两份专用丹材。" },
  { key: "forging", name: "陨铁器材包", grant: "forging", base: 280, text: "随机获得两份专用器材。" },
  { key: "array", name: "阵眼玉料", grant: "array", base: 330, text: "补充阵材，适合护山大阵路线。" },
  { key: "intel", name: "影网名册", grant: "intel", base: 220, text: "生成一批情报，并降低一次暗线风险。" },
];
const traits = [
  { name: "天生剑骨", atk: 18, speed: 6, note: "斗法伤害提升" },
  { name: "丹心通明", grow: 16, hp: 8, note: "修行更快" },
  { name: "阵道奇才", barrier: 18, def: 8, note: "护山大阵收益提升" },
  { name: "丹道宗师", alchemy: 26, grow: 8, note: "炼丹品质提升，概率越阶成丹" },
  { name: "器魂入体", forging: 26, atk: 8, note: "炼器品质提升，概率越阶成器" },
  { name: "火候天成", alchemy: 14, forging: 14, temper: 8, note: "炼丹炼器稳定提升" },
  { name: "商贾血脉", stones: 18, note: "灵石产出提升" },
  { name: "铁算盘心", trade: 10, stonesPct: 10, note: "山门市集收益提高，年度灵石获取提高一成" },
  { name: "灵根驳杂", grow: -8, hp: 14, note: "成长慢但体魄好" },
  { name: "杀伐心重", atk: 12, def: -4, note: "掠夺更强" },
  { name: "福缘深厚", luck: 18, note: "随机事件更优" },
  { name: "魅骨天成", charm: 20, note: "抢徒和结盟更强" },
  { name: "寒门苦修", grow: 10, def: 10, note: "稳定成长" },
  { name: "心魔暗伏", atk: 18, luck: -12, note: "强大但事件风险高" },
  { name: "边塞镇守", garrison: 12, def: 8, note: "驻守资源点时提供少量防守加成" },
  { name: "猎妖血脉", beast: 14, atk: 6, note: "边境讨伐妖兽时战力提高" },
  { name: "禁地孤胆", forbidden: 14, temper: 6, note: "禁地爬塔初始属性更稳" },
  { name: "拍卖老手", trade: 8, stonesPct: 10, note: "市集和拍卖判断更强，灵石收益提高一成" },
];

const daoHeartCatalog = [
  { id: "sword", name: "剑心通明", text: "偏向主动出击和剑诀爆发，战斗越多成长越快。", stats: { atk: 10, speed: 5 }, growth: 0.08, battle: 34, methodRole: "攻击" },
  { id: "alchemy", name: "丹心澄澈", text: "更擅长炼丹、修复伤势和稳定心魔。", stats: { temper: 8, aptitude: 6 }, growth: 0.06, craft: { alchemy: 26 }, mindEase: 3, methodRole: "回血" },
  { id: "guardian", name: "守山执念", text: "擅长护宗、防守和持久战。", stats: { hp: 18, def: 8 }, growth: 0.04, battle: 24, methodRole: "防御" },
  { id: "profit", name: "逐利灵台", text: "擅长交易和机缘判断，但心境更容易摇摆。", stats: { luck: 8, charm: 7 }, growth: 0.04, trade: 0.04, mindRisk: 2, methodRole: "增益" },
  { id: "battle", name: "斗战道心", text: "适合宗门大比、劫掠和边境讨伐。", stats: { atk: 8, hp: 10 }, growth: 0.07, battle: 42, mindRisk: 2, methodRole: "攻击" },
  { id: "wander", name: "逍遥本心", text: "适合探索、世界奇遇和闪避先手。", stats: { luck: 7, speed: 7 }, growth: 0.05, explore: 24, methodRole: "控制" },
  { id: "demonic", name: "魔性未泯", text: "战力提升高，但心魔风险也高。", stats: { atk: 14, damagePct: 4 }, growth: 0.08, battle: 50, mindRisk: 5, methodRole: "毒伤" },
  { id: "benevolent", name: "仁善慧心", text: "稳定心境、保护队友，适合协作和远征。", stats: { temper: 10, reducePct: 3 }, growth: 0.05, support: 30, mindEase: 4, methodRole: "护盾" },
];

const constitutionCatalog = [
  { id: "swordBone", name: "先天剑骨", weight: 20, text: "天生适合剑修，攻击和身法极强。", stats: { atk: 22, speed: 10, aptitude: 6 }, battle: 115 },
  { id: "yangBody", name: "九阳灵体", weight: 15, text: "阳火旺盛，气血充沛，火阳伤害更强。", stats: { hp: 32, atk: 8 }, elementDamage: { fire: 18, yang: 8 }, battle: 130 },
  { id: "yinBody", name: "玄阴道体", weight: 15, text: "阴寒入脉，擅长控制和减伤。", stats: { def: 12, temper: 8 }, elementDamage: { water: 12, yin: 10 }, battle: 128 },
  { id: "poisonBody", name: "百毒灵胎", weight: 16, text: "毒性亲和，擅长持续伤害。", stats: { hp: 16, luck: 5 }, elementDamage: { poison: 22 }, battle: 120 },
  { id: "thunderRoot", name: "雷灵根", weight: 14, text: "雷法亲和，爆发和先手极强。", stats: { atk: 12, speed: 12 }, elementDamage: { thunder: 20 }, battle: 138 },
  { id: "fiveElement", name: "五行道胎", weight: 10, text: "五行俱全，属性伤害全面但成长慢热。", stats: { aptitude: 12, grow: 8 }, elementDamage: { metal: 8, wood: 8, water: 8, fire: 8, earth: 8 }, battle: 150 },
  { id: "mortalFate", name: "凡体逆命", weight: 8, text: "初看平凡，境界越高越能逆命。", stats: { grow: 18, temper: 12 }, battle: 80 },
  { id: "chaosVessel", name: "混沌灵胚", weight: 2, text: "极稀有体质，阴阳五行皆可承载。", stats: { hp: 38, atk: 16, def: 16, speed: 10, aptitude: 18 }, elementDamage: { yin: 18, yang: 18 }, battle: 280 },
];

const specializationCatalog = [
  { id: "sword", name: "剑修", text: "单体爆发、宗门大比和切磋更强。", stats: { atk: 2, speed: 1 }, battlePerLevel: 18 },
  { id: "body", name: "体修", text: "高血量高防御，适合边境和巨兽。", stats: { hp: 8, def: 2 }, battlePerLevel: 16 },
  { id: "alchemy", name: "丹修", text: "炼丹、回血功法和心魔压制更强。", stats: { aptitude: 2, temper: 2 }, craft: { alchemy: 12 }, battlePerLevel: 9 },
  { id: "forging", name: "器修", text: "炼器、本命法宝和装备词条利用更强。", stats: { def: 2, atk: 1 }, craft: { forging: 12 }, battlePerLevel: 12 },
  { id: "array", name: "阵修", text: "阵法、防守和资源驻守更强。", stats: { def: 2, temper: 1 }, craft: { array: 12 }, battlePerLevel: 12 },
  { id: "poison", name: "毒修", text: "持续伤害和削弱敌方更强。", stats: { atk: 1, luck: 1 }, elementDamage: { poison: 2 }, battlePerLevel: 15 },
  { id: "thunder", name: "雷修", text: "先手、爆发和雷属性伤害更强。", stats: { atk: 1, speed: 2 }, elementDamage: { thunder: 2 }, battlePerLevel: 17 },
  { id: "yinYang", name: "阴阳修", text: "稀有路线，兼具回血、爆发和属性压制。", stats: { aptitude: 2, speed: 1 }, elementDamage: { yin: 1, yang: 1 }, battlePerLevel: 20 },
];

const discipleTitleCatalog = [
  { id: "youngSword", name: "少宗剑魁", text: "攻击破百后获得，剑修战力更显著。", condition: (d) => d.atk >= 100, stats: { atk: 5, speed: 2 }, battle: 45 },
  { id: "thunderHeir", name: "雷坛真传", text: "雷属性伤害达到一定值后获得。", condition: (d) => (d.elementDamage?.thunder || 0) >= 25, stats: { speed: 3 }, elementDamage: { thunder: 5 }, battle: 55 },
  { id: "danMaster", name: "丹房首席", text: "丹修或丹道词条弟子长期培养后获得。", condition: (d) => traitCraftBonus(d, "alchemy") >= 26 || d.specialization === "alchemy", stats: { aptitude: 4, temper: 3 }, battle: 24 },
  { id: "mountainGuard", name: "镇山真君", text: "高防御弟子获得，驻守和防御战更稳。", condition: (d) => d.def >= 90 || (d.arrayLevel || 0) >= 3, stats: { hp: 12, def: 5 }, battle: 50 },
  { id: "bossSlayer", name: "斩妖名宿", text: "高境界战斗弟子获得，边境副本表现更强。", condition: (d) => d.realm >= 3 && discipleBattleScore(d) >= 1800, stats: { atk: 6, hp: 12 }, battle: 70 },
  { id: "wayfarer", name: "天涯行者", text: "高气运高身法弟子获得，探索收益更好。", condition: (d) => d.luck >= 55 && d.speed >= 80, stats: { luck: 4, speed: 3 }, battle: 35 },
];

const sectRoutes = [
  { id: "orthodox", name: "正道盟宗", text: "声誉、仙盟会议与结盟更强，但恶名过高会拖累路线收益。", reward: { prestige: 80, insight: 30 } },
  { id: "warlord", name: "霸道战宗", text: "掠夺、边境扩张和宗门大比更强，但更容易被合围。", reward: { stones: 180, prestige: 40 } },
  { id: "merchant", name: "商会仙门", text: "山门市集、拍卖与灵石周转更强，但军事目标更难。", reward: { stones: 260, insight: 15 } },
  { id: "hermit", name: "隐修道统", text: "机缘、禁地和弟子养成更强，前期外交影响较低。", reward: { insight: 70, alchemyMats: 1 } },
  { id: "demonic", name: "魔道独行", text: "高风险高收益，掠夺与心魔转化更强，但仙盟关系更差。", reward: { forgingMats: 2, prestige: 20 } },
];

const victoryGoals = [
  { id: "ascend", name: "飞升结局", text: "培养出渡劫巅峰弟子并完成飞升仪式，难度最高。" },
  { id: "leader", name: "仙盟盟主", text: "长期主导仙盟会议，积累声誉和多数宗门支持。" },
  { id: "overlord", name: "天下第一宗", text: "综合战力、声望和宗门大比成绩压过所有宗门。" },
  { id: "tycoon", name: "商业霸主", text: "建设满级市集并通过交易积累巨量灵石。" },
  { id: "arrayHeaven", name: "阵法天庭", text: "打造高品护山大阵并控制大量资源节点。" },
  { id: "demonicSupreme", name: "魔道独尊", text: "以掠夺、灭宗和高恶名路线压服天下。" },
];

const missionCatalog = [
  { id: "firstRecruit", name: "开山收徒", text: "完成第一次年度招募。", reward: { prestige: 18, stones: 60 }, check: () => state.sect?.disciples.length >= 5 },
  { id: "firstResource", name: "立稳资源", text: "占领任意 2 个资源点。", reward: { stones: 90, grain: 60 }, check: () => state.resources.filter((r) => r.owner === "player").length >= 2 },
  { id: "firstCraft", name: "开炉有成", text: "仓库中拥有任意 3 件丹药或装备。", reward: { alchemyMats: 1, forgingMats: 1 }, check: () => state.sect?.inventory?.filter((i) => !itemCatalog[i.id]?.material).reduce((s, i) => s + i.count, 0) >= 3 },
  { id: "marketOpen", name: "山门市集", text: "建设山门市集到 1 级。", reward: { stones: 120 }, check: () => state.sect?.buildings?.market >= 1 },
  { id: "frontierOpen", name: "边境试炼", text: "拥有 3 名金丹及以上弟子，解锁边境地图。", reward: { prestige: 40, grain: 120 }, check: () => frontierUnlocked() },
  { id: "firstBeast", name: "初讨妖兽", text: "完成一次边境讨伐副本。", reward: { stones: 120, alchemyMats: 1 }, check: () => state.frontier?.clears > 0 },
  { id: "firstArray", name: "阵道初成", text: "推演出任意阵图。", reward: { arrayMats: 1, insight: 30 }, check: () => state.sect?.formations?.length > 0 },
  { id: "forbiddenTry", name: "禁地初探", text: "进入一次禁地爬塔。", reward: { prestige: 30, insight: 30 }, check: () => (state.forbidden?.totalRuns || 0) > 0 },
];

const ascensionMaterials = {
  3: "nascentBead",
  4: "spiritInfantJade",
  5: "voidScale",
  6: "tribulationBone",
  7: "immortalAsh",
  8: "immortalAsh",
};

const frontierDungeonTemplates = [
  { tier: 2, name: "铁脊狼巢", glyph: "狼", material: "nascentBead", minPower: 900, reward: { stones: 160, grain: 100 }, text: "金丹级妖兽巢穴，适合中期队伍练手。" },
  { tier: 2, name: "赤角妖蟒窟", glyph: "蟒", material: "nascentBead", minPower: 1080, reward: { alchemyMats: 1 }, text: "毒瘴与药材并存，掉落元婴晋升材料。" },
  { tier: 3, name: "荒原兽王岭", glyph: "王", material: "spiritInfantJade", minPower: 1680, reward: { stones: 260, prestige: 30 }, text: "元婴级首领盘踞，能产出化神晋升材料。" },
  { tier: 4, name: "裂空鹰渊", glyph: "鹰", material: "voidScale", minPower: 2450, reward: { forgingMats: 2, prestige: 45 }, text: "化神级妖禽盘踞，刷新较少，收益更高。" },
  { tier: 5, name: "劫骨古战场", glyph: "劫", material: "tribulationBone", minPower: 3500, reward: { arrayMats: 2, prestige: 65 }, text: "炼虚级高危战场，失败代价极高。" },
  { tier: 6, name: "仙灰天坑", glyph: "灰", material: "immortalAsh", minPower: 5100, reward: { stones: 520, prestige: 90 }, text: "顶级边境副本，掉落大乘以上晋升材料。" },
];

const forbiddenRelics = [
  { id: "brokenFurnace", name: "残仙炉", rarity: "red", tower: { alchemy: 34, hp: -8 }, text: "禁地内炼化收益提高。带出后：炼丹品质提高，但失败或越阶时会伤弟子。" },
  { id: "bloodCompass", name: "血纹罗盘", rarity: "purple", tower: { atk: 26, luck: 10 }, text: "禁地内更容易找到奖励。带出后：探索收益提高，但心魔增长加快。" },
  { id: "coldMoonBell", name: "寒月铃", rarity: "blue", tower: { def: 18, temper: 12 }, text: "禁地内降低伤害。带出后：渡劫更稳，但年度修行略慢。" },
  { id: "ashCrown", name: "灰烬王冠", rarity: "red", tower: { atk: 38, def: 10 }, text: "禁地内战斗极强。带出后：斗法强，但外交关系更易恶化。" },
  { id: "jadeBone", name: "玉骨签", rarity: "purple", tower: { hp: 28, def: 14 }, text: "禁地内生存力提高。带出后：体魄成长提高，但市集交易税略高。" },
  { id: "silentLamp", name: "无声魂灯", rarity: "blue", tower: { temper: 20, luck: 8 }, text: "禁地内死亡风险降低。带出后：心魔压制更强，但掠夺收益降低。" },
  { id: "starShard", name: "坠星碎片", rarity: "purple", tower: { speed: 20, atk: 16 }, text: "禁地内先手更强。带出后：边境讨伐更强，但受伤更重。" },
  { id: "oldSeal", name: "旧盟残印", rarity: "blue", tower: { charm: 20, def: 8 }, text: "禁地内事件判定更稳。带出后：仙盟投票更强，但恶名收益下降。" },
  { id: "demonNail", name: "天魔指骨", rarity: "red", tower: { atk: 46, luck: -10 }, text: "禁地内爆发极高。带出后：魔道路线强，但弟子更易心魔。" },
  { id: "riverMirror", name: "忘川镜", rarity: "purple", tower: { hp: 16, temper: 24 }, text: "禁地内可抵消一次重伤。带出后：渡劫失败损失降低，但成长略慢。" },
];

const forbiddenBuffs = [
  { name: "剑意入骨", rarity: "blue", atk: 18, text: "本次禁地攻伐提高。" },
  { name: "玄甲覆身", rarity: "blue", def: 18, hp: 10, text: "本次禁地防守提高。" },
  { name: "灵息回旋", rarity: "blue", hp: 26, text: "本次禁地生命上限提高。" },
  { name: "破阵血锋", rarity: "purple", atk: 32, speed: 10, text: "本次禁地进攻与先手提高。" },
  { name: "不灭心灯", rarity: "purple", temper: 30, hp: 14, text: "本次禁地稳定性提高。" },
  { name: "星河借命", rarity: "red", hp: 52, luck: 18, text: "本次禁地容错大幅提高。" },
  { name: "天魔燃魂", rarity: "red", atk: 58, hp: -12, text: "本次禁地爆发极强，但血量降低。" },
];

const sectPositionCatalog = [
  { id: "chief", name: "首席弟子", text: "带队修行与大比指挥，战力与宗门声望略增。", stat: "atk", battle: 95 },
  { id: "law", name: "执律弟子", text: "压制心魔、处理内务，降低年度心魔风险。", stat: "temper", battle: 55 },
  { id: "alchemy", name: "丹房执事", text: "协助炼丹与药材整理，年度丹材略增。", stat: "aptitude", battle: 35 },
  { id: "forge", name: "器堂执事", text: "协助炼器与洗练，年度器材略增。", stat: "def", battle: 45 },
  { id: "diplomat", name: "外务使", text: "负责结盟、交易与声望，外交收益提高。", stat: "charm", battle: 30 },
  { id: "spymaster", name: "影网使", text: "负责暗线与反谍，情报行动更稳定。", stat: "speed", battle: 40 },
];

const reputationPaths = [
  { id: "righteous", name: "正道名门", text: "声望高，盟友与仙盟收益更好。", condition: () => (state.sect?.diplomacy?.reputation || 0) >= 120 && (state.sect?.diplomacy?.infamy || 0) < 55 },
  { id: "demonic", name: "魔道巨擘", text: "恶名高，掠夺与心魔收益更强但外交承压。", condition: () => (state.sect?.diplomacy?.infamy || 0) >= 85 },
  { id: "merchant", name: "商盟客卿", text: "灵石与市集收益更稳定。", condition: () => (state.sect?.buildings?.market || 0) >= 2 || (state.sect?.stones || 0) >= 3600 },
  { id: "war", name: "战宗铁门", text: "资源争夺与大比更强。", condition: () => sectPower() >= 8500 || state.lastTournamentYear > 0 },
  { id: "hermit", name: "隐修道统", text: "机缘、禁地和弟子养成收益更好。", condition: () => true },
];

const worldChainCatalog = [
  {
    id: "demonRift",
    name: "魔门复苏",
    stages: ["魔气入山，心魔更易滋生。", "边境魔修劫道，敌对宗门更躁动。", "魔潮退去，压制心魔者获得参悟。"],
  },
  {
    id: "spiritVein",
    name: "灵脉崩裂",
    stages: ["地脉震荡，资源点价值上浮。", "灵气外泄，机缘点更密集。", "灵脉归槽，持有资源点者获得额外灵石。"],
  },
  {
    id: "leagueSchism",
    name: "仙盟内争",
    stages: ["仙盟议席生变，声望路线更重要。", "各宗互探虚实，情报行动收益提高。", "内争平息，榜单前列宗门获得名望。"],
  },
];

const secretRealmRooms = [
  { id: "treasure", name: "遗宝石室", risk: 24, reward: "gear", text: "有装备或洗练材料，但守禁较强。" },
  { id: "scripture", name: "残经壁", risk: 18, reward: "method", text: "更容易获得功法与熟练度。" },
  { id: "herb", name: "灵药园", risk: 14, reward: "alchemy", text: "偏向丹材与恢复。" },
  { id: "trial", name: "问心阶", risk: 28, reward: "mind", text: "风险高，但可压心魔、涨道心。" },
];

const portraitAssetMap = {};
const portraitStyles = ["sword", "alchemy", "forge", "shadow", "lotus", "thunder", "demon", "elder"];

const delegationTasks = [
  { id: "patrol", name: "巡山护法", text: "降低危机与偷袭风险，少量声望。", stat: "temper", reward: (d) => ({ prestige: 6 + d.realm * 2, barrier: 3 }) },
  { id: "forage", name: "采药寻矿", text: "获取丹材、器材或灵石。", stat: "luck", reward: (d) => ({ alchemyMats: 1 + Math.floor(d.luck / 70), forgingMats: Math.random() < 0.45 ? 1 : 0, stones: 45 + d.realm * 18 }) },
  { id: "caravan", name: "护送商队", text: "获取灵石，外务弟子收益更高。", stat: "charm", reward: (d) => ({ stones: 110 + d.charm * 3 + d.realm * 35, prestige: 3 }) },
  { id: "intel", name: "影网探听", text: "提高影网，提前压低危机。", stat: "speed", reward: (d) => ({ spyNetwork: 5 + Math.floor((d.speed + d.luck) / 32), insight: 8 }) },
  { id: "teach", name: "讲法授业", text: "给低境界弟子提供修为。", stat: "aptitude", reward: (d) => ({ insight: 8 + Math.floor(d.aptitude / 18), teachExp: 5 + d.realm * 2 }) },
  { id: "craft", name: "丹器杂役", text: "整理丹房器堂，补充基础材料。", stat: "def", reward: (d) => ({ alchemyMats: Math.random() < 0.55 ? 1 : 0, forgingMats: 1, refineStone: Math.random() < 0.28 ? 1 : 0 }) },
];

const sectCrisisCatalog = [
  { id: "mindTide", name: "心魔潮", text: "多名弟子心境动摇，若不处理会拖慢修行。", counter: ["patrol", "teach"], severity: [16, 34] },
  { id: "resourceRiot", name: "资源点动乱", text: "外门与矿脉争利，资源点产出受损。", counter: ["patrol", "forage"], severity: [18, 38] },
  { id: "tradeBreak", name: "商路断绝", text: "商队避走，灵石周转下降。", counter: ["caravan", "intel"], severity: [14, 32] },
  { id: "spyLeak", name: "暗线泄露", text: "敌宗反查影网，情报和外交受压。", counter: ["intel", "patrol"], severity: [18, 40] },
  { id: "beastOmen", name: "妖兽异动", text: "边境妖气倒灌，护山阵承压。", counter: ["patrol", "craft"], severity: [22, 46] },
];

const sectTitleCatalog = [
  { id: "firstBlood", name: "初显锋芒", text: "首次击退危机或强敌。", power: 90 },
  { id: "legacyHall", name: "薪火相传", text: "完成一次代际传承。", power: 120 },
  { id: "crisisKeeper", name: "镇劫山门", text: "成功化解三次宗门危机。", power: 180 },
  { id: "oldLineage", name: "百年宗脉", text: "宗门进入百年后获得。", power: 220 },
  { id: "famousChronicle", name: "史册留名", text: "宗门史册积累十条大事。", power: 150 },
];

const state = {
  tick: 0,
  year: 1,
  seasonIndex: 0,
  founded: false,
  multiplayer: false,
  waitingForPlayers: false,
  clientId: localStorage.getItem("cultivation-sect-client-id") || uid(),
  roomCode: "",
  roomConnected: false,
  roomHost: false,
  roomLobbyReady: false,
  remotePlayers: [],
  readyPlayers: [],
  roomBlockedByForbidden: null,
  roomAlliances: {},
  roomAllianceTrust: {},
  roomCouncil: null,
  roomAuction: null,
  roomTournament: null,
  roomAdventureLobby: null,
  roomPvpDuel: null,
  roomBossLobby: null,
  appliedRoomPvpResults: {},
  appliedRoomBossResults: {},
  roomWorldAdventureId: "",
  pendingTradeEscrows: {},
  cancelledIncomingTrades: {},
  pendingAuctionAfterClose: null,
  pendingCouncilAfterClose: null,
  pendingTournamentAfterClose: null,
  pendingTournamentCost: 0,
  pendingAdventureAfterClose: null,
  currentAction: "操作中",
  currentActionAt: Date.now(),
  selectedSectIcon: "峰",
  currentMap: "central",
  tournamentOpen: false,
  lastTournamentYear: 0,
  usedNames: new Set(),
  actionPoints: 0,
  maxActionPoints: 3,
  recruitedThisYear: false,
  refreshedRecruitment: false,
  recruitPool: [],
  yearlyBoon: null,
  pendingBoon: false,
  worldEvent: null,
  nextWorldAdventureYear: 0,
  worldAdventure: null,
  aiReports: [],
  market: null,
  marketTradesThisYear: 0,
  worldCrisis: null,
  worldChain: null,
  sectCrisis: null,
  lastLeagueRewardYear: 0,
  lastAuctionYear: 0,
  lastCouncilYear: 0,
  intelReports: [],
  councilEdict: null,
  selectedRoute: null,
  victoryGoal: null,
  completedVictoryGoals: [],
  tutorial: { enabled: false, skipped: false, seen: [] },
  completedMissions: [],
  frontier: null,
  forbidden: null,
  forbiddenRun: null,
  selectedDiscipleId: null,
  selected: null,
  logs: [],
  sect: null,
  sites: [],
  rivals: [],
  resources: [],
  events: [],
  particles: [],
};

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[rand(0, arr.length - 1)];
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function uid() {
  return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function catalogById(list, id) {
  return list.find((item) => item.id === id) || null;
}

function weightedPickCatalog(list) {
  const total = list.reduce((sum, item) => sum + Number(item.weight || 1), 0);
  let roll = Math.random() * total;
  for (const item of list) {
    roll -= Number(item.weight || 1);
    if (roll <= 0) return item;
  }
  return list[0] || null;
}

function pickDaoHeart() {
  return pick(daoHeartCatalog);
}

function rollConstitution(force = false) {
  if (!force && Math.random() > 0.055) return null;
  return weightedPickCatalog(constitutionCatalog);
}

function applyDiscipleTemplateStats(d, template, multiplier = 1) {
  if (!d || !template) return;
  for (const [stat, value] of Object.entries(template.stats || {})) {
    mutateDiscipleStat(d, stat, Number(value || 0) * multiplier);
  }
  for (const [element, value] of Object.entries(template.elementDamage || {})) {
    mutateDiscipleStat(d, element, Number(value || 0) * multiplier);
  }
  d.aptitude = clamp(d.aptitude || 1, 1, 260);
  d.temper = clamp(d.temper || 1, 1, 260);
  d.hp = Math.max(1, Math.round(d.hp || 1));
  d.atk = Math.max(1, Math.round(d.atk || 1));
  d.def = Math.max(0, Math.round(d.def || 0));
  d.speed = Math.max(1, Math.round(d.speed || 1));
}

function daoHeartOf(d) {
  return catalogById(daoHeartCatalog, d?.daoHeart) || daoHeartCatalog[0];
}

function constitutionOf(d) {
  return catalogById(constitutionCatalog, d?.constitution);
}

function specializationOf(d) {
  return catalogById(specializationCatalog, d?.specialization);
}

function inferSpecialization(d) {
  const heart = daoHeartOf(d);
  if (heart?.id === "alchemy") return "alchemy";
  if (heart?.id === "guardian" || d.def > d.atk + 12) return "body";
  if (heart?.id === "wander") return "array";
  if (heart?.id === "demonic") return "poison";
  if ((d.elementDamage?.thunder || 0) > 0) return "thunder";
  if ((d.elementDamage?.yin || 0) + (d.elementDamage?.yang || 0) > 0) return "yinYang";
  return "sword";
}

function discipleTitleNames(d) {
  return (d?.titles || [])
    .map((id) => catalogById(discipleTitleCatalog, id)?.name)
    .filter(Boolean);
}

function refreshDiscipleTitles(d) {
  if (!d) return [];
  d.titles = Array.isArray(d.titles) ? d.titles : [];
  const gained = [];
  for (const title of discipleTitleCatalog) {
    if (!d.titles.includes(title.id) && title.condition(d)) {
      d.titles.push(title.id);
      applyDiscipleTemplateStats(d, title, 1);
      gained.push(title.name);
    }
  }
  if (gained.length) {
    d.personalFame = Number(d.personalFame || 0) + gained.length * 8;
    log(`${d.name}获得称号：${gained.join("、")}。`, "good");
  }
  return gained;
}

function cultivationPowerBonus(d) {
  if (!d) return 0;
  const heart = daoHeartOf(d);
  const con = constitutionOf(d);
  const spec = specializationOf(d);
  const specLevel = Number(d.specializationLevel || 0);
  const titlePower = (d.titles || []).reduce((sum, id) => sum + Number(catalogById(discipleTitleCatalog, id)?.battle || 0), 0);
  const artifact = d.bondedArtifact ? Number(d.bondedArtifact.power || 0) + Number(d.bondedArtifact.level || 1) * 38 : 0;
  const mentor = d.mentorId ? 24 + Number(d.realm || 0) * 6 : 0;
  const conRealm = con?.id === "mortalFate" ? Number(d.realm || 0) * 45 : 0;
  return Number(heart?.battle || 0) + Number(con?.battle || 0) + conRealm + specLevel * Number(spec?.battlePerLevel || 10) + titlePower + artifact + mentor + sectPositionPowerBonus(d) + Number(d.personalFame || 0) * 1.5;
}

function sectPositionOf(d) {
  return sectPositionCatalog.find((item) => item.id === d?.sectPosition) || null;
}

function sectPositionPowerBonus(d) {
  const pos = sectPositionOf(d);
  if (!pos) return 0;
  return Number(pos.battle || 0) + Number(d.realm || 0) * 14 + Math.floor((d[pos.stat] || 0) * 0.55);
}

function openSectPositionPanel(d) {
  ensureSectDefaults();
  const occupied = state.sect.positions || {};
  showModal({
    kicker: "宗门职位",
    title: `${d.name}的宗门任职`,
    body: `
      <p>职位是宗门内部的轻量任命，同一职位只能由一名弟子担任。职位会提供少量战力、年度收益或玩法判定加成。</p>
      <div class="system-grid">
        ${sectPositionCatalog.map((pos) => {
          const holder = occupied[pos.id] ? state.sect.disciples.find((item) => item.id === occupied[pos.id]) : null;
          return `<article class="system-card ${d.sectPosition === pos.id ? "is-winner" : ""}">
            <strong>${pos.name}</strong>
            <span>${pos.text}</span>
            <em>${holder ? `当前：${holder.name}` : "当前空缺"}</em>
          </article>`;
        }).join("")}
      </div>
    `,
    actions: sectPositionCatalog.map((pos) => ({
      label: d.sectPosition === pos.id ? `已任${pos.name}` : `任命${pos.name}`,
      disabled: d.sectPosition === pos.id,
      handler: () => assignSectPosition(d, pos.id),
    })).concat([
      { label: "卸任职位", handler: () => clearSectPosition(d), disabled: !d.sectPosition },
      { label: "返回", handler: () => openDiscipleCultivationPanel(d) },
    ]),
  });
}

function assignSectPosition(d, positionId) {
  ensureSectDefaults();
  const pos = sectPositionCatalog.find((item) => item.id === positionId);
  if (!d || !pos) return;
  for (const other of state.sect.disciples) {
    if (other.sectPosition === positionId) other.sectPosition = "";
  }
  for (const key of Object.keys(state.sect.positions || {})) {
    if (state.sect.positions[key] === d.id) delete state.sect.positions[key];
  }
  d.sectPosition = positionId;
  state.sect.positions[positionId] = d.id;
  d.status = `任${pos.name}`;
  log(`${d.name}被任命为${pos.name}。`, "good");
  openSectPositionPanel(d);
  render();
}

function clearSectPosition(d) {
  ensureSectDefaults();
  if (!d?.sectPosition) return;
  const pos = sectPositionOf(d);
  delete state.sect.positions[d.sectPosition];
  d.sectPosition = "";
  d.status = "卸任内务";
  log(`${d.name}卸任${pos?.name || "宗门职位"}。`);
  openSectPositionPanel(d);
  render();
}

function openDiscipleTravelPanel(d) {
  const plans = [
    { id: "near", name: "近郊游历", years: 1, cost: 1, text: "风险低，偏资源和少量修为。" },
    { id: "realm", name: "秘境游历", years: 3, cost: 1, text: "风险中，可能带回功法、装备或材料。" },
    { id: "far", name: "远海访道", years: 5, cost: 2, text: "风险高，收益更大，也更容易触发心魔。" },
  ];
  showModal({
    kicker: "弟子游历",
    title: `${d.name}外出历练`,
    body: `
      <p>游历会占用弟子若干年，回归时结算奖励、修为和风险。游历弟子仍会显示在名册，但不适合当年安排闭关。</p>
      <div class="system-grid">
        ${plans.map((plan) => `<article class="system-card"><strong>${plan.name}</strong><span>${plan.text}</span><em>${plan.years} 年 / ${plan.cost} 行动点</em></article>`).join("")}
      </div>
    `,
    actions: plans.map((plan) => ({
      label: `${plan.name}${plan.years}年`,
      disabled: Boolean(d.travel) || state.actionPoints < plan.cost,
      handler: () => startDiscipleTravel(d, plan),
    })).concat([{ label: "返回", handler: () => openDiscipleCultivationPanel(d) }]),
  });
}

function startDiscipleTravel(d, plan) {
  if (!d || !plan || d.travel) return;
  if (!spendAction(plan.cost, "弟子游历")) return;
  d.travel = { id: uid(), type: plan.id, name: plan.name, yearsLeft: plan.years, total: plan.years };
  d.status = `${plan.name}中`;
  log(`${d.name}外出${plan.name}，预计 ${plan.years} 年后归来。`, "good");
  closeModal();
  render();
}

function processDiscipleTravelYear() {
  if (!state.sect) return;
  for (const d of state.sect.disciples) {
    if (!d.travel) continue;
    d.travel.yearsLeft -= 1;
    d.exp += 4 + d.realm * 2;
    d.status = `${d.travel.name} ${Math.max(0, d.travel.yearsLeft)}年`;
    if (d.travel.yearsLeft > 0) continue;
    const type = d.travel.type;
    const danger = type === "far" ? rand(12, 26) : type === "realm" ? rand(7, 18) : rand(2, 10);
    const roll = d.luck + d.speed * 0.7 + d.temper * 0.45 + rand(1, 100);
    const rewardLabels = [];
    if (roll < 72 + danger) {
      d.hp = Math.max(20, d.hp - rand(6, 18));
      adjustMind(d, type === "far" ? 10 : 5, "游历受挫");
      rewardLabels.push("负伤归来");
    } else {
      const stones = type === "far" ? rand(260, 620) : type === "realm" ? rand(160, 380) : rand(80, 180);
      state.sect.stones += stones;
      d.exp += type === "far" ? 22 : type === "realm" ? 14 : 8;
      rewardLabels.push(`灵石 +${stones}`, `修为 +${type === "far" ? 22 : type === "realm" ? 14 : 8}`);
      if (type !== "near" && Math.random() < 0.5) {
        const item = pick([...methodItemIds, ...equipmentItemIds, "refineStone", "affixLock"]);
        addItem(item, 1, type === "far" ? rand(2, 4) : rand(1, 3));
        rewardLabels.push(itemCatalog[item]?.name || item);
      }
    }
    d.travel = null;
    d.status = "游历归山";
    log(`${d.name}游历归来：${rewardLabels.join("、")}。`, rewardLabels.includes("负伤归来") ? "warn" : "good");
  }
}

function initWorld() {
  state.tick = 0;
  state.year = 1;
  state.seasonIndex = 0;
  state.founded = false;
  state.multiplayer = false;
  state.waitingForPlayers = false;
  state.roomCode = "";
  state.roomConnected = false;
  state.roomHost = false;
  state.roomLobbyReady = false;
  if (els.multiplayerToggle) els.multiplayerToggle.checked = false;
  state.remotePlayers = [];
  state.readyPlayers = [];
  state.roomBlockedByForbidden = null;
  state.roomAlliances = {};
  state.roomAllianceTrust = {};
  state.roomCouncil = null;
  state.roomAuction = null;
  state.roomTournament = null;
  state.roomAdventureLobby = null;
  state.roomPvpDuel = null;
  state.roomBossLobby = null;
  state.appliedRoomPvpResults = {};
  state.appliedRoomBossResults = {};
  state.pendingTradeEscrows = {};
  state.cancelledIncomingTrades = {};
  state.selectedSectIcon = "峰";
  state.currentMap = "central";
  state.lastTournamentYear = 0;
  state.usedNames = new Set();
  state.actionPoints = 0;
  state.maxActionPoints = 3;
  state.recruitedThisYear = false;
  state.refreshedRecruitment = false;
  state.recruitPool = [];
  state.yearlyBoon = null;
  state.pendingBoon = false;
  state.aiReports = [];
  state.market = createMarketState();
  state.marketTradesThisYear = 0;
  state.worldCrisis = null;
  state.worldChain = null;
  state.sectCrisis = null;
  state.lastLeagueRewardYear = 0;
  state.lastAuctionYear = 0;
  state.lastCouncilYear = 0;
  state.lastMerchantYear = 0;
  state.intelReports = [];
  state.councilEdict = null;
  state.selectedRoute = null;
  state.victoryGoal = null;
  state.completedVictoryGoals = [];
  state.tutorial = { enabled: false, skipped: false, seen: [] };
  state.completedMissions = [];
  state.frontier = createFrontierState();
  state.forbidden = createForbiddenState();
  state.forbiddenRun = null;
  state.nextWorldAdventureYear = rand(3, 6);
  state.worldAdventure = null;
  state.selectedDiscipleId = null;
  state.selected = null;
  state.sect = null;
  state.logs = [];
  state.particles = [];
  state.sites = [
    { id: "site-mountain", type: "site", name: "北境玄岳", x: 214, y: 156, aura: 92, risk: 72, resource: 48, text: "群峰锁云，灵气极盛，适合剑修与阵道，但邻近强宗。" },
    { id: "site-river", type: "site", name: "青川河谷", x: 418, y: 388, aura: 68, risk: 35, resource: 82, text: "水网与商路交错，资源稳定，适合稳健经营。" },
    { id: "site-forest", type: "site", name: "南离古林", x: 730, y: 472, aura: 78, risk: 52, resource: 64, text: "古林多秘境，弟子奇遇频繁，也容易引来觊觎。" },
    { id: "site-border", type: "site", name: "西荒边城", x: 170, y: 514, aura: 55, risk: 88, resource: 76, text: "边地混乱，冲突密集，掠夺与防守收益都很高。" },
    { id: "site-snow", type: "site", name: "太微雪岭", x: 468, y: 112, aura: 96, risk: 76, resource: 38, text: "雪岭藏星，灵气极盛但物产稀薄，适合走功法与高压养成路线。" },
    { id: "site-marsh", type: "site", name: "云梦泽", x: 312, y: 248, aura: 66, risk: 40, resource: 90, text: "泽国灵田密布，丹材和粮脉充足，前期经营压力较小。" },
    { id: "site-fire", type: "site", name: "丹霞火脉", x: 536, y: 548, aura: 74, risk: 64, resource: 70, text: "地火通炉，炼丹炼器更有根基，但常引来觊觎火脉的宗门。" },
    { id: "site-coast", type: "site", name: "东海听潮", x: 902, y: 514, aura: 62, risk: 46, resource: 88, text: "海潮商路连接仙盟，适合市集倒卖和资源调配。" },
    { id: "site-star", type: "site", name: "星陨台", x: 866, y: 118, aura: 88, risk: 80, resource: 42, text: "星陨残坑机缘极多，收益与灾厄并存，适合激进探索。" },
    { id: "site-bone", type: "site", name: "龙骨荒原", x: 618, y: 120, aura: 58, risk: 82, resource: 86, text: "荒原埋骨，矿脉丰厚，常有妖兽和敌宗窥探。" },
    { id: "site-road", type: "site", name: "玄砂古道", x: 132, y: 318, aura: 60, risk: 68, resource: 92, text: "古道商旅往来，灵石流动快，也更容易卷入各宗纷争。" },
    { id: "site-isle", type: "site", name: "碧落群岛", x: 948, y: 382, aura: 70, risk: 58, resource: 78, text: "群岛灵潮无常，适合长期经营海贸与奇遇路线。" },
  ];
  state.rivals = sectNames.map((name, i) => ({
    id: `rival-${i}`,
    type: "rival",
    name,
    x: rand(120, 950),
    y: rand(90, 610),
    power: rand(260, 720),
    stones: rand(240, 900),
    attitude: rand(-45, 45),
    disciples: rand(5, 16),
    alchemy: rand(0, 2),
    forging: rand(0, 2),
    array: rand(0, 1),
    foundation: rand(90, 150),
    alive: true,
    grudges: 0,
    alliance: false,
  }));
  state.resources = [
    { id: "mine-1", type: "resource", kind: "mine", name: "紫纹灵石矿", x: 558, y: 184, value: 92, owner: null, yields: { stones: 92, forgingMats: 1 } },
    { id: "mine-2", type: "resource", kind: "mine", name: "寒玉矿脉", x: 844, y: 222, value: 74, owner: null, yields: { stones: 74, forgingMats: 1, arrayMats: 1 } },
    { id: "herb-1", type: "resource", kind: "herb", name: "青蘅药谷", x: 318, y: 560, value: 68, owner: null, yields: { grain: 44, alchemyMats: 1 } },
    { id: "spring-1", type: "resource", kind: "spring", name: "洗髓灵泉", x: 668, y: 330, value: 84, owner: null, yields: { alchemyMats: 1, grain: 28, arrayMats: 1 } },
    { id: "forge-1", type: "resource", kind: "forge", name: "陨铁洗练池", x: 728, y: 248, value: 86, owner: null, yields: { forgingMats: 1, refineStone: 1 } },
    { id: "jade-1", type: "resource", kind: "jade", name: "定纹玉脉", x: 222, y: 430, value: 78, owner: null, yields: { stones: 46, affixLock: 1 } },
    { id: "poison-1", type: "resource", kind: "poison", name: "碧瘴毒泽", x: 784, y: 586, value: 72, owner: null, yields: { alchemyMats: 1, refineStone: 1 } },
    { id: "spirit-1", type: "resource", kind: "spring", name: "聚灵石窟", x: 472, y: 468, value: 82, owner: null, yields: { arrayMats: 1, affixLock: 1 } },
    { id: "mine-3", type: "resource", kind: "mine", name: "赤霞灵矿", x: 642, y: 116, value: 88, owner: null, yields: { stones: 84, forgingMats: 1 } },
    { id: "herb-2", type: "resource", kind: "herb", name: "月露药圃", x: 158, y: 248, value: 74, owner: null, yields: { grain: 36, alchemyMats: 1 } },
    { id: "herb-3", type: "resource", kind: "herb", name: "玄参谷", x: 904, y: 446, value: 80, owner: null, yields: { grain: 28, alchemyMats: 2 } },
    { id: "spring-2", type: "resource", kind: "spring", name: "碧潮灵泉", x: 388, y: 196, value: 76, owner: null, yields: { grain: 22, alchemyMats: 1, arrayMats: 1 } },
    { id: "forge-2", type: "resource", kind: "forge", name: "地火器坑", x: 564, y: 586, value: 90, owner: null, yields: { forgingMats: 2, refineStone: 1 } },
    { id: "jade-2", type: "resource", kind: "jade", name: "锁灵玉台", x: 918, y: 306, value: 84, owner: null, yields: { stones: 38, affixLock: 1, arrayMats: 1 } },
    { id: "poison-2", type: "resource", kind: "poison", name: "蚀骨幽潭", x: 104, y: 582, value: 78, owner: null, yields: { alchemyMats: 1, refineStone: 1 } },
    { id: "spirit-2", type: "resource", kind: "spring", name: "星髓灵穴", x: 824, y: 112, value: 86, owner: null, yields: { arrayMats: 2, affixLock: 1 } },
  ];
  state.events = createOpportunityNodes(9, "init");
  showStartScreen();
  showStartMenuPanel();
  els.startPanel.classList.remove("is-collapsed");
  els.waitingOverlay.hidden = true;
  els.multiplayerToggle.checked = false;
  if (els.roomPanel) els.roomPanel.hidden = true;
  if (els.roomCodeInput) els.roomCodeInput.value = "";
  if (els.lobbyRoomCodeInput) els.lobbyRoomCodeInput.value = "";
  updateRoomPopulation([]);
  updateRoomStatus("未连接房间", "warn");
  updateMultiplayerLobbyControls();
  for (const btn of els.startPanel.querySelectorAll(".mode-card")) btn.classList.toggle("is-active", btn.dataset.mode === "solo");
  for (const btn of els.iconPicker.querySelectorAll("button")) btn.classList.toggle("is-active", btn.dataset.icon === state.selectedSectIcon);
  els.sectNameInput.value = els.sectNameInput.value.trim() || randomPlayerSectName();
  log("请输入自己的宗门名，并选择宗门所在地。其他玩家席位暂由 AI 宗门补全。游戏按年度回合推进。", "good");
  updateButtons();
  render();
}

function randomPlayerSectName() {
  return `${pick(playerSectPrefixes)}宗`;
}

function createOpportunityNodes(count, source = "wild") {
  const templates = [
    ["云海秘境", "秘"], ["散修集会", "市"], ["古碑裂隙", "碑"], ["剑冢余响", "剑"], ["仙市夜潮", "市"], ["雷池幻境", "雷"],
    ["药园残梦", "药"], ["狐仙赌局", "赌"], ["荒塔问心", "塔"], ["星陨坑", "星"], ["龙骨浅滩", "骨"], ["无名洞府", "府"],
    ["月下道场", "道"], ["沉舟宝库", "库"], ["雾隐山门", "隐"], ["地火窟", "火"], ["灵禽迁徙", "禽"], ["旧仙坟", "坟"],
  ];
  return Array.from({ length: count }, (_, i) => ({
    ...(() => {
      if (Math.random() < 0.035) return { name: "万药秘圃", glyph: "药", materialRich: true };
      const [name, glyph] = pick(templates);
      return { name, glyph, materialRich: false };
    })(),
    id: `event-${source}-${Date.now()}-${i}-${Math.random().toString(16).slice(2)}`,
    type: "event",
    x: rand(86, 960),
    y: rand(78, 610),
    value: rand(42, 112),
    ttl: rand(5, 13),
  }));
}

function addOpportunityNodes(count, source = "wild") {
  state.events.push(...createOpportunityNodes(count, source));
  state.events = state.events
    .sort((a, b) => b.value - a.value || b.ttl - a.ttl)
    .slice(0, 18);
}

function createDisciple(options = {}) {
  const first = createUniqueName();
  const traitCount = Math.random() > 0.76 ? 2 : 1;
  const ownedTraits = [];
  while (ownedTraits.length < traitCount) {
    const t = pick(traits);
    if (!ownedTraits.includes(t)) ownedTraits.push(t);
  }
  const minRealm = clamp(options.minRealm ?? 0, 0, realms.length - 1);
  const maxRealm = clamp(options.maxRealm ?? 0, minRealm, realms.length - 1);
  const realm = rand(minRealm, maxRealm);
  const base = {
    id: uid(),
    name: first,
    realm,
    exp: rand(0, options.expMax ?? 40),
    hp: rand(55, 95) + realm * rand(14, 22),
    atk: rand(18, 46) + realm * rand(6, 10),
    def: rand(15, 42) + realm * rand(5, 9),
    speed: rand(12, 38) + realm * rand(3, 7),
    grow: rand(8, 24),
    aptitude: rand(38, 96) + Math.floor(realm * 1.5),
    temper: rand(30, 92) + realm,
    luck: rand(0, 30) + Math.floor(realm / 2),
    charm: rand(0, 20) + Math.floor(realm / 2),
    arrayLevel: 0,
    mind: 0,
    elder: false,
    elderRole: "",
    core: false,
    pillFatigue: 0,
    tribBoost: 0,
    status: pick(["潜修", "巡山", "悟道", "养息"]),
    equipment: { weapon: null, artifact: null },
    traits: ownedTraits,
    daoHeart: pickDaoHeart().id,
    constitution: "",
    constitutionAwakened: false,
    specialization: "",
    specializationExp: 0,
    specializationLevel: 0,
    mentorId: "",
    seclusion: null,
    travel: null,
    assignment: "",
    age: rand(16, 34) + realm * rand(3, 8),
    lifespan: 96 + realm * 70 + rand(0, 38),
    legacyGiven: false,
    portraitId: options.portraitId || `p-${pick(portraitStyles)}-${rand(1, 6)}`,
    sectPosition: "",
    demonStage: 0,
    bondedArtifact: null,
    titles: [],
    personalFame: 0,
    lastPersonalEventYear: 0,
  };
  for (const t of ownedTraits) {
    for (const key of ["hp", "atk", "def", "speed", "grow", "luck", "charm", "temper"]) {
      base[key] += t[key] || 0;
    }
  }
  applyDiscipleTemplateStats(base, daoHeartOf(base), 1);
  const constitution = rollConstitution(false);
  if (constitution) {
    base.constitution = constitution.id;
    base.constitutionAwakened = true;
    applyDiscipleTemplateStats(base, constitution, 1);
  }
  base.specialization = inferSpecialization(base);
  return base;
}

function createUniqueName() {
  for (let i = 0; i < 120; i += 1) {
    const name = `${pick(surnames)}${pick(givenNames)}`;
    if (!state.usedNames.has(name)) {
      state.usedNames.add(name);
      return name;
    }
  }
  const fallback = `${pick(surnames)}${pick(givenNames)}${rand(2, 99)}`;
  state.usedNames.add(fallback);
  return fallback;
}

function createFrontierState() {
  return {
    dungeons: [],
    outposts: [],
    clears: 0,
    lastRefreshYear: 0,
    beastTideYear: 0,
    worldBoss: null,
    bossDamageLog: [],
  };
}

function createForbiddenState() {
  return {
    attemptsCycle: Math.floor((state.year - 1) / 10),
    attemptsUsed: 0,
    totalRuns: 0,
    clears: 0,
    bestFloor: 0,
  };
}

function applyRewardToSect(reward = {}, reason = "奖励") {
  if (!state.sect) return [];
  const labels = [];
  for (const [key, value] of Object.entries(reward)) {
    if (!value) continue;
    if (key === "item") {
      addItem(value.id, value.count || 1, value.quality || 0);
      labels.push(`${itemCatalog[value.id]?.name || value.id} x${value.count || 1}`);
    } else {
      state.sect[key] = Number(state.sect[key] || 0) + value;
      const names = { stones: "灵石", grain: "粮草", prestige: "声望", insight: "参悟", alchemyMats: "丹材", forgingMats: "器材", arrayMats: "阵材" };
      labels.push(`${names[key] || key} +${value}`);
    }
  }
  if (labels.length) flashFeedback(`${reason}：${labels.join("、")}`, "good");
  return labels;
}

function recipeDisplayName(recipeId) {
  const recipe = alchemyRecipes.find((item) => item.id === recipeId);
  return recipe?.name || recipeId;
}

function unlockAlchemyRecipe(recipeId) {
  ensureSectDefaults();
  if (!recipeId || !alchemyRecipes.some((recipe) => recipe.id === recipeId)) return false;
  if (!state.sect.unlockedAlchemyRecipes.includes(recipeId)) {
    state.sect.unlockedAlchemyRecipes.push(recipeId);
    return true;
  }
  return false;
}

function openSectRouteChoice(afterClose = null) {
  showModal({
    kicker: "宗门路线",
    title: "确立山门根基",
    body: `
      <p>路线是本局长期倾向，会影响你更适合的目标。路线不会锁死玩法，但会改变前期资源与部分判定。</p>
      <div class="system-grid">
        ${sectRoutes.map((route) => `<article class="system-card"><strong>${route.name}</strong><span>${route.text}</span></article>`).join("")}
      </div>
    `,
    actions: sectRoutes.map((route) => ({
      label: route.name,
      handler: () => {
        state.selectedRoute = route.id;
        applyRewardToSect(route.reward, route.name);
        log(`宗门路线确立为「${route.name}」：${route.text}`, "good");
        closeModal();
        afterClose?.();
        render();
      },
    })),
  });
  els.modalCloseBtn.onclick = () => {
    const route = sectRoutes[0];
    state.selectedRoute = route.id;
    applyRewardToSect(route.reward, route.name);
    closeModal();
    afterClose?.();
    render();
  };
}

function openVictoryGoalChoice(afterClose = null) {
  showModal({
    kicker: "终局目标",
    title: "选择飞升或称霸之路",
    body: `
      <p>终局目标极难达成，会在“当前目标”中持续显示进度。你可以照常游玩，但目标会帮你理解长期路线。</p>
      <div class="system-grid">
        ${victoryGoals.map((goal) => `<article class="system-card"><strong>${goal.name}</strong><span>${goal.text}</span></article>`).join("")}
      </div>
    `,
    actions: victoryGoals.map((goal) => ({
      label: goal.name,
      handler: () => {
        state.victoryGoal = goal.id;
        log(`终局目标设为「${goal.name}」。这条路很长，需要宗门多系统协同推进。`, "good");
        closeModal();
        afterClose?.();
        render();
      },
    })),
  });
  els.modalCloseBtn.onclick = () => {
    state.victoryGoal = victoryGoals[0].id;
    closeModal();
    afterClose?.();
    render();
  };
}

function offerTutorialChoice(afterClose = null) {
  showModal({
    kicker: "新手指引",
    title: "是否开启前期高亮指引？",
    body: `
      <p>开启后，前几年会在你解锁对应玩法时用高亮框标出关键区域，并配一段短说明。它只提示流程，不替你做选择。</p>
      <p>你随时可以点地图右上角“?”打开完整手册；如果跳过，高亮指引本局不会再自动弹出。</p>
    `,
    actions: [
      {
        label: "开启指引",
        handler: () => {
          state.tutorial = { enabled: true, skipped: false, seen: [] };
          closeModal();
          afterClose?.();
          render();
        },
      },
      {
        label: "跳过指引",
        handler: () => {
          state.tutorial = { enabled: false, skipped: true, seen: [] };
          closeModal();
          afterClose?.();
          render();
        },
      },
    ],
  });
  els.modalCloseBtn.onclick = () => {
    state.tutorial = { enabled: false, skipped: true, seen: [] };
    closeModal();
    afterClose?.();
    render();
  };
}

function foundSect(site) {
  const disciples = Array.from({ length: 4 }, createDisciple);
  const customName = els.sectNameInput.value.trim();
  state.multiplayer = els.multiplayerToggle.checked;
  state.sect = {
    id: "player",
    name: customName || randomPlayerSectName(),
    icon: state.selectedSectIcon,
    x: site.x,
    y: site.y,
    aura: site.aura,
    risk: site.risk,
    resource: site.resource,
    stones: 560 + site.resource * 5,
    grain: 420 + site.resource * 3,
    alchemyMats: 2,
    forgingMats: 1,
    arrayMats: 0,
    insight: 0,
    daoPath: null,
    daoLevel: 0,
    tech: { sword: 0, alchemy: 0, forging: 0, array: 0, wander: 0 },
    prestige: 80 + site.aura,
    barrier: 56 + Math.floor(site.risk / 4),
    disciples,
    buildings: {
      commandHall: 0,
      trainingHall: 0,
      market: 0,
      scoutTower: 0,
      insightRoom: 0,
      spiritArray: 0,
    },
    inventory: [
      { id: "qiPill", count: 2, quality: 0 },
      { id: "minorHealPill", count: 2, quality: 0 },
      { id: "jadeDew", count: 1, quality: 0 },
      { id: "coldIron", count: 1, quality: 0 },
    ],
    unlockedAlchemyRecipes: ["qiPill", "minorHealPill"],
    unlockedForgeRecipes: forgingRecipes.map((recipe) => recipe.id),
    relicInventory: [],
    formations: [],
    mountainFormation: null,
    marketPortfolio: {},
    diplomacy: { reputation: 20, infamy: 0 },
    legacy: 0,
    ancestors: [],
    history: [],
    titles: [],
    crisisResolved: 0,
    bonds: [],
    allies: [],
  };
  state.selectedDiscipleId = disciples[0]?.id || null;
  state.founded = true;
  state.selected = state.sect;
  startPlayerYear();
  showGameShell();
  els.hint.textContent = "宗门已立。每年行动点有限，完成操作后点击进入下一年。单机时 AI 会自动行动。";
  log(`${state.sect.name}立于${site.name}，首批 ${disciples.length} 名弟子拜入山门。AI 宗门开始在同图发展。`, "good");
  if (state.multiplayer) {
    if (!state.roomConnected) connectMultiplayerRoom();
    else syncPublicState();
  }
  openSectRouteChoice(() => openVictoryGoalChoice(() => offerTutorialChoice(() => offerYearlyBoons())));
  updateButtons();
  render();
}

function startPlayerYear() {
  const disciplePressure = Math.floor(Math.max(0, state.sect.disciples.length - 8) / 5);
  const prestigeBonus = Math.floor(Math.min(state.sect.prestige, 600) / 240);
  const buildingBonus = state.sect.buildings.commandHall;
  const omenBonus = state.yearlyBoon?.key === "actionBonus" ? 1 : 0;
  const decadeBonus = Math.floor(Math.max(0, state.year - 1) / 10);
  state.maxActionPoints = clamp(4 + prestigeBonus + buildingBonus + omenBonus + decadeBonus - disciplePressure, 3, 10);
  state.actionPoints = state.maxActionPoints;
  state.recruitedThisYear = false;
  state.refreshedRecruitment = false;
  state.marketTradesThisYear = 0;
  state.recruitPool = createRecruitPool();
}

let yearlyBoonRecoveryTimer = null;

function isYearlyBoonModalOpen() {
  return Boolean(
    els.eventModal &&
    !els.eventModal.hidden &&
    els.modalKicker?.textContent === "年度天命" &&
    /开局抉择/.test(els.modalTitle?.textContent || "")
  );
}

function scheduleYearlyBoonRecovery(delay = 900) {
  window.clearTimeout(yearlyBoonRecoveryTimer);
  yearlyBoonRecoveryTimer = window.setTimeout(() => recoverMissingYearlyBoon("年度兜底"), delay);
}

function recoverMissingYearlyBoon(reason = "") {
  if (!state.founded || state.waitingForPlayers) return false;
  if (state.worldAdventure) return false;
  if (state.yearlyBoon && state.actionPoints > 0) return false;
  if (state.pendingBoon && isYearlyBoonModalOpen()) return false;
  const modalBusy = els.eventModal && !els.eventModal.hidden;
  const pendingKind = [
    ["adventure", state.pendingAdventureAfterClose],
    ["auction", state.pendingAuctionAfterClose],
    ["council", state.pendingCouncilAfterClose],
    ["tournament", state.pendingTournamentAfterClose],
  ].find(([, next]) => typeof next === "function")?.[0];
  if (!modalBusy && pendingKind) {
    continuePendingYearEvent(pendingKind);
    return true;
  }
  if (modalBusy && !state.pendingBoon) return false;
  if (!state.yearlyBoon) {
    state.pendingBoon = false;
    log(`${reason || "年度"}：已重新唤起年度天命，避免行动点卡死。`, "warn");
    offerYearlyBoons(true);
    return true;
  }
  return false;
}

function offerYearlyBoons(force = false) {
  if (!state.founded) return;
  if (state.pendingBoon && isYearlyBoonModalOpen()) return;
  if (state.pendingBoon && !force) return;
  if (state.pendingBoon && !isYearlyBoonModalOpen()) state.pendingBoon = false;
  state.pendingBoon = true;
  const choices = [];
  while (choices.length < 3) {
    const omen = pick(omens);
    if (!choices.includes(omen)) choices.push(omen);
  }
  showModal({
    kicker: "年度天命",
    title: `太初 ${state.year} 年开局抉择`,
    body: `<p>本年天象变动，宗门可顺势选择一条发展倾向。每年随机三选一，本局路线会因此产生差异。</p>`,
    actions: choices.map((omen) => ({
      label: omen.name,
      handler: () => selectYearlyBoon(omen),
    })),
  });
  els.modalCloseBtn.onclick = () => selectYearlyBoon(choices[0]);
}

function selectYearlyBoon(omen) {
  window.clearTimeout(yearlyBoonRecoveryTimer);
  state.yearlyBoon = omen;
  state.pendingBoon = false;
  startPlayerYear();
  log(`本年天命：${omen.name}。${omen.text}`, "good");
  closeModal();
  render();
}

function recruitRealmRange() {
  if (!state.sect) return { minRealm: 0, maxRealm: 0 };
  const canGoldCore = state.year >= 8 && state.sect.prestige >= 720 && Math.max(0, ...state.sect.disciples.map((d) => d.realm)) >= 2;
  return { minRealm: 0, maxRealm: canGoldCore ? 2 : 1 };
}

function recruitRealmOdds() {
  if (!state.sect) return { qi: 100, foundation: 0, core: 0 };
  const foundation = clamp(10 + Math.floor((state.sect.prestige - 600) / 260) + Math.floor(daoLevelFor("wander") / 3), 10, 18);
  const canCore = state.year >= 8 && state.sect.prestige >= 720 && Math.max(0, ...state.sect.disciples.map((d) => d.realm)) >= 2;
  const core = canCore ? clamp(1 + Math.floor((state.year - 8) / 6) + Math.floor((state.sect.prestige - 900) / 600), 1, 4) : 0;
  return { qi: Math.max(0, 100 - foundation - core), foundation, core };
}

function pickRecruitRealm() {
  const odds = recruitRealmOdds();
  const roll = rand(1, 100);
  if (roll <= odds.core) return 2;
  if (roll <= odds.core + odds.foundation) return 1;
  return 0;
}

function createRecruitPool() {
  const guest = state.yearlyBoon?.key === "guestBonus" ? 1 : 0;
  const size = (state.sect && state.sect.prestige > 900 ? 4 : 3) + guest;
  return Array.from({ length: size }, () => {
    const realm = pickRecruitRealm();
    return createDisciple({ minRealm: realm, maxRealm: realm, expMax: realm >= 2 ? 28 : 70 });
  });
}

function spendAction(cost, label) {
  if (!state.founded) return false;
  if (state.actionPoints < cost) {
    log(`${label}需要 ${cost} 点行动，本年行动点不足。`, "warn");
    render();
    return false;
  }
  state.actionPoints -= cost;
  return true;
}

function sectPower() {
  if (!state.sect) return 0;
  return Math.round(sectStrategicPower());
}

function sectStrategicPower() {
  if (!state.sect) return 0;
  ensureSectDefaults();
  const discipleCore = state.sect.disciples.reduce((sum, d) => sum + discipleBattleScore(d), 0);
  const resourceHoldings = state.resources.filter((r) => r.owner === "player").reduce((sum, r) => sum + r.value * 1.35, 0);
  const craftDepth = (state.sect.alchemyMats * 18) + (state.sect.forgingMats * 22) + state.sect.inventory.reduce((sum, item) => sum + item.count * (22 + (item.quality || 0) * 12), 0);
  const buildingDepth = Object.values(state.sect.buildings).reduce((sum, level) => sum + level, 0) * 95;
  const daoDepth = totalDaoLevel() * 135 + (state.sect.insight || 0) * 1.2;
  const arrayDepth = formationPower() * 1.25;
  const legacyDepth = Number(state.sect.legacy || 0) * 8 + sectTitlePower();
  const economy = Math.sqrt(Math.max(0, state.sect.stones)) * 18 + Math.sqrt(Math.max(0, state.sect.grain)) * 12;
  return discipleCore + state.sect.barrier * 7 + state.sect.prestige * 0.35 + resourceHoldings + craftDepth + buildingDepth + daoDepth + arrayDepth + legacyDepth + economy;
}

function formationPower() {
  if (!state.sect) return 0;
  const stored = (state.sect.formations || []).reduce((sum, f) => sum + (f.power || 0), 0);
  const mountain = state.sect.mountainFormation ? state.sect.mountainFormation.power || 0 : 0;
  return stored + mountain;
}

function rivalStrategicPower(rival, resource = null) {
  if (!rival || rival.alive === false) return 0;
  const ownedValue = state.resources.filter((res) => res.owner === rival.id).reduce((sum, res) => sum + res.value * 1.25, 0);
  const craftDepth = (rival.alchemy || 0) * 85 + (rival.forging || 0) * 95;
  const arrayDepth = (rival.array || 0) * 130;
  const economy = Math.sqrt(Math.max(0, rival.stones || 0)) * 18;
  const foundation = (rival.foundation || 100) * 2.2;
  const upgradeDepth = resource ? Object.values(resource.upgrades || {}).reduce((sum, level) => sum + Number(level || 0), 0) * 85 : 0;
  const terrain = resource ? resource.value * 3.2 + upgradeDepth : 0;
  return (rival.power || 0) + (rival.disciples || 0) * 55 + craftDepth + arrayDepth + economy + foundation + ownedValue + terrain;
}

function wildResourceDefense(resource) {
  const terrain = resource.kind === "mine" ? 1.14 : resource.kind === "spring" ? 1.08 : 1;
  const yearScale = 1 + Math.min(0.7, state.year / 30);
  return resource.value * rand(5, 8) * terrain * yearScale + rand(80, 220);
}

function playerContestPower(resource) {
  const pathBonus = daoLevelFor("array") * 55 + daoLevelFor("sword") * 80;
  const scoutBonus = state.sect.buildings.scoutTower * 40;
  const trainingBonus = state.sect.buildings.trainingHall * 65;
  const resourceMatch = resource.kind === "mine" ? traitBonus("forging") * 1.4 : resource.kind === "herb" || resource.kind === "spring" ? traitBonus("alchemy") * 1.4 : 0;
  const arrayHold = (state.sect.mountainFormation?.power || 0) * 0.45 + daoLevelFor("array") * 80;
  return sectStrategicPower() + pathBonus + scoutBonus + trainingBonus + resourceMatch + arrayHold + rand(0, 320);
}

function resourceUpgradeLevel(resource, key) {
  return Number(resource?.upgrades?.[key] || 0);
}

function resourceUpgradeDefense(resource) {
  if (!resource) return 0;
  const outpost = resourceUpgradeLevel(resource, "outpost");
  const arrayEye = resourceUpgradeLevel(resource, "arrayEye");
  const depot = resourceUpgradeLevel(resource, "depot");
  const omen = state.yearlyBoon?.key === "arrayBonus" ? 55 : 0;
  const edict = state.councilEdict?.key === "frontier" ? 70 : 0;
  return outpost * 150 + arrayEye * 110 + depot * 55 + omen + edict;
}

function resourceGarrisonPower(resource) {
  if (!resource || !state.sect) return 0;
  const d = resource.garrisonId ? state.sect.disciples.find((item) => item.id === resource.garrisonId) : null;
  const traitGuard = d ? traitBonusOnDisciple(d, "garrison") * 8 : 0;
  const disciplePower = d ? discipleBattleScore(d) * 0.36 + (d.arrayLevel || 0) * 70 + traitGuard + (state.sect.mountainFormation?.power || 0) * 0.18 : 0;
  return disciplePower + resourceUpgradeDefense(resource);
}

function resourceYield(resource, key) {
  const base = Number(resource?.yields?.[key] || 0);
  if (!base) return 0;
  const extractor = resourceUpgradeLevel(resource, "extractor");
  const depot = resourceUpgradeLevel(resource, "depot");
  const arrayEye = resourceUpgradeLevel(resource, "arrayEye");
  const boom = state.yearlyBoon?.key === "resourceBoom" ? 0.25 : 0;
  const guild = state.yearlyBoon?.key === "craftGuild" ? 0.15 : 0;
  let value = base * (1 + extractor * 0.28 + boom + guild);
  if (key === "stones") value += depot * 5;
  if (key === "grain") value += depot * 4;
  if (key === "arrayMats") value += arrayEye > 0 ? Math.floor(arrayEye / 2) + (resource.kind === "spring" ? 1 : 0) : 0;
  return Math.round(value);
}

function resourceUpgradeCost(resource, upgrade) {
  const level = resourceUpgradeLevel(resource, upgrade.key);
  const discount = (state.yearlyBoon?.key === "resourceBoom" ? 70 : 0) + (state.yearlyBoon?.key === "craftGuild" ? 40 : 0);
  return Math.max(120, upgrade.baseCost + level * 170 + Math.floor((resource?.value || 60) * 1.2) - discount);
}

function traitBonus(key) {
  return state.sect.disciples.reduce((sum, d) => sum + d.traits.reduce((v, t) => v + (t[key] || 0), 0), 0);
}

const DAO_TECH_KEYS = Object.keys(daoPaths);

function ensureTech() {
  if (!state.sect) return;
  if (!state.sect.tech) state.sect.tech = {};
  DAO_TECH_KEYS.forEach((key) => {
    state.sect.tech[key] = Number(state.sect.tech[key] || 0);
  });
}

function ensureSectDefaults() {
  if (!state.sect) return;
  ensureTech();
  if (!state.market) state.market = createMarketState();
  state.marketTradesThisYear = Number(state.marketTradesThisYear || 0);
  state.currentMap = state.currentMap || "central";
  state.remotePlayers = Array.isArray(state.remotePlayers) ? state.remotePlayers : [];
  state.readyPlayers = Array.isArray(state.readyPlayers) ? state.readyPlayers : [];
  state.roomBlockedByForbidden = state.roomBlockedByForbidden || null;
  state.roomAlliances = state.roomAlliances || {};
  state.roomAllianceTrust = state.roomAllianceTrust || {};
  state.roomCouncil = state.roomCouncil || null;
  state.roomAuction = state.roomAuction || null;
  state.roomTournament = state.roomTournament || null;
  state.roomAdventureLobby = state.roomAdventureLobby || null;
  state.roomPvpDuel = state.roomPvpDuel || null;
  state.roomBossLobby = state.roomBossLobby || null;
  state.appliedRoomPvpResults = state.appliedRoomPvpResults || {};
  state.appliedRoomBossResults = state.appliedRoomBossResults || {};
  state.pendingTradeEscrows = state.pendingTradeEscrows || {};
  state.cancelledIncomingTrades = state.cancelledIncomingTrades || {};
  state.completedMissions = Array.isArray(state.completedMissions) ? state.completedMissions : [];
  state.completedVictoryGoals = Array.isArray(state.completedVictoryGoals) ? state.completedVictoryGoals : [];
  state.tutorial = state.tutorial || { enabled: false, skipped: false, seen: [] };
  state.tutorial.seen = Array.isArray(state.tutorial.seen) ? state.tutorial.seen : [];
  state.tutorial.enabled = Boolean(state.tutorial.enabled);
  state.tutorial.skipped = Boolean(state.tutorial.skipped);
  state.frontier = state.frontier || createFrontierState();
  state.frontier.dungeons = Array.isArray(state.frontier.dungeons) ? state.frontier.dungeons : [];
  state.frontier.outposts = Array.isArray(state.frontier.outposts) ? state.frontier.outposts : [];
  state.frontier.bossDamageLog = Array.isArray(state.frontier.bossDamageLog) ? state.frontier.bossDamageLog : [];
  state.frontier.worldBoss = state.frontier.worldBoss || null;
  state.forbidden = state.forbidden || createForbiddenState();
  state.forbiddenRun = state.forbiddenRun || null;
  state.worldCrisis = state.worldCrisis || null;
  state.worldChain = state.worldChain || null;
  state.sectCrisis = state.sectCrisis || null;
  state.lastLeagueRewardYear = Number(state.lastLeagueRewardYear || 0);
  state.intelReports = Array.isArray(state.intelReports) ? state.intelReports : [];
  state.councilEdict = state.councilEdict || null;
  if (state.councilEdict) state.councilEdict.ttl = Number.isFinite(Number(state.councilEdict.ttl)) ? Number(state.councilEdict.ttl) : 1;
  state.lastAuctionYear = Number(state.lastAuctionYear || 0);
  state.lastCouncilYear = Number(state.lastCouncilYear || 0);
  state.lastTournamentYear = Number(state.lastTournamentYear || 0);
  state.lastMerchantYear = Number(state.lastMerchantYear || 0);
  state.sect.arrayMats = Number(state.sect.arrayMats || 0);
  state.sect.unlockedAlchemyRecipes = Array.isArray(state.sect.unlockedAlchemyRecipes) && state.sect.unlockedAlchemyRecipes.length
    ? state.sect.unlockedAlchemyRecipes
    : ["qiPill", "minorHealPill"];
  if (!state.sect.unlockedAlchemyRecipes.includes("qiPill")) state.sect.unlockedAlchemyRecipes.push("qiPill");
  if (!state.sect.unlockedAlchemyRecipes.includes("minorHealPill")) state.sect.unlockedAlchemyRecipes.push("minorHealPill");
  state.sect.unlockedForgeRecipes = Array.isArray(state.sect.unlockedForgeRecipes) && state.sect.unlockedForgeRecipes.length
    ? state.sect.unlockedForgeRecipes
    : forgingRecipes.map((recipe) => recipe.id);
  state.sect.relicInventory = Array.isArray(state.sect.relicInventory) ? state.sect.relicInventory : [];
  state.sect.formations = Array.isArray(state.sect.formations) ? state.sect.formations : [];
  state.sect.mountainFormation = state.sect.mountainFormation || null;
  state.sect.marketPortfolio = state.sect.marketPortfolio || {};
  state.sect.buildings.insightRoom = Number(state.sect.buildings.insightRoom || 0);
  state.sect.buildings.spiritArray = Number(state.sect.buildings.spiritArray || 0);
  state.sect.diplomacy = state.sect.diplomacy || { reputation: 20, infamy: 0 };
  state.sect.spyNetwork = Number(state.sect.spyNetwork || 0);
  state.sect.positions = state.sect.positions || {};
  state.sect.reputationPath = state.sect.reputationPath || "hermit";
  state.sect.legacy = Number(state.sect.legacy || 0);
  state.sect.ancestors = Array.isArray(state.sect.ancestors) ? state.sect.ancestors : [];
  state.sect.history = Array.isArray(state.sect.history) ? state.sect.history : [];
  state.sect.titles = Array.isArray(state.sect.titles) ? state.sect.titles : [];
  state.sect.crisisResolved = Number(state.sect.crisisResolved || 0);
  state.sect.bonds = Array.isArray(state.sect.bonds) ? state.sect.bonds : [];
  state.sect.inventory = Array.isArray(state.sect.inventory) ? state.sect.inventory : [];
  normalizeGearInventory();
  for (const d of state.sect.disciples || []) {
    d.arrayLevel = Number(d.arrayLevel || 0);
    d.mind = Number(d.mind || 0);
    d.elder = Boolean(d.elder);
    d.elderRole = d.elderRole || "";
    d.travel = d.travel && Number(d.travel.yearsLeft || 0) > 0 ? d.travel : null;
    d.assignment = d.assignment || "";
    d.age = Number(d.age || (18 + Number(d.realm || 0) * 8));
    d.lifespan = Number(d.lifespan || discipleLifeExpectancy(d));
    d.legacyGiven = Boolean(d.legacyGiven);
    d.portraitId = d.portraitId || `p-${pick(portraitStyles)}-${rand(1, 6)}`;
    d.sectPosition = d.sectPosition || "";
    d.demonStage = Number(d.demonStage || 0);
    normalizeDiscipleProgression(d);
    d.traits = Array.isArray(d.traits) ? d.traits : [];
  }
  for (const r of state.resources || []) {
    r.upgrades = r.upgrades || { outpost: 0, arrayEye: 0, extractor: 0, depot: 0 };
    r.garrisonId = r.garrisonId || null;
  }
  for (const r of state.rivals || []) r.array = Number(r.array || 0);
}

function daoLevelFor(key) {
  ensureTech();
  return state.sect?.tech?.[key] || 0;
}

function totalDaoLevel() {
  ensureTech();
  return state.sect?.tech ? Object.values(state.sect.tech).reduce((sum, level) => sum + level, 0) : (state.sect?.daoLevel || 0);
}

function primaryDaoName() {
  ensureTech();
  if (!state.sect?.tech) return state.sect?.daoPath ? daoPaths[state.sect.daoPath].name : "未定";
  const entries = Object.entries(state.sect.tech).sort((a, b) => b[1] - a[1]);
  const [key, level] = entries[0] || [];
  return level ? `${daoPaths[key].name}${level} / 总${totalDaoLevel()}` : "未定";
}

function selectedDisciple() {
  if (!state.sect || !state.selectedDiscipleId) return null;
  return state.sect.disciples.find((d) => d.id === state.selectedDiscipleId) || null;
}

function gearTier(quality = 0) {
  return clamp(Math.round(Number(quality) || 0), 0, 4);
}

function gearTierName(quality = 0) {
  return gearQualityNames[gearTier(quality)] || gearQualityNames[0] || "";
}

function rollAffixRarity() {
  const total = affixRarities.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * total;
  for (const rarity of affixRarities) {
    roll -= rarity.weight;
    if (roll <= 0) return rarity;
  }
  return affixRarities[0];
}

function affixValue(def, rarity, quality = 0) {
  const tierScale = 1 + gearTier(quality) * 0.28;
  return Math.max(1, Math.round(def.base * (rarity?.mult || 1) * tierScale));
}

function rollGearAffixes(quality = 0) {
  const slots = gearTier(quality) + 1;
  const picked = [];
  const used = new Set();
  for (let i = 0; i < slots; i += 1) {
    const pool = gearAffixPool.filter((affix) => !used.has(affix.key) && (!affix.rare || Math.random() < 0.22 || gearTier(quality) >= 3));
    const def = pick(pool.length ? pool : gearAffixPool);
    const rarity = rollAffixRarity();
    used.add(def.key);
    picked.push({
      key: def.key,
      name: def.name,
      stat: def.stat,
      element: Boolean(def.element),
      pct: Boolean(def.pct),
      rarity: rarity.key,
      rarityName: rarity.name,
      value: affixValue(def, rarity, quality),
    });
  }
  return picked;
}

function ensureGearInstance(slot) {
  const item = itemCatalog[slot?.id];
  if (!item?.equipment || item.slot === "relic") return slot;
  slot.count = 1;
  slot.quality = gearTier(slot.quality);
  slot.gearUid = slot.gearUid || uid();
  slot.affixes = Array.isArray(slot.affixes) && slot.affixes.length ? slot.affixes : rollGearAffixes(slot.quality);
  slot.lockedAffixes = Array.isArray(slot.lockedAffixes) ? slot.lockedAffixes : [];
  return slot;
}

function normalizeGearInventory() {
  if (!state.sect?.inventory) return;
  const normalized = [];
  for (const slot of state.sect.inventory) {
    const item = itemCatalog[slot?.id];
    if (!item?.equipment || item.slot === "relic") {
      normalized.push(slot);
      continue;
    }
    const count = Math.max(1, Number(slot.count || 1));
    for (let i = 0; i < count; i += 1) {
      normalized.push(ensureGearInstance({
        id: slot.id,
        count: 1,
        quality: slot.quality || 0,
        gearUid: i === 0 ? slot.gearUid : null,
        affixes: i === 0 ? slot.affixes : null,
        lockedAffixes: i === 0 ? slot.lockedAffixes : [],
      }));
    }
  }
  state.sect.inventory = normalized.filter((slot) => slot && Number(slot.count || 0) > 0);
}

function normalizeDiscipleProgression(d) {
  d.equipment = d.equipment || {};
  for (const slot of gearSlots) {
    if (!(slot.key in d.equipment)) d.equipment[slot.key] = null;
    if (d.equipment[slot.key] && slot.key !== "relic") ensureGearInstance(d.equipment[slot.key]);
  }
  if (!catalogById(daoHeartCatalog, d.daoHeart)) d.daoHeart = pickDaoHeart().id;
  d.constitution = catalogById(constitutionCatalog, d.constitution) ? d.constitution : "";
  d.constitutionAwakened = Boolean(d.constitution);
  if (!catalogById(specializationCatalog, d.specialization)) d.specialization = inferSpecialization(d);
  d.specializationExp = clamp(Number(d.specializationExp || 0), 0, 9999);
  d.specializationLevel = clamp(Number(d.specializationLevel || 0), 0, 20);
  d.mentorId = d.mentorId || "";
  d.seclusion = d.seclusion && Number(d.seclusion.yearsLeft || 0) > 0 ? d.seclusion : null;
  d.bondedArtifact = d.bondedArtifact || null;
  d.titles = Array.isArray(d.titles) ? d.titles.filter((id) => catalogById(discipleTitleCatalog, id)) : [];
  d.personalFame = Number(d.personalFame || 0);
  d.lastPersonalEventYear = Number(d.lastPersonalEventYear || 0);
  d.elementDamage = d.elementDamage || {};
  d.methods = Array.isArray(d.methods) ? d.methods : [];
  d.activeMethods = Array.isArray(d.activeMethods) ? d.activeMethods.slice(0, 5) : d.methods.slice(0, 5).map((method) => method.id);
  for (const method of d.methods) {
    method.quality = gearTier(method.quality || method.rarity || 0);
    method.proficiency = clamp(Number(method.proficiency || 0), 0, 100);
  }
  d.activeMethods = d.activeMethods.filter((id) => d.methods.some((method) => method.id === id)).slice(0, 5);
}

function gearBaseValue(stat, value, quality = 0) {
  return Math.round(value * (1 + gearTier(quality) * 0.45));
}

function mutateDiscipleStat(d, stat, value) {
  if (elementNames.includes(stat)) {
    d.elementDamage = d.elementDamage || {};
    d.elementDamage[stat] = Math.max(0, Math.round((d.elementDamage[stat] || 0) + value));
    return;
  }
  d[stat] = Math.round((d[stat] || 0) + value);
}

function applyGearStats(d, gear, sign = 1) {
  const item = itemCatalog[gear?.id];
  if (!d || !item?.equipment || item.slot === "relic") return;
  const quality = gearTier(gear.quality);
  const baseStats = gearBaseStats[item.slot] || {};
  for (const [stat, value] of Object.entries(baseStats)) {
    mutateDiscipleStat(d, stat, sign * gearBaseValue(stat, value, quality));
  }
  for (const affix of gear.affixes || []) {
    mutateDiscipleStat(d, affix.stat, sign * Number(affix.value || 0));
  }
  d.aptitude = clamp(d.aptitude, 1, 220);
  d.temper = clamp(d.temper, 1, 220);
  d.hp = Math.max(1, d.hp);
  d.atk = Math.max(1, d.atk);
  d.def = Math.max(0, d.def);
  d.speed = Math.max(1, d.speed);
}

function affixLabel(affix) {
  if (!affix) return "";
  const suffix = affix.pct ? "%" : "";
  return `[${affix.rarityName || affix.rarity || ""}]${affix.name}+${affix.value}${suffix}`;
}

function gearAffixSummary(gear) {
  return (gear?.affixes || []).map(affixLabel).filter(Boolean).join(" / ");
}

function lockAffixCost(count) {
  if (count <= 0) return 0;
  return Math.pow(2, count - 1);
}

function openGearRefinePanel(gearUid) {
  const slot = state.sect.inventory.find((item) => item.gearUid === gearUid);
  const item = itemCatalog[slot?.id];
  if (!slot || !item?.equipment) return;
  showModal({
    kicker: "装备洗练",
    title: `${gearTierName(slot.quality)}${item.name}`,
    body: `
      <p>消耗 1 个洗练灵砂重洗未锁定词条。锁定词条需要定纹玉扣：锁 1 位消耗 1，锁 2 位消耗 2，锁 3 位消耗 4，锁 4 位消耗 8。</p>
      <p>当前材料：洗练灵砂 ${itemCount("refineStone")}，定纹玉扣 ${itemCount("affixLock")}。</p>
      <div class="method-list">
        ${(slot.affixes || []).map((affix, index) => `
          <label class="method-card">
            <strong>${affixLabel(affix)}</strong>
            <span>${affix.element ? "属性伤害" : affix.pct ? "百分比词条" : "基础属性"}</span>
            <label><input type="checkbox" class="affix-lock-pick" value="${index}"> 锁定此词条</label>
          </label>
        `).join("")}
      </div>
    `,
    actions: [
      { label: "开始洗练", handler: () => refineGearAffixes(slot.gearUid) },
      { label: "关闭", handler: closeModal },
    ],
  });
}

function refineGearAffixes(gearUid) {
  const slot = state.sect.inventory.find((item) => item.gearUid === gearUid);
  if (!slot || !itemCatalog[slot.id]?.equipment) return;
  const locked = [...els.modalBody.querySelectorAll(".affix-lock-pick:checked")].map((input) => Number(input.value));
  const lockCost = lockAffixCost(locked.length);
  if (itemCount("refineStone") < 1) {
    flashFeedback("缺少洗练灵砂", "warn");
    return;
  }
  if (itemCount("affixLock") < lockCost) {
    flashFeedback(`锁定这些词条需要 ${lockCost} 个定纹玉扣`, "warn");
    return;
  }
  consumeItemCount("refineStone", 1);
  if (lockCost) consumeItemCount("affixLock", lockCost);
  const fresh = rollGearAffixes(slot.quality);
  const old = slot.affixes || [];
  slot.affixes = fresh.map((affix, index) => locked.includes(index) ? old[index] || affix : affix);
  log(`${itemCatalog[slot.id].name}洗练完成：${gearAffixSummary(slot)}`, "good");
  closeModal();
  render();
}

function methodEffectScale(method, data = {}, d = null) {
  const quality = gearTier(method?.quality || data.rarity || 0);
  const proficiency = clamp(Number(method?.proficiency || 0), 0, 100);
  const mastery = Number(d?.methodMastery || 0) / 100;
  return 1 + quality * 0.18 + proficiency * (0.006 + quality * 0.0015) + mastery;
}

function methodPowerBonus(d) {
  const active = Array.isArray(d.activeMethods) ? d.activeMethods : [];
  return active.reduce((sum, id) => {
    const known = d.methods?.find((method) => method.id === id);
    const data = methodCatalog[id];
    if (!known || !data) return sum;
    const flat = (data.atk || 0) * 2.1 + (data.def || 0) * 1.7 + (data.hp || 0) * 0.75 + (data.speed || 0) * 1.45;
    const special = (data.damagePct || 0) * 8 + (data.reducePct || 0) * 7 + (data.elementDamage || 0) * 1.5 + (data.heal || 0) * 1.1 + (data.shield || 0) * 1.1 + (data.poison || 0) * 1.2 + (data.pierce || 0) * 7;
    return sum + (flat + special) * methodEffectScale(known, data, d);
  }, 0);
}

function gearPowerBonus(d) {
  const gears = Object.values(d.equipment || {}).filter((gear) => gear && itemCatalog[gear.id]?.equipment && itemCatalog[gear.id]?.slot !== "relic");
  return gears.reduce((sum, gear) => {
    const baseStats = gearBaseStats[itemCatalog[gear.id]?.slot] || {};
    const base = Object.entries(baseStats).reduce((total, [stat, value]) => {
      const scaled = gearBaseValue(stat, value, gear.quality);
      return total + (stat === "atk" ? scaled * 1.2 : stat === "def" ? scaled : stat === "hp" ? scaled * 0.45 : scaled * 0.8);
    }, 0);
    const affix = (gear.affixes || []).reduce((total, item) => total + Number(item.value || 0) * (item.pct ? 4 : item.element ? 1.25 : 0.8), 0);
    return sum + base + affix;
  }, 0);
}

function learnMethod(d, slot) {
  const data = methodCatalog[slot?.id];
  if (!d || !data || !slot || slot.count <= 0) return;
  normalizeDiscipleProgression(d);
  if (d.methods.some((method) => method.id === data.id)) {
    const known = d.methods.find((method) => method.id === data.id);
    known.proficiency = clamp((known.proficiency || 0) + 12 + gearTier(slot.quality) * 4, 0, 100);
    log(`${d.name}温故${data.name}，熟练度提升至 ${known.proficiency}。`, "good");
  } else {
    d.methods.push({ id: data.id, quality: gearTier(slot.quality || data.rarity || 0), proficiency: 8 + gearTier(slot.quality) * 4 });
    if (d.activeMethods.length < 5) d.activeMethods.push(data.id);
    log(`${d.name}参悟${gearTierName(slot.quality)}${data.name}，已加入功法库。`, "good");
  }
  slot.count -= 1;
  state.sect.inventory = state.sect.inventory.filter((item) => item.count > 0);
  syncSharedWorld();
  render();
}

function openMethodPanel(d) {
  normalizeDiscipleProgression(d);
  const known = d.methods.map((method) => ({ ...method, data: methodCatalog[method.id] })).filter((method) => method.data);
  const activeSet = new Set(d.activeMethods || []);
  showModal({
    kicker: "功法配置",
    title: d.name,
    body: `
      <p>最多携带五本功法，战斗时按携带顺序释放。熟练度会提高功法对战力和战斗表现的影响。</p>
      <div class="method-list">
        ${known.length ? known.map((method, index) => `
          <article class="method-card ${activeSet.has(method.id) ? "is-active" : ""}">
            <strong>${method.data.name}</strong>
            <span>${method.data.role} · ${gearTierName(method.quality)} · 熟练 ${Math.round(method.proficiency || 0)}/100</span>
            <em>${method.data.element ? `${method.data.element}属性` : "无属性"} ${method.data.damagePct ? `增伤${method.data.damagePct}%` : ""} ${method.data.reducePct ? `减伤${method.data.reducePct}%` : ""}</em>
            <div class="method-actions">
              <button data-method="${method.id}" data-action="${activeSet.has(method.id) ? "drop" : "equip"}">${activeSet.has(method.id) ? "卸下" : "携带"}</button>
              <button data-method="${method.id}" data-action="up" ${!activeSet.has(method.id) || d.activeMethods.indexOf(method.id) <= 0 ? "disabled" : ""}>上移</button>
              <button data-method="${method.id}" data-action="down" ${!activeSet.has(method.id) || d.activeMethods.indexOf(method.id) >= d.activeMethods.length - 1 ? "disabled" : ""}>下移</button>
              <button data-method="${method.id}" data-action="train" ${state.actionPoints < 1 || state.sect.insight < 30 ? "disabled" : ""}>参悟</button>
            </div>
          </article>
        `).join("") : `<div class="target-detail">尚未参悟功法，可从奇遇、拍卖和流浪商人处获得功法残卷。</div>`}
      </div>
    `,
    actions: [{ label: "完成", handler: () => { closeModal(); render(); } }],
  });
  els.modalBody.querySelectorAll("button[data-method]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.method;
      const action = btn.dataset.action;
      const pos = d.activeMethods.indexOf(id);
      if (action === "equip" && pos < 0 && d.activeMethods.length < 5) d.activeMethods.push(id);
      if (action === "drop" && pos >= 0) d.activeMethods.splice(pos, 1);
      if (action === "up" && pos > 0) [d.activeMethods[pos - 1], d.activeMethods[pos]] = [d.activeMethods[pos], d.activeMethods[pos - 1]];
      if (action === "down" && pos >= 0 && pos < d.activeMethods.length - 1) [d.activeMethods[pos + 1], d.activeMethods[pos]] = [d.activeMethods[pos], d.activeMethods[pos + 1]];
      if (action === "train") {
        if (!spendAction(1, "参悟功法")) return;
        if (state.sect.insight < 30) {
          state.actionPoints += 1;
          log("参悟功法需要 30 参悟。", "warn");
          return;
        }
        state.sect.insight -= 30;
        const knownMethod = d.methods.find((method) => method.id === id);
        if (knownMethod) knownMethod.proficiency = clamp((knownMethod.proficiency || 0) + 8 + Math.floor((state.sect.site.aura || 1) / 18), 0, 100);
      }
      openMethodPanel(d);
    });
  });
}

function itemLabel(slot) {
  const item = itemCatalog[slot.id];
  if (!item) return slot.id || "未知物品";
  if (item?.material) return item.name;
  return `${gearTierName(slot.quality || 0)}${item.name}`;
}

function addItem(itemId, count = 1, quality = 0) {
  const item = itemCatalog[itemId];
  if (!item) {
    console.warn(`未知物品未入库：${itemId}`);
    return;
  }
  if (item?.equipment && item.slot !== "relic") {
    for (let i = 0; i < count; i += 1) {
      state.sect.inventory.push(ensureGearInstance({ id: itemId, count: 1, quality }));
    }
    return;
  }
  const slot = state.sect.inventory.find((item) => item.id === itemId && (item.quality || 0) === quality);
  if (slot) slot.count += count;
  else state.sect.inventory.push({ id: itemId, count, quality });
}

function useItemOnSelected(itemId, quality = 0, gearUid = null) {
  const d = selectedDisciple();
  const slot = state.sect?.inventory.find((item) => item.id === itemId && (item.quality || 0) === quality && (!gearUid || item.gearUid === gearUid));
  const item = itemCatalog[itemId];
  if (!d || !slot || slot.count <= 0 || !item) return;
  if (methodCatalog[itemId]) {
    learnMethod(d, slot);
    return;
  }
  if (item.equipment) {
    equipItem(d, slot);
    return;
  }
  if (item.material || typeof item.apply !== "function") {
    log(`${item.name}是${item.kind || "材料"}，请在对应炼丹、炼器、晋升或洗练功能中消耗。`, "warn");
    render();
    return;
  }
  item.apply(d, quality);
  slot.count -= 1;
  state.sect.inventory = state.sect.inventory.filter((item) => item.count > 0);
  d.aptitude = clamp(d.aptitude, 1, 140);
  d.temper = clamp(d.temper, 1, 140);
  if (d.exp >= 100 && d.realm < realms.length - 1) {
    log(`${d.name}借${qualityNames[quality]}${item.name}触及瓶颈，天劫将临。`, "good");
    maybeAutoTribulation(d);
  } else {
    log(`${d.name}使用${qualityNames[quality]}${item.name}，${item.text}。`, "good");
  }
  syncSharedWorld();
  render();
}

function equipItem(d, slot) {
  const item = itemCatalog[slot.id];
  const equipSlot = item.slot;
  if (d.equipment[equipSlot]) unequipItem(d, equipSlot, false);
  const gear = ensureGearInstance({ ...slot, count: 1 });
  applyGearStats(d, gear, 1);
  d.equipment[equipSlot] = gear;
  slot.count -= 1;
  state.sect.inventory = state.sect.inventory.filter((itemSlot) => itemSlot.count > 0);
  log(`${d.name}装备${gearTierName(slot.quality || 0)}${item.name}。${gearAffixSummary(gear)}`, "good");
  render();
}

function unequipItem(d, equipSlot, rerender = true) {
  const equipped = d.equipment[equipSlot];
  if (!equipped) return;
  if (equipSlot === "relic") {
    const relic = forbiddenRelics.find((item) => item.id === equipped.id);
    state.sect.relicInventory.push({ id: equipped.id });
    d.equipment[equipSlot] = null;
    log(`${d.name}卸下遗物「${relic?.name || equipped.id}」，已放回宗门遗物匣。`);
    if (rerender) render();
    return;
  }
  const item = itemCatalog[equipped.id];
  applyGearStats(d, equipped, -1);
  if (item?.equipment) state.sect.inventory.push(ensureGearInstance({ ...equipped, count: 1 }));
  else state.sect.inventory.push({ id: equipped.id, count: 1, quality: equipped.quality || 0 });
  d.equipment[equipSlot] = null;
  log(`${d.name}卸下${item ? `${gearTierName(equipped.quality || 0)}${item.name}` : "旧装备"}，已放回仓库。`);
  if (rerender) render();
}

function equipRelic(d, relicSlot) {
  const relic = forbiddenRelics.find((item) => item.id === relicSlot.id);
  if (!d || !relic) return;
  if (d.equipment.relic) unequipItem(d, "relic", false);
  d.equipment.relic = { id: relic.id };
  const idx = state.sect.relicInventory.indexOf(relicSlot);
  if (idx >= 0) state.sect.relicInventory.splice(idx, 1);
  log(`${d.name}装备禁地遗物「${relic.name}」：${relic.text}`, "good");
  render();
}

function traitCraftBonus(d, key) {
  const trait = d.traits.reduce((sum, t) => sum + (t[key] || 0), 0);
  const spec = specializationOf(d);
  const specCraft = Number(spec?.craft?.[key] || 0) + (spec?.id === key ? Number(d.specializationLevel || 0) * 3 : 0);
  return trait + specCraft;
}

function craftCost(kind) {
  const base = kind === "alchemy" ? 120 : 150;
  const omenDiscount = state.yearlyBoon?.key === "wealthBonus" ? 35 : 0;
  const materialDiscount = state.yearlyBoon?.key === "materialEase" ? 22 : 0;
  const guildDiscount = state.yearlyBoon?.key === "craftGuild" && kind === "forging" ? 18 : 0;
  const marketDiscount = (state.sect?.buildings.market || 0) * 12;
  const daoDiscount = kind === "alchemy" ? daoLevelFor("alchemy") * 5 : kind === "forging" ? daoLevelFor("forging") * 5 : 0;
  return Math.max(kind === "alchemy" ? 60 : 75, base - omenDiscount - materialDiscount - guildDiscount - marketDiscount - daoDiscount);
}

function itemCount(itemId) {
  return state.sect?.inventory
    .filter((slot) => slot.id === itemId)
    .reduce((sum, slot) => sum + slot.count, 0) || 0;
}

function recipeMaterialText(recipe, kind = "alchemy") {
  const parts = [];
  if (recipe.generic) parts.push(`${kind === "forging" ? "通用器材" : "通用丹材"} x${recipe.generic}`);
  for (const [id, count] of Object.entries(recipe.materials || {})) parts.push(`${itemCatalog[id].name} x${count}`);
  return parts.join("、");
}

function recipeGenericKey(kind) {
  return kind === "forging" ? "forgingMats" : "alchemyMats";
}

function canCraftRecipe(recipe, kind = "alchemy") {
  if (state.sect.stones < recipe.stones) return false;
  if (state.sect[recipeGenericKey(kind)] < (recipe.generic || 0)) return false;
  return Object.entries(recipe.materials || {}).every(([id, count]) => itemCount(id) >= count);
}

function canCraftRecipeBatch(recipe, kind = "alchemy", batch = 1) {
  if (state.sect.stones < recipe.stones * batch) return false;
  if (state.sect[recipeGenericKey(kind)] < (recipe.generic || 0) * batch) return false;
  return Object.entries(recipe.materials || {}).every(([id, count]) => itemCount(id) >= count * batch);
}

function consumeItemCount(itemId, count) {
  let need = count;
  for (const slot of state.sect.inventory.filter((item) => item.id === itemId)) {
    const take = Math.min(slot.count, need);
    slot.count -= take;
    need -= take;
    if (need <= 0) break;
  }
  state.sect.inventory = state.sect.inventory.filter((item) => item.count > 0);
}

function consumeRecipe(recipe, kind = "alchemy") {
  state.sect.stones -= recipe.stones;
  state.sect[recipeGenericKey(kind)] -= recipe.generic || 0;
  for (const [id, count] of Object.entries(recipe.materials || {})) consumeItemCount(id, count);
}

function openAlchemyRecipePicker(d) {
  ensureSectDefaults();
  const unlocked = new Set(state.sect.unlockedAlchemyRecipes || ["qiPill", "minorHealPill"]);
  showModal({
    kicker: "选择丹方",
    title: `${d.name}准备开炉`,
    body: `
      <p>炼丹不再随机出丹。每张丹方消耗固定材料，材料主要从机缘选择中获得；下方只提示哪些机缘类型可能产出，不提示具体选项。</p>
      <div class="recipe-list">
        ${alchemyRecipes.map((recipe) => {
          const item = itemCatalog[recipe.output];
          const locked = !unlocked.has(recipe.id);
          const ready = !locked && canCraftRecipe(recipe, "alchemy");
          return `<article class="recipe-card ${ready ? "" : "is-locked"}">
            <strong>${recipe.name}：${item.name}</strong>
            <span>${item.text}</span>
            <em>消耗：${recipe.stones} 灵石、${recipeMaterialText(recipe, "alchemy")}</em>
            <small>来源提示：${recipe.source}</small>
            <button class="recipe-craft" data-recipe="${recipe.id}" ${ready && state.actionPoints >= 1 ? "" : "disabled"}>${locked ? "未获丹方" : ready ? "炼制此丹" : "材料不足"}</button>
            <button class="recipe-craft" data-recipe="${recipe.id}" data-batch="3" ${!locked && canCraftRecipeBatch(recipe, "alchemy", 3) && state.actionPoints >= 1 ? "" : "disabled"}>批量3份</button>
          </article>`;
        }).join("")}
      </div>
    `,
    actions: [{ label: "暂不开炉", handler: closeModal }],
  });
  for (const btn of els.modalBody.querySelectorAll(".recipe-craft")) {
    btn.addEventListener("click", () => {
      const recipe = alchemyRecipes.find((item) => item.id === btn.dataset.recipe);
      if (!recipe) return;
      closeModal();
      craftItem("alchemy", d.id, recipe.id, Number(btn.dataset.batch || 1));
    });
  }
}

function openForgeRecipePicker(d) {
  showModal({
    kicker: "选择器方",
    title: `${d.name}准备开炉`,
    body: `
      <p>炼器现在与炼丹一致，先选器方再消耗材料。器材材料从矿脉、地火、星陨、龙骨等机缘获得，商品不会与山门市集投机仓位混用。</p>
      <div class="recipe-list">
        ${forgingRecipes.map((recipe) => {
          const item = itemCatalog[recipe.output];
          const ready = canCraftRecipe(recipe, "forging");
          return `<article class="recipe-card ${ready ? "" : "is-locked"}">
            <strong>${recipe.name}：${item.name}</strong>
            <span>${item.text}</span>
            <em>消耗：${recipe.stones} 灵石、${recipeMaterialText(recipe, "forging")}</em>
            <small>来源提示：${recipe.source}</small>
            <button class="forge-craft" data-recipe="${recipe.id}" ${ready && state.actionPoints >= 1 ? "" : "disabled"}>${ready ? "炼制此器" : "材料不足"}</button>
            <button class="forge-craft" data-recipe="${recipe.id}" data-batch="3" ${canCraftRecipeBatch(recipe, "forging", 3) && state.actionPoints >= 1 ? "" : "disabled"}>批量3份</button>
          </article>`;
        }).join("")}
      </div>
    `,
    actions: [{ label: "暂不开炉", handler: closeModal }],
  });
  for (const btn of els.modalBody.querySelectorAll(".forge-craft")) {
    btn.addEventListener("click", () => {
      const recipe = forgingRecipes.find((item) => item.id === btn.dataset.recipe);
      if (!recipe) return;
      closeModal();
      craftItem("forging", d.id, recipe.id, Number(btn.dataset.batch || 1));
    });
  }
}

function craftItem(kind, discipleId = state.selectedDiscipleId, recipeId = null, batch = 1) {
  const d = state.sect?.disciples.find((item) => item.id === discipleId) || selectedDisciple();
  if (!d) {
    log("请先选择一名弟子，再安排炼丹或炼器。", "warn");
    return;
  }
  state.selectedDiscipleId = d.id;
  if (kind === "alchemy" && !recipeId) {
    openAlchemyRecipePicker(d);
    return;
  }
  if (kind === "forging" && !recipeId) {
    openForgeRecipePicker(d);
    return;
  }
  if (!spendAction(1, kind === "alchemy" ? "炼丹" : "炼器")) return;
  const recipe = kind === "alchemy" ? alchemyRecipes.find((item) => item.id === recipeId) : forgingRecipes.find((item) => item.id === recipeId);
  if (kind === "alchemy" && !state.sect.unlockedAlchemyRecipes.includes(recipeId)) {
    state.actionPoints += 1;
    log("尚未获得此丹方。除聚气丹和回春丹外，其余丹方主要通过拍卖会解锁。", "warn");
    render();
    return;
  }
  const cost = recipe?.stones || craftCost(kind);
  const matKey = kind === "alchemy" ? "alchemyMats" : "forgingMats";
  const matName = kind === "alchemy" ? "丹材" : "器材";
  batch = clamp(Math.floor(Number(batch || 1)), 1, 9);
  if (!recipe || !canCraftRecipeBatch(recipe, kind, batch)) {
    state.actionPoints += 1;
    log(`${kind === "alchemy" ? "丹方" : "器方"}材料不足，无法开炉。请探索对应机缘获取材料。`, "warn");
    render();
    return;
  }
  if (state.sect.stones < cost) {
    state.actionPoints += 1;
    log(`${kind === "alchemy" ? "炼丹" : "炼器"}需要 ${cost} 灵石。`, "warn");
    render();
    return;
  }
  if (state.sect[matKey] < 1) {
    state.actionPoints += 1;
    log(`${kind === "alchemy" ? "炼丹" : "炼器"}需要 1 份${matName}。占领对应资源点可稳定获取。`, "warn");
    render();
    return;
  }
  for (let i = 0; i < batch; i += 1) consumeRecipe(recipe, kind);
  const savedGeneric = state.yearlyBoon?.key === "materialEase" && Math.random() < 0.35;
  if (savedGeneric) state.sect[matKey] += 1;
  const craftBonus = traitCraftBonus(d, kind);
  const effectiveCraftBonus = Math.floor(craftBonus * 0.32);
  const yearlyCraft = (state.yearlyBoon?.key === "craftBonus" ? 1 : 0) + (state.yearlyBoon?.key === "craftGuild" && kind === "forging" ? 1 : 0);
  const base = d.realm + yearlyCraft + Math.floor((d.aptitude + d.temper) / 70) + Math.floor(effectiveCraftBonus / 28) + Math.floor(daoLevelFor(kind) / 2);
  let quality = clamp(Math.floor(base / 2), 0, qualityNames.length - 1);
  const leapChance = clamp(5 + effectiveCraftBonus + yearlyCraft * 9 + d.realm * 4 + Math.floor(d.luck / 5) + daoLevelFor(kind) * 2, 0, 45);
  const leaped = rand(1, 100) <= leapChance;
  if (leaped) quality = clamp(quality + 1, 0, qualityNames.length - 1);
  const itemId = recipe.output;
  addItem(itemId, batch, quality);
  d.exp += (7 + quality * 4) * batch;
  d.status = kind === "alchemy" ? "守炉" : "铸器";
  const item = itemCatalog[itemId];
  const craftText = kind === "alchemy" ? "开炉炼丹" : "引火炼器";
  log(`${d.name}${craftText}，按「${recipe.name}」批量 ${batch} 份，凭${d.traits.map((t) => t.name).join("、")}炼成${qualityNames[quality]}${item.name}${leaped ? "，火候骤然跃升，品质越阶" : ""}，已存入仓库。`, "good");
  if (savedGeneric) log("天炉回响，本次炼制返还 1 份通用材料。", "good");
  showCraftModal(d, item, quality, kind, leaped);
  render();
}

function log(text, tone = "") {
  state.logs.unshift({ text, tone, at: `${state.year}年 ${seasons[state.seasonIndex]}` });
  state.logs = state.logs.slice(0, 36);
  flashFeedback(text, tone);
}

let feedbackTimer = null;
function flashFeedback(text, tone = "") {
  if (!els.feedbackToast) return;
  const plain = String(text).replace(/<[^>]+>/g, "");
  els.feedbackToast.textContent = plain.length > 72 ? `${plain.slice(0, 72)}...` : plain;
  els.feedbackToast.className = `feedback-toast ${tone || ""}`;
  els.feedbackToast.hidden = false;
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    els.feedbackToast.hidden = true;
  }, 2600);
}

function runActionWithFeedback(label, handler) {
  const before = state.logs.length;
  (handler || closeModal)();
  if (state.multiplayer && state.roomConnected) {
    const clean = String(label || "操作").replace(/\s+/g, " ").trim();
    markPlayerAction(state.waitingForPlayers ? "已提交本年操作，等待全员" : clean, true);
  }
  if (state.logs.length === before) {
    const clean = String(label || "操作").replace(/\s+/g, " ").trim();
    flashFeedback(`已操作：${clean.length > 28 ? `${clean.slice(0, 28)}...` : clean}`);
  }
}

const net = {
  ws: null,
  reconnectTimer: null,
  reconnectAttempts: 0,
  reconnecting: false,
  manualClose: false,
  lastPlayers: [],
};

localStorage.setItem("cultivation-sect-client-id", state.clientId);

function roomCodeValue() {
  const raw = (els.lobbyRoomCodeInput?.value || els.roomCodeInput?.value || state.roomCode || "").trim().toUpperCase();
  return raw.replace(/[^A-Z0-9_-]/g, "").slice(0, 16);
}

function updateRoomStatus(text, tone = "") {
  const className = `room-status ${tone === "online" ? "is-online" : tone === "warn" ? "is-warn" : ""}`;
  if (els.roomStatus) {
    els.roomStatus.textContent = text;
    els.roomStatus.className = className;
  }
  if (els.lobbyRoomStatus) {
    els.lobbyRoomStatus.textContent = text;
    els.lobbyRoomStatus.className = className;
  }
  if (els.lobbyHostStatus) {
    els.lobbyHostStatus.textContent = state.roomConnected ? (state.roomHost ? "房主" : "成员") : "未入席";
  }
}

function showStartScreen() {
  els.startScreen?.classList.remove("is-hidden");
  els.appShell?.classList.add("is-hidden");
}

function showGameShell() {
  els.startScreen?.classList.add("is-hidden");
  els.appShell?.classList.remove("is-hidden");
}

function showStartMenuPanel() {
  els.startPanel?.classList.remove("is-hidden");
  els.multiplayerLobby?.classList.add("is-hidden");
  if (els.roomPanel) els.roomPanel.hidden = true;
}

function showMultiplayerLobbyPanel() {
  els.startPanel?.classList.add("is-hidden");
  els.multiplayerLobby?.classList.remove("is-hidden");
  if (els.roomPanel) els.roomPanel.hidden = true;
  updateRoomStatus(state.roomConnected ? `已连接房间 ${state.roomCode}` : "未连接房间", state.roomConnected ? "online" : "warn");
  updateRoomPopulation(state.roomConnected ? (net.lastPlayers.length ? net.lastPlayers : roomPopulationSnapshot()) : []);
  updateMultiplayerLobbyControls();
  setTimeout(() => els.lobbyRoomCodeInput?.focus(), 0);
}

function markPlayerAction(label = "操作中", broadcast = true) {
  state.currentAction = String(label || "操作中").replace(/\s+/g, " ").trim().slice(0, 32) || "操作中";
  state.currentActionAt = Date.now();
  if (broadcast && state.multiplayer && state.roomConnected) syncPublicState();
}

function isPlayerReadyForYear(player, year = state.year) {
  return Boolean(player?.ready) && Number(player.readyYear || 0) === Number(year);
}

function areRoomPlayersReadyForYear(players = net.lastPlayers, year = state.year) {
  const eligible = eligibleRoomPlayers(players);
  return eligible.length > 0 && eligible.every((player) => isPlayerReadyForYear(player, year));
}

function refreshSelectedRemotePlayer() {
  if (state.selected?.type !== "remotePlayer") return;
  const fresh = state.remotePlayers.find((player) => player.id === state.selected.id);
  if (fresh) state.selected = fresh;
}

function roomPlayerListHtml(players = []) {
  const uniquePlayers = Array.isArray(players)
    ? Array.from(new Map(players.map((player, index) => [player.id || player.name || `player-${index}`, player])).values())
    : [];
  if (!state.multiplayer && !state.roomConnected) {
    return "";
  }
  const selfId = state.clientId;
  return uniquePlayers
    .sort((a, b) => (a.id === selfId ? -1 : b.id === selfId ? 1 : String(a.name || "").localeCompare(String(b.name || ""))))
    .map((player) => {
      const ready = isPlayerReadyForYear(player);
      const stale = Number(player.year || state.year) !== Number(state.year);
      const lobbyReady = Boolean(player.lobbyReady);
      const status = !state.founded ? (lobbyReady ? "大厅已准备" : "等待准备") : ready ? "已提交" : stale ? `年份${player.year || "?"}` : "操作中";
      const action = !state.founded ? (player.online === false ? "离线" : lobbyReady ? "等待房主开始" : "正在大厅") : player.activity || (ready ? "等待全员" : "操作中");
      return `
        <article class="room-player ${ready || lobbyReady ? "is-ready" : ""} ${stale && state.founded ? "is-stale" : ""}">
          <div>
            <strong>${tradeEscape(player.name || "未立宗门")}${player.id === selfId ? "（我）" : ""}</strong>
            <span>${tradeEscape(status)} · ${tradeEscape(action)}</span>
          </div>
          <em>战力 ${Math.round(player.power || 0)} · 弟子 ${player.disciples || 0} · ${tradeEscape(realms[player.maxRealm || 0] || "凡人")}</em>
        </article>
      `;
    }).join("") || `<article class="room-player"><div><strong>等待连接</strong><span>暂无玩家状态</span></div></article>`;
}

function renderRoomPlayerList(players = []) {
  const html = roomPlayerListHtml(players);
  if (els.roomPlayerList) {
    els.roomPlayerList.innerHTML = html;
    els.roomPlayerList.hidden = !html || (!state.multiplayer && !state.roomConnected);
  }
  if (els.lobbyPlayerList) {
    els.lobbyPlayerList.innerHTML = html || `<article class="room-player"><div><strong>等待连接</strong><span>输入房间号后进入大厅</span></div></article>`;
  }
}

function updateRoomPopulation(players = []) {
  const uniquePlayers = Array.isArray(players)
    ? Array.from(new Map(players.map((player, index) => [player.id || player.name || `player-${index}`, player])).values())
    : [];
  const founded = uniquePlayers.filter((player) => player.founded).length;
  const suffix = net.reconnecting && uniquePlayers.length ? " · 重连中" : "";
  const connectedText = uniquePlayers.length
    ? `房间人数：${uniquePlayers.length}（已立宗 ${founded}）`
    : `房间人数：${state.roomConnected ? 1 : 0}`;
  if (els.roomCount) els.roomCount.textContent = `${connectedText}${suffix}`;
  if (els.lobbyRoomCount) els.lobbyRoomCount.textContent = `${uniquePlayers.length || (state.roomConnected ? 1 : 0)}${suffix ? " · 重连中" : ""}`;
  if (els.lobbyHostStatus) els.lobbyHostStatus.textContent = state.roomConnected ? (state.roomHost ? "房主" : "成员") : "未入席";
  if (els.roomSummary) {
    els.roomSummary.textContent = `${connectedText}${state.roomHost ? " · 房主" : ""}${suffix}`;
    els.roomSummary.hidden = !(state.multiplayer || state.roomConnected);
  }
  const visiblePlayers = uniquePlayers.length ? uniquePlayers : (state.roomConnected ? roomPopulationSnapshot() : []);
  renderRoomPlayerList(visiblePlayers);
  updateMultiplayerLobbyControls(visiblePlayers);
}

function roomLobbyPlayers(players = net.lastPlayers) {
  if (!state.roomConnected) return [];
  const list = Array.isArray(players) && players.length ? players : roomPopulationSnapshot();
  return Array.from(new Map(list.filter((player) => player && player.id && player.online !== false).map((player, index) => [player.id || `player-${index}`, player])).values());
}

function areLobbyPlayersReady(players = net.lastPlayers) {
  const list = roomLobbyPlayers(players);
  return list.length > 0 && list.every((player) => Boolean(player.lobbyReady));
}

function updateMultiplayerLobbyControls(players = net.lastPlayers) {
  const room = roomCodeValue() || state.roomCode || "";
  const connected = Boolean(state.roomConnected && state.multiplayer);
  const list = roomLobbyPlayers(players);
  const allReady = areLobbyPlayersReady(list);
  const hasSave = Boolean(room && readRoomSave(room)?.data?.state);
  if (els.lobbyReadyBtn) {
    els.lobbyReadyBtn.disabled = !connected;
    els.lobbyReadyBtn.textContent = state.roomLobbyReady ? "取消准备" : "准备";
  }
  if (els.lobbyStartBtn) {
    els.lobbyStartBtn.disabled = !connected || !state.roomHost || !allReady || !list.length;
    els.lobbyStartBtn.textContent = state.roomHost ? "房主开始游戏" : "等待房主开始";
  }
  if (els.lobbyLoadBtn) els.lobbyLoadBtn.disabled = !room || !hasSave;
  if (els.lobbySaveSummary) els.lobbySaveSummary.textContent = `联机存档：${room ? roomSaveSummary(room) : "请输入房间号后查看"}`;
  if (els.lobbyHostStatus) els.lobbyHostStatus.textContent = connected ? (state.roomHost ? "房主" : "成员") : "未入席";
}

function toggleLobbyReady() {
  if (!state.multiplayer || !state.roomConnected) {
    flashFeedback("请先进入联机房间", "warn");
    return;
  }
  state.roomLobbyReady = !state.roomLobbyReady;
  markPlayerAction(state.roomLobbyReady ? "大厅已准备" : "取消大厅准备", false);
  syncPublicState();
  updateRoomPopulation(net.lastPlayers.length ? net.lastPlayers : roomPopulationSnapshot());
  flashFeedback(state.roomLobbyReady ? "已准备，等待房主开始" : "已取消准备", state.roomLobbyReady ? "good" : "warn");
}

function startMultiplayerGameFromLobby(remote = false) {
  if (!state.multiplayer || !state.roomConnected) {
    flashFeedback("请先进入联机房间", "warn");
    return;
  }
  const players = roomLobbyPlayers(net.lastPlayers.length ? net.lastPlayers : roomPopulationSnapshot());
  if (!remote && (!state.roomHost || !areLobbyPlayersReady(players))) {
    flashFeedback(state.roomHost ? "仍有玩家未准备" : "只有房主可以开始游戏", "warn");
    return;
  }
  state.roomLobbyReady = true;
  if (!remote) sendRoomFeature("lobby_start", { roomCode: state.roomCode, year: state.year, players });
  showGameShell();
  closeModal();
  els.hint.textContent = "联机模式已进入大世界。请选择宗门所在地；全员完成操作后才会推进到下一年。";
  markPlayerAction("进入联机大世界", true);
  flashFeedback(remote ? "房主已开始游戏，请选择宗门所在地" : "房间已开始，请选择宗门所在地", "good");
  render();
}

function roomPopulationSnapshot() {
  const self = getPublicPlayerState();
  return [
    self,
    ...(Array.isArray(state.remotePlayers) ? state.remotePlayers : []),
  ].filter((player) => player && player.id);
}

function scheduleRoomReconnect(reason = "连接断开") {
  if (!state.multiplayer || net.manualClose || !state.roomCode) return;
  clearTimeout(net.reconnectTimer);
  net.reconnecting = true;
  net.reconnectAttempts = Math.min(net.reconnectAttempts + 1, 8);
  const delay = Math.min(1200 + net.reconnectAttempts * 900, 8000);
  updateRoomStatus(`${reason}，${Math.round(delay / 1000)} 秒后自动重连房间 ${state.roomCode}...`, "warn");
  updateRoomPopulation(net.lastPlayers.length ? net.lastPlayers : roomPopulationSnapshot());
  net.reconnectTimer = setTimeout(() => {
    connectMultiplayerRoom(state.roomCode);
  }, delay);
}

function configuredBackendUrl() {
  const queryBackend = new URLSearchParams(location.search).get("backend");
  if (queryBackend) localStorage.setItem("sect-backend-url", queryBackend);
  return String(window.SECT_BACKEND_URL || localStorage.getItem("sect-backend-url") || "").trim().replace(/\/+$/, "");
}

function enterGameMode(mode = "solo") {
  const isMulti = mode === "multi";
  state.multiplayer = isMulti;
  if (els.multiplayerToggle) els.multiplayerToggle.checked = isMulti;
  for (const item of els.startPanel.querySelectorAll(".mode-card")) item.classList.toggle("is-active", item.dataset.mode === mode);
  if (isMulti) {
    showMultiplayerLobbyPanel();
    updateRoomStatus("请输入房间号并进入联机大厅", "warn");
    flashFeedback("已进入联机房间菜单", "good");
  } else {
    clearTimeout(net.reconnectTimer);
    net.reconnectAttempts = 0;
    net.reconnecting = false;
    net.lastPlayers = [];
    if (net.ws) {
      net.manualClose = true;
      net.ws.close();
      net.ws = null;
    }
    state.roomConnected = false;
    state.roomHost = false;
    state.roomLobbyReady = false;
    state.remotePlayers = [];
    state.readyPlayers = [];
    state.roomBlockedByForbidden = null;
    updateRoomStatus("未连接房间", "warn");
    updateRoomPopulation([]);
    showGameShell();
    els.hint.textContent = "单机模式已进入大世界。请选择宗门所在地，AI 宗门会自动发展并参与争夺。";
    flashFeedback("已进入单机模式，请选择宗门所在地", "good");
  }
  updateButtons();
  render();
}

function wsUrlForRoom(roomCode) {
  const backend = configuredBackendUrl();
  if (backend) {
    const url = new URL(backend, location.href);
    const protocol = url.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${url.host}/ws?room=${encodeURIComponent(roomCode)}`;
  }
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  const host = location.host || "127.0.0.1:8097";
  return `${protocol}://${host}/ws?room=${encodeURIComponent(roomCode)}`;
}

function connectMultiplayerRoom(roomCode = roomCodeValue()) {
  roomCode = String(roomCode || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 16);
  if (!roomCode) {
    updateRoomStatus("请先输入房间号", "warn");
    flashFeedback("联机房间号不能为空", "warn");
    updateMultiplayerLobbyControls();
    return;
  }
  if (!("WebSocket" in window)) {
    updateRoomStatus("当前浏览器不支持 WebSocket。", "warn");
    return;
  }
  if (location.protocol === "file:") {
    updateRoomStatus("请通过房间服务器打开页面，不能用 file:// 联机。", "warn");
    return;
  }
  if (location.hostname.endsWith(".netlify.app") && !configuredBackendUrl()) {
    updateRoomStatus("Netlify 只托管前端，请先在 config.js 配置联机服务器地址。", "warn");
    flashFeedback("Netlify 页面需要外部 WebSocket 房间服务器", "warn");
    return;
  }
  if (state.roomCode && state.roomCode !== roomCode) state.roomLobbyReady = false;
  state.roomCode = roomCode;
  if (els.roomCodeInput) els.roomCodeInput.value = roomCode;
  if (els.lobbyRoomCodeInput) els.lobbyRoomCodeInput.value = roomCode;
  if (net.ws && net.ws.readyState === WebSocket.OPEN) {
    sendNet("public_state", { player: getPublicPlayerState() });
    return;
  }
  try {
    clearTimeout(net.reconnectTimer);
    net.manualClose = false;
    const oldSocket = net.ws;
    if (oldSocket && oldSocket.readyState < WebSocket.CLOSING) oldSocket.close();
    const ws = new WebSocket(wsUrlForRoom(roomCode));
    net.ws = ws;
    updateRoomStatus(`正在连接房间 ${roomCode}...`);
    ws.addEventListener("open", () => {
      if (net.ws !== ws) return;
      const wasReconnecting = net.reconnecting || net.reconnectAttempts > 0;
      state.multiplayer = true;
      state.roomConnected = true;
      net.reconnectAttempts = 0;
      net.reconnecting = false;
      if (els.multiplayerToggle) els.multiplayerToggle.checked = true;
      if (els.roomPanel) els.roomPanel.hidden = true;
      updateRoomStatus(`已连接房间 ${roomCode}`, "online");
      markPlayerAction("已连接房间", false);
      net.lastPlayers = [getPublicPlayerState()];
      updateRoomPopulation(net.lastPlayers);
      sendNet("join", { player: getPublicPlayerState() });
      flashFeedback(wasReconnecting ? `联机房间 ${roomCode} 已重连` : `联机房间 ${roomCode} 已连接`, "good");
      render();
    });
    ws.addEventListener("message", (evt) => {
      if (net.ws !== ws) return;
      try {
        handleNetMessage(JSON.parse(evt.data));
      } catch (err) {
        console.warn("bad room message", err);
      }
    });
    ws.addEventListener("close", () => {
      if (net.ws !== ws) return;
      state.roomConnected = false;
      state.roomHost = false;
      if (net.manualClose) {
        updateRoomStatus("已断开房间", "warn");
        updateRoomPopulation([]);
      } else {
        scheduleRoomReconnect("房间连接短暂断开");
      }
      render();
    });
    ws.addEventListener("error", () => {
      if (net.ws !== ws) return;
      updateRoomStatus("联机连接失败：请确认 server.js 正在运行。", "warn");
    });
  } catch (err) {
    updateRoomStatus(`连接失败：${err.message}`, "warn");
  }
}

function sendNet(type, payload = {}) {
  if (!net.ws || net.ws.readyState !== WebSocket.OPEN) return false;
  net.ws.send(JSON.stringify({ type, clientId: state.clientId, roomCode: state.roomCode, ...payload }));
  return true;
}

function sendRoomFeature(action, payload = {}) {
  return sendNet("room_feature", {
    action,
    sourceId: state.clientId,
    sourceName: state.sect?.name || els.sectNameInput?.value?.trim() || "未立宗门",
    payload,
  });
}

function roomPlayers() {
  return [
    getPublicPlayerState(),
    ...(Array.isArray(state.remotePlayers) ? state.remotePlayers : []),
  ].filter((player) => player && player.id);
}

function eligibleRoomPlayers(players = roomPlayers()) {
  const online = (players || []).filter((player) => player && player.id && player.online !== false);
  const founded = online.filter((player) => player.founded);
  if (founded.length) return founded;
  return online;
}

function foundedRoomPlayers() {
  return eligibleRoomPlayers(roomPlayers());
}

function allianceKey(a, b) {
  return [a, b].sort().join("::");
}

function setRoomAlliance(a, b, value = true) {
  if (!a || !b || a === b) return;
  state.roomAlliances = state.roomAlliances || {};
  state.roomAlliances[allianceKey(a, b)] = Boolean(value);
  if (value) increaseRoomAllianceTrust(a, b, 12, false);
}

function arePlayersAllied(a, b) {
  return Boolean(state.roomAlliances?.[allianceKey(a, b)]);
}

function increaseRoomAllianceTrust(a, b, amount = 4, broadcast = true) {
  if (!a || !b || a === b) return 0;
  state.roomAllianceTrust = state.roomAllianceTrust || {};
  const key = allianceKey(a, b);
  state.roomAllianceTrust[key] = clamp(Number(state.roomAllianceTrust[key] || 0) + amount, 0, 100);
  if (broadcast && state.multiplayer && state.roomConnected && state.roomHost) syncSharedWorld();
  return state.roomAllianceTrust[key];
}

function roomAllianceLevel(a, b) {
  const trust = Number(state.roomAllianceTrust?.[allianceKey(a, b)] || 0);
  if (trust >= 75) return 3;
  if (trust >= 38) return 2;
  if (arePlayersAllied(a, b)) return 1;
  return 0;
}

function roomAllianceLabel(a, b) {
  const level = roomAllianceLevel(a, b);
  return level ? `盟友 Lv.${level}（信任 ${Math.round(state.roomAllianceTrust?.[allianceKey(a, b)] || 0)}）` : "未结盟";
}

function alliedRemotePlayers() {
  return (state.remotePlayers || []).filter((player) => arePlayersAllied(state.clientId, player.id));
}

function requestRemoteAlliance(target) {
  if (!target?.id || !state.roomConnected) return;
  if (arePlayersAllied(state.clientId, target.id)) {
    log(`${target.name}已经是玩家盟友。`, "good");
    return;
  }
  sendRoomFeature("alliance_request", { targetId: target.id });
  sendNet("player_event", { text: `${state.sect.name}向${target.name}发起玩家结盟请求。`, tone: "good" });
  log(`已向${target.name}发送玩家盟约邀请。`, "good");
  flashFeedback("盟约邀请已发送", "good");
}

function tradeEscape(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}

function tradeableCatalogIds() {
  const ids = [
    ...alchemyMaterialIds,
    ...forgingMaterialIds,
    ...Object.keys(ascensionMaterials || {}),
    "qiPill",
    "minorHealPill",
    "midHealPill",
    "highHealPill",
    "tribPill",
    "marrowPill",
    "heartLotus",
    "refineStone",
    "affixLock",
    ...methodItemIds,
    ...equipmentItemIds,
  ];
  return [...new Set(ids)].filter((id) => itemCatalog[id]);
}

function tradeItemLabel(entry) {
  if (!entry?.id) return "";
  const item = itemCatalog[entry.id];
  if (!item) return entry.id;
  if (item.material) return item.name;
  const affix = entry.affixes?.length ? `（${entry.affixes.map(affixLabel).join(" / ")}）` : "";
  return `${gearTierName(entry.quality || 0)}${item.name}${affix}`;
}

function tradePartsText(parts) {
  const lines = [];
  const stones = Math.max(0, Math.floor(Number(parts?.stones || 0)));
  if (stones) lines.push(`灵石 x${stones}`);
  for (const item of parts?.items || []) {
    if (!item?.id || !item.count) continue;
    lines.push(`${tradeItemLabel(item)} x${Math.max(1, Math.floor(Number(item.count || 1)))}`);
  }
  return lines.length ? lines.join("、") : "无";
}

function pendingTradeEscrowList() {
  return Object.entries(state.pendingTradeEscrows || {});
}

function escrowTradeParts(escrow) {
  return escrow?.parts || escrow || {};
}

function refundPendingTrades() {
  const pending = pendingTradeEscrowList();
  if (!pending.length) {
    flashFeedback("没有待取回的交易报价", "warn");
    return;
  }
  for (const [tradeId, escrow] of pending) {
    grantTradeParts(escrowTradeParts(escrow));
    if (escrow?.targetId) sendRoomFeature("trade_cancel", { tradeId, targetId: escrow.targetId });
    delete state.pendingTradeEscrows[tradeId];
  }
  log(`已取回 ${pending.length} 笔未完成交易的暂存报价。`, "good");
  closeModal();
  syncPublicState();
  render();
}

function hasTradeParts(parts) {
  if (!state.founded || !state.sect) return false;
  const stones = Math.max(0, Math.floor(Number(parts?.stones || 0)));
  if ((state.sect.stones || 0) < stones) return false;
  for (const item of parts?.items || []) {
    if (!item?.id || !item.count) continue;
    const quality = Math.max(0, Math.min(qualityNames.length - 1, Math.floor(Number(item.quality || 0))));
    const catalog = itemCatalog[item.id];
    if (catalog?.equipment && item.gearUid) {
      const slot = state.sect.inventory.find((owned) => owned.gearUid === item.gearUid && owned.id === item.id);
      if (!slot || slot.count < 1) return false;
      continue;
    }
    const total = state.sect.inventory
      .filter((owned) => owned.id === item.id && (owned.quality || 0) === quality)
      .reduce((sum, owned) => sum + Number(owned.count || 0), 0);
    if (total < item.count) return false;
  }
  return true;
}

function tradeSnapshotFromSlot(slot, count = 1) {
  const catalog = itemCatalog[slot?.id];
  if (!slot || !catalog) return null;
  const quality = catalog.material ? 0 : gearTier(slot.quality || 0);
  if (catalog.equipment) {
    const gear = ensureGearInstance({ ...slot, count: 1 });
    return {
      id: gear.id,
      quality: gear.quality || quality,
      count: 1,
      gearUid: gear.gearUid,
      affixes: (gear.affixes || []).map((affix) => ({ ...affix })),
      lockedAffixes: Array.isArray(gear.lockedAffixes) ? [...gear.lockedAffixes] : [],
    };
  }
  return { id: slot.id, quality, count: Math.max(1, Math.floor(Number(count || 1))) };
}

function materializeTradeParts(parts) {
  const result = { stones: Math.max(0, Math.floor(Number(parts?.stones || 0))), items: [] };
  const usedGear = new Set();
  for (const item of parts?.items || []) {
    if (!item?.id || !item.count || !itemCatalog[item.id]) continue;
    const catalog = itemCatalog[item.id];
    const quality = catalog.material ? 0 : gearTier(item.quality || 0);
    if (catalog.equipment) {
      if (item.gearUid) {
        result.items.push({
          id: item.id,
          quality,
          count: 1,
          gearUid: item.gearUid,
          affixes: (item.affixes || []).map((affix) => ({ ...affix })),
          lockedAffixes: Array.isArray(item.lockedAffixes) ? [...item.lockedAffixes] : [],
        });
        usedGear.add(item.gearUid);
        continue;
      }
      const need = Math.max(1, Math.floor(Number(item.count || 1)));
      const slots = state.sect.inventory.filter((owned) => owned.id === item.id && (owned.quality || 0) === quality && owned.gearUid && !usedGear.has(owned.gearUid));
      for (const slot of slots.slice(0, need)) {
        const snap = tradeSnapshotFromSlot(slot, 1);
        if (snap) {
          result.items.push(snap);
          usedGear.add(snap.gearUid);
        }
      }
      continue;
    }
    result.items.push({ id: item.id, quality, count: Math.max(1, Math.floor(Number(item.count || 1))) });
  }
  return result;
}

function deductTradeParts(parts) {
  if (!hasTradeParts(parts)) return false;
  const stones = Math.max(0, Math.floor(Number(parts?.stones || 0)));
  state.sect.stones -= stones;
  for (const item of parts?.items || []) {
    if (!item?.id || !item.count) continue;
    const quality = Math.max(0, Math.min(qualityNames.length - 1, Math.floor(Number(item.quality || 0))));
    const catalog = itemCatalog[item.id];
    if (catalog?.equipment && item.gearUid) {
      const slot = state.sect.inventory.find((owned) => owned.gearUid === item.gearUid && owned.id === item.id);
      if (slot) slot.count = 0;
      continue;
    }
    let left = Math.max(1, Math.floor(Number(item.count || 1)));
    for (const slot of state.sect.inventory.filter((owned) => owned.id === item.id && (owned.quality || 0) === quality)) {
      if (left <= 0) break;
      const taken = Math.min(left, Number(slot.count || 0));
      slot.count -= taken;
      left -= taken;
    }
  }
  state.sect.inventory = state.sect.inventory.filter((item) => item.count > 0);
  return true;
}

function grantTradeParts(parts) {
  const stones = Math.max(0, Math.floor(Number(parts?.stones || 0)));
  state.sect.stones += stones;
  for (const item of parts?.items || []) {
    if (!item?.id || !item.count || !itemCatalog[item.id]) continue;
    const catalog = itemCatalog[item.id];
    const quality = catalog.material ? 0 : Math.max(0, Math.min(qualityNames.length - 1, Math.floor(Number(item.quality || 0))));
    if (catalog.equipment) {
      state.sect.inventory.push(ensureGearInstance({
        id: item.id,
        count: 1,
        quality,
        gearUid: item.gearUid || uid(),
        affixes: Array.isArray(item.affixes) ? item.affixes.map((affix) => ({ ...affix })) : null,
        lockedAffixes: Array.isArray(item.lockedAffixes) ? [...item.lockedAffixes] : [],
      }));
    } else {
      addItem(item.id, Math.max(1, Math.floor(Number(item.count || 1))), quality);
    }
  }
}

function readTradeNumber(id, min = 0, max = 999999) {
  const value = Number(document.getElementById(id)?.value || 0);
  return Math.max(min, Math.min(max, Math.floor(Number.isFinite(value) ? value : 0)));
}

function requestRemoteTrade(target) {
  if (!target?.id || !state.roomConnected || !state.founded) return;
  const ownItems = (state.sect.inventory || []).filter((slot) => itemCatalog[slot.id] && slot.count > 0);
  const pending = pendingTradeEscrowList().length;
  const offerOptions = ownItems.map((slot, index) => `<option value="${index}">${tradeEscape(tradeItemLabel(slot))} x${slot.count}</option>`).join("");
  const askOptions = tradeableCatalogIds().map((id) => `<option value="${tradeEscape(id)}">${tradeEscape(itemCatalog[id].name)}（${tradeEscape(itemCatalog[id].kind || "物品")}）</option>`).join("");
  const qualityOptions = qualityNames.map((name, index) => `<option value="${index}">${tradeEscape(name)}</option>`).join("");
  showModal({
    kicker: "玩家交易",
    title: `与${tradeEscape(target.name || "联机宗门")}议价`,
    body: `
      <div class="stat-list">
        <span>对方灵石：${Math.round(target.stones || 0)}</span>
        <span>对方战力：${Math.round(target.power || 0)}</span>
      </div>
      <p>可以用灵石、材料、丹药或装备组合出价。你发出的物品会暂存，若对方拒绝会退回。</p>
      ${pending ? `<p>当前有 ${pending} 笔未完成报价，可先取回再重新议价。</p>` : ""}
      <div class="modal-grid">
        <label>我方灵石 <input id="tradeOfferStones" type="number" min="0" max="${Math.floor(state.sect.stones || 0)}" value="0"></label>
        <label>我方物品 <select id="tradeOfferItem"><option value="">不加入物品</option>${offerOptions}</select></label>
        <label>物品数量 <input id="tradeOfferQty" type="number" min="1" value="1"></label>
        <label>索取灵石 <input id="tradeAskStones" type="number" min="0" value="0"></label>
        <label>索取物品 <select id="tradeAskItem"><option value="">不索取物品</option>${askOptions}</select></label>
        <label>索取品质 <select id="tradeAskQuality">${qualityOptions}</select></label>
        <label>索取数量 <input id="tradeAskQty" type="number" min="1" value="1"></label>
      </div>
    `,
    actions: [
      { label: "发送交易", handler: () => sendTradeOffer(target, ownItems) },
      { label: "取回报价", handler: refundPendingTrades, disabled: !pending },
      { label: "取消", handler: closeModal },
    ],
  });
}

function sendTradeOffer(target, ownItems) {
  const offer = { stones: readTradeNumber("tradeOfferStones", 0, Math.floor(state.sect.stones || 0)), items: [] };
  const offerIndex = document.getElementById("tradeOfferItem")?.value;
  if (offerIndex !== "") {
    const slot = ownItems[Number(offerIndex)];
    const snap = tradeSnapshotFromSlot(slot, readTradeNumber("tradeOfferQty", 1, slot?.count || 1));
    if (snap) offer.items.push(snap);
  }
  const request = { stones: readTradeNumber("tradeAskStones", 0, 999999), items: [] };
  const askId = document.getElementById("tradeAskItem")?.value;
  if (askId && itemCatalog[askId]) {
    const item = itemCatalog[askId];
    request.items.push({ id: askId, quality: item.material ? 0 : readTradeNumber("tradeAskQuality", 0, qualityNames.length - 1), count: readTradeNumber("tradeAskQty", 1, 999) });
  }
  if (!offer.stones && !offer.items.length) {
    flashFeedback("交易至少要给出一项资源", "warn");
    return;
  }
  if (!request.stones && !request.items.length) {
    flashFeedback("交易至少要索取一项资源", "warn");
    return;
  }
  if (!deductTradeParts(offer)) {
    flashFeedback("出价资源不足", "warn");
    return;
  }
  state.pendingTradeEscrows = state.pendingTradeEscrows || {};
  const trade = { id: uid(), sourceId: state.clientId, sourceName: state.sect.name, targetId: target.id, targetName: target.name, offer, request, year: state.year };
  state.pendingTradeEscrows[trade.id] = { parts: offer, targetId: target.id, targetName: target.name };
  sendRoomFeature("trade_request", { trade });
  sendNet("player_event", { text: `${state.sect.name}向${target.name || "联机宗门"}发起交易。`, tone: "good" });
  log(`已向${target.name || "联机宗门"}发起交易：给出 ${tradePartsText(offer)}，索取 ${tradePartsText(request)}。`, "good");
  closeModal();
  syncPublicState();
  render();
}

function showTradeRequestModal(trade, sourceName) {
  if (!trade || trade.targetId !== state.clientId) return;
  const canAccept = hasTradeParts(trade.request);
  showModal({
    kicker: "玩家交易",
    title: `${tradeEscape(sourceName || trade.sourceName || "联机宗门")}发来交易`,
    body: `
      <p>对方给出：<strong>${tradeEscape(tradePartsText(trade.offer))}</strong></p>
      <p>对方索取：<strong>${tradeEscape(tradePartsText(trade.request))}</strong></p>
      ${canAccept ? "<p>同意后会立即结算双方资源。</p>" : "<p>你的资源不足，暂时无法接受这笔交易。</p>"}
    `,
    actions: [
      { label: "同意交易", handler: () => acceptRemoteTrade(trade), disabled: !canAccept },
      { label: "拒绝", handler: () => rejectRemoteTrade(trade) },
    ],
  });
}

function acceptRemoteTrade(trade) {
  if (state.cancelledIncomingTrades?.[trade.id]) {
    flashFeedback("这笔交易已被对方取消", "warn");
    return;
  }
  const actualRequest = materializeTradeParts(trade.request);
  if (!deductTradeParts(actualRequest)) {
    flashFeedback("资源不足，无法接受交易", "warn");
    return;
  }
  grantTradeParts(trade.offer);
  increaseRoomAllianceTrust(state.clientId, trade.sourceId, 6, false);
  sendRoomFeature("trade_accept", { trade: { ...trade, request: actualRequest } });
  log(`已接受${trade.sourceName || "联机宗门"}的交易，获得 ${tradePartsText(trade.offer)}。`, "good");
  closeModal();
  syncPublicState();
  render();
}

function rejectRemoteTrade(trade) {
  sendRoomFeature("trade_reject", { tradeId: trade.id, targetId: trade.sourceId });
  log(`已拒绝${trade.sourceName || "联机宗门"}的交易。`);
  closeModal();
}

function completeAcceptedTrade(trade) {
  state.pendingTradeEscrows = state.pendingTradeEscrows || {};
  if (state.pendingTradeEscrows[trade.id]) {
    delete state.pendingTradeEscrows[trade.id];
    grantTradeParts(trade.request);
    increaseRoomAllianceTrust(state.clientId, trade.targetId, 6, false);
    log(`${trade.targetName || "联机宗门"}接受了交易，获得 ${tradePartsText(trade.request)}。`, "good");
  } else if (hasTradeParts(trade.offer) && deductTradeParts(trade.offer)) {
    grantTradeParts(trade.request);
    increaseRoomAllianceTrust(state.clientId, trade.targetId, 6, false);
    log(`${trade.targetName || "联机宗门"}接受了交易，获得 ${tradePartsText(trade.request)}。`, "good");
  } else {
    log("交易已被接受，但本地暂存资源已失效，请重新发起交易。", "warn");
  }
  syncPublicState();
  render();
}

function handleRejectedTrade(payload, sourceName) {
  if (payload.targetId !== state.clientId) return;
  const escrow = state.pendingTradeEscrows?.[payload.tradeId];
  if (escrow) {
    grantTradeParts(escrowTradeParts(escrow));
    delete state.pendingTradeEscrows[payload.tradeId];
    log(`${sourceName || "联机宗门"}拒绝了交易，暂存资源已退回。`, "warn");
    syncPublicState();
    render();
  } else {
    log(`${sourceName || "联机宗门"}拒绝了交易。`, "warn");
  }
}

function handleCancelledTrade(payload, sourceName) {
  if (payload.targetId !== state.clientId) return;
  state.cancelledIncomingTrades = state.cancelledIncomingTrades || {};
  state.cancelledIncomingTrades[payload.tradeId] = true;
  log(`${sourceName || "联机宗门"}取消了一笔交易报价。`, "warn");
}

function getPublicPlayerState() {
  const sect = state.sect || {};
  return {
    id: state.clientId,
    name: sect.name || els.sectNameInput?.value?.trim() || "未立宗门",
    online: true,
    icon: sect.icon || state.selectedSectIcon || "宗",
    founded: Boolean(state.founded),
    x: Number(sect.x || 0),
    y: Number(sect.y || 0),
    year: state.year,
    power: state.founded ? sectPower() : 0,
    stones: Math.round(sect.stones || 0),
    grain: Math.round(sect.grain || 0),
    prestige: Math.round(sect.prestige || 0),
    alchemyMats: Math.round(sect.alchemyMats || 0),
    forgingMats: Math.round(sect.forgingMats || 0),
    arrayMats: Math.round(sect.arrayMats || 0),
    aura: Math.round(sect.aura || 0),
    risk: Math.round(sect.risk || 0),
    resource: Math.round(sect.resource || 0),
    barrier: Math.round(sect.barrier || 0),
    buildings: { ...(sect.buildings || {}) },
    actionPoints: state.actionPoints || 0,
    maxActionPoints: state.maxActionPoints || 0,
    disciples: sect.disciples?.length || 0,
    maxRealm: sect.disciples?.length ? Math.max(...sect.disciples.map((d) => d.realm)) : 0,
    topDisciple: sect.disciples?.length ? sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a))[0]?.name : "",
    lobbyReady: Boolean(state.roomLobbyReady),
    ready: Boolean(state.waitingForPlayers),
    readyYear: state.waitingForPlayers ? state.year : 0,
    activity: state.waitingForPlayers ? "等待全员进入下一年" : (state.currentAction || "操作中"),
    activityAt: state.currentActionAt || Date.now(),
    forbiddenFloor: state.forbiddenRun?.floor || 0,
    allies: Object.keys(state.roomAlliances || {}).filter((key) => key.includes(state.clientId)),
  };
}

function handleNetMessage(msg) {
  state.multiplayer = true;
  if (msg.type === "heartbeat") {
    sendNet("pong", { t: msg.t });
    return;
  }
  if (msg.type === "welcome") {
    state.roomHost = Boolean(msg.host);
    updateRoomStatus(`已进入房间 ${state.roomCode}${state.roomHost ? "（房主）" : ""}`, "online");
    net.lastPlayers = net.lastPlayers.length ? net.lastPlayers : [getPublicPlayerState()];
    updateRoomPopulation(net.lastPlayers);
    maybeOfferRoomSaveOnJoin();
  }
  if (msg.type === "room_state") {
    net.lastPlayers = msg.players || [];
    state.remotePlayers = (msg.players || []).filter((p) => p.id !== state.clientId).map((p) => ({ ...p, type: "remotePlayer" }));
    state.readyPlayers = (msg.players || []).filter((p) => isPlayerReadyForYear(p)).map((p) => p.id);
    refreshSelectedRemotePlayer();
    updateRoomPopulation(net.lastPlayers);
    updateForbiddenRoomBlock(msg.players || []);
    updateMultiplayerWaitingText(msg.players || []);
    if (state.waitingForPlayers && areRoomPlayersReadyForYear(msg.players || [], state.year)) onRoomAllReady({ ...msg, year: state.year });
    render();
  }
  if (msg.type === "player_event" && msg.text) {
    log(msg.text, msg.tone || "");
  }
  if (msg.type === "all_ready") {
    if (Array.isArray(msg.players)) net.lastPlayers = msg.players;
    onRoomAllReady(msg);
  }
  if (msg.type === "pvp_report") {
    handlePvpReport(msg.report);
  }
  if (msg.type === "world_snapshot" && msg.sourceId !== state.clientId) {
    applySharedWorldSnapshot(msg.snapshot);
  }
  if (msg.type === "room_feature" && msg.sourceId !== state.clientId) {
    handleRoomFeatureMessage(msg);
  }
}

function handleRoomFeatureMessage(msg) {
  const action = msg.action;
  const payload = msg.payload || {};
  if (action === "pvp_duel_request") {
    handleRoomPvpDuelRequest(payload.duel, msg.sourceName);
    return;
  }
  if (action === "pvp_duel_accept") {
    handleRoomPvpDuelAccept(payload.duel);
    return;
  }
  if (action === "pvp_duel_reject") {
    handleRoomPvpDuelReject(payload);
    return;
  }
  if (action === "pvp_duel_result") {
    applyRoomPvpDuelResult(payload.result);
    return;
  }
  if (action === "room_close_save") {
    handleRoomCloseSave(payload, msg.sourceName);
    return;
  }
  if (action === "room_save_available") {
    if (payload.snapshot && state.multiplayer) applySharedWorldSnapshot(payload.snapshot);
    maybeOfferRoomSaveOnJoin();
    return;
  }
  if (action === "lobby_start") {
    if (!state.founded) startMultiplayerGameFromLobby(true);
    return;
  }
  if (action === "trade_request" && payload.trade?.targetId === state.clientId) {
    showTradeRequestModal(payload.trade, msg.sourceName);
    return;
  }
  if (action === "trade_accept" && payload.trade?.sourceId === state.clientId) {
    completeAcceptedTrade(payload.trade);
    return;
  }
  if (action === "trade_reject") {
    handleRejectedTrade(payload, msg.sourceName);
    return;
  }
  if (action === "trade_cancel") {
    handleCancelledTrade(payload, msg.sourceName);
    return;
  }
  if (action === "world_adventure_open") {
    const setup = normalizeRoomWorldAdventureSetup(payload.adventure);
    if (!setup || !state.founded) return;
    if (Number(setup.year) > Number(state.year)) state.year = Number(setup.year);
    if (Number(setup.year) !== Number(state.year)) return;
    if (setup.id === state.roomWorldAdventureId && state.worldAdventure) return;
    state.roomWorldAdventureId = setup.id;
    state.nextWorldAdventureYear = setup.nextYear || state.nextWorldAdventureYear;
    markPlayerAction("响应世界奇遇", true);
    showWorldAdventurePicker(state.pendingAdventureAfterClose, setup);
    return;
  }
  if (action === "adventure_lobby_open") {
    const lobby = normalizeAdventureLobby(payload.lobby);
    if (!lobby || lobby.year !== state.year) return;
    state.roomAdventureLobby = lobby;
    if (lobby.hostId !== state.clientId) showAdventureLobbyInvite(lobby);
    else showAdventureLobbyModal(lobby, state.pendingAdventureAfterClose);
    return;
  }
  if (action === "adventure_lobby_ready") {
    if (!payload.participant) return;
    if (!state.roomAdventureLobby && payload.lobby) state.roomAdventureLobby = normalizeAdventureLobby(payload.lobby);
    state.roomAdventureLobby = mergeAdventureLobbyParticipant(state.roomAdventureLobby, payload.participant);
    if (state.roomAdventureLobby?.hostId === state.clientId) sendRoomFeature("adventure_lobby_open", { lobby: state.roomAdventureLobby });
    if (state.roomAdventureLobby?.hostId === state.clientId || state.roomAdventureLobby?.participants?.[state.clientId]) {
      showAdventureLobbyModal(state.roomAdventureLobby, state.pendingAdventureAfterClose);
    }
    return;
  }
  if (action === "adventure_lobby_decline") {
    if (!state.roomAdventureLobby && payload.lobby) state.roomAdventureLobby = normalizeAdventureLobby(payload.lobby);
    state.roomAdventureLobby = markAdventureLobbyDeclined(state.roomAdventureLobby, payload.playerId, payload.playerName || msg.sourceName);
    if (state.roomAdventureLobby?.hostId === state.clientId) {
      sendRoomFeature("adventure_lobby_open", { lobby: state.roomAdventureLobby });
      showAdventureLobbyModal(state.roomAdventureLobby, state.pendingAdventureAfterClose);
    }
    return;
  }
  if (action === "adventure_lobby_start") {
    beginAdventureFromLobby(payload.lobby, state.pendingAdventureAfterClose);
    return;
  }
  if (action === "adventure_lockstep_choice") {
    applyRoomAdventureLockstepChoice(payload, msg.sourceId);
    return;
  }
  if (action === "adventure_lobby_cancel") {
    if (state.roomAdventureLobby?.id === payload.lobbyId) {
      state.roomAdventureLobby = null;
      log("协作世界奇遇邀请已取消。", "warn");
      closeModal();
      render();
    }
    return;
  }
  if (action === "frontier_boss_spawn") {
    mergeFrontierBoss(payload.boss);
    log(`联机边境巨兽同步出现：${payload.boss?.name || "未知巨兽"}。`, "warn");
    render();
    return;
  }
  if (action === "frontier_boss_lobby_open") {
    handleRoomBossLobbyOpen(payload.lobby);
    return;
  }
  if (action === "frontier_boss_lobby_ready") {
    handleRoomBossLobbyReady(payload);
    return;
  }
  if (action === "frontier_boss_lobby_cancel") {
    if (state.roomBossLobby?.id === payload.lobbyId) {
      state.roomBossLobby = null;
      closeModal();
      log("巨兽协作房间已取消。", "warn");
      render();
    }
    return;
  }
  if (action === "frontier_boss_lobby_start") {
    applyRoomBossLobbyResult(payload.result);
    return;
  }
  if (action === "frontier_boss_damage") {
    applyRemoteBossDamage(payload);
    return;
  }
  if (action === "frontier_boss_defeated") {
    applyRemoteBossDamage({ ...payload, hp: 0, defeated: true });
    return;
  }
  if (action === "frontier_boss_expire") {
    if (state.frontier?.worldBoss?.id === payload.bossId) {
      state.frontier.worldBoss = null;
      log("联机边境巨兽已遁走。", "warn");
      render();
    }
    return;
  }
  if (action === "alliance_request" && payload.targetId === state.clientId) {
    showModal({
      kicker: "玩家盟约",
      title: `${msg.sourceName || "联机宗门"}请求结盟`,
      body: `<p>结盟后，双方可在世界奇遇中共同探索，并能互相降低危险值。盟友之间会禁用快捷掠夺与抢徒。</p>`,
      actions: [
        { label: "同意结盟", handler: () => {
          setRoomAlliance(state.clientId, msg.sourceId, true);
          sendRoomFeature("alliance_accept", { targetId: msg.sourceId });
          log(`已与${msg.sourceName || "联机宗门"}缔结玩家盟约。`, "good");
          closeModal();
          syncSharedWorld();
          syncPublicState();
          render();
        } },
        { label: "暂不结盟", handler: closeModal },
      ],
    });
    return;
  }
  if (action === "alliance_accept" && payload.targetId === state.clientId) {
    setRoomAlliance(state.clientId, msg.sourceId, true);
    log(`${msg.sourceName || "联机宗门"}同意了玩家盟约。`, "good");
    syncSharedWorld();
    syncPublicState();
    render();
    return;
  }
  if (action === "auction_open") {
    state.roomAuction = payload.auction;
    if (state.roomAuction) {
      if (Number(state.roomAuction.year) > Number(state.year)) state.year = Number(state.roomAuction.year);
      state.lastAuctionYear = state.roomAuction.year || state.year;
      state.roomAuction.afterClose = state.pendingAuctionAfterClose;
      showInteractiveAuctionRound();
    }
    return;
  }
  if (action === "auction_bid" && state.roomAuction) {
    const bid = payload.bid || {};
    state.roomAuction.currentPrice = Number(bid.price || state.roomAuction.currentPrice);
    state.roomAuction.leaderName = bid.leaderName || msg.sourceName || state.roomAuction.leaderName;
    state.roomAuction.leaderId = msg.sourceId;
    state.roomAuction.round = Number(bid.round || state.roomAuction.round || 1);
    state.roomAuction.history = state.roomAuction.history || [];
    state.roomAuction.history.push({ id: msg.sourceId, name: state.roomAuction.leaderName, price: state.roomAuction.currentPrice });
    showInteractiveAuctionRound();
    return;
  }
  if (action === "auction_pass" && state.roomAuction) {
    state.roomAuction.passed = state.roomAuction.passed || {};
    state.roomAuction.passed[msg.sourceId] = true;
    showInteractiveAuctionRound();
    return;
  }
  if (action === "auction_result") {
    const result = payload.result;
    const afterClose = state.pendingAuctionAfterClose;
    state.roomAuction = null;
    state.pendingAuctionAfterClose = null;
    if (result?.winnerId === state.clientId) {
      finalizeAuctionLot(result.lot, { name: state.sect.name, player: true }, afterClose);
      return;
    }
    if (result?.winnerName) {
      log(`联机拍卖落槌：${result.winnerName}取得${result.lot?.name || "拍品"}。`, "warn");
      showModal({
        kicker: "联机拍卖",
        title: "拍卖落槌",
        body: `<p>${tradeEscape(result.winnerName)} 以 ${Math.round(result.lot?.finalPrice || result.lot?.price || 0)} 灵石取得 ${tradeEscape(result.lot?.name || "拍品")}。</p>`,
        actions: [{ label: "继续", handler: () => { closeModal(); afterClose?.(); render(); } }],
      });
      els.modalCloseBtn.onclick = () => { closeModal(); afterClose?.(); render(); };
      render();
      return;
    }
    if (result?.winnerName) log(`联机拍卖落槌：${result.winnerName}取得${result.lot?.name || "拍品"}。`, result.winnerId === state.clientId ? "good" : "warn");
    state.roomAuction = null;
    closeModal();
    render();
    return;
  }
  if (action === "council_open") {
    state.roomCouncil = payload.council;
    if (state.roomCouncil) {
      if (Number(state.roomCouncil.year) > Number(state.year)) state.year = Number(state.roomCouncil.year);
      state.lastCouncilYear = state.roomCouncil.year || state.year;
      openCouncilMeeting(state.pendingCouncilAfterClose);
    }
    return;
  }
  if (action === "council_vote") {
    if (!state.roomCouncil) return;
    state.roomCouncil.votes = state.roomCouncil.votes || {};
    state.roomCouncil.votes[msg.sourceId] = payload.vote;
    maybeFinalizeRoomCouncil();
    return;
  }
  if (action === "council_result") {
    const result = payload.result;
    if (result?.edict) {
      const afterClose = state.pendingCouncilAfterClose;
      state.pendingCouncilAfterClose = null;
      state.councilEdict = result.edict;
      state.lastCouncilYear = result.year || state.year;
      state.roomCouncil = null;
      log(`联机仙盟会议通过《${result.edict.name}》：${result.edict.text}`, "good");
      showModal({
        kicker: "仙盟会议",
        title: `通过：${tradeEscape(result.edict.name)}`,
        body: `<p>${tradeEscape(result.edict.text)}</p><p>本结果已同步到房间内所有玩家。</p>`,
        actions: [{ label: "继续", handler: () => { closeModal(); afterClose?.(); render(); } }],
      });
      els.modalCloseBtn.onclick = () => { closeModal(); afterClose?.(); render(); };
      render();
      return;
      state.councilEdict = result.edict;
      state.lastCouncilYear = result.year || state.year;
      log(`联机仙盟会议统一通过《${result.edict.name}》：${result.edict.text}`, "good");
      state.roomCouncil = null;
      closeModal();
      render();
    }
    return;
  }
  if (action === "tournament_open") {
    state.roomTournament = payload.tournament || { year: state.year, ready: {}, resolved: false };
    if (Number(state.roomTournament.year) > Number(state.year)) state.year = Number(state.roomTournament.year);
    state.lastTournamentYear = state.roomTournament.year || state.year;
    openTournamentPicker(true, state.pendingTournamentAfterClose);
    return;
  }
  if (action === "tournament_ready") {
    state.roomTournament = state.roomTournament || { year: state.year, ready: {}, resolved: false };
    state.roomTournament.ready = state.roomTournament.ready || {};
    if (payload.team?.id) state.roomTournament.ready[payload.team.id] = payload.team;
    if (state.roomHost) maybeFinalizeRoomTournament();
    else showTournamentWaitingRoom();
    return;
  }
  if (action === "tournament_result") {
    applyRoomTournamentResult(payload.result || {});
    return;
  }
  if (action === "tournament_result_legacy") {
    const result = payload.result || {};
    log(`联机宗门大比战报：冠军 ${result.champion || "未知"}。${result.text || ""}`, "good");
    render();
    return;
  }
  if (action === "adventure_help" && state.worldAdventure) {
    const helperId = payload.helperId || msg.sourceId;
    state.worldAdventure.remoteHelpUsed = state.worldAdventure.remoteHelpUsed || {};
    if (helperId && state.worldAdventure.remoteHelpUsed[helperId]) return;
    if (helperId) state.worldAdventure.remoteHelpUsed[helperId] = true;
    const reduce = Number(payload.reduce || 4);
    state.worldAdventure.danger = Math.max(0, state.worldAdventure.danger - reduce);
    state.worldAdventure.history.push({ tone: "good", text: `${msg.sourceName || "盟友宗门"}护持队伍，危险值 -${reduce}。` });
    renderWorldAdventureStep();
    render();
    return;
  }
  if (action === "adventure_progress") {
    updateRoomAdventureParticipant(msg.sourceId, msg.sourceName, payload.status);
  }
}

function updateRoomAdventureParticipant(playerId, playerName, status = {}) {
  if (!state.worldAdventure || !playerId) return;
  const list = state.worldAdventure.participants || [];
  const existing = list.find((p) => p.id === playerId);
  const next = {
    id: playerId,
    name: playerName || existing?.name || "盟友宗门",
    disciple: status.disciple || existing?.disciple || "参战弟子",
    danger: Number(status.danger || 0),
    hp: Number(status.hp || 0),
  };
  if (existing) Object.assign(existing, next);
  else list.push(next);
  state.worldAdventure.participants = list;
  render();
}

function updateMultiplayerWaitingText(players = []) {
  if (!state.waitingForPlayers || !els.waitingText) return;
  const eligible = eligibleRoomPlayers(players);
  const ready = eligible.filter((p) => isPlayerReadyForYear(p)).length;
  const total = Math.max(1, eligible.length);
  const forbidden = eligible.filter((p) => p.id !== state.clientId && p.forbiddenFloor).map((p) => `${p.name || "其他玩家"} ${p.forbiddenFloor}/20`).join("、");
  els.waitingText.textContent = forbidden
    ? `等待其他玩家：${ready}/${total} 已完成。禁地探索不再锁住房间：${forbidden}。`
    : `等待其他玩家：${ready}/${total} 已完成。`;
}

function updateForbiddenRoomBlock(players = []) {
  const active = (players || []).find((p) => p.id !== state.clientId && Number(p.forbiddenFloor || 0) > 0);
  state.roomBlockedByForbidden = null;
  if (active && !state.waitingForPlayers) {
    updateRoomStatus(`${active.name || "其他玩家"}正在禁地第 ${active.forbiddenFloor}/20 层，房间年进度不再被禁地阻塞。`, "online");
    els.waitingOverlay.hidden = true;
  } else if (!state.waitingForPlayers) {
    els.waitingOverlay.hidden = true;
  }
}

function onRoomAllReady(msg) {
  if (!state.multiplayer) return;
  const players = Array.isArray(msg?.players) && msg.players.length ? msg.players : (net.lastPlayers.length ? net.lastPlayers : roomPopulationSnapshot());
  const readyYear = Number(msg?.year || 0);
  if (readyYear && readyYear !== Number(state.year)) {
    syncPublicState();
    return;
  }
  if (!state.waitingForPlayers) {
    syncPublicState();
    updateRoomPopulation(players.length ? players : roomPopulationSnapshot());
    return;
  }
  if (!areRoomPlayersReadyForYear(players, state.year)) {
    updateMultiplayerWaitingText(players);
    syncPublicState();
    return;
  }
  els.otherReadyDot.classList.add("ready");
  els.waitingText.textContent = `房间 ${state.roomCode} 全员完成，正在同步进入下一年。`;
  state.waitingForPlayers = false;
  els.waitingOverlay.hidden = true;
  resolveYearAdvance();
  syncSharedWorld();
  sendNet("public_state", { player: getPublicPlayerState() });
}

function createSharedWorldSnapshot() {
  return {
    year: state.year,
    resources: state.resources,
    rivals: state.rivals,
    events: state.events,
    market: state.market,
    frontier: state.frontier,
    worldCrisis: state.worldCrisis,
    councilEdict: state.councilEdict,
    lastAuctionYear: state.lastAuctionYear,
    lastCouncilYear: state.lastCouncilYear,
    lastTournamentYear: state.lastTournamentYear,
    nextWorldAdventureYear: state.nextWorldAdventureYear,
    roomAlliances: state.roomAlliances || {},
    roomAllianceTrust: state.roomAllianceTrust || {},
    worldChain: state.worldChain || null,
    roomAuction: state.roomAuction ? { ...state.roomAuction, afterClose: null } : null,
    roomCouncil: state.roomCouncil || null,
    roomTournament: state.roomTournament || null,
    roomWorldAdventureId: state.roomWorldAdventureId || "",
  };
}

function applySharedWorldSnapshot(snapshot) {
  if (!snapshot || !state.multiplayer) return;
  if (Array.isArray(snapshot.resources)) state.resources = snapshot.resources;
  if (Array.isArray(snapshot.rivals)) state.rivals = snapshot.rivals;
  if (Array.isArray(snapshot.events)) state.events = snapshot.events;
  if (snapshot.market) state.market = snapshot.market;
  if (snapshot.frontier) state.frontier = snapshot.frontier;
  if (Number(snapshot.year) > state.year) state.year = Number(snapshot.year);
  state.worldCrisis = snapshot.worldCrisis || state.worldCrisis;
  state.councilEdict = snapshot.councilEdict || state.councilEdict;
  state.lastAuctionYear = Number(snapshot.lastAuctionYear || state.lastAuctionYear || 0);
  state.lastCouncilYear = Number(snapshot.lastCouncilYear || state.lastCouncilYear || 0);
  state.lastTournamentYear = Number(snapshot.lastTournamentYear || state.lastTournamentYear || 0);
  state.nextWorldAdventureYear = Number(snapshot.nextWorldAdventureYear || state.nextWorldAdventureYear || 0);
  state.roomAlliances = snapshot.roomAlliances || state.roomAlliances || {};
  state.roomAllianceTrust = snapshot.roomAllianceTrust || state.roomAllianceTrust || {};
  state.worldChain = snapshot.worldChain || state.worldChain || null;
  state.roomAuction = snapshot.roomAuction || state.roomAuction || null;
  state.roomCouncil = snapshot.roomCouncil || state.roomCouncil || null;
  state.roomTournament = snapshot.roomTournament || state.roomTournament || null;
  state.roomWorldAdventureId = snapshot.roomWorldAdventureId || state.roomWorldAdventureId || "";
  log("已同步联机房间的大世界状态。", "good");
  render();
}

function syncSharedWorld(force = false) {
  if (state.multiplayer && state.roomConnected && (force || state.roomHost)) {
    sendNet("world_snapshot", { snapshot: createSharedWorldSnapshot() });
  }
}

function syncPublicState() {
  if (state.multiplayer && state.roomConnected) sendNet("public_state", { player: getPublicPlayerState() });
}

function combatDiscipleSnapshot(d) {
  if (!d) return null;
  normalizeDiscipleProgression(d);
  const copyMethods = Array.isArray(d.methods) ? d.methods.map((method) => ({ ...method })) : [];
  return {
    id: d.id,
    name: d.name,
    realm: Number(d.realm || 0),
    hp: Number(d.hp || 1),
    atk: Number(d.atk || 1),
    def: Number(d.def || 0),
    speed: Number(d.speed || 1),
    temper: Number(d.temper || 0),
    aptitude: Number(d.aptitude || 0),
    luck: Number(d.luck || 0),
    charm: Number(d.charm || 0),
    arrayLevel: Number(d.arrayLevel || 0),
    mind: Number(d.mind || 0),
    core: Boolean(d.core),
    damagePct: Number(d.damagePct || 0),
    reducePct: Number(d.reducePct || 0),
    critPct: Number(d.critPct || 0),
    critDamage: Number(d.critDamage || 0),
    lifeSteal: Number(d.lifeSteal || 0),
    pierce: Number(d.pierce || 0),
    shieldPower: Number(d.shieldPower || 0),
    elementDamage: { ...(d.elementDamage || {}) },
    methods: copyMethods,
    activeMethods: Array.isArray(d.activeMethods) ? [...d.activeMethods] : copyMethods.slice(0, 5).map((method) => method.id),
  };
}

function roomPlayerById(id) {
  return roomPlayers().find((player) => player.id === id) || null;
}

function roomPvpModeName(mode) {
  if (mode === "spar") return "弟子切磋";
  return mode === "steal" ? "抢徒切磋" : "宗门劫掠";
}

function pvpDuelRosterOptions(name = "room-pvp-disciple") {
  const roster = (state.sect?.disciples || []).slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a));
  return roster.map((d, index) => `<label class="adventure-candidate ${d.core ? "is-core" : ""}">
    <input type="radio" name="${name}" value="${tradeEscape(d.id)}" ${index === 0 ? "checked" : ""}>
    <div><strong>${d.core ? "核心·" : ""}${tradeEscape(d.name)}</strong><span>${tradeEscape(realms[d.realm] || "")} · 战力 ${Math.round(discipleBattleScore(d))} · 功法 ${(d.activeMethods || []).length || 0}/5</span></div>
  </label>`).join("");
}

function openRoomPvpDuelRequest(target, mode = "raid") {
  if (!state.founded || !target?.id || !state.roomConnected) return;
  if (mode !== "spar" && arePlayersAllied(state.clientId, target.id)) {
    log("玩家盟友之间不能通过快捷按钮互相掠夺或抢徒。", "warn");
    render();
    return;
  }
  const roster = pvpDuelRosterOptions("room-pvp-attacker");
  if (!roster) {
    log("没有可出战弟子。", "warn");
    return;
  }
  showModal({
    kicker: "联机斗法房间",
    title: `${roomPvpModeName(mode)}：挑战 ${tradeEscape(target.name || "联机宗门")}`,
    body: `
      <p>这次不再挑战公共投影。你先派出一名弟子发起挑战，对方收到请求后选择守擂弟子并确认，随后双方播放同一份实时战斗结算。</p>
      ${mode === "spar" ? "<p>弟子切磋只结算修行与声望，不抢夺灵石，也不会增加恶名。</p>" : ""}
      <div class="stat-list">
        <span>对方战力 ${Math.round(target.power || 0)}</span>
        <span>对方灵石 ${Math.round(target.stones || 0)}</span>
      </div>
      <div class="adventure-roster">${roster}</div>
    `,
    actions: [
      { label: "发起挑战", handler: () => {
        const discipleId = els.modalBody.querySelector("input[name='room-pvp-attacker']:checked")?.value;
        const disciple = state.sect.disciples.find((d) => d.id === discipleId);
        if (!disciple) return;
        if (!spendAction(1, mode === "spar" ? "联机切磋" : mode === "steal" ? "联机抢徒" : "联机劫掠")) return;
        const duel = {
          id: `pvp-${state.clientId}-${target.id}-${Date.now()}`,
          year: state.year,
          mode,
          attackerId: state.clientId,
          attackerName: state.sect.name,
          targetId: target.id,
          targetName: target.name || "联机宗门",
          targetStones: Math.round(target.stones || 0),
          attackerDisciple: combatDiscipleSnapshot(disciple),
          status: "request",
        };
        state.roomPvpDuel = duel;
        sendRoomFeature("pvp_duel_request", { duel });
        log(`已向${duel.targetName}发起${roomPvpModeName(mode)}，等待对方选择守擂弟子。`, "good");
        closeModal();
        showModal({
          kicker: "联机斗法房间",
          title: "等待对方确认",
          body: `<p>${tradeEscape(duel.targetName)}正在选择守擂弟子。若对方拒绝或离线，本次行动点会返还。</p>`,
          actions: [{ label: "先关闭", handler: closeModal }],
        });
        syncPublicState();
        render();
      } },
      { label: "暂不挑战", handler: closeModal },
    ],
  });
}

function remoteBattle(target, mode = "raid") {
  if (!state.founded || !target) return;
  if (state.multiplayer && state.roomConnected) {
    openRoomPvpDuelRequest(target, mode);
    return;
  }
  if (mode !== "spar" && arePlayersAllied(state.clientId, target.id)) {
    log("玩家盟友之间不能通过快捷按钮互相掠夺或抢徒。", "warn");
    render();
    return;
  }
  const d = state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a))[0];
  if (!d) {
    log("没有可出战弟子。", "warn");
    render();
    return;
  }
  if (!spendAction(1, mode === "steal" ? "联机抢徒" : "联机掠夺")) return;
  const enemy = (target.power || 0) * (mode === "steal" ? 0.96 : 1.06) + rand(120, 460);
  const guardian = syntheticGuardian(`${(target.name || "联机").slice(0, 2)}守`, enemy, `${target.id}:${mode}:${state.year}:remote`);
  const duel = simulateOneVsOneBattle(d, guardian, { mode });
  const our = discipleBattleScore(d);
  showRealtimeDuelModal({
    kicker: mode === "steal" ? "联机抢徒" : "联机掠夺",
    title: `${d.name} 挑战 ${target.name}`,
    duel,
    leftLabel: state.sect.name,
    rightLabel: target.name,
    scores: { our, enemy },
    onComplete: () => applyRemoteBattleOutcome(target, mode, d, duel, our, enemy),
  });
}

function handleRoomPvpDuelRequest(duel, sourceName = "") {
  if (!duel || duel.targetId !== state.clientId || !state.founded || duel.year !== state.year) return;
  if (duel.mode !== "spar" && arePlayersAllied(state.clientId, duel.attackerId)) {
    sendRoomFeature("pvp_duel_reject", { duelId: duel.id, attackerId: duel.attackerId, targetId: state.clientId, reason: "allied" });
    return;
  }
  const roster = pvpDuelRosterOptions("room-pvp-defender");
  showModal({
    kicker: "联机斗法挑战",
    title: `${tradeEscape(sourceName || duel.attackerName || "联机宗门")}发起${roomPvpModeName(duel.mode)}`,
    body: `
      <p>对方已派出 <strong>${tradeEscape(duel.attackerDisciple?.name || "挑战弟子")}</strong>。请选择一名守擂弟子确认开战；确认后双方会播放同一场实时斗法。</p>
      <div class="adventure-roster">${roster || "<p>暂无可出战弟子。</p>"}</div>
    `,
    actions: [
      { label: "确认迎战", disabled: !roster, handler: () => {
        const discipleId = els.modalBody.querySelector("input[name='room-pvp-defender']:checked")?.value;
        const disciple = state.sect.disciples.find((d) => d.id === discipleId);
        if (!disciple) return;
        const accepted = {
          ...duel,
          defenderId: state.clientId,
          defenderName: state.sect.name,
          defenderDisciple: combatDiscipleSnapshot(disciple),
          status: "accepted",
        };
        state.roomPvpDuel = accepted;
        sendRoomFeature("pvp_duel_accept", { duel: accepted });
        log(`已接受${accepted.attackerName}的${roomPvpModeName(accepted.mode)}挑战。`, "good");
        closeModal();
        showModal({
          kicker: "联机斗法房间",
          title: "等待战斗结算",
          body: `<p>发起方正在统一生成战斗回放。稍后双方会进入同一场实时斗法。</p>`,
          actions: [{ label: "先关闭", handler: closeModal }],
        });
        syncPublicState();
      } },
      { label: "拒绝挑战", handler: () => {
        sendRoomFeature("pvp_duel_reject", { duelId: duel.id, attackerId: duel.attackerId, targetId: state.clientId, reason: "reject" });
        log(`已拒绝${duel.attackerName || "联机宗门"}的挑战。`, "warn");
        closeModal();
      } },
    ],
  });
  els.modalCloseBtn.onclick = () => {
    sendRoomFeature("pvp_duel_reject", { duelId: duel.id, attackerId: duel.attackerId, targetId: state.clientId, reason: "reject" });
    log(`已拒绝${duel.attackerName || "联机宗门"}的挑战。`, "warn");
    closeModal();
  };
}

function handleRoomPvpDuelAccept(duel) {
  if (!duel || duel.attackerId !== state.clientId || !state.founded) return;
  if (!state.roomPvpDuel || state.roomPvpDuel.id !== duel.id) state.roomPvpDuel = duel;
  const battle = simulateOneVsOneBattle(duel.attackerDisciple, duel.defenderDisciple, { mode: duel.mode });
  const our = discipleBattleScore(duel.attackerDisciple);
  const enemy = discipleBattleScore(duel.defenderDisciple);
  const result = {
    id: duel.id,
    year: state.year,
    duel,
    battle,
    attackerWon: Boolean(battle.won),
    winnerId: battle.won ? duel.attackerId : duel.targetId,
    gain: duel.mode === "spar" ? 0 : battle.won ? Math.min(Math.max(120, Number(duel.targetStones || 240)), rand(90, duel.mode === "steal" ? 230 : 190)) : 0,
    scores: { our: Math.round(our), enemy: Math.round(enemy) },
  };
  sendRoomFeature("pvp_duel_result", { result });
  applyRoomPvpDuelResult(result);
}

function handleRoomPvpDuelReject(payload = {}) {
  if (payload.attackerId !== state.clientId) return;
  state.actionPoints = Math.min(state.maxActionPoints || 10, Number(state.actionPoints || 0) + 1);
  state.roomPvpDuel = null;
  closeModal();
  log(payload.reason === "allied" ? "对方已是盟友，挑战取消并返还行动点。" : "对方拒绝挑战，已返还 1 点行动点。", "warn");
  render();
}

function applyRoomPvpDuelResult(result) {
  if (!result?.id || !result.duel || !result.battle) return;
  const duel = result.duel;
  const involved = duel.attackerId === state.clientId || duel.targetId === state.clientId;
  if (!involved) {
    log(`联机斗法：${duel.attackerName} ${result.attackerWon ? "击败" : "败给"} ${duel.targetName}。`, result.attackerWon ? "warn" : "good");
    render();
    return;
  }
  const isAttacker = duel.attackerId === state.clientId;
  const battle = result.battle;
  showRealtimeDuelModal({
    kicker: roomPvpModeName(duel.mode),
    title: `${duel.attackerName} 对阵 ${duel.targetName}`,
    duel: battle,
    leftLabel: duel.attackerName,
    rightLabel: duel.targetName,
    scores: result.scores || null,
    onComplete: () => finalizeRoomPvpDuelResult(result, isAttacker),
  });
}

function finalizeRoomPvpDuelResult(result, isAttacker) {
  if (!result?.id || state.appliedRoomPvpResults?.[result.id]) {
    render();
    return;
  }
  ensureSectDefaults();
  state.appliedRoomPvpResults[result.id] = true;
  const duel = result.duel;
  const spar = duel.mode === "spar";
  const won = isAttacker ? result.attackerWon : !result.attackerWon;
  const localDiscipleId = isAttacker ? duel.attackerDisciple?.id : duel.defenderDisciple?.id;
  const localDisciple = state.sect.disciples.find((d) => d.id === localDiscipleId);
  if (spar) {
    const expGain = won ? 18 : 10;
    const prestigeGain = won ? 18 : 6;
    state.sect.prestige += prestigeGain;
    if (localDisciple) {
      localDisciple.exp += expGain;
      localDisciple.status = won ? "切磋胜" : "切磋悟败";
      localDisciple.hp = Math.max(24, localDisciple.hp - (won ? 1 : 3));
    }
    log(`联机弟子切磋${won ? "取胜" : "落败"}，${localDisciple?.name || "参战弟子"}修为 +${expGain}，声望 +${prestigeGain}。`, won ? "good" : "warn");
    state.roomPvpDuel = null;
    syncPublicState();
    render();
    return;
  }
  if (isAttacker) {
    if (result.attackerWon) {
      state.sect.stones += result.gain || 0;
      state.sect.diplomacy.infamy += duel.mode === "steal" ? 5 : 4;
      if (localDisciple) {
        localDisciple.exp += 14;
        localDisciple.status = "联机斗法胜";
      }
      log(`联机斗法取胜，获得 ${result.gain || 0} 灵石。`, "good");
    } else {
      const lost = Math.min(state.sect.stones, rand(40, 110));
      state.sect.stones -= lost;
      if (localDisciple) {
        adjustMind(localDisciple, 5, "联机斗法失利");
        localDisciple.hp = Math.max(18, localDisciple.hp - rand(3, 9));
      }
      log(`联机斗法失利，整备损耗 ${lost} 灵石。`, "warn");
    }
  } else {
    if (result.attackerWon) {
      const loss = Math.min(state.sect.stones, result.gain || 0);
      state.sect.stones -= loss;
      if (localDisciple) localDisciple.hp = Math.max(20, localDisciple.hp - rand(2, 8));
      log(`${duel.attackerName}挑战成功，本宗灵石 -${loss}。`, "warn");
    } else {
      state.sect.prestige += 26;
      if (localDisciple) {
        localDisciple.exp += 16;
        localDisciple.status = "守擂得胜";
      }
      log(`守住${duel.attackerName}的挑战，声望 +26。`, "good");
    }
  }
  state.roomPvpDuel = null;
  syncPublicState();
  render();
}

function applyRemoteBattleOutcome(target, mode, d, duel, our, enemy) {
  const won = duel.won;
  const gain = won ? Math.min(target.stones || 240, rand(80, 180)) : 0;
  if (won) {
    state.sect.stones += gain;
    state.sect.diplomacy.infamy += mode === "steal" ? 6 : 4;
  } else {
    const lost = Math.min(state.sect.stones, rand(50, 130));
    state.sect.stones -= lost;
    adjustMind(d, 6, "联机斗法失利");
    d.hp = Math.max(18, d.hp - rand(3, 10));
  }
  const report = {
    attackerId: state.clientId,
    targetId: target.id,
    attackerName: state.sect.name,
    targetName: target.name,
    mode,
    won,
    gain,
    our: Math.round(our),
    enemy: Math.round(enemy),
  };
  sendNet("pvp_report", { report });
  showBattleModal({ name: target.name, grudges: 0 }, won, won ? `${d.name}击破对方驻守投影，联机掠夺成功，获得 ${gain} 灵石。` : `${d.name}未能攻破对方守势，联机远征失利。`, { our, enemy });
  log(`${won ? "击败" : "败给"}联机宗门${target.name}，战报已发送房间。`, won ? "good" : "warn");
  syncPublicState();
  render();
}

function handlePvpReport(report) {
  if (!report || report.attackerId === state.clientId) return;
  if (report.targetId === state.clientId && state.sect) {
    if (report.won) {
      const loss = Math.min(state.sect.stones, report.gain || 0);
      state.sect.stones -= loss;
      state.sect.diplomacy.infamy = Math.max(0, (state.sect.diplomacy.infamy || 0) - 1);
      log(`${report.attackerName}联机掠夺本宗成功，本宗灵石 -${loss}。`, "warn");
    } else {
      state.sect.prestige += 18;
      log(`${report.attackerName}试图掠夺本宗，被护山弟子击退。声望 +18。`, "good");
    }
    showModal({
      kicker: "联机战报",
      title: `${report.attackerName} 对 ${state.sect.name}`,
      body: `<div class="battle-stage"><div class="fighter left">${report.attackerName.slice(0, 2)}</div><div class="slash"></div><div class="fighter right">${state.sect.name.slice(0, 2)}</div></div><p>${report.won ? `对方获胜，本宗损失 ${report.gain} 灵石。` : "本宗守住山门，对方远征失败。"}</p>`,
    });
    syncPublicState();
    render();
  } else {
    log(`联机战报：${report.attackerName}${report.won ? "击败" : "未能击败"}${report.targetName}。`, report.won ? "warn" : "");
  }
}

function showModal({ kicker = "事件", title = "山门传讯", body = "", actions = [{ label: "知道了", handler: closeModal }] }) {
  clearTutorialHighlight();
  els.modalCloseBtn.onclick = null;
  els.modalProgress.hidden = true;
  els.modalKicker.textContent = kicker;
  els.modalTitle.textContent = title;
  els.modalBody.innerHTML = body;
  els.modalActions.innerHTML = "";
  for (const action of actions) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = action.label;
    btn.disabled = Boolean(action.disabled);
    btn.addEventListener("click", () => runActionWithFeedback(action.label, action.handler));
    els.modalActions.appendChild(btn);
  }
  els.eventModal.hidden = false;
}

function closeModal() {
  els.modalCloseBtn.onclick = null;
  els.modalProgress.hidden = true;
  els.eventModal.hidden = true;
  els.modalBody.innerHTML = "";
  els.modalActions.innerHTML = "";
  setTimeout(maybeShowTutorialStep, 0);
}

function showBattleModal(target, won, detail, scores = null) {
  showModal({
    kicker: "宗门斗法",
    title: `${state.sect.name} 对阵 ${target.name}`,
    body: `
      <div class="battle-stage">
        <div class="fighter left">本宗</div>
        <div class="slash"></div>
        <div class="fighter right">${target.name.slice(0, 2)}</div>
      </div>
      ${scores ? `<div class="battle-breakdown">
        <div><span>本宗出征</span><strong>${Math.round(scores.our)}</strong></div>
        <div><span>敌宗守备</span><strong>${Math.round(scores.enemy)}</strong></div>
        <div><span>敌宗戒备</span><strong>${target.grudges || 0}</strong></div>
      </div>` : ""}
      ${scores?.duel?.html || ""}
      <p><strong>${won ? "胜" : "败"}</strong>：${detail}</p>
    `,
  });
}

function showResourceBattleModal(resource, holder, won, detail, scores) {
  const enemyName = holder ? holder.name.replace("遗址·", "") : "灵脉守势";
  const resourceLabel = resource.kind === "mine" ? "矿脉" : resource.kind === "herb" ? "药谷" : "灵泉";
  showModal({
    kicker: `${resourceLabel}争夺`,
    title: `${state.sect.name} 争夺 ${resource.name}`,
    body: `
      <div class="battle-stage resource-battle">
        <div class="fighter left">本宗</div>
        <div class="resource-node">${resourceLabel}</div>
        <div class="slash"></div>
        <div class="fighter right">${enemyName.slice(0, 2)}</div>
      </div>
      <div class="battle-breakdown">
        <div><span>本宗综合实力</span><strong>${Math.round(scores.our)}</strong></div>
        <div><span>${holder ? "守方宗门实力" : "野外守势"}</span><strong>${Math.round(scores.enemy)}</strong></div>
        <div><span>资源价值</span><strong>${resource.value}</strong></div>
      </div>
      ${scores?.duel?.html || ""}
      <p><strong>${won ? "夺点成功" : "争夺失利"}</strong>：${detail}</p>
    `,
  });
}

function showCraftModal(d, item, quality, kind, leaped) {
  showModal({
    kicker: kind === "alchemy" ? "丹炉开火" : "器炉开火",
    title: `${d.name}炼成${qualityNames[quality]}${item.name}`,
    body: `<p>${kind === "alchemy" ? "炉中丹香成云" : "锻台火纹如潮"}，${d.name}凭修为、资质与词条把控火候。${leaped ? "灵机一闪，产物越阶提升。" : "成品稳定入库。"}</p><p>已存入宗门仓库，可统一分配给弟子使用。</p>`,
  });
}

function requiredAscensionMaterial(nextRealm) {
  return ascensionMaterials[nextRealm] || null;
}

function tribulationFailRate(d, options = {}) {
  const baseFail = 20 + d.realm * 13 + Math.max(0, d.realm - 2) * 9;
  const fatigue = Math.min(22, (d.pillFatigue || 0) * 2.4);
  const relic = d.equipment?.relic?.id === "coldMoonBell" || d.equipment?.relic?.id === "riverMirror" ? 5 : 0;
  const material = options.material ? 4 : 0;
  const pillBoost = Number(options.pillBoost || 0);
  const attrBonus = Math.floor(d.temper / 18) + Math.floor(d.aptitude / 30) + Math.floor(d.luck / 18) + Math.floor(bondPowerBonus(d) / 18) + (state.yearlyBoon?.key === "mindCalm" ? 7 : 0) + (d.tribBoost || 0) + pillBoost + relic + material;
  return clamp(baseFail + fatigue - attrBonus, 18, 92);
}

function maybeAutoTribulation(d) {
  const nextRealm = d.realm + 1;
  const materialId = requiredAscensionMaterial(nextRealm);
  if (materialId) {
    d.exp = 100;
    d.status = `等待${itemCatalog[materialId].name}`;
    log(`${d.name}已触及${realms[nextRealm]}瓶颈，但元婴及以上晋升需要${itemCatalog[materialId].name}。请在弟子详情的“境界晋升”中处理。`, "warn");
    return;
  }
  attemptTribulation(d);
}

function openAdvancementPanel(d) {
  if (!d) return;
  const nextRealm = Math.min(d.realm + 1, realms.length - 1);
  const materialId = requiredAscensionMaterial(nextRealm);
  const materialCount = materialId ? itemCount(materialId) : 0;
  const pills = state.sect.inventory.filter((slot) => slot.id === "tribPill" && slot.count > 0);
  const ready = d.exp >= 100 && d.realm < realms.length - 1 && (!materialId || materialCount > 0);
  const baseRate = 100 - tribulationFailRate(d, { material: Boolean(materialId) });
  showModal({
    kicker: "境界晋升",
    title: `${d.name} 冲击 ${realms[nextRealm]}`,
    body: `
      <div class="detail-grid">
        <span>当前境界<strong>${realms[d.realm]}</strong></span>
        <span>修为进度<strong>${d.exp}/100</strong></span>
        <span>基础成功率<strong>${baseRate}%</strong></span>
        <span>丹毒<strong>${d.pillFatigue || 0}</strong></span>
      </div>
      <p>境界越高渡劫越危险。元婴及以上必须消耗边境讨伐材料，否则无法晋升。</p>
      <div class="advancement-slots">
        <div><span>晋升材料</span><strong>${materialId ? `${itemCatalog[materialId].name} x${materialCount}` : "不需要"}</strong></div>
        <div><span>辅助丹药</span><strong>${pills.length ? pills.map((p) => `${qualityNames[p.quality || 0]}渡厄丹 x${p.count}`).join("、") : "未放入"}</strong></div>
      </div>
    `,
    actions: [
      { label: pills.length ? `服用${qualityNames[pills[0]?.quality || 0]}渡厄丹后渡劫` : "无渡厄丹渡劫", disabled: !ready, handler: () => attemptTribulation(d, { materialId, pillSlot: pills[0] || null }) },
      { label: "直接渡劫", disabled: !ready, handler: () => attemptTribulation(d, { materialId }) },
      { label: "暂缓", handler: closeModal },
    ],
  });
}

function consumeAscensionInputs(options = {}) {
  if (options.materialId) consumeItemCount(options.materialId, 1);
  let pillBoost = 0;
  if (options.pillSlot) {
    const slot = state.sect.inventory.find((item) => item.id === "tribPill" && (item.quality || 0) === (options.pillSlot.quality || 0));
    if (slot && slot.count > 0) {
      pillBoost = 10 + (slot.quality || 0) * 5;
      slot.count -= 1;
      state.sect.inventory = state.sect.inventory.filter((item) => item.count > 0);
    }
  }
  return pillBoost;
}

function attemptTribulation(d, options = {}) {
  d.exp = 100;
  const nextRealm = d.realm + 1;
  const materialId = requiredAscensionMaterial(nextRealm);
  if (materialId && itemCount(materialId) < 1 && !options.materialId) {
    d.status = `等待${itemCatalog[materialId].name}`;
    log(`${d.name}晋升${realms[nextRealm]}需要${itemCatalog[materialId].name}，可在边境讨伐副本概率获得。`, "warn");
    render();
    return;
  }
  const pillBoost = consumeAscensionInputs(options.materialId ? options : { ...options, materialId });
  const failRate = tribulationFailRate(d, { material: Boolean(materialId), pillBoost });
  const success = rand(1, 100) > failRate;
  d.tribBoost = 0;
  if (success) {
    d.exp = 0;
    d.realm += 1;
    d.hp += rand(6, 13) + Math.floor(d.aptitude / 24);
    d.atk += rand(3, 7) + Math.floor(d.grow / 12);
    d.def += rand(3, 7) + Math.floor(d.temper / 24);
    d.speed += rand(1, 4);
    d.pillFatigue = Math.max(0, (d.pillFatigue || 0) - 2);
    d.status = "渡劫成功";
    state.sect.prestige += 20 + d.realm * 8;
    log(`${d.name}渡劫成功，晋升${realms[d.realm]}。`, "good");
  } else {
    d.exp = rand(18, 48);
    d.hp = Math.max(24, d.hp - rand(16, 36));
    d.temper = Math.max(1, d.temper - rand(5, 12));
    d.pillFatigue = (d.pillFatigue || 0) + 2;
    d.status = "劫伤";
    adjustMind(d, 14 + d.realm * 2, "渡劫失败");
    log(`${d.name}渡劫失败，遭受劫伤，修为跌回 ${d.exp}/100。`, "warn");
  }
  showTribulationModal(d, success, failRate);
}

function showTribulationModal(d, success, failRate) {
  showModal({
    kicker: "天劫降临",
    title: `${d.name}冲击${realms[Math.min(d.realm + (success ? 0 : 1), realms.length - 1)]}`,
    body: `
      <div class="trib-stage">
        <div class="cloud"></div>
        <div class="bolt"></div>
        <div class="trib-disciple">${d.name.slice(0, 1)}</div>
      </div>
      <p>${success ? "雷云散去，金光落入丹田，境界稳固。" : "雷火反噬，经脉受损，需调养后再试。"}本次失败率约 ${failRate}% 。</p>
    `,
  });
}

function openBuildMenu() {
  if (!state.founded) return;
  const buildings = [
    { key: "commandHall", name: "议事殿", text: "每级增加年度行动点上限。", cost: 520 },
    { key: "trainingHall", name: "演武场", text: "每年弟子额外获得修为，战斗略强。", cost: 430 },
    { key: "market", name: "山门市集", text: "解锁市集投机，略增年度灵石收入并降低炼制压力。", cost: 420 },
    { key: "scoutTower", name: "观星楼", text: "探索收益提升，并降低被偷袭概率。", cost: 420 },
    { key: "insightRoom", name: "参悟室", text: "可安排弟子专心参悟，提高携带功法熟练度。", cost: 520 },
    { key: "spiritArray", name: "灵气阵", text: "提高弟子年度修行和参悟室收益，受选址灵气影响。", cost: 620 },
  ];
  showModal({
    kicker: "宗门建设",
    title: "规划山门",
    body: `<p>每次建设消耗 1 点行动。建筑最多 3 级，会改变宗门长期路线。</p>`,
    actions: buildings.map((b) => ({
      label: `${b.name} Lv.${state.sect.buildings[b.key]} ${b.cost}灵石`,
      handler: () => buildStructure(b),
    })).concat([
      { label: "演武集训", handler: trainingDrill },
      { label: "观星侦察", handler: scoutForEvent },
      { label: "市集换材", handler: marketTrade },
      { label: "仙盟榜单", handler: openLeagueRankingBoard },
      { label: "弟子委派", handler: openDelegationPanel },
      { label: "宗门危机", handler: openCrisisPanel },
      { label: "宗门史册", handler: openSectChronicle },
      { label: "参悟室修行", handler: openInsightRoom, disabled: state.sect.buildings.insightRoom < 1 || state.actionPoints < 1 },
      { label: "暂不建设", handler: closeModal },
    ]),
  });
}

function openResearchMenu() {
  if (!state.founded) return;
  const total = totalDaoLevel();
  showModal({
    kicker: "参悟功法",
    title: "宗门功法书",
    body: `
      <p>功法书为全宗通用加点，是中后期与其他宗门拉开战力差距的核心系统。当前参悟 ${state.sect.insight}，功法总等级 ${total}。</p>
      <div class="tech-book">
        ${Object.entries(daoPaths).map(([key, path]) => {
          const level = daoLevelFor(key);
          const cost = researchCost(key);
          return `<article class="tech-node">
            <strong>${path.name} Lv.${level}</strong>
            <span>${path.text}</span>
            <em>下级消耗 ${cost} 参悟</em>
          </article>`;
        }).join("")}
      </div>
    `,
    actions: Object.entries(daoPaths).map(([key, path]) => ({
      label: `参悟${path.name} Lv.${daoLevelFor(key) + 1}`,
      handler: () => researchDao(key),
    })).concat([{ label: "暂不参悟", handler: closeModal }]),
  });
}

function researchCost(key) {
  return 80 + totalDaoLevel() * 35 + daoLevelFor(key) * 55;
}

function researchDao(key) {
  const cost = researchCost(key);
  if (state.sect.insight < cost) {
    log(`参悟不足，需要 ${cost}。`, "warn");
    return;
  }
  state.sect.insight -= cost;
  state.sect.tech[key] = daoLevelFor(key) + 1;
  state.sect.daoPath = Object.entries(state.sect.tech).sort((a, b) => b[1] - a[1])[0][0];
  state.sect.daoLevel = totalDaoLevel();
  applyDaoLevel(key);
  log(`全宗功法「${daoPaths[key].name}」升至 Lv.${daoLevelFor(key)}：${daoPaths[key].text}`, "good");
  closeModal();
  render();
}

function applyDaoLevel(key) {
  if (key === "sword") state.sect.disciples.forEach((d) => { d.atk += 4; d.speed += 2; });
  if (key === "alchemy") { state.sect.alchemyMats += 2; state.sect.disciples.forEach((d) => { d.aptitude += 1; }); }
  if (key === "forging") { state.sect.forgingMats += 2; state.sect.disciples.forEach((d) => { d.def += 2; }); }
  if (key === "array") state.sect.barrier = clamp(state.sect.barrier + 12, 0, 100);
  if (key === "wander") { state.sect.prestige += 20; state.sect.disciples.forEach((d) => { d.luck += 1; }); }
}

function arrayTrainCost(d) {
  return 60 + (d.arrayLevel || 0) * 45;
}

function trainArrayDisciple(d) {
  if (!d) return;
  const cost = arrayTrainCost(d);
  if (!spendAction(1, "阵道授课")) return;
  if (state.sect.insight < cost) {
    state.actionPoints += 1;
    log(`阵道授课需要 ${cost} 参悟。`, "warn");
    render();
    return;
  }
  state.sect.insight -= cost;
  d.arrayLevel = (d.arrayLevel || 0) + 1;
  d.def += 3;
  d.temper += 2;
  d.status = "研习阵道";
  log(`${d.name}完成阵道授课，阵道 Lv.${d.arrayLevel}。有阵道等级的弟子才可推演阵法或坐镇护山大阵。`, "good");
  render();
}

function arrayCraftScore(d) {
  return (d.arrayLevel || 0) * 110 + d.def * 1.6 + d.temper * 1.2 + d.aptitude * 0.65 + traitBonusOnDisciple(d, "barrier") * 3 + daoLevelFor("array") * 75 + elderBonus("array") * 0.25;
}

function traitBonusOnDisciple(d, key) {
  return d.traits.reduce((sum, t) => sum + (t[key] || 0), 0);
}

function discipleBonds(d) {
  if (!state.sect?.bonds) return [];
  return state.sect.bonds.filter((bond) => bond.a === d.id || bond.b === d.id);
}

function bondLabel(bond) {
  const a = state.sect.disciples.find((d) => d.id === bond.a)?.name || "旧人";
  const b = state.sect.disciples.find((d) => d.id === bond.b)?.name || "旧人";
  return `${bond.type}：${a} / ${b} Lv.${bond.level}`;
}

function bondPowerBonus(d) {
  return discipleBonds(d).reduce((sum, bond) => sum + bond.level * (bond.type === "竞争" ? 5 : 8), 0);
}

function mentorOf(d) {
  return state.sect?.disciples.find((item) => item.id === d?.mentorId) || null;
}

function discipleCultivationGrowth(d) {
  const heart = daoHeartOf(d);
  const spec = specializationOf(d);
  const mentor = mentorOf(d);
  const con = constitutionOf(d);
  const seclusion = d.seclusion ? 0.22 : 0;
  const mentorBoost = mentor ? 0.06 + Math.max(0, mentor.realm - d.realm) * 0.035 : 0;
  const specBoost = (d.specializationLevel || 0) * 0.012;
  const conBoost = con?.id === "mortalFate" ? 0.08 + d.realm * 0.02 : con ? 0.04 : 0;
  const heartBoost = Number(heart?.growth || 0);
  const roomBoost = (state.sect?.buildings?.spiritArray || 0) * 0.035 + (state.sect?.buildings?.insightRoom || 0) * 0.02;
  return 1 + heartBoost + mentorBoost + specBoost + conBoost + seclusion + roomBoost + (spec?.id === "alchemy" && heart?.id === "alchemy" ? 0.03 : 0);
}

function gainSpecializationExp(d, amount, reason = "修行") {
  if (!d || amount <= 0) return;
  const before = Number(d.specializationLevel || 0);
  d.specializationExp = Number(d.specializationExp || 0) + Math.round(amount);
  while (d.specializationLevel < 20 && d.specializationExp >= (d.specializationLevel + 1) * 100) {
    d.specializationLevel += 1;
    applyDiscipleTemplateStats(d, specializationOf(d), 1);
  }
  if (d.specializationLevel > before) {
    log(`${d.name}的${specializationOf(d)?.name || "专精"}提升至 Lv.${d.specializationLevel}，来源：${reason}。`, "good");
  }
}

function processDiscipleSeclusionYear(d) {
  if (!d?.seclusion) return 0;
  const focus = d.seclusion.focus || "exp";
  const aura = state.sect?.site?.aura || 40;
  const gain = 9 + Math.floor(aura / 18) + (state.sect?.buildings?.insightRoom || 0) * 4 + (state.sect?.buildings?.spiritArray || 0) * 3;
  if (focus === "method") {
    for (const id of d.activeMethods || []) {
      const method = d.methods.find((item) => item.id === id);
      if (method) method.proficiency = clamp((method.proficiency || 0) + 5 + Math.floor(aura / 28), 0, 100);
    }
    gainSpecializationExp(d, 10, "闭关参悟");
  } else if (focus === "mind") {
    d.mind = Math.max(0, (d.mind || 0) - 8 - Math.floor(aura / 25));
    d.temper += 1;
    gainSpecializationExp(d, 7, "闭关问心");
  } else {
    d.exp += gain;
    gainSpecializationExp(d, 8, "闭关修行");
  }
  d.seclusion.yearsLeft -= 1;
  d.status = `闭关${d.seclusion.focusName || "修行"} ${Math.max(0, d.seclusion.yearsLeft)}年`;
  if (d.seclusion.yearsLeft <= 0) {
    d.status = "闭关出关";
    d.personalFame = Number(d.personalFame || 0) + 4;
    log(`${d.name}闭关圆满出关，修为、专精或心境有所提升。`, "good");
    d.seclusion = null;
  }
  return gain;
}

function cultivationSummaryHtml(d) {
  const heart = daoHeartOf(d);
  const con = constitutionOf(d);
  const spec = specializationOf(d);
  const mentor = mentorOf(d);
  const titles = discipleTitleNames(d);
  const artifact = d.bondedArtifact;
  return `
    <div class="cultivation-summary">
      <article><span>道心</span><strong>${heart?.name || "未定"}</strong><em>${heart?.text || ""}</em></article>
      <article><span>体质</span><strong>${con ? con.name : "凡骨未显"}</strong><em>${con ? con.text : "特殊体质刷新率很低，可用洗髓探体尝试觉醒。"}</em></article>
      <article><span>专精</span><strong>${spec?.name || "未定"} Lv.${d.specializationLevel || 0}</strong><em>熟练 ${d.specializationExp || 0}/${Math.min(20, (d.specializationLevel || 0) + 1) * 100}</em></article>
      <article><span>师承</span><strong>${mentor ? mentor.name : "未拜师"}</strong><em>${mentor ? `${realms[mentor.realm]}，每年提供修行与专精经验` : "高境界弟子可作为师父传承经验"}</em></article>
      <article><span>本命法宝</span><strong>${artifact ? `${artifact.name} Lv.${artifact.level}` : "未炼成本命法宝"}</strong><em>${artifact ? `战力 +${Math.round((artifact.power || 0) + artifact.level * 38)}` : "消耗器材和洗练材料打造，可长期升级"}</em></article>
      <article><span>称号</span><strong>${titles.length ? titles.join("、") : "暂无称号"}</strong><em>达成条件后自动获得，提供永久属性</em></article>
    </div>
  `;
}

function openDiscipleCultivationPanel(d) {
  if (!d) return;
  normalizeDiscipleProgression(d);
  refreshDiscipleTitles(d);
  const heart = daoHeartOf(d);
  const con = constitutionOf(d);
  const spec = specializationOf(d);
  showModal({
    kicker: "弟子养成",
    title: `${d.name}的修行路线`,
    body: `
      ${cultivationSummaryHtml(d)}
      <div class="cultivation-grid">
        <article class="cultivation-card"><strong>路线成长</strong><span>${heart?.name}提供 ${(Number(heart?.growth || 0) * 100).toFixed(0)}% 年度修行加成；当前综合养成战力 +${Math.round(cultivationPowerBonus(d))}。</span></article>
        <article class="cultivation-card"><strong>体质规则</strong><span>新弟子约 5.5% 概率天生特殊体质。未显体质可消耗行动和材料洗髓探体，但成功率依旧较低。</span></article>
        <article class="cultivation-card"><strong>专精定位</strong><span>${spec?.text || "专精会影响战力、炼制、阵法和属性伤害。"} 专精参与战斗、闭关、试炼都会成长。</span></article>
        <article class="cultivation-card"><strong>闭关状态</strong><span>${d.seclusion ? `正在闭关：${d.seclusion.focusName}，剩余 ${d.seclusion.yearsLeft} 年。` : "可安排短期闭关，提高修为、功法熟练度或降低心魔。"}</span></article>
      </div>
    `,
    actions: [
      { label: "选择专精", handler: () => openSpecializationPanel(d), disabled: state.actionPoints < 1 },
      { label: "师徒传承", handler: () => openMentorPanel(d), disabled: state.sect.disciples.length < 2 },
      { label: d.seclusion ? "闭关中" : "安排闭关", handler: () => openSeclusionPanel(d), disabled: Boolean(d.seclusion) || Boolean(d.travel) || state.actionPoints < 1 },
      { label: d.travel ? "游历中" : "外出游历", handler: () => openDiscipleTravelPanel(d), disabled: Boolean(d.travel) || Boolean(d.seclusion) || state.actionPoints < 1 },
      { label: d.sectPosition ? "调整职位" : "宗门职位", handler: () => openSectPositionPanel(d) },
      { label: d.legacyGiven ? "已传承" : "代际传承", handler: () => openLegacyInheritancePanel(d), disabled: d.legacyGiven || state.sect.disciples.length < 2 || state.actionPoints < 1 },
      { label: "本命法宝", handler: () => openNatalArtifactPanel(d), disabled: state.actionPoints < 1 },
      { label: "突破试炼", handler: () => openBreakthroughTrialPanel(d), disabled: state.actionPoints < 1 },
      { label: con ? "体质已显" : "洗髓探体", handler: () => attemptConstitutionAwakening(d), disabled: Boolean(con) || state.actionPoints < 1 },
      { label: "个人事件", handler: () => openDisciplePersonalEvent(d, true), disabled: state.actionPoints < 1 || d.lastPersonalEventYear === state.year },
      { label: "关闭", handler: closeModal },
    ],
  });
}

function openSpecializationPanel(d) {
  showModal({
    kicker: "弟子专精",
    title: `${d.name}选择修行定位`,
    body: `
      <p>改修专精会消耗 1 行动点和少量参悟，保留既有专精等级，但后续成长改走新路线。</p>
      <div class="method-list">
        ${specializationCatalog.map((spec) => `<label class="method-card ${d.specialization === spec.id ? "is-active" : ""}">
          <strong>${spec.name}</strong>
          <span>${spec.text}</span>
          <em>每级战力 +${spec.battlePerLevel || 10}${spec.craft ? "，并强化对应炼制/阵法" : ""}</em>
          <input type="radio" name="spec-pick" value="${spec.id}" ${d.specialization === spec.id ? "checked" : ""}>
        </label>`).join("")}
      </div>
    `,
    actions: [
      { label: "确认改修", handler: () => chooseSpecialization(d) },
      { label: "返回", handler: () => openDiscipleCultivationPanel(d) },
    ],
  });
}

function chooseSpecialization(d) {
  const picked = els.modalBody.querySelector('input[name="spec-pick"]:checked')?.value;
  const spec = catalogById(specializationCatalog, picked);
  if (!spec) return;
  if (!spendAction(1, "改修专精")) return;
  const cost = 45 + (d.specializationLevel || 0) * 12;
  if (state.sect.insight < cost) {
    state.actionPoints += 1;
    log(`改修专精需要 ${cost} 参悟。`, "warn");
    render();
    return;
  }
  state.sect.insight -= cost;
  d.specialization = spec.id;
  d.status = `改修${spec.name}`;
  gainSpecializationExp(d, 35, "改修定路");
  log(`${d.name}改修${spec.name}，后续成长会偏向该定位。`, "good");
  closeModal();
  render();
}

function openMentorPanel(d) {
  const candidates = state.sect.disciples.filter((item) => item.id !== d.id && item.realm >= d.realm);
  showModal({
    kicker: "师徒传承",
    title: `${d.name}选择师承`,
    body: `
      <p>师父境界越高，徒弟每年获得的修行和专精经验越多。师徒只是传承系统，不开启羁绊组合。</p>
      <div class="adventure-roster">
        ${candidates.length ? candidates.map((m) => `<article class="adventure-candidate">
          <div><strong>${m.name}</strong><span>${realms[m.realm]} / 战力 ${Math.round(discipleBattleScore(m))} / ${specializationOf(m)?.name || "未定"}</span></div>
          <button class="mentor-pick" data-id="${m.id}">${d.mentorId === m.id ? "当前师父" : "拜师"}</button>
        </article>`).join("") : `<p>暂无境界不低于 ${d.name} 的可拜师弟子。</p>`}
      </div>
    `,
    actions: [
      { label: "解除师承", handler: () => { d.mentorId = ""; log(`${d.name}暂时不再跟随师承修行。`); closeModal(); render(); }, disabled: !d.mentorId },
      { label: "返回", handler: () => openDiscipleCultivationPanel(d) },
    ],
  });
  for (const btn of els.modalBody.querySelectorAll(".mentor-pick")) {
    btn.addEventListener("click", () => {
      d.mentorId = btn.dataset.id;
      const mentor = mentorOf(d);
      d.status = `拜师${mentor?.name || ""}`;
      log(`${d.name}拜入${mentor?.name || "同门"}门下，开始接受传承。`, "good");
      closeModal();
      render();
    });
  }
}

function openSeclusionPanel(d) {
  const options = [
    { years: 1, focus: "exp", focusName: "修为", cost: 40, text: "提高修为，适合临近突破。" },
    { years: 3, focus: "method", focusName: "功法", cost: 95, text: "提高携带功法熟练度和专精经验。" },
    { years: 5, focus: "mind", focusName: "问心", cost: 150, text: "降低心魔，提升心性，适合高境界弟子。" },
  ];
  showModal({
    kicker: "闭关修行",
    title: `${d.name}闭关安排`,
    body: `
      <p>闭关消耗 1 行动点。闭关期间每年自动结算收益，时间越长收益越稳，但该弟子不适合频繁外派。</p>
      <div class="system-grid">
        ${options.map((item) => `<article class="system-card">
          <strong>${item.years}年闭关：${item.focusName}</strong>
          <span>${item.text}</span>
          <em>消耗参悟 ${item.cost}</em>
          <button class="seclusion-pick" data-focus="${item.focus}" data-years="${item.years}" data-cost="${item.cost}" data-name="${item.focusName}">开始</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "返回", handler: () => openDiscipleCultivationPanel(d) }],
  });
  for (const btn of els.modalBody.querySelectorAll(".seclusion-pick")) {
    btn.addEventListener("click", () => startSeclusion(d, btn.dataset));
  }
}

function startSeclusion(d, data) {
  if (!spendAction(1, "安排闭关")) return;
  const cost = Number(data.cost || 0);
  if (state.sect.insight < cost) {
    state.actionPoints += 1;
    log(`闭关需要 ${cost} 参悟。`, "warn");
    render();
    return;
  }
  state.sect.insight -= cost;
  d.seclusion = { yearsLeft: Number(data.years || 1), total: Number(data.years || 1), focus: data.focus || "exp", focusName: data.name || "修行" };
  d.status = `闭关${d.seclusion.focusName}`;
  log(`${d.name}开始${d.seclusion.yearsLeft}年闭关，方向：${d.seclusion.focusName}。`, "good");
  closeModal();
  render();
}

function openNatalArtifactPanel(d) {
  const artifact = d.bondedArtifact;
  const baseCost = artifact ? 2 + artifact.level : 3;
  const stoneCost = artifact ? 160 + artifact.level * 110 : 260;
  showModal({
    kicker: "本命法宝",
    title: `${d.name}${artifact ? `的${artifact.name}` : "炼制本命法宝"}`,
    body: `
      <div class="cultivation-grid">
        <article class="cultivation-card"><strong>当前法宝</strong><span>${artifact ? `${artifact.name} Lv.${artifact.level}，战力 +${Math.round((artifact.power || 0) + artifact.level * 38)}` : "尚未拥有本命法宝。"}</span></article>
        <article class="cultivation-card"><strong>本次消耗</strong><span>灵石 ${stoneCost}，器材 ${baseCost}，洗练灵砂 ${artifact ? 1 : 2}。</span></article>
      </div>
      <p>本命法宝不占装备栏，绑定弟子后长期成长。器修和高品质装备会略微提高法宝初始威能。</p>
    `,
    actions: [
      { label: artifact ? "升级法宝" : "炼成本命法宝", handler: () => refineNatalArtifact(d, { baseCost, stoneCost }) },
      { label: "返回", handler: () => openDiscipleCultivationPanel(d) },
    ],
  });
}

function refineNatalArtifact(d, costs) {
  if (!spendAction(1, "炼制本命法宝")) return;
  const refineCost = d.bondedArtifact ? 1 : 2;
  if (state.sect.stones < costs.stoneCost || state.sect.forgingMats < costs.baseCost || itemCount("refineStone") < refineCost) {
    state.actionPoints += 1;
    log(`本命法宝材料不足：需要灵石 ${costs.stoneCost}、器材 ${costs.baseCost}、洗练灵砂 ${refineCost}。`, "warn");
    render();
    return;
  }
  state.sect.stones -= costs.stoneCost;
  state.sect.forgingMats -= costs.baseCost;
  consumeItemCount("refineStone", refineCost);
  const spec = specializationOf(d);
  if (!d.bondedArtifact) {
    d.bondedArtifact = {
      id: uid(),
      name: `${d.name.slice(0, 1)}氏${spec?.name || "灵"}宝`,
      level: 1,
      type: spec?.id || "sword",
      power: 90 + (d.realm || 0) * 28 + (d.specializationLevel || 0) * 8 + traitCraftBonus(d, "forging") * 0.4,
    };
    d.status = "本命法宝初成";
    log(`${d.name}炼成本命法宝${d.bondedArtifact.name}。`, "good");
  } else {
    d.bondedArtifact.level += 1;
    d.bondedArtifact.power += 38 + (d.specializationLevel || 0) * 4;
    d.status = "温养本命法宝";
    log(`${d.name}温养本命法宝至 Lv.${d.bondedArtifact.level}。`, "good");
  }
  gainSpecializationExp(d, 18, "本命法宝");
  closeModal();
  render();
}

function openBreakthroughTrialPanel(d) {
  const trials = [
    { id: "heart", name: "问心试炼", text: "降低下一次渡劫风险，失败会增加心魔。", stat: "temper", boost: 9 },
    { id: "thunder", name: "引雷淬体", text: "提升体魄和雷抗，失败会受伤。", stat: "hp", boost: 8 },
    { id: "blade", name: "杀伐试剑", text: "提升攻击和专精经验，失败会损失修为。", stat: "atk", boost: 8 },
    { id: "wander", name: "红尘问道", text: "提升气运和身法，失败会耗费灵石。", stat: "luck", boost: 7 },
  ];
  showModal({
    kicker: "突破试炼",
    title: `${d.name}冲关前准备`,
    body: `
      <p>突破试炼消耗 1 行动点，可在正式渡劫前积累渡劫加成。试炼不直接升境界，但能明显提高下一次成功率。</p>
      <div class="system-grid">
        ${trials.map((trial) => `<article class="system-card">
          <strong>${trial.name}</strong>
          <span>${trial.text}</span>
          <em>当前成功参考：${clamp(Math.round(44 + d.realm * 3 + d.temper * 0.25 + d.luck * 0.2 + (d.specializationLevel || 0) * 1.4), 28, 88)}%</em>
          <button class="trial-pick" data-id="${trial.id}">开始</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "返回", handler: () => openDiscipleCultivationPanel(d) }],
  });
  for (const btn of els.modalBody.querySelectorAll(".trial-pick")) {
    btn.addEventListener("click", () => runBreakthroughTrial(d, trials.find((item) => item.id === btn.dataset.id)));
  }
}

function runBreakthroughTrial(d, trial) {
  if (!trial || !spendAction(1, "突破试炼")) return;
  const cost = 60 + d.realm * 28;
  if (state.sect.insight < cost) {
    state.actionPoints += 1;
    log(`突破试炼需要 ${cost} 参悟。`, "warn");
    render();
    return;
  }
  state.sect.insight -= cost;
  const chance = clamp(44 + d.realm * 3 + d.temper * 0.25 + d.luck * 0.2 + (d.specializationLevel || 0) * 1.4 + cultivationPowerBonus(d) / 180, 28, 88);
  const success = rand(1, 100) <= chance;
  if (success) {
    d.tribBoost = Number(d.tribBoost || 0) + trial.boost;
    mutateDiscipleStat(d, trial.stat, 3 + d.realm);
    gainSpecializationExp(d, 22, trial.name);
    d.status = `${trial.name}成功`;
    log(`${d.name}完成${trial.name}，下一次渡劫加成 +${trial.boost}。`, "good");
  } else {
    d.tribBoost = Math.max(0, Number(d.tribBoost || 0) + Math.floor(trial.boost / 3));
    d.exp = Math.max(0, d.exp - rand(4, 14));
    adjustMind(d, 6 + d.realm, `${trial.name}失败`);
    d.status = `${trial.name}受挫`;
    log(`${d.name}${trial.name}受挫，但仍积累少量渡劫经验。`, "warn");
  }
  closeModal();
  render();
}

function attemptConstitutionAwakening(d) {
  if (!d || d.constitution) return;
  if (!spendAction(1, "洗髓探体")) return;
  const stoneCost = 180 + d.realm * 80;
  const matCost = 2 + Math.floor(d.realm / 2);
  if (state.sect.stones < stoneCost || state.sect.alchemyMats < matCost) {
    state.actionPoints += 1;
    log(`洗髓探体需要灵石 ${stoneCost}、丹材 ${matCost}。`, "warn");
    render();
    return;
  }
  state.sect.stones -= stoneCost;
  state.sect.alchemyMats -= matCost;
  const chance = clamp(7 + Math.floor(d.luck / 12) + Math.floor(d.aptitude / 35), 7, 18);
  if (rand(1, 100) <= chance) {
    const con = rollConstitution(true);
    d.constitution = con.id;
    d.constitutionAwakened = true;
    applyDiscipleTemplateStats(d, con, 1);
    d.status = `觉醒${con.name}`;
    log(`${d.name}洗髓成功，觉醒特殊体质：${con.name}。`, "good");
  } else {
    d.exp += 5;
    d.temper += 1;
    d.status = "洗髓未显";
    log(`${d.name}洗髓后未显特殊体质，只稳固了经脉。`, "warn");
  }
  closeModal();
  render();
}

function openDisciplePersonalEvent(d, manual = false) {
  if (!d) return;
  const heart = daoHeartOf(d);
  const events = [
    { id: "wander", title: "下山历练", text: "获得修为、气运和少量资源，风险较低。", action: "历练" },
    { id: "debate", title: "同门论道", text: "提升专精与功法熟练度，可能增加心魔。", action: "论道" },
    { id: "trial", title: `${heart?.name || "道心"}考验`, text: "按道心定位获得对应属性成长，失败会受挫。", action: "问道" },
  ];
  showModal({
    kicker: "弟子个人事件",
    title: `${d.name}的道途抉择`,
    body: `
      <p>个人事件每名弟子每年最多主动触发一次，也可能在年度结算中自然发生。选择会影响属性、心魔、专精和资源。</p>
      <div class="system-grid">
        ${events.map((event) => `<article class="system-card">
          <strong>${event.title}</strong>
          <span>${event.text}</span>
          <button class="personal-event-pick" data-id="${event.id}">${event.action}</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "返回", handler: () => openDiscipleCultivationPanel(d) }],
  });
  for (const btn of els.modalBody.querySelectorAll(".personal-event-pick")) {
    btn.addEventListener("click", () => resolveDisciplePersonalEvent(d, btn.dataset.id, manual));
  }
}

function resolveDisciplePersonalEvent(d, eventId, manual = false) {
  if (manual && !spendAction(1, "弟子个人事件")) return;
  const score = d.temper + d.luck * 0.7 + (d.specializationLevel || 0) * 6 + rand(1, 80);
  const success = score > 70 + d.realm * 5;
  d.lastPersonalEventYear = state.year;
  if (eventId === "wander") {
    d.exp += success ? 14 : 6;
    d.luck += success ? 3 : 1;
    state.sect.stones += success ? 80 + d.realm * 40 : 30;
    d.status = success ? "历练有成" : "历练归来";
  } else if (eventId === "debate") {
    gainSpecializationExp(d, success ? 34 : 16, "同门论道");
    for (const id of d.activeMethods || []) {
      const method = d.methods.find((item) => item.id === id);
      if (method) method.proficiency = clamp((method.proficiency || 0) + (success ? 7 : 3), 0, 100);
    }
    if (!success) adjustMind(d, 5, "论道受挫");
    d.status = success ? "论道胜出" : "论道受挫";
  } else {
    const heart = daoHeartOf(d);
    applyDiscipleTemplateStats(d, heart, success ? 0.45 : 0.18);
    gainSpecializationExp(d, success ? 26 : 10, "道心考验");
    if (heart?.mindRisk && !success) adjustMind(d, heart.mindRisk + 4, "道心考验");
    d.status = success ? "道心更坚" : "道心微澜";
  }
  refreshDiscipleTitles(d);
  log(`${d.name}完成个人事件：${d.status}。`, success ? "good" : "warn");
  closeModal();
  render();
}

function maybeTriggerDisciplePersonalEvent() {
  if (!state.sect?.disciples?.length || Math.random() > 0.18) return;
  const candidates = state.sect.disciples.filter((d) => d.lastPersonalEventYear !== state.year && !d.seclusion);
  const d = pick(candidates.length ? candidates : state.sect.disciples);
  const eventId = pick(["wander", "debate", "trial"]);
  resolveDisciplePersonalEvent(d, eventId, false);
}

function adjustMind(d, amount, reason = "") {
  if (!d) return;
  const calm = state.yearlyBoon?.key === "mindCalm" && amount > 0 ? 0.65 : 1;
  d.mind = clamp(Math.round((d.mind || 0) + amount * calm), 0, 100);
  if (reason && amount > 0 && d.mind >= 70) d.status = `心魔：${reason}`;
}

function formBond(a, b, type = null) {
  if (!a || !b || a.id === b.id) return false;
  state.sect.bonds = state.sect.bonds || [];
  const existing = state.sect.bonds.find((bond) => (bond.a === a.id && bond.b === b.id) || (bond.a === b.id && bond.b === a.id));
  if (existing) {
    existing.level = clamp(existing.level + 1, 1, 5);
    return true;
  }
  state.sect.bonds.push({ id: uid(), a: a.id, b: b.id, type: type || pick(["同修", "挚友", "师徒", "竞争"]), level: 1 });
  return true;
}

function maybeCreateYearlyBond() {
  if (!state.sect || state.sect.disciples.length < 2) return;
  const chance = 0.18 + (state.yearlyBoon?.key === "bondBonus" || state.yearlyBoon?.key === "legacyBonus" ? 0.18 : 0);
  if (Math.random() > chance) return;
  const [a, b] = state.sect.disciples.slice().sort(() => Math.random() - 0.5);
  if (formBond(a, b)) log(`${a.name}与${b.name}结下羁绊，往后修行与斗法会互相牵动。`, "good");
}

function openBondMenu(d) {
  const others = state.sect.disciples.filter((item) => item.id !== d.id);
  showModal({
    kicker: "弟子羁绊",
    title: `${d.name}的同门关系`,
    body: `
      <p>羁绊会提高斗法、修行与心魔稳定性。竞争关系提升战斗，但心魔波动更大。</p>
      <div class="adventure-roster">
        ${others.map((item) => `<article class="adventure-candidate">
          <div><strong>${item.name}</strong><span>${realms[item.realm]} · 心${item.temper} 运${item.luck} 心魔${item.mind || 0}</span></div>
          <button class="bond-pick" data-id="${item.id}">结缘</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "关闭", handler: closeModal }],
  });
  for (const btn of els.modalBody.querySelectorAll(".bond-pick")) {
    btn.addEventListener("click", () => {
      const other = state.sect.disciples.find((item) => item.id === btn.dataset.id);
      if (!other) return;
      formBond(d, other);
      log(`${d.name}与${other.name}结成羁绊。`, "good");
      closeModal();
      render();
    });
  }
}

function chooseElderRole(d) {
  const scores = [
    ["传功长老", d.aptitude + d.temper + d.realm * 16],
    ["执法长老", d.atk + d.def + d.realm * 18],
    ["丹器长老", traitCraftBonus(d, "alchemy") + traitCraftBonus(d, "forging") + d.aptitude],
    ["镇守长老", d.def + (d.arrayLevel || 0) * 35 + d.temper],
    ["商议长老", d.charm + d.luck + traitBonusOnDisciple(d, "trade")],
  ].sort((a, b) => b[1] - a[1]);
  return scores[0][0];
}

function promoteElder(d) {
  if (!d || d.elder) return;
  if (d.realm < 2) {
    log("至少金丹弟子才有资格晋为长老。", "warn");
    return;
  }
  if (state.sect.prestige < 180) {
    log("晋升长老需要 180 声望。", "warn");
    return;
  }
  state.sect.prestige -= 180;
  d.elder = true;
  d.elderRole = chooseElderRole(d);
  d.status = d.elderRole;
  state.sect.diplomacy.reputation += 6;
  log(`${d.name}晋为${d.elderRole}，开始为宗门传承提供长期加成。`, "good");
  render();
}

function suppressMindDemon(d) {
  if (!d) return;
  if ((d.mind || 0) < 12) {
    log(`${d.name}心境尚稳，不需要专门压制心魔。`);
    return;
  }
  if (!spendAction(1, "压制心魔")) return;
  const cost = 45 + Math.floor((d.mind || 0) * 1.5);
  if (state.sect.insight < cost) {
    state.actionPoints += 1;
    log(`压制心魔需要 ${cost} 参悟。`, "warn");
    render();
    return;
  }
  state.sect.insight -= cost;
  const bondHelp = discipleBonds(d).length * 8;
  const elderHelp = d.elder ? 16 : 0;
  const score = d.temper + d.luck * 0.6 + bondHelp + elderHelp + rand(1, 100);
  const threshold = 80 + (d.mind || 0) * 0.45;
  const success = score >= threshold;
  if (success) {
    const reduce = rand(18, 34) + (state.yearlyBoon?.key === "mindCalm" ? 8 : 0);
    d.mind = Math.max(0, (d.mind || 0) - reduce);
    d.temper += state.yearlyBoon?.key === "demonRisk" ? 3 : 1;
    d.exp += state.yearlyBoon?.key === "demonRisk" ? 14 : 7;
    d.status = "心魔已伏";
    log(`${d.name}闭关压制心魔成功，心魔 -${reduce}，心性与修为小幅提升。`, "good");
  } else {
    d.mind = clamp((d.mind || 0) + rand(6, 14), 0, 100);
    d.hp = Math.max(22, d.hp - rand(4, 12));
    d.status = "心魔翻涌";
    log(`${d.name}压制心魔失败，心魔反噬，体魄受损。`, "warn");
  }
  render();
}

function elderBonus(kind) {
  if (!state.sect) return 0;
  return state.sect.disciples.filter((d) => d.elder).reduce((sum, d) => {
    if (kind === "train" && d.elderRole === "传功长老") return sum + 2 + d.realm;
    if (kind === "battle" && d.elderRole === "执法长老") return sum + 55 + d.realm * 12;
    if (kind === "craft" && d.elderRole === "丹器长老") return sum + 1 + Math.floor(d.realm / 2);
    if (kind === "array" && d.elderRole === "镇守长老") return sum + 75 + (d.arrayLevel || 0) * 22;
    if (kind === "market" && d.elderRole === "商议长老") return sum + 0.06;
    return sum;
  }, 0);
}

function processMindAndLegacy() {
  if (!state.sect) return;
  const legacyBoost = state.yearlyBoon?.key === "legacyBonus" ? 2 : 0;
  for (const d of state.sect.disciples) {
    const bonds = discipleBonds(d).length;
    if (bonds) d.exp += bonds + legacyBoost;
    if (d.elder) {
      state.sect.insight += 2 + Math.floor(d.realm / 2);
      d.exp += 1;
    }
    if ((d.mind || 0) >= 60 && Math.random() < (state.yearlyBoon?.key === "demonRisk" ? 0.42 : 0.26)) {
      const backlash = rand(5, 14);
      d.hp = Math.max(20, d.hp - backlash);
      d.exp = Math.max(0, d.exp - rand(4, 12));
      d.status = "心魔反噬";
      d.demonStage = clamp(Number(d.demonStage || 0) + 1, 0, 5);
      if (d.demonStage >= 3) {
        const insightGain = 12 + d.demonStage * 4;
        state.sect.insight += insightGain;
        d.damagePct = Number(d.damagePct || 0) + 1;
        d.mind = Math.max(18, d.mind - rand(8, 18));
        d.status = "心魔化悟";
        log(`${d.name}在心魔中窥见一线真意，参悟 +${insightGain}，但道心仍需看护。`, "good");
        d.demonStage = 1;
      }
      log(`${d.name}心魔反噬，体魄 -${backlash}，修行受阻。`, "warn");
    } else if ((d.mind || 0) > 0 && Math.random() < 0.35) {
      d.mind = Math.max(0, d.mind - rand(2, 7) - bonds);
    }
  }
}

function formationQualityFromScore(score) {
  return clamp(Math.floor(score / 160), 0, formationQualityNames.length - 1);
}

function openFormationMenu() {
  if (!state.founded) return;
  ensureSectDefaults();
  const eligible = state.sect.disciples
    .filter((d) => (d.arrayLevel || 0) > 0)
    .sort((a, b) => arrayCraftScore(b) - arrayCraftScore(a));
  const mountain = state.sect.mountainFormation;
  showModal({
    kicker: "阵法推演",
    title: "阵图、阵材与护山大阵",
    body: `
      <p>阵法是中后期防守和守点核心。弟子必须先在详情里进行“阵道授课”，否则无法推演阵法。护山大阵需要五名有阵道等级的弟子坐镇，成本极高，但会显著提高战力与资源点争夺防守。</p>
      <div class="ai-report-summary">
        <div><span>阵材</span><strong>${state.sect.arrayMats}</strong></div>
        <div><span>普通阵图</span><strong>${state.sect.formations.length}</strong></div>
        <div><span>护山大阵</span><strong>${mountain ? `${formationQualityNames[mountain.quality]} ${Math.round(mountain.power)}` : "未布设"}</strong></div>
      </div>
      <div class="formation-list">
        ${eligible.length ? eligible.map((d) => `<article class="formation-card">
          <strong>${d.name} 阵道 Lv.${d.arrayLevel}</strong>
          <span>${realms[d.realm]} · 守${d.def} 心${d.temper} 资${d.aptitude}</span>
          <em>预计阵图：${formationQualityNames[formationQualityFromScore(arrayCraftScore(d))]} / 势能 ${Math.round(arrayCraftScore(d))}</em>
          <button class="formation-craft" data-id="${d.id}" ${state.actionPoints < 1 || state.sect.stones < 520 || state.sect.arrayMats < 1 || state.sect.forgingMats < 1 ? "disabled" : ""}>推演阵图</button>
        </article>`).join("") : `<div class="target-detail">暂无阵道弟子。先在弟子详情中为弟子进行阵道授课。</div>`}
      </div>
    `,
    actions: [
      { label: "布设护山大阵", handler: buildMountainFormation },
      { label: "关闭", handler: closeModal },
    ],
  });
  for (const btn of els.modalBody.querySelectorAll(".formation-craft")) {
    btn.addEventListener("click", () => {
      const d = state.sect.disciples.find((item) => item.id === btn.dataset.id);
      if (!d) return;
      closeModal();
      craftFormation(d);
    });
  }
}

function craftFormation(d) {
  if (!d || (d.arrayLevel || 0) <= 0) {
    log("该弟子尚未加点阵道，无法推演阵法。", "warn");
    return;
  }
  if (!spendAction(1, "推演阵图")) return;
  if (state.sect.stones < 520 || state.sect.arrayMats < 1 || state.sect.forgingMats < 1) {
    state.actionPoints += 1;
    log("推演阵图需要 520 灵石、1 阵材、1 器材。", "warn");
    render();
    return;
  }
  state.sect.stones -= 520;
  state.sect.arrayMats -= 1;
  state.sect.forgingMats -= 1;
  const score = arrayCraftScore(d) + rand(0, 120);
  const quality = formationQualityFromScore(score);
  const power = Math.round(180 + quality * 95 + score * 0.55);
  const formation = { id: uid(), name: `${d.name}阵图`, makerId: d.id, quality, power };
  state.sect.formations.push(formation);
  d.exp += 10 + quality * 2;
  d.status = "推演阵图";
  log(`${d.name}推演出${formationQualityNames[quality]}阵图，阵法势能 ${power}，已纳入宗门阵库。`, "good");
  render();
}

function buildMountainFormation() {
  const sitters = state.sect.disciples
    .filter((d) => (d.arrayLevel || 0) > 0)
    .sort((a, b) => arrayCraftScore(b) - arrayCraftScore(a))
    .slice(0, 5);
  if (sitters.length < 5) {
    log("护山大阵需要五名有阵道等级的弟子坐镇。", "warn");
    return;
  }
  if (!spendAction(2, "布设护山大阵")) return;
  const cost = { stones: 1800, arrayMats: 4, forgingMats: 3, insight: 120 };
  if (state.sect.stones < cost.stones || state.sect.arrayMats < cost.arrayMats || state.sect.forgingMats < cost.forgingMats || state.sect.insight < cost.insight) {
    state.actionPoints += 2;
    log(`护山大阵需要 ${cost.stones} 灵石、${cost.arrayMats} 阵材、${cost.forgingMats} 器材、${cost.insight} 参悟。`, "warn");
    render();
    return;
  }
  state.sect.stones -= cost.stones;
  state.sect.arrayMats -= cost.arrayMats;
  state.sect.forgingMats -= cost.forgingMats;
  state.sect.insight -= cost.insight;
  const score = sitters.reduce((sum, d) => sum + arrayCraftScore(d), 0) + state.sect.formations.reduce((sum, f) => sum + f.power * 0.3, 0) + rand(0, 280);
  const quality = formationQualityFromScore(score / 3.6);
  const power = Math.round(760 + quality * 180 + score * 0.42);
  state.sect.mountainFormation = {
    id: uid(),
    quality,
    power,
    stationIds: sitters.map((d) => d.id),
    stationNames: sitters.map((d) => d.name),
  };
  state.sect.barrier = clamp(state.sect.barrier + 28 + quality * 4, 0, 100);
  for (const d of sitters) d.status = "坐镇大阵";
  log(`五名弟子坐镇，布成${formationQualityNames[quality]}护山大阵，阵势 ${power}。`, "good");
  closeModal();
  render();
}

function serializeState() {
  return {
    ...state,
    usedNames: [...state.usedNames],
    particles: [],
    worldAdventure: null,
    forbiddenRun: null,
    roomPvpDuel: null,
    roomBossLobby: null,
    waitingForPlayers: false,
  };
}

function hydrateState(data) {
  Object.assign(state, data);
  state.usedNames = new Set(Array.isArray(data.usedNames) ? data.usedNames : []);
  state.particles = [];
  state.waitingForPlayers = false;
  state.roomConnected = false;
  state.roomHost = false;
  state.readyPlayers = [];
  state.remotePlayers = [];
  state.roomPvpDuel = null;
  state.roomBossLobby = null;
  ensureSectDefaults();
}

function roomSaveKey(room = state.roomCode || roomCodeValue()) {
  const code = String(room || "ZIHE01").trim().toUpperCase() || "ZIHE01";
  return `${ROOM_SAVE_PREFIX}${code}`;
}

function readRoomSave(room = state.roomCode || roomCodeValue()) {
  const raw = localStorage.getItem(roomSaveKey(room));
  if (!raw) return null;
  try {
    return { raw, data: JSON.parse(raw) };
  } catch {
    return { raw, data: null, broken: true };
  }
}

function roomSaveSummary(room = state.roomCode || roomCodeValue()) {
  const saved = readRoomSave(room);
  if (!saved?.data?.state) return "暂无联机房间存档";
  const data = saved.data.state;
  const time = saved.data.savedAt ? new Date(saved.data.savedAt).toLocaleString() : "";
  return `${data.sect?.name || "未立宗门"} · 太初 ${data.year || 1} 年 · 房间 ${saved.data.roomCode || room}${time ? ` · ${time}` : ""}`;
}

function saveMultiplayerRoomProgress(reason = "联机进度保存") {
  if (!state.multiplayer && !state.roomCode) return false;
  try {
    ensureSectDefaults();
    const roomCode = state.roomCode || roomCodeValue();
    const payload = {
      version: 1,
      roomCode,
      clientId: state.clientId,
      hostId: state.roomHost ? state.clientId : "",
      savedAt: Date.now(),
      reason,
      snapshot: createSharedWorldSnapshot(),
      state: serializeState(),
      players: net.lastPlayers || roomPopulationSnapshot(),
    };
    localStorage.setItem(roomSaveKey(roomCode), JSON.stringify(payload));
    log(`${reason}：已保存房间 ${roomCode} 的本宗进度。`, "good");
    return true;
  } catch (err) {
    log("联机存档失败：浏览器本地存储不可用。", "warn");
    return false;
  }
}

function disconnectMultiplayerRoom(statusText = "已退出联机房间") {
  clearTimeout(net.reconnectTimer);
  net.reconnecting = false;
  net.reconnectAttempts = 0;
  net.manualClose = true;
  if (net.ws) {
    try { net.ws.close(); } catch {}
    net.ws = null;
  }
  state.roomConnected = false;
  state.roomHost = false;
  state.multiplayer = false;
  state.roomLobbyReady = false;
  if (els.multiplayerToggle) els.multiplayerToggle.checked = false;
  state.waitingForPlayers = false;
  state.remotePlayers = [];
  state.readyPlayers = [];
  state.roomAuction = null;
  state.roomCouncil = null;
  state.roomTournament = null;
  state.roomAdventureLobby = null;
  state.roomBlockedByForbidden = null;
  net.lastPlayers = [];
  els.waitingOverlay.hidden = true;
  updateRoomStatus(statusText, "warn");
  updateRoomPopulation([]);
}

function closeMultiplayerRoomAndSave() {
  if (!state.multiplayer || !state.roomConnected) {
    saveMultiplayerRoomProgress("联机进度保存");
    closeModal();
    return;
  }
  const snapshot = createSharedWorldSnapshot();
  saveMultiplayerRoomProgress(state.roomHost ? "房主关闭房间并保存" : "联机进度保存");
  if (state.roomHost) {
    sendRoomFeature("room_close_save", {
      roomCode: state.roomCode,
      hostId: state.clientId,
      hostName: state.sect?.name || "房主宗门",
      year: state.year,
      savedAt: Date.now(),
      snapshot,
    });
  }
  handleRoomCloseSave({ roomCode: state.roomCode, hostId: state.clientId, hostName: state.sect?.name, year: state.year, savedAt: Date.now(), snapshot }, state.sect?.name);
}

function handleRoomCloseSave(payload = {}, sourceName = "房主") {
  if (payload.snapshot && state.multiplayer) applySharedWorldSnapshot(payload.snapshot);
  saveMultiplayerRoomProgress("房间关闭自动保存");
  disconnectMultiplayerRoom(`房间已由${sourceName || "房主"}关闭并保存`);
  closeModal();
  showStartScreen();
  flashFeedback("房间已关闭，本地联机存档已保存。", "good");
  render();
}

function loadMultiplayerRoomProgress(room = roomCodeValue()) {
  const saved = readRoomSave(room);
  if (!saved?.data?.state) {
    log(`房间 ${room} 暂无本地联机存档。`, "warn");
    return;
  }
  try {
    hydrateState(saved.data.state);
    state.multiplayer = true;
    state.roomCode = saved.data.roomCode || room;
    if (saved.data.snapshot) applySharedWorldSnapshot(saved.data.snapshot);
    if (els.multiplayerToggle) els.multiplayerToggle.checked = true;
    if (els.roomCodeInput) els.roomCodeInput.value = state.roomCode;
    if (state.founded) showGameShell();
    else showStartScreen();
    closeModal();
    connectMultiplayerRoom(state.roomCode);
    log(`已读取联机房间存档：${roomSaveSummary(state.roomCode)}。`, "good");
    render();
  } catch (err) {
    log("读取联机房间存档失败：存档数据损坏。", "warn");
  }
}

function maybeOfferRoomSaveOnJoin() {
  const room = state.roomCode || roomCodeValue();
  const saved = readRoomSave(room);
  if (!saved?.data?.state || state.founded) return;
  showModal({
    kicker: "联机存档",
    title: `检测到房间 ${room} 的本地存档`,
    body: `<p>${tradeEscape(roomSaveSummary(room))}</p><p>读取后会恢复你上次在该房间的宗门进度，并重新连接房间。</p>`,
    actions: [
      { label: "读取联机存档", handler: () => loadMultiplayerRoomProgress(room) },
      { label: "跳过，重新开始", handler: closeModal },
    ],
  });
}

function saveSlotKey(slot) {
  return `${SAVE_SLOT_PREFIX}${slot}`;
}

function readSaveSlot(slot) {
  const raw = localStorage.getItem(saveSlotKey(slot)) || (slot === 1 ? localStorage.getItem(SAVE_KEY) : null);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    return { raw, data };
  } catch {
    return { raw, data: null, broken: true };
  }
}

function saveSlotSummary(slot) {
  const saved = readSaveSlot(slot);
  if (!saved?.data) return "空档";
  const data = saved.data;
  const name = data.sect?.name || "未立宗门";
  const mode = data.multiplayer ? "联机" : "单机";
  return `${name} · 太初 ${data.year || 1} 年 · ${mode}`;
}

function openSaveSlotModal(mode = "save") {
  const saving = mode === "save";
  const room = state.roomCode || roomCodeValue();
  const roomActions = saving
    ? [
      { label: state.roomHost ? "保存并关闭联机房间" : "保存联机进度", disabled: !state.multiplayer, handler: () => state.roomHost ? closeMultiplayerRoomAndSave() : (saveMultiplayerRoomProgress("联机进度保存"), closeModal()) },
    ]
    : [
      { label: "读取联机房间存档", disabled: !readRoomSave(room)?.data?.state, handler: () => loadMultiplayerRoomProgress(room) },
    ];
  showModal({
    kicker: saving ? "保存进度" : "读取进度",
    title: saving ? "选择一个存档栏位" : "选择要读取的存档",
    body: `
      <p>${saving ? "当前进度会写入所选栏位，并保留另外两个栏位。" : "读取后会覆盖当前局面；旧单档存档会显示在 1 号档。"}</p>
      ${state.multiplayer || readRoomSave(room)?.data?.state ? `<p>联机房间存档：${tradeEscape(roomSaveSummary(room))}</p>` : ""}
      <div class="system-grid">
        ${Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => `<article class="system-card"><strong>${i + 1} 号档</strong><span>${tradeEscape(saveSlotSummary(i + 1))}</span></article>`).join("")}
      </div>
    `,
    actions: Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => {
      const slot = i + 1;
      const hasData = Boolean(readSaveSlot(slot)?.data);
      return {
        label: saving ? `保存到 ${slot} 号档` : `读取 ${slot} 号档`,
        disabled: !saving && !hasData,
        handler: () => saving ? saveGame(slot) : loadGame(slot),
      };
    }).concat(roomActions, [{ label: "取消", handler: closeModal }]),
  });
}

function saveGame(slot = null) {
  if (!Number.isInteger(Number(slot))) {
    openSaveSlotModal("save");
    return;
  }
  try {
    ensureSectDefaults();
    const data = JSON.stringify(serializeState());
    localStorage.setItem(saveSlotKey(Number(slot)), data);
    if (Number(slot) === 1) localStorage.setItem(SAVE_KEY, data);
    closeModal();
    log(`已保存到 ${Number(slot)} 号档：太初 ${state.year} 年。`, "good");
  } catch (err) {
    log("保存失败：浏览器存储空间不可用。", "warn");
  }
}

function createMarketState() {
  const goods = {};
  for (const g of marketGoods) {
    const price = Math.round(g.base * (0.9 + Math.random() * 0.2));
    goods[g.id] = { price, history: [price], momentum: rand(-4, 4) };
  }
  return { goods };
}

function tradeBonusMultiplier() {
  if (!state.sect) return 1;
  const traders = state.sect.disciples.filter((d) => d.traits.some((t) => t.stonesPct || t.trade));
  const omen = state.yearlyBoon?.key === "marketBonus" ? 0.08 : 0;
  const edict = state.councilEdict?.key === "trade" ? 0.05 : 0;
  return 1 + Math.min(0.38, traders.length * 0.1 + elderBonus("market") + omen + edict);
}

function stoneIncomeMultiplier() {
  return tradeBonusMultiplier();
}

function updateMarketPrices() {
  if (!state.market) state.market = createMarketState();
  if (!state.market.goods) state.market.goods = {};
  const crisisKey = state.worldCrisis?.key || "";
  for (const g of marketGoods) {
    const data = state.market.goods[g.id] || { price: g.base, history: [g.base], momentum: 0 };
    const omenImpact = state.yearlyBoon?.key === "marketBonus" ? rand(-6, 12) : 0;
    const edictImpact = state.councilEdict?.key === "trade" ? rand(-10, 18) : 0;
    const crisisImpact = crisisKey === "war" && (g.id === "oreBond" || g.id === "routePermit") ? rand(-8, 18)
      : crisisKey === "famine" && g.id === "riceBond" ? rand(12, 28)
      : crisisKey === "plague" && g.id === "pillDust" ? rand(10, 24)
      : crisisKey === "boom" && (g.id === "spiritWood" || g.id === "routePermit") ? rand(8, 18)
      : 0;
    data.momentum = clamp(Math.round(data.momentum * 0.45 + rand(-g.volatility, g.volatility) + crisisImpact + omenImpact + edictImpact), -46, 46);
    const next = clamp(Math.round(data.price * (1 + data.momentum / 100)), Math.round(g.base * 0.42), Math.round(g.base * 2.35));
    data.price = next;
    data.history = [...(data.history || []), next].slice(-12);
    state.market.goods[g.id] = data;
  }
  syncSharedWorld();
}

function rollWorldCrisis() {
  if (Math.random() > 0.32) return null;
  const crises = [
    { key: "war", name: "边境战乱", text: "矿券与商路关牒剧烈波动，敌宗更容易挑衅。" },
    { key: "famine", name: "灵米歉收", text: "灵米期契走高，粮草相关压力增加。" },
    { key: "plague", name: "丹疫流行", text: "丹砂票据走高，丹药相关需求大增。" },
    { key: "boom", name: "仙市繁荣", text: "商路与灵木价格偏强，但追高风险也更大。" },
  ];
  const crisis = pick(crises);
  if (crisis.key === "war") activeRivals().forEach((r) => { r.attitude -= rand(1, 4); });
  if (crisis.key === "famine") state.sect.grain = Math.max(0, state.sect.grain - rand(20, 55));
  log(`世界事件：${crisis.name}。${crisis.text}`, crisis.key === "boom" ? "good" : "warn");
  return crisis;
}

function currentReputationPath() {
  if (!state.sect) return reputationPaths[reputationPaths.length - 1];
  const found = reputationPaths.find((path) => path.condition());
  state.sect.reputationPath = found?.id || "hermit";
  return found || reputationPaths[reputationPaths.length - 1];
}

function applySectPositionAnnualEffects() {
  ensureSectDefaults();
  const holders = Object.entries(state.sect.positions || {});
  const labels = [];
  for (const [positionId, discipleId] of holders) {
    const d = state.sect.disciples.find((item) => item.id === discipleId);
    const pos = sectPositionCatalog.find((item) => item.id === positionId);
    if (!d || !pos) continue;
    if (positionId === "chief") {
      state.sect.prestige += 8 + d.realm * 2;
      labels.push(`${d.name}主持门规，声望 +${8 + d.realm * 2}`);
    } else if (positionId === "law") {
      for (const target of state.sect.disciples) target.mind = Math.max(0, (target.mind || 0) - 2);
      labels.push(`${d.name}巡查内门，全宗心魔 -2`);
    } else if (positionId === "alchemy") {
      state.sect.alchemyMats += 1 + Math.floor(d.aptitude / 70);
      labels.push(`${d.name}整理丹房，丹材增加`);
    } else if (positionId === "forge") {
      state.sect.forgingMats += 1 + Math.floor(d.def / 75);
      labels.push(`${d.name}看护器堂，器材增加`);
    } else if (positionId === "diplomat") {
      state.sect.diplomacy.reputation += 3 + Math.floor((d.charm || 0) / 45);
      labels.push(`${d.name}外务斡旋，声誉上涨`);
    } else if (positionId === "spymaster") {
      state.sect.spyNetwork = clamp((state.sect.spyNetwork || 0) + 2 + Math.floor((d.speed || 0) / 55), 0, 100);
      labels.push(`${d.name}维护影网，暗线 +${2 + Math.floor((d.speed || 0) / 55)}`);
    }
  }
  if (labels.length) log(`宗门职务：${labels.slice(0, 3).join("；")}。`, "good");
}

function applyReputationPathYearly() {
  const path = currentReputationPath();
  if (!path) return;
  if (path.id === "righteous") {
    state.sect.prestige += 12;
    state.sect.diplomacy.reputation += 3;
  } else if (path.id === "demonic") {
    state.sect.insight += 10;
    state.sect.diplomacy.infamy += 1;
  } else if (path.id === "merchant") {
    state.sect.stones += 80 + state.sect.buildings.market * 35;
  } else if (path.id === "war") {
    state.sect.barrier = clamp(state.sect.barrier + 4, 0, 100);
  } else {
    state.sect.insight += 6;
  }
}

function advanceWorldChainYear() {
  if (!state.sect) return;
  if (!state.worldChain && Math.random() < 0.22) {
    const chain = pick(worldChainCatalog);
    state.worldChain = { id: chain.id, stage: 0, started: state.year };
  }
  if (!state.worldChain) return;
  const chain = worldChainCatalog.find((item) => item.id === state.worldChain.id) || worldChainCatalog[0];
  const stage = clamp(Number(state.worldChain.stage || 0), 0, chain.stages.length - 1);
  const text = chain.stages[stage];
  if (chain.id === "demonRift") {
    if (stage === 0) state.sect.disciples.forEach((d) => adjustMind(d, 2, "魔门复苏"));
    if (stage === 2) state.sect.insight += 30;
  } else if (chain.id === "spiritVein") {
    if (stage === 0) state.resources.forEach((r) => { r.value = Math.min(120, r.value + 2); });
    if (stage === 1) addOpportunityNodes(2, "spirit-chain");
    if (stage === 2) state.sect.stones += state.resources.filter((r) => r.owner === "player").length * 90;
  } else if (chain.id === "leagueSchism") {
    if (stage === 1) state.sect.spyNetwork = clamp((state.sect.spyNetwork || 0) + 8, 0, 100);
    if (stage === 2) state.sect.prestige += 45;
  }
  log(`世界事件链【${chain.name}】第 ${stage + 1} 段：${text}`, stage === chain.stages.length - 1 ? "good" : "warn");
  state.worldChain.stage = stage + 1;
  if (state.worldChain.stage >= chain.stages.length) state.worldChain = null;
}

function leagueRankingRows() {
  const self = {
    id: state.clientId,
    name: state.sect?.name || "本宗",
    type: "player",
    power: sectPower(),
    prestige: state.sect?.prestige || 0,
    stones: state.sect?.stones || 0,
  };
  const remotes = (state.remotePlayers || []).filter((p) => p.founded).map((p) => ({
    id: p.id,
    name: p.name,
    type: "remote",
    power: Number(p.power || 0),
    prestige: Number(p.prestige || 0),
    stones: Number(p.stones || 0),
  }));
  const rivals = activeRivals().map((r) => ({
    id: r.id,
    name: r.name,
    type: "rival",
    power: rivalStrategicPower(r),
    prestige: Math.max(0, (r.foundation || 80) * 2),
    stones: r.stones || 0,
  }));
  return [self, ...remotes, ...rivals]
    .map((row) => ({ ...row, score: Math.round(row.power * 0.58 + row.prestige * 2.8 + Math.sqrt(Math.max(0, row.stones)) * 26) }))
    .sort((a, b) => b.score - a.score)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function maybeGrantLeagueRankingRewards() {
  if (!state.founded || state.year % 10 !== 0 || state.lastLeagueRewardYear === state.year) return;
  const mine = leagueRankingRows().find((row) => row.id === state.clientId);
  if (!mine) return;
  state.lastLeagueRewardYear = state.year;
  const gain = mine.rank === 1 ? { stones: 900, prestige: 120, insight: 70 }
    : mine.rank <= 3 ? { stones: 520, prestige: 75, insight: 42 }
    : mine.rank <= 6 ? { stones: 260, prestige: 36, insight: 22 }
    : { stones: 120, prestige: 12, insight: 10 };
  state.sect.stones += gain.stones;
  state.sect.prestige += gain.prestige;
  state.sect.insight += gain.insight;
  log(`仙盟榜单结算：本宗第 ${mine.rank} 名，获得灵石 +${gain.stones}、声望 +${gain.prestige}、参悟 +${gain.insight}。`, mine.rank <= 3 ? "good" : "");
}

function openLeagueRankingBoard() {
  ensureSectDefaults();
  const rows = leagueRankingRows();
  showModal({
    kicker: "仙盟榜单",
    title: `太初 ${state.year} 年宗门榜`,
    body: `
      <p>榜单按综合战力、声望和灵石底蕴计算。每十年结算一次奖励，联机玩家会一起出现在榜单中。</p>
      <div class="tournament-table">
        ${rows.slice(0, 14).map((row) => `<article class="match-row ${row.id === state.clientId ? "is-winner" : ""}">
          <span>第 ${row.rank} 名：${tradeEscape(row.name)}</span>
          <strong>${Math.round(row.score)}</strong>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "关闭", handler: closeModal }],
  });
}

function portraitStyleOf(d) {
  const raw = String(d?.portraitId || "");
  return portraitStyles.find((style) => raw.includes(style)) || (d?.sectPosition === "spymaster" ? "shadow" : d?.realm >= 3 ? "elder" : "sword");
}

function disciplePortraitHtml(d, size = "") {
  const asset = portraitAssetMap[d?.portraitId] || "";
  const hue = (stableHash(d?.portraitId || d?.name || "disciple") % 360);
  const style = [`--portrait-hue:${hue}`];
  if (asset) style.push(`--portrait-image:url('${asset}')`);
  return `<div class="portrait-slot ${size} portrait-${portraitStyleOf(d)} ${asset ? "has-portrait-asset" : ""}" style="${style.join(";")}" title="${tradeEscape(d?.portraitId || "默认立绘槽")}">
    <span>${tradeEscape((d?.name || "?").slice(0, 1))}</span>
    <i></i>
  </div>`;
}

function discipleLifeExpectancy(d) {
  return Math.round(96 + Number(d?.realm || 0) * 72 + Number(d?.temper || 0) * 0.35 + Number(d?.aptitude || 0) * 0.22 + Number(d?.luck || 0) * 0.45);
}

function sectTitlePower() {
  return (state.sect?.titles || []).reduce((sum, id) => sum + Number(sectTitleCatalog.find((item) => item.id === id)?.power || 0), 0);
}

function recordSectHistory(title, text, tone = "") {
  if (!state.sect) return;
  state.sect.history = Array.isArray(state.sect.history) ? state.sect.history : [];
  state.sect.history.unshift({ id: uid(), year: state.year, title, text, tone });
  state.sect.history = state.sect.history.slice(0, 80);
  if (state.sect.history.length >= 10) unlockSectTitle("famousChronicle");
}

function unlockSectTitle(id) {
  const title = sectTitleCatalog.find((item) => item.id === id);
  if (!title || !state.sect) return false;
  state.sect.titles = Array.isArray(state.sect.titles) ? state.sect.titles : [];
  if (state.sect.titles.includes(id)) return false;
  state.sect.titles.push(id);
  log(`宗门获得称号【${title.name}】：${title.text}`, "good");
  recordSectHistory("宗门称号", `获得称号【${title.name}】。`, "good");
  return true;
}

function processLifespanYear() {
  if (!state.sect?.disciples?.length) return;
  const originalRoster = state.sect.disciples.slice();
  const survivors = [];
  const departed = [];
  for (const d of state.sect.disciples) {
    d.age = Number(d.age || 18) + 1;
    d.lifespan = Math.max(Number(d.lifespan || 0), discipleLifeExpectancy(d));
    if (d.realm >= 2 && d.age % 12 === 0) d.lifespan += 2;
    const over = d.age - d.lifespan;
    const risk = over > 0 ? clamp(8 + over * 4 - d.realm * 3 - Math.floor((d.temper || 0) / 22), 4, 82) : 0;
    if (risk && rand(1, 100) <= risk) {
      const legacy = 18 + d.realm * 18 + Math.floor(discipleBattleScore(d) / 900);
      state.sect.legacy += legacy;
      state.sect.insight += 10 + d.realm * 8;
      departed.push({ id: d.id, name: d.name, realm: d.realm, legacy });
      state.sect.ancestors.unshift({ name: d.name, realm: d.realm, year: state.year, legacy, portraitId: d.portraitId });
      state.sect.ancestors = state.sect.ancestors.slice(0, 16);
      recordSectHistory("弟子坐化", `${d.name}寿尽坐化，留下薪火 ${legacy}。`, "warn");
      continue;
    }
    survivors.push(d);
  }
  if (!survivors.length && originalRoster.length) {
    const keeper = originalRoster.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a))[0];
    const index = departed.findIndex((item) => item.id === keeper.id);
    if (index >= 0) {
      const keptDeath = departed.splice(index, 1)[0];
      state.sect.legacy = Math.max(0, (state.sect.legacy || 0) - keptDeath.legacy);
      state.sect.insight = Math.max(0, (state.sect.insight || 0) - (10 + keptDeath.realm * 8));
      state.sect.ancestors = (state.sect.ancestors || []).filter((item) => !(item.name === keeper.name && item.year === state.year));
      state.sect.history = (state.sect.history || []).filter((item) => !(item.title === "弟子坐化" && item.year === state.year && String(item.text || "").includes(keeper.name)));
    }
    keeper.age = Math.max(keeper.age || 18, keeper.lifespan || discipleLifeExpectancy(keeper));
    keeper.lifespan = keeper.age + 8 + keeper.realm * 3;
    keeper.status = "闭死关延寿";
    survivors.push(keeper);
    recordSectHistory("闭死关延寿", `${keeper.name}以秘法续命，保住宗门香火。`, "warn");
  }
  if (departed.length) {
    state.sect.disciples = survivors;
    if (!state.sect.disciples.some((d) => d.id === state.selectedDiscipleId)) state.selectedDiscipleId = state.sect.disciples[0]?.id || null;
    log(`寿元流转：${departed.map((d) => d.name).join("、")}坐化，宗门薪火 +${departed.reduce((s, d) => s + d.legacy, 0)}。`, "warn");
  }
  if (state.year >= 100) unlockSectTitle("oldLineage");
}

function openLegacyInheritancePanel(d) {
  if (!d) return;
  const receivers = state.sect.disciples.filter((item) => item.id !== d.id).sort((a, b) => a.realm - b.realm || a.age - b.age);
  showModal({
    kicker: "代际传承",
    title: `${d.name}传功留法`,
    body: `
      <p>年长或高境界弟子可将经验、道统和部分感悟传给后辈。传承会消耗 1 行动点与参悟，传功者会损耗体魄，但宗门获得薪火。</p>
      <div class="ai-report-summary">
        <div><span>年龄</span><strong>${d.age}/${d.lifespan}</strong></div>
        <div><span>薪火</span><strong>${state.sect.legacy || 0}</strong></div>
        <div><span>可传承</span><strong>${d.legacyGiven ? "已传" : "可传"}</strong></div>
      </div>
      <div class="tournament-table">
        ${receivers.map((r) => `<label class="match-row"><span>${r.name} / ${realms[r.realm]} / ${r.age}岁</span><strong>战力 ${Math.round(discipleBattleScore(r))}</strong><input type="radio" name="legacy-target" value="${r.id}"></label>`).join("") || `<div class="target-detail">暂无可承接传承的后辈。</div>`}
      </div>
    `,
    actions: [
      { label: "传功", disabled: !receivers.length || d.legacyGiven || state.actionPoints < 1 || state.sect.insight < 80, handler: () => {
        const id = els.modalBody.querySelector("input[name='legacy-target']:checked")?.value || receivers[0]?.id;
        applyLegacyInheritance(d, id);
      } },
      { label: "返回", handler: () => openDiscipleCultivationPanel(d) },
    ],
  });
}

function applyLegacyInheritance(source, targetId) {
  const target = state.sect.disciples.find((d) => d.id === targetId);
  if (!source || !target || source.legacyGiven) return;
  if (!spendAction(1, "代际传承")) return;
  if (state.sect.insight < 80) {
    state.actionPoints += 1;
    flashFeedback("代际传承需要 80 参悟。", "warn");
    return;
  }
  state.sect.insight -= 80;
  const expGain = 34 + source.realm * 12 + Math.floor((source.age || 20) / 12);
  target.exp += expGain;
  target.specializationExp = Number(target.specializationExp || 0) + 22 + source.realm * 4;
  target.temper += 2;
  source.hp = Math.max(18, source.hp - rand(8, 18));
  source.exp = Math.max(0, source.exp - 28);
  source.legacyGiven = true;
  state.sect.legacy += 12 + source.realm * 5;
  source.status = "传功后调息";
  target.status = "承接传承";
  unlockSectTitle("legacyHall");
  recordSectHistory("代际传承", `${source.name}向${target.name}传功，后辈修为 +${expGain}。`, "good");
  log(`${source.name}将一脉心得传给${target.name}，修为 +${expGain}。`, "good");
  closeModal();
  render();
}

function openDelegationPanel() {
  ensureSectDefaults();
  showModal({
    kicker: "弟子委派",
    title: `太初 ${state.year} 年年度任务`,
    body: `
      <p>委派不消耗主行动点，会在进入下一年时结算。每名弟子每年只能执行一个委派任务。</p>
      <div class="delegation-grid">
        ${state.sect.disciples.map((d) => `<article class="delegation-card">
          ${disciplePortraitHtml(d)}
          <div><strong>${d.name}</strong><span>${realms[d.realm]} / ${d.age}岁 / 当前：${delegationTasks.find((t) => t.id === d.assignment)?.name || "未委派"}</span></div>
          <div class="craft-actions">
            ${delegationTasks.map((task) => `<button class="assign-task" data-id="${d.id}" data-task="${task.id}" ${d.travel || d.seclusion ? "disabled" : ""}>${task.name}</button>`).join("")}
          </div>
        </article>`).join("")}
      </div>
    `,
    actions: [
      { label: "清空委派", handler: () => { state.sect.disciples.forEach((d) => { d.assignment = ""; }); openDelegationPanel(); render(); } },
      { label: "关闭", handler: closeModal },
    ],
  });
  for (const btn of els.modalBody.querySelectorAll(".assign-task")) {
    btn.addEventListener("click", () => {
      const d = state.sect.disciples.find((item) => item.id === btn.dataset.id);
      const task = delegationTasks.find((item) => item.id === btn.dataset.task);
      if (!d || !task) return;
      d.assignment = task.id;
      d.status = `委派：${task.name}`;
      flashFeedback(`${d.name}已委派：${task.name}`, "good");
      openDelegationPanel();
      render();
    });
  }
}

function processDiscipleAssignmentsYear() {
  if (!state.sect?.disciples?.length) return;
  const lines = [];
  for (const d of state.sect.disciples) {
    const task = delegationTasks.find((item) => item.id === d.assignment);
    if (!task) continue;
    const reward = task.reward(d);
    if (reward.stones) state.sect.stones += reward.stones;
    if (reward.prestige) state.sect.prestige += reward.prestige;
    if (reward.insight) state.sect.insight += reward.insight;
    if (reward.alchemyMats) state.sect.alchemyMats += reward.alchemyMats;
    if (reward.forgingMats) state.sect.forgingMats += reward.forgingMats;
    if (reward.spyNetwork) state.sect.spyNetwork = clamp((state.sect.spyNetwork || 0) + reward.spyNetwork, 0, 100);
    if (reward.barrier) state.sect.barrier = clamp(state.sect.barrier + reward.barrier, 0, 100);
    if (reward.refineStone) addItem("refineStone", reward.refineStone, 0);
    if (reward.teachExp) {
      for (const junior of state.sect.disciples.filter((item) => item.id !== d.id && item.realm <= d.realm).slice(0, 3)) junior.exp += reward.teachExp;
    }
    if (state.sectCrisis && sectCrisisCatalog.find((c) => c.id === state.sectCrisis.id)?.counter.includes(task.id)) {
      state.sectCrisis.severity = Math.max(0, state.sectCrisis.severity - (5 + d.realm * 2));
    }
    d.exp += 3 + d.realm;
    d.assignment = "";
    lines.push(`${d.name}${task.name}`);
  }
  if (lines.length) log(`年度委派结算：${lines.slice(0, 5).join("、")}。`, "good");
}

function sectCrisisChance() {
  const averageMind = state.sect.disciples.length ? state.sect.disciples.reduce((s, d) => s + (d.mind || 0), 0) / state.sect.disciples.length : 0;
  return clamp(0.08 + state.sect.risk / 900 + (state.sect.diplomacy?.infamy || 0) / 900 + averageMind / 900 + state.year / 900, 0.08, 0.42);
}

function maybeTriggerSectCrisis() {
  if (!state.founded || state.sectCrisis || state.year < 4) return;
  if (Math.random() > sectCrisisChance()) return;
  const base = pick(sectCrisisCatalog);
  state.sectCrisis = {
    id: base.id,
    name: base.name,
    text: base.text,
    severity: rand(base.severity[0], base.severity[1]),
    ttl: rand(2, 4),
    year: state.year,
  };
  recordSectHistory("宗门危机", `${base.name}爆发：${base.text}`, "warn");
  log(`宗门危机【${base.name}】爆发：${base.text}`, "warn");
}

function processSectCrisisYear() {
  const crisis = state.sectCrisis;
  if (!crisis) return;
  const impact = Math.max(1, Math.ceil(crisis.severity / 8));
  if (crisis.id === "mindTide") state.sect.disciples.forEach((d) => adjustMind(d, impact, "心魔潮"));
  if (crisis.id === "resourceRiot") state.sect.stones = Math.max(0, state.sect.stones - impact * 42);
  if (crisis.id === "tradeBreak") state.sect.stones = Math.max(0, state.sect.stones - impact * 55);
  if (crisis.id === "spyLeak") state.sect.spyNetwork = Math.max(0, (state.sect.spyNetwork || 0) - impact * 2);
  if (crisis.id === "beastOmen") state.sect.barrier = Math.max(0, state.sect.barrier - impact * 2);
  crisis.ttl -= 1;
  crisis.severity = Math.max(0, crisis.severity - Math.floor((state.sect.barrier || 0) / 30));
  if (crisis.severity <= 0) {
    resolveSectCrisis("自然平息");
  } else if (crisis.ttl <= 0) {
    recordSectHistory("危机失控", `${crisis.name}未被及时化解，宗门付出代价。`, "warn");
    state.sect.prestige = Math.max(0, state.sect.prestige - crisis.severity * 2);
    state.sectCrisis = null;
    log(`${crisis.name}拖延太久，宗门声望受损。`, "warn");
  } else {
    log(`宗门危机【${crisis.name}】仍在持续，烈度 ${crisis.severity}，剩余 ${crisis.ttl} 年。`, "warn");
  }
}

function openCrisisPanel() {
  ensureSectDefaults();
  const crisis = state.sectCrisis;
  if (!crisis) {
    showModal({
      kicker: "宗门危机",
      title: "山门暂稳",
      body: `<p>当前没有爆发中的宗门危机。危机概率受选址风险、恶名、弟子心魔、年份和资源压力影响。</p><p>年度委派“巡山护法”“影网探听”“护送商队”等任务可以提前压低危机烈度。</p>`,
      actions: [{ label: "关闭", handler: closeModal }],
    });
    return;
  }
  const counters = sectCrisisCatalog.find((item) => item.id === crisis.id)?.counter.map((id) => delegationTasks.find((task) => task.id === id)?.name).filter(Boolean).join("、") || "无";
  showModal({
    kicker: "宗门危机",
    title: `${crisis.name} / 烈度 ${crisis.severity}`,
    body: `
      <p>${crisis.text}</p>
      <div class="ai-report-summary">
        <div><span>烈度</span><strong>${crisis.severity}</strong></div>
        <div><span>剩余</span><strong>${crisis.ttl} 年</strong></div>
        <div><span>克制委派</span><strong>${counters}</strong></div>
      </div>
      <p>可先选中一名强力弟子再全力处置；弟子战力、心性、职位、护山和影网都会影响效果。</p>
    `,
    actions: [
      { label: "全力处置", handler: handleSectCrisis, disabled: state.actionPoints < 1 },
      { label: "先去委派", handler: openDelegationPanel },
      { label: "关闭", handler: closeModal },
    ],
  });
}

function handleSectCrisis() {
  const crisis = state.sectCrisis;
  if (!crisis || !spendAction(1, "处置宗门危机")) return;
  const d = selectedDisciple() || state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a))[0];
  const score = (d ? discipleBattleScore(d) / 90 + d.temper + d.luck + d.realm * 18 : 40) + (state.sect.barrier || 0) * 0.45 + (state.sect.spyNetwork || 0) * 0.35 + rand(1, 100);
  const reduce = Math.max(8, Math.round(score / 13));
  crisis.severity = Math.max(0, crisis.severity - reduce);
  if (d) {
    d.exp += 8 + d.realm * 2;
    d.status = "处置危机";
  }
  if (crisis.severity <= 0) resolveSectCrisis(d?.name || "宗门合力");
  else {
    log(`${d?.name || "宗门"}压下${crisis.name}一截，烈度 -${reduce}，仍剩 ${crisis.severity}。`, "warn");
    openCrisisPanel();
  }
  render();
}

function resolveSectCrisis(source = "宗门合力") {
  const crisis = state.sectCrisis;
  if (!crisis) return;
  state.sectCrisis = null;
  state.sect.crisisResolved = Number(state.sect.crisisResolved || 0) + 1;
  state.sect.prestige += 25;
  state.sect.insight += 20;
  if (state.sect.crisisResolved >= 3) unlockSectTitle("crisisKeeper");
  else unlockSectTitle("firstBlood");
  recordSectHistory("化解危机", `${source}化解【${crisis.name}】，宗门威望提升。`, "good");
  log(`宗门危机【${crisis.name}】已化解，声望 +25，参悟 +20。`, "good");
}

function openSectChronicle() {
  ensureSectDefaults();
  const titles = (state.sect.titles || []).map((id) => sectTitleCatalog.find((item) => item.id === id)).filter(Boolean);
  showModal({
    kicker: "宗门史册",
    title: `${state.sect.name}纪年`,
    body: `
      <div class="ai-report-summary">
        <div><span>宗门称号</span><strong>${titles.length}</strong></div>
        <div><span>薪火</span><strong>${state.sect.legacy || 0}</strong></div>
        <div><span>先贤</span><strong>${(state.sect.ancestors || []).length}</strong></div>
      </div>
      <div class="system-grid">${titles.length ? titles.map((title) => `<article class="system-card is-winner"><strong>${title.name}</strong><span>${title.text}</span><em>宗门战力 +${title.power}</em></article>`).join("") : `<article class="system-card"><strong>暂无称号</strong><span>完成传承、化解危机或积累史册后会解锁。</span></article>`}</div>
      <div class="ai-report-list">
        ${(state.sect.history || []).slice(0, 14).map((row) => `<article class="ai-report-card"><div class="ai-report-head"><strong>太初 ${row.year} 年：${tradeEscape(row.title)}</strong><span>${tradeEscape(row.tone || "")}</span></div><p>${tradeEscape(row.text)}</p></article>`).join("") || `<div class="target-detail">暂无史册记录。</div>`}
      </div>
    `,
    actions: [{ label: "关闭", handler: closeModal }],
  });
}

function marketChart(history) {
  const values = history && history.length ? history : [1];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(1, max - min);
  const points = values.map((v, i) => {
    const x = values.length === 1 ? 0 : (i / (values.length - 1)) * 120;
    const y = 42 - ((v - min) / span) * 36;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return `<svg class="price-chart" viewBox="0 0 120 46" preserveAspectRatio="none"><polyline points="${points}"></polyline></svg>`;
}

function openMarketBoard() {
  if (!state.founded) return;
  ensureSectDefaults();
  if (state.sect.buildings.market < 1) {
    log("需要先建设山门市集，才可进入市集倒卖。", "warn");
    return;
  }
  if (!state.market?.goods) state.market = createMarketState();
  for (const g of marketGoods) {
    if (!state.market.goods[g.id]) state.market.goods[g.id] = { price: g.base, history: [g.base], momentum: 0 };
  }
  const maxTrades = marketTradeLimit();
  showModal({
    kicker: "山门市集",
    title: `市集行情｜本年 ${state.marketTradesThisYear}/${maxTrades} 笔`,
    body: `
      <p>市集商品是单独的投机仓位，不进入宗门仓库。价格每年波动，可低买高卖；判断失误会套牢甚至破产。</p>
      <p>当前灵石：<strong>${Math.round(state.sect.stones)}</strong>。拥有商贸词条弟子时，卖出收益与年度灵石收入最多提高 30%。</p>
      ${state.worldCrisis ? `<p class="market-crisis">世界局势：${state.worldCrisis.name}。${state.worldCrisis.text}</p>` : ""}
      <div class="market-board">
        ${marketGoods.map((g) => {
          const data = state.market.goods[g.id];
          const holding = state.sect.marketPortfolio[g.id] || { qty: 0, avg: 0 };
          const buyPrice = Math.ceil(data.price * 1.05);
          const sellPrice = Math.floor(data.price * 0.95 * tradeBonusMultiplier());
          const totalValue = holding.qty * data.price;
          const pnl = holding.qty ? Math.round(totalValue - holding.qty * holding.avg) : 0;
          const maxBuy = Math.max(1, Math.floor(state.sect.stones / buyPrice));
          const maxSell = Math.max(1, holding.qty || 1);
          return `<article class="market-good">
            <div><strong>${g.name}</strong><span>${g.text}</span></div>
            ${marketChart(data.history)}
            <div class="market-numbers">
              <span>现价<strong>${data.price}</strong></span>
              <span>持仓<strong>${holding.qty}</strong></span>
              <span>均价<strong>${Math.round(holding.avg || 0)}</strong></span>
              <span>浮盈<strong class="${pnl >= 0 ? "good" : "warn"}">${pnl >= 0 ? "+" : ""}${pnl}</strong></span>
            </div>
            <div class="craft-actions">
              <label class="market-qty-label">数量
                <input class="market-qty" data-id="${g.id}" type="number" min="1" value="1" max="${Math.max(maxBuy, maxSell)}" inputmode="numeric" />
              </label>
              <button class="market-buy" data-id="${g.id}" ${state.marketTradesThisYear >= maxTrades || state.sect.stones < buyPrice ? "disabled" : ""}>买入一批 ${buyPrice}/件</button>
              <button class="market-sell" data-id="${g.id}" ${state.marketTradesThisYear >= maxTrades || holding.qty < 1 ? "disabled" : ""}>卖出一批 ${sellPrice}/件</button>
            </div>
          </article>`;
        }).join("")}
      </div>
    `,
    actions: [{ label: "收盘离开", handler: closeModal }],
  });
  for (const btn of els.modalBody.querySelectorAll(".market-buy")) btn.addEventListener("click", () => marketBuy(btn.dataset.id, marketQty(btn.dataset.id)));
  for (const btn of els.modalBody.querySelectorAll(".market-sell")) btn.addEventListener("click", () => marketSell(btn.dataset.id, marketQty(btn.dataset.id)));
}

function marketTradeLimit() {
  return 2 + Math.max(0, state.sect?.buildings?.market || 0);
}

function marketQty(id) {
  const input = els.modalBody.querySelector(`.market-qty[data-id="${id}"]`);
  return clamp(Math.floor(Number(input?.value || 1)), 1, 999);
}

function marketBuy(id, qty = 1) {
  const maxTrades = marketTradeLimit();
  const data = state.market.goods[id];
  if (!data) return;
  const buyPrice = Math.ceil(data.price * 1.05);
  qty = clamp(qty, 1, Math.max(1, Math.floor(state.sect.stones / buyPrice)));
  const totalCost = buyPrice * qty;
  if (state.marketTradesThisYear >= maxTrades || state.sect.stones < totalCost) return;
  const slot = state.sect.marketPortfolio[id] || { qty: 0, avg: 0 };
  state.sect.stones -= totalCost;
  slot.avg = slot.qty ? (slot.avg * slot.qty + totalCost) / (slot.qty + qty) : buyPrice;
  slot.qty += qty;
  state.sect.marketPortfolio[id] = slot;
  state.marketTradesThisYear += 1;
  log(`市集买入 ${marketGoods.find((g) => g.id === id)?.name} x${qty}，总成本 ${totalCost} 灵石。本批买入只计 1 笔交易。`, "good");
  if (state.multiplayer && state.roomConnected) sendNet("player_event", { text: `${state.sect.name}在共享市集中买入${marketGoods.find((g) => g.id === id)?.name} x${qty}。`, tone: "good" });
  syncSharedWorld();
  closeModal();
  openMarketBoard();
  render();
}

function marketSell(id, qty = 1) {
  const maxTrades = marketTradeLimit();
  const data = state.market.goods[id];
  const slot = state.sect.marketPortfolio[id];
  if (!data || !slot || slot.qty < 1 || state.marketTradesThisYear >= maxTrades) return;
  qty = clamp(qty, 1, slot.qty);
  const gainEach = Math.floor(data.price * 0.95 * tradeBonusMultiplier());
  const gain = gainEach * qty;
  const profit = Math.round(gain - slot.avg * qty);
  state.sect.stones += gain;
  slot.qty -= qty;
  if (slot.qty <= 0) delete state.sect.marketPortfolio[id];
  state.marketTradesThisYear += 1;
  log(`市集卖出 ${marketGoods.find((g) => g.id === id)?.name} x${qty}，回笼 ${gain} 灵石，${profit >= 0 ? "盈利" : "亏损"} ${Math.abs(profit)}。本批卖出只计 1 笔交易。`, profit >= 0 ? "good" : "warn");
  if (state.multiplayer && state.roomConnected) sendNet("player_event", { text: `${state.sect.name}在共享市集中卖出${marketGoods.find((g) => g.id === id)?.name} x${qty}。`, tone: profit >= 0 ? "good" : "warn" });
  syncSharedWorld();
  closeModal();
  openMarketBoard();
  render();
}

function loadGame(slot = null) {
  if (!Number.isInteger(Number(slot))) {
    openSaveSlotModal("load");
    return;
  }
  const saved = readSaveSlot(Number(slot));
  if (!saved?.raw) {
    log(`${Number(slot)} 号档暂无存档。`, "warn");
    return;
  }
  try {
    hydrateState(saved.data || JSON.parse(saved.raw));
    if (state.founded) showGameShell();
    else showStartScreen();
    updateRoomPopulation([]);
    els.waitingOverlay.hidden = true;
    closeModal();
    log(`已读取 ${Number(slot)} 号档：太初 ${state.year} 年。`, "good");
    syncPublicState();
    render();
  } catch (err) {
    log("读档失败：存档数据损坏。", "warn");
  }
}

function buildStructure(building) {
  if (state.sect.buildings[building.key] >= 3) {
    log(`${building.name}已达最高等级。`, "warn");
    return;
  }
  if (!spendAction(1, "宗门建设")) return;
  const cost = building.cost + state.sect.buildings[building.key] * 220;
  if (state.sect.stones < cost) {
    state.actionPoints += 1;
    log(`建设${building.name}需要 ${cost} 灵石。`, "warn");
    render();
    return;
  }
  state.sect.stones -= cost;
  state.sect.buildings[building.key] += 1;
  log(`${building.name}升至 Lv.${state.sect.buildings[building.key]}。${building.text}`, "good");
  closeModal();
  render();
}

function trainingDrill() {
  if (state.sect.buildings.trainingHall < 1) {
    log("需要先建设演武场。", "warn");
    return;
  }
  if (!spendAction(1, "演武集训")) return;
  for (const d of state.sect.disciples) {
    d.exp += 7 + state.sect.buildings.trainingHall * 5;
    d.atk += state.sect.buildings.trainingHall;
  }
  log("演武场开阵集训，全体弟子获得修为与攻伐提升。", "good");
  closeModal();
  render();
}

function openInsightRoom() {
  if (state.sect.buildings.insightRoom < 1) {
    log("需要先建设参悟室。", "warn");
    return;
  }
  const roster = state.sect.disciples.filter((d) => (d.activeMethods || []).length);
  showModal({
    kicker: "参悟室",
    title: "选择弟子参悟功法",
    body: `
      <p>参悟室消耗 1 点行动，提升该弟子已携带功法熟练度。收益受参悟室、灵气阵和山门灵气影响。</p>
      <div class="tournament-table">
        ${roster.length ? roster.map((d, index) => `<label class="match-row"><span>${d.name}<div class="hp-line"><i style="width:${clamp(d.temper, 0, 160) / 1.6}%"></i></div></span><strong>${(d.activeMethods || []).map((id) => methodCatalog[id]?.name).filter(Boolean).join(" / ")}</strong><input type="radio" name="insight-disciple" value="${d.id}" ${index === 0 ? "checked" : ""}></label>`).join("") : `<div class="target-detail">暂无携带功法的弟子，请先在弟子详情中参悟并携带功法。</div>`}
      </div>
    `,
    actions: [
      { label: "开始参悟", disabled: !roster.length, handler: () => {
        const id = els.modalBody.querySelector("input[name='insight-disciple']:checked")?.value;
        trainMethodInInsightRoom(id);
      } },
      { label: "关闭", handler: closeModal },
    ],
  });
}

function trainMethodInInsightRoom(discipleId) {
  const d = state.sect.disciples.find((item) => item.id === discipleId);
  if (!d || !(d.activeMethods || []).length) return;
  if (!spendAction(1, "参悟室修行")) return;
  const gain = Math.round(6 + state.sect.buildings.insightRoom * 5 + state.sect.buildings.spiritArray * 3 + (state.sect.aura || 0) / 24);
  for (const id of d.activeMethods) {
    const method = d.methods.find((item) => item.id === id);
    if (method) method.proficiency = clamp((method.proficiency || 0) + gain, 0, 100);
  }
  d.status = "参悟功法";
  log(`${d.name}在参悟室静修，携带功法熟练度 +${gain}。`, "good");
  closeModal();
  render();
}

function scoutForEvent() {
  if (state.sect.buildings.scoutTower < 1) {
    log("需要先建设观星楼。", "warn");
    return;
  }
  if (!spendAction(1, "观星侦察")) return;
  const event = {
    id: `event-${Date.now()}`,
    type: "event",
    name: pick(["星坠古台", "龙脉裂隙", "药王残圃", "无名剑冢"]),
    x: rand(90, 960),
    y: rand(80, 610),
    value: rand(60, 110),
    ttl: rand(4, 8),
  };
  state.events.push(event);
  log(`观星楼发现${event.name}，已标记在地图上。`, "good");
  closeModal();
  render();
}

function marketTrade() {
  if (state.sect.buildings.market < 1) {
    log("需要先建设山门市集。", "warn");
    return;
  }
  if (state.sect.stones < 220) {
    log("市集换材需要 220 灵石。", "warn");
    return;
  }
  state.sect.stones -= 220;
  if (Math.random() > 0.5) state.sect.alchemyMats += 1;
  else state.sect.forgingMats += 1;
  log("市集完成一次急购，只获得 1 份通用丹材或器材；专用材料仍需探索机缘。", "good");
  closeModal();
  render();
}

function advanceYear() {
  if (!state.founded) return;
  if (state.multiplayer) {
    submitMultiplayerTurn();
    return;
  }
  resolveYearAdvance();
}

function submitMultiplayerTurn() {
  if (state.waitingForPlayers) return;
  if (state.roomConnected) {
    state.waitingForPlayers = true;
    markPlayerAction("已提交本年操作，等待全员", false);
    els.waitingOverlay.hidden = false;
    els.otherReadyDot.classList.remove("ready");
    els.waitingText.textContent = "已提交本年操作，等待房间内其他玩家完成。";
    log("本宗已提交联机回合，等待房间全员完成操作。");
    sendNet("ready", { player: { ...getPublicPlayerState(), ready: true } });
    updateButtons();
    render();
    return;
  }
  state.waitingForPlayers = true;
  els.waitingOverlay.hidden = false;
  els.otherReadyDot.classList.remove("ready");
  els.waitingText.textContent = state.forbiddenRun
    ? `你的宗门已准备进入下一年，另有玩家正在禁地探索，当前约第 ${state.forbiddenRun.floor}/20 层。`
    : "你的宗门已准备进入下一年，正在等待其他玩家完成本年操作。";
  log("本宗已提交回合，等待其他玩家完成操作。");
  updateButtons();
  setTimeout(() => {
    els.otherReadyDot.classList.add("ready");
    els.waitingText.textContent = state.forbiddenRun ? "禁地探索已同步，正在合并大世界结算。" : "其他玩家已完成操作，正在同步大世界结算。";
  }, 1300);
  setTimeout(() => {
    state.waitingForPlayers = false;
    els.waitingOverlay.hidden = true;
    resolveYearAdvance();
  }, 2600);
}

function resolveYearAdvance() {
  state.tick += 1;
  state.year += 1;
  state.seasonIndex = 0;
  const endingBoonKey = state.yearlyBoon?.key || "";
  if (state.councilEdict) {
    state.councilEdict.ttl -= 1;
    if (state.councilEdict.ttl <= 0) state.councilEdict = null;
  }

  const owned = state.resources.filter((r) => r.owner === "player");
  const mineIncome = owned.reduce((s, r) => s + resourceYield(r, "stones"), 0);
  const farmIncome = owned.reduce((s, r) => s + resourceYield(r, "grain"), 0);
  const alchemyIncome = owned.reduce((s, r) => s + resourceYield(r, "alchemyMats"), 0);
  const forgingIncome = owned.reduce((s, r) => s + resourceYield(r, "forgingMats"), 0);
  const arrayIncome = owned.reduce((s, r) => s + resourceYield(r, "arrayMats"), 0);
  const refineIncome = owned.reduce((s, r) => s + resourceYield(r, "refineStone"), 0);
  const lockIncome = owned.reduce((s, r) => s + resourceYield(r, "affixLock"), 0);
  const springBoost = owned.filter((r) => r.kind === "spring").reduce((s, r) => s + r.value, 0);
  const wealthBoost = (state.yearlyBoon?.key === "wealthBonus" ? 45 : 0) + state.sect.buildings.market * 28;
  const stoneIncome = Math.round((95 + wealthBoost + state.sect.resource * 1.35 + mineIncome * 1.75 + traitBonus("stones")) * stoneIncomeMultiplier());
  state.sect.stones += stoneIncome;
  state.sect.grain += Math.round(115 + state.sect.resource * 1.45 + farmIncome * 2.2);
  state.sect.alchemyMats += 2 + alchemyIncome;
  state.sect.forgingMats += 1 + forgingIncome;
  state.sect.arrayMats += arrayIncome;
  if (refineIncome) addItem("refineStone", refineIncome, 0);
  if (lockIncome) addItem("affixLock", lockIncome, 0);
  state.sect.insight += 10 + state.sect.buildings.scoutTower * 3 + Math.floor(state.sect.prestige / 180);
  state.sect.barrier = clamp(state.sect.barrier + Math.round(7 + traitBonus("barrier") / 16), 0, 100);
  state.worldCrisis = rollWorldCrisis();
  advanceWorldChainYear();
  applySectPositionAnnualEffects();
  applyReputationPathYearly();
  processDiscipleTravelYear();
  processDiscipleAssignmentsYear();
  processSectCrisisYear();
  maybeTriggerSectCrisis();
  maybeGrantLeagueRankingRewards();
  updateMarketPrices();
  refreshFrontierYear();

  for (const d of state.sect.disciples) {
    const fatiguePenalty = Math.min(12, (d.pillFatigue || 0) * 2);
    processDiscipleSeclusionYear(d);
    const baseGrowth = 5 + state.sect.aura / 26 + d.grow / 13 + d.aptitude / 52 + springBoost / 85 + state.sect.buildings.trainingHall * 2 + state.sect.buildings.spiritArray * 2 + Math.floor(elderBonus("train") / 3) - fatiguePenalty - Math.floor((d.mind || 0) / 18);
    d.exp += Math.round(baseGrowth * discipleCultivationGrowth(d));
    gainSpecializationExp(d, 5 + d.realm * 2 + Math.floor((d.activeMethods?.length || 0) * 1.5), "年度修行");
    refreshDiscipleTitles(d);
    if (d.exp >= 100 && d.realm < realms.length - 1) maybeAutoTribulation(d);
  }

  runAiTurns();
  processMindAndLegacy();
  processLifespanYear();
  maybeCreateYearlyBond();
  maybeTriggerDisciplePersonalEvent();

  if (Math.random() < 0.42) randomEvent();
  const worldAdventureDue = state.year >= state.nextWorldAdventureYear;
  if (!worldAdventureDue && Math.random() < 0.36) offerRogueChoice();
  if (!worldAdventureDue && Math.random() < 0.25) triggerWorldEvent();
  if (Math.random() < state.sect.risk / (state.councilEdict?.key === "peace" || state.yearlyBoon?.key === "peaceOmen" ? 700 : 400)) rivalHarass();
  refreshEvents();
  const targetOpportunityCount = clamp(8 + Math.floor(state.year / 4) + state.sect.buildings.scoutTower, 8, 15);
  if (state.events.length < targetOpportunityCount) addOpportunityNodes(targetOpportunityCount - state.events.length, "year");
  state.yearlyBoon = null;
  log(`进入太初 ${state.year} 年。年度行动点已恢复，新的候选弟子已经到达山门。`, "good");
  const nextYearStep = () => {
    runYearStartEvents(endingBoonKey);
  };
  if (state.aiReports.length) {
    showAiReportModal(nextYearStep);
  } else {
    nextYearStep();
  }
  markPlayerAction(`太初 ${state.year} 年操作中`, false);
  if (state.multiplayer && state.roomConnected) syncPublicState();
  render();
}

function showAiReportModal(afterClose = null) {
  const reports = state.aiReports.slice();
  const directImpact = reports.flatMap((r) => r.items).filter((item) => item.tone === "danger" || item.text.includes("本宗"));
  const body = `
    <div class="ai-report-summary">
      <div><span>活跃宗门</span><strong>${reports.length}</strong></div>
      <div><span>直接影响</span><strong>${directImpact.length}</strong></div>
      <div><span>剩余资源点</span><strong>${state.resources.filter((r) => r.owner === "player").length}/${state.resources.length}</strong></div>
    </div>
    <div class="ai-report-list">
      ${reports.slice(0, 8).map((report) => `
        <article class="ai-report-card">
          <div class="ai-report-head">
            <strong>${report.sect}</strong>
            <span>战力 ${report.power} · 底蕴 ${report.foundation} · 关系 ${report.attitude}</span>
          </div>
          ${report.items.map((item) => `<p class="${item.tone}">${item.text}</p>`).join("")}
        </article>
      `).join("")}
    </div>
  `;
  const proceed = () => {
    state.aiReports = [];
    closeModal();
    if (typeof afterClose === "function") afterClose();
  };
  showModal({
    kicker: "AI 年度行动",
    title: `太初 ${state.year - 1} 年诸宗动向`,
    body,
    actions: [{ label: "继续", handler: proceed }],
  });
  els.modalCloseBtn.onclick = proceed;
}

function maybeStartWorldAdventure(afterClose) {
  if (!state.founded || state.year < state.nextWorldAdventureYear || state.sect.disciples.length === 0) return false;
  if (state.multiplayer && state.roomConnected) {
    state.pendingAdventureAfterClose = afterClose;
    if (!state.roomHost) {
      const continueQueue = () => continuePendingYearEvent("adventure", afterClose);
      showModal({
        kicker: "世界奇遇",
        title: "等待房主同步奇遇",
        body: `<p>联机模式下世界奇遇由房主统一生成，保证所有玩家同一年、同主题、同排行。</p>`,
        actions: [{ label: "先继续年度结算", handler: continueQueue }],
      });
      els.modalCloseBtn.onclick = continueQueue;
      return true;
    }
    const setup = createRoomWorldAdventureSetup();
    if (state.roomWorldAdventureId === setup.id) return false;
    state.roomWorldAdventureId = setup.id;
    state.nextWorldAdventureYear = setup.nextYear;
    sendRoomFeature("world_adventure_open", { adventure: setup });
    showWorldAdventurePicker(afterClose, setup);
    return true;
  }
  state.nextWorldAdventureYear = state.year + rand(4, 7);
  showWorldAdventurePicker(afterClose);
  return true;
}

function onceYearEventCallback(fn) {
  let called = false;
  return (...args) => {
    if (called) return;
    called = true;
    if (typeof fn === "function") fn(...args);
  };
}

function continuePendingYearEvent(kind, fallback = null) {
  const pendingMap = {
    adventure: "pendingAdventureAfterClose",
    auction: "pendingAuctionAfterClose",
    council: "pendingCouncilAfterClose",
    tournament: "pendingTournamentAfterClose",
  };
  const prop = pendingMap[kind];
  const next = prop ? state[prop] || fallback : fallback;
  if (prop) state[prop] = null;
  if (kind === "auction" && state.roomAuction) state.roomAuction.afterClose = null;
  if (kind === "adventure" && state.worldAdventure) state.worldAdventure.afterClose = null;
  closeModal();
  next?.();
  render();
}

function runYearStartEvents(endingBoonKey = "") {
  const queue = [
    { check: () => state.year >= state.nextWorldAdventureYear, run: (next) => { if (!maybeStartWorldAdventure(next)) next(); } },
    { check: () => state.year % 10 === 0 && state.lastTournamentYear !== state.year, run: (next) => openTournamentPicker(true, next) },
    { check: () => shouldOpenCouncilMeeting(endingBoonKey), run: (next) => openCouncilMeeting(next) },
    { check: () => shouldOpenAuction(endingBoonKey), run: (next) => openAuction(next, endingBoonKey) },
    { check: () => shouldOpenWanderingMerchant(), run: (next) => openWanderingMerchant(next) },
  ];
  runEventQueue(queue, () => finishYearStartEvents());
}

function finishYearStartEvents() {
  state.pendingAdventureAfterClose = null;
  state.pendingAuctionAfterClose = null;
  state.pendingCouncilAfterClose = null;
  state.pendingTournamentAfterClose = null;
  offerYearlyBoons(true);
  scheduleYearlyBoonRecovery();
}

function runEventQueue(queue, done, index = 0) {
  if (index >= queue.length) {
    done?.();
    return;
  }
  const item = queue[index];
  const next = onceYearEventCallback(() => runEventQueue(queue, done, index + 1));
  try {
    if (item.check()) item.run(next);
    else next();
  } catch (error) {
    console.error("year event queue failed", error);
    next();
  }
}

function shouldOpenCouncilMeeting(endingBoonKey = "") {
  if (!state.founded || state.year < 3) return false;
  const interval = endingBoonKey === "councilFavor" ? 3 : 5;
  if (state.year - state.lastCouncilYear >= interval) return true;
  return endingBoonKey === "councilFavor" && Math.random() < 0.28;
}

function shouldOpenAuction(endingBoonKey = "") {
  if (!state.founded || state.year < 2) return false;
  const interval = endingBoonKey === "auctionBonus" ? 2 : 3;
  if (state.year - state.lastAuctionYear >= interval) return true;
  return endingBoonKey === "auctionBonus" && Math.random() < 0.48;
}

function shouldOpenWanderingMerchant() {
  if (!state.founded || state.year < 3 || state.lastMerchantYear === state.year) return false;
  if (state.year - state.lastMerchantYear >= 5) return true;
  return Math.random() < 0.22;
}

function merchantGoodsForYear() {
  const goods = [];
  const pools = [
    ...["qiPill", "marrowPill", "heartLotus", "tribPill", "minorHealPill", "midHealPill"],
    ...methodItemIds,
    ...equipmentItemIds,
    "refineStone",
    "affixLock",
  ];
  const count = 5 + Math.min(3, Math.floor(state.year / 12));
  for (let i = 0; i < count; i += 1) {
    const id = pick(pools);
    const item = itemCatalog[id];
    const quality = item?.material ? 0 : clamp(Math.floor(Math.random() * 5) - (Math.random() < 0.55 ? 1 : 0), 0, 4);
    const price = Math.round((item?.equipment ? 360 : methodCatalog[id] ? 300 : item?.material ? 120 : 180) * (1 + quality * 0.55) * (0.9 + Math.random() * 0.35));
    goods.push({ id, quality, price, stock: item?.material ? rand(1, 3) : 1 });
  }
  return goods;
}

function openWanderingMerchant(afterClose = null) {
  state.lastMerchantYear = state.year;
  const goods = merchantGoodsForYear();
  showModal({
    kicker: "流浪商人",
    title: "云游仙商到访山门",
    body: `
      <p>流浪商人不消耗行动点。联机模式下所有玩家同年遇到商人，但货架各不相同。</p>
      <p>当前灵石：<strong>${Math.round(state.sect.stones)}</strong></p>
      <div class="system-grid">
        ${goods.map((good, index) => {
          const item = itemCatalog[good.id];
          const label = item.material ? item.name : `${gearTierName(good.quality)}${item.name}`;
          return `<article class="system-card"><strong>${label}</strong><span>${item.kind} · ${item.text}</span><em>${good.price} 灵石 / 库存 ${good.stock}</em><button class="merchant-buy" data-index="${index}" ${state.sect.stones < good.price ? "disabled" : ""}>购买</button></article>`;
        }).join("")}
      </div>
    `,
    actions: [{ label: "离开", handler: () => { closeModal(); afterClose?.(); render(); } }],
  });
  els.modalCloseBtn.onclick = () => { closeModal(); afterClose?.(); render(); };
  els.modalBody.querySelectorAll(".merchant-buy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const good = goods[Number(btn.dataset.index)];
      if (!good || good.stock <= 0 || state.sect.stones < good.price) return;
      state.sect.stones -= good.price;
      good.stock -= 1;
      addItem(good.id, 1, good.quality);
      log(`从流浪商人处购得${itemCatalog[good.id].material ? "" : gearTierName(good.quality)}${itemCatalog[good.id].name}。`, "good");
      btn.disabled = true;
      syncPublicState();
      render();
    });
  });
}

function openCouncilMeeting(afterClose = null) {
  if (state.multiplayer && state.roomConnected) {
    state.pendingCouncilAfterClose = afterClose;
    state.lastCouncilYear = state.year;
    if (state.roomCouncil?.year === state.year) {
      // Continue into the shared ballot below.
    } else if (state.roomHost) {
      state.roomCouncil = createRoomCouncilState();
      sendRoomFeature("council_open", { council: state.roomCouncil });
    } else {
      const continueQueue = () => continuePendingYearEvent("council", afterClose);
      showModal({
        kicker: "仙盟会议",
        title: "等待房主召集议题",
        body: `<p>本年仙盟会议由房主统一生成议题。议题同步后，所有玩家会看到相同投票选项。</p>`,
        actions: [{ label: "先继续年度结算", handler: continueQueue }],
      });
      els.modalCloseBtn.onclick = continueQueue;
      return;
    }
  }
  state.lastCouncilYear = state.year;
  let topics = state.roomCouncil?.year === state.year && Array.isArray(state.roomCouncil.topics)
    ? state.roomCouncil.topics
    : councilTopics
    .map((topic) => ({ topic, roll: Math.random() }))
    .sort((a, b) => a.roll - b.roll)
    .slice(0, 3)
    .map((item) => item.topic);
  if (state.multiplayer && state.roomConnected && !state.roomCouncil) {
    state.roomCouncil = { year: state.year, topics, votes: {} };
    if (state.roomHost) sendRoomFeature("council_open", { council: state.roomCouncil });
  }
  const current = state.councilEdict ? `当前仙盟议题：${state.councilEdict.name}，剩余 ${state.councilEdict.ttl} 年。` : "当前没有持续中的仙盟议题。";
  showModal({
    kicker: "仙盟会议",
    title: `太初 ${state.year} 年仙盟议事`,
    body: `
      <p>${current}</p>
      <p>仙盟会议会改变未来数年的世界规则。选择议题不消耗行动点，但会影响诸宗态度、资源点争夺、市集波动和机缘刷新。</p>
      <div class="system-grid">
        ${topics.map((topic) => `<article class="system-card"><strong>${topic.name}</strong><span>${topic.text}</span></article>`).join("")}
      </div>
    `,
    actions: topics.map((topic) => ({
      label: `支持${topic.name}`,
      handler: () => resolveCouncilTopic(topic, afterClose, topics),
    })).concat([{ label: "旁听离席", handler: () => { state.sect.insight += 12; log("本宗旁听仙盟会议，参悟 +12。"); closeModal(); afterClose?.(); render(); } }]),
  });
  els.modalCloseBtn.onclick = () => { closeModal(); afterClose?.(); render(); };
}

function resolveCouncilTopic(topic, afterClose = null, ballot = [topic], forceLocal = false) {
  if (state.multiplayer && state.roomConnected && !forceLocal) {
    state.roomCouncil = state.roomCouncil || { year: state.year, topics: ballot, votes: {} };
    state.roomCouncil.votes = state.roomCouncil.votes || {};
    state.roomCouncil.votes[state.clientId] = topic.key;
    sendRoomFeature("council_vote", { vote: topic.key });
    log(`已提交仙盟会议投票：支持《${topic.name}》。等待房间统一结算。`, "good");
    maybeFinalizeRoomCouncil();
    showModal({
      kicker: "仙盟会议",
      title: "等待房间投票",
      body: `<p>你的投票已提交。房主会在已立宗玩家完成投票后统一结算，本次议题会同步到所有玩家。</p>`,
      actions: [{ label: "先继续年度结算", handler: () => continuePendingYearEvent("council", afterClose) }],
    });
    els.modalCloseBtn.onclick = () => continuePendingYearEvent("council", afterClose);
    render();
    return;
  }
  const voteCounts = Object.fromEntries(ballot.map((item) => [item.key, { topic: item, votes: 0, names: [] }]));
  const playerVotes = 2 + Math.floor((state.sect.diplomacy?.reputation || 0) / 35) + (state.selectedRoute === "orthodox" ? 1 : 0);
  voteCounts[topic.key].votes += playerVotes;
  voteCounts[topic.key].names.push(`${state.sect.name} ${playerVotes}票`);
  for (const rival of activeRivals()) {
    let choice = pick(ballot);
    if (rival.attitude > 45 && Math.random() < 0.55) choice = topic;
    if (rival.attitude < -35 && Math.random() < 0.45) choice = pick(ballot.filter((item) => item.key !== topic.key) || ballot);
    const votes = 1 + (rival.power > sectPower() ? 1 : 0) + (rival.alliance ? 1 : 0);
    voteCounts[choice.key].votes += votes;
    voteCounts[choice.key].names.push(`${rival.name} ${votes}票`);
  }
  const passed = Object.values(voteCounts).sort((a, b) => b.votes - a.votes || Math.random() - 0.5)[0];
  topic = passed.topic;
  state.councilEdict = { key: topic.key, name: topic.name, text: topic.text, ttl: 3 };
  const dip = state.sect.diplomacy || { reputation: 20, infamy: 0 };
  if (topic.key === "peace") {
    activeRivals().forEach((r) => { r.attitude += rand(2, 6); });
    dip.reputation += 6;
    dip.infamy = Math.max(0, dip.infamy - 5);
  }
  if (topic.key === "relic") {
    addOpportunityNodes(5, "council");
    state.nextWorldAdventureYear = Math.min(state.nextWorldAdventureYear, state.year + rand(2, 4));
    state.sect.prestige += 20;
  }
  if (topic.key === "trade") {
    updateMarketPrices();
    state.sect.stones += Math.round(80 * tradeBonusMultiplier());
  }
  if (topic.key === "frontier") {
    for (const r of state.resources.filter((res) => res.owner === "player")) {
      r.upgrades = r.upgrades || { outpost: 0, arrayEye: 0, extractor: 0, depot: 0 };
      if (r.upgrades.outpost < 3) r.upgrades.outpost += 1;
    }
    state.sect.arrayMats += 1;
  }
  if (topic.key === "crusade") {
    const target = activeRivals().sort((a, b) => b.power - a.power)[0];
    if (target) {
      target.power = Math.max(80, target.power - rand(120, 260));
      target.foundation = Math.max(0, (target.foundation || 100) - rand(18, 38));
      target.attitude -= 18;
      dip.reputation += 10;
      dip.infamy += 4;
    }
  }
  state.sect.diplomacy = dip;
  log(`仙盟通过《${topic.name}》：${topic.text}`, "good");
  showCouncilResultModal(topic, voteCounts, afterClose);
  render();
}

function maybeFinalizeRoomCouncil() {
  if (!state.roomHost || !state.roomCouncil || state.roomCouncil.year !== state.year) return;
  const voters = foundedRoomPlayers().map((player) => player.id);
  const votes = state.roomCouncil.votes || {};
  if (voters.length && voters.some((id) => !votes[id])) return;
  const topics = state.roomCouncil.topics || councilTopics.slice(0, 3);
  const tally = topics.map((topic) => ({
    topic,
    votes: Object.values(votes).filter((key) => key === topic.key).length,
  })).sort((a, b) => b.votes - a.votes || Math.random() - 0.5)[0];
  const winner = tally?.topic || topics[0];
  resolveCouncilTopic(winner, null, topics, true);
  sendRoomFeature("council_result", { result: { year: state.year, edict: state.councilEdict } });
  state.roomCouncil = null;
}

function showCouncilResultModal(topic, voteCounts, afterClose = null) {
  const rows = Object.values(voteCounts)
    .sort((a, b) => b.votes - a.votes)
    .map((row) => `<article class="system-card ${row.topic.key === topic.key ? "is-winner" : ""}">
      <strong>${row.topic.name}：${row.votes} 票</strong>
      <span>${row.names.slice(0, 4).join("、")}${row.names.length > 4 ? " 等" : ""}</span>
    </article>`).join("");
  showModal({
    kicker: "仙盟票决",
    title: `《${topic.name}》通过`,
    body: `
      <p>仙盟会议已完成投票。票数会受到本宗声誉、路线、盟友关系和各宗实力影响。</p>
      <div class="system-grid">${rows}</div>
      <p>最终结果：${topic.text}</p>
    `,
    actions: [{ label: "继续", handler: () => { closeModal(); afterClose?.(); render(); } }],
  });
  els.modalCloseBtn.onclick = () => { closeModal(); afterClose?.(); render(); };
}

function openAuction(afterClose = null, endingBoonKey = "") {
  if (state.multiplayer && state.roomConnected) {
    state.pendingAuctionAfterClose = afterClose;
    state.lastAuctionYear = state.year;
    if (state.roomAuction?.year === state.year) {
      state.roomAuction.afterClose = afterClose;
      showInteractiveAuctionRound();
      return;
    }
    if (state.roomHost) {
      state.roomAuction = createRoomAuctionState(afterClose, endingBoonKey);
      sendRoomFeature("auction_open", { auction: { ...state.roomAuction, afterClose: null } });
      sendNet("player_event", { text: `${state.sect.name}开启了联机拍卖：${state.roomAuction.lot.name}。`, tone: "good" });
      showInteractiveAuctionRound();
      return;
    }
    const continueQueue = () => continuePendingYearEvent("auction", afterClose);
    showModal({
      kicker: "联机拍卖",
      title: "等待房主开拍",
      body: `<p>本年拍卖由房主统一生成拍品和轮次。房主开拍后，所有玩家会进入同一个竞价弹框。</p>`,
      actions: [{ label: "先继续年度结算", handler: continueQueue }],
    });
    els.modalCloseBtn.onclick = continueQueue;
    return;
  }
  state.lastAuctionYear = state.year;
  const lots = auctionLotCatalog
    .map((lot) => {
      const discount = endingBoonKey === "auctionBonus" ? 0.84 : 1;
      const price = Math.round(lot.base * discount * (0.88 + Math.random() * 0.26));
      return { ...lot, price };
    })
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  showModal({
    kicker: "山门拍卖会",
    title: `太初 ${state.year} 年流云拍卖`,
    body: `
      <p>拍卖会不消耗行动点，但只能拍下一件。灵石不足时不要硬追价，后续建设、炼制和防守都会吃灵石。</p>
      <p>当前灵石：<strong>${Math.round(state.sect.stones)}</strong></p>
      <div class="system-grid">
        ${lots.map((lot) => `<article class="system-card"><strong>${lot.name}</strong><span>${lot.text}</span><em>起拍价 ${lot.price} 灵石</em></article>`).join("")}
      </div>
    `,
    actions: lots.map((lot) => ({
      label: `参与竞拍${lot.name} ${lot.price}`,
      disabled: state.sect.stones < lot.price,
      handler: () => startInteractiveAuctionBid(lot, afterClose),
    })).concat([{ label: "空手离场", handler: () => { log("本宗没有在拍卖会上出价。"); closeModal(); afterClose?.(); render(); } }]),
  });
  els.modalCloseBtn.onclick = () => { closeModal(); afterClose?.(); render(); };
}

function startInteractiveAuctionBid(lot, afterClose = null) {
  state.roomAuction = {
    lot: { ...lot },
    currentPrice: lot.price,
    leaderId: null,
    leaderName: "",
    round: 1,
    passed: {},
    history: [],
    afterClose,
  };
  if (state.multiplayer && state.roomConnected) {
    sendRoomFeature("auction_open", { auction: state.roomAuction });
    sendNet("player_event", { text: `${state.sect.name}开启了联机拍卖竞价：${lot.name}。`, tone: "good" });
  }
  showInteractiveAuctionRound();
}

function showInteractiveAuctionRound() {
  const auction = state.roomAuction;
  if (!auction?.lot) return;
  const lot = auction.lot;
  const nextBid = auction.currentPrice + 40 + auction.round * 18;
  const activePlayers = foundedRoomPlayers();
  const passedCount = Object.keys(auction.passed || {}).length;
  const history = auction.history.slice(-8).map((row) => `<p><strong>${row.name}</strong> 出价 ${row.price} 灵石</p>`).join("") || "<p>竞价刚刚开始。</p>";
  showModal({
    kicker: "多轮拍卖",
    title: `${lot.name}｜第 ${auction.round} 轮`,
    body: `
      <div class="auction-stage">
        <div class="auction-gavel">槌</div>
        <div class="auction-lot"><strong>${lot.name}</strong><span>${lot.text}</span></div>
      </div>
      <div class="auction-feed">${history}</div>
      <p>当前最高价：<strong>${auction.currentPrice}</strong> 灵石，领先：<strong>${auction.leaderName || "无人"}</strong>。联机参与 ${activePlayers.length || 1} 宗，已放弃 ${passedCount} 宗。</p>
    `,
    actions: [
      { label: `加价到 ${nextBid}`, disabled: state.sect.stones < nextBid || auction.passed?.[state.clientId], handler: () => placeInteractiveAuctionBid(nextBid) },
      { label: "放弃本件", disabled: auction.passed?.[state.clientId], handler: () => passInteractiveAuction() },
      { label: "落槌结算", disabled: !auction.leaderName || (state.multiplayer && state.roomConnected && !state.roomHost), handler: () => closeInteractiveAuction() },
      { label: "先继续年度结算", disabled: !(state.multiplayer && state.roomConnected && auction.afterClose), handler: () => continuePendingYearEvent("auction", auction.afterClose) },
    ],
  });
  if (state.multiplayer && state.roomConnected && auction.afterClose) {
    els.modalCloseBtn.onclick = () => continuePendingYearEvent("auction", auction.afterClose);
  }
}

function placeInteractiveAuctionBid(price) {
  const auction = state.roomAuction;
  if (!auction) return;
  auction.currentPrice = price;
  auction.leaderId = state.clientId;
  auction.leaderName = state.sect.name;
  auction.round += 1;
  auction.history.push({ id: state.clientId, name: state.sect.name, price });
  runAiAuctionBids();
  if (state.multiplayer && state.roomConnected) sendRoomFeature("auction_bid", { bid: { price: auction.currentPrice, leaderName: auction.leaderName, round: auction.round } });
  showInteractiveAuctionRound();
}

function runAiAuctionBids() {
  const auction = state.roomAuction;
  if (!auction) return;
  for (const rival of activeRivals().slice(0, 4)) {
    const budget = Math.round((rival.stones || 300) * 0.45);
    const willBid = budget > auction.currentPrice + 35 && Math.random() < 0.35;
    if (!willBid) continue;
    const price = auction.currentPrice + rand(25, 75);
    auction.currentPrice = price;
    auction.leaderId = rival.id;
    auction.leaderName = rival.name;
    auction.history.push({ id: rival.id, name: rival.name, price });
  }
}

function passInteractiveAuction() {
  if (!state.roomAuction) return;
  state.roomAuction.passed[state.clientId] = true;
  if (state.multiplayer && state.roomConnected) sendRoomFeature("auction_pass", {});
  showInteractiveAuctionRound();
}

function closeInteractiveAuction() {
  const auction = state.roomAuction;
  if (!auction) return;
  const winner = { name: auction.leaderName, player: auction.leaderId === state.clientId, rival: activeRivals().find((r) => r.id === auction.leaderId) };
  const lot = { ...auction.lot, finalPrice: auction.currentPrice };
  state.roomAuction = null;
  if (state.multiplayer && state.roomConnected) sendRoomFeature("auction_result", { result: { lot, winnerName: winner.name, winnerId: auction.leaderId } });
  finalizeAuctionLot(lot, winner, auction.afterClose);
}

function startAuctionBid(lot, afterClose = null) {
  const bidders = [
    { name: state.sect.name, player: true, budget: Math.round(state.sect.stones), bid: lot.price },
    ...activeRivals().slice().sort(() => Math.random() - 0.5).slice(0, 4).map((r) => ({
      name: r.name,
      rival: r,
      budget: Math.round((r.stones || 300) * (0.55 + Math.random() * 0.55)),
      bid: Math.round(lot.price * (0.92 + Math.random() * 0.28)),
    })),
  ];
  const rounds = [];
  let current = lot.price;
  for (let round = 1; round <= rand(3, 5); round += 1) {
    const active = bidders.filter((b) => b.budget >= current + 20 && Math.random() > (b.player ? 0.12 : 0.22));
    if (!active.length) break;
    const bidder = pick(active);
    current += rand(28, 86) + round * 12;
    bidder.bid = current;
    rounds.push({ bidder: bidder.name, price: current });
  }
  const winner = bidders
    .filter((b) => b.bid <= b.budget)
    .sort((a, b) => b.bid - a.bid || (b.player ? 1 : 0) - (a.player ? 1 : 0))[0] || bidders[0];
  lot.finalPrice = Math.max(lot.price, winner.bid || lot.price);
  const logRows = rounds.length ? rounds.map((r, i) => `<p style="animation-delay:${i * 0.08}s"><strong>${r.bidder}</strong> 举牌到 ${r.price} 灵石</p>`).join("") : `<p><strong>${winner.name}</strong> 直接守住起拍价。</p>`;
  showModal({
    kicker: "实时竞拍",
    title: `${lot.name} 正在竞价`,
    body: `
      <div class="auction-stage">
        <div class="auction-gavel">槌</div>
        <div class="auction-lot"><strong>${lot.name}</strong><span>${lot.text}</span></div>
      </div>
      <div class="auction-feed">${logRows}</div>
      <p>最高有效出价：<strong>${winner.name}</strong>，${lot.finalPrice} 灵石。</p>
    `,
    actions: [
      { label: "敲槌成交", handler: () => finalizeAuctionLot(lot, winner, afterClose) },
      { label: "离场", handler: () => { closeModal(); afterClose?.(); render(); } },
    ],
  });
  els.modalCloseBtn.onclick = () => { closeModal(); afterClose?.(); render(); };
}

function finalizeAuctionLot(lot, winner, afterClose = null) {
  const playerWon = Boolean(winner.player);
  let finalized = false;
  const finish = () => {
    if (finalized) return;
    finalized = true;
    closeModal();
    if (playerWon) {
      buyAuctionLot({ ...lot, price: lot.finalPrice }, afterClose);
      return;
    }
    const rival = winner.rival;
    if (rival) {
      rival.stones = Math.max(0, (rival.stones || 0) - lot.finalPrice);
      rival.power += lot.recipe ? 90 : lot.item ? 120 : 60;
      if (lot.recipe) rival.alchemy = (rival.alchemy || 0) + 1;
    }
    log(`拍卖会落槌：${winner.name}以 ${lot.finalPrice} 灵石取得${lot.name}。`, "warn");
    afterClose?.();
    render();
  };
  showModal({
    kicker: "落槌",
    title: `${lot.name} 最终归属`,
    body: `
      <div class="auction-stage is-final">
        <div class="auction-gavel">咚</div>
        <div class="auction-lot"><strong>${winner.name}</strong><span>${playerWon ? "本宗拍得此物，立即结算入库或解锁。" : "其他宗门拍得此物，其底蕴会小幅增强。"}</span></div>
      </div>
      <p>成交价：<strong>${lot.finalPrice}</strong> 灵石。</p>
    `,
    actions: [{ label: "确认", handler: finish }],
  });
  els.modalCloseBtn.onclick = finish;
}

function buyAuctionLot(lot, afterClose = null) {
  if (state.sect.stones < lot.price) {
    log(`灵石不足，无法拍下${lot.name}。`, "warn");
    afterClose?.();
    render();
    return;
  }
  state.sect.stones -= lot.price;
  const rewards = [];
  if (lot.item) {
    addItem(lot.item, 1, lot.quality || 0);
    rewards.push(`${gearTierName(lot.quality || 0)}${itemCatalog[lot.item].name}`);
    if (lot.item === "swordManual") state.sect.insight += 35;
  }
  if (lot.recipe) {
    const unlocked = unlockAlchemyRecipe(lot.recipe);
    rewards.push(`${recipeDisplayName(lot.recipe)}${unlocked ? "解锁" : "已掌握，转化为参悟 +30"}`);
    if (!unlocked) state.sect.insight += 30;
  }
  if (lot.grant === "alchemy") {
    state.sect.alchemyMats += 2;
    rewards.push("通用丹材 +2");
    for (let i = 0; i < 4; i += 1) {
      const id = pick(alchemyMaterialIds);
      addItem(id, 1, rand(0, 1));
      rewards.push(itemCatalog[id].name);
    }
  }
  if (lot.grant === "forging") {
    for (let i = 0; i < 2; i += 1) {
      const id = pick(forgingMaterialIds);
      addItem(id, 1, rand(0, 1));
      rewards.push(itemCatalog[id].name);
    }
  }
  if (lot.grant === "array") {
    const gain = rand(2, 4);
    state.sect.arrayMats += gain;
    rewards.push(`阵材 +${gain}`);
  }
  if (lot.grant === "intel") {
    generateIntelReports(true);
    rewards.push("情报刷新");
  }
  log(`拍卖会成交：${lot.name}，花费 ${lot.price} 灵石，获得 ${rewards.join("、")}。`, "good");
  closeModal();
  afterClose?.();
  render();
}

function generateIntelReports(force = false) {
  ensureSectDefaults();
  const reports = [];
  const owned = state.resources.filter((r) => r.owner === "player");
  const hostile = activeRivals().filter((r) => r.attitude < 5).sort((a, b) => b.power - a.power);
  const weakPoint = owned
    .map((resource) => ({ resource, score: resource.value * 2 - resourceGarrisonPower(resource) + rand(-30, 30) }))
    .sort((a, b) => b.score - a.score)[0]?.resource;
  const strongest = activeRivals().sort((a, b) => rivalStrategicPower(b) - rivalStrategicPower(a))[0];
  const grudging = activeRivals().sort((a, b) => (b.grudges || 0) - (a.grudges || 0))[0];
  if (weakPoint) reports.push({ tone: "danger", title: "资源点风险", text: `${weakPoint.name}价值高且守备 ${Math.round(resourceGarrisonPower(weakPoint))}，敌宗最可能偷袭或夺点。` });
  if (hostile[0]) reports.push({ tone: "warn", title: "敌意宗门", text: `${hostile[0].name}态度 ${hostile[0].attitude}，战力 ${Math.round(hostile[0].power)}，需要留意夜袭。` });
  if (strongest) reports.push({ tone: "info", title: "强宗动向", text: `${strongest.name}综合底蕴最高，若玩家过强，它可能参与合围。` });
  if (grudging && (grudging.grudges || 0) > 0) reports.push({ tone: "warn", title: "旧怨未消", text: `${grudging.name}宿怨 ${grudging.grudges || 0}，暗线破坏失败或多次掠夺会继续加深。` });
  if (state.market?.goods) {
    const hot = marketGoods
      .map((g) => ({ g, data: state.market.goods[g.id] }))
      .filter((x) => x.data)
      .sort((a, b) => Math.abs(b.data.momentum || 0) - Math.abs(a.data.momentum || 0))[0];
    if (hot) reports.push({ tone: "info", title: "市集风向", text: `${hot.g.name}动量 ${hot.data.momentum >= 0 ? "+" : ""}${hot.data.momentum}，短期波动可能放大。` });
  }
  reports.push({ tone: "good", title: "奇遇预兆", text: `下一次世界奇遇预计不晚于太初 ${state.nextWorldAdventureYear} 年，观星楼越高普通机缘越密集。` });
  state.intelReports = reports.slice(0, force ? 7 : 5);
  return state.intelReports;
}

function stableHash(text = "") {
  let hash = 2166136261;
  for (let i = 0; i < String(text).length; i += 1) {
    hash ^= String(text).charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableRange(seed, min, max) {
  const span = Math.max(1, max - min + 1);
  return min + (stableHash(seed) % span);
}

function createRoomAuctionState(afterClose = null, endingBoonKey = "") {
  const base = `${state.roomCode || "solo"}:${state.year}:auction`;
  const discount = endingBoonKey === "auctionBonus" ? 0.84 : 1;
  const lotIndex = stableHash(base) % auctionLotCatalog.length;
  const rawLot = auctionLotCatalog[lotIndex];
  const lot = {
    ...rawLot,
    price: Math.round(rawLot.base * discount * (0.9 + stableRange(`${base}:price`, 0, 24) / 100)),
  };
  return {
    id: `${state.roomCode || "ROOM"}-${state.year}-auction-${lotIndex}`,
    year: state.year,
    lot,
    currentPrice: lot.price,
    leaderId: null,
    leaderName: "",
    round: 1,
    passed: {},
    history: [],
    afterClose,
  };
}

function createRoomCouncilState() {
  const base = `${state.roomCode || "solo"}:${state.year}:council`;
  const topics = councilTopics
    .map((topic, index) => ({ topic, roll: stableHash(`${base}:${index}:${topic.key}`) }))
    .sort((a, b) => a.roll - b.roll)
    .slice(0, 3)
    .map((item) => item.topic);
  return { year: state.year, topics, votes: {}, resolved: false };
}

function createRoomWorldAdventureSetup() {
  const base = `${state.roomCode || "solo"}:${state.year}:world-adventure`;
  const themeIndex = stableHash(base) % worldAdventureThemes.length;
  const theme = worldAdventureThemes[themeIndex];
  const aiTeams = activeRivals().slice(0, 8).map((r, index) => ({
    sect: r.name,
    disciple: `${r.name.replace("遗址·", "").slice(0, 1)}门${stableRange(`${base}:disciple:${index}`, 1, 9)}`,
    score: Math.round(r.power * 0.28 + r.disciples * 20 + stableRange(`${base}:score:${r.id || r.name}`, 80, 260)),
  }));
  return {
    id: `${state.roomCode || "ROOM"}-${state.year}-${themeIndex}`,
    year: state.year,
    nextYear: state.year + stableRange(`${base}:next`, 4, 7),
    themeIndex,
    theme,
    aiTeams,
  };
}

function normalizeRoomWorldAdventureSetup(adventure) {
  if (!adventure) return null;
  const themeIndex = Number(adventure.themeIndex || 0);
  return {
    ...adventure,
    themeIndex,
    theme: worldAdventureThemes[themeIndex] || adventure.theme || worldAdventureThemes[0],
    aiTeams: Array.isArray(adventure.aiTeams) ? adventure.aiTeams : [],
  };
}

function openIntelBoard(skipCost = false) {
  if (!state.founded) return;
  const freeByBoon = state.yearlyBoon?.key === "intelBonus";
  const free = skipCost || freeByBoon;
  if (state.sect.buildings.scoutTower < 1 && !free) {
    log("需要先建设观星楼，才能稳定启用情报系统。", "warn");
    return;
  }
  if (!free && !spendAction(1, "情报研判")) return;
  const reports = generateIntelReports();
  showModal({
    kicker: "情报系统",
    title: "影网研判",
    body: `
      <p>${freeByBoon ? "本年天命强化影网，本次情报不消耗行动点。" : skipCost ? "影网行动后刷新情报，不额外消耗行动点。" : "情报研判消耗 1 点行动。观星楼越高，AI 偷袭越容易被提前看穿。"}</p>
      <div class="ai-report-list">
        ${reports.map((report) => `<article class="ai-report-card"><div class="ai-report-head"><strong>${report.title}</strong><span>${report.tone}</span></div><p class="${report.tone}">${report.text}</p></article>`).join("")}
      </div>
    `,
    actions: [
      { label: "安插暗线", handler: runSpyOperation, disabled: state.actionPoints < 1 },
      { label: "反谍清查", handler: runCounterSpy, disabled: state.actionPoints < 1 },
      { label: "仙盟榜单", handler: openLeagueRankingBoard },
      { label: "收起情报", handler: closeModal },
    ],
  });
  render();
}

function spyPositionBonus() {
  const holderId = state.sect?.positions?.spymaster;
  const d = holderId ? state.sect.disciples.find((item) => item.id === holderId) : null;
  return d ? 12 + Math.floor((d.speed + d.luck) / 18) : 0;
}

function runSpyOperation() {
  if (!spendAction(1, "安插暗线")) return;
  const target = activeRivals().sort((a, b) => rivalStrategicPower(b) - rivalStrategicPower(a))[0];
  if (!target) {
    state.actionPoints += 1;
    return;
  }
  const score = (state.sect.spyNetwork || 0) + spyPositionBonus() + state.sect.buildings.scoutTower * 18 + rand(1, 100);
  const threshold = 82 + Math.floor((target.foundation || 80) / 6);
  if (score >= threshold) {
    state.sect.spyNetwork = clamp((state.sect.spyNetwork || 0) + rand(5, 12), 0, 100);
    target.foundation = Math.max(0, (target.foundation || 100) - rand(4, 10));
    state.intelReports.unshift({ tone: "good", title: "暗线成功", text: `${target.name}底蕴、库存和动向已被影网摸清，后续争夺更容易判断。` });
    log(`暗线潜入${target.name}成功，影网经验上涨。`, "good");
  } else {
    state.sect.spyNetwork = Math.max(0, (state.sect.spyNetwork || 0) - rand(3, 9));
    target.attitude -= 8;
    state.sect.diplomacy.infamy += 3;
    log(`暗线在${target.name}附近暴露，关系恶化。`, "warn");
  }
  syncSharedWorld();
  openIntelBoard(true);
  render();
}

function runCounterSpy() {
  if (!spendAction(1, "反谍清查")) return;
  const gain = 8 + state.sect.buildings.scoutTower * 5 + spyPositionBonus();
  state.sect.spyNetwork = clamp((state.sect.spyNetwork || 0) + gain, 0, 100);
  state.sect.barrier = clamp(state.sect.barrier + 4 + Math.floor(gain / 12), 0, 100);
  state.sect.diplomacy.reputation += 2;
  log(`反谍清查完成，影网 +${gain}，护山稳定度提高。`, "good");
  openIntelBoard(true);
  render();
}

function showWorldAdventurePicker(afterClose, setup = null) {
  const theme = setup?.theme || pick(worldAdventureThemes);
  const aiTeams = setup?.aiTeams || activeRivals().slice(0, 8).map((r) => ({
    sect: r.name,
    disciple: `${r.name.replace("遗址·", "").slice(0, 1)}门${rand(1, 9)}`,
    score: Math.round(r.power * 0.28 + r.disciples * 20 + rand(80, 260)),
  }));
  showModal({
    kicker: "世界奇遇",
    title: `${theme.name}开启`,
    body: `
      <div class="world-adventure-intro">
        <p>${theme.tone}</p>
        <p>仙盟传讯：${theme.place}短暂显世，诸宗各派一名弟子入内。此行共二十轮抉择，选择会积累善念、贪念、血债、情报与危险。中途可能死亡，死亡后弟子不会复活。</p>
        <div class="ai-report-summary">
          <div><span>参与宗门</span><strong>${aiTeams.length + 1}</strong></div>
          <div><span>旅程长度</span><strong>${worldAdventureStages.length}</strong></div>
          <div><span>下次奇遇</span><strong>${state.nextWorldAdventureYear}年后前</strong></div>
        </div>
      </div>
      <div class="adventure-roster">
        ${state.sect.disciples
          .slice()
          .sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0) || discipleBattleScore(b) - discipleBattleScore(a))
          .map((d) => `
            <article class="adventure-candidate ${d.core ? "is-core" : ""}">
              <div><strong>${d.core ? "核心·" : ""}${d.name}</strong><span>${realms[d.realm]} · 体${d.hp} 攻${d.atk} 御${d.def} 速${d.speed} 资${d.aptitude} 心${d.temper} 运${d.luck}</span></div>
              <button class="adventure-pick" data-id="${d.id}">派遣</button>
            </article>
          `).join("")}
      </div>
    `,
    actions: [{ label: "本次不参与", handler: () => { log(`本宗放弃${theme.name}，诸宗弟子自行入界。`, "warn"); continuePendingYearEvent("adventure", afterClose); } }],
  });
  els.modalCloseBtn.onclick = () => {
    log(`本宗放弃${theme.name}，诸宗弟子自行入界。`, "warn");
    continuePendingYearEvent("adventure", afterClose);
  };
  for (const btn of els.modalBody.querySelectorAll(".adventure-pick")) {
    btn.addEventListener("click", () => {
      const disciple = state.sect.disciples.find((d) => d.id === btn.dataset.id);
      if (!disciple) return;
      flashFeedback(`世界奇遇已派遣：${disciple.core ? "核心·" : ""}${disciple.name}`);
      if (state.multiplayer && alliedRemotePlayers().length) showCoopAdventureChoice(theme, disciple, aiTeams, afterClose);
      else startWorldAdventure(theme, disciple, aiTeams, afterClose);
    });
  }
}

function showCoopAdventureChoice(theme, disciple, aiTeams, afterClose) {
  const allies = alliedRemotePlayers();
  showModal({
    kicker: "协作奇遇",
    title: `${theme.name}：是否邀请盟友`,
    body: `
      <p>已结盟玩家可共同探索世界奇遇。参与人数越多，事件阈值会小幅提高，但队友可以通过“护持盟友降险”降低危险值，并在弹框内同步状态。</p>
      <div class="system-grid">
        ${allies.map((player) => `<article class="system-card"><strong>${player.name}</strong><span>战力 ${Math.round(player.power || 0)}，弟子 ${player.disciples || 0}，最高境界 ${realms[player.maxRealm || 0]}</span></article>`).join("")}
      </div>
    `,
    actions: [
      { label: "邀请盟友共同探索", handler: () => {
        const lobby = createAdventureLobby(theme, disciple, aiTeams, allies);
        state.roomAdventureLobby = lobby;
        state.pendingAdventureAfterClose = afterClose;
        sendRoomFeature("adventure_lobby_open", { lobby });
        closeModal();
        showAdventureLobbyModal(lobby, afterClose);
      } },
      { label: "本宗单独探索", handler: () => { closeModal(); startWorldAdventure(theme, disciple, aiTeams, afterClose); } },
    ],
  });
  els.modalCloseBtn.onclick = () => {
    log(`本宗放弃${theme.name}协作邀请。`, "warn");
    continuePendingYearEvent("adventure", afterClose);
  };
}

function adventureThemeIndex(theme) {
  return Math.max(0, worldAdventureThemes.findIndex((item) => item.name === theme?.name));
}

function publicAdventureParticipant(disciple) {
  return {
    id: state.clientId,
    playerId: state.clientId,
    name: state.sect.name,
    playerName: state.sect.name,
    discipleId: disciple.id,
    disciple: disciple.name,
    realm: disciple.realm,
    hp: disciple.hp,
    danger: 0,
    step: 0,
    ready: true,
  };
}

function createAdventureLobby(theme, disciple, aiTeams, allies = []) {
  const themeIndex = adventureThemeIndex(theme);
  const expectedIds = [state.clientId, ...allies.map((player) => player.id)].filter(Boolean);
  const participants = {};
  participants[state.clientId] = publicAdventureParticipant(disciple);
  return {
    id: `${state.roomCode || "solo"}-${state.year}-adventure-lobby-${themeIndex}`,
    year: state.year,
    hostId: state.clientId,
    hostName: state.sect.name,
    themeIndex,
    aiTeams,
    expectedIds,
    expectedNames: Object.fromEntries([[state.clientId, state.sect.name], ...allies.map((player) => [player.id, player.name])]),
    participants,
    declined: {},
    started: false,
  };
}

function normalizeAdventureLobby(lobby) {
  if (!lobby) return null;
  const themeIndex = Number(lobby.themeIndex || 0);
  return {
    ...lobby,
    themeIndex,
    theme: worldAdventureThemes[themeIndex] || worldAdventureThemes[0],
    aiTeams: Array.isArray(lobby.aiTeams) ? lobby.aiTeams : [],
    expectedIds: Array.isArray(lobby.expectedIds) ? lobby.expectedIds : [],
    expectedNames: lobby.expectedNames || {},
    participants: lobby.participants || {},
    declined: lobby.declined || {},
  };
}

function showAdventureLobbyModal(lobby, afterClose = null) {
  const data = normalizeAdventureLobby(lobby);
  if (!data) return;
  state.roomAdventureLobby = data;
  const expected = data.expectedIds.length ? data.expectedIds : Object.keys(data.participants || {});
  const rows = expected.map((id) => {
    const p = data.participants?.[id];
    const declined = data.declined?.[id];
    const name = p?.name || data.expectedNames?.[id] || "盟友宗门";
    const status = p?.ready ? `已准备：${p.disciple}` : declined ? "已婉拒" : "等待选择弟子";
    return `<article class="system-card ${p?.ready ? "is-winner" : ""}"><strong>${tradeEscape(name)}</strong><span>${tradeEscape(status)}</span></article>`;
  }).join("");
  const allResponded = expected.every((id) => data.participants?.[id]?.ready || data.declined?.[id]);
  const readyCount = Object.values(data.participants || {}).filter((p) => p.ready).length;
  const isHost = data.hostId === state.clientId;
  showModal({
    kicker: "协作奇遇准备",
    title: `${data.theme.name}：等待盟友`,
    body: `
      <p>所有受邀玩家响应后，由发起者统一开启世界奇遇。参与者越多，难度小幅提高，但可互相护持降低危险。</p>
      <div class="system-grid">${rows}</div>
    `,
    actions: [
      { label: "刷新状态", handler: () => showAdventureLobbyModal(state.roomAdventureLobby, afterClose) },
      { label: "开始协作奇遇", disabled: !isHost || !allResponded || readyCount < 1, handler: () => startAdventureLobbyFromHost(afterClose) },
      { label: "取消邀请", disabled: !isHost, handler: () => cancelAdventureLobby(afterClose) },
      { label: "先继续年度结算", disabled: !afterClose, handler: () => continuePendingYearEvent("adventure", afterClose) },
    ],
  });
  if (afterClose) els.modalCloseBtn.onclick = () => continuePendingYearEvent("adventure", afterClose);
}

function showAdventureLobbyInvite(lobby) {
  const data = normalizeAdventureLobby(lobby);
  if (!data || !state.founded || !data.expectedIds.includes(state.clientId) || data.participants?.[state.clientId] || data.declined?.[state.clientId]) return;
  const roster = state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a));
  showModal({
    kicker: "盟友邀请",
    title: `${data.hostName || "盟友"}邀请探索${data.theme.name}`,
    body: `
      <p>选择一名弟子加入协作世界奇遇。进入后可看到队友状态，并可消耗本轮操作护持盟友降低危险值。</p>
      <div class="adventure-roster">
        ${roster.map((d, index) => `<label class="adventure-candidate ${d.core ? "is-core" : ""}">
          <input type="radio" name="coop-adventure-disciple" value="${d.id}" ${index === 0 ? "checked" : ""}>
          <div><strong>${d.core ? "核心·" : ""}${d.name}</strong><span>${realms[d.realm]} · 战力 ${Math.round(discipleBattleScore(d))} · 体 ${d.hp}</span></div>
        </label>`).join("")}
      </div>
    `,
    actions: [
      { label: "准备加入", handler: () => {
        const id = els.modalBody.querySelector("input[name='coop-adventure-disciple']:checked")?.value;
        const disciple = state.sect.disciples.find((d) => d.id === id);
        if (!disciple) return;
        const participant = publicAdventureParticipant(disciple);
        state.roomAdventureLobby = mergeAdventureLobbyParticipant(data, participant);
        sendRoomFeature("adventure_lobby_ready", { lobbyId: data.id, participant, lobby: state.roomAdventureLobby });
        closeModal();
        showAdventureLobbyModal(state.roomAdventureLobby, state.pendingAdventureAfterClose);
      } },
      { label: "婉拒", handler: () => {
        state.roomAdventureLobby = markAdventureLobbyDeclined(data, state.clientId, state.sect.name);
        sendRoomFeature("adventure_lobby_decline", { lobbyId: data.id, playerId: state.clientId, playerName: state.sect.name, lobby: state.roomAdventureLobby });
        closeModal();
      } },
    ],
  });
  els.modalCloseBtn.onclick = () => {
    state.roomAdventureLobby = markAdventureLobbyDeclined(data, state.clientId, state.sect.name);
    sendRoomFeature("adventure_lobby_decline", { lobbyId: data.id, playerId: state.clientId, playerName: state.sect.name, lobby: state.roomAdventureLobby });
    closeModal();
  };
}

function mergeAdventureLobbyParticipant(lobby, participant) {
  const data = normalizeAdventureLobby(lobby);
  if (!data || (!participant?.playerId && !participant?.id)) return data;
  const id = participant.playerId || participant.id;
  data.participants = { ...(data.participants || {}), [id]: { ...participant, id, playerId: id, ready: true } };
  if (data.declined) delete data.declined[id];
  return data;
}

function markAdventureLobbyDeclined(lobby, playerId, playerName = "盟友宗门") {
  const data = normalizeAdventureLobby(lobby);
  if (!data || !playerId) return data;
  data.declined = { ...(data.declined || {}), [playerId]: playerName };
  if (data.participants) delete data.participants[playerId];
  return data;
}

function startAdventureLobbyFromHost(afterClose = null) {
  const lobby = normalizeAdventureLobby(state.roomAdventureLobby);
  if (!lobby || lobby.hostId !== state.clientId) return;
  lobby.started = true;
  sendRoomFeature("adventure_lobby_start", { lobby });
  beginAdventureFromLobby(lobby, afterClose);
}

function cancelAdventureLobby(afterClose = null) {
  const lobby = normalizeAdventureLobby(state.roomAdventureLobby);
  if (lobby) sendRoomFeature("adventure_lobby_cancel", { lobbyId: lobby.id });
  state.roomAdventureLobby = null;
  closeModal();
  afterClose?.();
  render();
}

function beginAdventureFromLobby(lobby, afterClose = null) {
  const data = normalizeAdventureLobby(lobby);
  const mine = data?.participants?.[state.clientId];
  state.roomAdventureLobby = null;
  if (!data || !mine) {
    showModal({
      kicker: "协作奇遇",
      title: `${data?.theme?.name || "世界奇遇"}已开始`,
      body: `<p>本宗未加入本次探索，将作为旁观宗门等待结果。</p>`,
      actions: [{ label: "知道了", handler: () => { closeModal(); afterClose?.(); render(); } }],
    });
    return;
  }
  const disciple = state.sect.disciples.find((d) => d.id === mine.discipleId || d.name === mine.disciple);
  if (!disciple) {
    log("协作奇遇开始失败：本宗参战弟子不存在。", "warn");
    return;
  }
  const extras = Object.values(data.participants || {})
    .filter((p) => (p.playerId || p.id) !== state.clientId)
    .map((p) => ({ id: p.playerId || p.id, name: p.name || p.playerName, disciple: p.disciple, danger: p.danger || 0, hp: p.hp || 0 }));
  closeModal();
  startWorldAdventure(data.theme, disciple, data.aiTeams, afterClose, extras, {
    lockstep: false,
    hostId: data.hostId,
    lobbyId: data.id,
  });
  sendRoomFeature("adventure_progress", { status: { disciple: disciple.name, danger: 0, hp: disciple.hp, step: 0 } });
}

function startWorldAdventure(theme, disciple, aiTeams, afterClose, extraParticipants = [], syncOptions = {}) {
  state.selectedDiscipleId = disciple.id;
  state.worldAdventure = {
    theme,
    discipleId: disciple.id,
    aiTeams,
    lockstep: Boolean(syncOptions.lockstep),
    hostId: syncOptions.hostId || state.clientId,
    lobbyId: syncOptions.lobbyId || "",
    step: 0,
    merit: 0,
    danger: 0,
    injuries: 0,
    participants: [{ id: state.clientId, name: state.sect.name, disciple: disciple.name, danger: 0, hp: disciple.hp }, ...extraParticipants],
    flags: {},
    history: [],
    helpUsed: {},
    remoteHelpUsed: {},
    afterClose,
  };
  log(`${disciple.name}代表本宗进入世界奇遇「${theme.name}」。`, "good");
  renderWorldAdventureStep();
}

function worldAdventureStepChoices(adv, stage) {
  if (!stage?.choices?.length) return [];
  const seed = `${adv?.lobbyId || adv?.theme?.name || "solo"}:${adv?.step || 0}:${state.roomCode || "local"}`;
  return stage.choices
    .map((choice, index) => ({ choice, score: stableHash(`${seed}:${index}:${choice.label}`) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map((item) => item.choice);
}

function applyRoomAdventureLockstepChoice(payload = {}, sourceId = "") {
  const adv = state.worldAdventure;
  if (!adv?.lockstep || sourceId !== adv.hostId || payload.lobbyId !== adv.lobbyId || payload.step !== adv.step) return;
  const stage = worldAdventureStages[adv.step];
  const choices = worldAdventureStepChoices(adv, stage);
  const choice = choices[payload.choiceIndex] || choices.find((item) => item.label === payload.choiceLabel);
  if (!choice) return;
  resolveWorldAdventureChoice(choice, { remote: true });
}

function renderWorldAdventureStep() {
  const adv = state.worldAdventure;
  const d = state.sect.disciples.find((item) => item.id === adv?.discipleId);
  if (!adv || !d) return;
  const stage = worldAdventureStages[adv.step];
  const participants = adv.participants || [{ id: state.clientId, name: state.sect.name, disciple: d.name, danger: adv.danger, hp: d.hp }];
  const choices = worldAdventureStepChoices(adv, stage);
  const waitingLockstep = adv.lockstep && adv.hostId && adv.hostId !== state.clientId;
  const helpUsed = Boolean(adv.helpUsed?.[state.clientId]);
  showModal({
    kicker: adv.theme.name,
    title: `${stage.title}：${d.name}`,
    body: `
      <div class="adventure-state">
        <div><span>危险</span><strong>${adv.danger}</strong></div>
        <div><span>收获</span><strong>${adv.merit}</strong></div>
        <div><span>伤势</span><strong>${adv.injuries}</strong></div>
        <div><span>协作</span><strong>${participants.length} 人</strong></div>
      </div>
      ${participants.length > 1 ? `<div class="adventure-history">${participants.map((p) => `<p><strong>${p.name}</strong>：${p.disciple || "参战弟子"}，危险 ${p.danger || 0}，体魄 ${Math.round(p.hp || 0)}</p>`).join("")}</div>` : ""}
      <p>${stage.intro(adv.theme, d)}</p>
      <div class="adventure-history">
        ${adv.history.slice(-3).map((h) => `<p class="${h.tone}">${h.text}</p>`).join("") || "<p>旅程刚刚开始，所有选择都会留下痕迹。</p>"}
      </div>
    `,
    actions: (waitingLockstep ? [{
      label: "等待队长推进",
      disabled: true,
      handler: () => {},
    }] : choices.map((choice) => ({
      label: choice.label,
      handler: () => resolveWorldAdventureChoice(choice),
    }))).concat(participants.length > 1 ? [{ label: helpUsed ? "已护持盟友" : "护持盟友降险", disabled: helpUsed, handler: helpAdventureAllies }] : []),
  });
  els.modalProgress.hidden = false;
  els.modalProgress.textContent = `${adv.step + 1}/${worldAdventureStages.length}`;
  els.modalCloseBtn.onclick = () => {};
}

function resolveWorldAdventureChoice(choice, options = {}) {
  const adv = state.worldAdventure;
  const d = state.sect.disciples.find((item) => item.id === adv?.discipleId);
  if (!adv || !d) return;
  if (adv.lockstep && adv.hostId && adv.hostId !== state.clientId && !options.remote) {
    flashFeedback("协作奇遇由队长统一推进，你仍可使用护持降低危险。", "warn");
    return;
  }
  if (adv.lockstep && adv.hostId === state.clientId && state.multiplayer && state.roomConnected && !options.remote) {
    const choices = worldAdventureStepChoices(adv, worldAdventureStages[adv.step]);
    const choiceIndex = Math.max(0, choices.findIndex((item) => item.label === choice.label));
    sendRoomFeature("adventure_lockstep_choice", { lobbyId: adv.lobbyId, step: adv.step, choiceIndex, choiceLabel: choice.label });
  }
  const coopSize = Math.max(1, adv.participants?.length || 1);
  const coopDifficulty = Math.max(0, coopSize - 1) * 4;
  const coopSupport = Math.max(0, coopSize - 1) * 6;
  const statValue = d[choice.stat] || 35;
  const flagBonus = (adv.flags.steady || 0) * 2 + (adv.flags.guard || 0) * 2 + (choice.tag === "greed" ? -(adv.flags.mercy || 0) : 0);
  const score = statValue + d.realm * 11 + Math.floor(d.luck / 3) + flagBonus + coopSupport + rand(1, 100);
  const threshold = 58 + adv.step * 3 + choice.risk * 2 + Math.floor(adv.danger / 5) + coopDifficulty;
  const deathChance = clamp(choice.death - 7 + Math.floor(adv.danger / 7) + (score < threshold ? 4 : 0) - Math.floor(d.luck / 10) - (adv.flags.guard || 0) - Math.max(0, coopSize - 1) * 3, 0, 22);
  const dies = rand(1, 100) <= deathChance && score < threshold + 18;
  if (dies) {
    killAdventureDisciple(d, choice);
    return;
  }
  const success = score >= threshold;
  if (success) {
    adv.merit += choice.gain + rand(4, 10) + Math.max(0, coopSize - 1) * 2;
    adv.danger += Math.max(0, choice.risk - 4 + Math.max(0, coopSize - 2));
    adv.flags[choice.tag] = (adv.flags[choice.tag] || 0) + 1;
    d.exp += 4 + Math.floor(choice.gain / 3);
    adv.history.push({ tone: "good", text: `${choice.label}：${choice.success}` });
  } else {
    adv.danger += Math.max(1, choice.risk - 2) + rand(1, 4) + Math.max(0, coopSize - 2);
    adv.injuries += 1;
    d.hp = Math.max(18, d.hp - rand(3, 10));
    d.temper = Math.max(1, d.temper - rand(1, 4));
    adv.history.push({ tone: "warn", text: `${choice.label}：${choice.fail}` });
  }
  adv.step += 1;
  if (state.multiplayer && state.roomConnected) {
    sendRoomFeature("adventure_progress", { status: { disciple: d.name, danger: adv.danger, hp: d.hp, step: adv.step } });
  }
  if (adv.step >= worldAdventureStages.length) finishWorldAdventure(false);
  else renderWorldAdventureStep();
  render();
}

function helpAdventureAllies() {
  const adv = state.worldAdventure;
  const d = state.sect.disciples.find((item) => item.id === adv?.discipleId);
  if (!adv || !d) return;
  adv.helpUsed = adv.helpUsed || {};
  if (adv.helpUsed[state.clientId]) {
    flashFeedback("本次世界奇遇已经护持过盟友。", "warn");
    return;
  }
  adv.helpUsed[state.clientId] = true;
  const reduce = clamp(5 + Math.floor(d.temper / 18) + Math.floor(d.realm / 2), 5, 16);
  adv.danger = Math.max(0, adv.danger - reduce);
  d.exp += 3;
  for (const ally of alliedRemotePlayers()) increaseRoomAllianceTrust(state.clientId, ally.id, 3, false);
  adv.history.push({ tone: "good", text: `${d.name}护持队友，危险值 -${reduce}。` });
  if (state.multiplayer && state.roomConnected) {
    sendRoomFeature("adventure_help", { reduce, step: adv.step, helperId: state.clientId });
    sendRoomFeature("adventure_progress", { status: { disciple: d.name, danger: adv.danger, hp: d.hp, step: adv.step } });
  }
  renderWorldAdventureStep();
  render();
}

function killAdventureDisciple(d, choice) {
  const adv = state.worldAdventure;
  state.sect.disciples = state.sect.disciples.filter((item) => item.id !== d.id);
  for (const other of state.sect.disciples) {
    if (state.sect.bonds?.some((bond) => bond.a === d.id && bond.b === other.id || bond.b === d.id && bond.a === other.id)) adjustMind(other, 18, "羁绊者陨落");
  }
  state.sect.bonds = (state.sect.bonds || []).filter((bond) => bond.a !== d.id && bond.b !== d.id);
  state.selectedDiscipleId = state.sect.disciples[0]?.id || null;
  const text = `${d.name}在「${choice.label}」中触发死局，魂灯熄灭，未能走出${adv.theme.name}。`;
  log(text, "warn");
  showModal({
    kicker: "世界奇遇",
    title: "魂灯熄灭",
    body: `
      <div class="death-panel">
        <strong>${d.name}死亡</strong>
        <p>${text}</p>
        <p>本次世界奇遇立即结束。死亡弟子已从宗门名册中移除，不会复活。</p>
      </div>
    `,
    actions: [{ label: "收束残讯", handler: () => { const next = adv.afterClose; state.worldAdventure = null; closeModal(); next?.(); render(); } }],
  });
  els.modalCloseBtn.onclick = () => { const next = adv.afterClose; state.worldAdventure = null; closeModal(); next?.(); render(); };
  els.modalProgress.hidden = false;
  els.modalProgress.textContent = `${Math.min(adv.step + 1, worldAdventureStages.length)}/${worldAdventureStages.length}`;
}

function buildWorldAdventureLeaderboard(adv, finalScore) {
  const currentDisciple = state.sect.disciples.find((item) => item.id === adv?.discipleId);
  const rows = [{
    id: state.clientId,
    name: state.sect.name,
    disciple: currentDisciple?.name || "本宗弟子",
    score: Math.round(finalScore + (currentDisciple?.realm || 0) * 24 + stableRange(`${adv.theme?.name}:${state.year}:${state.clientId}:local-adventure`, 12, 66)),
    player: true,
  }];
  for (const player of foundedRoomPlayers()) {
    if (!player || player.id === state.clientId) continue;
    rows.push({
      id: player.id,
      name: player.name || "联机宗门",
      disciple: player.topDisciple || "参战弟子",
      score: Math.round(110 + (player.power || 0) * 0.035 + (player.maxRealm || 0) * 42 + stableRange(`${adv.theme?.name}:${state.year}:${player.id}:adventure`, 35, 180)),
      remote: true,
    });
  }
  for (const team of adv.aiTeams || []) {
    rows.push({
      id: team.sect,
      name: team.sect,
      disciple: team.disciple,
      score: Math.round(55 + (team.score || 0) * 0.26 + stableRange(`${adv.theme?.name}:${state.year}:${team.sect}:ai-adventure`, 0, 105)),
      ai: true,
    });
  }
  return rows
    .sort((a, b) => b.score - a.score)
    .map((row, index) => ({ ...row, rank: index + 1 }));
}

function finishWorldAdventure(dead) {
  const adv = state.worldAdventure;
  const d = state.sect.disciples.find((item) => item.id === adv?.discipleId);
  if (!adv || !d || dead) return;
  const coopSize = Math.max(1, adv.participants?.length || 1);
  const finalScore = adv.merit + (adv.flags.insight || 0) * 9 + (adv.flags.mercy || 0) * 7 + (adv.flags.greed || 0) * 5 + (adv.flags.blood || 0) * 7 + coopSize * 18 + d.realm * 38 + discipleBattleScore(d) * 0.028 - adv.danger * 1.15 - adv.injuries * 3 + rand(55, 105);
  const leaderboard = buildWorldAdventureLeaderboard(adv, finalScore);
  const rank = leaderboard.find((row) => row.id === state.clientId)?.rank || leaderboard.length;
  const ending = pickWorldAdventureEnding(adv, finalScore, rank);
  const reward = applyWorldAdventureReward(adv, d, finalScore, rank);
  log(`${d.name}走出${adv.theme.name}：${ending.title}。${ending.log}`, rank === 1 ? "good" : "warn");
  const next = adv.afterClose;
  const leaderboardHtml = leaderboard.slice(0, 12).map((row) => `<article class="system-card ${row.id === state.clientId ? "is-winner" : ""}"><strong>第 ${row.rank} 名：${tradeEscape(row.name)}</strong><span>${tradeEscape(row.disciple || "参战弟子")} · 评分 ${Math.round(row.score || 0)}${row.remote ? " · 联机玩家" : row.ai ? " · AI宗门" : " · 本宗"}</span></article>`).join("");
  showModal({
    kicker: "世界奇遇结算",
    title: ending.title,
    body: `
      <div class="adventure-state">
        <div><span>最终排名</span><strong>第${rank}</strong></div>
        <div><span>最终评分</span><strong>${Math.max(0, Math.round(finalScore))}</strong></div>
        <div><span>危险累积</span><strong>${adv.danger}</strong></div>
      </div>
      <p>${ending.text}</p>
      <div class="reward-list">
        ${reward.map((item) => `<div><span>${item.name}</span><strong>${item.value}</strong></div>`).join("")}
      </div>
      <div class="system-grid">${leaderboardHtml}</div>
      <div class="adventure-history">
        ${adv.history.slice(-6).map((h) => `<p class="${h.tone}">${h.text}</p>`).join("")}
      </div>
    `,
    actions: [{ label: "带回收获", handler: () => { state.worldAdventure = null; closeModal(); next?.(); render(); } }],
  });
  els.modalCloseBtn.onclick = () => { state.worldAdventure = null; closeModal(); next?.(); render(); };
  els.modalProgress.hidden = false;
  els.modalProgress.textContent = `${worldAdventureStages.length}/${worldAdventureStages.length}`;
}

function pickWorldAdventureEnding(adv, score, rank) {
  const f = adv.flags;
  const endings = [
    { key: "insight", title: `${adv.theme.relic}真解`, text: `一路参悟让${adv.theme.relic}不再只是宝物，而成了一段可传承的道统。`, log: "参悟与声望大幅提升。" },
    { key: "mercy", title: "众宗欠礼", text: "被救下的外宗弟子在出口外齐齐行礼，许多敌意因此暂时压下。", log: "诸宗关系缓和，额外获得声望。" },
    { key: "greed", title: "险中夺魁", text: "贪取之路几乎吞掉魂灯，但最后一刻带回了旁人不敢碰的重宝。", log: "带回高品质宝物，但弟子伤势明显。" },
    { key: "blood", title: "血契重宝", text: `${adv.theme.relic}承认了血的代价，重宝入手，却在经脉里留下灼痕。`, log: "获得重宝，体魄受损。" },
    { key: "guard", title: "稳阵归宗", text: "你没有拿最多，却把危险隔在身后，宗门因此得到一份稳定的长线收益。", log: "护山大阵和资源提升。" },
    { key: "social", title: "诸宗暗线", text: "这趟旅程带回的不只是宝物，还有诸宗弟子私下交换的承诺。", log: "关系和情报收益提升。" },
    { key: "fate", title: "命数偏爱", text: "许多选择看似赌命，却被气运串成一条不可复制的活路。", log: "获得随机高额奖励。" },
    { key: "trick", title: "虚实之间", text: "谎言、误导与假路最终织成真出口，追兵仍在错误的命运里打转。", log: "获得灵石与声望。" },
    { key: "steady", title: "十步无悔", text: "没有最耀眼的一步，但每一步都稳稳落下，最终把风险压成收获。", log: "弟子稳定成长。" },
    { key: "bold", title: "险路扬名", text: "急进、翻崖、斩影，所有凶险都化作出口外的传闻。", log: "战斗属性和声望提升。" },
  ];
  const preferred = endings.filter((e) => (f[e.key] || 0) >= 2);
  if (rank === 1 && preferred.length) return pick(preferred);
  if (score < 30) return { title: "残命归来", text: "走出出口时，衣袍几乎被血与尘盖住。收获不多，但活着本身已是胜利。", log: "少量收获，弟子带伤。" };
  if (adv.danger > 45) return { title: "劫后余光", text: "危险积累到几乎失控，幸而最后一线生机仍被抓住。", log: "获得中等奖励，但伤势较重。" };
  return pick(endings);
}

function applyWorldAdventureReward(adv, d, score, rank) {
  const tier = rank === 1 ? 2 : rank <= 3 ? 1 : 0;
  const quality = clamp(Math.floor(score / 45) + tier, 0, qualityNames.length - 1);
  const stones = Math.max(80, Math.round(120 + score * 3 + tier * 180));
  const insightGain = Math.max(12, Math.round(score / 4)) + tier * 18;
  const prestigeGain = Math.max(18, Math.round(score / 5)) + tier * 28;
  const expGain = 18 + tier * 18;
  const luckGain = tier + (adv.flags.fate || 0);
  const temperGain = Math.max(0, (adv.flags.steady || 0) - adv.injuries);
  const atkGain = adv.flags.bold || adv.flags.blood ? 3 + tier * 2 : 0;
  const defGain = adv.flags.guard || adv.flags.mercy ? 3 + tier * 2 : 0;
  const hpLoss = adv.flags.blood >= 2 || adv.danger > 40 ? rand(8, 18) : 0;
  const itemId = adv.flags.greed || rank === 1
    ? pick([...equipmentItemIds, ...methodItemIds, "refineStone", "affixLock"])
    : pick(["qiPill", "marrowPill", "heartLotus", "tribPill", "swordManual"]);
  const itemName = `${gearTierName(quality)}${itemCatalog[itemId].name}`;
  state.sect.stones += stones;
  state.sect.insight += insightGain;
  state.sect.prestige += prestigeGain;
  d.exp += expGain;
  d.luck += luckGain;
  d.temper += temperGain;
  d.atk += atkGain;
  d.def += defGain;
  addItem(itemId, 1, quality);
  const daoGain = adv.flags.insight >= 2 ? 1 : 0;
  if (daoGain) {
    state.sect.tech.wander = daoLevelFor("wander") + 1;
    state.sect.daoPath = "wander";
    state.sect.daoLevel = totalDaoLevel();
  }
  if (adv.flags.mercy >= 2) activeRivals().forEach((r) => { r.attitude += 5; });
  if (hpLoss) d.hp = Math.max(30, d.hp - hpLoss);
  return [
    { name: "灵石", value: `+${stones}` },
    { name: "声望", value: `+${prestigeGain}` },
    { name: "参悟", value: `+${insightGain}` },
    { name: "物品", value: itemName },
    { name: `${d.name}修为`, value: `+${expGain}` },
    { name: `${d.name}气运`, value: `+${luckGain}` },
    ...(temperGain ? [{ name: `${d.name}心性`, value: `+${temperGain}` }] : []),
    ...(atkGain ? [{ name: `${d.name}攻伐`, value: `+${atkGain}` }] : []),
    ...(defGain ? [{ name: `${d.name}守御`, value: `+${defGain}` }] : []),
    ...(daoGain ? [{ name: "道统等级", value: "+1" }] : []),
    ...(hpLoss ? [{ name: `${d.name}体魄`, value: `-${hpLoss}` }] : []),
    ...(adv.flags.mercy >= 2 ? [{ name: "诸宗关系", value: "+5" }] : []),
  ];
}

function triggerWorldEvent() {
  const events = [
    {
      name: "旱魃过境",
      text: "赤云压境，灵田枯焦。本年粮草收入减少，争夺灵泉价值提高。",
      apply: () => { state.sect.grain = Math.max(0, state.sect.grain - 120); state.resources.filter((r) => r.kind === "spring").forEach((r) => r.value += 18); },
    },
    {
      name: "魔潮试探",
      text: "边境魔潮蠢动，所有宗门关系紧张，弱宗更容易被袭扰。",
      apply: () => { state.rivals.forEach((r) => r.attitude -= rand(8, 18)); state.sect.risk += 4; },
    },
    {
      name: "仙盟征召",
      text: "仙盟征召各宗缴纳物资。缴纳者得声望，不缴者保资源。",
      apply: () => offerLeagueTribute(),
    },
    {
      name: "灵脉复苏",
      text: "大地灵脉复苏，地图上新增机缘点与资源争夺。",
      apply: () => { addOpportunityNodes(rand(3, 5), "pulse"); state.sect.insight += 20; },
    },
  ];
  const event = pick(events);
  state.worldEvent = event.name;
  event.apply();
  log(`世界事件：${event.name}。${event.text}`, "warn");
}

function offerLeagueTribute() {
  showModal({
    kicker: "世界事件",
    title: "仙盟征召",
    body: `<p>仙盟要求各宗缴纳 220 灵石与 120 粮草，用于边境防线。缴纳可得声望与盟友关系；拒缴可保留资源，但会被强宗看轻。</p>`,
    actions: [
      { label: "缴纳物资", handler: () => { state.sect.stones = Math.max(0, state.sect.stones - 220); state.sect.grain = Math.max(0, state.sect.grain - 120); state.sect.prestige += 55; state.rivals.forEach((r) => r.attitude += 8); closeModal(); render(); } },
      { label: "拒绝征召", handler: () => { state.sect.prestige = Math.max(0, state.sect.prestige - 18); state.rivals.forEach((r) => r.attitude -= 5); closeModal(); render(); } },
    ],
  });
}

function offerRogueChoice() {
  const choices = [
    {
      title: "异火入山",
      text: "一缕异火落入丹房，可强行收束，也可任其游走。",
      actions: [
        { label: "收束异火", run: () => { state.sect.alchemyMats += 2; state.sect.barrier = clamp(state.sect.barrier - 8, 0, 100); log("异火入炉，丹材增加，但护山大阵被灼伤。", "good"); } },
        { label: "任其游走", run: () => { state.sect.prestige += 35; log("异火映照山门，引来修士观望，声望提升。", "good"); } },
      ],
    },
    {
      title: "古修投影",
      text: "夜半有古修投影讲法，但听法弟子可能心神震荡。",
      actions: [
        { label: "全宗听法", run: () => { state.sect.disciples.forEach((d) => { d.exp += 24; d.temper -= 2; }); log("全宗听法，修为进境加快，少数弟子心神不宁。", "good"); } },
        { label: "只派精英", run: () => { const d = selectedDisciple(); if (d) d.exp += 70; log("选中弟子独听古修讲法，获得大量修为。", "good"); } },
      ],
    },
    {
      title: "黑市邀约",
      text: "山外黑市愿以低价出售器材，但会影响名声。",
      actions: [
        { label: "暗中交易", run: () => { state.sect.forgingMats += 2; state.sect.prestige = Math.max(0, state.sect.prestige - 20); log("黑市交易完成，器材增加，宗门声望受损。", "warn"); } },
        { label: "公开拒绝", run: () => { state.sect.prestige += 24; log("本宗拒绝黑市邀约，清名远扬。", "good"); } },
      ],
    },
  ];
  const event = pick(choices);
  showModal({
    kicker: "随机抉择",
    title: event.title,
    body: `<p>${event.text}</p>`,
    actions: event.actions.map((action) => ({
      label: action.label,
      handler: () => {
        action.run();
        closeModal();
        render();
      },
    })),
  });
}

function activeRivals() {
  return state.rivals.filter((r) => r.alive !== false);
}

function runAiTurns() {
  state.aiReports = [];
  for (const r of activeRivals()) {
    const report = [];
    const era = 1 + Math.min(0.72, state.year * 0.045);
    const playerPower = sectPower();
    const pressureGap = playerPower - r.power;
    const catchUp = playerPower > r.power * 1.35 ? Math.min(state.year >= 10 ? 180 : 120, Math.round(pressureGap * (state.year >= 10 ? 0.045 : 0.035))) : 0;
    const aiActions = state.year >= 12 || playerPower > r.power * 1.65 ? 3 : r.power > 1200 || state.year >= 7 ? 2 : 2;
    for (let i = 0; i < aiActions; i += 1) {
      const hostile = r.attitude < -25;
      const stronger = r.power > sectPower() * 0.82;
      const valuable = state.resources.slice().sort((a, b) => b.value - a.value);
      if (hostile && stronger && Math.random() < 0.34) {
        r.attitude -= 6;
        r.power += Math.round(rand(16, 42) * era);
        r.grudges = (r.grudges || 0) + 1;
        report.push({ tone: "warn", text: "整备战备，对本宗敌意加深，后续更可能袭扰或合攻。" });
      } else if (Math.random() < 0.38) {
        const powerGain = Math.round((rand(24, 68) + (r.alchemy || 0) * 7 + (r.forging || 0) * 8) * era) + catchUp;
        const stoneGain = Math.round(rand(110, 240) * era);
        r.power += powerGain;
        r.stones += stoneGain;
        report.push({ tone: "info", text: `闭关与经营，战力 +${Math.round(powerGain)}，灵石 +${stoneGain}。` });
      } else if (Math.random() < 0.72) {
        const target = valuable.find((res) => res.owner !== r.id && (res.owner !== "player" || r.power + rand(80, state.year >= 7 ? 620 : 320) > sectPower() * 0.92 + resourceGarrisonPower(res))) || pick(state.resources);
        if (target) {
          const previousOwner = target.owner;
          target.owner = r.id;
          if (previousOwner === "player") {
            const oldGarrison = state.sect.disciples.find((d) => d.id === target.garrisonId);
            if (oldGarrison) {
              oldGarrison.status = "失守撤回";
              adjustMind(oldGarrison, 8, "资源点失守");
            }
            target.garrisonId = null;
          }
          r.power += Math.round(target.value / 3 + state.year * 5);
          if (target.yields?.alchemyMats && Math.random() < 0.45) r.alchemy += 1;
          if (target.yields?.forgingMats && Math.random() < 0.45) r.forging += 1;
          const impact = previousOwner === "player" ? "夺走了本宗资源点，年度产出会下降。" : "改写了大地图资源格局。";
          report.push({ tone: previousOwner === "player" ? "danger" : "info", text: `占领${target.name}，${impact}` });
        }
      } else if (r.attitude > 20 && Math.random() < 0.65) {
        r.attitude += rand(3, 10);
        report.push({ tone: "good", text: "释放善意，与本宗关系略有缓和。" });
      } else {
        const drop = rand(6, 16);
        r.attitude -= drop;
        report.push({ tone: "warn", text: `派人刺探山门，关系 -${drop}。` });
      }
    }
    const aiOwnedResources = state.resources.filter((res) => res.owner === r.id);
    if (aiOwnedResources.length && Math.random() < 0.34 + Math.min(0.18, state.year / 45)) {
      const res = pick(aiOwnedResources);
      res.upgrades = res.upgrades || { outpost: 0, arrayEye: 0, extractor: 0, depot: 0 };
      const key = pick(["outpost", "extractor", "arrayEye"]);
      if (res.upgrades[key] < 3) {
        res.upgrades[key] += 1;
        r.power += 35 + res.upgrades[key] * 18;
        report.push({ tone: "info", text: `建设${res.name}据点，资源防守与后续收益提高。` });
      }
    }
    if (Math.random() < 0.48 + Math.min(0.2, state.year / 40)) {
      r.disciples += 1;
      report.push({ tone: "info", text: "招揽新弟子，门人 +1。" });
    }
    if (Math.random() < 0.38) {
      r.alchemy += 1;
      report.push({ tone: "info", text: "丹道积累提升，炼丹 +1。" });
    }
    if (Math.random() < 0.38) {
      r.forging += 1;
      report.push({ tone: "info", text: "器道积累提升，炼器 +1。" });
    }
    if (Math.random() < 0.28 + Math.min(0.16, state.year / 60)) {
      r.array += 1;
      report.push({ tone: "info", text: "推演护山阵图，阵法 +1。" });
    }
    if (frontierUnlocked() && Math.random() < 0.46) {
      const borderGain = Math.round(rand(45, 120) * era + state.year * 7);
      r.power += borderGain;
      r.foundation = clamp((r.foundation || 100) + rand(8, 24), 0, 520);
      report.push({ tone: "warn", text: `派队深入边境讨伐妖兽，获得晋升材料与战力 +${borderGain}。` });
    }
    r.foundation = clamp((r.foundation || 100) + Math.round(rand(5, 15) * era), 0, 320);
    r.power += Math.round((rand(14, 42) + r.disciples * 2.4 + (r.alchemy + r.forging) * 5.5) * era) + catchUp;
    const softCap = Math.max(1200 + state.year * 260, playerPower * 1.65 + state.year * 120);
    if (r.power > softCap) r.power = Math.round(softCap + (r.power - softCap) * 0.35);
    if (catchUp) report.push({ tone: "warn", text: `感受到本宗压力，强行整合底蕴追赶，战力额外 +${catchUp}。` });
    maybeAiResourceSabotage(r, report);
    if (report.length) {
      const orderedReport = [
        ...report.filter((item) => item.tone === "danger"),
        ...report.filter((item) => item.tone !== "danger"),
      ];
      state.aiReports.push({
        sect: r.name,
        attitude: r.attitude,
        power: Math.round(r.power),
        foundation: Math.round(r.foundation || 0),
        items: orderedReport.slice(0, 5),
      });
    }
  }
  maybeCoalitionAttack();
  log("AI 宗门已完成本年操作：修炼、占点、结交或挑衅。");
}

function maybeAiResourceSabotage(rival, report) {
  if (!state.sect || !rival || rival.alive === false || rival.alliance) return;
  const owned = state.resources.filter((res) => res.owner === "player");
  if (!owned.length || rival.attitude > -8) return;
  const peace = state.councilEdict?.key === "peace" || state.yearlyBoon?.key === "peaceOmen";
  const scoutShield = state.sect.buildings.scoutTower * 0.04 + (state.yearlyBoon?.key === "intelBonus" ? 0.12 : 0);
  const chance = clamp(0.12 + Math.max(0, -rival.attitude) / 220 + (rival.grudges || 0) * 0.025 - scoutShield - (peace ? 0.14 : 0), 0.02, 0.36);
  if (Math.random() > chance) return;
  const target = owned
    .map((resource) => ({ resource, score: resource.value * 2 + resourceUpgradeLevel(resource, "extractor") * 55 - resourceGarrisonPower(resource) * 0.42 + rand(-40, 60) }))
    .sort((a, b) => b.score - a.score)[0]?.resource;
  if (!target) return;
  const attack = rivalStrategicPower(rival, target) * 0.32 + (rival.grudges || 0) * 30 + rand(70, 260);
  const defense = resourceGarrisonPower(target) + sectPower() * 0.14 + state.sect.buildings.scoutTower * 90 + rand(60, 260);
  if (attack > defense) {
    const upgradeKeys = resourceUpgradeCatalog.map((u) => u.key).filter((key) => resourceUpgradeLevel(target, key) > 0);
    if (upgradeKeys.length && Math.random() < 0.62) {
      const key = pick(upgradeKeys);
      target.upgrades[key] = Math.max(0, target.upgrades[key] - 1);
      const name = resourceUpgradeCatalog.find((u) => u.key === key)?.name || "据点";
      report.push({ tone: "danger", text: `派暗线偷袭${target.name}，破坏${name}一级。` });
      log(`${rival.name}暗线偷袭${target.name}，${name}被破坏一级。`, "warn");
    } else {
      const lost = Math.min(state.sect.stones, rand(60, 150) + resourceUpgradeLevel(target, "extractor") * 25);
      state.sect.stones -= lost;
      report.push({ tone: "danger", text: `暗线劫掠${target.name}外围库藏，本宗灵石 -${lost}。` });
      log(`${rival.name}暗线劫掠${target.name}外围库藏，灵石 -${lost}。`, "warn");
    }
    const guard = state.sect.disciples.find((d) => d.id === target.garrisonId);
    if (guard) {
      guard.hp = Math.max(24, guard.hp - rand(4, 12));
      adjustMind(guard, 5, "资源点遇袭");
    }
    rival.grudges = (rival.grudges || 0) + 1;
  } else {
    rival.attitude -= 6;
    rival.power = Math.max(80, rival.power - rand(20, 55));
    state.sect.prestige += 18;
    report.push({ tone: "good", text: `试图偷袭${target.name}，被驻守与情报网提前截住，敌宗战力受损。` });
    log(`${rival.name}暗线偷袭${target.name}失败，本宗声望 +18。`, "good");
  }
}

function maybeCoalitionAttack() {
  const hostile = activeRivals().filter((r) => !r.alliance && r.attitude < -10).sort((a, b) => b.power - a.power);
  if (hostile.length < 2 || !state.sect) return;
  const avgPower = activeRivals().reduce((sum, r) => sum + r.power, 0) / Math.max(1, activeRivals().length);
  const pressure = sectPower() > avgPower * 1.35 || state.sect.prestige > 900;
  if (!pressure || Math.random() > 0.38) return;
  const attackers = hostile.slice(0, rand(2, Math.min(3, hostile.length)));
  const attack = attackers.reduce((sum, r) => sum + r.power * 0.55 + (r.grudges || 0) * 35, 0) + rand(80, 240);
  const defense = sectPower() + state.sect.barrier * 8 + (state.sect.mountainFormation?.power || 0) * 0.75 + rand(0, 260);
  if (attack > defense) {
    const lostStones = Math.min(state.sect.stones, rand(160, 360));
    state.sect.stones -= lostStones;
    state.sect.barrier = clamp(state.sect.barrier - rand(14, 28), 0, 100);
    state.sect.prestige = Math.max(0, state.sect.prestige - 35);
    attackers.forEach((r) => { r.attitude -= 8; r.power += rand(18, 42); });
    state.aiReports.push({
      sect: "敌对联军",
      attitude: -100,
      power: Math.round(attack),
      foundation: 0,
      items: [{ tone: "danger", text: `${attackers.map((r) => r.name).join("、")}结盟夜袭本宗，灵石 -${lostStones}，护山大阵受损，声望 -35。` }],
    });
    log(`${attackers.map((r) => r.name).join("、")}结成临时盟约夜袭山门，夺走 ${lostStones} 灵石，护山大阵受损。`, "warn");
  } else {
    state.sect.prestige += 70;
    state.sect.barrier = clamp(state.sect.barrier - rand(3, 10), 0, 100);
    attackers.forEach((r) => { r.attitude -= 16; r.power = Math.max(80, r.power - rand(45, 110)); r.grudges = (r.grudges || 0) + 1; });
    state.aiReports.push({
      sect: "敌对联军",
      attitude: -100,
      power: Math.round(attack),
      foundation: 0,
      items: [{ tone: "good", text: `${attackers.map((r) => r.name).join("、")}联手逼山，被本宗击退。声望 +70，敌宗战力下降。` }],
    });
    log(`${attackers.map((r) => r.name).join("、")}联手逼山，被本宗击退。诸宗震动，声望大涨。`, "good");
  }
}

function randomEvent() {
  const roll = Math.random();
  if (roll < 0.36) {
    const visitor = createDisciple();
    if (!state.recruitedThisYear && state.recruitPool.length < 4) state.recruitPool.push(visitor);
    log(`散修${visitor.name}路过山门，进入本年候选名册，是否收入门下由玩家决定。`, "good");
  } else if (roll < 0.64) {
    const rivals = activeRivals();
    if (!rivals.length) return;
    const target = pick(rivals);
    if (!target) return;
    target.attitude -= rand(8, 18);
    log(`${target.name}派人游说本宗弟子，双方关系转冷。`, "warn");
  } else {
    const count = rand(2, 4);
    addOpportunityNodes(count, "rumor");
    log(`山外传来 ${count} 处新机缘消息，可派弟子前往争夺。`, "good");
  }
}

function rivalHarass() {
  const hostile = activeRivals().filter((r) => r.attitude < 10).sort((a, b) => dist(a, state.sect) - dist(b, state.sect))[0];
  if (!hostile) return;
  const defense = sectPower() + state.sect.barrier * 6 + (state.sect.mountainFormation?.power || 0) * 0.65 + rand(0, 160);
  const attack = hostile.power + rand(0, 220);
  if (attack > defense) {
    const lost = Math.min(state.sect.stones, rand(90, 180));
    state.sect.stones -= lost;
    state.sect.barrier = clamp(state.sect.barrier - rand(8, 18), 0, 100);
    state.aiReports.push({
      sect: hostile.name,
      attitude: hostile.attitude,
      power: Math.round(hostile.power),
      foundation: Math.round(hostile.foundation || 0),
      items: [{ tone: "danger", text: `夜袭本宗外库，灵石 -${lost}，护山大阵受损。` }],
    });
    log(`${hostile.name}夜袭外库，夺走 ${lost} 灵石，护山大阵受损。`, "warn");
  } else {
    state.sect.prestige += 24;
    hostile.attitude -= 8;
    state.aiReports.push({
      sect: hostile.name,
      attitude: hostile.attitude,
      power: Math.round(hostile.power),
      foundation: Math.round(hostile.foundation || 0),
      items: [{ tone: "good", text: "试探本宗山门失败，被击退。本宗声望 +24。" }],
    });
    log(`${hostile.name}试探山门，被本宗击退，威名远播。`, "good");
  }
}

function refreshEvents() {
  for (const e of state.events) e.ttl -= 1;
  state.events = state.events.filter((e) => e.ttl > 0);
}

function recruit(discipleId) {
  if (!state.founded || state.recruitedThisYear) return;
  if (state.sect.stones < 80) {
    log("开山收徒需要 80 灵石，当前灵石不足。", "warn");
    return;
  }
  const d = state.recruitPool.find((item) => item.id === discipleId);
  if (!d) return;
  if (!spendAction(1, "开山收徒")) return;
  state.sect.stones -= 80;
  state.sect.disciples.push(d);
  state.recruitedThisYear = true;
  state.recruitPool = state.recruitPool.filter((item) => item.id !== discipleId);
  log(`${d.name}拜入山门，携带词条「${d.traits.map((t) => `${t.name}:${t.note}`).join("、")}」。`, "good");
  render();
}

function refreshRecruitment() {
  if (!state.founded || state.recruitedThisYear || state.refreshedRecruitment) return;
  state.refreshedRecruitment = true;
  state.recruitPool = createRecruitPool();
  log("本年候选弟子已刷新。每年仅有一次刷新机会。", "good");
  render();
}

function battle(target, mode = "raid") {
  if (!state.founded || !target) return false;
  if (target.alive === false) {
    log("此地只余宗门遗址，已经没有可交战的山门。", "warn");
    render();
    return false;
  }
  const actionCost = mode === "tournament" ? 2 : 1;
  if (!spendAction(actionCost, mode === "tournament" ? "宗门大比" : mode === "steal" ? "抢夺弟子" : "资源掠夺")) return false;
  const cost = mode === "tournament" ? 120 : 70;
  if (state.sect.grain < cost) {
    state.actionPoints += actionCost;
    log("粮草不足，无法远征。", "warn");
    render();
    return false;
  }
  state.sect.grain -= cost;
  showTacticModal(target, mode);
  return true;
}

function expeditionPower(mode, tactic) {
  const top = state.sect.disciples
    .slice()
    .sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a))
    .slice(0, mode === "steal" ? 4 : 5)
    .reduce((sum, d) => sum + discipleBattleScore(d), 0);
  const tacticFactor = tactic === "assault" ? 1.12 : tactic === "ambush" ? 1.03 : 0.96;
  const support = state.sect.barrier * 2.4 + formationPower() * 0.52 + state.sect.buildings.trainingHall * 70 + state.sect.buildings.scoutTower * 38;
  const economy = Math.sqrt(Math.max(0, state.sect.grain)) * 10 + Math.sqrt(Math.max(0, state.sect.stones)) * 7;
  const dao = daoLevelFor("sword") * 85 + daoLevelFor("array") * 45;
  const boon = state.yearlyBoon?.key === "battleBonus" ? 120 : 0;
  const steal = mode === "steal" ? traitBonus("charm") * 1.25 : 0;
  return top * tacticFactor + support + economy + dao + boon + steal + rand(0, 220);
}

function methodIdsByElement(element, fallback = "swordManual") {
  const ids = Object.values(methodCatalog).filter((method) => method.element === element).map((method) => method.id);
  return ids.length ? ids : [fallback];
}

function syntheticGuardian(name, power = 600, seed = "guardian") {
  const realm = clamp(Math.floor(Math.sqrt(Math.max(0, power)) / 14), 0, realms.length - 1);
  const base = Math.max(26, Math.round(power / (32 + realm * 3)));
  const element = pick(elementNames);
  const methods = methodIdsByElement(element).slice(0, 2).map((id, index) => ({
    id,
    quality: clamp(realm - 1 + index, 0, 4),
    proficiency: clamp(24 + realm * 8 + stableRange(`${seed}:${id}`, 0, 28), 0, 100),
  }));
  return {
    id: `guardian-${seed}`,
    name,
    realm,
    hp: 78 + realm * 28 + Math.round(base * 0.8),
    atk: base + realm * 18,
    def: Math.round(base * 0.75) + realm * 14,
    speed: 28 + realm * 9 + stableRange(`${seed}:speed`, 0, 18),
    temper: 48 + realm * 8,
    aptitude: 45 + realm * 7,
    luck: 35 + stableRange(`${seed}:luck`, 0, 18),
    elementDamage: { [element]: 12 + realm * 8 },
    methods,
    activeMethods: methods.map((method) => method.id),
  };
}

function combatantFromDisciple(d, name = d?.name || "参战者") {
  normalizeDiscipleProgression(d);
  return {
    source: d,
    name,
    realm: d.realm || 0,
    hpMax: Math.max(80, Math.round((d.hp || 1) * 10 + (d.realm || 0) * 120)),
    hp: Math.max(80, Math.round((d.hp || 1) * 10 + (d.realm || 0) * 120)),
    shield: Math.max(0, Number(d.shieldPower || 0) * 4),
    atk: Math.max(1, d.atk || 1),
    def: Math.max(0, d.def || 0),
    speed: Math.max(1, d.speed || 1),
    damagePct: Number(d.damagePct || 0),
    reducePct: Number(d.reducePct || 0),
    critPct: Number(d.critPct || 0),
    critDamage: Number(d.critDamage || 0),
    lifeSteal: Number(d.lifeSteal || 0),
    pierce: Number(d.pierce || 0),
    elementDamage: { ...(d.elementDamage || {}) },
    methods: Array.isArray(d.methods) ? d.methods : [],
    activeMethods: Array.isArray(d.activeMethods) ? d.activeMethods : [],
    methodIndex: 0,
  };
}

function nextCombatMethod(actor) {
  const active = actor.activeMethods || [];
  if (!active.length) return null;
  const id = active[actor.methodIndex % active.length];
  actor.methodIndex += 1;
  const known = actor.methods?.find((method) => method.id === id) || { id, quality: methodCatalog[id]?.rarity || 0, proficiency: 30 };
  const data = methodCatalog[id];
  return data ? { known, data, scale: methodEffectScale(known, data, actor.source) } : null;
}

function applyCombatHit(attacker, defender, method) {
  const data = method?.data || {};
  const scale = method?.scale || 1;
  const element = data.element || "";
  const elementDamage = element ? (attacker.elementDamage?.[element] || 0) + (data.elementDamage || 0) * scale : 0;
  const pierce = clamp((attacker.pierce || 0) + (data.pierce || 0) * scale, 0, 80);
  const effectiveDef = defender.def * (1 - pierce / 100);
  const crit = Math.random() * 100 < clamp(5 + (attacker.critPct || 0), 0, 70);
  const critScale = crit ? 1.5 + (attacker.critDamage || 0) / 100 : 1;
  const raw = attacker.atk * 3.2 + (data.atk || 0) * 7 * scale + elementDamage * 2.4 + attacker.realm * 42;
  const damageScale = 1 + ((attacker.damagePct || 0) + (data.damagePct || 0) * scale - (defender.reducePct || 0) - (data.selfHurt ? 0 : 0)) / 100;
  let damage = Math.max(8, Math.round((raw - effectiveDef * 1.65) * Math.max(0.25, damageScale) * critScale));
  const shieldTaken = Math.min(defender.shield || 0, damage);
  defender.shield = Math.max(0, (defender.shield || 0) - shieldTaken);
  damage -= shieldTaken;
  defender.hp = Math.max(0, defender.hp - damage);
  const heal = Math.round(((data.heal || 0) * 5 * scale) + damage * Math.max(0, attacker.lifeSteal || 0) / 100);
  if (heal) attacker.hp = Math.min(attacker.hpMax, attacker.hp + heal);
  const shield = Math.round((data.shield || 0) * 4 * scale);
  if (shield) attacker.shield += shield;
  if (data.selfHurt) attacker.hp = Math.max(1, attacker.hp - Math.round(data.selfHurt * 3 * scale));
  return {
    methodName: data.name || "普通攻击",
    element,
    damage,
    shieldTaken,
    heal,
    shield,
    crit,
  };
}

function simulateOneVsOneBattle(leftDisciple, rightDisciple, options = {}) {
  const left = combatantFromDisciple(leftDisciple, leftDisciple.name);
  const right = combatantFromDisciple(rightDisciple, rightDisciple.name);
  const logRows = [];
  const maxRounds = Number(options.maxRounds || 15);
  for (let round = 1; round <= maxRounds && left.hp > 0 && right.hp > 0; round += 1) {
    const order = left.speed + rand(0, 30) >= right.speed + rand(0, 30) ? [[left, right], [right, left]] : [[right, left], [left, right]];
    for (const [actor, defender] of order) {
      if (actor.hp <= 0 || defender.hp <= 0) continue;
      const method = nextCombatMethod(actor);
      const hit = applyCombatHit(actor, defender, method);
      logRows.push({
        round,
        actor: actor.name,
        target: defender.name,
        actorSide: actor === left ? "left" : "right",
        targetSide: defender === left ? "left" : "right",
        ...hit,
        leftHp: left.hp,
        rightHp: right.hp,
        leftShield: left.shield,
        rightShield: right.shield,
      });
    }
  }
  if (left.hp > 0 && right.hp > 0) {
    if (options.noPowerJudge) {
      logRows.push({ round: maxRounds, actor: "战斗结束", target: left.hp / left.hpMax >= right.hp / right.hpMax ? left.name : right.name, actorSide: "system", targetSide: "system", methodName: `${maxRounds}回合血线判定`, damage: 0, leftHp: left.hp, rightHp: right.hp, leftShield: left.shield, rightShield: right.shield });
    } else {
      const leftScore = discipleBattleScore(leftDisciple);
      const rightScore = discipleBattleScore(rightDisciple);
      if (leftScore >= rightScore) right.hp = 0;
      else left.hp = 0;
      logRows.push({ round: maxRounds, actor: "战力判定", target: leftScore >= rightScore ? left.name : right.name, actorSide: "system", targetSide: leftScore >= rightScore ? "right" : "left", methodName: `${maxRounds}回合未分胜负`, damage: 0, leftHp: left.hp, rightHp: right.hp, leftShield: left.shield, rightShield: right.shield });
    }
  }
  const won = left.hp > 0 && (right.hp <= 0 || left.hp / left.hpMax >= right.hp / right.hpMax);
  const htmlRows = logRows.slice(0, 24).map((row) => `
    <p><strong>第${row.round}合 ${tradeEscape(row.actor)}</strong> 使用 ${tradeEscape(row.methodName)} 攻向 ${tradeEscape(row.target)}，造成 ${Math.round(row.damage || 0)}${row.element ? ` ${tradeEscape(row.element)}伤` : ""}${row.crit ? "，会心" : ""}${row.shieldTaken ? `，破盾 ${row.shieldTaken}` : ""}${row.heal ? `，回血 ${row.heal}` : ""}${row.shield ? `，护盾 +${row.shield}` : ""}。</p>
  `).join("");
  const html = `
    <div class="duel-stage">
      <div class="duel-fighter ${won ? "is-winner" : ""}"><span>${tradeEscape(left.name)}</span><i style="width:${Math.max(0, left.hp / left.hpMax * 100)}%"></i><em>${Math.max(0, Math.round(left.hp))}/${left.hpMax}</em></div>
      <div class="duel-fighter ${!won ? "is-winner" : ""}"><span>${tradeEscape(right.name)}</span><i style="width:${Math.max(0, right.hp / right.hpMax * 100)}%"></i><em>${Math.max(0, Math.round(right.hp))}/${right.hpMax}</em></div>
    </div>
    <div class="auction-feed duel-log">${htmlRows}</div>
  `;
  return { won, left, right, html, rows: logRows };
}

function setModalActionButtons(actions = []) {
  els.modalActions.innerHTML = "";
  for (const action of actions) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = action.label;
    btn.disabled = Boolean(action.disabled);
    btn.addEventListener("click", () => runActionWithFeedback(action.label, action.handler));
    els.modalActions.appendChild(btn);
  }
}

function hpPct(value, max) {
  return `${clamp(Math.round((Math.max(0, value) / Math.max(1, max)) * 100), 0, 100)}%`;
}

function showRealtimeDuelModal({ kicker = "实时斗法", title = "弟子斗法", duel, leftLabel = "本宗", rightLabel = "敌方", scores = null, onComplete = null }) {
  const rows = duel?.rows || [];
  let index = -1;
  let finished = false;
  let timer = null;
  const leftMax = duel.left.hpMax;
  const rightMax = duel.right.hpMax;
  const body = `
    <div class="realtime-duel" data-phase="playing">
      <div class="realtime-fighters">
        <div class="realtime-fighter left">
          <strong>${tradeEscape(duel.left.name)}</strong>
          <span>${tradeEscape(leftLabel)}</span>
          <div class="realtime-hp"><i class="left-hp" style="width:100%"></i></div>
          <em class="left-hp-text">${leftMax}/${leftMax}</em>
          <small class="left-shield">护盾 ${Math.round(duel.rows[0]?.leftShield || 0)}</small>
        </div>
        <div class="realtime-center">
          <b>VS</b>
          <span class="realtime-round">准备</span>
        </div>
        <div class="realtime-fighter right">
          <strong>${tradeEscape(duel.right.name)}</strong>
          <span>${tradeEscape(rightLabel)}</span>
          <div class="realtime-hp"><i class="right-hp" style="width:100%"></i></div>
          <em class="right-hp-text">${rightMax}/${rightMax}</em>
          <small class="right-shield">护盾 ${Math.round(duel.rows[0]?.rightShield || 0)}</small>
        </div>
      </div>
      <div class="realtime-action">
        <strong class="realtime-method">斗法开始</strong>
        <span class="realtime-damage">双方运转功法，气机交锋。</span>
      </div>
      <div class="realtime-log"></div>
      ${scores ? `<div class="battle-breakdown">
        <div><span>我方战力</span><strong>${Math.round(scores.our || 0)}</strong></div>
        <div><span>敌方压力</span><strong>${Math.round(scores.enemy || 0)}</strong></div>
        <div><span>结果</span><strong class="realtime-result">播放中</strong></div>
      </div>` : ""}
    </div>
  `;
  showModal({ kicker, title, body, actions: [{ label: "跳过动画", handler: () => finish(true) }] });
  els.modalCloseBtn.onclick = () => finish(true);
  const root = els.modalBody.querySelector(".realtime-duel");
  const logBox = els.modalBody.querySelector(".realtime-log");
  const updateBars = (row = null) => {
    const leftHp = row ? row.leftHp : leftMax;
    const rightHp = row ? row.rightHp : rightMax;
    root.querySelector(".left-hp").style.width = hpPct(leftHp, leftMax);
    root.querySelector(".right-hp").style.width = hpPct(rightHp, rightMax);
    root.querySelector(".left-hp-text").textContent = `${Math.max(0, Math.round(leftHp))}/${leftMax}`;
    root.querySelector(".right-hp-text").textContent = `${Math.max(0, Math.round(rightHp))}/${rightMax}`;
    root.querySelector(".left-shield").textContent = `护盾 ${Math.round(row?.leftShield || 0)}`;
    root.querySelector(".right-shield").textContent = `护盾 ${Math.round(row?.rightShield || 0)}`;
  };
  const pushLog = (row) => {
    const text = row.actorSide === "system"
      ? `${row.methodName || "回合结束"}，${row.target}胜出。`
      : `${row.actor}施展${row.methodName}，对${row.target}造成${Math.round(row.damage || 0)}${row.element ? row.element + "伤" : "伤害"}${row.crit ? "，会心一击" : ""}${row.shieldTaken ? `，破盾${row.shieldTaken}` : ""}${row.heal ? `，回血${row.heal}` : ""}${row.shield ? `，护盾+${row.shield}` : ""}。`;
    logBox.insertAdjacentHTML("afterbegin", `<p>${tradeEscape(text)}</p>`);
    logBox.scrollTop = 0;
  };
  const step = () => {
    if (finished) return;
    index += 1;
    if (index >= rows.length) {
      finish(false);
      return;
    }
    const row = rows[index];
    updateBars(row);
    root.querySelector(".realtime-round").textContent = `第 ${row.round} 合`;
    root.querySelector(".realtime-method").textContent = row.methodName;
    root.querySelector(".realtime-damage").textContent = row.actorSide === "system"
      ? `${row.target}在${row.methodName || "回合判定"}中胜出`
      : `${row.actor} → ${row.target}：${Math.round(row.damage || 0)}${row.element ? row.element + "伤" : "伤害"}`;
    root.querySelectorAll(".realtime-fighter").forEach((node) => node.classList.remove("is-acting", "is-hit"));
    if (row.actorSide !== "system") root.querySelector(`.realtime-fighter.${row.actorSide}`)?.classList.add("is-acting");
    if (row.targetSide !== "system") root.querySelector(`.realtime-fighter.${row.targetSide}`)?.classList.add("is-hit");
    root.querySelector(".realtime-action").classList.remove("flash");
    void root.querySelector(".realtime-action").offsetWidth;
    root.querySelector(".realtime-action").classList.add("flash");
    pushLog(row);
    timer = setTimeout(step, 760);
  };
  const finish = (skipped = false) => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    const finalRow = rows[rows.length - 1];
    updateBars(finalRow);
    root.dataset.phase = "done";
    root.querySelector(".realtime-result")?.replaceChildren(document.createTextNode(duel.won ? "胜" : "败"));
    root.querySelector(".realtime-method").textContent = duel.won ? "胜负已分" : "斗法失利";
    root.querySelector(".realtime-damage").textContent = skipped ? "已跳过动画，等待结算。" : "实时斗法结束，等待结算。";
    setModalActionButtons([
      { label: duel.won ? "结算胜利" : "结算失败", handler: () => { closeModal(); onComplete?.(); } },
    ]);
    els.modalCloseBtn.onclick = () => { closeModal(); onComplete?.(); };
  };
  updateBars();
  timer = setTimeout(step, 450);
}

function frontierMonsterFromPower(name, power, seed = "frontier", hpScale = 1) {
  const monster = syntheticGuardian(name, power, seed);
  monster.hp = Math.round((monster.hp || 80) * hpScale);
  monster.atk = Math.round((monster.atk || 40) * (1 + Math.min(0.55, power / 18000)));
  monster.def = Math.round((monster.def || 30) * (1 + Math.min(0.42, power / 22000)));
  monster.speed = Math.round((monster.speed || 30) * 0.92);
  monster.temper = 70 + monster.realm * 8;
  monster.aptitude = 60 + monster.realm * 6;
  monster.name = name;
  return monster;
}

function simulateTeamVsMonsterBattle(team, monsterData, options = {}) {
  const members = team.map((d) => combatantFromDisciple(d, d.name));
  const monster = combatantFromDisciple(monsterData, monsterData.name);
  if (options.monsterHp) {
    monster.hpMax = Math.max(1, Math.round(options.monsterHpMax || options.monsterHp));
    monster.hp = Math.max(1, Math.round(options.monsterHp));
  }
  const rows = [];
  let totalDamage = 0;
  const maxRounds = Number(options.maxRounds || 15);
  for (let round = 1; round <= maxRounds && monster.hp > 0 && members.some((m) => m.hp > 0); round += 1) {
    const order = [...members, monster]
      .filter((actor) => actor.hp > 0)
      .sort((a, b) => (b.speed + rand(0, 28)) - (a.speed + rand(0, 28)));
    for (const actor of order) {
      if (actor.hp <= 0 || monster.hp <= 0 || !members.some((m) => m.hp > 0)) continue;
      if (actor === monster) {
        const targets = members.filter((m) => m.hp > 0).sort((a, b) => a.hp / a.hpMax - b.hp / b.hpMax);
        const target = targets[0] || pick(members.filter((m) => m.hp > 0));
        if (!target) continue;
        const hit = applyCombatHit(monster, target, nextCombatMethod(monster));
        rows.push({
          round,
          actor: monster.name,
          target: target.name,
          actorSide: "monster",
          targetSide: "team",
          targetIndex: members.indexOf(target),
          ...hit,
          monsterHp: monster.hp,
          monsterShield: monster.shield,
          teamHp: members.map((m) => m.hp),
          teamShield: members.map((m) => m.shield),
        });
      } else {
        const before = monster.hp;
        const hit = applyCombatHit(actor, monster, nextCombatMethod(actor));
        totalDamage += Math.max(0, before - monster.hp);
        rows.push({
          round,
          actor: actor.name,
          target: monster.name,
          actorSide: "team",
          targetSide: "monster",
          actorIndex: members.indexOf(actor),
          ...hit,
          monsterHp: monster.hp,
          monsterShield: monster.shield,
          teamHp: members.map((m) => m.hp),
          teamShield: members.map((m) => m.shield),
        });
      }
    }
  }
  const teamAlive = members.some((m) => m.hp > 0);
  let won = monster.hp <= 0;
  if (!options.noPowerJudge && !won && teamAlive) {
    const ourPower = team.reduce((sum, d) => sum + frontierDisciplePower(d), 0);
    const enemyPower = Number(options.enemyPower || discipleBattleScore(monsterData));
    if (ourPower + totalDamage * 1.55 >= enemyPower) {
      won = true;
      monster.hp = 0;
      rows.push({
        round: maxRounds,
        actor: "战力判定",
        target: monster.name,
        actorSide: "system",
        targetSide: "monster",
        methodName: `${maxRounds}回合压制`,
        damage: 0,
        monsterHp: 0,
        monsterShield: monster.shield,
        teamHp: members.map((m) => m.hp),
        teamShield: members.map((m) => m.shield),
      });
    }
  }
  return { members, monster, rows, totalDamage: Math.round(totalDamage), won, teamAlive };
}

function showRealtimeTeamBattleModal({ kicker = "边境战斗", title = "队伍斗法", battle, teamLabel = "讨伐队", enemyLabel = "妖兽", scores = null, onComplete = null }) {
  const rows = battle?.rows || [];
  let index = -1;
  let finished = false;
  let timer = null;
  const teamHtml = battle.members.map((member, i) => `
    <article class="team-member" data-index="${i}">
      <strong>${tradeEscape(member.name)}</strong>
      <div class="realtime-hp"><i class="team-hp-${i}" style="width:100%"></i></div>
      <em class="team-hp-text-${i}">${member.hpMax}/${member.hpMax}</em>
    </article>
  `).join("");
  const body = `
    <div class="team-battle" data-phase="playing">
      <div class="team-battle-grid">
        <section class="team-side">
          <h4>${tradeEscape(teamLabel)}</h4>
          ${teamHtml}
        </section>
        <section class="monster-side">
          <h4>${tradeEscape(enemyLabel)}</h4>
          <div class="monster-card">
            <strong>${tradeEscape(battle.monster.name)}</strong>
            <div class="realtime-hp"><i class="monster-hp" style="width:100%"></i></div>
            <em class="monster-hp-text">${battle.monster.hpMax}/${battle.monster.hpMax}</em>
            <small class="monster-shield">护盾 ${Math.round(battle.monster.shield || 0)}</small>
          </div>
        </section>
      </div>
      <div class="realtime-action">
        <strong class="realtime-method">战斗开始</strong>
        <span class="realtime-damage">队伍列阵，妖气压境。</span>
      </div>
      <div class="realtime-log"></div>
      ${scores ? `<div class="battle-breakdown">
        <div><span>本宗队伍</span><strong>${Math.round(scores.our || 0)}</strong></div>
        <div><span>敌方强度</span><strong>${Math.round(scores.enemy || 0)}</strong></div>
        <div><span>累计伤害</span><strong class="team-total-damage">0</strong></div>
      </div>` : ""}
    </div>
  `;
  showModal({ kicker, title, body, actions: [{ label: "跳过动画", handler: () => finish(true) }] });
  els.modalCloseBtn.onclick = () => finish(true);
  const root = els.modalBody.querySelector(".team-battle");
  const logBox = els.modalBody.querySelector(".realtime-log");
  const updateBars = (row = null) => {
    const teamHp = row?.teamHp || battle.members.map((m) => m.hpMax);
    teamHp.forEach((hp, i) => {
      const member = battle.members[i];
      const bar = root.querySelector(`.team-hp-${i}`);
      const text = root.querySelector(`.team-hp-text-${i}`);
      if (bar) bar.style.width = hpPct(hp, member.hpMax);
      if (text) text.textContent = `${Math.max(0, Math.round(hp))}/${member.hpMax}`;
    });
    const monsterHp = row ? row.monsterHp : battle.monster.hpMax;
    root.querySelector(".monster-hp").style.width = hpPct(monsterHp, battle.monster.hpMax);
    root.querySelector(".monster-hp-text").textContent = `${Math.max(0, Math.round(monsterHp))}/${battle.monster.hpMax}`;
    root.querySelector(".monster-shield").textContent = `护盾 ${Math.round(row?.monsterShield || 0)}`;
    if (root.querySelector(".team-total-damage")) {
      const currentDamage = row ? Math.max(0, battle.monster.hpMax - Math.max(0, row.monsterHp || 0)) : 0;
      root.querySelector(".team-total-damage").textContent = Math.round(currentDamage);
    }
  };
  const pushLog = (row) => {
    const text = row.actorSide === "system"
      ? `${row.target}被${row.methodName || "回合判定"}压制，战局转为胜利。`
      : `${row.actor}施展${row.methodName}，对${row.target}造成${Math.round(row.damage || 0)}${row.element ? row.element + "伤" : "伤害"}${row.crit ? "，会心" : ""}${row.shieldTaken ? `，破盾${row.shieldTaken}` : ""}${row.heal ? `，回血${row.heal}` : ""}${row.shield ? `，护盾+${row.shield}` : ""}。`;
    logBox.insertAdjacentHTML("afterbegin", `<p>${tradeEscape(text)}</p>`);
  };
  const step = () => {
    if (finished) return;
    index += 1;
    if (index >= rows.length) {
      finish(false);
      return;
    }
    const row = rows[index];
    updateBars(row);
    root.querySelector(".realtime-method").textContent = row.methodName || "普通攻击";
    root.querySelector(".realtime-damage").textContent = row.actorSide === "system"
      ? `${row.target}被压制`
      : `${row.actor} → ${row.target}：${Math.round(row.damage || 0)}${row.element ? row.element + "伤" : "伤害"}`;
    root.querySelectorAll(".team-member,.monster-card").forEach((node) => node.classList.remove("is-acting", "is-hit"));
    if (row.actorSide === "team") root.querySelector(`.team-member[data-index="${row.actorIndex}"]`)?.classList.add("is-acting");
    if (row.targetSide === "team") root.querySelector(`.team-member[data-index="${row.targetIndex}"]`)?.classList.add("is-hit");
    if (row.actorSide === "monster") root.querySelector(".monster-card")?.classList.add("is-acting");
    if (row.targetSide === "monster") root.querySelector(".monster-card")?.classList.add("is-hit");
    root.querySelector(".realtime-action").classList.remove("flash");
    void root.querySelector(".realtime-action").offsetWidth;
    root.querySelector(".realtime-action").classList.add("flash");
    pushLog(row);
    timer = setTimeout(step, 520);
  };
  const finish = (skipped = false) => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    const finalRow = rows[rows.length - 1];
    updateBars(finalRow);
    root.dataset.phase = "done";
    root.querySelector(".realtime-method").textContent = battle.won ? "战斗胜利" : "战斗结束";
    root.querySelector(".realtime-damage").textContent = skipped ? "已跳过动画，等待结算。" : "回合制战斗播放完毕，等待结算。";
    setModalActionButtons([{ label: battle.won ? "结算胜利" : "结算战果", handler: () => { closeModal(); onComplete?.(); } }]);
    els.modalCloseBtn.onclick = () => { closeModal(); onComplete?.(); };
  };
  updateBars();
  timer = setTimeout(step, 420);
}

function showTacticModal(target, mode) {
  const labels = {
    raid: "资源掠夺",
    steal: "抢夺弟子",
    tournament: "宗门大比",
  };
  const roster = state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a));
  showModal({
    kicker: "战前部署",
    title: `${labels[mode]}：${target.name}`,
    body: `
      <div class="battle-stage">
        <div class="fighter left">本宗</div>
        <div class="slash"></div>
        <div class="fighter right">${target.name.slice(0, 2)}</div>
      </div>
      <p>选择一名出战弟子与对方驻守弟子斗法。强攻收益高风险高；奇袭适合抢徒；稳守能减少失败损失。</p>
      <div class="tournament-table">
        ${roster.map((d, index) => `<label class="match-row"><span>${d.name}<div class="hp-line"><i style="width:${clamp(d.hp, 0, 180) / 1.8}%"></i></div></span><strong>${realms[d.realm]} · 战力 ${Math.round(discipleBattleScore(d))}</strong><input type="radio" name="battle-disciple" value="${d.id}" ${index === 0 ? "checked" : ""}></label>`).join("")}
      </div>
    `,
    actions: [
      { label: "强攻", handler: () => { const id = els.modalBody.querySelector("input[name='battle-disciple']:checked")?.value; closeModal(); resolveBattle(target, mode, "assault", id); } },
      { label: "奇袭", handler: () => { const id = els.modalBody.querySelector("input[name='battle-disciple']:checked")?.value; closeModal(); resolveBattle(target, mode, "ambush", id); } },
      { label: "稳守", handler: () => { const id = els.modalBody.querySelector("input[name='battle-disciple']:checked")?.value; closeModal(); resolveBattle(target, mode, "guard", id); } },
    ],
  });
}

function resolveBattle(target, mode, tactic, discipleId = null) {
  if (!target || target.alive === false) {
    log("此地只余宗门遗址，已经没有可交战的山门。", "warn");
    render();
    return;
  }
  state.sect.diplomacy = state.sect.diplomacy || { reputation: 20, infamy: 0 };
  const d = state.sect.disciples.find((item) => item.id === discipleId) || state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a))[0];
  if (!d) {
    log("没有可出战弟子。", "warn");
    render();
    return;
  }
  const enemyAlert = (target.grudges || 0) * 115 + (target.attitude < -30 ? 180 : 0);
  const eraGuard = state.year >= 7 ? state.year * 58 + (target.foundation || 100) * 1.1 : state.year * 26;
  const allianceGuard = activeRivals().filter((r) => r.alliance && r.id !== target.id).length * 55;
  const enemy = rivalStrategicPower(target) * (mode === "steal" ? 0.68 : 0.78) + enemyAlert + eraGuard + allianceGuard + rand(80, 260);
  const guardian = syntheticGuardian(`${target.name.replace("遗址·", "").slice(0, 2)}守`, enemy, `${target.id}:${mode}:${state.year}`);
  const duel = simulateOneVsOneBattle(d, guardian, { mode, tactic });
  const our = discipleBattleScore(d);
  showRealtimeDuelModal({
    kicker: "宗门斗法",
    title: `${d.name} 挑战 ${target.name}`,
    duel,
    leftLabel: state.sect.name,
    rightLabel: target.name,
    scores: { our, enemy },
    onComplete: () => applyRivalBattleOutcome(target, mode, tactic, d, duel, our, enemy),
  });
}

function applyRivalBattleOutcome(target, mode, tactic, d, duel, our, enemy) {
  if (duel.won) {
    const gainScale = tactic === "assault" ? 1.25 : tactic === "guard" ? 0.82 : 1;
    const gain = Math.min(target.stones || 500, Math.round(rand(110, 260) * gainScale));
    state.sect.stones += gain;
    state.sect.prestige += mode === "tournament" ? 80 : 34;
    target.stones = Math.max(0, (target.stones || 0) - gain);
    target.attitude = (target.attitude || 0) - 18;
    target.grudges = (target.grudges || 0) + 1;
    state.sect.diplomacy.infamy += mode === "steal" ? 8 : 5;
    target.foundation = Math.max(0, (target.foundation || 100) - Math.round((tactic === "assault" ? 34 : 22) + gain / 18));
    target.power = Math.max(60, target.power - rand(35, 95));
    if (mode === "steal" && Math.random() > 0.45) {
      const d = createDisciple({ minRealm: 0, maxRealm: clamp(Math.floor((target.alchemy + target.forging) / 5), 1, 4), expMax: 80 });
      state.sect.disciples.push(d);
      const text = `本宗压过${target.name}，${d.name}转投山门，并带来 ${gain} 灵石。`;
      log(text, "good");
      showBattleModal(target, true, text, { our, enemy });
    } else {
      const text = `${d.name}击败${target.name}驻守弟子，夺得 ${gain} 灵石，声望上涨。`;
      log(text, "good");
      showBattleModal(target, true, text, { our, enemy });
    }
    if (target.foundation <= 0) eliminateRival(target, mode);
  } else {
    const lostScale = tactic === "guard" ? 0.55 : tactic === "assault" ? 1.25 : 1;
    const lost = Math.min(state.sect.stones, Math.round(rand(70, 180) * lostScale));
    state.sect.stones -= lost;
    state.sect.barrier = clamp(state.sect.barrier - rand(2, 10), 0, 100);
    target.attitude = (target.attitude || 0) - 8;
    target.grudges = (target.grudges || 0) + 1;
    state.sect.diplomacy.infamy += 2;
    const text = `${d.name}挑战${target.name}驻守弟子失利，本宗损失 ${lost} 灵石。`;
    adjustMind(d, 8, "远征斗法失利");
    d.hp = Math.max(18, d.hp - rand(4, 12));
    log(text, "warn");
    showBattleModal(target, false, text, { our, enemy });
  }
  render();
}

function eliminateRival(target, mode) {
  target.alive = false;
  target.alliance = false;
  target.power = 0;
  target.attitude = -100;
  target.name = `遗址·${target.name}`;
  const captured = Math.max(90, Math.round((target.stones || 0) * 0.35));
  state.sect.stones += captured;
  state.sect.prestige += mode === "steal" ? 70 : 110;
  state.resources.filter((r) => r.owner === target.id).forEach((r) => { r.owner = "player"; });
  log(`${target.name.replace("遗址·", "")}底蕴耗尽，山门崩解。本宗接管其部分资源点，并缴获 ${captured} 灵石。`, "good");
}

function contestResource(resource) {
  if (!state.founded) return;
  const roster = state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a));
  const holder = resource.owner && resource.owner !== "player" ? state.rivals.find((r) => r.id === resource.owner && r.alive !== false) : null;
  showModal({
    kicker: "资源争夺",
    title: `争夺${resource.name}`,
    body: `
      <p>选择一名弟子挑战${holder ? `${holder.name}驻守弟子` : "地脉守势"}。胜利后占领资源点，失败会损失粮草和灵石。</p>
      <div class="tournament-table">
        ${roster.map((d, index) => `<label class="match-row"><span>${d.name}<div class="hp-line"><i style="width:${clamp(d.hp, 0, 180) / 1.8}%"></i></div></span><strong>${realms[d.realm]} · 战力 ${Math.round(discipleBattleScore(d))}</strong><input type="radio" name="resource-disciple" value="${d.id}" ${index === 0 ? "checked" : ""}></label>`).join("")}
      </div>
    `,
    actions: [
      { label: "发起争夺", handler: () => {
        const id = els.modalBody.querySelector("input[name='resource-disciple']:checked")?.value;
        closeModal();
        resolveResourceContest(resource, id);
      } },
      { label: "暂不争夺", handler: closeModal },
    ],
  });
}

function resolveResourceContest(resource, discipleId = null) {
  if (!state.founded || !resource) return;
  const holder = resource.owner && resource.owner !== "player" ? state.rivals.find((r) => r.id === resource.owner && r.alive !== false) : null;
  const enemyPower = holder ? rivalStrategicPower(holder, resource) + rand(0, 260) : wildResourceDefense(resource);
  const d = state.sect.disciples.find((item) => item.id === discipleId) || state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a))[0];
  if (!d) {
    log("没有可出战弟子。", "warn");
    render();
    return;
  }
  if (!spendAction(1, "争夺资源")) return;
  const guardian = syntheticGuardian(holder ? `${holder.name.slice(0, 2)}守` : `${resource.name.slice(0, 2)}灵`, enemyPower * 0.82, `${resource.id}:${holder?.id || "wild"}:${state.year}`);
  const duel = simulateOneVsOneBattle(d, guardian, { mode: "resource" });
  const our = discipleBattleScore(d);
  showRealtimeDuelModal({
    kicker: "资源争夺",
    title: `${d.name} 争夺 ${resource.name}`,
    duel,
    leftLabel: state.sect.name,
    rightLabel: holder ? holder.name : "地脉守势",
    scores: { our, enemy: enemyPower },
    onComplete: () => applyResourceContestOutcome(resource, holder, d, duel, our, enemyPower),
  });
}

function applyResourceContestOutcome(resource, holder, d, duel, our, enemyPower) {
  const scores = { our, enemy: enemyPower };
  if (duel.won) {
    const oldOwner = resource.owner;
    resource.owner = "player";
    state.sect.prestige += 18;
    if (holder) {
      holder.attitude -= 18;
      holder.foundation = Math.max(0, (holder.foundation || 100) - Math.round(resource.value / 10));
      holder.power = Math.max(60, holder.power - rand(18, 48));
    }
    const detail = holder
      ? `${d.name}击败${holder.name}驻守弟子，夺下${resource.name}，守方底蕴受损。`
      : `${d.name}破开地脉守势，设下阵旗，占下${resource.name}。`;
    applyResourceCaptureBonus(resource);
    log(`${detail}每年资源收益提升。`, "good");
    showResourceBattleModal(resource, holder, true, detail, scores);
    if (holder && holder.foundation <= 0) eliminateRival(holder, "raid");
    if (oldOwner && oldOwner !== "player" && !holder) log("原占据者已不成宗门，此地转为本宗控制。", "good");
  } else {
    const grainLost = Math.min(state.sect.grain, rand(65, 130));
    const stoneLost = Math.min(state.sect.stones, holder ? rand(45, 95) : rand(20, 60));
    state.sect.grain -= grainLost;
    state.sect.stones -= stoneLost;
    if (holder) {
      holder.attitude -= 8;
      holder.power += rand(12, 28);
    }
    adjustMind(d, 5, "资源争夺失利");
    d.hp = Math.max(18, d.hp - rand(3, 9));
    const detail = holder
      ? `${holder.name}守住${resource.name}，${d.name}负伤撤回，本宗折损粮草 ${grainLost}、灵石 ${stoneLost}。`
      : `${resource.name}地脉反噬，${d.name}未能立稳阵脚，折损粮草 ${grainLost}、灵石 ${stoneLost}。`;
    log(detail, "warn");
    showResourceBattleModal(resource, holder, false, detail, scores);
  }
  render();
}

function applyResourceCaptureBonus(resource) {
  if (resource.kind === "mine") {
    state.sect.forgingMats += 1;
    state.sect.stones += Math.round(resource.value * 1.2);
    log(`${resource.name}开出首批矿髓，器材 +1，灵石小幅增加。`, "good");
  } else if (resource.kind === "herb") {
    state.sect.alchemyMats += 1;
    state.sect.grain += Math.round(resource.value * 0.9);
    log(`${resource.name}采得首批灵草，丹材 +1，粮草增加。`, "good");
  } else if (resource.kind === "spring") {
    state.sect.alchemyMats += 1;
    state.sect.barrier = clamp(state.sect.barrier + 8, 0, 100);
    state.sect.disciples.forEach((d) => { d.exp += 4; });
    log(`${resource.name}灵泉入阵，丹材 +1，护山大阵与弟子修行略有提升。`, "good");
  }
}

function openFrontierDungeon(dungeon) {
  if (!frontierUnlocked()) {
    log("边境妖域需要 3 名金丹及以上弟子方可入驻。", "warn");
    return;
  }
  const roster = state.sect.disciples
    .slice()
    .sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0) || frontierDisciplePower(b) - frontierDisciplePower(a));
  showModal({
    kicker: "边境讨伐",
    title: `${dungeon.name}：选择最多 5 名弟子`,
    body: `
      <p>${dungeon.text} 推荐战力 ${Math.round(dungeon.value)}。妖兽同阶更强，建议携带回血丹。元婴以上晋升材料主要来自此类副本。</p>
      <div class="adventure-roster">
        ${roster.map((d, i) => `<label class="adventure-candidate ${d.core ? "is-core" : ""}">
          <input class="frontier-team" type="checkbox" value="${d.id}" ${i < 3 ? "checked" : ""} />
          <div><strong>${d.core ? "核心·" : ""}${d.name}</strong><span>${realms[d.realm]} · 边境战力 ${Math.round(frontierDisciplePower(d))} · 体${d.hp} 攻${d.atk} 御${d.def}</span></div>
        </label>`).join("")}
      </div>
      <p>可用回血丹：回春丹 ${itemCount("minorHealPill")}，玉露还元丹 ${itemCount("midHealPill")}，九转续命丹 ${itemCount("highHealPill")}。</p>
    `,
    actions: [
      { label: "开始讨伐", handler: () => startFrontierDungeon(dungeon) },
      { label: "取消", handler: closeModal },
    ],
  });
  for (const box of els.modalBody.querySelectorAll(".frontier-team")) {
    box.addEventListener("change", () => {
      const checked = [...els.modalBody.querySelectorAll(".frontier-team:checked")];
      if (checked.length > 5) {
        box.checked = false;
        flashFeedback("最多派遣 5 名弟子。", "warn");
      }
    });
  }
}

function startFrontierDungeon(dungeon) {
  const ids = [...els.modalBody.querySelectorAll(".frontier-team:checked")].map((box) => box.value).slice(0, 5);
  const team = ids.map((id) => state.sect.disciples.find((d) => d.id === id)).filter(Boolean);
  if (!team.length) {
    flashFeedback("至少选择 1 名弟子。", "warn");
    return;
  }
  if (!spendAction(1, "边境讨伐")) return;
  closeModal();
  resolveFrontierDungeon(dungeon, team, 0);
}

function frontierDisciplePower(d) {
  const relicBoost = d.equipment?.relic?.id === "starShard" ? 90 : 0;
  return discipleBattleScore(d) * 0.92 + traitBonusOnDisciple(d, "beast") * 12 + d.realm * 70 + daoLevelFor("sword") * 45 + relicBoost;
}

function bestHealingPillSlot() {
  return state.sect.inventory
    .filter((slot) => itemCatalog[slot.id]?.combatHeal && slot.count > 0)
    .sort((a, b) => (itemCatalog[b.id].combatHeal + (b.quality || 0) * 12) - (itemCatalog[a.id].combatHeal + (a.quality || 0) * 12))[0] || null;
}

function resolveFrontierDungeon(dungeon, team, healBoost = 0) {
  const our = team.reduce((sum, d) => sum + frontierDisciplePower(d), 0) + state.sect.barrier * 3 + healBoost + rand(0, 260);
  const enemy = dungeon.value + dungeon.tier * rand(80, 160) + rand(0, 420);
  const monster = frontierMonsterFromPower(`${dungeon.name.slice(0, 4)}首领`, enemy, `${dungeon.id}:${state.year}:${healBoost}`, 1 + dungeon.tier * 0.12);
  const battle = simulateTeamVsMonsterBattle(team, monster, { enemyPower: enemy, maxRounds: 15 });
  showRealtimeTeamBattleModal({
    kicker: "边境讨伐",
    title: `${dungeon.name}：回合战斗`,
    battle,
    teamLabel: "讨伐队",
    enemyLabel: dungeon.name,
    scores: { our, enemy },
    onComplete: () => resolveFrontierDungeonAfterBattle(dungeon, team, battle, our, enemy, healBoost),
  });
}

function resolveFrontierDungeonAfterBattle(dungeon, team, battle, our, enemy, healBoost = 0) {
  const won = battle.won;
  const pill = bestHealingPillSlot();
  const teamNames = team.map((d) => d.name).join("、");
  const battleHtml = `
    <div class="battle-stage frontier-battle">
      <div class="fighter left">${team[0]?.name.slice(0, 2) || "本宗"}</div>
      <div class="slash"></div>
      <div class="fighter right">${dungeon.glyph || "妖"}</div>
    </div>
    <div class="battle-breakdown">
      <div><span>讨伐队</span><strong>${Math.round(our)}</strong></div>
      <div><span>妖兽群</span><strong>${Math.round(enemy)}</strong></div>
      <div><span>推荐</span><strong>${Math.round(dungeon.value)}</strong></div>
    </div>
    <p>出战：${teamNames}</p>
  `;
  if (!won && pill && healBoost <= 0) {
    showModal({
      kicker: "边境讨伐",
      title: `${dungeon.name} 陷入苦战`,
      body: `${battleHtml}<p>妖兽攻势压过讨伐队。可消耗 ${qualityNames[pill.quality || 0]}${itemCatalog[pill.id].name} 进行战中补给，获得一次续战机会。</p>`,
      actions: [
        { label: `服丹续战`, handler: () => {
          consumeItemCount(pill.id, 1);
          team.forEach((d) => { d.hp += Math.round((itemCatalog[pill.id].combatHeal || 20) * 0.35); });
          closeModal();
          resolveFrontierDungeon(dungeon, team, (itemCatalog[pill.id].combatHeal || 20) * 16 + (pill.quality || 0) * 90);
        } },
        { label: "撤退认负", handler: () => finishFrontierDungeon(dungeon, team, false, our, enemy) },
      ],
    });
    return;
  }
  finishFrontierDungeon(dungeon, team, won, our, enemy);
}

function finishFrontierDungeon(dungeon, team, won, our, enemy) {
  if (won) {
    applyRewardToSect(dungeon.reward, "边境讨伐");
    const materialChance = clamp(54 + team.reduce((s, d) => s + d.luck, 0) / Math.max(1, team.length * 12) - dungeon.tier * 3, 32, 78);
    const gotMaterial = rand(1, 100) <= materialChance;
    if (gotMaterial) addItem(dungeon.material, 1, 0);
    if (dungeon.reward?.alchemyMats || gotMaterial) {
      const extra = Math.max(1, Math.floor(dungeon.tier / 2));
      state.sect.alchemyMats += extra;
      grantAlchemyMaterialsFromEvent({ name: dungeon.name, materialRich: dungeon.reward?.alchemyMats }, extra);
    }
    const expGain = 10 + dungeon.tier * 4;
    team.forEach((d) => { d.exp += expGain; d.status = "边境归来"; });
    state.frontier.clears = (state.frontier.clears || 0) + 1;
    state.frontier.dungeons = state.frontier.dungeons.filter((item) => item.id !== dungeon.id);
    log(`讨伐${dungeon.name}获胜，${gotMaterial ? `获得${itemCatalog[dungeon.material].name}` : `${itemCatalog[dungeon.material].name}未掉落`}，并推进边境威望。`, gotMaterial ? "good" : "warn");
  } else {
    team.forEach((d) => {
      d.hp = Math.max(18, d.hp - rand(10, 28) - dungeon.tier * 3);
      d.status = "边境负伤";
      adjustMind(d, 7 + dungeon.tier, "边境讨伐失利");
    });
    state.sect.grain = Math.max(0, state.sect.grain - rand(60, 150));
    log(`讨伐${dungeon.name}失败，队伍负伤并损耗粮草。`, "warn");
  }
  showModal({
    kicker: "边境讨伐",
    title: won ? `${dungeon.name} 已平定` : `${dungeon.name} 讨伐失利`,
    body: `
      <div class="battle-stage frontier-battle">
        <div class="fighter left">本宗</div>
        <div class="slash"></div>
        <div class="fighter right">${dungeon.glyph || "妖"}</div>
      </div>
      <div class="battle-breakdown">
        <div><span>本宗战力</span><strong>${Math.round(our)}</strong></div>
        <div><span>妖兽战力</span><strong>${Math.round(enemy)}</strong></div>
        <div><span>掉落</span><strong>${itemCatalog[dungeon.material].name}</strong></div>
      </div>
      <p>${won ? "妖兽首领伏诛，边境据点向前推进。" : "妖兽强度超过预估，讨伐队撤回山门。"}</p>
    `,
  });
  render();
}

function occupyFrontierPoint(node) {
  if (!frontierUnlocked()) return;
  if (!spendAction(1, "边境扩张")) return;
  const point = {
    id: `frontier-point-${uid()}`,
    type: "frontierPoint",
    name: pick(["落霞边寨", "断河营", "伏妖关", "霜火堡", "青旗哨"]),
    x: clamp(node.x + rand(-90, 90), 80, W - 80),
    y: clamp(node.y + rand(-70, 70), 90, H - 90),
    owner: "player",
    value: rand(90, 180),
  };
  state.frontier.outposts.push(point);
  state.sect.prestige += 24;
  log(`本宗在边境立下${point.name}，边境副本收益与兽潮抵抗略有提高。`, "good");
  syncSharedWorld();
  render();
}

function openFrontierBossRaid(boss) {
  if (!frontierUnlocked() || !boss || boss.defeated) return;
  const roster = state.sect.disciples
    .slice()
    .sort((a, b) => frontierDisciplePower(b) - frontierDisciplePower(a));
  showModal({
    kicker: "巨兽讨伐",
    title: `${boss.name}：选择最多 2 名弟子`,
    body: `
      <div class="boss-panel">
        <strong>${tradeEscape(boss.name)}</strong>
        <div class="realtime-hp"><i style="width:${hpPct(boss.hp, boss.totalHp)}"></i></div>
        <span>剩余血量 ${Math.round(boss.hp)} / ${Math.round(boss.totalHp)}，强度 ${Math.round(boss.power)}</span>
      </div>
      <p>巨兽不会在十五回合后按战力直接判胜，本次挑战只结算实际造成的伤害。每次挑战消耗 1 点行动。</p>
      <div class="adventure-roster">
        ${roster.map((d, i) => `<label class="adventure-candidate ${d.core ? "is-core" : ""}">
          <input class="frontier-boss-team" type="checkbox" value="${d.id}" ${i < 2 ? "checked" : ""} />
          <div><strong>${d.core ? "核心·" : ""}${d.name}</strong><span>${realms[d.realm]} · 战力 ${Math.round(frontierDisciplePower(d))} · 体${d.hp} 攻${d.atk} 御${d.def}</span></div>
        </label>`).join("")}
      </div>
      ${(state.frontier.bossDamageLog || []).length ? `<div class="adventure-history">${state.frontier.bossDamageLog.slice(0, 5).map((row) => `<p>${tradeEscape(row.name)}造成 ${Math.round(row.damage)} 伤害</p>`).join("")}</div>` : ""}
    `,
    actions: [
      { label: state.multiplayer && state.roomConnected ? "创建协作房间" : "准备挑战", handler: () => {
        if (state.multiplayer && state.roomConnected) createRoomBossLobby(boss);
        else startFrontierBossRaid(boss);
      } },
      { label: "暂不挑战", handler: closeModal },
    ],
  });
  for (const box of els.modalBody.querySelectorAll(".frontier-boss-team")) {
    box.addEventListener("change", () => {
      const checked = [...els.modalBody.querySelectorAll(".frontier-boss-team:checked")];
      if (checked.length > 2) {
        box.checked = false;
        flashFeedback("巨兽讨伐最多派遣 2 名弟子。", "warn");
      }
    });
  }
}

function selectedFrontierBossTeamFromModal() {
  const ids = [...els.modalBody.querySelectorAll(".frontier-boss-team:checked")].map((box) => box.value).slice(0, 2);
  return ids.map((id) => state.sect.disciples.find((d) => d.id === id)).filter(Boolean);
}

function roomBossParticipant(team) {
  return {
    id: state.clientId,
    playerId: state.clientId,
    name: state.sect.name,
    ready: true,
    discipleIds: team.map((d) => d.id),
    disciples: team.map(combatDiscipleSnapshot).filter(Boolean),
  };
}

function normalizeRoomBossLobby(lobby) {
  if (!lobby) return null;
  return {
    ...lobby,
    boss: lobby.boss || state.frontier?.worldBoss || null,
    expectedIds: Array.isArray(lobby.expectedIds) ? lobby.expectedIds : [],
    expectedNames: lobby.expectedNames || {},
    participants: lobby.participants || {},
  };
}

function createRoomBossLobby(boss) {
  const team = selectedFrontierBossTeamFromModal();
  if (!team.length) {
    flashFeedback("至少选择 1 名弟子。", "warn");
    return;
  }
  if (!spendAction(1, "巨兽协作")) return;
  const players = foundedRoomPlayers();
  const expectedIds = players.map((player) => player.id).filter(Boolean);
  const expectedNames = Object.fromEntries(players.map((player) => [player.id, player.name || "联机宗门"]));
  const participant = roomBossParticipant(team);
  const lobby = {
    id: `${state.roomCode || "room"}-${boss.id}-${Date.now()}`,
    year: state.year,
    hostId: state.clientId,
    hostName: state.sect.name,
    boss: { ...boss },
    expectedIds,
    expectedNames,
    participants: { [state.clientId]: participant },
    started: false,
  };
  state.roomBossLobby = lobby;
  sendRoomFeature("frontier_boss_lobby_open", { lobby });
  closeModal();
  showRoomBossLobbyModal(lobby);
  log(`已创建${boss.name}协作房间，等待所有在线玩家准备。`, "good");
  syncPublicState();
  render();
}

function handleRoomBossLobbyOpen(lobby) {
  const data = normalizeRoomBossLobby(lobby);
  if (!data || data.year !== state.year || !state.founded) return;
  mergeFrontierBoss(data.boss);
  state.roomBossLobby = data;
  if (data.hostId === state.clientId || data.participants?.[state.clientId]) showRoomBossLobbyModal(data);
  else showRoomBossLobbyInvite(data);
}

function showRoomBossLobbyInvite(lobby) {
  const data = normalizeRoomBossLobby(lobby);
  if (!data || data.participants?.[state.clientId]) return;
  const roster = state.sect.disciples.slice().sort((a, b) => frontierDisciplePower(b) - frontierDisciplePower(a));
  showModal({
    kicker: "巨兽协作邀请",
    title: `${tradeEscape(data.hostName || "房主")}召集讨伐${tradeEscape(data.boss?.name || "边境巨兽")}`,
    body: `
      <p>选择最多 2 名弟子加入同场讨伐。准备会消耗 1 点行动点；房主在所有在线玩家准备后统一开战，所有参与者播放同一场战斗动画。</p>
      <div class="adventure-roster">
        ${roster.map((d, i) => `<label class="adventure-candidate ${d.core ? "is-core" : ""}">
          <input class="frontier-boss-team" type="checkbox" value="${tradeEscape(d.id)}" ${i < 2 ? "checked" : ""} />
          <div><strong>${d.core ? "核心·" : ""}${tradeEscape(d.name)}</strong><span>${tradeEscape(realms[d.realm] || "")} · 战力 ${Math.round(frontierDisciplePower(d))} · 体${d.hp}</span></div>
        </label>`).join("")}
      </div>
    `,
    actions: [
      { label: "准备加入", handler: () => {
        const team = selectedFrontierBossTeamFromModal();
        if (!team.length) {
          flashFeedback("至少选择 1 名弟子。", "warn");
          return;
        }
        if (!spendAction(1, "巨兽协作")) return;
        const participant = roomBossParticipant(team);
        state.roomBossLobby = normalizeRoomBossLobby({ ...data, participants: { ...(data.participants || {}), [state.clientId]: participant } });
        sendRoomFeature("frontier_boss_lobby_ready", { lobbyId: data.id, participant, lobby: state.roomBossLobby });
        closeModal();
        showRoomBossLobbyModal(state.roomBossLobby);
        syncPublicState();
      } },
      { label: "暂不参加", handler: closeModal },
    ],
  });
  bindBossTeamLimit();
}

function bindBossTeamLimit() {
  for (const box of els.modalBody.querySelectorAll(".frontier-boss-team")) {
    box.addEventListener("change", () => {
      const checked = [...els.modalBody.querySelectorAll(".frontier-boss-team:checked")];
      if (checked.length > 2) {
        box.checked = false;
        flashFeedback("巨兽讨伐最多派遣 2 名弟子。", "warn");
      }
    });
  }
}

function handleRoomBossLobbyReady(payload = {}) {
  const participant = payload.participant;
  if (!participant?.playerId && !participant?.id) return;
  const base = normalizeRoomBossLobby(state.roomBossLobby || payload.lobby);
  if (!base || base.id !== payload.lobbyId) return;
  const id = participant.playerId || participant.id;
  base.participants = { ...(base.participants || {}), [id]: { ...participant, playerId: id, id, ready: true } };
  state.roomBossLobby = base;
  if (base.hostId === state.clientId) sendRoomFeature("frontier_boss_lobby_open", { lobby: base });
  showRoomBossLobbyModal(base);
}

function showRoomBossLobbyModal(lobby) {
  const data = normalizeRoomBossLobby(lobby);
  if (!data) return;
  state.roomBossLobby = data;
  const expected = data.expectedIds.length ? data.expectedIds : Object.keys(data.participants || {});
  const rows = expected.map((id) => {
    const p = data.participants?.[id];
    const name = p?.name || data.expectedNames?.[id] || "联机宗门";
    const names = p?.disciples?.map((d) => d.name).join("、") || "等待选人";
    return `<article class="system-card ${p?.ready ? "is-winner" : ""}"><strong>${tradeEscape(name)}</strong><span>${tradeEscape(p?.ready ? names : "等待准备")}</span></article>`;
  }).join("");
  const allReady = expected.length > 0 && expected.every((id) => data.participants?.[id]?.ready);
  const isHost = data.hostId === state.clientId;
  showModal({
    kicker: "巨兽协作房间",
    title: `${tradeEscape(data.boss?.name || "边境巨兽")}：同场讨伐`,
    body: `
      <div class="boss-panel">
        <strong>${tradeEscape(data.boss?.name || "边境巨兽")}</strong>
        <div class="realtime-hp"><i style="width:${hpPct(data.boss?.hp || 0, data.boss?.totalHp || 1)}"></i></div>
        <span>血量 ${Math.round(data.boss?.hp || 0)} / ${Math.round(data.boss?.totalHp || 1)} · 强度 ${Math.round(data.boss?.power || 0)}</span>
      </div>
      <p>房主开战后，所有已准备玩家会看到同一场实时回合制战斗，伤害统一扣到共享巨兽血量。</p>
      <div class="system-grid">${rows}</div>
    `,
    actions: [
      { label: "刷新房间", handler: () => showRoomBossLobbyModal(state.roomBossLobby) },
      { label: "开始同场讨伐", disabled: !isHost || !allReady, handler: startRoomBossLobbyFromHost },
      { label: "取消房间", disabled: !isHost, handler: () => {
        sendRoomFeature("frontier_boss_lobby_cancel", { lobbyId: data.id });
        state.roomBossLobby = null;
        closeModal();
        render();
      } },
    ],
  });
}

function startRoomBossLobbyFromHost() {
  const lobby = normalizeRoomBossLobby(state.roomBossLobby);
  if (!lobby || lobby.hostId !== state.clientId) return;
  const current = state.frontier?.worldBoss || lobby.boss;
  if (!current || current.defeated) return;
  const team = Object.values(lobby.participants || {}).flatMap((p) => p.disciples || []);
  if (!team.length) return;
  const monster = frontierMonsterFromPower(current.name, current.power * (1 + Math.max(0, team.length - 2) * 0.08), `${current.id}:${lobby.id}`, 3.5 + Math.max(0, team.length - 2) * 0.18);
  const battle = simulateTeamVsMonsterBattle(team, monster, {
    enemyPower: current.power,
    maxRounds: 15,
    noPowerJudge: true,
    monsterHp: current.hp,
    monsterHpMax: current.totalHp,
  });
  const damage = Math.max(1, Math.min(current.hp, Math.round(battle.totalDamage || Math.max(0, current.totalHp - battle.monster.hp))));
  const result = {
    id: `${lobby.id}-result`,
    lobby,
    battle,
    damage,
    hpAfter: Math.max(0, current.hp - damage),
    defeated: current.hp - damage <= 0,
    scores: { our: team.reduce((sum, d) => sum + discipleBattleScore(d), 0), enemy: current.power },
  };
  sendRoomFeature("frontier_boss_lobby_start", { result });
  applyRoomBossLobbyResult(result);
}

function applyRoomBossLobbyResult(result) {
  if (!result?.id || !result.battle) return;
  showRealtimeTeamBattleModal({
    kicker: "巨兽协作讨伐",
    title: `${result.lobby?.boss?.name || "边境巨兽"}：同场战斗`,
    battle: result.battle,
    teamLabel: "协作队伍",
    enemyLabel: "边境巨兽",
    scores: result.scores || null,
    onComplete: () => finalizeRoomBossLobbyResult(result),
  });
}

function finalizeRoomBossLobbyResult(result) {
  if (!result?.id || state.appliedRoomBossResults?.[result.id]) {
    render();
    return;
  }
  ensureSectDefaults();
  state.appliedRoomBossResults[result.id] = true;
  const bossId = result.lobby?.boss?.id;
  const current = state.frontier.worldBoss;
  if (current && current.id === bossId) {
    current.hp = result.hpAfter;
    current.defeated = Boolean(result.defeated);
  }
  state.frontier.bossDamageLog = state.frontier.bossDamageLog || [];
  state.frontier.bossDamageLog.unshift({ name: "协作队伍", damage: result.damage, year: state.year });
  state.frontier.bossDamageLog = state.frontier.bossDamageLog.slice(0, 8);
  const mine = result.lobby?.participants?.[state.clientId];
  if (mine) {
    for (const id of mine.discipleIds || []) {
      const d = state.sect.disciples.find((item) => item.id === id);
      if (!d) continue;
      d.exp += 16 + Math.floor(d.realm * 3);
      d.status = result.defeated ? "协作斩兽" : "协作讨伐";
      if (!result.defeated) d.hp = Math.max(20, d.hp - rand(4, 12));
    }
    if (result.defeated) grantFrontierBossReward(result.lobby.boss, result.damage);
    else log(`协作讨伐造成 ${result.damage} 伤害，巨兽剩余血量 ${Math.round(result.hpAfter)}。`, "warn");
  } else {
    log(`联机协作讨伐造成 ${result.damage} 伤害。`, result.defeated ? "good" : "warn");
  }
  state.roomBossLobby = null;
  syncSharedWorld();
  syncPublicState();
  render();
}

function startFrontierBossRaid(boss) {
  const team = selectedFrontierBossTeamFromModal();
  if (!team.length) {
    flashFeedback("至少选择 1 名弟子。", "warn");
    return;
  }
  if (!spendAction(1, "巨兽讨伐")) return;
  closeModal();
  const current = state.frontier.worldBoss || boss;
  const monster = frontierMonsterFromPower(current.name, current.power, `${current.id}:${state.clientId}:${state.year}`, 3.4);
  const battle = simulateTeamVsMonsterBattle(team, monster, {
    enemyPower: current.power,
    maxRounds: 15,
    noPowerJudge: true,
    monsterHp: current.hp,
    monsterHpMax: current.totalHp,
  });
  const our = team.reduce((sum, d) => sum + frontierDisciplePower(d), 0);
  showRealtimeTeamBattleModal({
    kicker: "巨兽讨伐",
    title: `${current.name}：协作挑战`,
    battle,
    teamLabel: state.sect.name,
    enemyLabel: "边境巨兽",
    scores: { our, enemy: current.power },
    onComplete: () => finishFrontierBossRaid(current, team, battle),
  });
}

function finishFrontierBossRaid(boss, team, battle) {
  const current = state.frontier.worldBoss;
  if (!current || current.id !== boss.id) return;
  const damage = Math.max(1, Math.min(current.hp, Math.round(battle.totalDamage || Math.max(0, current.totalHp - battle.monster.hp))));
  current.hp = Math.max(0, current.hp - damage);
  current.defeated = current.hp <= 0;
  state.frontier.bossDamageLog = state.frontier.bossDamageLog || [];
  state.frontier.bossDamageLog.unshift({ name: state.sect.name, damage, year: state.year });
  state.frontier.bossDamageLog = state.frontier.bossDamageLog.slice(0, 8);
  team.forEach((d) => {
    d.exp += 18 + Math.floor(d.realm * 3);
    d.status = current.defeated ? "巨兽凯旋" : "巨兽浴血";
    if (!current.defeated) d.hp = Math.max(20, d.hp - rand(5, 16));
  });
  if (current.defeated) {
    grantFrontierBossReward(current, damage);
    sendRoomFeature("frontier_boss_defeated", { bossId: current.id, playerName: state.sect.name, damage, hp: 0, defeated: true });
  } else {
    log(`${state.sect.name}挑战${current.name}造成 ${damage} 伤害，剩余血量 ${Math.round(current.hp)}。`, "warn");
    sendRoomFeature("frontier_boss_damage", { bossId: current.id, playerName: state.sect.name, damage, hp: current.hp, totalHp: current.totalHp, defeated: false });
  }
  syncSharedWorld();
  render();
}

function grantFrontierBossReward(boss, damage) {
  const stones = 1800 + Math.round(boss.power * 0.22);
  state.sect.stones += stones;
  state.sect.prestige += 260;
  state.sect.alchemyMats += 4;
  state.sect.forgingMats += 4;
  state.sect.refineStone = Number(state.sect.refineStone || 0) + 3;
  state.sect.affixLock = Number(state.sect.affixLock || 0) + 1;
  addItem(pick(["thunderMethod", "sunMethod", "moonMethod", "scaleArmor", "spiritRing", "voidMirror", "affixLock"]), 1, 3 + (Math.random() < 0.35 ? 1 : 0));
  log(`边境巨兽${boss.name}被击杀！本宗本次贡献 ${damage} 伤害，获得 ${stones} 灵石、声望 +260、丹材/器材 +4、洗练灵砂 +3、定纹玉扣 +1。`, "good");
}

function forbiddenAttemptInfo() {
  ensureSectDefaults();
  const cycle = Math.floor((state.year - 1) / 10);
  if (!state.forbidden) state.forbidden = createForbiddenState();
  if (state.forbidden.attemptsCycle !== cycle) {
    state.forbidden.attemptsCycle = cycle;
    state.forbidden.attemptsUsed = 0;
  }
  const used = state.forbidden.attemptsUsed || 0;
  return { cycle, used, left: Math.max(0, 3 - used) };
}

function openForbiddenGate() {
  const info = forbiddenAttemptInfo();
  if (info.left <= 0) {
    log("本十年禁地尝试次数已耗尽。", "warn");
    return;
  }
  if (state.forbiddenRun) {
    renderForbiddenStep();
    return;
  }
  const roster = state.sect.disciples
    .slice()
    .sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0) || forbiddenDiscipleSeed(b) - forbiddenDiscipleSeed(a));
  showModal({
    kicker: "上古禁地",
    title: `选择入塔弟子｜剩余 ${info.left}/3 次`,
    body: `
      <p>禁地是独立 20 层爬塔。弟子使用固定初始属性，词条、心性、气运和已装备遗物会影响开局。通关率约取决于一路选择与强化，目标控制在较难但可突破。</p>
      <div class="adventure-roster">
        ${roster.map((d) => `<article class="adventure-candidate ${d.core ? "is-core" : ""}">
          <div><strong>${d.core ? "核心·" : ""}${d.name}</strong><span>${realms[d.realm]} · 禁地开局 ${Math.round(forbiddenDiscipleSeed(d))} · 境界加成 ${forbiddenRealmBonusPct(d)}% · 心${d.temper} 运${d.luck}</span></div>
          <button class="forbidden-pick" data-id="${d.id}">入塔</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "暂不进入", handler: closeModal }],
  });
  for (const btn of els.modalBody.querySelectorAll(".forbidden-pick")) {
    btn.addEventListener("click", () => {
      const d = state.sect.disciples.find((item) => item.id === btn.dataset.id);
      if (d) startForbiddenRun(d);
    });
  }
}

function forbiddenDiscipleSeed(d) {
  const relic = d.equipment?.relic ? 35 : 0;
  return 260 + d.realm * 34 + d.temper * 1.05 + d.luck * 0.86 + traitBonusOnDisciple(d, "forbidden") * 8 + relic;
}

function forbiddenRealmBonusPct(d) {
  return clamp((d?.realm || 0) * 6, 0, 50);
}

function startForbiddenRun(d) {
  const info = forbiddenAttemptInfo();
  if (info.left <= 0) return;
  state.forbidden.attemptsUsed += 1;
  state.forbidden.totalRuns = (state.forbidden.totalRuns || 0) + 1;
  const seed = forbiddenDiscipleSeed(d);
  const realmMultiplier = 1 + forbiddenRealmBonusPct(d) / 100;
  state.forbiddenRun = {
    id: uid(),
    discipleId: d.id,
    floor: 1,
    maxHp: Math.round((88 + seed * 0.16) * realmMultiplier),
    hp: Math.round((88 + seed * 0.16) * realmMultiplier),
    atk: Math.round((36 + seed * 0.14) * realmMultiplier),
    def: Math.round((28 + seed * 0.1) * realmMultiplier),
    speed: Math.round((24 + d.speed * 0.34) * realmMultiplier),
    temper: Math.round((30 + d.temper * 0.34) * realmMultiplier),
    luck: Math.round((16 + d.luck * 0.42) * realmMultiplier),
    buffs: [],
    relics: [],
    path: [],
    eliteKills: 0,
  };
  applyEquippedRelicToForbidden(d, state.forbiddenRun);
  if (state.multiplayer && state.roomConnected) {
    sendNet("forbidden_progress", { floor: state.forbiddenRun.floor, player: getPublicPlayerState() });
    syncPublicState();
  }
  closeModal();
  renderForbiddenStep();
  render();
}

function applyEquippedRelicToForbidden(d, run) {
  const relic = d.equipment?.relic ? forbiddenRelics.find((item) => item.id === d.equipment.relic.id) : null;
  if (!relic) return;
  for (const [key, value] of Object.entries(relic.tower || {})) run[key] = Math.round((run[key] || 0) + value);
  run.maxHp = Math.max(50, run.maxHp);
  run.hp = Math.min(run.maxHp, Math.max(30, run.hp));
  run.relics.push(relic);
}

function forbiddenRoomType(floor) {
  if (floor === 20) return "boss";
  if ([4, 9, 14, 18].includes(floor)) return "elite";
  if ([6, 12, 19].includes(floor)) return "heal";
  if ([3, 8, 13].includes(floor)) return "reward";
  return Math.random() < 0.22 ? "event" : "battle";
}

function renderForbiddenStep() {
  const run = state.forbiddenRun;
  if (!run) return;
  const d = state.sect.disciples.find((item) => item.id === run.discipleId);
  if (!d) {
    state.forbiddenRun = null;
    return;
  }
  const type = forbiddenRoomType(run.floor);
  const progress = `${run.floor}/20`;
  showModal({
    kicker: "上古禁地",
    title: `${d.name}｜第 ${run.floor} 层`,
    body: `
      <div class="forbidden-status">
        <div><span>生命</span><strong>${Math.round(run.hp)}/${Math.round(run.maxHp)}</strong></div>
        <div><span>攻伐</span><strong>${Math.round(run.atk)}</strong></div>
        <div><span>守御</span><strong>${Math.round(run.def)}</strong></div>
        <div><span>遗物</span><strong>${run.relics.length}</strong></div>
      </div>
      <div class="battle-stage forbidden-stage">
        <div class="fighter left">${d.name.slice(0, 2)}</div>
        <div class="slash"></div>
        <div class="fighter right">${type === "boss" ? "终" : type === "elite" ? "精" : type === "heal" ? "泉" : type === "reward" ? "藏" : "影"}</div>
      </div>
      <p>${forbiddenRoomText(type, run.floor)}</p>
      <p>本次禁地强化：${run.buffs.length ? run.buffs.map((b) => `<span class="tag rarity-${b.rarity}">${b.name}</span>`).join(" ") : "暂无"}。</p>
    `,
    actions: forbiddenActionsForRoom(type, run),
  });
  els.modalProgress.hidden = false;
  els.modalProgress.textContent = progress;
  els.modalCloseBtn.onclick = () => {
    flashFeedback("禁地探索中不能直接关闭，可选择撤离。", "warn");
  };
}

function forbiddenRoomText(type, floor) {
  if (type === "boss") return "三条岔路在此汇合，残仙王影从黑雾中起身。击败它才能带出一件禁地遗物。";
  if (type === "elite") return "精英妖影守住路口，击败会掉落遗物，失败则可能直接重伤出塔。";
  if (type === "heal") return floor === 19 ? "Boss 前的残泉仍有温度，可恢复生命并整理路线。" : "石壁渗出灵泉，可回血或换取少量强化。";
  if (type === "reward") return "古旧石匣半开，里面可能是强化、遗物线索或资源。";
  if (type === "event") return "岔路上出现不稳定幻象，选择会改变后续风险与收益。";
  return "黑雾凝成禁地守卫，必须以简易斗法动画判定胜负。";
}

function forbiddenActionsForRoom(type, run) {
  if (type === "heal") {
    return [
      { label: "饮泉疗伤", handler: () => { run.hp = Math.min(run.maxHp, run.hp + Math.round(run.maxHp * 0.34)); advanceForbiddenFloor("饮泉疗伤"); } },
      { label: "凝泉成符", handler: () => { run.def += 12; run.temper += 8; advanceForbiddenFloor("凝泉成符"); } },
      { label: "撤离禁地", handler: () => finishForbiddenRun(false, "主动撤离") },
    ];
  }
  if (type === "reward") {
    return [
      { label: "打开石匣", handler: () => chooseForbiddenBuff("石匣强化") },
      { label: "寻找遗物线索", handler: () => { run.luck += 10; if (Math.random() < 0.45) run.relics.push(randomForbiddenRelic()); advanceForbiddenFloor("寻找遗物线索"); } },
      { label: "带走资源", handler: () => { state.sect.stones += 120 + run.floor * 12; state.sect.insight += 18; advanceForbiddenFloor("带走资源"); } },
    ];
  }
  if (type === "event") {
    return [
      { label: "走左侧血路", handler: () => { run.atk += 18; run.hp -= 18; resolveForbiddenDanger("血路"); } },
      { label: "走中路残桥", handler: () => { run.def += 10; run.speed += 8; resolveForbiddenDanger("残桥"); } },
      { label: "走右侧星门", handler: () => { run.luck += 14; run.temper += 8; resolveForbiddenDanger("星门"); } },
    ];
  }
  return [
    { label: "强攻破阵", handler: () => resolveForbiddenBattle(type, "assault") },
    { label: "稳扎周旋", handler: () => resolveForbiddenBattle(type, "guard") },
    { label: "奇袭绕后", handler: () => resolveForbiddenBattle(type, "ambush") },
  ];
}

function resolveForbiddenDanger(label) {
  const run = state.forbiddenRun;
  const danger = rand(6, 18) + Math.ceil(run.floor * 1.35);
  if (rand(1, 100) > run.luck + run.temper * 0.45) run.hp -= danger;
  advanceForbiddenFloor(label);
}

function forbiddenCombatPower(run, tactic) {
  const tacticBoost = tactic === "assault" ? run.atk * 0.62 : tactic === "guard" ? run.def * 0.78 : run.speed * 0.68 + run.luck * 0.36;
  return run.atk * 2.35 + run.def * 1.82 + run.speed * 1.22 + run.temper * 0.92 + tacticBoost + rand(35, 135);
}

function forbiddenActorFromRun(run, tactic) {
  const methods = tactic === "assault"
    ? ["swordManual", "thunderMethod", "fireMethod"].filter((id) => methodCatalog[id])
    : tactic === "guard"
      ? ["earthMethod", "waterMethod", "woodMethod"].filter((id) => methodCatalog[id])
      : ["shadowMethod", "poisonMethod", "windMethod"].filter((id) => methodCatalog[id]);
  const active = methods.length ? methods : ["swordManual"];
  return {
    name: "禁地化身",
    realm: 0,
    hp: Math.max(8, run.hp / 10),
    atk: Math.max(1, Math.round(run.atk)),
    def: Math.max(0, Math.round(run.def)),
    speed: Math.max(1, Math.round(run.speed)),
    temper: Math.round(run.temper || 0),
    aptitude: 50,
    luck: Math.round(run.luck || 0),
    damagePct: tactic === "assault" ? 8 : 0,
    reducePct: tactic === "guard" ? 8 : 0,
    critPct: tactic === "ambush" ? 12 : 4,
    elementDamage: {},
    methods: active.map((id, index) => ({ id, quality: clamp(1 + Math.floor(run.floor / 6) + index, 1, 4), proficiency: clamp(38 + run.floor * 2 + run.temper * 0.25, 30, 92) })),
    activeMethods: active,
  };
}

function forbiddenGuardianActor(type, enemy, floor) {
  const scale = type === "boss" ? 1.35 : type === "elite" ? 1.12 : 1;
  const guardian = syntheticGuardian(type === "boss" ? "残仙王影" : type === "elite" ? "禁地精魅" : "禁地守卫", Math.max(220, enemy * scale), `forbidden:${state.year}:${floor}:${type}`);
  guardian.realm = 0;
  guardian.hp = Math.max(8, Math.round(enemy / (type === "boss" ? 7.5 : type === "elite" ? 9 : 10)) / 10);
  guardian.atk = Math.max(12, Math.round(enemy / (type === "boss" ? 18 : type === "elite" ? 21 : 24)));
  guardian.def = Math.max(8, Math.round(enemy / (type === "boss" ? 24 : type === "elite" ? 28 : 32)));
  guardian.speed = Math.max(14, Math.round(22 + floor * 2.2 + (type === "boss" ? 12 : type === "elite" ? 7 : 0)));
  return guardian;
}

function settleForbiddenBattle(type, won, detail) {
  const run = state.forbiddenRun;
  if (!run) return;
  if (run.hp <= 0) {
    showModal({
      kicker: "禁地败退",
      title: "魂灯骤暗",
      body: `<div class="battle-stage forbidden-stage"><div class="fighter left">败</div><div class="slash"></div><div class="fighter right">影</div></div><p>${detail}</p><p>弟子被禁地弹出，现实肉身不会死亡，但体魄会大幅受损。</p>`,
      actions: [{ label: "接受结果", handler: () => finishForbiddenRun(false, "禁地重伤") }],
    });
    return;
  }
  if (won && type === "elite") {
    run.eliteKills += 1;
    run.relics.push(randomForbiddenRelic());
    run.atk += 8;
    run.def += 6;
  }
  if (won && type === "boss") {
    finishForbiddenRun(true, "击败终局首领");
    return;
  }
  if (!won && type === "boss") {
    showModal({
      kicker: "终局战",
      title: "残仙王影未倒下",
      body: `<div class="battle-stage forbidden-stage"><div class="fighter left">本宗</div><div class="slash"></div><div class="fighter right">王</div></div><p>${detail}</p><p>Boss 层不能绕行。可以再战，但生命越低越危险。</p>`,
      actions: [
        { label: "再战终局", handler: () => resolveForbiddenBattle("boss", "guard") },
        { label: "撤离禁地", handler: () => finishForbiddenRun(false, "终局败退") },
      ],
    });
    return;
  }
  showModal({
    kicker: type === "elite" ? "精英战" : type === "boss" ? "终局战" : "禁地战斗",
    title: detail,
    body: `<div class="battle-stage forbidden-stage"><div class="fighter left">本宗</div><div class="slash"></div><div class="fighter right">${type === "elite" ? "精" : "影"}</div></div><p>${won ? "禁地守卫被击破，路线继续向上。" : "守卫没有被彻底击败，但弟子强行穿过，代价更重。"}</p>`,
    actions: [
      { label: "继续前进", handler: () => won && Math.random() < 0.5 ? chooseForbiddenBuff("战后悟法") : advanceForbiddenFloor(detail) },
      { label: "撤离禁地", handler: () => finishForbiddenRun(false, "主动撤离") },
    ],
  });
}

function resolveForbiddenBattle(type, tactic) {
  const run = state.forbiddenRun;
  if (!run) return;
  const scale = type === "boss" ? 1.58 : type === "elite" ? 1.22 : 0.9;
  const enemy = Math.round((128 + run.floor * 34 + Math.pow(run.floor, 1.28) * 11) * scale + rand(0, 76));
  const our = forbiddenCombatPower(run, tactic);
  const hpBefore = run.hp;
  const duel = simulateOneVsOneBattle(
    forbiddenActorFromRun({ ...run, hp: hpBefore }, tactic),
    forbiddenGuardianActor(type, enemy, run.floor),
    { mode: "forbidden", maxRounds: 15, noPowerJudge: true },
  );
  const won = duel.won;
  const leftHpRatio = clamp(duel.left.hp / Math.max(1, duel.left.hpMax), 0, 1);
  let damage = Math.max(0, hpBefore - Math.max(1, Math.round(run.maxHp * leftHpRatio)));
  if (!won) damage = Math.max(damage, Math.max(10, Math.round(enemy / 34 + rand(6, 22))));
  else damage = Math.max(3, damage || Math.round(enemy / 58 + rand(2, 8)));
  run.hp = Math.max(0, hpBefore - damage);
  const result = won ? "胜" : "败";
  const detail = `${result}：禁地斗法 ${duel.left.hp > 0 ? Math.round(duel.left.hp) : 0}/${duel.left.hpMax} 对 ${duel.right.hp > 0 ? Math.round(duel.right.hp) : 0}/${duel.right.hpMax}，生命 -${damage}。`;
  showRealtimeDuelModal({
    kicker: type === "elite" ? "禁地精英战" : type === "boss" ? "禁地终局战" : "禁地战斗",
    title: detail,
    duel,
    leftLabel: "禁地独立属性",
    rightLabel: type === "boss" ? "残仙王影" : type === "elite" ? "精英守卫" : "禁地守卫",
    scores: { our, enemy },
    onComplete: () => settleForbiddenBattle(type, won, detail),
  });
}

function chooseForbiddenBuff(reason) {
  const choices = [];
  while (choices.length < 3) {
    const rarityRoll = rand(1, 100);
    const pool = forbiddenBuffs.filter((buff) => rarityRoll > 92 ? buff.rarity === "red" : rarityRoll > 68 ? buff.rarity === "purple" : buff.rarity === "blue");
    const buff = pick(pool.length ? pool : forbiddenBuffs);
    if (!choices.includes(buff)) choices.push(buff);
  }
  showModal({
    kicker: "禁地强化",
    title: reason,
    body: `
      <p>选择一项只在本次禁地中生效的强化。下方会显示具体词条内容，方便判断路线。</p>
      <div class="system-grid">
        ${choices.map((buff) => `<article class="system-card rarity-${buff.rarity}"><strong>${buff.name}｜${buff.rarity}</strong><span>${buff.text}</span></article>`).join("")}
      </div>
    `,
    actions: choices.map((buff) => ({
      label: `${buff.name}｜${buff.text}`,
      handler: () => {
        applyForbiddenBuff(buff);
        advanceForbiddenFloor(buff.name);
      },
    })),
  });
}

function applyForbiddenBuff(buff) {
  const run = state.forbiddenRun;
  run.buffs.push(buff);
  for (const key of ["hp", "atk", "def", "speed", "temper", "luck"]) {
    if (buff[key]) run[key] += buff[key];
  }
  if (buff.hp) {
    run.maxHp += Math.max(0, buff.hp);
    run.hp = Math.min(run.maxHp, run.hp + Math.max(0, buff.hp));
  }
}

function randomForbiddenRelic() {
  const roll = rand(1, 100);
  const rarity = roll > 93 ? "red" : roll > 62 ? "purple" : "blue";
  return pick(forbiddenRelics.filter((relic) => relic.rarity === rarity));
}

function advanceForbiddenFloor(note) {
  const run = state.forbiddenRun;
  if (!run) return;
  run.path.push({ floor: run.floor, note });
  run.floor += 1;
  state.forbidden.bestFloor = Math.max(state.forbidden.bestFloor || 0, run.floor);
  if (state.multiplayer && state.roomConnected) sendNet("forbidden_progress", { floor: run.floor, player: getPublicPlayerState() });
  render();
  renderForbiddenStep();
}

function finishForbiddenRun(cleared, reason) {
  const run = state.forbiddenRun;
  const d = run ? state.sect.disciples.find((item) => item.id === run.discipleId) : null;
  if (!run || !d) {
    state.forbiddenRun = null;
    closeModal();
    render();
    return;
  }
  if (cleared) {
    state.forbidden.clears = (state.forbidden.clears || 0) + 1;
    state.sect.prestige += 160;
    state.sect.insight += 90;
    if (!run.relics.length) run.relics.push(randomForbiddenRelic());
    showForbiddenRelicCarry(run, d);
    log(`${d.name}通关上古禁地，可带出一件遗物。`, "good");
  } else {
    const loss = reason === "主动撤离" ? rand(8, 18) : rand(26, 46);
    d.hp = Math.max(18, d.hp - loss);
    d.status = reason;
    adjustMind(d, reason === "主动撤离" ? 5 : 18, "禁地归来");
    state.forbiddenRun = null;
    log(`${d.name}离开禁地：${reason}，现实体魄 -${loss}。`, reason === "主动撤离" ? "" : "warn");
    if (state.multiplayer && state.roomConnected) sendNet("forbidden_progress", { floor: 0, player: getPublicPlayerState() });
    syncPublicState();
    closeModal();
    render();
  }
}

function showForbiddenRelicCarry(run, d) {
  const relics = run.relics.slice(-5);
  showModal({
    kicker: "禁地通关",
    title: "选择一件遗物带出",
    body: `
      <p>禁地遗物具有双面效果，总体利大于弊。带出后可在弟子详情中装备到“遗物”栏。</p>
      <div class="system-grid">
        ${relics.map((relic) => `<article class="system-card rarity-${relic.rarity}"><strong>${relic.name}</strong><span>${relic.text}</span></article>`).join("")}
      </div>
    `,
    actions: relics.map((relic) => ({
      label: `带走${relic.name}`,
      handler: () => {
        state.sect.relicInventory.push({ id: relic.id });
        state.forbiddenRun = null;
        log(`${d.name}带回禁地遗物「${relic.name}」。可在弟子详情中装备。`, "good");
        if (state.multiplayer && state.roomConnected) sendNet("forbidden_progress", { floor: 0, player: getPublicPlayerState() });
        syncPublicState();
        closeModal();
        render();
      },
    })),
  });
  els.modalCloseBtn.onclick = () => flashFeedback("通关奖励必须选择一件遗物带出。", "warn");
}

function showForbiddenWaitingHint() {
  flashFeedback(`禁地探索已同步：当前第 ${state.forbiddenRun?.floor || 1} 层，不会阻塞其他玩家。`, "good");
  syncPublicState();
}

function exploreEvent(event) {
  if (!state.founded) return;
  if (!event || event.resolving) {
    log("此处机缘正在探索或已经散去，无法重复进入。", "warn");
    render();
    return;
  }
  if (!spendAction(1, "探索机缘")) return;
  event.resolving = true;
  if (state.selected?.id === event.id) state.selected = null;
  renderMapActionBubble(null);
  let resolved = false;
  const card = event.materialRich ? pick(materialOpportunityDeck) : pick(opportunityDeck);
  const cancelExplore = () => {
    if (!resolved) {
      state.actionPoints += 1;
      event.resolving = false;
    }
    closeModal();
    render();
  };
  showOpportunityDisciplePicker(event, card, (d) => {
    state.selectedDiscipleId = d.id;
    showOpportunityChoiceModal(event, card, d, () => resolved = true, cancelExplore);
  }, cancelExplore);
  els.modalCloseBtn.onclick = cancelExplore;
}

function openLayeredSecretRealm(event) {
  if (!state.founded || !event || event.resolving) return;
  if (!spendAction(1, "分层秘境")) return;
  event.resolving = true;
  const cancelSecretRealm = () => {
    event.resolving = false;
    state.actionPoints += 1;
    closeModal();
    render();
  };
  const roster = state.sect.disciples
    .slice()
    .sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a));
  showModal({
    kicker: "分层秘境",
    title: `${event.name}：选择主探弟子`,
    body: `
      <p>分层秘境会连续探索三层，奖励更明确，但中途风险会累积。若提前撤离，可保留已获得奖励。</p>
      <div class="adventure-roster">
        ${roster.map((d) => `<article class="adventure-candidate">
          <div><strong>${d.name}</strong><span>${realms[d.realm]} / 战力 ${Math.round(discipleBattleScore(d))} / 气运 ${d.luck}</span></div>
          <button class="secret-pick" data-id="${d.id}">入秘境</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "取消", handler: cancelSecretRealm }],
  });
  els.modalCloseBtn.onclick = cancelSecretRealm;
  for (const btn of els.modalBody.querySelectorAll(".secret-pick")) {
    btn.addEventListener("click", () => {
      const d = state.sect.disciples.find((item) => item.id === btn.dataset.id);
      if (!d) return;
      renderSecretRealmLayer({ eventId: event.id, eventName: event.name, discipleId: d.id, layer: 1, danger: Math.max(8, Math.floor(event.value / 8)), rewards: [] });
    });
  }
}

function renderSecretRealmLayer(run) {
  const d = state.sect.disciples.find((item) => item.id === run.discipleId);
  const event = state.events.find((item) => item.id === run.eventId);
  if (!d || !event) {
    closeModal();
    render();
    return;
  }
  const choices = [];
  while (choices.length < 3) {
    const room = pick(secretRealmRooms);
    if (!choices.some((item) => item.id === room.id)) choices.push(room);
  }
  showModal({
    kicker: "分层秘境",
    title: `${run.eventName} 第 ${run.layer}/3 层`,
    body: `
      <p>${d.name}正在深入秘境。当前危险 ${run.danger}，已获：${run.rewards.length ? run.rewards.join("、") : "暂无"}。</p>
      <div class="system-grid">
        ${choices.map((room) => `<article class="system-card"><strong>${room.name}</strong><span>${room.text}</span><em>风险 +${room.risk}</em></article>`).join("")}
      </div>
    `,
    actions: choices.map((room) => ({
      label: room.name,
      handler: () => resolveSecretRealmRoom(run, room),
    })).concat([
      { label: "带着奖励撤离", handler: () => finishSecretRealmRun(run, false) },
    ]),
  });
  els.modalCloseBtn.onclick = () => finishSecretRealmRun(run, false);
}

function resolveSecretRealmRoom(run, room) {
  const d = state.sect.disciples.find((item) => item.id === run.discipleId);
  if (!d) return;
  const risk = run.danger + room.risk + run.layer * 8;
  const score = d.luck + d.speed * 0.75 + d.aptitude * 0.35 + d.realm * 18 + rand(1, 100);
  const rewards = [];
  if (score < risk) {
    const loss = rand(5, 16) + run.layer * 4;
    d.hp = Math.max(16, d.hp - loss);
    adjustMind(d, 4 + run.layer, "秘境受挫");
    rewards.push(`负伤 -${loss}`);
  } else if (room.reward === "gear") {
    const item = pick(equipmentItemIds);
    const quality = clamp(Math.floor(run.layer / 2) + rand(1, 3), 1, 4);
    addItem(item, 1, quality);
    rewards.push(`${gearTierName(quality)}${itemCatalog[item]?.name || item}`);
  } else if (room.reward === "method") {
    const item = pick(methodItemIds);
    const quality = clamp(Math.floor(run.layer / 2) + rand(1, 3), 1, 4);
    addItem(item, 1, quality);
    d.exp += 8 + run.layer * 3;
    rewards.push(`${gearTierName(quality)}${itemCatalog[item]?.name || item}`);
  } else if (room.reward === "alchemy") {
    state.sect.alchemyMats += 1 + run.layer;
    state.sect.grain += 30 + run.layer * 20;
    rewards.push(`丹材 +${1 + run.layer}`);
  } else {
    d.mind = Math.max(0, (d.mind || 0) - 8 - run.layer * 2);
    state.sect.insight += 18 + run.layer * 8;
    rewards.push(`参悟 +${18 + run.layer * 8}`);
  }
  run.rewards.push(...rewards);
  run.danger += Math.floor(room.risk * 0.72);
  if (run.layer >= 3) finishSecretRealmRun(run, true);
  else renderSecretRealmLayer({ ...run, layer: run.layer + 1 });
}

function finishSecretRealmRun(run, cleared) {
  const event = state.events.find((item) => item.id === run.eventId);
  if (event) state.events = state.events.filter((item) => item.id !== event.id);
  const d = state.sect.disciples.find((item) => item.id === run.discipleId);
  if (d) {
    d.exp += cleared ? 18 : 7;
    d.status = cleared ? "通秘境三层" : "秘境撤离";
  }
  log(`分层秘境${cleared ? "完成" : "撤离"}：${run.rewards.length ? run.rewards.join("、") : "未取得奖励"}。`, cleared ? "good" : "");
  closeModal();
  render();
}

function showOpportunityDisciplePicker(event, card, onPick, cancelExplore) {
  const roster = state.sect.disciples
    .slice()
    .sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0) || discipleBattleScore(b) - discipleBattleScore(a));
  showModal({
    kicker: "秘境探索",
    title: `${event.name}：选择出行弟子`,
    body: `
      <div class="event-choice"><p>${card.intro}</p><p>不同弟子的属性会改变后续选项判定。核心弟子会置顶显示，但高风险机缘也可能伤及甚至杀死弟子。</p></div>
      <div class="adventure-roster">
        ${roster.map((d) => `<article class="adventure-candidate ${d.core ? "is-core" : ""}">
          <div><strong>${d.core ? "核心·" : ""}${d.name}</strong><span>${realms[d.realm]} · 体${d.hp} 攻${d.atk} 御${d.def} 速${d.speed} 资${d.aptitude} 心${d.temper} 运${d.luck}</span></div>
          <button class="opportunity-pick" data-id="${d.id}">派遣</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "暂缓撤回", handler: cancelExplore }],
  });
  for (const btn of els.modalBody.querySelectorAll(".opportunity-pick")) {
    btn.addEventListener("click", () => {
      const d = state.sect.disciples.find((item) => item.id === btn.dataset.id);
      if (d) {
        flashFeedback(`已派遣：${d.core ? "核心·" : ""}${d.name}`);
        onPick(d);
      }
    });
  }
}

function showOpportunityChoiceModal(event, card, d, markResolved, cancelExplore) {
  showModal({
    kicker: "秘境探索",
    title: `${event.name}：${card.title}`,
    body: `<div class="event-choice"><p>${card.intro}</p><p>出行弟子：<strong>${d.name}</strong>。气运、心性、资质和专长都会影响判定，也可能触发隐藏结果。</p></div>`,
    actions: [
      ...card.choices.map((choice) => ({
        label: choice.label,
        handler: () => { markResolved(); closeModal(); resolveOpportunityChoice(event, card, choice, d); },
      })),
      { label: "返回换人", handler: () => showOpportunityDisciplePicker(event, card, (next) => showOpportunityChoiceModal(event, card, next, markResolved, cancelExplore), cancelExplore) },
      { label: "暂缓撤回", handler: cancelExplore },
    ],
  });
  els.modalCloseBtn.onclick = cancelExplore;
}

function choiceScore(d, test) {
  const map = {
    hp: d.hp,
    atk: d.atk,
    def: d.def,
    speed: d.speed,
    aptitude: d.aptitude,
    temper: d.temper,
    luck: d.luck,
    charm: d.charm,
    alchemy: traitCraftBonus(d, "alchemy") + d.aptitude / 2,
  };
  const pathBoost = daoLevelFor("wander") * 9 + daoLevelFor("sword") * 3;
  const exploreBoost = (state.yearlyBoon?.key === "exploreBonus" ? 16 : 0) + (state.yearlyBoon?.key === "riskReward" ? 10 : 0) + state.sect.buildings.scoutTower * 8 + pathBoost;
  return (map[test] || 35) + d.realm * 12 + exploreBoost + rand(1, 100);
}

function resolveOpportunityChoice(event, card, choice, d) {
  event.resolving = true;
  const score = choiceScore(d, choice.test);
  const lucky = rand(1, 100) <= clamp(d.luck / 2 + state.sect.buildings.scoutTower * 4, 3, 45);
  const success = score >= 82 || lucky;
  const great = score >= 125 || (lucky && score >= 70);
  if (success) applyOpportunityReward(event, choice, d, great, score);
  else applyOpportunityFailure(event, choice, d, score);
  state.events = state.events.filter((e) => e.id !== event.id);
  if (state.selected?.id === event.id) state.selected = null;
  syncSharedWorld();
  render();
}

function materialPoolForEvent(event) {
  if (event?.materialRich || event?.name?.includes("万药")) return ["jadeDew", "moonRoot", "spiritGinseng", "fireGanoderma", "thunderSeed"];
  const name = event?.name || "";
  if (/雷|星|剑/.test(name)) return ["thunderSeed", "fireGanoderma", "jadeDew"];
  if (/火|炉|丹/.test(name)) return ["fireGanoderma", "spiritGinseng", "jadeDew"];
  if (/药|林|坟|泉/.test(name)) return ["jadeDew", "moonRoot", "spiritGinseng"];
  if (/市|赌/.test(name)) return ["jadeDew", "moonRoot", "fireGanoderma"];
  return ["jadeDew", "moonRoot"];
}

function grantAlchemyMaterialsFromEvent(event, amount = 1) {
  const pool = materialPoolForEvent(event);
  const gained = [];
  const bonus = event?.materialRich ? 2 : 1;
  for (let i = 0; i < amount + bonus; i += 1) {
    const id = pick(pool);
    addItem(id, 1, 0);
    gained.push(itemCatalog[id].name);
  }
  return gained;
}

function forgeMaterialPoolForEvent(event) {
  const name = event?.name || "";
  if (/龙骨|坟|舟|库/.test(name)) return ["dragonBone", "coldIron", "redCopper"];
  if (/星|雷|塔/.test(name)) return ["starSand", "redCopper", "coldIron"];
  if (/火|炉|矿/.test(name)) return ["redCopper", "coldIron", "starSand"];
  if (/剑|碑|府/.test(name)) return ["coldIron", "starSand"];
  return ["coldIron", "redCopper"];
}

function grantForgingMaterialsFromEvent(event, amount = 1) {
  const pool = forgeMaterialPoolForEvent(event);
  const gained = [];
  for (let i = 0; i < amount; i += 1) {
    const id = pick(pool);
    addItem(id, 1, 0);
    gained.push(itemCatalog[id].name);
  }
  return gained;
}

function rewardItemDisplay(itemId, quality = 0) {
  const item = itemCatalog[itemId];
  if (!item) return itemId || "未知物品";
  if (item.material) return item.name;
  return `${gearTierName(quality)}${item.name}`;
}

function pushReward(rewards, name, value) {
  if (!rewards || !name || value === undefined || value === null || value === "" || value === 0) return;
  rewards.push({ name, value: String(value) });
}

function renderRewardList(rewards = []) {
  if (!rewards.length) return `<div class="reward-list"><div><span>奖励</span><strong>无额外收获</strong></div></div>`;
  return `<div class="reward-list">${rewards.map((item) => `<div><span>${item.name}</span><strong>${item.value}</strong></div>`).join("")}</div>`;
}

function applyOpportunityReward(event, choice, d, great, score) {
  const quality = clamp(Math.floor(event.value / 32) + (great ? 1 : 0), 0, qualityNames.length - 1);
  const rewards = [];
  const rewardText = {
    insight: () => {
      const amount = great ? 46 : 26;
      state.sect.insight += amount;
      d.temper += 2;
      pushReward(rewards, "参悟", `+${amount}`);
      pushReward(rewards, `${d.name}心性`, "+2");
    },
    gear: () => {
      const id = pick([...equipmentItemIds, ...methodItemIds, "refineStone"]);
      addItem(id, 1, quality);
      pushReward(rewards, itemCatalog[id]?.equipment ? "装备" : methodCatalog[id] ? "功法" : "材料", rewardItemDisplay(id, quality));
    },
    rarePill: () => {
      const id = pick(["tribPill", "marrowPill", "qiPill"]);
      addItem(id, 1, quality);
      pushReward(rewards, "丹药", rewardItemDisplay(id, quality));
    },
    safe: () => {
      state.sect.insight += 14;
      state.sect.prestige += 8;
      pushReward(rewards, "参悟", "+14");
      pushReward(rewards, "声望", "+8");
    },
    alchemyMats: () => {
      const generic = great ? 3 : 2;
      state.sect.alchemyMats += generic;
      const gained = grantAlchemyMaterialsFromEvent(event, great || event.materialRich ? 2 : 1);
      pushReward(rewards, "通用丹材", `+${generic}`);
      pushReward(rewards, "具体丹材", gained.join("、"));
    },
    building: () => {
      state.sect.insight += 22;
      pushReward(rewards, "参悟", "+22");
      if (event.materialRich) {
        state.sect.alchemyMats += 1;
        const gained = grantAlchemyMaterialsFromEvent(event, 1);
        pushReward(rewards, "通用丹材", "+1");
        pushReward(rewards, "具体丹材", gained.join("、"));
      }
    },
    disciple: () => {
      const newcomer = createDisciple();
      state.recruitPool.push(newcomer);
      pushReward(rewards, "候选弟子", newcomer.name);
    },
    battleExp: () => {
      const exp = great ? 44 : 26;
      const atk = great ? 5 : 2;
      d.exp += exp;
      d.atk += atk;
      pushReward(rewards, `${d.name}修为`, `+${exp}`);
      pushReward(rewards, `${d.name}攻伐`, `+${atk}`);
    },
    manual: () => {
      const id = pick(methodItemIds);
      addItem(id, 1, quality);
      state.sect.insight += 20;
      pushReward(rewards, "功法", rewardItemDisplay(id, quality));
      pushReward(rewards, "参悟", "+20");
    },
    barrier: () => {
      const amount = great ? 16 : 9;
      state.sect.barrier = clamp(state.sect.barrier + amount, 0, 100);
      pushReward(rewards, "护山大阵", `+${amount}`);
    },
    market: () => {
      const stones = great ? 180 : 90;
      state.sect.stones += stones;
      state.sect.forgingMats += 1;
      pushReward(rewards, "灵石", `+${stones}`);
      pushReward(rewards, "通用器材", "+1");
      if (great) {
        state.sect.alchemyMats += 1;
        const gained = grantAlchemyMaterialsFromEvent(event, 1);
        pushReward(rewards, "通用丹材", "+1");
        pushReward(rewards, "具体丹材", gained.join("、"));
      }
    },
    prestige: () => {
      const amount = great ? 50 : 28;
      state.sect.prestige += amount;
      pushReward(rewards, "声望", `+${amount}`);
    },
    random: () => applyRandomOpportunityWindfall(quality, event, rewards),
    trib: () => {
      addItem("tribPill", 1, quality);
      pushReward(rewards, "丹药", rewardItemDisplay("tribPill", quality));
    },
    body: () => {
      const hp = great ? 26 : 14;
      const def = great ? 8 : 4;
      d.hp += hp;
      d.def += def;
      pushReward(rewards, `${d.name}体魄`, `+${hp}`);
      pushReward(rewards, `${d.name}守御`, `+${def}`);
    },
    dao: () => {
      const amount = great ? 60 : 34;
      state.sect.insight += amount;
      d.temper += 5;
      pushReward(rewards, "参悟", `+${amount}`);
      pushReward(rewards, `${d.name}心性`, "+5");
    },
  };
  rewardText[choice.reward]?.();
  if ((d.activeMethods || []).length) {
    const methodGain = great ? 4 : 2;
    for (const id of d.activeMethods) {
      const method = d.methods.find((item) => item.id === id);
      if (method) method.proficiency = clamp((method.proficiency || 0) + methodGain, 0, 100);
    }
    pushReward(rewards, "携带功法熟练度", `+${methodGain}`);
  }
  const text = `${choice.text}${great ? "气运牵引出隐藏机缘，收获远超预期。" : "此行顺利，机缘入手。"}`
  log(`${d.name}完成机缘「${choice.label}」：${text}`, "good");
  showExploreResult(event, choice.label, `${text}<br><br>${great ? "气运翻涌，触发隐藏收益。" : "气机顺流，行动成功。"}`, true, rewards);
}

function applyRandomOpportunityWindfall(quality, event = null, rewards = []) {
  const roll = pick(["stones", "pill", "gear", "insight", "mats", "forgeMats"]);
  if (roll === "stones") {
    state.sect.stones += 180;
    pushReward(rewards, "灵石", "+180");
  }
  if (roll === "pill") {
    const id = pick(["tribPill", "qiPill", "marrowPill"]);
    addItem(id, 1, quality);
    pushReward(rewards, "丹药", rewardItemDisplay(id, quality));
  }
  if (roll === "gear") {
    const id = pick([...equipmentItemIds, ...methodItemIds, "refineStone", "affixLock"]);
    addItem(id, 1, quality);
    pushReward(rewards, itemCatalog[id]?.equipment ? "装备" : methodCatalog[id] ? "功法" : "材料", rewardItemDisplay(id, quality));
  }
  if (roll === "insight") {
    state.sect.insight += 52;
    pushReward(rewards, "参悟", "+52");
  }
  if (roll === "mats") {
    const id = pick(alchemyMaterialIds);
    state.sect.alchemyMats += 1;
    addItem(id, 1, 0);
    state.sect.forgingMats += 1;
    pushReward(rewards, "通用丹材", "+1");
    pushReward(rewards, "具体丹材", itemCatalog[id].name);
    pushReward(rewards, "通用器材", "+1");
  }
  if (roll === "forgeMats") {
    state.sect.forgingMats += 1;
    const gained = grantForgingMaterialsFromEvent(event, 1);
    pushReward(rewards, "通用器材", "+1");
    pushReward(rewards, "具体器材", gained.join("、"));
  }
}

function applyOpportunityFailure(event, choice, d, score) {
  const hurt = rand(8, 22);
  d.hp = Math.max(24, d.hp - hurt);
  d.temper = Math.max(1, d.temper - rand(1, 5));
  adjustMind(d, 6, "机缘受挫");
  d.status = "机缘受挫";
  const text = `${choice.text}然而气机逆转，${d.name}判断失误，遭受 ${hurt} 点体魄损伤。`;
  log(`${d.name}机缘失败：${text}`, "warn");
  showExploreResult(event, choice.label, `${text}<br><br>气机逆转，未能压住此地变化。`, false, [
    { name: `${d.name}体魄`, value: `-${hurt}` },
    { name: `${d.name}心魔`, value: "+6" },
  ]);
}

function resolveExploreEvent(event, approach = "safe") {
  const pathBoost = daoLevelFor("wander") * 8;
  const exploreBoost = pathBoost + (state.yearlyBoon?.key === "exploreBonus" ? 18 : 0) + state.sect.buildings.scoutTower * 8;
  const luck = traitBonus("luck") + exploreBoost + rand(1, 100);
  const d = selectedDisciple() || pick(state.sect.disciples);
  const tables = {
    safe: ["herbs", "lostDisciple", "ancientPill", "ambush"],
    deep: ["manual", "ancientPill", "oreVein", "ambush", "ambush"],
    harvest: ["herbs", "herbs", "oreVein", "ambush"],
    legacy: ["manual", "lostDisciple", "ancientPill", "ambush"],
  };
  const result = pick(tables[approach] || tables.safe);
  if (luck > 46 && result === "ancientPill") {
    const quality = clamp(Math.floor(event.value / 28) + (luck > 105 ? 1 : 0), 0, qualityNames.length - 1);
    const itemId = pick(["qiPill", "marrowPill", "heartLotus", "tribPill"]);
    addItem(itemId, 1, quality);
    state.sect.insight += 16 + quality * 4;
    state.sect.prestige += 24;
    d.exp += 22;
    const text = `${d.name}在${event.name}的石匣中发现${gearTierName(quality)}${itemCatalog[itemId].name}，已收入仓库。`;
    log(text, "good");
    showExploreResult(event, "遗迹石匣", text, true, [
      { name: "丹药", value: rewardItemDisplay(itemId, quality) },
      { name: "参悟", value: `+${16 + quality * 4}` },
      { name: "声望", value: "+24" },
      { name: `${d.name}修为`, value: "+22" },
    ]);
  } else if (luck > 52 && result === "oreVein") {
    state.sect.forgingMats += 1;
    const gained = grantForgingMaterialsFromEvent(event, 1);
    state.sect.stones += event.value * 2;
    state.sect.insight += 8;
    const text = `${d.name}循地脉寻到一处散碎玄铁，带回通用器材、${gained.join("、")}与 ${event.value * 2} 灵石。`;
    log(text, "good");
    showExploreResult(event, "地脉矿痕", text, true, [
      { name: "通用器材", value: "+1" },
      { name: "具体器材", value: gained.join("、") },
      { name: "灵石", value: `+${event.value * 2}` },
      { name: "参悟", value: "+8" },
    ]);
  } else if (luck > 44 && result === "manual") {
    const quality = clamp(d.realm + rand(0, 2), 0, qualityNames.length - 1);
    const itemId = pick([...methodItemIds, ...equipmentItemIds, "refineStone", "affixLock"]);
    addItem(itemId, 1, quality);
    d.temper += 4;
    state.sect.insight += 28;
    const text = `${d.name}破解${event.name}中的残阵，得到${rewardItemDisplay(itemId, quality)}，已存入仓库。`;
    log(text, "good");
    showExploreResult(event, "残阵回响", text, true, [
      { name: itemCatalog[itemId]?.equipment ? "装备" : methodCatalog[itemId] ? "功法" : "材料", value: rewardItemDisplay(itemId, quality) },
      { name: "参悟", value: "+28" },
      { name: `${d.name}心性`, value: "+4" },
    ]);
  } else if (luck > 38 && result === "herbs") {
    state.sect.alchemyMats += 1;
    const gained = grantAlchemyMaterialsFromEvent(event, event.materialRich ? 2 : 1);
    state.sect.insight += 6;
    const text = `${d.name}采得灵草并辨出药性，带回通用丹材与${gained.join("、")}。`;
    log(text, "good");
    showExploreResult(event, "灵草露华", text, true, [
      { name: "通用丹材", value: "+1" },
      { name: "具体丹材", value: gained.join("、") },
      { name: "参悟", value: "+6" },
    ]);
  } else if (luck > 58 && result === "lostDisciple") {
    const newcomer = createDisciple();
    state.recruitPool.push(newcomer);
    state.sect.insight += 12;
    const text = `${d.name}在${event.name}救下一位流落散修，${newcomer.name}进入本年候选名册。`;
    log(text, "good");
    showExploreResult(event, "山路相逢", text, true, [
      { name: "候选弟子", value: newcomer.name },
      { name: "参悟", value: "+12" },
    ]);
  } else {
    const hurt = rand(8, 18);
    d.hp = Math.max(25, d.hp - hurt);
    d.status = "负伤";
    state.sect.barrier = clamp(state.sect.barrier - 4, 0, 100);
    const text = `${d.name}探访${event.name}时遭遇伏击，体魄受损 ${hurt}，山门派人接应后撤。`;
    log(text, "warn");
    showExploreResult(event, "暗处伏击", text, false, [
      { name: `${d.name}体魄`, value: `-${hurt}` },
      { name: "护山大阵", value: "-4" },
    ]);
  }
  state.events = state.events.filter((e) => e.id !== event.id);
  render();
}

function showExploreResult(event, title, text, good, rewards = []) {
  showModal({
    kicker: good ? "探索收获" : "探索遇险",
    title,
    body: `<p>${text}</p>${renderRewardList(rewards)}<p>${event.name}的灵机逐渐消散，地图上的该事件点已关闭。</p>`,
  });
}

function ally(target) {
  if (!state.founded || !target) return;
  if (!spendAction(1, "缔结盟约")) return;
  const diplomacy = state.sect.diplomacy || { reputation: 0, infamy: 0 };
  const chance = 42 + state.sect.prestige / 30 + traitBonus("charm") / 5 + target.attitude + diplomacy.reputation * 0.6 - diplomacy.infamy * 0.8 - (target.grudges || 0) * 8;
  if (rand(1, 100) < chance) {
    target.alliance = true;
    target.attitude = 70;
    state.sect.prestige += 20;
    diplomacy.reputation += 8;
    log(`本宗与${target.name}缔结盟约，可降低被袭扰概率。`, "good");
  } else {
    target.attitude -= 12;
    diplomacy.infamy += 2;
    log(`${target.name}拒绝盟约，暗中戒备本宗。`, "warn");
  }
  state.sect.diplomacy = diplomacy;
  render();
}

function assignGarrison(resource) {
  if (!resource || resource.owner !== "player") {
    log("只能给本宗资源点安排驻守。", "warn");
    return;
  }
  const roster = state.sect.disciples
    .slice()
    .sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0) || resourceGuardScore(b) - resourceGuardScore(a));
  showModal({
    kicker: "资源点驻守",
    title: `派谁驻守 ${resource.name}`,
    body: `
      <p>驻守弟子会提高资源点防守，阵道等级、守御、体魄和“边塞镇守”词条都会生效。驻守弟子仍可参与其他玩法，但被偷袭时可能受伤或心魔上涨。</p>
      <div class="adventure-roster">
        ${roster.map((d) => `<article class="adventure-candidate ${d.core ? "is-core" : ""}">
          <div><strong>${d.core ? "核心·" : ""}${d.name}</strong><span>${realms[d.realm]} · 守备 ${Math.round(resourceGuardScore(d))} · 体${d.hp} 御${d.def} 阵${d.arrayLevel || 0}</span></div>
          <button class="garrison-pick" data-id="${d.id}">${resource.garrisonId === d.id ? "已驻守" : "派驻"}</button>
        </article>`).join("")}
      </div>
    `,
    actions: [{ label: "取消", handler: closeModal }],
  });
  for (const btn of els.modalBody.querySelectorAll(".garrison-pick")) {
    btn.addEventListener("click", () => {
      const d = state.sect.disciples.find((item) => item.id === btn.dataset.id);
      if (d) setGarrison(resource, d);
    });
  }
}

function resourceGuardScore(d) {
  return discipleBattleScore(d) * 0.32 + (d.arrayLevel || 0) * 72 + traitBonusOnDisciple(d, "garrison") * 8 + d.def * 1.5 + d.hp * 0.65;
}

function setGarrison(resource, d) {
  if (!resource || !d) return;
  const old = state.sect.disciples.find((item) => item.id === resource.garrisonId);
  if (old && old.id !== d.id) old.status = "回山轮值";
  resource.garrisonId = d.id;
  d.status = `驻守${resource.name}`;
  log(`${d.name}开始驻守${resource.name}，该资源点防守提高。`, "good");
  closeModal();
  render();
}

function removeGarrison(resource) {
  if (!resource?.garrisonId) return;
  const d = state.sect.disciples.find((item) => item.id === resource.garrisonId);
  if (d) d.status = "回山轮值";
  resource.garrisonId = null;
  log(`${resource.name}驻守弟子已撤回山门。`);
  render();
}

function resourceUpgradeSummary(resource) {
  const upgrades = resource?.upgrades || {};
  return resourceUpgradeCatalog.map((upgrade) => `${upgrade.name} Lv.${upgrades[upgrade.key] || 0}`).join("、");
}

function openResourceUpgrade(resource) {
  if (!resource || resource.owner !== "player") {
    log("只能建设本宗已经占领的资源点。", "warn");
    return;
  }
  ensureSectDefaults();
  showModal({
    kicker: "资源点建设",
    title: resource.name,
    body: `
      <p>资源点建设消耗 1 点行动和灵石。建设越深，年产、防守、驻守收益越高，也越能抵抗 AI 偷袭。</p>
      <p>当前防守：<strong>${Math.round(resourceGarrisonPower(resource))}</strong>。当前升级：${resourceUpgradeSummary(resource)}。</p>
      <div class="system-grid">
        ${resourceUpgradeCatalog.map((upgrade) => {
          const level = resourceUpgradeLevel(resource, upgrade.key);
          const cost = resourceUpgradeCost(resource, upgrade);
          return `<article class="system-card">
            <strong>${upgrade.name} Lv.${level}/${upgrade.max}</strong>
            <span>${upgrade.text}</span>
            <em>下级消耗 ${cost} 灵石</em>
          </article>`;
        }).join("")}
      </div>
    `,
    actions: resourceUpgradeCatalog.map((upgrade) => {
      const level = resourceUpgradeLevel(resource, upgrade.key);
      const cost = resourceUpgradeCost(resource, upgrade);
      return {
        label: level >= upgrade.max ? `${upgrade.name}已满` : `建设${upgrade.name} ${cost}`,
        disabled: level >= upgrade.max || state.actionPoints < 1 || state.sect.stones < cost,
        handler: () => buildResourceUpgrade(resource, upgrade),
      };
    }).concat([{ label: "暂不建设", handler: closeModal }]),
  });
}

function buildResourceUpgrade(resource, upgrade) {
  if (!resource || resource.owner !== "player") return;
  if (resourceUpgradeLevel(resource, upgrade.key) >= upgrade.max) {
    log(`${upgrade.name}已经达到最高等级。`, "warn");
    return;
  }
  if (!spendAction(1, "资源点建设")) return;
  const cost = resourceUpgradeCost(resource, upgrade);
  if (state.sect.stones < cost) {
    state.actionPoints += 1;
    log(`建设${upgrade.name}需要 ${cost} 灵石。`, "warn");
    render();
    return;
  }
  state.sect.stones -= cost;
  resource.upgrades = resource.upgrades || { outpost: 0, arrayEye: 0, extractor: 0, depot: 0 };
  resource.upgrades[upgrade.key] = resourceUpgradeLevel(resource, upgrade.key) + 1;
  log(`${resource.name}建设${upgrade.name}至 Lv.${resource.upgrades[upgrade.key]}。${upgrade.text}`, "good");
  closeModal();
  render();
}

function sabotageRival(target) {
  state.sect.diplomacy = state.sect.diplomacy || { reputation: 20, infamy: 0 };
  const d = selectedDisciple();
  if (!target || target.alive === false || !d) {
    log("请先选择一名弟子作为暗线执行者。", "warn");
    return;
  }
  if (!spendAction(1, "暗线破坏")) return;
  const cost = 120;
  if (state.sect.stones < cost) {
    state.actionPoints += 1;
    log(`暗线破坏需要 ${cost} 灵石打点线人。`, "warn");
    render();
    return;
  }
  state.sect.stones -= cost;
  const score = d.charm + d.luck + d.speed * 0.8 + traitBonusOnDisciple(d, "charm") + rand(1, 100);
  const threshold = 90 + (target.grudges || 0) * 12 + Math.floor(target.foundation || 100) / 8;
  if (score >= threshold) {
    const loss = rand(70, 150);
    target.power = Math.max(60, target.power - loss);
    target.foundation = Math.max(0, (target.foundation || 100) - rand(12, 28));
    target.attitude -= 10;
    state.sect.diplomacy.infamy += 6;
    log(`${d.name}暗线破坏成功，${target.name}战力 -${loss}，底蕴受损。`, "good");
  } else {
    target.attitude -= 20;
    target.grudges = (target.grudges || 0) + 2;
    state.sect.diplomacy.infamy += 10;
    d.hp = Math.max(24, d.hp - rand(8, 18));
    log(`${d.name}暗线暴露，${target.name}记下一笔血仇，弟子负伤撤回。`, "warn");
  }
  render();
}

function tournament() {
  if (!state.founded) return;
  if (state.year % 10 !== 0) {
    log(`宗门大比每十年举行一次，下一届在太初 ${state.year + (10 - state.year % 10)} 年。`, "warn");
    render();
    return;
  }
  if (state.lastTournamentYear === state.year) {
    log("本届宗门大比已经结束，需等待十年后的下一届。", "warn");
    render();
    return;
  }
  if (state.actionPoints < 2) {
    log("宗门大比需要 2 点行动，本年行动点不足。", "warn");
    render();
    return;
  }
  openTournamentPicker(false);
}

function openTournamentPicker(auto = false, afterClose = null) {
  if (state.multiplayer && state.roomConnected) {
    state.pendingTournamentAfterClose = afterClose;
    state.roomTournament = state.roomTournament && state.roomTournament.year === state.year
      ? state.roomTournament
      : { year: state.year, ready: {}, resolved: false };
    if (state.roomHost) sendRoomFeature("tournament_open", { tournament: { year: state.year, ready: state.roomTournament.ready || {} } });
  }
  const roster = state.sect.disciples.slice().sort((a, b) => discipleBattleScore(b) - discipleBattleScore(a));
  const chosen = new Set(roster.slice(0, 3).map((d) => d.id));
  const actionText = auto ? "本届自动开启，不消耗行动点。若弃权，将失去排名奖励。" : "本次由玩家主动参加，消耗 2 点行动。";
  const body = `
    <p>本届宗门大比为全宗门三人锦标赛。每个宗门各出三名弟子，胜者晋级，最终决出第一名。${actionText}</p>
    <div class="tournament-table">
      ${roster.map((d) => `<label class="match-row"><span>${d.name}<div class="hp-line"><i style="width:${clamp(d.hp, 0, 140) / 1.4}%"></i></div></span><strong>${realms[d.realm]}</strong><input type="checkbox" class="tournament-pick" value="${d.id}" ${chosen.has(d.id) ? "checked" : ""}></label>`).join("")}
    </div>
  `;
  showModal({
    kicker: "宗门大比",
    title: "选择出战弟子",
    body,
    actions: [
      { label: "开始锦标赛", handler: () => {
        const ids = [...els.modalBody.querySelectorAll(".tournament-pick:checked")].map((input) => input.value).slice(0, 3);
        if (ids.length < 3) {
          flashFeedback("至少选择 3 名弟子参赛。", "warn");
          return;
        }
        if (!auto && !spendAction(2, "宗门大比")) return;
        closeModal();
        if (state.multiplayer && state.roomConnected) submitRoomTournamentTeam(ids, auto, afterClose);
        else resolveTournament(ids, auto, afterClose);
      } },
      { label: auto ? "本届弃权" : "弃权", handler: () => { state.lastTournamentYear = state.year; log("本宗放弃本届宗门大比。", "warn"); if (auto) continuePendingYearEvent("tournament", afterClose); else { closeModal(); render(); } } },
    ],
  });
  if (auto) {
    els.modalCloseBtn.onclick = () => {
      state.lastTournamentYear = state.year;
      log("本宗放弃本届宗门大比。", "warn");
      continuePendingYearEvent("tournament", afterClose);
    };
  }
}

function discipleBattleScore(d) {
  const mindPenalty = (d.mind || 0) * 1.1;
  const elder = d.elder ? 30 + d.realm * 8 : 0;
  const realmGap = Math.pow(2.05, d.realm || 0) * 82;
  const elementPower = Object.values(d.elementDamage || {}).reduce((sum, value) => sum + Number(value || 0) * 1.35, 0);
  const base = d.hp * 0.78 + d.atk * 2.38 + d.def * 1.82 + d.speed * 1.55 + realmGap + d.temper * 0.46 + d.aptitude * 0.28;
  return base + elementPower + gearPowerBonus(d) + methodPowerBonus(d) + bondPowerBonus(d) + cultivationPowerBonus(d) + elder - mindPenalty;
}

function publicTournamentTeam(ids) {
  const members = ids.map((id) => state.sect.disciples.find((d) => d.id === id)).filter(Boolean).slice(0, 3);
  return {
    id: state.clientId,
    name: state.sect.name,
    playerId: state.clientId,
    members: members.map((d) => ({
      name: d.name,
      realm: d.realm,
      hp: d.hp,
      atk: d.atk,
      def: d.def,
      speed: d.speed,
      temper: d.temper,
      aptitude: d.aptitude,
      luck: d.luck,
      shieldPower: d.shieldPower || 0,
      damagePct: d.damagePct || 0,
      reducePct: d.reducePct || 0,
      critPct: d.critPct || 0,
      critDamage: d.critDamage || 0,
      lifeSteal: d.lifeSteal || 0,
      pierce: d.pierce || 0,
      elementDamage: d.elementDamage || {},
      methods: (d.methods || []).map((method) => ({ id: method.id, quality: method.quality || 0, proficiency: method.proficiency || 0 })),
      activeMethods: (d.activeMethods || []).slice(0, 5),
      power: Math.round(discipleBattleScore(d)),
    })),
  };
}

function submitRoomTournamentTeam(ids, auto = false, afterClose = null) {
  const team = publicTournamentTeam(ids);
  if (team.members.length < 3) return;
  state.pendingTournamentAfterClose = afterClose;
  state.roomTournament = state.roomTournament || { year: state.year, ready: {}, resolved: false };
  state.roomTournament.ready = state.roomTournament.ready || {};
  state.roomTournament.ready[state.clientId] = team;
  state.lastTournamentYear = state.year;
  sendRoomFeature("tournament_ready", { team, year: state.year });
  markPlayerAction("宗门大比已准备", true);
  showTournamentWaitingRoom();
  if (state.roomHost) maybeFinalizeRoomTournament();
}

function showTournamentWaitingRoom() {
  const ready = Object.values(state.roomTournament?.ready || {});
  const players = foundedRoomPlayers();
  const readyIds = new Set(ready.map((team) => team.playerId || team.id));
  const canContinue = Boolean(state.pendingTournamentAfterClose);
  showModal({
    kicker: "联机宗门大比",
    title: `等待参赛宗门 ${ready.length}/${Math.max(1, players.length)}`,
    body: `
      <p>所有已立宗门玩家提交三名弟子后，房主会统一抽签并结算排名。</p>
      <div class="system-grid">
        ${players.map((player) => `<article class="system-card ${readyIds.has(player.id) ? "is-winner" : ""}"><strong>${tradeEscape(player.name)}</strong><span>${readyIds.has(player.id) ? "已准备" : "等待选择弟子"}</span></article>`).join("")}
      </div>
    `,
    actions: [
      { label: canContinue ? "先继续年度结算" : "等待结果", handler: canContinue ? () => continuePendingYearEvent("tournament") : closeModal },
    ],
  });
  if (canContinue) els.modalCloseBtn.onclick = () => continuePendingYearEvent("tournament");
}

function maybeFinalizeRoomTournament() {
  if (!state.roomHost || !state.roomTournament || state.roomTournament.year !== state.year || state.roomTournament.resolved) return;
  const players = foundedRoomPlayers();
  const ready = state.roomTournament.ready || {};
  if (players.length && players.some((player) => !ready[player.id])) return;
  state.roomTournament.resolved = true;
  const teams = Object.values(ready);
  const result = resolveTournamentField(teams);
  sendRoomFeature("tournament_result", { result });
  applyRoomTournamentResult(result);
}

function resolveTournamentField(playerTeams = []) {
  const teams = playerTeams.map((team) => ({
    ...team,
    playerTeam: true,
    score: team.members.reduce((sum, d) => sum + (d.power || discipleBattleScore(d)), 0) + stableRange(`${state.roomCode}:${state.year}:${team.id}:seed`, 0, 180),
  }));
  for (const r of activeRivals().slice(0, 7)) {
    const realm = clamp(Math.floor((r.power || 600) / 1400), 0, realms.length - 1);
    teams.push({
      id: r.id,
      name: r.name,
      members: Array.from({ length: 3 }, (_, i) => {
        const base = Math.max(50, Math.round((r.power || 600) / 45));
        const ghost = syntheticGuardian(`${r.name.slice(0, 1)}门${i + 1}`, Math.max(260, (r.power || 600) / 3), `${r.id}:tournament:${i}:${state.year}`);
        return { ...ghost, realm, hp: 80 + realm * 22, atk: base + realm * 14, def: base + realm * 11, speed: 30 + realm * 8, temper: 55, aptitude: 55, power: Math.round((r.power || 600) / 3) };
      }),
      score: Math.round(r.power || 600) + stableRange(`${state.roomCode}:${state.year}:${r.id}:ai`, -120, 220),
    });
  }
  const matches = [];
  let field = teams.slice().sort((a, b) => b.score - a.score);
  const rounds = ["首轮", "半决赛", "决赛"];
  for (let round = 0; round < rounds.length && field.length > 1; round += 1) {
    const next = [];
    for (let i = 0; i < field.length; i += 2) {
      const a = field[i];
      const b = field[i + 1];
      if (!b) {
        next.push(a);
        continue;
      }
      const result = resolveTeamMatch(a, b);
      matches.push({
        roundName: rounds[round],
        left: { id: a.id, playerId: a.playerId, name: a.name },
        right: { id: b.id, playerId: b.playerId, name: b.name },
        winner: { id: result.winner.id, playerId: result.winner.playerId, name: result.winner.name },
        aWins: result.aWins,
        bWins: result.bWins,
        duels: result.duels,
      });
      next.push(result.winner);
    }
    field = next.sort((a, b) => b.score - a.score);
  }
  const champion = field[0] || teams.slice().sort((a, b) => b.score - a.score)[0];
  const ranked = teams.sort((a, b) => b.score - a.score).map((team, index) => ({ ...team, rank: index + 1 }));
  return {
    year: state.year,
    champion: champion?.name || ranked[0]?.name || "未知",
    matches,
    rankings: ranked.map((team) => ({ id: team.id, playerId: team.playerId, name: team.name, rank: team.rank, score: Math.round(team.score), members: team.members })),
  };
}

function tournamentRewardForRank(rank) {
  if (rank === 1) return { stones: 1800, prestige: 240, insight: 120, item: pick(["spiritRing", "thunderMethod", "spiritBlade"]), quality: 4, exp: 56 };
  if (rank <= 3) return { stones: 1000, prestige: 150, insight: 75, item: pick(["cloudRobe", "earthMethod", "tribPill"]), quality: 3, exp: 38 };
  if (rank <= 6) return { stones: 520, prestige: 90, insight: 42, item: pick(["shadowBoots", "waterMethod", "heartLotus"]), quality: 2, exp: 24 };
  return { stones: 220, prestige: 35, insight: 18, item: "qiPill", quality: 1, exp: 12 };
}

function applyRoomTournamentResult(result) {
  const afterClose = state.pendingTournamentAfterClose;
  state.pendingTournamentAfterClose = null;
  state.pendingTournamentCost = 0;
  state.roomTournament = null;
  state.lastTournamentYear = result.year || state.year;
  const mine = (result.rankings || []).find((row) => row.playerId === state.clientId || row.id === state.clientId);
  if (mine) {
    const reward = tournamentRewardForRank(mine.rank);
    state.sect.stones += reward.stones;
    state.sect.prestige += reward.prestige;
    state.sect.insight += reward.insight;
    addItem(reward.item, 1, reward.quality);
    for (const member of mine.members || []) {
      const d = state.sect.disciples.find((item) => item.name === member.name);
      if (d) d.exp += reward.exp;
    }
    log(`联机宗门大比排名第 ${mine.rank}，获得 ${reward.stones} 灵石、声望 +${reward.prestige}、参悟 +${reward.insight}、${gearTierName(reward.quality)}${itemCatalog[reward.item].name}。`, mine.rank <= 3 ? "good" : "");
  }
  const rows = (result.rankings || []).slice(0, 10).map((row) => `<article class="system-card ${row.playerId === state.clientId || row.id === state.clientId ? "is-winner" : ""}"><strong>第 ${row.rank} 名：${tradeEscape(row.name)}</strong><span>评分 ${Math.round(row.score || 0)}</span></article>`).join("");
  showTournamentReplayModal({
    kicker: "联机宗门大比",
    title: `冠军：${tradeEscape(result.champion || "未知")}`,
    result,
    tableHtml: `<div class="system-grid">${rows}</div>`,
    summary: "本届宗门大比已统一结算，玩家和 AI 宗门按三人斗法排行。",
    actionLabel: "领取奖励",
    onDone: () => { closeModal(); afterClose?.(); render(); },
  });
  render();
}

function collectTournamentReplayDuels(result) {
  const all = [];
  for (const match of result.matches || []) {
    for (const duel of match.duels || []) {
      all.push({
        ...duel,
        roundName: match.roundName,
        leftTeam: match.left,
        rightTeam: match.right,
        matchScore: `${match.aWins}:${match.bWins}`,
      });
    }
  }
  if (!all.length) return [];
  const mine = all.filter((duel) => duel.leftTeam?.id === state.clientId || duel.leftTeam?.playerId === state.clientId || duel.rightTeam?.id === state.clientId || duel.rightTeam?.playerId === state.clientId);
  const picked = mine.length ? mine : all;
  return picked.slice(0, 9);
}

function showTournamentReplayModal({ kicker, title, result, tableHtml, summary, actionLabel = "继续", onDone = null }) {
  const replayDuels = collectTournamentReplayDuels(result || {});
  if (!replayDuels.length) {
    showModal({
      kicker,
      title,
      body: `<p>${tradeEscape(summary || "本届宗门大比已结算。")}</p>${tableHtml}`,
      actions: [{ label: actionLabel, handler: onDone || closeModal }],
    });
    return;
  }
  let duelIndex = 0;
  let rowIndex = -1;
  let timer = null;
  let finished = false;
  const first = replayDuels[0];
  const body = `
    <div class="tournament-replay realtime-duel" data-phase="playing">
      <div class="realtime-fighters">
        <div class="realtime-fighter left">
          <strong class="left-name">${tradeEscape(first.left.name)}</strong>
          <span class="left-team">${tradeEscape(first.leftTeam?.name || "")}</span>
          <div class="realtime-hp"><i class="left-hp" style="width:100%"></i></div>
          <em class="left-hp-text">${first.leftMax}/${first.leftMax}</em>
          <small class="left-shield">护盾 0</small>
        </div>
        <div class="realtime-center">
          <b>VS</b>
          <span class="realtime-round">${tradeEscape(first.roundName || "对局")}</span>
        </div>
        <div class="realtime-fighter right">
          <strong class="right-name">${tradeEscape(first.right.name)}</strong>
          <span class="right-team">${tradeEscape(first.rightTeam?.name || "")}</span>
          <div class="realtime-hp"><i class="right-hp" style="width:100%"></i></div>
          <em class="right-hp-text">${first.rightMax}/${first.rightMax}</em>
          <small class="right-shield">护盾 0</small>
        </div>
      </div>
      <div class="realtime-action">
        <strong class="realtime-method">抽签落定</strong>
        <span class="realtime-damage">三人对决开始，按功法顺序快速斗法。</span>
      </div>
      <div class="realtime-log"></div>
    </div>
    <div class="tournament-final" hidden>
      <p>${tradeEscape(summary || "本届宗门大比已结算。")}</p>
      ${tableHtml}
    </div>
  `;
  showModal({ kicker, title, body, actions: [{ label: "跳过回放", handler: () => finish(true) }] });
  els.modalCloseBtn.onclick = () => finish(true);
  const root = els.modalBody.querySelector(".tournament-replay");
  const finalBox = els.modalBody.querySelector(".tournament-final");
  const logBox = els.modalBody.querySelector(".realtime-log");
  const setDuelHeader = (duel) => {
    root.querySelector(".left-name").textContent = duel.left.name;
    root.querySelector(".right-name").textContent = duel.right.name;
    root.querySelector(".left-team").textContent = duel.leftTeam?.name || "";
    root.querySelector(".right-team").textContent = duel.rightTeam?.name || "";
    root.querySelector(".realtime-round").textContent = `${duel.roundName || "对局"} ${duel.matchScore || ""}`;
    root.querySelector(".left-hp").style.width = "100%";
    root.querySelector(".right-hp").style.width = "100%";
    root.querySelector(".left-hp-text").textContent = `${duel.leftMax}/${duel.leftMax}`;
    root.querySelector(".right-hp-text").textContent = `${duel.rightMax}/${duel.rightMax}`;
    root.querySelector(".left-shield").textContent = "护盾 0";
    root.querySelector(".right-shield").textContent = "护盾 0";
  };
  const updateBars = (duel, row = null) => {
    const leftHp = row ? row.leftHp : duel.leftMax;
    const rightHp = row ? row.rightHp : duel.rightMax;
    root.querySelector(".left-hp").style.width = hpPct(leftHp, duel.leftMax);
    root.querySelector(".right-hp").style.width = hpPct(rightHp, duel.rightMax);
    root.querySelector(".left-hp-text").textContent = `${Math.max(0, Math.round(leftHp))}/${duel.leftMax}`;
    root.querySelector(".right-hp-text").textContent = `${Math.max(0, Math.round(rightHp))}/${duel.rightMax}`;
    root.querySelector(".left-shield").textContent = `护盾 ${Math.round(row?.leftShield || 0)}`;
    root.querySelector(".right-shield").textContent = `护盾 ${Math.round(row?.rightShield || 0)}`;
  };
  const pushLog = (duel, row) => {
    const text = row.actorSide === "system"
      ? `${duel.leftTeam?.name || ""} 对 ${duel.rightTeam?.name || ""} ${row.methodName || "回合判定"}，${row.target}胜出。`
      : `${row.actor}施展${row.methodName}，对${row.target}造成${Math.round(row.damage || 0)}${row.element ? row.element + "伤" : "伤害"}${row.crit ? "，会心" : ""}${row.heal ? `，回血${row.heal}` : ""}${row.shield ? `，护盾+${row.shield}` : ""}。`;
    logBox.insertAdjacentHTML("afterbegin", `<p>${tradeEscape(text)}</p>`);
  };
  const step = () => {
    if (finished) return;
    const duel = replayDuels[duelIndex];
    if (!duel) {
      finish(false);
      return;
    }
    rowIndex += 1;
    if (rowIndex >= (duel.rows || []).length) {
      const text = `${duel.left.name} ${duel.leftWon ? "胜" : "负"} ${duel.right.name}`;
      logBox.insertAdjacentHTML("afterbegin", `<p><strong>${tradeEscape(text)}</strong></p>`);
      duelIndex += 1;
      rowIndex = -1;
      if (!replayDuels[duelIndex]) {
        timer = setTimeout(() => finish(false), 560);
        return;
      }
      setDuelHeader(replayDuels[duelIndex]);
      timer = setTimeout(step, 520);
      return;
    }
    const row = duel.rows[rowIndex];
    updateBars(duel, row);
    root.querySelector(".realtime-method").textContent = row.methodName;
    root.querySelector(".realtime-damage").textContent = row.actorSide === "system"
      ? `${row.target}在${row.methodName || "回合判定"}中胜出`
      : `${row.actor} → ${row.target}：${Math.round(row.damage || 0)}${row.element ? row.element + "伤" : "伤害"}`;
    root.querySelectorAll(".realtime-fighter").forEach((node) => node.classList.remove("is-acting", "is-hit"));
    if (row.actorSide !== "system") root.querySelector(`.realtime-fighter.${row.actorSide}`)?.classList.add("is-acting");
    if (row.targetSide !== "system") root.querySelector(`.realtime-fighter.${row.targetSide}`)?.classList.add("is-hit");
    root.querySelector(".realtime-action").classList.remove("flash");
    void root.querySelector(".realtime-action").offsetWidth;
    root.querySelector(".realtime-action").classList.add("flash");
    pushLog(duel, row);
    timer = setTimeout(step, 560);
  };
  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    root.dataset.phase = "done";
    finalBox.hidden = false;
    root.querySelector(".realtime-method").textContent = "大比回放结束";
    root.querySelector(".realtime-damage").textContent = "最终排名与奖励已生成。";
    setModalActionButtons([{ label: actionLabel, handler: onDone || closeModal }]);
    els.modalCloseBtn.onclick = onDone || closeModal;
  };
  setDuelHeader(first);
  timer = setTimeout(step, 420);
}

function resolveTournament(ids, auto = false, afterClose = null) {
  state.lastTournamentYear = state.year;
  const team = ids.map((id) => state.sect.disciples.find((d) => d.id === id)).filter(Boolean);
  const teams = [{ id: state.clientId, playerId: state.clientId, name: state.sect.name, player: true, members: team, score: 0 }];
  if (state.multiplayer) {
    for (const p of (state.remotePlayers || []).filter((player) => player.founded)) {
      const base = Math.max(260, (p.power || 600) / 3);
      teams.push({
        id: p.id,
        playerId: p.id,
        name: p.name,
        player: false,
        remote: true,
        members: Array.from({ length: 3 }, (_, i) => ({
          name: `${p.name.slice(0, 1)}队${i + 1}`,
          hp: rand(80, 130) + (p.maxRealm || 0) * 9,
          atk: Math.round(base / 26) + rand(18, 45),
          def: Math.round(base / 34) + rand(18, 42),
          speed: rand(22, 62),
          realm: clamp(p.maxRealm || 0, 0, realms.length - 1),
          temper: rand(36, 92),
          aptitude: rand(36, 92),
        })),
        score: 0,
      });
    }
  }
  for (const r of activeRivals().slice(0, 7)) {
    teams.push({
      id: r.id,
      name: r.name,
      player: false,
      members: Array.from({ length: 3 }, (_, i) => syntheticGuardian(`${r.name.slice(0, 1)}门${i + 1}`, Math.max(260, (r.power || 600) / 3), `${r.id}:local-tournament:${i}:${state.year}`)),
      score: 0,
    });
  }
  const rows = [];
  const matches = [];
  for (const t of teams) {
    t.score = t.members.reduce((sum, d) => sum + discipleBattleScore(d), 0) + rand(0, 420);
  }
  let field = teams.slice().sort((a, b) => b.score - a.score);
  const rounds = ["八强战", "半决赛", "决赛"];
  for (let round = 0; round < rounds.length && field.length > 1; round += 1) {
    const next = [];
    for (let i = 0; i < field.length; i += 2) {
      const a = field[i];
      const b = field[i + 1];
      if (!b) { next.push(a); continue; }
      const result = resolveTeamMatch(a, b);
      rows.push(renderTeamMatchRow(rounds[round], a, b, result));
      matches.push({
        roundName: rounds[round],
        left: { id: a.id, playerId: a.playerId, name: a.name },
        right: { id: b.id, playerId: b.playerId, name: b.name },
        winner: { id: result.winner.id, playerId: result.winner.playerId, name: result.winner.name },
        aWins: result.aWins,
        bWins: result.bWins,
        duels: result.duels,
      });
      next.push(result.winner);
    }
    field = next.sort((a, b) => b.score - a.score);
  }
  const champion = field[0];
  const sorted = teams.sort((a, b) => b.score - a.score);
  const rank = sorted.findIndex((t) => t.player) + 1;
  const rankings = sorted.map((item, index) => ({ id: item.id, playerId: item.playerId, name: item.name, rank: index + 1, score: Math.round(item.score), members: item.members }));
  const reward = rank === 1 ? { stones: 680, item: "spiritBlade", quality: 3 } : rank <= 3 ? { stones: 360, item: "tribPill", quality: 2 } : rank <= 6 ? { stones: 180, item: "heartLotus", quality: 1 } : { stones: 80, item: "qiPill", quality: 0 };
  state.sect.stones += reward.stones;
  addItem(reward.item, 1, reward.quality);
  state.sect.prestige += Math.max(20, 120 - rank * 10);
  for (const d of team) d.exp += rank === 1 ? 32 : rank <= 3 ? 22 : 12;
  const text = `本宗大比排名第 ${rank}，获得 ${reward.stones} 灵石与${gearTierName(reward.quality)}${itemCatalog[reward.item].name}。`;
  log(text, rank <= 3 ? "good" : "");
  if (state.multiplayer && state.roomConnected) {
    sendRoomFeature("tournament_result", { result: { year: state.year, champion: champion.name, rank, text } });
  }
  showTournamentReplayModal({
    kicker: "锦标赛战报",
    title: `冠军：${champion.name} / 本宗第 ${rank} 名`,
    result: { year: state.year, champion: champion.name, rankings, matches },
    tableHtml: `<div class="tournament-table">${rows.join("")}</div>`,
    summary: text,
    actionLabel: "领取奖励",
    onDone: () => { closeModal(); if (afterClose) afterClose(); render(); },
  });
  render();
}

function resolveTeamMatch(a, b) {
  let aWins = 0;
  let bWins = 0;
  const duels = [];
  for (let i = 0; i < 3; i += 1) {
    const left = a.members[i];
    const right = b.members[i];
    const duel = simulateOneVsOneBattle(left, right, { mode: "tournament" });
    const leftWon = duel.won;
    if (leftWon) aWins += 1;
    else bWins += 1;
    duels.push({
      left: { name: left.name },
      right: { name: right.name },
      leftWon,
      leftHp: clamp(Math.round((Math.max(0, duel.left.hp) / Math.max(1, duel.left.hpMax)) * 100), 0, 100),
      rightHp: clamp(Math.round((Math.max(0, duel.right.hp) / Math.max(1, duel.right.hpMax)) * 100), 0, 100),
      leftMax: duel.left.hpMax,
      rightMax: duel.right.hpMax,
      rows: duel.rows.slice(0, 28).map((row) => ({
        round: row.round,
        actor: row.actor,
        target: row.target,
        actorSide: row.actorSide,
        targetSide: row.targetSide,
        methodName: row.methodName,
        element: row.element,
        damage: row.damage,
        shieldTaken: row.shieldTaken,
        heal: row.heal,
        shield: row.shield,
        crit: row.crit,
        leftHp: row.leftHp,
        rightHp: row.rightHp,
        leftShield: row.leftShield,
        rightShield: row.rightShield,
      })),
    });
  }
  const winner = aWins >= bWins ? a : b;
  winner.score += 180 + Math.abs(aWins - bWins) * 55;
  return { winner, aWins, bWins, duels };
}

function renderTeamMatchRow(roundName, a, b, result) {
  const duelText = result.duels.map((d) => `<div class="match-row"><span>${d.left.name}<div class="hp-line"><i style="width:${d.leftHp}%"></i></div></span><strong>${d.leftWon ? "胜" : "负"}</strong><span>${d.right.name}<div class="hp-line"><i style="width:${d.rightHp}%"></i></div></span></div>`).join("");
  return `<div><p><strong>${roundName}</strong> ${a.name} ${result.aWins}:${result.bWins} ${b.name}</p>${duelText}</div>`;
}

function nearestRival() {
  if (!state.founded) return null;
  return activeRivals().filter((r) => !r.alliance).sort((a, b) => dist(a, state.sect) - dist(b, state.sect))[0] || null;
}

function drawTerrain() {
  ctx.clearRect(0, 0, W, H);
  if (worldMapImage.complete && worldMapImage.naturalWidth) {
    drawRealMapBackground();
    drawMapBorder();
    drawMapLegend();
    return;
  }
  drawParchmentBase();
  drawMapTexture();

  drawCoastAndWater();
  drawInkRoute();
  drawMistBand(120, 260, 620, 130);
  drawForest(110, 420, 170, 100);
  drawForest(700, 430, 220, 120);
  drawTerraces(280, 525);
  drawMountainRange([
    [130, 130, 72], [210, 126, 86], [286, 148, 62],
    [770, 160, 58], [850, 146, 76], [925, 178, 58],
  ]);
  drawCompassRose(86, 92);
  drawMapBorder();
  drawMapLegend();
}

function drawRealMapBackground() {
  const imageRatio = worldMapImage.naturalWidth / worldMapImage.naturalHeight;
  const canvasRatio = W / H;
  let sx = 0;
  let sy = 0;
  let sw = worldMapImage.naturalWidth;
  let sh = worldMapImage.naturalHeight;
  if (imageRatio > canvasRatio) {
    sw = worldMapImage.naturalHeight * canvasRatio;
    sx = (worldMapImage.naturalWidth - sw) / 2;
  } else {
    sh = worldMapImage.naturalWidth / canvasRatio;
    sy = (worldMapImage.naturalHeight - sh) / 2;
  }
  ctx.drawImage(worldMapImage, sx, sy, sw, sh, 0, 0, W, H);

  ctx.save();
  const vignette = ctx.createRadialGradient(W * 0.5, H * 0.46, 120, W * 0.5, H * 0.46, 720);
  vignette.addColorStop(0, "rgba(255, 242, 190, 0.04)");
  vignette.addColorStop(0.72, "rgba(72, 45, 18, 0.04)");
  vignette.addColorStop(1, "rgba(52, 31, 12, 0.24)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(58, 34, 14, 0.18)";
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, W - 52, H - 52);
  ctx.restore();
}

function drawParchmentBase() {
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "#d9bb7a");
  grad.addColorStop(0.28, "#ecd39a");
  grad.addColorStop(0.6, "#d2ab6d");
  grad.addColorStop(1, "#a97845");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  const vignette = ctx.createRadialGradient(W * 0.48, H * 0.46, 60, W * 0.48, H * 0.46, 720);
  vignette.addColorStop(0, "rgba(255, 244, 190, 0.24)");
  vignette.addColorStop(0.62, "rgba(120, 70, 30, 0.06)");
  vignette.addColorStop(1, "rgba(70, 38, 18, 0.26)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, W, H);
}

function drawCoastAndWater() {
  ctx.save();
  ctx.fillStyle = "rgba(57, 91, 96, 0.18)";
  ctx.strokeStyle = "rgba(67, 57, 34, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(760, 0);
  ctx.bezierCurveTo(820, 66, 810, 130, 875, 183);
  ctx.bezierCurveTo(924, 224, 966, 228, 1040, 270);
  ctx.lineTo(1040, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  for (let i = 0; i < 7; i += 1) {
    ctx.strokeStyle = `rgba(47, 82, 90, ${0.12 - i * 0.01})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(800 + i * 22, 18 + i * 26);
    ctx.bezierCurveTo(845 + i * 18, 74 + i * 18, 872 + i * 20, 124 + i * 20, 1004, 168 + i * 18);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(47, 82, 90, 0.38)";
  ctx.lineWidth = 19;
  ctx.beginPath();
  ctx.moveTo(0, 430);
  ctx.bezierCurveTo(180, 356, 278, 486, 420, 404);
  ctx.bezierCurveTo(560, 320, 648, 352, 770, 278);
  ctx.bezierCurveTo(884, 210, 940, 254, 1040, 190);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 238, 181, 0.42)";
  ctx.stroke();
  ctx.restore();
}

function drawInkRoute() {
  ctx.save();
  ctx.strokeStyle = "rgba(88, 49, 22, 0.24)";
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 12]);
  ctx.beginPath();
  ctx.moveTo(96, 590);
  ctx.bezierCurveTo(280, 500, 390, 545, 520, 430);
  ctx.bezierCurveTo(650, 314, 780, 360, 930, 250);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawMapBorder() {
  ctx.save();
  ctx.strokeStyle = "rgba(69, 39, 16, 0.32)";
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, W - 24, H - 24);
  ctx.strokeStyle = "rgba(255, 236, 176, 0.28)";
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.restore();
}

function drawCompassRose(x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = "rgba(69, 39, 16, 0.45)";
  ctx.fillStyle = "rgba(255, 238, 181, 0.24)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  for (let i = 0; i < 8; i += 1) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(7, -7);
    ctx.lineTo(0, -12);
    ctx.lineTo(-7, -7);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? "rgba(93, 55, 24, 0.35)" : "rgba(40, 108, 88, 0.34)";
    ctx.fill();
  }
  ctx.fillStyle = "rgba(69, 39, 16, 0.72)";
  ctx.font = "700 12px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.fillText("北", 0, -42);
  ctx.restore();
}

function drawMapTexture() {
  ctx.save();
  for (let i = 0; i < 900; i += 1) {
    const x = (i * 97) % W;
    const y = (i * 193) % H;
    const a = 0.025 + (i % 5) * 0.006;
    ctx.fillStyle = i % 2 ? `rgba(78, 48, 20, ${a})` : `rgba(255, 238, 181, ${a})`;
    ctx.fillRect(x, y, 1.4, 1.4);
  }
  ctx.strokeStyle = "rgba(78, 48, 20, 0.16)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 10; i += 1) {
    ctx.beginPath();
    ctx.ellipse(160 + i * 82, 180 + Math.sin(i) * 48, 140 + i * 4, 42 + (i % 3) * 8, i * 0.11, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(95, 59, 24, 0.28)";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 12]);
  ctx.beginPath();
  ctx.moveTo(96, 590);
  ctx.bezierCurveTo(280, 500, 390, 545, 520, 430);
  ctx.bezierCurveTo(650, 314, 780, 360, 930, 250);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawMistBand(x, y, width, height) {
  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = `rgba(255, 250, 240, ${0.06 + i * 0.008})`;
    ctx.beginPath();
    ctx.ellipse(x + i * width / 8, y + Math.sin(i) * 20, width / 5, height / 4, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawForest(x, y, width, height) {
  for (let i = 0; i < 26; i += 1) {
    const px = x + (i * 37) % width;
    const py = y + (i * 53) % height;
    ctx.fillStyle = i % 2 ? "rgba(40, 108, 88, 0.34)" : "rgba(75, 99, 72, 0.28)";
    ctx.beginPath();
    ctx.moveTo(px, py - 16);
    ctx.lineTo(px + 14, py + 15);
    ctx.lineTo(px - 14, py + 15);
    ctx.closePath();
    ctx.fill();
  }
}

function drawTerraces(x, y) {
  ctx.strokeStyle = "rgba(170, 118, 42, 0.28)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 6; i += 1) {
    ctx.beginPath();
    ctx.ellipse(x + i * 10, y + i * 14, 110 - i * 8, 26, -0.08, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawMountainRange(points) {
  for (const [x, y, size] of points) drawMountain(x, y, size);
}

function drawMapLegend() {
  ctx.save();
  ctx.fillStyle = "rgba(255, 252, 244, 0.78)";
  ctx.strokeStyle = "rgba(24, 32, 28, 0.12)";
  roundRect(W - 164, H - 92, 144, 70, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(24, 32, 28, 0.78)";
  ctx.font = "12px Microsoft YaHei";
  ctx.textAlign = "left";
  ctx.fillText("图例：宗门 / 资源 / 机缘", W - 152, H - 74);
  ctx.fillText("金线：本宗占点", W - 152, H - 52);
  ctx.fillText("蓝线：盟约", W - 152, H - 32);
  ctx.restore();
}

function drawMountain(x, y, size) {
  ctx.fillStyle = "rgba(73, 83, 75, 0.58)";
  ctx.beginPath();
  ctx.moveTo(x - size, y + size * 0.72);
  ctx.lineTo(x, y - size);
  ctx.lineTo(x + size, y + size * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "rgba(245, 241, 232, 0.62)";
  ctx.beginPath();
  ctx.moveTo(x - size * 0.22, y - size * 0.42);
  ctx.lineTo(x, y - size);
  ctx.lineTo(x + size * 0.22, y - size * 0.42);
  ctx.closePath();
  ctx.fill();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawNode(node) {
  const selected = state.selected && state.selected.id === node.id;
  ctx.save();
  ctx.translate(node.x, node.y);
  if (selected) {
    ctx.strokeStyle = "rgba(170, 118, 42, 0.45)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 250, 240, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  if (node.type === "site") {
    drawMapBadge("#2f6f58", "址", "circle");
  } else if (node.type === "rival") {
    drawSectSeal(node.alive === false ? "#6d6257" : node.alliance ? "#2f6690" : "#9f3d35", node.alive === false ? "墟" : node.name.replace("遗址·", "").slice(0, 1), false);
  } else if (node.type === "remotePlayer") {
    drawSectSeal("#7f4eaa", node.icon || node.name.slice(0, 1), false);
  } else if (node.type === "resource") {
    const label = node.kind === "mine" ? "矿" : node.kind === "herb" ? "药" : "泉";
    drawMapBadge(node.owner === "player" ? "#aa762a" : node.owner ? "#9f3d35" : "#5c7469", label, "square");
  } else if (node.type === "event") {
    const pulse = 1 + Math.sin(Date.now() / 260) * 0.12;
    ctx.fillStyle = "rgba(170, 118, 42, 0.26)";
    ctx.beginPath();
    ctx.arc(0, 0, 26 * pulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = node.value > 92 ? "#9f3d35" : "#aa762a";
    ctx.beginPath();
    ctx.arc(0, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff6df";
    ctx.font = "900 12px Microsoft YaHei";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.glyph || "缘", 0, 1);
    addAction("分层秘境", () => openLayeredSecretRealm(node), !state.founded || state.actionPoints < 1);
  } else if (node.type === "player") {
    drawSectSeal("#286c58", node.icon || "宗", true);
  } else if (node.type === "frontierDungeon") {
    const pulse = 1 + Math.sin(Date.now() / 220) * 0.14;
    ctx.fillStyle = "rgba(159, 61, 53, 0.24)";
    ctx.beginPath();
    ctx.arc(0, 0, 28 * pulse, 0, Math.PI * 2);
    ctx.fill();
    drawMapBadge(node.tier >= 5 ? "#7f2f45" : "#9f3d35", node.glyph || "妖", "circle");
  } else if (node.type === "frontierBoss") {
    const pulse = 1 + Math.sin(Date.now() / 180) * 0.16;
    ctx.fillStyle = "rgba(127, 47, 69, 0.22)";
    ctx.beginPath();
    ctx.arc(0, 0, 46 * pulse, 0, Math.PI * 2);
    ctx.fill();
    drawMapBadge("#7f2f45", node.glyph || "巨", "circle");
    ctx.strokeStyle = "rgba(255, 246, 223, 0.82)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.stroke();
  } else if (node.type === "frontierPoint") {
    drawMapBadge(node.owner === "player" ? "#286c58" : "#9f3d35", "寨", "square");
  } else if (node.type === "frontierLocked") {
    drawMapBadge("#6d6257", "关", "circle");
  } else if (node.type === "forbiddenGate") {
    drawMapBadge("#5f456f", "禁", "circle");
  } else if (node.type === "forbiddenFloor") {
    drawMapBadge(node.current ? "#9f3d35" : node.cleared ? "#286c58" : "#6d6257", node.floor === 20 ? "王" : String(node.floor), "circle");
  } else if (node.type === "overseasLocked") {
    drawMapBadge("#2f6690", "锁", "circle");
  }

  ctx.font = "700 13px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "rgba(24, 32, 28, 0.9)";
  ctx.fillText(node.name, 0, 28);
  ctx.restore();
}

function drawMapBadge(color, label, shape) {
  ctx.save();
  ctx.shadowColor = "rgba(55, 31, 12, 0.28)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = "rgba(255, 238, 181, 0.75)";
  ctx.beginPath();
  ctx.arc(0, 0, 27, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(77, 44, 18, 0.38)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = color;
  if (shape === "square") {
    roundRect(-17, -17, 34, 34, 7);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#fff6df";
  ctx.font = "900 17px Microsoft YaHei";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, 1);
  ctx.restore();
}

function drawSectSeal(color, label, player) {
  ctx.save();
  ctx.shadowColor = "rgba(55, 31, 12, 0.34)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = "rgba(255, 238, 181, 0.82)";
  ctx.beginPath();
  ctx.arc(0, 0, player ? 30 : 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = player ? "rgba(170, 118, 42, 0.92)" : "rgba(78, 48, 20, 0.42)";
  ctx.lineWidth = player ? 4 : 2;
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, player ? -24 : -20);
  ctx.lineTo(player ? 24 : 20, -4);
  ctx.lineTo(player ? 15 : 13, player ? 22 : 18);
  ctx.lineTo(player ? -15 : -13, player ? 22 : 18);
  ctx.lineTo(player ? -24 : -20, -4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 246, 207, 0.5)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#fff6df";
  ctx.font = `900 ${player ? 18 : 16}px Microsoft YaHei`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 0, 4);
  ctx.restore();
}

function drawLinks() {
  if (!state.founded || state.currentMap !== "central") return;
  for (const r of state.resources.filter((r) => r.owner === "player")) {
    ctx.strokeStyle = "rgba(170, 118, 42, 0.42)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 7]);
    ctx.beginPath();
    ctx.moveTo(state.sect.x, state.sect.y);
    ctx.lineTo(r.x, r.y);
    ctx.stroke();
  }
  for (const r of state.rivals.filter((r) => r.alliance)) {
    ctx.strokeStyle = "rgba(47, 102, 144, 0.38)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.moveTo(state.sect.x, state.sect.y);
    ctx.lineTo(r.x, r.y);
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

function mapModeName() {
  return state.currentMap === "frontier" ? "边境妖域"
    : state.currentMap === "forbidden" ? "上古禁地"
      : state.currentMap === "overseas" ? "海外仙洲"
        : "中心仙盟";
}

function drawMapModeOverlay() {
  ctx.save();
  if (state.currentMap === "frontier") {
    ctx.fillStyle = "rgba(82, 39, 24, 0.14)";
    ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 8; i += 1) {
      drawMountain(110 + i * 115, 126 + Math.sin(i) * 60, 22 + (i % 3) * 6);
      drawForest(70 + i * 118, 420 + Math.cos(i) * 55, 92, 76);
    }
  } else if (state.currentMap === "forbidden") {
    ctx.fillStyle = "rgba(34, 28, 40, 0.28)";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255, 238, 181, 0.26)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H - 70);
    ctx.bezierCurveTo(W * 0.28, H - 230, W * 0.22, 270, W * 0.42, 96);
    ctx.moveTo(W * 0.5, H - 70);
    ctx.bezierCurveTo(W * 0.52, H - 250, W * 0.42, 250, W * 0.55, 82);
    ctx.moveTo(W * 0.5, H - 70);
    ctx.bezierCurveTo(W * 0.74, H - 240, W * 0.78, 260, W * 0.62, 92);
    ctx.stroke();
  } else if (state.currentMap === "overseas") {
    ctx.fillStyle = "rgba(44, 74, 92, 0.24)";
    ctx.fillRect(0, 0, W, H);
  }
  ctx.fillStyle = "rgba(255, 252, 244, 0.82)";
  ctx.strokeStyle = "rgba(78, 48, 20, 0.18)";
  roundRect(22, 28, 210, 54, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(24, 32, 28, 0.86)";
  ctx.font = "900 18px Microsoft YaHei";
  ctx.fillText(mapModeName(), 40, 49);
  ctx.font = "12px Microsoft YaHei";
  const sub = state.currentMap === "frontier" ? "讨伐妖兽 / 晋升材料 / 扩张驻守"
    : state.currentMap === "forbidden" ? "20 层爬塔 / 三岔路线 / 通关带出遗物"
      : state.currentMap === "overseas" ? "暂未开放"
        : "宗门战争 / 资源点 / 机缘";
  ctx.fillText(sub, 40, 68);
  ctx.restore();
}

function frontierUnlocked() {
  return Boolean(state.sect && state.sect.disciples.filter((d) => d.realm >= 2).length >= 3);
}

function refreshFrontierDungeons(force = false) {
  ensureSectDefaults();
  if (!state.frontier) state.frontier = createFrontierState();
  if (!force && state.frontier.lastRefreshYear === state.year) return;
  const maxRealm = state.sect ? Math.max(0, ...state.sect.disciples.map((d) => d.realm)) : 0;
  const templates = frontierDungeonTemplates.filter((tpl) => tpl.tier <= Math.max(2, maxRealm + 2) && (tpl.tier <= 4 || Math.random() < 0.45));
  const count = frontierUnlocked() ? rand(5, 8) : 3;
  state.frontier.dungeons = Array.from({ length: count }, (_, i) => {
    const tpl = pick(templates.length ? templates : frontierDungeonTemplates.slice(0, 2));
    const tierScale = 1 + Math.max(0, tpl.tier - 2) * 0.22 + Math.min(0.65, state.year / 32);
    return {
      ...tpl,
      id: `frontier-${state.year}-${i}-${Math.random().toString(16).slice(2)}`,
      type: "frontierDungeon",
      x: rand(86, 960),
      y: rand(92, 590),
      value: Math.round(tpl.minPower * tierScale),
      ttl: rand(1, 3),
    };
  });
  state.frontier.lastRefreshYear = state.year;
}

function refreshFrontierYear() {
  ensureSectDefaults();
  const cycle = Math.floor((state.year - 1) / 10);
  if (state.forbidden && state.forbidden.attemptsCycle !== cycle) {
    state.forbidden.attemptsCycle = cycle;
    state.forbidden.attemptsUsed = 0;
  }
  if (!frontierUnlocked()) return;
  expireFrontierBossIfNeeded();
  refreshFrontierDungeons(true);
  state.frontier.dungeons = state.frontier.dungeons
    .map((dungeon) => ({ ...dungeon, ttl: Math.max(0, (dungeon.ttl || 1) - 1) }))
    .filter((dungeon) => dungeon.ttl > 0 || dungeon.tier <= 2);
  if (Math.random() < 0.2 + Math.min(0.18, state.year / 60)) {
    const pressure = Math.round(sectPower() * (0.18 + Math.random() * 0.12));
    const outpost = state.frontier.outposts[0];
    if (outpost) {
      const loss = Math.min(state.sect.grain, rand(40, 120));
      state.sect.grain -= loss;
      log(`边境兽潮冲击${outpost.name}，本宗调粮驰援，粮草 -${loss}。兽潮压力约 ${pressure}。`, "warn");
    } else {
      log("边境兽潮在关外游荡。若本宗开设边寨，后续会获得更多副本线索，也要承担兽潮压力。", "warn");
    }
  }
  maybeSpawnFrontierBoss();
}

function createFrontierBoss(year = state.year) {
  const seed = `${state.roomCode || "solo"}:${year}:frontier-boss`;
  const names = ["玄甲裂天犼", "赤雷吞岳兽", "九首瘴龙", "幽渊搬山魁", "金瞳焚海猊"];
  const name = names[stableHash(seed) % names.length];
  const basePower = Math.max(2600, Math.round(sectPower() * 1.28 + year * 260 + stableRange(`${seed}:power`, 300, 980)));
  const totalHp = Math.max(18000, Math.round(basePower * 7.4 + year * 900 + stableRange(`${seed}:hp`, 1600, 4200)));
  return {
    id: `frontier-boss-${year}-${stableHash(seed)}`,
    type: "frontierBoss",
    name,
    glyph: "巨",
    x: stableRange(`${seed}:x`, 180, 900),
    y: stableRange(`${seed}:y`, 120, 520),
    year,
    expiresYear: year + 1,
    power: basePower,
    totalHp,
    hp: totalHp,
    defeated: false,
  };
}

function expireFrontierBossIfNeeded() {
  const boss = state.frontier?.worldBoss;
  if (!boss) return;
  if (boss.defeated || boss.expiresYear <= state.year) {
    if (!boss.defeated && boss.hp > 0) log(`${boss.name}拖着伤势遁入妖域深处，本年巨兽讨伐结束。`, "warn");
    if (!boss.defeated && state.multiplayer && state.roomConnected && state.roomHost) sendRoomFeature("frontier_boss_expire", { bossId: boss.id });
    state.frontier.worldBoss = null;
  }
}

function maybeSpawnFrontierBoss(force = false) {
  if (!frontierUnlocked()) return null;
  if (state.frontier.worldBoss && !state.frontier.worldBoss.defeated) return state.frontier.worldBoss;
  if (state.multiplayer && state.roomConnected && !state.roomHost) return null;
  const due = force || state.year % 5 === 0 || ((state.frontier.clears || 0) >= 2 && Math.random() < 0.18);
  if (!due) return null;
  const boss = createFrontierBoss();
  state.frontier.worldBoss = boss;
  state.frontier.bossDamageLog = [];
  log(`边境巨兽「${boss.name}」现身，血量 ${boss.totalHp}。所有玩家可共同削减其血量，本年未击杀则遁走。`, "warn");
  if (state.multiplayer && state.roomConnected) {
    sendRoomFeature("frontier_boss_spawn", { boss });
    syncSharedWorld();
  }
  return boss;
}

function mergeFrontierBoss(boss) {
  if (!boss) return;
  ensureSectDefaults();
  const current = state.frontier.worldBoss;
  if (!current || current.id === boss.id || Number(boss.year || 0) >= Number(current.year || 0)) {
    state.frontier.worldBoss = { ...current, ...boss };
  }
}

function applyRemoteBossDamage(payload = {}) {
  ensureSectDefaults();
  const boss = state.frontier.worldBoss;
  if (!boss || boss.id !== payload.bossId) return;
  boss.hp = Math.max(0, Number(payload.hp ?? (boss.hp - Number(payload.damage || 0))));
  boss.defeated = Boolean(payload.defeated || boss.hp <= 0);
  state.frontier.bossDamageLog = state.frontier.bossDamageLog || [];
  state.frontier.bossDamageLog.unshift({
    name: payload.playerName || "联机宗门",
    damage: Math.round(Number(payload.damage || 0)),
    year: state.year,
  });
  state.frontier.bossDamageLog = state.frontier.bossDamageLog.slice(0, 8);
  log(`${payload.playerName || "联机宗门"}挑战${boss.name}，造成 ${Math.round(Number(payload.damage || 0))} 伤害，剩余 ${Math.round(boss.hp)}。`, boss.defeated ? "good" : "warn");
  render();
}

function frontierNodes() {
  ensureSectDefaults();
  if (!frontierUnlocked()) {
    return [{ id: "frontier-lock", type: "frontierLocked", name: "边境关隘", x: W * 0.5, y: H * 0.5 }];
  }
  if (!state.frontier.dungeons?.length) refreshFrontierDungeons(true);
  const outposts = state.frontier.outposts || [];
  return [
    { id: "frontier-home", type: "frontierPoint", name: "本宗边寨", x: 132, y: 552, owner: "player", value: 120 },
    ...outposts,
    ...(state.frontier.worldBoss && !state.frontier.worldBoss.defeated ? [state.frontier.worldBoss] : []),
    ...state.frontier.dungeons,
  ];
}

function forbiddenNodes() {
  const nodes = [{ id: "forbidden-gate", type: "forbiddenGate", name: "禁地入口", x: W * 0.5, y: H - 86, value: 20 }];
  if (state.forbiddenRun) {
    const run = state.forbiddenRun;
    for (let floor = 1; floor <= 20; floor += 1) {
      const branchOffset = floor < 18 ? [-150, 0, 150][floor % 3] : 0;
      nodes.push({
        id: `forbidden-floor-${floor}`,
        type: "forbiddenFloor",
        name: floor === 20 ? "终局首领" : `${floor}层`,
        x: W * 0.5 + branchOffset + Math.sin(floor) * 30,
        y: H - 95 - floor * 26,
        floor,
        cleared: floor < run.floor,
        current: floor === run.floor,
      });
    }
  }
  return nodes;
}

function switchMap(map) {
  state.currentMap = map;
  state.selected = null;
  if (map === "frontier") {
    if (!frontierUnlocked()) {
      showModal({
        kicker: "边境未解锁",
        title: "金丹弟子不足",
        body: `<p>边境妖域用于元婴及以上晋升材料、讨伐副本和兽潮扩张。需要本宗拥有至少 3 名金丹及以上弟子才可正式入驻。</p>`,
      });
    } else {
      refreshFrontierDungeons();
      flashFeedback("已切换到边境妖域。");
    }
  } else if (map === "forbidden") {
    flashFeedback("已切换到上古禁地。");
  } else if (map === "overseas") {
    showModal({ kicker: "海外仙洲", title: "暂未开放", body: `<p>海外地图暂时锁定，后续可扩展海贸、散仙岛、跨海远征与外域宗门。</p>` });
  }
  for (const btn of els.mapTabs?.querySelectorAll("button") || []) btn.classList.toggle("is-active", btn.dataset.map === state.currentMap);
  render();
}

function renderMap() {
  drawTerrain();
  drawMapModeOverlay();
  drawLinks();
  for (const node of allNodes()) drawNode(node);
}

function renderUI() {
  els.season.textContent = state.founded ? seasons[state.seasonIndex] : "开局择址";
  els.year.textContent = `太初 ${state.year} 年`;
  els.sectName.textContent = state.sect?.name || "未立山门";
  els.spiritStones.textContent = Math.round(state.sect?.stones || 0);
  els.grain.textContent = Math.round(state.sect?.grain || 0);
  els.prestige.textContent = Math.round(state.sect?.prestige || 0);
  els.power.textContent = sectPower();
  els.actionPoints.textContent = state.founded ? `${state.actionPoints}/${state.maxActionPoints}` : "0/0";
  els.turnMode.textContent = state.multiplayer || state.roomConnected ? "联机" : "单机";
  els.alchemyMats.textContent = state.sect?.alchemyMats || 0;
  els.forgingMats.textContent = state.sect?.forgingMats || 0;
  if (els.arrayMats) els.arrayMats.textContent = state.sect?.arrayMats || 0;
  els.daoPath.textContent = state.sect ? primaryDaoName() : "未定";
  els.insight.textContent = state.sect?.insight || 0;
  els.barrierBar.style.width = `${state.sect?.barrier || 0}%`;
  els.discipleCount.textContent = `${state.sect?.disciples.length || 0} 人`;
  els.disciples.innerHTML = state.sect
    ? state.sect.disciples
        .slice()
        .sort((a, b) => (b.core ? 1 : 0) - (a.core ? 1 : 0) || b.realm - a.realm || b.atk + b.def - (a.atk + a.def))
        .map((d) => `
          <article class="disciple disciple-select ${state.selectedDiscipleId === d.id ? "is-selected" : ""} ${d.core ? "is-core" : ""}" data-id="${d.id}">
            ${disciplePortraitHtml(d)}
            <div class="disciple-head"><span>${d.core ? "核心·" : ""}${d.name}</span><span class="realm">${realms[d.realm]} · ${d.exp}/100</span></div>
            <div class="disciple-stats">
              <span>体 ${d.hp}</span><span>攻 ${d.atk}</span><span>资 ${d.aptitude}</span><span>心 ${d.temper}</span>
            </div>
            <div class="tags">${d.traits.map((t) => `<span class="tag" title="${t.note}">${t.name}</span>`).join("")}</div>
          </article>
        `)
        .join("")
    : `<div class="target-detail">立下山门后会实时显示弟子修为、属性与词条。</div>`;
  for (const card of els.disciples.querySelectorAll(".disciple-select")) {
    card.addEventListener("click", () => {
      state.selectedDiscipleId = card.dataset.id;
      const d = state.sect.disciples.find((item) => item.id === state.selectedDiscipleId);
      if (d) flashFeedback(`已查看弟子：${d.core ? "核心·" : ""}${d.name}`);
      render();
    });
  }
  els.logCount.textContent = state.logs.length;
  els.log.innerHTML = state.logs.map((l) => `<div class="log-entry ${l.tone}"><strong>${l.at}</strong> ${l.text}</div>`).join("");
  renderRecruitment();
  renderDiscipleDetail();
  renderInventory();
  renderWorkshop();
  renderTarget();
  renderQuest();
  bindTraitChips();
  for (const btn of els.mapTabs?.querySelectorAll("button") || []) btn.classList.toggle("is-active", btn.dataset.map === state.currentMap);
}

function renderQuest() {
  if (!els.questTitle || !els.questDetail) return;
  if (!state.founded) {
    els.questTitle.textContent = "第一步：选择山门";
    els.questDetail.innerHTML = "<p>在大地图上点一个绿色“址”，查看灵气、资源和风险，然后点击立宗。手机端可先收起开局菜单再点地图。</p>";
    return;
  }
  let title = "分配行动点";
  let body = "点地图上的资源点、事件、敌宗或新地图节点，或者使用建设、参悟、炼丹炼器。行动点有限，优先补短板。";
  if (state.pendingBoon) {
    title = "选择年度天命";
    body = "每年先三选一决定发展倾向，行动点和事件都会围绕本年选择展开。";
  } else if (!state.selectedDiscipleId) {
    title = "查看弟子详情";
    body = "点名册里的弟子，可查看资质、修为、词条，并使用仓库丹药、装备和禁地遗物。";
  } else if (!state.recruitedThisYear) {
    const range = recruitRealmRange();
    const odds = recruitRealmOdds();
    title = "本年开山收徒";
    body = `候选弟子随机刷新，可免费刷新一次。当前最高 ${realms[range.maxRealm]}；筑基约 ${odds.foundation}% ，金丹约 ${odds.core}% ，不会直接招到元婴以上。`;
  } else if (state.actionPoints <= 0) {
    title = "结束本年";
    body = state.multiplayer ? "已无行动点。联机模式提交回合后，会等待所有玩家完成再进入下一年。" : "已无行动点。点击下一年，AI 会自动发展并可能袭扰、合攻或争夺边境。";
  } else if (frontierUnlocked() && state.currentMap === "central") {
    title = "中期解锁：边境";
    body = "你已满足边境门槛，可切换到边境妖域讨伐妖兽，获取元婴以上晋升材料。";
  }
  els.questTitle.textContent = title;
  els.questDetail.innerHTML = `<p>${body}</p>${goalMissionDashboard()}`;
  bindMissionButtons();
}

function goalMissionDashboard() {
  const route = sectRoutes.find((item) => item.id === state.selectedRoute);
  const goal = victoryGoals.find((item) => item.id === state.victoryGoal);
  const goalProgress = goal ? victoryGoalProgress(goal.id) : { pct: 0, text: "尚未选择" };
  const goalComplete = goal && goal.id !== "ascend" && goalProgress.pct >= 100;
  const goalClaimed = goal && state.completedVictoryGoals.includes(goal.id);
  const missions = missionCatalog.map((mission) => {
    const done = state.completedMissions.includes(mission.id);
    const ready = !done && mission.check();
    const rewards = Object.entries(mission.reward).map(([key, value]) => `${({ stones: "灵石", grain: "粮草", prestige: "声望", insight: "参悟", alchemyMats: "丹材", forgingMats: "器材", arrayMats: "阵材" }[key] || key)}+${value}`).join("、");
    return `<article class="mission-card ${done ? "is-done" : ready ? "is-ready" : ""}">
      <div><strong>${mission.name}</strong><span>${mission.text}</span><em>${rewards}</em></div>
      <button class="mission-claim" data-id="${mission.id}" ${ready ? "" : "disabled"}>${done ? "已领" : ready ? "领取" : "未完成"}</button>
    </article>`;
  }).join("");
  return `
    <div class="goal-box">
      <div><span>宗门路线</span><strong>${route?.name || "未定"}</strong></div>
      <div><span>终局目标</span><strong>${goal?.name || "未定"}</strong></div>
      <div class="goal-progress"><i style="width:${goalProgress.pct}%"></i></div>
      <p>${goal?.text || "开局后会选择长期目标。"} 当前进度：${goalProgress.pct}%｜${goalProgress.text}</p>
      ${goalComplete || goalClaimed ? `<button class="goal-finish" data-id="${goal.id}" ${goalClaimed ? "disabled" : ""}>${goalClaimed ? "结局已达成" : "完成该结局"}</button>` : ""}
    </div>
    <div class="mission-board">
      <strong>宗门任务板</strong>
      ${missions}
    </div>
  `;
}

function victoryGoalProgress(goalId) {
  const power = sectPower();
  const strongest = Math.max(1, ...activeRivals().map((r) => rivalStrategicPower(r)));
  const maxRealm = state.sect.disciples.length ? Math.max(...state.sect.disciples.map((d) => d.realm)) : 0;
  const owned = state.resources.filter((r) => r.owner === "player").length + (state.frontier?.outposts?.length || 0);
  const dip = state.sect.diplomacy || { reputation: 0, infamy: 0 };
  if (goalId === "ascend") return { pct: clamp(Math.round(maxRealm / 9 * 55 + state.sect.insight / 45 + state.forbidden?.clears * 8), 0, 99), text: `最高境界${realms[maxRealm]}，飞升需渡劫巅峰与巨量参悟` };
  if (goalId === "leader") return { pct: clamp(Math.round(dip.reputation / 7 + activeRivals().filter((r) => r.alliance).length * 10 + state.sect.prestige / 220 + (state.councilEdict ? 8 : 0)), 0, 100), text: `声誉${Math.round(dip.reputation)}，盟友${activeRivals().filter((r) => r.alliance).length}` };
  if (goalId === "overlord") return { pct: clamp(Math.round(power / strongest * 48 + state.sect.prestige / 34 + (state.frontier?.clears || 0) * 1.5), 0, 100), text: `本宗战力${power}，最强敌宗约${Math.round(strongest)}` };
  if (goalId === "tycoon") return { pct: clamp(Math.round(state.sect.stones / 115 + state.sect.buildings.market * 13 + Object.values(state.sect.marketPortfolio || {}).reduce((s, p) => s + p.qty, 0) * 2.4 + state.marketTradesThisYear), 0, 100), text: `灵石${Math.round(state.sect.stones)}，市集Lv.${state.sect.buildings.market}` };
  if (goalId === "arrayHeaven") return { pct: clamp(Math.round(formationPower() / 88 + owned * 3.6 + daoLevelFor("array") * 8 + state.sect.arrayMats * 0.8), 0, 100), text: `阵势${Math.round(formationPower())}，节点${owned}` };
  if (goalId === "demonicSupreme") {
    const ruins = state.rivals.filter((r) => r.alive === false).length;
    return { pct: clamp(Math.round((dip.infamy || 0) * 1.3 + ruins * 17 + power / strongest * 29), 0, 100), text: `恶名${Math.round(dip.infamy || 0)}，灭宗${ruins}` };
  }
  return { pct: 0, text: "未定" };
}

function bindMissionButtons() {
  for (const btn of els.questDetail.querySelectorAll(".mission-claim")) {
    btn.addEventListener("click", () => claimMission(btn.dataset.id));
  }
  for (const btn of els.questDetail.querySelectorAll(".goal-finish")) {
    btn.addEventListener("click", () => claimVictoryGoal(btn.dataset.id));
  }
}

function claimVictoryGoal(id) {
  const goal = victoryGoals.find((item) => item.id === id);
  if (!goal || goal.id === "ascend" || state.completedVictoryGoals.includes(id)) return;
  const progress = victoryGoalProgress(id);
  if (progress.pct < 100) return;
  state.completedVictoryGoals.push(id);
  state.sect.prestige += 160;
  state.sect.insight += 120;
  state.sect.stones += 600;
  showModal({
    kicker: "终局达成",
    title: goal.name,
    body: `<p>${state.sect.name}已完成「${goal.name}」。飞升仍是最高难度目标；本结局会保留在任务板中作为已达成记录。</p><div class="reward-list"><div><span>声望</span><strong>+160</strong></div><div><span>参悟</span><strong>+120</strong></div><div><span>灵石</span><strong>+600</strong></div></div>`,
    actions: [{ label: "继续经营宗门", handler: () => { closeModal(); render(); } }],
  });
  log(`终局达成：${goal.name}。本宗获得声望、参悟与灵石奖励。`, "good");
  render();
}

function claimMission(id) {
  const mission = missionCatalog.find((item) => item.id === id);
  if (!mission || state.completedMissions.includes(id) || !mission.check()) return;
  state.completedMissions.push(id);
  applyRewardToSect(mission.reward, mission.name);
  log(`完成宗门任务「${mission.name}」，获得少量引导奖励。`, "good");
  render();
}

function bindTraitChips() {
  document.querySelectorAll(".tag[title]").forEach((chip) => {
    chip.tabIndex = 0;
    chip.setAttribute("role", "button");
    chip.addEventListener("click", (evt) => {
      evt.stopPropagation();
      showModal({
        kicker: "词条说明",
        title: chip.textContent.trim(),
        body: `<p>${chip.getAttribute("title")}</p>`,
        actions: [{ label: "知道了", handler: closeModal }],
      });
    });
  });
}

const guidePages = [
  {
    title: "弟子养成：道心、体质与专精",
    body: `
      <p><strong>弟子养成入口</strong>在弟子详情的“弟子养成”按钮中。这里集中管理道心、体质、专精、师承、闭关、本命法宝、突破试炼和个人事件。</p>
      <p><strong>道心</strong>是弟子的长期性格路线，会影响年度修行、战斗倾向、心魔风险和个人事件收益。道心随弟子生成，不需要玩家频繁操作。</p>
      <p><strong>体质</strong>刷新率很低，新弟子约小概率天生拥有特殊体质。未显体质的弟子可以用“洗髓探体”尝试觉醒，但消耗材料且成功率依旧不高。</p>
      <p><strong>专精</strong>决定弟子的培养定位：剑修、体修、丹修、器修、阵修、毒修、雷修、阴阳修。专精会随年度修行、闭关、试炼和个人事件线性成长，并直接影响战力或炼制表现。</p>
      <p><strong>师徒传承</strong>允许低境界弟子拜高境界弟子为师，每年获得额外修为和专精经验。它不启用羁绊组合，只是稳定传承系统。</p>
      <p><strong>闭关</strong>可选择修为、功法或问心方向。闭关会持续若干年自动结算收益，适合中后期培养核心弟子。</p>
      <p><strong>本命法宝</strong>不占装备栏，消耗器材和洗练材料打造，可长期升级。突破试炼能为下一次渡劫积累加成。</p>
    `,
  },
  {
    title: "开局：模式、命名与选址",
    body: `
      <p><strong>单机模式</strong>：其他宗门由 AI 托管，每年自动发展、占点、结盟或袭扰你。</p>
      <p><strong>联机模式</strong>：所有玩家同一回合内操作，提交后等待其他玩家完成才进入下一年。</p>
      <p><strong>宗门名与印记</strong>：宗门名由玩家输入，宗门印记会显示在地图和本宗图标上。</p>
      <p><strong>选址</strong>：地图上的“址”可以立宗。灵气影响弟子成长，资源影响初期经济，风险会提高冲突和袭扰概率。</p>
    `,
  },
  {
    title: "回合：年份与行动点",
    body: `
      <p>游戏按年份推进。每年先选择年度天命，再分配有限行动点。</p>
      <p>常见行动包括：收徒、争夺资源、探索机缘、炼丹炼器、建设宗门、参悟功法、掠夺或结盟。</p>
      <p>行动点不能无限使用。议事殿、声望和部分天命会提高行动点，弟子过多会带来管理压力。</p>
      <p>行动点用完后点击“进入下一年”，AI 宗门会结算自己的行动，并弹出年度战报。</p>
    `,
  },
  {
    title: "弟子：属性、修为与死亡",
    body: `
      <p><strong>体魄</strong>影响生存和承伤，<strong>攻伐</strong>影响战斗和强取，<strong>守御</strong>影响防守和布阵。</p>
      <p><strong>身法</strong>影响逃脱、突进和探索速度，<strong>资质</strong>影响参悟、炼制和部分判定。</p>
      <p><strong>心性</strong>影响稳定、渡劫和抵御心魔，<strong>气运</strong>影响随机事件、奇遇和越阶概率。</p>
      <p>弟子进阶会触发渡劫，境界越高失败率越高。世界奇遇中弟子可能死亡，死亡后会从名册移除。</p>
    `,
  },
  {
    title: "招募：开山收徒",
    body: `
      <p>每年会随机刷新候选弟子，玩家自行选择是否收入门下。</p>
      <p>每年有一次刷新候选的机会，刷新后不能再反悔。</p>
      <p>候选弟子最高只到金丹，且金丹概率很低；筑基基础约一成。元婴以上必须靠培养、丹药和渡劫。</p>
      <p>点词条可以查看说明。词条会影响成长、战斗、炼丹、炼器、探索、结盟和随机事件。</p>
    `,
  },
  {
    title: "仓库、炼丹与炼器",
    body: `
      <p>丹药、武器、法器和探索所得会进入宗门仓库，可统一分配给弟子。</p>
      <p>工坊会列出所有弟子。炼丹先选择丹方，炼器先选择器方，不再随机出丹或随机出器。</p>
      <p>丹方和器方都会显示材料需求和“来源提示”，只告诉哪些机缘类型可能产出，具体选项需要玩家自行尝试。</p>
      <p>阵法需要弟子先进行阵道授课；普通阵图可累积宗门实力，护山大阵需要五名阵道弟子坐镇，成本极高但防守收益巨大。</p>
      <p>装备不会消耗掉，装备后可在弟子详情中卸下并放回仓库。</p>
    `,
  },
  {
    title: "山门市集：灵石投机",
    body: `
      <p>建设山门市集后，底部“山门市集”按钮解锁。市集商品是独立投机仓位，不进入仓库，也不能拿去炼丹炼器。</p>
      <p>商品价格每年波动，并显示折线图。买入有溢价，卖出有折价，因此不能当天无风险套利。</p>
      <p>每年交易次数有限。低买高卖能赚灵石，追高杀跌可能导致灵石被套牢，影响建设、炼制和远征。</p>
      <p>拥有“铁算盘心”等商贸词条的弟子，会提高年度灵石收入与卖出回笼收益，最多叠加到三成。</p>
    `,
  },
  {
    title: "地图：资源点与机缘",
    body: `
      <p>地图上的“矿、药、泉”是资源点，占领后每年提供稳定产出。</p>
      <p>争夺资源会按宗门综合实力判定，包括弟子、护山阵、建筑、道统、仓库、经济、声望和资源控制。</p>
      <p>本宗资源点可以派驻当前选中的弟子，提高该点防守。敌宗目标可以进行暗线破坏，但失败会积累恶名和宿怨。</p>
      <p>地图上的小字光点是普通机缘，点选后先派弟子探索，再做文本选择。选项背后会进行隐藏判定，玩家只能从文本和弟子特点中推测风险。</p>
      <p>普通机缘会持续刷新，观星楼可以发现更多机缘。低概率刷出的“万药秘圃”是专门获取炼丹材料的机缘。</p>
    `,
  },
  {
    title: "AI 宗门：发展、争夺与灭门",
    body: `
      <p>AI 宗门会每年行动：修炼、招弟子、提升炼丹炼器、占领资源、结交或挑衅。</p>
      <p>进入下一年后会弹出 AI 年度行动战报，显示它们做了什么，以及对你有什么直接影响。</p>
      <p>如果你过强，敌对 AI 可能组成联军袭扰你。</p>
      <p>敌宗有“底蕴”。连续击败同一宗门会削弱底蕴，归零后该宗门灭门，地图上变为遗址。</p>
    `,
  },
  {
    title: "宗门大比与世界奇遇",
    body: `
      <p><strong>宗门大比</strong>每十年自动开始。各宗派三名弟子参赛，按对位战斗推进锦标赛，排名越高奖励越好。</p>
      <p><strong>世界奇遇</strong>会在随机年份自动开启。各宗各派一名弟子参与，是 20 轮连续选择的长线副本。</p>
      <p>世界奇遇每个选择都会给出清晰的文本结果和奖励反馈，但不会直接显示判定数值。中途可能死亡，也可能获得大量灵石、声望、参悟、装备和道统提升。</p>
      <p>选择路线会影响最终结局，例如稳健、贪念、善念、血契、气运、诡计、参悟等。</p>
    `,
  },
  {
    title: "天命、羁绊、长老与心魔",
    body: `
      <p><strong>年度天命</strong>每年三选一，不只是提示文字。它会影响行动点、市场、拍卖、仙盟、炼制、资源点、情报、羁绊和心魔等系统。</p>
      <p><strong>弟子羁绊</strong>能提高战斗与修行，也会在世界奇遇死亡、远征失利等事件里产生情绪波动。核心弟子会在名册和选择列表置顶，方便培养。</p>
      <p><strong>长老/传承</strong>需要金丹以上弟子和声望。不同长老偏向传功、执法、丹器、镇守、商议，会给宗门长期加成。</p>
      <p><strong>心魔</strong>会拖慢修行并可能年度反噬。玩家可在弟子详情里消耗行动和参悟主动压制；魔潮年份压制成功收益更高，失败也更危险。</p>
    `,
  },
  {
    title: "仙盟、拍卖与情报",
    body: `
      <p><strong>仙盟会议</strong>会在若干年份自动召开，议题会持续数年，例如止戈、开秘境、商税、边防或讨伐强宗。</p>
      <p><strong>拍卖会</strong>会随机年份出现，只能拍下一件。高价值丹药、装备、材料和情报名册都可能出现，但会消耗灵石储备。</p>
      <p><strong>情报系统</strong>在建设观星楼后稳定可用。它会提示敌宗威胁、资源点风险、市集动量、世界奇遇时间和合围苗头。</p>
      <p>这些系统的核心是取舍：灵石要留给建设、炼制、防守还是拍卖，行动点要拿来探索、压心魔、情报研判还是争夺资源。</p>
    `,
  },
  {
    title: "资源点建设、驻守与AI偷袭",
    body: `
      <p>占领资源点后，可以建设镇守营、阵眼台、采脉司和储灵仓。采脉司提高产出，镇守营和阵眼台提高防守，储灵仓降低偷袭损失。</p>
      <p>本宗资源点可派驻当前选中的弟子。弟子战力、阵道等级、护山大阵、资源点建设都会共同决定守点能力。</p>
      <p>AI 宗门也会建设它们控制的资源点，并会尝试偷袭玩家资源点。观星楼、情报天命、驻守弟子和资源点建设可以提前拦截或降低损失。</p>
      <p>中后期不要只堆弟子修为。资源点经营、情报预判、仙盟议题和守点阵法，会决定你能不能把优势留住。</p>
    `,
  },
  {
    title: "路线、目标与任务板",
    body: `
      <p>立宗后会先选择宗门路线和终局目标。路线给一点开局倾向，目标会在“当前目标”里长期显示进度。</p>
      <p>六个目标分别是飞升结局、仙盟盟主、天下第一宗、商业霸主、阵法天庭、魔道独尊，难度都很高，不会轻易完成。</p>
      <p>宗门任务板用于引导阶段目标，例如收徒、占资源、开市集、进边境、推阵法。奖励偏少，只是帮助玩家理解流程。</p>
    `,
  },
  {
    title: "边境妖域与境界晋升",
    body: `
      <p>拥有 3 名金丹及以上弟子后，地图上方可切换到边境妖域。</p>
      <p>边境会每年刷新讨伐副本。最多派 5 名弟子进入，战斗用动画展示，失败会负伤，胜利有概率获得元婴以上晋升材料。</p>
      <p>弟子修为满后，金丹以前可自动渡劫；元婴及以上必须在弟子详情的“境界晋升”中放入对应材料，缺材料无法晋级。</p>
      <p>回血丹可在边境战斗中续战。回春丹初始可炼，中高阶回血丹和渡厄丹方主要通过拍卖会解锁。</p>
    `,
  },
  {
    title: "上古禁地与遗物",
    body: `
      <p>禁地是独立爬塔玩法，每十年 3 次尝试。选择一名弟子进入 20 层路线，途中会遇到战斗、精英、奖励和回血层。</p>
      <p>通过一层后可能获得蓝、紫、红三档强化，只在本次禁地生效。精英会掉落遗物，最终 Boss 前固定有回血关。</p>
      <p>弟子在禁地失败不会死亡，但会大幅损失体魄和心境。通关后可带出一件遗物，遗物可装备到弟子详情的遗物栏。</p>
      <p>带出的遗物多为双面效果，例如炼丹更强但失败会伤身、探索更强但心魔更重。总体利大于弊，但要配合弟子路线。</p>
    `,
  },
  {
    title: "职位、游历与心魔线",
    body: `
      <p><strong>宗门职位</strong>在弟子养成面板中任命，同一职位只能有一名弟子。首席、执律、丹房、器堂、外务和影网各自提供不同年度收益与战力加成。</p>
      <p><strong>弟子游历</strong>会让弟子外出 1 到 5 年，回归时结算灵石、修为、材料、装备或功法。远海访道收益更高，风险也更高。</p>
      <p><strong>心魔线</strong>不再只是扣血。心魔反噬会积累阶段，严重时可能化为参悟与战斗感悟，但风险仍会保留，最好用执律弟子、参悟和主动压制维持稳定。</p>
    `,
  },
  {
    title: "寿元、委派、危机与史册",
    body: `
      <p><strong>弟子寿元</strong>会随年份增长。高境界、心性、资质和气运能提高寿命，年老弟子坐化后会留下宗门薪火和先贤记录。</p>
      <p><strong>代际传承</strong>在弟子养成面板中使用。年长或高境界弟子可向后辈传功，消耗行动点和参悟，换取后辈修为、专精与宗门薪火。</p>
      <p><strong>弟子委派</strong>在建设菜单中进入，不消耗主行动点。可安排巡山、采集、商队、情报、讲法或丹器杂役，下一年统一结算。</p>
      <p><strong>宗门危机</strong>会受风险、恶名、心魔和年份影响爆发。可用行动点全力处置，也可通过年度委派提前降低烈度。</p>
      <p><strong>宗门史册</strong>记录传承、危机、坐化、称号和驱逐等大事。宗门称号会提供长期战力加成。</p>
      <p><strong>驱逐弟子</strong>在弟子详情操作区。驱逐会回收装备和遗物，但会损失声望并增加恶名，请谨慎使用。</p>
    `,
  },
  {
    title: "立绘槽位与轻量 UI",
    body: `
      <p>弟子名册、招募卡和详情页现在都有轻量立绘槽位。默认由 CSS 自动生成头像，不增加资源体积。</p>
      <p>如果后续要替换为真人设定图或 AI 生成图，只需要把图片放入 assets/portraits，并在 app.js 的 portraitAssetMap 里绑定弟子的 portraitId。</p>
      <p>立绘不会参与数值判定，只用于提高可读性和角色辨识度。</p>
    `,
  },
  {
    title: "分层秘境、暗线与仙盟榜单",
    body: `
      <p><strong>分层秘境</strong>是普通机缘的进阶探索。点击地图机缘后可选择“三层秘境”，连续探索遗宝、残经、灵药和问心房间，奖励更明确但危险会累积。</p>
      <p><strong>情报暗线</strong>在观星楼或情报天命下可用。安插暗线能削弱强宗底蕴、揭示风险；反谍清查能提高影网和护山稳定度。</p>
      <p><strong>仙盟榜单</strong>按战力、声望和灵石底蕴排序，联机玩家也会进入榜单。每十年结算一次排名奖励。</p>
      <p><strong>世界事件链</strong>会跨数年推进，例如魔门复苏、灵脉崩裂和仙盟内争。它们会改变心魔、资源、情报或声望环境。</p>
    `,
  },
  {
    title: "推荐开局路线",
    body: `
      <p>第一年建议：选择山门后先看年度天命，再收一名合适弟子。</p>
      <p>行动点优先用于：占领一个资源点、探索一次普通机缘、建设议事殿或观星楼。</p>
      <p>不要只堆修为。丹材、器材、护山阵、弟子词条和装备都会影响中后期。</p>
      <p>如果 AI 抢走资源点，先看守备压力和本宗综合实力，再决定夺回、结盟或暂时发育。</p>
    `,
  },
];

function openGuide() {
  showGuidePage(0);
}

function showGuidePage(index) {
  const pageIndex = clamp(index, 0, guidePages.length - 1);
  const page = guidePages[pageIndex];
  showModal({
    kicker: "新手手册",
    title: page.title,
    body: `
      <div class="guide-page">
        ${page.body}
      </div>
    `,
    actions: [
      { label: "上一页", handler: () => showGuidePage(pageIndex - 1), disabled: pageIndex === 0 },
      { label: pageIndex === guidePages.length - 1 ? "完成" : "下一页", handler: () => pageIndex === guidePages.length - 1 ? closeModal() : showGuidePage(pageIndex + 1) },
      { label: "关闭", handler: closeModal },
    ],
  });
  els.modalProgress.hidden = false;
  els.modalProgress.textContent = `${pageIndex + 1}/${guidePages.length}`;
  for (const [i, btn] of [...els.modalActions.querySelectorAll("button")].entries()) {
    if (i === 0) btn.disabled = pageIndex === 0;
  }
}

const tutorialSteps = [
  {
    id: "goal",
    maxYear: 3,
    selector: "#questDetail",
    title: "先看当前目标",
    text: "这里会告诉你本年最该做什么，并显示宗门路线、终局目标和任务板。前期跟着目标走，不容易漏掉关键系统。",
    condition: () => state.founded,
  },
  {
    id: "recruit",
    maxYear: 3,
    selector: ".recruit-panel",
    title: "每年先看候选弟子",
    text: "候选弟子每年刷新，能免费刷新一次。先看境界、资质和词条，再决定是否收入门下。",
    condition: () => state.founded && !state.recruitedThisYear,
  },
  {
    id: "disciples",
    maxYear: 4,
    selector: "#disciples",
    title: "点弟子查看详情",
    text: "弟子详情会显示战力、境界、装备、功法和可培养操作。后续战斗、机缘、炼丹炼器都围绕弟子分配。",
    condition: () => state.founded && (state.sect?.disciples?.length || 0) > 0,
  },
  {
    id: "cultivation",
    maxYear: 5,
    selector: "#discipleActions",
    title: "新增弟子养成入口",
    text: "选中弟子后，点击“弟子养成”可以管理道心、体质、专精、师徒、闭关、本命法宝、突破试炼和个人事件。核心弟子建议尽早确定专精。",
    condition: () => state.founded && Boolean(selectedDisciple()),
  },
  {
    id: "positionsTravel",
    maxYear: 8,
    selector: "#discipleActions",
    title: "养成里新增职位与游历",
    text: "选中弟子后进入“弟子养成”，可以任命宗门职位、安排外出游历，并管理闭关、本命法宝和心魔。",
    condition: () => state.founded && Boolean(selectedDisciple()),
  },
  {
    id: "inventory",
    maxYear: 5,
    selector: ".inventory-panel",
    title: "仓库已分类",
    text: "装备、功法、丹药、材料会分区显示。选中弟子后，可直接在仓库里装备、参悟功法或使用丹药。",
    condition: () => state.founded && (state.sect?.inventory?.length || 0) > 0,
  },
  {
    id: "map",
    maxYear: 5,
    selector: ".map-wrap",
    title: "地图是主要操作入口",
    text: "点击资源点、机缘、敌宗或其他玩家宗门，会在地图旁弹出可执行操作。多数操作会消耗行动点。",
    condition: () => state.founded && state.actionPoints > 0,
  },
  {
    id: "secretRealmIntel",
    maxYear: 8,
    selector: ".map-wrap",
    title: "机缘可进分层秘境",
    text: "地图机缘除了普通探索，还能选择分层秘境，连续三层获得更明确的装备、功法和材料奖励。观星楼解锁后也可以查看暗线与榜单。",
    condition: () => state.founded && state.events?.length > 0,
  },
  {
    id: "workshop",
    maxYear: 6,
    selector: ".workshop-panel",
    title: "炼丹炼器在工坊里做",
    text: "工坊会列出弟子能力。炼丹、炼器、阵法推演都在这里进入，材料来源会在配方说明里提示。",
    condition: () => state.founded && state.actionPoints > 0,
  },
  {
    id: "nextYear",
    maxYear: 6,
    selector: ".action-bar",
    title: "行动点用完就推进年份",
    text: "进入下一年后，AI、市场、奇遇、拍卖和联机同步都会结算。联机时会等待所有玩家提交回合。",
    condition: () => state.founded && state.actionPoints <= 0,
  },
  {
    id: "market",
    maxYear: 8,
    selector: "#marketBtn",
    title: "市集解锁后可交易",
    text: "山门市集建成后可倒卖行情，联机下会同步市场事件。灵石既是发展资源，也是拍卖和交易的筹码。",
    condition: () => state.founded && (state.sect?.buildings?.market || 0) > 0,
  },
  {
    id: "frontier",
    maxYear: 12,
    selector: "#mapTabs",
    title: "边境会在中期解锁",
    text: "拥有足够金丹弟子后可切到边境，挑战妖兽、巨兽和晋升材料副本。这里使用数值战斗动画。",
    condition: () => state.founded && frontierUnlocked(),
  },
  {
    id: "guide",
    maxYear: 12,
    selector: "#guideBtn",
    title: "随时打开完整手册",
    text: "地图右上角的问号保留了完整说明。忘记系统入口或规则时，可以随时回来看。",
    condition: () => state.founded,
  },
];

function tutorialSeen() {
  ensureSectDefaults();
  return new Set(state.tutorial?.seen || []);
}

function maybeShowTutorialStep() {
  if (!state.founded || !state.tutorial?.enabled || state.tutorial?.skipped) return;
  if (!els.eventModal.hidden || document.querySelector(".tutorial-callout")) return;
  const seen = tutorialSeen();
  const step = tutorialSteps.find((item) => !seen.has(item.id) && state.year <= item.maxYear && item.condition());
  if (!step) return;
  const target = document.querySelector(step.selector);
  if (!target) return;
  showTutorialHighlight(step, target);
}

function showTutorialHighlight(step, target) {
  clearTutorialHighlight();
  target.classList.add("tutorial-focus");
  target.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  const callout = document.createElement("div");
  callout.className = "tutorial-callout";
  callout.innerHTML = `
    <span>新手指引</span>
    <strong>${step.title}</strong>
    <p>${step.text}</p>
    <div class="tutorial-callout-actions">
      <button type="button" data-action="next">知道了</button>
      <button type="button" data-action="skip">跳过指引</button>
    </div>
  `;
  document.body.appendChild(callout);
  const place = () => {
    const rect = target.getBoundingClientRect();
    const pad = 12;
    const width = Math.min(330, window.innerWidth - pad * 2);
    callout.style.width = `${width}px`;
    const preferRight = rect.left + rect.width + width + pad < window.innerWidth;
    const left = preferRight ? rect.left + rect.width + pad : clamp(rect.left, pad, window.innerWidth - width - pad);
    const below = rect.bottom + callout.offsetHeight + pad < window.innerHeight;
    const top = below ? rect.bottom + pad : clamp(rect.top - callout.offsetHeight - pad, pad, window.innerHeight - callout.offsetHeight - pad);
    callout.style.left = `${left}px`;
    callout.style.top = `${top}px`;
  };
  requestAnimationFrame(place);
  callout.querySelector('[data-action="next"]').addEventListener("click", () => {
    state.tutorial.seen = [...new Set([...(state.tutorial.seen || []), step.id])];
    clearTutorialHighlight();
    render();
  });
  callout.querySelector('[data-action="skip"]').addEventListener("click", () => {
    state.tutorial.enabled = false;
    state.tutorial.skipped = true;
    clearTutorialHighlight();
    render();
  });
}

function clearTutorialHighlight() {
  document.querySelectorAll(".tutorial-focus").forEach((node) => node.classList.remove("tutorial-focus"));
  document.querySelectorAll(".tutorial-callout").forEach((node) => node.remove());
}


function renderDiscipleDetail() {
  const d = selectedDisciple();
  els.discipleActions.innerHTML = "";
  els.equipmentSlots.innerHTML = "";
  if (!d) {
    els.discipleDetailTitle.textContent = "未选择";
    els.discipleDetail.textContent = "点击弟子名册中的弟子，查看资质、修为、词条与可用培养操作。";
    return;
  }
  els.discipleDetailTitle.textContent = d.name;
  const bonds = discipleBonds(d);
  els.discipleDetail.innerHTML = `
    <div class="disciple-portrait-hero">
      ${disciplePortraitHtml(d, "large")}
      <div>
        <strong>${d.name}</strong>
        <span>${realms[d.realm]} · ${d.age || 18}/${d.lifespan || discipleLifeExpectancy(d)} 岁 · ${delegationTasks.find((task) => task.id === d.assignment)?.name || "未委派"}</span>
      </div>
    </div>
    <div class="detail-grid">
      <span>境界<strong>${realms[d.realm]} ${d.exp}/100</strong></span>
      <span>资质<strong>${d.aptitude}</strong></span>
      <span>成长<strong>${d.grow}</strong></span>
      <span>心性<strong>${d.temper}</strong></span>
      <span>体魄<strong>${d.hp}</strong></span>
      <span>攻伐<strong>${d.atk}</strong></span>
      <span>守御<strong>${d.def}</strong></span>
      <span>身法<strong>${d.speed}</strong></span>
      <span>阵道<strong>Lv.${d.arrayLevel || 0}</strong></span>
      <span>心魔<strong>${d.mind || 0}/100</strong></span>
      <span>寿元<strong>${d.age || 18}/${d.lifespan || discipleLifeExpectancy(d)}</strong></span>
      <span>委派<strong>${delegationTasks.find((task) => task.id === d.assignment)?.name || "无"}</strong></span>
    </div>
    <p>当前状态：${d.elder ? `${d.elderRole} / ` : ""}${d.status}。词条：${d.traits.map((t) => `${t.name}（${t.note}）`).join("、")}。</p>
    <p>羁绊：${bonds.length ? bonds.map(bondLabel).join("；") : "暂无"}。</p>
  `;
  els.discipleDetail.insertAdjacentHTML("afterbegin", `<div class="detail-power">战力 <strong>${Math.round(discipleBattleScore(d))}</strong></div>`);
  const heart = daoHeartOf(d);
  const con = constitutionOf(d);
  const spec = specializationOf(d);
  const mentor = mentorOf(d);
  const titles = discipleTitleNames(d);
  els.discipleDetail.insertAdjacentHTML("beforeend", `
    <div class="disciple-cultivation-strip">
      <span><b>道心</b>${heart?.name || "未定"}</span>
      <span><b>体质</b>${con?.name || "凡骨"}</span>
      <span><b>专精</b>${spec?.name || "未定"} Lv.${d.specializationLevel || 0}</span>
      <span><b>师承</b>${mentor?.name || "无"}</span>
      <span><b>职位</b>${sectPositionOf(d)?.name || "无"}</span>
      <span><b>游历</b>${d.travel ? `${d.travel.name}${d.travel.yearsLeft}年` : "无"}</span>
      <span><b>称号</b>${titles.length ? titles.join("、") : "无"}</span>
    </div>
  `);
  const activeMethods = (d.activeMethods || []).map((id) => {
    const method = d.methods?.find((item) => item.id === id);
    const data = methodCatalog[id];
    return data ? `${data.name}${method ? `(${Math.round(method.proficiency || 0)})` : ""}` : "";
  }).filter(Boolean);
  els.discipleDetail.insertAdjacentHTML("beforeend", `<p>携带功法：${activeMethods.length ? activeMethods.join(" → ") : "暂无"}。</p>`);
  renderEquipmentSlots(d);
  addActionTo(els.discipleActions, "弟子养成", () => openDiscipleCultivationPanel(d));
  addActionTo(els.discipleActions, d.core ? "取消核心弟子" : "设为核心弟子", () => toggleCoreDisciple(d));
  addActionTo(els.discipleActions, "驱逐弟子", () => confirmExpelDisciple(d), state.sect.disciples.length <= 1);
  addActionTo(els.discipleActions, "缔结羁绊", () => openBondMenu(d), state.sect.disciples.length < 2);
  addActionTo(els.discipleActions, d.elder ? "已是长老" : "晋为长老", () => promoteElder(d), d.elder || d.realm < 2 || state.sect.prestige < 180);
  addActionTo(els.discipleActions, "境界晋升", () => openAdvancementPanel(d), d.realm >= realms.length - 1 || d.exp < 100);
  addActionTo(els.discipleActions, "功法配置", () => openMethodPanel(d));
  addActionTo(els.discipleActions, `压制心魔 ${45 + Math.floor((d.mind || 0) * 1.5)}参悟`, () => suppressMindDemon(d), state.actionPoints < 1 || (d.mind || 0) < 12);
  addActionTo(els.discipleActions, `阵道授课 ${arrayTrainCost(d)}参悟`, () => trainArrayDisciple(d), state.actionPoints < 1 || state.sect.insight < arrayTrainCost(d));
  for (const slot of state.sect.inventory.filter((item) => item.count > 0 && itemCatalog[item.id] && !itemCatalog[item.id]?.material)) {
    const item = itemCatalog[slot.id];
    addActionTo(els.discipleActions, `${item.equipment ? "装备" : methodCatalog[slot.id] ? "参悟" : "使用"}${itemLabel(slot)} x${slot.count}`, () => useItemOnSelected(slot.id, slot.quality || 0, slot.gearUid || null));
  }
  for (const relicSlot of state.sect.relicInventory || []) {
    const relic = forbiddenRelics.find((item) => item.id === relicSlot.id);
    if (relic) addActionTo(els.discipleActions, `装备遗物：${relic.name}`, () => equipRelic(d, relicSlot));
  }
}

function toggleCoreDisciple(d) {
  d.core = !d.core;
  log(`${d.name}${d.core ? "被列为核心弟子，将在名册置顶。" : "已取消核心弟子标记。"}`, d.core ? "good" : "");
  render();
}

function confirmExpelDisciple(d) {
  if (!d) return;
  if ((state.sect?.disciples?.length || 0) <= 1) {
    flashFeedback("不能驱逐最后一名弟子。", "warn");
    return;
  }
  showModal({
    kicker: "驱逐弟子",
    title: `是否驱逐${d.name}`,
    body: `
      <p>驱逐后该弟子会离开宗门，羁绊、职位、师承关系会被解除；已装备的装备与遗物会自动放回仓库。</p>
      <p>此举会降低少量声望，并提高恶名。适合清理资质不合路线、心魔过高或内门资源压力过大的弟子。</p>
      <div class="ai-report-summary">
        <div><span>境界</span><strong>${realms[d.realm]}</strong></div>
        <div><span>年龄</span><strong>${d.age || 18}/${d.lifespan || discipleLifeExpectancy(d)}</strong></div>
        <div><span>心魔</span><strong>${d.mind || 0}</strong></div>
      </div>
    `,
    actions: [
      { label: "确认驱逐", handler: () => expelDisciple(d) },
      { label: "取消", handler: closeModal },
    ],
  });
}

function expelDisciple(d) {
  if (!d || (state.sect?.disciples?.length || 0) <= 1) return;
  for (const slot of gearSlots) {
    if (d.equipment?.[slot.key]) unequipItem(d, slot.key, false);
  }
  state.sect.bonds = (state.sect.bonds || []).filter((bond) => bond.a !== d.id && bond.b !== d.id);
  for (const other of state.sect.disciples) {
    if (other.mentorId === d.id) other.mentorId = "";
  }
  if (d.sectPosition) {
    if (state.sect.positions) delete state.sect.positions[d.sectPosition];
    d.sectPosition = "";
  }
  state.sect.disciples = state.sect.disciples.filter((item) => item.id !== d.id);
  state.sect.prestige = Math.max(0, state.sect.prestige - 18);
  state.sect.diplomacy = state.sect.diplomacy || { reputation: 20, infamy: 0 };
  state.sect.diplomacy.infamy += 4;
  recordSectHistory("驱逐弟子", `${d.name}被逐出山门，宗门声望受损。`, "warn");
  log(`${d.name}已被逐出山门。装备与遗物已回收，声望 -18，恶名 +4。`, "warn");
  state.selectedDiscipleId = state.sect.disciples[0]?.id || null;
  closeModal();
  render();
}

function renderEquipmentSlots(d) {
  const slots = gearSlots;
  els.equipmentSlots.innerHTML = slots.map((slot) => {
    const equipped = d.equipment?.[slot.key];
    const relic = equipped && slot.key === "relic" ? forbiddenRelics.find((item) => item.id === equipped.id) : null;
    const gearItem = equipped ? itemCatalog[equipped.id] : null;
    const label = relic ? relic.name : equipped && gearItem ? `${gearTierName(equipped.quality || 0)}${gearItem.name}` : equipped ? "旧装备" : "空";
    const affixes = equipped && slot.key !== "relic" ? gearAffixSummary(equipped) : "";
    return `<div class="equip-slot"><span>${slot.name}</span><strong>${label}</strong>${affixes ? `<em>${affixes}</em>` : ""}</div>`;
  }).join("");
  for (const slot of slots) {
    if (d.equipment?.[slot.key]) addActionTo(els.discipleActions, `卸下${slot.name}`, () => unequipItem(d, slot.key));
  }
}

function renderInventory() {
  if (!state.sect) {
    els.inventoryCount.textContent = "0 件";
    els.inventory.innerHTML = `<div class="target-detail">丹药、灵材和探索所得会存入仓库，可用于培养选中的弟子。</div>`;
    return;
  }
  const total = state.sect.inventory.reduce((sum, item) => sum + item.count, 0);
  const relicTotal = (state.sect.relicInventory || []).length;
  els.inventoryCount.textContent = `${total} 件 / 遗物${relicTotal}`;
  if (!state.sect.inventory.length && !relicTotal) {
    els.inventory.innerHTML = `<div class="target-detail">仓库暂空，可通过探索秘境、宗门大比和随机事件获得物品。</div>`;
    return;
  }
  const groups = [
    { key: "equipment", name: "装备", test: (slot, item) => item?.equipment },
    { key: "method", name: "功法", test: (slot) => Boolean(methodCatalog[slot.id]) },
    { key: "pill", name: "丹药", test: (slot, item) => item && !item.material && !item.equipment && !methodCatalog[slot.id] && typeof item.apply === "function" },
    { key: "material", name: "材料", test: (slot, item) => item?.material },
    { key: "unknown", name: "待鉴定", test: (slot, item) => !item },
  ];
  const sections = groups.map((group) => {
    const items = state.sect.inventory.filter((slot) => group.test(slot, itemCatalog[slot.id]));
    if (!items.length) return "";
    return `
      <section class="warehouse-section">
        <h4>${group.name}</h4>
        ${items.map((slot) => {
          const item = itemCatalog[slot.id];
          const affixes = item?.equipment ? gearAffixSummary(slot) : "";
          const action = item?.equipment ? "装备" : methodCatalog[slot.id] ? "参悟" : item?.material || !item ? "" : "使用";
          return `<div class="inventory-item quality-${gearTier(slot.quality || 0)}">
            <strong>${itemLabel(slot)} x${slot.count}</strong>
            <span>${item ? `${item.kind} · ${item.text}` : "旧存档或旧奖励中的未知物品，已暂存为待鉴定，不会再影响仓库分类。"}</span>
            ${affixes ? `<em>${affixes}</em>` : ""}
            ${action ? `<button class="warehouse-use" data-id="${slot.id}" data-quality="${slot.quality || 0}" data-uid="${slot.gearUid || ""}" ${selectedDisciple() ? "" : "disabled"}>${action}</button>` : ""}
            ${item?.equipment ? `<button class="warehouse-refine" data-uid="${slot.gearUid || ""}">洗练</button>` : ""}
          </div>`;
        }).join("")}
      </section>
    `;
  }).join("");
  const relics = relicTotal ? `
    <section class="warehouse-section">
      <h4>遗物</h4>
      ${(state.sect.relicInventory || []).map((slot) => {
        const relic = forbiddenRelics.find((item) => item.id === slot.id);
        return relic ? `<div class="inventory-item rarity-${relic.rarity}"><strong>${relic.name}</strong><span>禁地遗物 · ${relic.text}</span></div>` : "";
      }).join("")}
    </section>
  ` : "";
  els.inventory.innerHTML = sections + relics;
  els.inventory.querySelectorAll(".warehouse-use").forEach((btn) => {
    btn.addEventListener("click", () => useItemOnSelected(btn.dataset.id, Number(btn.dataset.quality || 0), btn.dataset.uid || null));
  });
  els.inventory.querySelectorAll(".warehouse-refine").forEach((btn) => {
    btn.addEventListener("click", () => openGearRefinePanel(btn.dataset.uid));
  });
}

function renderWorkshop() {
  els.workshopActions.innerHTML = "";
  if (!state.founded) {
    els.workshopStatus.textContent = "未开炉";
    els.workshopDetail.textContent = "立下山门后，可安排弟子炼丹、炼器与推演阵法。";
    return;
  }
  const alchemyCost = craftCost("alchemy");
  const forgingCost = craftCost("forging");
  const best = state.sect.disciples
    .map((d) => ({ d, alchemy: craftPreview(d, "alchemy"), forging: craftPreview(d, "forging") }))
    .sort((a, b) => (b.d.core ? 1 : 0) - (a.d.core ? 1 : 0) || Math.max(b.alchemy.score, b.forging.score) - Math.max(a.alchemy.score, a.forging.score));
  els.workshopStatus.textContent = `可派 ${state.sect.disciples.length} 人`;
  els.workshopDetail.innerHTML = `
    <p>直接选择弟子开炉，不必先去名册切换。炼丹会先选择丹方；炼器直接锻造；阵法需要弟子先完成阵道授课。</p>
    <p>当前成本：炼器 ${forgingCost} 灵石 + 1 器材；炼丹按丹方消耗材料；阵材 ${state.sect.arrayMats}。本年行动点 ${state.actionPoints}/${state.maxActionPoints}。</p>
    <div class="workshop-roster">
      ${best.map(({ d, alchemy, forging }) => `
        <article class="workshop-disciple ${state.selectedDiscipleId === d.id ? "is-selected" : ""} ${d.core ? "is-core" : ""}" data-id="${d.id}">
          <div>
            <strong>${d.core ? "核心·" : ""}${d.name}</strong>
            <span>${realms[d.realm]} · 资${d.aptitude} 心${d.temper} 运${d.luck}</span>
          </div>
          <div class="craft-score">
            <span>丹 ${qualityNames[alchemy.quality]} · 越阶${alchemy.leap}%</span>
            <span>器 ${qualityNames[forging.quality]} · 越阶${forging.leap}%</span>
          </div>
          <div class="tags">${d.traits.map((t) => `<span class="tag" title="${t.note}">${t.name}</span>`).join("")}</div>
          <div class="craft-actions">
            <button class="craft-btn" data-kind="alchemy" data-id="${d.id}" ${state.actionPoints < 1 || state.sect.stones < alchemyCost || state.sect.alchemyMats < 1 ? "disabled" : ""}>炼丹</button>
            <button class="craft-btn" data-kind="forging" data-id="${d.id}" ${state.actionPoints < 1 || state.sect.stones < forgingCost || state.sect.forgingMats < 1 ? "disabled" : ""}>炼器</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
  for (const card of els.workshopDetail.querySelectorAll(".workshop-disciple")) {
    card.addEventListener("click", () => {
      state.selectedDiscipleId = card.dataset.id;
      const d = state.sect.disciples.find((item) => item.id === state.selectedDiscipleId);
      if (d) flashFeedback(`工坊已选：${d.core ? "核心·" : ""}${d.name}`);
      render();
    });
  }
  for (const btn of els.workshopDetail.querySelectorAll(".craft-btn")) {
    btn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      craftItem(btn.dataset.kind, btn.dataset.id);
    });
  }
  addActionTo(els.workshopActions, "阵法推演", openFormationMenu, state.actionPoints < 1);
}

function craftPreview(d, kind) {
  const craftBonus = traitCraftBonus(d, kind);
  const effectiveCraftBonus = Math.floor(craftBonus * 0.32);
  const yearlyCraft = (state.yearlyBoon?.key === "craftBonus" ? 1 : 0) + (state.yearlyBoon?.key === "craftGuild" && kind === "forging" ? 1 : 0);
  const base = d.realm + yearlyCraft + Math.floor((d.aptitude + d.temper) / 70) + Math.floor(effectiveCraftBonus / 28) + Math.floor(daoLevelFor(kind) / 2);
  const quality = clamp(Math.floor(base / 2), 0, qualityNames.length - 1);
  const leap = clamp(5 + effectiveCraftBonus + yearlyCraft * 9 + d.realm * 4 + Math.floor(d.luck / 5) + daoLevelFor(kind) * 2, 0, 45);
  return { quality, leap, score: base * 100 + leap + effectiveCraftBonus };
}

function renderRecruitment() {
  if (!state.founded) {
    els.refreshStatus.textContent = "未开山";
    els.recruitmentPool.innerHTML = `<div class="target-detail">立下山门后，每年会随机刷新候选弟子。玩家可选择一名弟子收入门下，并拥有一次刷新机会。</div>`;
    els.refreshRecruitBtn.disabled = true;
    return;
  }
  if (state.recruitedThisYear) {
    els.refreshStatus.textContent = "本年已收徒";
  } else if (state.refreshedRecruitment) {
    els.refreshStatus.textContent = "已刷新";
  } else {
    els.refreshStatus.textContent = "可刷新一次";
  }
  els.refreshRecruitBtn.disabled = state.recruitedThisYear || state.refreshedRecruitment;
  const odds = recruitRealmOdds();
  els.recruitmentPool.innerHTML = state.recruitPool
    .length
    ? `<div class="target-detail">当前概率：炼气 ${odds.qi}% / 筑基约 ${odds.foundation}% / 金丹约 ${odds.core}% 。招募最高只到金丹，弟子养成仍是核心。</div>` + state.recruitPool
    .map((d) => `
      <article class="disciple recruit-card">
        ${disciplePortraitHtml(d)}
        <div class="disciple-head"><span>${d.name}</span><span class="realm">${realms[d.realm]} · 潜力 ${d.grow}</span></div>
        <div class="disciple-stats">
          <span>体 ${d.hp}</span><span>攻 ${d.atk}</span><span>御 ${d.def}</span><span>速 ${d.speed}</span>
        </div>
        <div class="tags">${d.traits.map((t) => `<span class="tag" title="${t.note}">${t.name}</span>`).join("")}</div>
        <button class="choose-disciple" data-id="${d.id}" ${state.recruitedThisYear || state.actionPoints < 1 || state.sect.stones < 80 ? "disabled" : ""}>收入门下</button>
      </article>
    `)
    .join("")
    : `<div class="target-detail">本年暂无候选弟子。</div>`;
  for (const btn of els.recruitmentPool.querySelectorAll(".choose-disciple")) {
    btn.addEventListener("click", () => recruit(btn.dataset.id));
  }
}

function renderTarget() {
  const node = state.selected;
  els.targetActions.innerHTML = "";
  renderMapActionBubble(node);
  if (!node) {
    els.targetTitle.textContent = "无";
    els.targetDetail.textContent = "点击地图上的宗门、矿脉、秘境或事件点查看可执行动作。";
    els.hint.textContent = state.founded ? "点击地图上的宗门、矿脉、秘境或事件点查看动作；每年行动点有限，完成后进入下一年。" : "输入宗门名后，在地图上选择山门所在地。山脉灵气高，河谷资源稳，边境风险更高。";
    return;
  }
  els.targetTitle.textContent = node.name;
  if (node.type === "frontierLocked") {
    els.targetDetail.textContent = "边境妖域是中期地图，用于元婴及以上晋升材料、妖兽讨伐、扩张边寨和兽潮压力。需要至少 3 名金丹及以上弟子才能入驻。";
    addAction("查看要求", () => showModal({ kicker: "边境要求", title: "金丹三人方可开关", body: `<p>当前金丹及以上弟子：${state.sect?.disciples.filter((d) => d.realm >= 2).length || 0}/3。边境妖兽整体强于同境弟子，进入前请准备回血丹和装备。</p>` }));
  } else if (node.type === "frontierDungeon") {
    const materialName = itemCatalog[node.material]?.name || "晋升材料";
    els.targetDetail.textContent = `${node.name}，${node.text} 推荐战力 ${Math.round(node.value)}，掉落 ${materialName}，剩余 ${node.ttl} 年。最多派 5 名弟子进入，战斗全程动画展示，可消耗回血丹提高容错。`;
    addAction("讨伐副本", () => openFrontierDungeon(node), !state.founded || state.actionPoints < 1);
  } else if (node.type === "frontierBoss") {
    const pct = Math.round((node.hp / Math.max(1, node.totalHp)) * 100);
    const logRows = (state.frontier.bossDamageLog || []).slice(0, 3).map((row) => `${row.name} ${Math.round(row.damage)}`).join("；") || "暂无挑战记录";
    els.targetDetail.textContent = `${node.name}，边境巨兽，血量 ${Math.round(node.hp)}/${Math.round(node.totalHp)}（${pct}%），强度 ${Math.round(node.power)}。所有联机玩家共享血量，可多次挑战造成累计伤害；本年未击杀则遁走。近期伤害：${logRows}。`;
    addAction("挑战巨兽", () => openFrontierBossRaid(node), !state.founded || state.actionPoints < 1 || node.defeated);
  } else if (node.type === "frontierPoint") {
    els.targetDetail.textContent = `${node.name}。边境扩张点可作为本宗前线据点，能抵御兽潮并提高边境副本收益。后续 AI 宗门也可能争夺这些据点。`;
    addAction(node.owner === "player" ? "已驻扎" : "扩张占点", () => occupyFrontierPoint(node), !state.founded || state.actionPoints < 1 || node.owner === "player");
  } else if (node.type === "forbiddenGate") {
    const cycle = forbiddenAttemptInfo();
    els.targetDetail.textContent = `上古禁地是独立 20 层爬塔玩法，每十年刷新 3 次尝试。当前周期剩余 ${cycle.left}/3 次。选择一名弟子进入，死亡不会删除弟子，但会重伤；通关可带出一件双面遗物。`;
    addAction("进入禁地", openForbiddenGate, !state.founded || cycle.left <= 0 || Boolean(state.forbiddenRun));
  } else if (node.type === "forbiddenFloor") {
    els.targetDetail.textContent = node.current ? `当前正在第 ${node.floor} 层。继续在弹框中选择路线。` : node.cleared ? `第 ${node.floor} 层已通过。` : `第 ${node.floor} 层尚未抵达。`;
  } else if (node.type === "overseasLocked") {
    els.targetDetail.textContent = "海外仙洲暂未开放。这个区域后续适合扩展海贸、散仙岛、跨海远征、外域宗门和全服事件。";
  } else if (node.type === "site") {
    const siteSummary = `${node.text} 灵气 ${node.aura}，资源 ${node.resource}，风险 ${node.risk}。`;
    els.targetDetail.textContent = siteSummary;
    els.hint.textContent = `选址：${node.name}｜灵气 ${node.aura}｜资源 ${node.resource}｜风险 ${node.risk}`;
    addAction("在此立宗", () => foundSect(node), state.founded);
  } else if (node.type === "remotePlayer") {
    const allied = arePlayersAllied(state.clientId, node.id);
    els.targetDetail.innerHTML = renderRemotePlayerDetail(node, allied);
    els.hint.textContent = `联机宗门：${node.name}｜战力 ${Math.round(node.power || 0)}${allied ? "｜盟友" : ""}`;
    addAction(allied ? "已结盟" : "玩家结盟", () => requestRemoteAlliance(node), !state.founded || !state.roomConnected || allied);
    addAction("玩家交易", () => requestRemoteTrade(node), !state.founded || !state.roomConnected);
    addAction("弟子切磋", () => remoteBattle(node, "spar"), !state.founded || !state.roomConnected || state.actionPoints < 1);
    addAction("联机掠夺", () => remoteBattle(node, "raid"), allied || !state.founded || !state.roomConnected || state.actionPoints < 1);
    addAction("联机抢徒", () => remoteBattle(node, "steal"), allied || !state.founded || !state.roomConnected || state.actionPoints < 1);
  } else if (node.type === "rival") {
    if (node.alive === false) {
      els.targetDetail.textContent = `${node.name}。此宗山门已破，只剩残阵与废库。原有资源点已被接管或重新归入大世界争夺。`;
      return;
    }
    els.targetDetail.textContent = `AI 宗门。战力 ${Math.round(node.power)}，弟子 ${node.disciples}，灵石 ${Math.round(node.stones)}，底蕴 ${Math.round(node.foundation || 0)}，炼丹 ${node.alchemy || 0}，炼器 ${node.forging || 0}，阵法 ${node.array || 0}，关系 ${node.attitude}，宿怨 ${node.grudges || 0}。${node.alliance ? "当前为盟友。" : "连续击败可削弱底蕴，底蕴归零后山门崩解。"}`;
    addAction("资源掠夺", () => battle(node, "raid"), !state.founded || node.alliance || state.actionPoints < 1);
    addAction("抢夺弟子", () => battle(node, "steal"), !state.founded || node.alliance || state.actionPoints < 1);
    addAction("缔结盟约", () => ally(node), !state.founded || node.alliance || state.actionPoints < 1);
    addAction("暗线破坏", () => sabotageRival(node), !state.founded || node.alliance || state.actionPoints < 1);
  } else if (node.type === "resource") {
    const ownerSect = node.owner && node.owner !== "player" ? state.rivals.find((r) => r.id === node.owner) : null;
    const owner = node.owner === "player" ? "本宗" : ownerSect ? ownerSect.name : node.owner ? "旧宗遗留" : "无主";
    const yields = [];
    if (node.yields?.stones) yields.push(`灵石 +${node.yields.stones}`);
    if (node.yields?.grain) yields.push(`粮草 +${node.yields.grain}`);
    if (node.yields?.alchemyMats) yields.push(`丹材 +${node.yields.alchemyMats}/年`);
    if (node.yields?.forgingMats) yields.push(`器材 +${node.yields.forgingMats}/年`);
    if (node.yields?.arrayMats) yields.push(`阵材 +${node.yields.arrayMats}/年`);
    const pressure = ownerSect && ownerSect.alive !== false ? Math.round(rivalStrategicPower(ownerSect, node)) : Math.round(node.value * 7.2);
    const actualYields = [];
    if (node.yields?.stones) actualYields.push(`灵石 +${resourceYield(node, "stones")}`);
    if (node.yields?.grain) actualYields.push(`粮草 +${resourceYield(node, "grain")}`);
    if (node.yields?.alchemyMats) actualYields.push(`丹材 +${resourceYield(node, "alchemyMats")}/年`);
    if (node.yields?.forgingMats) actualYields.push(`器材 +${resourceYield(node, "forgingMats")}/年`);
    if (node.yields?.arrayMats) actualYields.push(`阵材 +${resourceYield(node, "arrayMats")}/年`);
    if (node.yields?.refineStone) actualYields.push(`洗练灵砂 +${resourceYield(node, "refineStone")}/年`);
    if (node.yields?.affixLock) actualYields.push(`定纹玉扣 +${resourceYield(node, "affixLock")}/年`);
    const defense = Math.round(resourceGarrisonPower(node));
    const garrison = node.garrisonId ? state.sect.disciples.find((d) => d.id === node.garrisonId)?.name || "驻守弟子" : "无";
    els.targetDetail.textContent = `${node.name}，价值 ${node.value}，产出：${yields.join("，")}。当前归属：${owner}。驻守：${garrison}。守备压力约 ${pressure}。争夺会按宗门综合实力判定，弟子、建筑、道统、仓库、经济和护山阵都会计入。`;
    els.hint.textContent = `资源点：${node.name}｜归属 ${owner}｜守备压力约 ${pressure}`;
    els.targetDetail.textContent = `${node.name}，价值 ${node.value}，实际产出：${actualYields.join("、")}。当前归属：${owner}。驻守：${garrison}。资源点防守 ${defense}，守备压力约 ${pressure}。建设：${resourceUpgradeSummary(node)}。争夺会派一名弟子挑战驻守弟子或地脉守势。`;
    els.hint.textContent = `资源点：${node.name}｜归属 ${owner}｜防守 ${defense}`;
    addAction(node.owner === "player" ? "已占领" : "争夺资源", () => contestResource(node), !state.founded || node.owner === "player" || state.actionPoints < 1);
    if (node.owner === "player") {
      addAction("派驻弟子", () => assignGarrison(node), !state.founded);
      addAction("撤回驻守", () => removeGarrison(node), !state.founded || !node.garrisonId);
      addAction("建设据点", () => openResourceUpgrade(node), !state.founded || state.actionPoints < 1);
    }
  } else if (node.type === "event") {
    els.targetDetail.textContent = `${node.name}，机缘价值 ${node.value}，剩余 ${node.ttl} 季。派弟子探索可能获得灵石、修为和声望。`;
    els.hint.textContent = `机缘：${node.name}｜价值 ${node.value}｜剩余 ${node.ttl} 季`;
    addAction("探索机缘", () => exploreEvent(node), !state.founded || state.actionPoints < 1);
  } else if (node.type === "player") {
    const b = state.sect.buildings;
    const mountain = state.sect.mountainFormation ? `${formationQualityNames[state.sect.mountainFormation.quality]}护山大阵，阵势 ${Math.round(state.sect.mountainFormation.power)}` : "未布设护山大阵";
    const dip = state.sect.diplomacy || { reputation: 0, infamy: 0 };
    els.targetDetail.textContent = `本宗坐标 (${Math.round(node.x)}, ${Math.round(node.y)})，灵气 ${state.sect.aura}，风险 ${state.sect.risk}，资源 ${state.sect.resource}。建筑：议事殿${b.commandHall}、演武场${b.trainingHall}、市集${b.market}、观星楼${b.scoutTower}。声誉 ${Math.round(dip.reputation)}，恶名 ${Math.round(dip.infamy)}。阵法：${mountain}。本年天命：${state.yearlyBoon?.name || "未选择"}。`;
    addAction("宗门建设", openBuildMenu, !state.founded || state.actionPoints < 1);
    addAction("阵法推演", openFormationMenu, !state.founded || state.actionPoints < 1);
    addAction("山门市集", openMarketBoard, !state.founded || state.sect.buildings.market < 1);
    addAction("情报研判", openIntelBoard, !state.founded || ((state.sect.buildings.scoutTower < 1 && state.yearlyBoon?.key !== "intelBonus") || (state.actionPoints < 1 && state.yearlyBoon?.key !== "intelBonus")));
  }
}

function renderMapActionBubble(node) {
  els.mapActionBubble.innerHTML = "";
  if (!node || (!state.founded && node.type !== "site")) {
    els.mapActionBubble.hidden = true;
    els.mapActionBubble.dataset.kind = "";
    return;
  }
  els.mapActionBubble.dataset.kind = node.type || "";
  const rect = canvas.getBoundingClientRect();
  const wrap = canvas.parentElement.getBoundingClientRect();
  const bubbleWidth = Math.min(320, Math.max(240, wrap.width - 20));
  const bubbleHeight = window.matchMedia("(max-width: 560px)").matches ? 210 : 180;
  const rawLeft = (node.x / W) * rect.width + rect.left - wrap.left + 12;
  const rawTop = (node.y / H) * rect.height + rect.top - wrap.top - 8;
  els.mapActionBubble.style.left = `${clamp(rawLeft, 8, Math.max(8, wrap.width - bubbleWidth - 8))}px`;
  els.mapActionBubble.style.top = `${clamp(rawTop, 8, Math.max(8, wrap.height - bubbleHeight - 8))}px`;
  const add = (label, handler, disabled = false) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.disabled = disabled;
    btn.addEventListener("click", () => runActionWithFeedback(label, handler));
    els.mapActionBubble.appendChild(btn);
  };
  const addInfo = (html) => {
    const box = document.createElement("div");
    box.className = "map-action-info";
    box.innerHTML = html;
    els.mapActionBubble.appendChild(box);
  };
  if (node.type === "site") {
    addInfo(`<strong>${node.name}</strong><span>${node.text}</span><em>灵气 ${node.aura} · 资源 ${node.resource} · 风险 ${node.risk}</em>`);
  }
  if (node.type === "resource") {
    addInfo(`<strong>${node.name}</strong><span>价值 ${node.value}，归属：${node.owner === "player" ? "本宗" : node.owner ? "其他宗门" : "无主"}</span>`);
  }
  if (node.type === "remotePlayer") {
    addInfo(`
      <strong>${node.name}</strong>
      <span>联机宗门 · 战力 ${Math.round(node.power || 0)} · ${node.ready ? "已提交回合" : "操作中"}</span>
      <div class="map-mini-stats">
        <b>弟子 ${node.disciples || 0}</b>
        <b>最高 ${realms[node.maxRealm || 0]}</b>
        <b>灵石 ${Math.round(node.stones || 0)}</b>
      </div>
    `);
  }
  if (node.type === "rival") {
    const strategic = Math.round(rivalStrategicPower(node));
    const relation = node.alliance ? "盟友" : node.attitude >= 30 ? "友善" : node.attitude <= -30 ? "敌意" : "观望";
    addInfo(`
      <strong>${node.name}</strong>
      <span>${node.alive === false ? "宗门遗址" : `AI宗门 · 战力 ${Math.round(node.power || 0)} · 综合 ${strategic}`}</span>
      <div class="map-mini-stats">
        <b>弟子 ${node.disciples || 0}</b>
        <b>灵石 ${Math.round(node.stones || 0)}</b>
        <b>关系 ${relation}</b>
      </div>
    `);
  }
  if (node.type === "site") add("立宗", () => foundSect(node), state.founded);
  if (node.type === "resource") add(node.owner === "player" ? "已占领" : "争夺", () => contestResource(node), node.owner === "player" || state.actionPoints < 1);
  if (node.type === "resource" && node.owner === "player") add("建设", () => openResourceUpgrade(node), state.actionPoints < 1);
  if (node.type === "event") add("探索", () => exploreEvent(node), state.actionPoints < 1);
  if (node.type === "event") add("秘境", () => openLayeredSecretRealm(node), state.actionPoints < 1);
  if (node.type === "frontierLocked") add("要求", () => showModal({ kicker: "边境要求", title: "金丹三人方可开关", body: `<p>拥有 3 名金丹及以上弟子后，边境妖域会正式开放。</p>` }));
  if (node.type === "frontierDungeon") add("讨伐", () => openFrontierDungeon(node), state.actionPoints < 1);
  if (node.type === "frontierBoss") add("挑战巨兽", () => openFrontierBossRaid(node), state.actionPoints < 1 || node.defeated);
  if (node.type === "frontierPoint") add(node.owner === "player" ? "已驻扎" : "扩张", () => occupyFrontierPoint(node), state.actionPoints < 1 || node.owner === "player");
  if (node.type === "forbiddenGate") add("进入", openForbiddenGate, forbiddenAttemptInfo().left <= 0 || Boolean(state.forbiddenRun));
  if (node.type === "overseasLocked") add("查看", () => showModal({ kicker: "海外仙洲", title: "暂未开放", body: `<p>海外地图暂时锁定，后续可做海贸与外域宗门。</p>` }));
  if (node.type === "rival") {
    add(node.alive === false ? "遗址" : "掠夺", () => battle(node, "raid"), node.alive === false || node.alliance || state.actionPoints < 1);
    add("抢徒", () => battle(node, "steal"), node.alive === false || node.alliance || state.actionPoints < 1);
  }
  if (node.type === "remotePlayer") {
    const allied = arePlayersAllied(state.clientId, node.id);
    add(allied ? "盟友" : "结盟", () => requestRemoteAlliance(node), allied || !state.roomConnected);
    add("交易", () => requestRemoteTrade(node), !state.roomConnected);
    add("切磋", () => remoteBattle(node, "spar"), !state.roomConnected || state.actionPoints < 1);
    add("掠夺", () => remoteBattle(node, "raid"), allied || !state.roomConnected || state.actionPoints < 1);
    add("抢徒", () => remoteBattle(node, "steal"), allied || !state.roomConnected || state.actionPoints < 1);
  }
  els.mapActionBubble.hidden = els.mapActionBubble.children.length === 0;
}

function addAction(label, handler, disabled = false) {
  addActionTo(els.targetActions, label, handler, disabled);
}

function addActionTo(container, label, handler, disabled = false) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.disabled = disabled;
  btn.addEventListener("click", () => runActionWithFeedback(label, handler));
  container.appendChild(btn);
}

function render() {
  ensureSectDefaults();
  renderMap();
  updateButtons();
  renderUI();
  setTimeout(() => {
    recoverMissingYearlyBoon("年度状态修复");
    maybeShowTutorialStep();
  }, 0);
}

function updateButtons() {
  const disabled = !state.founded;
  const waiting = state.waitingForPlayers || Boolean(state.roomBlockedByForbidden);
  els.nextYearBtn.disabled = disabled || waiting;
  els.recruitBtn.disabled = disabled || waiting;
  els.raidBtn.disabled = disabled || waiting || state.actionPoints < 1;
  els.allyBtn.disabled = disabled || waiting || state.actionPoints < 1;
  const tournamentDone = state.lastTournamentYear === state.year;
  els.tournamentBtn.disabled = true;
  els.tournamentBtn.textContent = tournamentDone ? "本届已赛" : state.founded ? `大比自动：${state.year % 10 === 0 ? "本年" : `${state.year + (10 - state.year % 10)}年`}` : "宗门大比";
  els.buildBtn.disabled = disabled || waiting || state.actionPoints < 1;
  els.researchBtn.disabled = disabled || waiting;
  els.marketBtn.disabled = disabled || waiting || (state.sect?.buildings.market || 0) < 1;
  els.saveBtn.disabled = false;
  els.loadBtn.disabled = false;
  els.refreshRecruitBtn.disabled = disabled || waiting || state.recruitedThisYear || state.refreshedRecruitment;
}

function allNodes() {
  if (state.currentMap === "frontier") return frontierNodes();
  if (state.currentMap === "forbidden") return forbiddenNodes();
  if (state.currentMap === "overseas") return [{ id: "overseas-lock", type: "overseasLocked", name: "海外仙洲", x: W * 0.5, y: H * 0.5 }];
  return [
    ...(state.founded ? [{ ...state.sect, type: "player" }] : state.sites),
    ...(state.founded ? state.remotePlayers.filter((p) => p.founded).map((p) => ({ ...p, type: "remotePlayer" })) : []),
    ...state.resources,
    ...state.rivals,
    ...state.events.filter((event) => !event.resolving),
  ];
}

function canvasPoint(evt) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / rect.width) * W,
    y: ((evt.clientY - rect.top) / rect.height) * H,
  };
}

function hitTest(point) {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const radius = coarse ? 46 : 34;
  return allNodes()
    .map((node) => ({ node, d: Math.hypot(node.x - point.x, node.y - point.y) }))
    .filter((x) => x.d < radius)
    .sort((a, b) => a.d - b.d)[0]?.node;
}

function selectAtEvent(evt) {
  const point = canvasPoint(evt);
  const node = hitTest(point);
  if (!node) {
    state.selected = null;
    els.tip.hidden = true;
    render();
    return;
  }
  state.selected = node;
  if (!state.founded && node.type === "site") {
    render();
    return;
  }
  render();
}

function renderRemotePlayerDetail(node, allied) {
  const b = node.buildings || {};
  const stock = [
    `灵石 ${Math.round(node.stones || 0)}`,
    `粮草 ${Math.round(node.grain || 0)}`,
    `丹材 ${Math.round(node.alchemyMats || 0)}`,
    `器材 ${Math.round(node.forgingMats || 0)}`,
    `阵材 ${Math.round(node.arrayMats || 0)}`,
  ].join(" · ");
  return `
    <div class="remote-detail">
      <p>联盟等级：${tradeEscape(roomAllianceLabel(state.clientId, node.id))}</p>
      <p>联机玩家宗门。宗门：<strong>${tradeEscape(node.name)}</strong>，关系：${allied ? "玩家盟友" : "未结盟"}，状态：${tradeEscape(node.activity || (node.ready ? "等待回合" : "操作中"))}。</p>
      <div class="stat-list">
        <span>战力 ${Math.round(node.power || 0)}</span>
        <span>弟子 ${node.disciples || 0}</span>
        <span>最高 ${tradeEscape(realms[node.maxRealm || 0] || "凡人")}</span>
        <span>年份 ${node.year || 1}</span>
        <span>行动 ${node.actionPoints ?? "?"}/${node.maxActionPoints ?? "?"}</span>
        <span>${node.ready && Number(node.readyYear || 0) === state.year ? "本年已提交" : "本年操作中"}</span>
      </div>
      <p>山门：灵气 ${Math.round(node.aura || 0)}，风险 ${Math.round(node.risk || 0)}，资源 ${Math.round(node.resource || 0)}，护山 ${Math.round(node.barrier || 0)}。</p>
      <p>建筑：议事殿${b.commandHall || 0}、演武场${b.trainingHall || 0}、市集${b.market || 0}、观星楼${b.scoutTower || 0}。</p>
      <p>仓库：${stock}。声望 ${Math.round(node.prestige || 0)}。最强弟子：${tradeEscape(node.topDisciple || "未同步")}。</p>
    </div>
  `;
}

canvas.addEventListener("click", (evt) => {
  selectAtEvent(evt);
});

canvas.addEventListener("mousemove", (evt) => {
  const point = canvasPoint(evt);
  const node = hitTest(point);
  if (!node) {
    els.tip.hidden = true;
    return;
  }
  els.tip.hidden = false;
  els.tip.style.left = `${evt.clientX - canvas.getBoundingClientRect().left + 14}px`;
  els.tip.style.top = `${evt.clientY - canvas.getBoundingClientRect().top + 14}px`;
  els.tip.innerHTML = `<strong>${node.name}</strong><br>${node.type === "rival" || node.type === "remotePlayer" ? `战力 ${Math.round(node.power || 0)}` : node.type === "resource" ? `价值 ${node.value}` : node.type === "event" ? `剩余 ${node.ttl} 季` : node.type === "frontierDungeon" ? `推荐战力 ${Math.round(node.value)}` : node.type === "frontierBoss" ? `血量 ${Math.round(node.hp || 0)}/${Math.round(node.totalHp || 1)}` : node.type === "forbiddenFloor" ? `第 ${node.floor} 层` : node.type === "forbiddenGate" ? "禁地入口" : "可选山门"}`;
});

canvas.addEventListener("touchstart", (evt) => {
  evt.preventDefault();
  const touch = evt.changedTouches[0];
  selectAtEvent(touch);
}, { passive: false });

els.nextYearBtn.addEventListener("click", advanceYear);
els.modalCloseBtn.addEventListener("click", () => {
  if (typeof els.modalCloseBtn.onclick === "function") return;
  closeModal();
});
els.eventModal.addEventListener("click", (evt) => {
  if (evt.target === els.eventModal) {
    if (typeof els.modalCloseBtn.onclick === "function") els.modalCloseBtn.onclick();
    else closeModal();
  }
});
window.addEventListener("keydown", (evt) => {
  if (evt.key === "Escape" && !els.eventModal.hidden) {
    if (typeof els.modalCloseBtn.onclick === "function") els.modalCloseBtn.onclick();
    else closeModal();
  }
});
window.addEventListener("beforeunload", () => {
  if (!state.multiplayer || !state.roomConnected) return;
  saveMultiplayerRoomProgress(state.roomHost ? "房主关闭页面自动保存" : "离开房间自动保存");
  if (state.roomHost && net.ws && net.ws.readyState === WebSocket.OPEN) {
    try {
      net.ws.send(JSON.stringify({
        type: "room_feature",
        clientId: state.clientId,
        roomCode: state.roomCode,
        action: "room_close_save",
        sourceId: state.clientId,
        sourceName: state.sect?.name || "房主宗门",
        payload: {
          roomCode: state.roomCode,
          hostId: state.clientId,
          hostName: state.sect?.name || "房主宗门",
          year: state.year,
          savedAt: Date.now(),
          snapshot: createSharedWorldSnapshot(),
        },
      }));
    } catch {}
  }
});
els.startPanel.addEventListener("submit", (evt) => evt.preventDefault());
els.startCollapseBtn.addEventListener("click", (evt) => {
  evt.preventDefault();
  evt.stopPropagation();
  const collapsed = !els.startPanel.classList.contains("is-collapsed");
  els.startPanel.classList.toggle("is-collapsed", collapsed);
  els.startCollapseBtn.textContent = collapsed ? "展开菜单" : "收起选址";
});
els.randomNameBtn.addEventListener("click", () => {
  els.sectNameInput.value = randomPlayerSectName();
  els.sectNameInput.focus();
});
for (const btn of els.startPanel.querySelectorAll(".mode-card")) {
  btn.addEventListener("click", () => {
    enterGameMode(btn.dataset.mode || "solo");
  });
}
els.roomConnectBtn?.addEventListener("click", () => connectMultiplayerRoom());
els.lobbyBackBtn?.addEventListener("click", () => {
  if (state.roomConnected || net.ws) disconnectMultiplayerRoom("已退出联机大厅");
  state.roomLobbyReady = false;
  if (els.multiplayerToggle) els.multiplayerToggle.checked = false;
  showStartMenuPanel();
  updateRoomPopulation([]);
});
els.lobbyConnectBtn?.addEventListener("click", () => {
  state.multiplayer = true;
  if (els.multiplayerToggle) els.multiplayerToggle.checked = true;
  connectMultiplayerRoom(roomCodeValue());
});
els.lobbyReadyBtn?.addEventListener("click", toggleLobbyReady);
els.lobbyStartBtn?.addEventListener("click", () => startMultiplayerGameFromLobby(false));
els.lobbyLoadBtn?.addEventListener("click", () => {
  const room = roomCodeValue() || state.roomCode || "";
  if (!room) {
    flashFeedback("请先输入房间号", "warn");
    return;
  }
  loadMultiplayerRoomProgress(room);
});
els.lobbyRoomCodeInput?.addEventListener("input", () => {
  const code = roomCodeValue();
  if (els.roomCodeInput) els.roomCodeInput.value = code;
  updateMultiplayerLobbyControls();
});
els.lobbyRoomCodeInput?.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    evt.preventDefault();
    state.multiplayer = true;
    if (els.multiplayerToggle) els.multiplayerToggle.checked = true;
    connectMultiplayerRoom(roomCodeValue());
  }
});
els.roomCodeInput?.addEventListener("keydown", (evt) => {
  if (evt.key === "Enter") {
    evt.preventDefault();
    connectMultiplayerRoom();
  }
});
for (const btn of els.iconPicker.querySelectorAll("button")) {
  btn.addEventListener("click", () => {
    state.selectedSectIcon = btn.dataset.icon;
    for (const item of els.iconPicker.querySelectorAll("button")) item.classList.toggle("is-active", item === btn);
  });
}
for (const btn of els.mapTabs?.querySelectorAll("button") || []) {
  btn.addEventListener("click", () => switchMap(btn.dataset.map));
}
els.refreshRecruitBtn.addEventListener("click", refreshRecruitment);
els.recruitBtn.addEventListener("click", () => {
  document.querySelector(".recruit-panel").scrollIntoView({ behavior: "smooth", block: "nearest" });
});
els.raidBtn.addEventListener("click", () => battle(nearestRival(), "raid"));
els.allyBtn.addEventListener("click", () => {
  const target = nearestRival();
  if (target) ally(target);
});
els.tournamentBtn.addEventListener("click", tournament);
els.buildBtn.addEventListener("click", openBuildMenu);
els.researchBtn.addEventListener("click", openResearchMenu);
els.marketBtn.addEventListener("click", openMarketBoard);
els.saveBtn.addEventListener("click", saveGame);
els.loadBtn.addEventListener("click", loadGame);
els.guideBtn.addEventListener("click", openGuide);
els.newGameBtn.addEventListener("click", initWorld);

function setupPanelCollapsers() {
  document.querySelectorAll(".side-pane .panel").forEach((panel, index) => {
    const title = panel.querySelector(".panel-title");
    if (!title || title.querySelector(".panel-collapse")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "panel-collapse";
    btn.title = "折叠/展开";
    btn.textContent = "折";
    btn.addEventListener("click", (evt) => {
      evt.stopPropagation();
      const collapsed = !panel.classList.contains("is-collapsed");
      panel.classList.toggle("is-collapsed", collapsed);
      btn.textContent = collapsed ? "展" : "折";
    });
    title.appendChild(btn);
    if (window.matchMedia("(max-width: 760px)").matches && index > 2) {
      panel.classList.add("is-collapsed");
      btn.textContent = "展";
    }
  });
}

function animate() {
  renderMap();
  requestAnimationFrame(animate);
}

setupPanelCollapsers();
initWorld();
animate();
