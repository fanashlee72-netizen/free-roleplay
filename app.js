const CHARACTERS = {
  sousuke: {
    name: "山崎宗介",
    short: "宗介",
    mark: "宗",
    className: "sousuke",
  },
  rin: {
    name: "松冈凛",
    short: "凛",
    mark: "凛",
    className: "rin",
  },
};

const ERAS = {
  elementary: {
    name: "小学",
    kana: "CHILDHOOD",
    defaultScene: "pool",
  },
  high_school: {
    name: "高中",
    kana: "HIGH SCHOOL",
    defaultScene: "dorm",
  },
  university: {
    name: "大学",
    kana: "UNIVERSITY",
    defaultScene: "pool",
  },
};

const SCENES_BY_ERA = {
  elementary: {
    pool: {
      name: "小学泳池",
      kana: "SCHOOL POOL",
      icon: "🏊",
      desc: "岩鸢小学的室外泳池，放学后只剩你们两个人，水面被夕阳照得发亮。",
    },
    dorm: {
      name: "河堤傍晚",
      kana: "RIVERBANK",
      icon: "🌇",
      desc: "放学后的河堤，夕阳把水面染成橙色，远处传来社团活动的哨声。",
    },
    morning: {
      name: "暑假早晨",
      kana: "SUMMER MORNING",
      icon: "☀",
      desc: "暑假的早晨，蝉鸣很响，泳池还没开门，两个人坐在树荫下等。",
    },
    after_race: {
      name: "第一次比赛",
      kana: "FIRST RACE",
      icon: "🏁",
      desc: "地区小学生游泳比赛结束后，看台边全是人，广播还在念成绩。",
    },
       festival: {
      name: "小学的校园祭",
      kana: "SCHOOL FESTIVAL",
      icon: "🏮",
      desc: "白天的校园祭，教室改成了摊位，走廊里全是笑声。傍晚灯笼亮起来，人反而更多了。",
    },
    graduation: {
      name: "凛出发前",
      kana: "BEFORE DEPARTURE",
      icon: "✈",
      desc: "小六的冬天，车站前的广场，风很冷。凛明天就要去澳大利亚了。",
    },
  },
  high_school: {
    dorm: {
      name: "宿舍夜谈",
      kana: "MIDNIGHT DORM",
      icon: "🌙",
      desc: "熄灯后的鲛柄学园宿舍，窗外有虫鸣，桌上还摊着训练计划。",
    },
    pool: {
      name: "泳池边",
      kana: "POOL SIDE",
      icon: "🏊",
      desc: "夜晚的鲛柄学园室内泳池，水面映着灯光，池边只剩你们两个人。",
    },
    morning: {
      name: "早晨赖床",
      kana: "LAZY MORNING",
      icon: "☀",
      desc: "早晨的宿舍，闹钟已经响过三遍，阳光从窗帘缝里钻进来。",
    },
    after_race: {
      name: "比赛后",
      kana: "AFTER THE RACE",
      icon: "🏁",
      desc: "比赛结束后的看台通道，人群还没散尽，空气里有消毒水和汗水的气味。",
    },
    festival: {
      name: "鲛柄校园祭",
      kana: "SCHOOL FESTIVAL",
      icon: "🏮",
      desc: "白天的校园祭，摊位挤满校道。游泳部的“地狱女仆咖啡厅”门口排起了长队，入夜后灯笼亮起来，人反而更多。",
    },
    graduation: {
      name: "毕业温泉旅行",
      kana: "GRADUATION TRIP",
      icon: "♨",
      desc: "毕业旅行的温泉旅馆，走廊里飘着水汽，窗外是山。",
    },
  },
  university: {
    pool: {
      name: "大学泳池",
      kana: "UNIVERSITY POOL",
      icon: "🏊",
      desc: "大学游泳部的训练池，晚上只剩水声和计时器的滴答。",
    },
    dorm: {
      name: "合租夜谈",
      kana: "SHARED APARTMENT",
      icon: "🌙",
      desc: "大学附近的合租公寓，桌上摊着训练计划和外卖，窗外是城市的灯。",
    },
    morning: {
      name: "清晨训练",
      kana: "EARLY TRAINING",
      icon: "☀",
      desc: "清晨的公寓，闹钟响到第三遍，窗外天刚亮，泳池还没开门。",
    },
    after_race: {
      name: "大学比赛后",
      kana: "AFTER THE RACE",
      icon: "🏁",
      desc: "大学联赛结束后的通道，观众还没散尽，队友的欢呼从远处传来。",
    },
       festival: {
      name: "大学校园祭",
      kana: "SCHOOL FESTIVAL",
      icon: "🏮",
      desc: "大学校园祭的白天，操场边搭起舞台，人群和音乐混在一起。傍晚灯光亮起，气氛更热。",
    },
    graduation: {
      name: "毕业后",
      kana: "AFTER GRADUATION",
      icon: "🎓",
      desc: "毕业后的夏天，两个人约在原来常去的泳池边。水面很安静，蝉鸣很响。",
    },
  },
};

const OPENERS = {
  elementary: {
    sousuke: {
      pool: "（蹲在池边试水温，回头看你）水有点凉。你先下，我数三下。",
      dorm: "（把书包放在河堤栏杆上，晃着腿）今天的练习，你最后那趟没有换气。",
      morning: "（坐在树荫下，把泳镜挂在脖子上）泳池还没开门。你来得比我还早。",
      after_race: "（把毛巾递给你，声音很轻）刚才那场，你游得比练习时快。",
      festival: "（站在摊位旁边，手里拿着两串团子）人比想象中多。你别走散了。",
      graduation: "（把围巾往上拉了拉，站在车站前）……东西都收拾好了？",
    },
    rin: {
      pool: "（站在池边，脚尖一下一下点着水面）我才不怕冷。你数吧，数完我就跳。",
      dorm: "（把书包往栏杆上一挂，坐到你旁边）喂，你今天看见我转身了吗？",
      morning: "（打了个哈欠，抱着膝盖）再等五分钟。泳池又不会跑。",
      after_race: "（捏着成绩单，眼睛亮亮的）看见没有？我比上次快了。",
      festival: "（举着刚捞到的金鱼，回头冲你笑）看见没有？我就说我能捞到。",
      graduation: "（踢了踢脚边的石子，别过脸）……又不是不回来了。别摆那种表情。",
    },
  },
  high_school: {
    sousuke: {
      dorm: "（熄灯后的宿舍，宗介把训练计划合上，抬眼看你）……明天还要早起。你确定要聊到这么晚？",
      pool: "（水面晃了一下，宗介扶着池边）再来一组？这次我不会让你。",
      morning: "（闹钟响到第三遍，宗介伸手把它按掉）……起床。再赖下去，早餐就没了。",
      after_race: "（看台通道还没散场，宗介把一瓶水递过来）刚才那场，游得不错。",
      festival: "（女仆咖啡厅的后厨门口，宗介把围裙解下来搭在手臂上，看了你一眼）……执事服，挺像那么回事的。",
      graduation: "（靠在旅馆走廊的窗边，听着远处的笑声）……毕业旅行，比想象中安静。",
    },
    rin: {
      dorm: "（熄灯后的宿舍，凛翻了个身，把枕头拍松）喂，你还没睡吧？别装。",
      pool: "（凛把泳镜往额头上一推，水珠顺着下巴滴下来）再来一组。刚才那个不算。",
      morning: "（闹钟响到第三遍，凛把被子往上拉了拉）……五分钟。就五分钟。",
      after_race: "（凛把毛巾搭在脖子上，回头看你）哼，别以为赢了我一次就了不起。",
      festival: "（穿着执事服站在咖啡厅门口，手里端着托盘，别过脸）……看什么看。这是部活。似鸟他们穿女仆装的时候你怎么不盯着看。",
      graduation: "（把毛巾搭在肩上，敲了敲你的门）喂，去泡温泉了。别磨蹭。",
    },
  },
  university: {
    sousuke: {
      pool: "（靠在池边，计时器停在手边）最后一组。游完去吃饭，别又说不饿。",
      dorm: "（把外卖盒推到你面前，自己靠着沙发）训练计划我看过了。第三组太满。",
      morning: "（把窗帘拉开，光落在桌上）起床。再睡下去，早训就赶不上了。",
      after_race: "（把水递给你，目光扫过记分牌）不错。不过你最后五十米还能再快。",
      festival: "（把外套搭在手臂上，站在舞台灯光外）这里还是这么吵。你要看哪个摊位？",
      graduation: "（靠在池边的栏杆上，回头看你）毕业之后，这里还是没变。",
    },
    rin: {
      pool: "（把泳镜推到额头上，水顺着下巴滴下来）再来一组。这次我不会让你追上。",
      dorm: "（盘腿坐在地板上，翻着训练计划）喂，你最近是不是又偷偷加练了？",
      morning: "（把被子往头上一蒙）……十分钟。就十分钟。",
      after_race: "（看着记分牌，嘴角压不住）哼，这才像话。下次继续。",
      festival: "（从人群里挤回来，手里拿着两杯饮料）给。别又说你不渴。",
      graduation: "（把外套搭在肩上，踩着拖鞋走过来）喂，等很久了？",
    },
  },
};

const CUSTOM_OPENERS = {
  elementary: {
    sousuke: "（看了看四周，语气很轻）这里……就我们两个人？",
    rin: "（好奇地东张西望）喂，这里比泳池有意思多了。",
  },
  high_school: {
    sousuke: "（把毛巾搭在肩上，扫了一眼周围）……说吧，找我什么事。",
    rin: "（抱着手臂，抬了抬下巴）怎么，特意把我叫到这种地方？",
  },
  university: {
    sousuke: "（把外套搭在椅背上，语气平静）这里挺安静。你想聊什么？",
    rin: "（拉开椅子坐下，长腿一伸）行吧，说吧。今天又有什么事？",
  },
};

const MEMORIES = [
  "（回忆）小时候，两个人并肩站在泳池边，谁都不肯先下水。",
  "（回忆）佐野游泳俱乐部的更衣室里，宗介把护肩往上拉了一下，装作什么都没发生。",
  "（回忆）凛在更衣室里反复系着泳镜带，嘴上说着无所谓。",
  "（回忆）下雨天，两个人挤在同一把伞下，谁也没说话。",
  "（回忆）小六冬天的回家路上，凛说找到了能一起游接力的人。宗介只是听着。",
  "（回忆）比赛前夜，走廊尽头的自动贩卖机亮着，两罐饮料碰在一起。",
  "（回忆）凛先游到终点，回头却看见宗介还站在池边，捂着肩膀。",
  "（回忆）训练结束后，两个人在空荡荡的看台上坐了很久。",
  "（回忆）小时候为了最后一根可乐冰棒猜拳，输了的人一路都没说话。",
  "（回忆）鲛柄宿舍，两个人用猜拳决定谁睡上铺。凛输了，把枕头扔上去。",
  "（回忆）校园祭的“地狱女仆咖啡厅”，似鸟穿着女仆装端盘子，凛穿着执事服别过脸。",
  "（回忆）宗介在后厨把围裙解下来，说“反正最后都要脱掉的，有什么差别”。",
  "（回忆）校园祭结束后，两个人躲在教学楼后面分一份章鱼烧。",
  "（回忆）岩鸢的夏天，几个人在河边比谁先跑到桥上。",
  "（回忆）鲛柄的食堂里，似鸟端着餐盘小心翼翼地问宗介要不要一起坐。",
];

const CUSTOM_SCENES_KEY = "free-roleplay-custom-scenes";

const state = {
  userRole: "rin",
  era: "high_school",
  scene: "dorm",
  customScene: null,
  customScenes: [],
  intensity: 32,
  rapport: 42,
  awkward: 58,
  history: [],
  busy: false,
  memoryBag: [],
  memoryMode: false,
  trackingId: "",
  trackingRequired: false,
  trackingGate: false,
  voiceMode: "off",
  eggEnabled: true,
  lastAiText: "",
  replyLanguage: "zh",
};

try {
  state.trackingId = localStorage.getItem("free-roleplay-tracking-id") || "";
  const savedLanguage = localStorage.getItem("free-roleplay-language");
  if (savedLanguage === "ja" || savedLanguage === "zh") {
    state.replyLanguage = savedLanguage;
  }
  const savedScenes = JSON.parse(localStorage.getItem(CUSTOM_SCENES_KEY) || "[]");
  if (Array.isArray(savedScenes)) {
    state.customScenes = savedScenes.filter(
      (scene) => scene && scene.id && scene.name && scene.desc
    );
  }
} catch (error) {
  /* 隐私模式下无法读取 */
}

const els = {
  status: document.getElementById("status"),
  statusText: document.getElementById("statusText"),
  clearBtn: document.getElementById("clearBtn"),
  trackingBtn: document.getElementById("trackingBtn"),
  trackingBanner: document.getElementById("trackingBanner"),
  trackingSetup: document.getElementById("trackingSetup"),
  trackingModal: document.getElementById("trackingModal"),
  trackingClose: document.getElementById("trackingClose"),
  trackingCancel: document.getElementById("trackingCancel"),
  trackingSave: document.getElementById("trackingSave"),
  trackingInput: document.getElementById("trackingInput"),
  trackingStatus: document.getElementById("trackingStatus"),
  castList: document.getElementById("castList"),
  eraGrid: document.getElementById("eraGrid"),
  sceneGrid: document.getElementById("sceneGrid"),
  intensity: document.getElementById("intensity"),
  toneLabel: document.getElementById("toneLabel"),
  rapportBar: document.getElementById("rapportBar"),
  rapportValue: document.getElementById("rapportValue"),
  awkwardBar: document.getElementById("awkwardBar"),
  awkwardValue: document.getElementById("awkwardValue"),
  syncHint: document.getElementById("syncHint"),
  sceneName: document.getElementById("sceneName"),
  sceneKana: document.getElementById("sceneKana"),
  sceneDesc: document.getElementById("sceneDesc"),
  memoryBtn: document.getElementById("memoryBtn"),
  memoryEndBtn: document.getElementById("memoryEndBtn"),
  voiceBtn: document.getElementById("voiceBtn"),
  voicePanel: document.getElementById("voicePanel"),
  eggToggle: document.getElementById("eggToggle"),
  voiceNote: document.getElementById("voiceNote"),
  chatLog: document.getElementById("chatLog"),
  composer: document.getElementById("composer"),
  input: document.getElementById("messageInput"),
  sendBtn: document.getElementById("sendBtn"),
  sceneModal: document.getElementById("sceneModal"),
  sceneClose: document.getElementById("sceneClose"),
  sceneCancel: document.getElementById("sceneCancel"),
  sceneSave: document.getElementById("sceneSave"),
  sceneNameInput: document.getElementById("sceneNameInput"),
  sceneDescInput: document.getElementById("sceneDescInput"),
  sceneStatus: document.getElementById("sceneStatus"),
};

const AI_ROLE = () => (state.userRole === "rin" ? "sousuke" : "rin");

/* ---------- 音频彩蛋（单例） ---------- */

const audioPlayer = new Audio();
audioPlayer.preload = "auto";
audioPlayer.volume = 0.9;

function playEasterEgg(src) {
  if (!src) return;
  stopSpeaking();
  try {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = src;
    const promise = audioPlayer.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch((error) => {
        console.warn("[audio] 播放被阻止：", error);
      });
    }
  } catch (error) {
    console.warn("[audio] 播放异常：", error);
  }
}

audioPlayer.addEventListener("error", () => {
  console.warn("[audio] 加载失败：", audioPlayer.src);
});

/* ---------- 语音菜单 ---------- */

const voiceCache = { zh: null, ja: null };

function refreshVoices() {
  if (!("speechSynthesis" in window)) return;
  const voices = window.speechSynthesis.getVoices();
  voiceCache.zh =
    voices.find((voice) => /^zh/i.test(voice.lang)) ||
    voices.find((voice) => /Chinese|中文|普通话/i.test(voice.name)) ||
    null;
  voiceCache.ja =
    voices.find((voice) => /^ja/i.test(voice.lang)) ||
    voices.find((voice) => /Japanese|日本語/i.test(voice.name)) ||
    null;
}

function speechText(text) {
  return String(text)
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function speakText(text, aiRole) {
  if (!("speechSynthesis" in window)) {
    console.warn("[voice] 当前浏览器不支持 TTS");
    return;
  }
  const clean = speechText(text);
  if (!clean) return;

  if (!audioPlayer.paused) audioPlayer.pause();
  window.speechSynthesis.cancel();
  const isJapanese = state.replyLanguage === "ja";
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = isJapanese ? "ja-JP" : "zh-CN";
  utterance.rate = aiRole === "rin" ? (isJapanese ? 1.02 : 1.06) : (isJapanese ? 0.92 : 0.94);
  utterance.pitch = aiRole === "rin" ? 1.06 : 0.84;
  const voice = voiceCache[state.replyLanguage];
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function updateVoiceUI() {
  const auto = state.voiceMode === "tts";
  els.voiceBtn.classList.toggle("active", auto);
  els.voicePanel.querySelectorAll("[data-voice]").forEach((button) => {
    if (button.dataset.voice === "tts") {
      button.classList.toggle("active", auto);
    }
  });
  els.voicePanel.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.lang === state.replyLanguage
    );
  });
  if (els.eggToggle) els.eggToggle.checked = state.eggEnabled;
}

function setVoiceMode(mode) {
  state.voiceMode = mode;
  if (mode !== "tts") stopSpeaking();
  updateVoiceUI();
}

function setReplyLanguage(language) {
  state.replyLanguage = language === "ja" ? "ja" : "zh";
  try {
    localStorage.setItem("free-roleplay-language", state.replyLanguage);
  } catch (error) {
    /* 忽略 */
  }
  updateVoiceUI();
  if (els.voiceNote) {
    if (state.replyLanguage === "ja") {
      els.voiceNote.textContent = voiceCache.ja
        ? "日语台词模式：AI 会用日语回复，TTS 使用 ja-JP 声音。"
        : "日语台词模式：AI 会用日语回复；当前浏览器未找到日语 TTS 语音，可在系统里安装日语语音包。";
    } else {
      els.voiceNote.textContent = "中文台词模式：AI 会用中文回复。";
    }
  }
}

function toggleVoicePanel(force) {
  const show = typeof force === "boolean" ? force : els.voicePanel.hidden;
  els.voicePanel.hidden = !show;
  els.voiceBtn.setAttribute("aria-expanded", String(show));
}

async function playLocalVoice() {
  try {
    const response = await fetch("/api/audio", { cache: "no-store" });
    const data = await response.json();
    const files = (data.files && data.files[AI_ROLE()]) || [];
    if (!files.length) {
      els.voiceNote.textContent =
        "还没有本地语音片段。请把授权音频放到 audio/，文件名见 audio/README.md。";
      return;
    }
    const file = files[Math.floor(Math.random() * files.length)];
    playEasterEgg(`/audio/${file}`);
    els.voiceNote.textContent = `正在播放：${file}`;
  } catch (error) {
    els.voiceNote.textContent = "读取本地语音列表失败。";
  }
}

if ("speechSynthesis" in window) {
  refreshVoices();
  window.speechSynthesis.onvoiceschanged = refreshVoices;
}

/* ---------- 工具 ---------- */

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return map[char];
  });
}

function formatText(text) {
  return escapeHtml(text)
    .replace(/（[^）]*）/g, (match) => `<span class="action">${match}</span>`)
    .replace(/\n/g, "<br>");
}

function scrollToBottom() {
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
}

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function toneText(value) {
  if (value <= 25) return "火药味十足";
  if (value <= 50) return "嘴上不饶人";
  if (value <= 70) return "半推半就";
  return "难得的坦白";
}

function syncHint(rapport, awkward) {
  if (rapport >= 75 && awkward <= 35) return "很多话不用说完，对方就已经懂了。";
  if (rapport >= 60) return "嘴上互相拆台，眼神却早就对上了。";
  if (awkward >= 70) return "关心总是绕一圈才说出口。";
  if (awkward >= 45) return "熟悉，但偶尔还是会别扭。";
  return "气氛难得地平和，连沉默都不尴尬。";
}

function currentScene() {
  if (state.customScene && state.customScene.id === state.scene) {
    return state.customScene;
  }
  const set = SCENES_BY_ERA[state.era] || SCENES_BY_ERA.high_school;
  const scene = set[state.scene] || set[ERAS[state.era].defaultScene];
  return { ...scene, id: state.scene, custom: false };
}

function sceneById(id) {
  const builtIn = (SCENES_BY_ERA[state.era] || {})[id];
  if (builtIn) return { ...builtIn, id, custom: false };
  return state.customScenes.find((scene) => scene.id === id) || null;
}

function openerFor(aiRole, scene) {
  if (scene.custom) return CUSTOM_OPENERS[state.era][aiRole];
  return (
    (OPENERS[state.era] && OPENERS[state.era][aiRole][scene.id]) ||
    CUSTOM_OPENERS[state.era][aiRole]
  );
}

/* ---------- 渲染 ---------- */

function renderCast() {
  els.castList.querySelectorAll(".cast-card").forEach((card) => {
    const isUser = card.dataset.role === state.userRole;
    card.classList.toggle("active", isUser);
    const tag = card.querySelector(".cast-tag");
    tag.textContent = isUser ? "你扮演" : "AI 扮演";
  });
  els.input.placeholder = `以${CHARACTERS[state.userRole].short}的身份说点什么……`;
}

function renderEras() {
  els.eraGrid.querySelectorAll(".era-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.era === state.era);
  });
}

function renderScenes() {
  els.sceneGrid.innerHTML = "";

  const builtIn = SCENES_BY_ERA[state.era] || SCENES_BY_ERA.high_school;
  Object.entries(builtIn).forEach(([id, scene]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `scene-card${state.scene === id ? " active" : ""}`;
    button.dataset.scene = id;
    button.innerHTML = `<span class="scene-icon">${scene.icon}</span><strong>${escapeHtml(
      scene.name
    )}</strong><small>${escapeHtml(scene.kana)}</small>`;
    els.sceneGrid.appendChild(button);
  });

  state.customScenes.forEach((scene) => {
    const card = document.createElement("div");
    card.className = `scene-card custom${state.scene === scene.id ? " active" : ""}`;
    card.dataset.scene = scene.id;
    card.innerHTML = `<span class="scene-icon">✎</span><strong>${escapeHtml(
      scene.name
    )}</strong><small>CUSTOM</small><button class="scene-delete" type="button" data-delete="${
      scene.id
    }" aria-label="删除场景">×</button>`;
    els.sceneGrid.appendChild(card);
  });

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "scene-add";
  addButton.id = "sceneAddBtn";
  addButton.textContent = "＋ 自定义场景";
  els.sceneGrid.appendChild(addButton);
}

function renderScene() {
  const scene = currentScene();
  els.sceneName.textContent = scene.name;
  els.sceneKana.textContent = scene.kana;
  els.sceneDesc.textContent = scene.desc;
}

function renderStats() {
  els.rapportBar.style.width = `${state.rapport}%`;
  els.awkwardBar.style.width = `${state.awkward}%`;
  els.rapportValue.textContent = String(state.rapport);
  els.awkwardValue.textContent = String(state.awkward);
  els.syncHint.textContent = syncHint(state.rapport, state.awkward);
}

function renderTone() {
  els.intensity.value = String(state.intensity);
  els.toneLabel.textContent = toneText(state.intensity);
}

function addMessage(kind, text, options = {}) {
  const wrapper = document.createElement("div");
  const isUser = kind === "user";
  const isError = kind === "error";
  wrapper.className = `msg ${isUser ? "user" : isError ? "system" : "ai"}`;

  if (kind === "ai") {
    const aiRole = options.aiRole || AI_ROLE();
    wrapper.classList.add(CHARACTERS[aiRole].className);

    const meta = document.createElement("div");
    meta.className = "msg-meta";
    meta.innerHTML = `<span class="mini-avatar">${CHARACTERS[aiRole].mark}</span><span>${CHARACTERS[aiRole].name}</span>`;
    wrapper.appendChild(meta);
  }

  if (isUser) {
    const meta = document.createElement("div");
    meta.className = "msg-meta";
    meta.textContent = `你 · ${CHARACTERS[state.userRole].short}`;
    wrapper.appendChild(meta);
  }

  if (isError) {
    wrapper.classList.add("error");
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (options.typing) {
    bubble.innerHTML =
      '<span class="typing-dots"><i></i><i></i><i></i></span>';
  } else if (isError) {
    bubble.textContent = text;
  } else {
    bubble.innerHTML = formatText(text);
  }

  wrapper.appendChild(bubble);
  els.chatLog.appendChild(wrapper);
  scrollToBottom();
  return bubble;
}

function addSceneDivider(scene) {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = `<strong>SCENE · ${escapeHtml(
    ERAS[state.era].name
  )}</strong><p>${escapeHtml(scene.desc)}</p>`;
  els.chatLog.appendChild(card);
  scrollToBottom();
}

function addMemoryCard(text) {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = `<strong>MEMORY · 同人回忆片段</strong><p>${escapeHtml(
    text
  )}</p>`;
  els.chatLog.appendChild(card);
  scrollToBottom();
}

function addSystemNote(text) {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = `<strong>NOW · 回到现在</strong><p>${escapeHtml(text)}</p>`;
  els.chatLog.appendChild(card);
  scrollToBottom();
}

function resetMemoryUI() {
  state.memoryMode = false;
  els.memoryBtn.classList.remove("active");
  els.memoryBtn.innerHTML = "<span>✦</span> 回忆触发";
  els.memoryEndBtn.hidden = true;
}

function resetChat() {
  els.chatLog.innerHTML = "";
  state.history = [];
  resetMemoryUI();
  const scene = currentScene();
  addSceneDivider(scene);
  const opener = openerFor(AI_ROLE(), scene);
  addMessage("ai", opener, { aiRole: AI_ROLE() });
  state.history.push({ role: "assistant", content: opener });
}

/* ---------- 状态 ---------- */

function setBusy(busy) {
  state.busy = busy;
  els.sendBtn.disabled = busy;
  els.memoryBtn.disabled = busy;
  els.memoryEndBtn.disabled = busy;
  els.input.disabled = busy;
  if (!busy) els.input.focus();
}

function updateStats(next) {
  if (!next) return;
  state.rapport = clamp(Number(next.rapport ?? state.rapport));
  state.awkward = clamp(Number(next.awkward ?? state.awkward));
  renderStats();
}

let healthTimer = null;
let healthChecking = false;

async function checkHealth() {
  if (healthChecking) return;
  healthChecking = true;
  clearTimeout(healthTimer);

  try {
    const response = await fetch("/api/health", { cache: "no-store" });
    if (!response.ok) throw new Error(String(response.status));
    const data = await response.json();
    state.trackingRequired = Boolean(data.requires_tracking);
    const needTracking = state.trackingRequired && !state.trackingId;

    els.status.classList.remove("offline");
    els.status.classList.toggle("demo", Boolean(data.demo) || needTracking);
    els.status.classList.toggle("online", !data.demo && !needTracking);

    if (needTracking) {
      els.statusText.textContent = "需要 Tracking ID";
      els.status.title = "请输入管理员分配的 Tracking ID";
      els.trackingBanner.hidden = false;
      openTrackingModal(true);
    } else if (data.demo) {
      els.statusText.textContent = state.trackingRequired
        ? "服务器未配置 Key"
        : "演示模式";
      els.status.title = "点击重新检测连接";
      els.trackingBanner.hidden = true;
    } else {
      els.statusText.textContent = "DeepSeek 在线";
      els.status.title = state.trackingId
        ? `Tracking ID：${state.trackingId} · 点击重新检测`
        : "点击重新检测连接";
      els.trackingBanner.hidden = true;
    }
  } catch (error) {
    els.status.classList.remove("demo", "online");
    els.status.classList.add("offline");
    els.statusText.textContent = "未连接 · 点此重试";
    els.status.title = "请先在 PyCharm 中运行 app.py";
    els.trackingBanner.hidden = true;
  } finally {
    healthChecking = false;
    const nextDelay = els.status.classList.contains("offline") ? 3000 : 15000;
    healthTimer = setTimeout(checkHealth, nextDelay);
  }
}

async function validateStoredTracking() {
  if (!state.trackingRequired || !state.trackingId) return;
  try {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_id: state.trackingId }),
    });
    if (response.ok) return;
    clearTracking();
    openTrackingModal(true);
  } catch (error) {
    /* 网络暂时不可用时保留本地 ID */
  }
}

/* ---------- 发送与流式渲染 ---------- */

async function sendMessage(text, options = {}) {
  const message = String(text || "").trim();
  if (!message || state.busy) return;

  if (state.trackingRequired && !state.trackingId) {
    openTrackingModal(true);
    return;
  }

  const scene = currentScene();
  const aiRole = AI_ROLE();
  if (!options.silent) {
    addMessage("user", message);
  }

  state.history.push({ role: "user", content: message });
  state.history = state.history.slice(-20);
  setBusy(true);

  const bubble = addMessage("ai", "", { aiRole, typing: true });
  bubble.classList.add("streaming");
  let fullText = "";
  let failed = false;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_role: state.userRole,
        era: state.era,
        language: state.replyLanguage,
        scene: scene.custom ? "custom" : scene.id,
        scene_name: scene.name,
        scene_description: scene.desc,
        intensity: state.intensity,
        stats: { rapport: state.rapport, awkward: state.awkward },
        history: state.history.slice(0, -1),
        message,
        tracking_id: state.trackingId,
      }),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const data = await response.json();
        detail = data.error || "";
      } catch (error) {
        /* 非 JSON 响应 */
      }
      if (response.status === 401 || response.status === 403) {
        clearTracking();
        openTrackingModal(true);
      }
      throw new Error(detail || `服务器返回 ${response.status}`);
    }

    if (!response.body) {
      throw new Error("当前浏览器不支持流式响应");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const frames = buffer.split("\n\n");
      buffer = frames.pop() || "";

      for (const frame of frames) {
        // SSE 规范允许多条 data: 行，join 起来再解析
        const dataLines = frame
          .split("\n")
          .filter((line) => line.startsWith("data:"));
        if (dataLines.length === 0) continue;
        const payload = dataLines.map((line) => line.slice(5).trim()).join("\n");

        let event;
        try {
          event = JSON.parse(payload);
        } catch (error) {
          continue;
        }

        if (event.demo) {
          els.status.classList.add("demo");
          els.status.classList.remove("online");
          els.statusText.textContent = "演示模式";
        }

        if (event.delta) {
          fullText += event.delta;
          bubble.innerHTML = formatText(fullText);
          scrollToBottom();
        }

        if (event.stats) {
          updateStats(event.stats);
        }

        // 语音彩蛋：后端在 done 之前推 {"audio": "/audio/xxx.mp3"}
        if (event.audio && state.eggEnabled) {
          playEasterEgg(event.audio);
        }

        if (event.error) {
          failed = true;
          throw new Error(event.error);
        }
      }
    }
  } catch (error) {
    failed = true;
    const reason = String(error.message || error);
    const friendly = /Failed to fetch|NetworkError|Load failed/i.test(reason)
      ? "后端未启动或已停止，请检查服务器状态"
      : reason;
    if (!fullText) {
      bubble.parentElement.classList.add("error");
      bubble.textContent = `连接失败：${friendly}`;
      bubble.classList.remove("streaming");
    } else {
      addMessage("error", `回复中断：${friendly}`);
    }
    checkHealth();
  } finally {
    bubble.classList.remove("streaming");
    if (fullText) {
      bubble.innerHTML = formatText(fullText);
      state.history.push({ role: "assistant", content: fullText });
      state.lastAiText = fullText;
      if (state.voiceMode === "tts") {
        speakText(fullText, aiRole);
      }
    } else if (!failed) {
      bubble.textContent = "……";
    }
    setBusy(false);
    scrollToBottom();
  }
}

/* ---------- 回忆 ---------- */

const ERA_LOCKED_MEMORIES = {
  high_school: ["女仆", "执事", "围裙", "猜拳决定谁睡上铺"],
  elementary: ["佐野", "小六", "可乐冰棒", "回家路"],
};

function drawMemory() {
  if (state.memoryBag.length === 0) {
    const pool = ERA_LOCKED_MEMORIES[state.era]
      ? MEMORIES.filter((m) => {
          const belongsToOtherEra = Object.entries(ERA_LOCKED_MEMORIES).some(
            ([era, keys]) => era !== state.era && keys.some((k) => m.includes(k))
          );
          return !belongsToOtherEra || ERA_LOCKED_MEMORIES[state.era].some((k) => m.includes(k));
        })
      : MEMORIES;
    state.memoryBag = [...pool].sort(() => Math.random() - 0.5);
  }
  return state.memoryBag.pop();
}

function triggerMemory() {
  if (state.busy) return;
  if (state.memoryMode) {
    endMemory();
    return;
  }

  state.memoryMode = true;
  els.memoryBtn.classList.add("active");
  els.memoryBtn.innerHTML = "<span>✦</span> 回忆中";
  els.memoryEndBtn.hidden = false;

  const memory = drawMemory();
  addMemoryCard(memory);
  sendMessage(
    `（回忆触发：${memory}）请以${ERAS[state.era].name}的年龄和关系阶段，对这段回忆做出反应。`,
    { silent: true }
  );
}

function endMemory() {
  if (!state.memoryMode) return;
  resetMemoryUI();
  addSystemNote("回到现在。");
  sendMessage(
    "（回忆结束，回到现在的场景。请用一句自然的动作或台词把话题带回当下。）",
    { silent: true }
  );
}

/* ---------- 自定义场景 ---------- */

function persistCustomScenes() {
  try {
    localStorage.setItem(CUSTOM_SCENES_KEY, JSON.stringify(state.customScenes));
  } catch (error) {
    /* 忽略 */
  }
}

function openSceneModal() {
  els.sceneModal.hidden = false;
  els.sceneStatus.textContent = "";
  els.sceneStatus.classList.remove("error");
  els.sceneNameInput.value = "";
  els.sceneDescInput.value = "";
  setTimeout(() => els.sceneNameInput.focus(), 50);
}

function closeSceneModal() {
  els.sceneModal.hidden = true;
  els.sceneStatus.textContent = "";
  els.sceneStatus.classList.remove("error");
}

function saveCustomScene() {
  const name = els.sceneNameInput.value.trim();
  const desc = els.sceneDescInput.value.trim();

  if (!name || !desc) {
    els.sceneStatus.textContent = "场景名称和描述都要填写。";
    els.sceneStatus.classList.add("error");
    return;
  }
  if (state.customScenes.length >= 8) {
    els.sceneStatus.textContent = "最多保存 8 个自定义场景。";
    els.sceneStatus.classList.add("error");
    return;
  }

  const scene = {
    id: `custom-${Date.now()}`,
    name: name.slice(0, 20),
    desc: desc.slice(0, 300),
    kana: "CUSTOM",
    icon: "✎",
    custom: true,
  };

  state.customScenes.push(scene);
  persistCustomScenes();
  state.scene = scene.id;
  state.customScene = scene;
  closeSceneModal();
  renderScenes();
  renderScene();
  resetChat();
}

function deleteCustomScene(id) {
  state.customScenes = state.customScenes.filter((scene) => scene.id !== id);
  persistCustomScenes();
  if (state.scene === id) {
    state.scene = ERAS[state.era].defaultScene;
    state.customScene = null;
  }
  renderScenes();
  renderScene();
  resetChat();
}

/* ---------- Tracking ID ---------- */

function openTrackingModal(gate = false) {
  state.trackingGate = Boolean(gate);
  els.trackingModal.hidden = false;
  els.trackingCancel.hidden = state.trackingGate;
  els.trackingClose.hidden = state.trackingGate;
  els.trackingStatus.textContent = state.trackingGate
    ? "请输入管理员分配的 Tracking ID。"
    : "";
  els.trackingStatus.classList.remove("error");
  els.trackingInput.value = state.trackingId || "";
  setTimeout(() => els.trackingInput.focus(), 50);
}

function closeTrackingModal() {
  if (state.trackingGate) return;
  els.trackingModal.hidden = true;
  els.trackingStatus.textContent = "";
  els.trackingStatus.classList.remove("error");
}

function clearTracking() {
  state.trackingId = "";
  try {
    localStorage.removeItem("free-roleplay-tracking-id");
  } catch (error) {
    /* 忽略 */
  }
}

async function saveTrackingId() {
  const trackingId = els.trackingInput.value.trim();
  if (!trackingId) {
    els.trackingStatus.textContent = "请输入 Tracking ID。";
    els.trackingStatus.classList.add("error");
    return;
  }

  els.trackingSave.disabled = true;
  els.trackingStatus.classList.remove("error");
  els.trackingStatus.textContent = "正在验证……";

  try {
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tracking_id: trackingId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Tracking ID 无效");
    }

    state.trackingId = trackingId;
    try {
      localStorage.setItem("free-roleplay-tracking-id", trackingId);
    } catch (error) {
      /* 忽略 */
    }
    state.trackingGate = false;
    els.trackingBanner.hidden = true;
    els.trackingStatus.textContent = data.name
      ? `验证通过，欢迎 ${data.name}`
      : "验证通过";
    await checkHealth();
    setTimeout(() => {
      els.trackingModal.hidden = true;
      els.trackingStatus.textContent = "";
    }, 700);
  } catch (error) {
    els.trackingStatus.textContent = String(error.message || error);
    els.trackingStatus.classList.add("error");
  } finally {
    els.trackingSave.disabled = false;
  }
}

/* ---------- 事件绑定 ---------- */

els.castList.addEventListener("click", (event) => {
  const card = event.target.closest(".cast-card");
  if (!card || state.busy) return;
  const role = card.dataset.role;
  if (!role || role === state.userRole) return;
  state.userRole = role;
  renderCast();
  resetChat();
});

els.eraGrid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-era]");
  if (!card || state.busy) return;
  const era = card.dataset.era;
  if (!era || era === state.era) return;
  state.era = era;
  state.scene = ERAS[era].defaultScene;
  state.customScene = null;
  renderEras();
  renderScenes();
  renderScene();
  resetChat();
});

els.sceneGrid.addEventListener("click", (event) => {
  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton) {
    deleteCustomScene(deleteButton.dataset.delete);
    return;
  }

  if (event.target.closest("#sceneAddBtn")) {
    openSceneModal();
    return;
  }

  const card = event.target.closest(".scene-card");
  if (!card || state.busy) return;
  const id = card.dataset.scene;
  if (!id || id === state.scene) return;
  const scene = sceneById(id);
  if (!scene) return;
  state.scene = id;
  state.customScene = scene.custom ? scene : null;
  renderScenes();
  renderScene();
  resetChat();
});

els.intensity.addEventListener("input", () => {
  state.intensity = Number(els.intensity.value);
  renderTone();
});

els.memoryBtn.addEventListener("click", triggerMemory);
els.memoryEndBtn.addEventListener("click", endMemory);

els.voiceBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleVoicePanel();
});
els.voicePanel.addEventListener("click", (event) => {
  const langButton = event.target.closest("[data-lang]");
  if (langButton) {
    setReplyLanguage(langButton.dataset.lang);
    return;
  }
  const button = event.target.closest("[data-voice]");
  if (!button) return;
  if (button.dataset.voice === "tts") {
    setVoiceMode(state.voiceMode === "tts" ? "off" : "tts");
  } else if (button.dataset.voice === "speak-last") {
    if (state.lastAiText) speakText(state.lastAiText, AI_ROLE());
  } else if (button.dataset.voice === "stop") {
    stopSpeaking();
  } else if (button.dataset.voice === "play-local") {
    playLocalVoice();
  }
});
els.eggToggle.addEventListener("change", () => {
  state.eggEnabled = els.eggToggle.checked;
});
document.addEventListener("click", (event) => {
  if (els.voicePanel.hidden) return;
  if (
    els.voicePanel.contains(event.target) ||
    els.voiceBtn.contains(event.target)
  ) {
    return;
  }
  toggleVoicePanel(false);
});

els.sceneClose.addEventListener("click", closeSceneModal);
els.sceneCancel.addEventListener("click", closeSceneModal);
els.sceneSave.addEventListener("click", saveCustomScene);
els.sceneModal.addEventListener("click", (event) => {
  if (event.target === els.sceneModal) closeSceneModal();
});

els.trackingBtn.addEventListener("click", () => openTrackingModal(false));
els.trackingSetup.addEventListener("click", () => openTrackingModal(true));
els.trackingClose.addEventListener("click", closeTrackingModal);
els.trackingCancel.addEventListener("click", closeTrackingModal);
els.trackingSave.addEventListener("click", saveTrackingId);
els.trackingInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    saveTrackingId();
  }
});
els.trackingModal.addEventListener("click", (event) => {
  if (event.target === els.trackingModal) closeTrackingModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!els.trackingModal.hidden) closeTrackingModal();
  if (!els.sceneModal.hidden) closeSceneModal();
  if (!els.voicePanel.hidden) toggleVoicePanel(false);
});

els.status.addEventListener("click", checkHealth);
els.status.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    checkHealth();
  }
});

els.clearBtn.addEventListener("click", () => {
  if (state.busy) return;
  resetChat();
});

els.composer.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = els.input.value;
  els.input.value = "";
  els.input.style.height = "auto";
  sendMessage(text);
});

els.input.addEventListener("input", () => {
  els.input.style.height = "auto";
  els.input.style.height = `${Math.min(els.input.scrollHeight, 140)}px`;
});

els.input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    els.composer.requestSubmit();
  }
});

/* ---------- 初始化 ---------- */

renderCast();
renderEras();
renderScenes();
renderScene();
renderTone();
renderStats();
updateVoiceUI();
resetChat();
checkHealth().then(validateStoredTracking);
els.input.focus();
