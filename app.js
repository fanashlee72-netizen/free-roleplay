/* =========================================================
   FREE! 同人剧场 · 前端逻辑
   ========================================================= */

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

const SCENES = {
  dorm: {
    name: "宿舍夜谈",
    kana: "MIDNIGHT DORM",
    desc: "熄灯后的鲛柄学园 302 宿舍，窗外有虫鸣，桌上还摊着训练计划。",
  },
  pool: {
    name: "泳池边",
    kana: "POOL SIDE",
    desc: "夜晚的鲛柄学园室内泳池，水面映着灯光，池边只剩你们两个人。",
  },
  morning: {
    name: "早晨赖床",
    kana: "LAZY MORNING",
    desc: "早晨的宿舍，闹钟已经响过三遍，阳光从窗帘缝里钻进来。",
  },
  after_race: {
    name: "比赛后",
    kana: "AFTER THE RACE",
    desc: "比赛结束后的看台通道，人群还没散尽，空气里有消毒水和汗水的气味。",
  },
};

const OPENERS = {
  sousuke: {
    dorm: "（熄灯后的宿舍，宗介把训练计划合上，抬眼看你）……明天还要早起。你确定要聊到这么晚？",
    pool: "（水面晃了一下，宗介扶着池边）再来一组？这次我不会让你。",
    morning: "（闹钟响到第三遍，宗介伸手把它按掉）……起床。再赖下去，早餐就没了。",
    after_race: "（看台通道还没散场，宗介把一瓶水递过来）刚才那场，游得不错。",
  },
  rin: {
    dorm: "（熄灯后的宿舍，凛翻了个身，把枕头拍松）喂，你还没睡吧？别装。",
    pool: "（凛把泳镜往额头上一推，水珠顺着下巴滴下来）再来一组。刚才那个不算。",
    morning: "（闹钟响到第三遍，凛把被子往上拉了拉）……五分钟。就五分钟。",
    after_race: "（凛把毛巾搭在脖子上，回头看你）哼，别以为赢了我一次就了不起。",
  },
};

const MEMORIES = [
  "（回忆）小时候，两个人并肩站在泳池边，谁都不肯先下水。",
  "（回忆）宗介把护肩往上拉了一下，装作什么都没发生。",
  "（回忆）凛在更衣室里反复系着泳镜带，嘴上说着无所谓。",
  "（回忆）下雨天，两个人挤在同一把伞下，谁也没说话。",
  "（回忆）比赛前夜，走廊尽头的自动贩卖机亮着，两罐饮料碰在一起。",
  "（回忆）凛先游到终点，回头却看见宗介还站在池边，捂着肩膀。",
  "（回忆）训练结束后，两个人在空荡荡的看台上坐了很久。",
];

const state = {
  userRole: "rin",
  scene: "dorm",
  intensity: 32,
  rapport: 42,
  awkward: 58,
  history: [],
  busy: false,
  memoryBag: [],
  trackingId: "",
  trackingRequired: false,
  trackingGate: false,
};

try {
  state.trackingId = localStorage.getItem("free-roleplay-tracking-id") || "";
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
  chatLog: document.getElementById("chatLog"),
  composer: document.getElementById("composer"),
  input: document.getElementById("messageInput"),
  sendBtn: document.getElementById("sendBtn"),
};

const AI_ROLE = () => (state.userRole === "rin" ? "sousuke" : "rin");

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
  return escapeHtml(text).replace(
    /（[^）]*）/g,
    (match) => `<span class="action">${match}</span>`
  );
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

function renderScene() {
  const scene = SCENES[state.scene];
  els.sceneName.textContent = scene.name;
  els.sceneKana.textContent = scene.kana;
  els.sceneDesc.textContent = scene.desc;
  els.sceneGrid.querySelectorAll(".scene-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.scene === state.scene);
  });
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
  wrapper.className = `msg ${isUser ? "user" : "ai"}`;

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

  if (kind === "error") {
    wrapper.classList.add("error");
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (options.typing) {
    bubble.innerHTML =
      '<span class="typing-dots"><i></i><i></i><i></i></span>';
  } else {
    bubble.innerHTML = formatText(text);
  }

  wrapper.appendChild(bubble);
  els.chatLog.appendChild(wrapper);
  scrollToBottom();
  return bubble;
}

function addSceneDivider() {
  const card = document.createElement("div");
  card.className = "memory-card";
  card.innerHTML = `<strong>SCENE · 场景</strong><p>${escapeHtml(
    SCENES[state.scene].desc
  )}</p>`;
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

function resetChat() {
  els.chatLog.innerHTML = "";
  state.history = [];
  addSceneDivider();
  addMessage("ai", OPENERS[AI_ROLE()][state.scene], { aiRole: AI_ROLE() });
  state.history.push({
    role: "assistant",
    content: OPENERS[AI_ROLE()][state.scene],
  });
}

/* ---------- 状态 ---------- */

function setBusy(busy) {
  state.busy = busy;
  els.sendBtn.disabled = busy;
  els.memoryBtn.disabled = busy;
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
    /* 网络暂时不可用时保留本地 ID，下次再验证 */
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
        scene: state.scene,
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
        const line = frame
          .split("\n")
          .find((item) => item.startsWith("data:"));
        if (!line) continue;

        let event;
        try {
          event = JSON.parse(line.slice(5).trim());
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
      ? "后端未启动或已停止，请在 PyCharm 中运行 app.py 后重试"
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
    } else if (!failed) {
      bubble.textContent = "……";
    }
    setBusy(false);
    scrollToBottom();
  }
}

/* ---------- 回忆 ---------- */

function drawMemory() {
  if (state.memoryBag.length === 0) {
    state.memoryBag = [...MEMORIES].sort(() => Math.random() - 0.5);
  }
  return state.memoryBag.pop();
}

function triggerMemory() {
  if (state.busy) return;
  const memory = drawMemory();
  addMemoryCard(memory);
  sendMessage(`（回忆触发：${memory}）请以角色身份对这段回忆做出反应。`, {
    silent: true,
  });
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

els.sceneGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".scene-card");
  if (!card || state.busy) return;
  const scene = card.dataset.scene;
  if (!scene || scene === state.scene) return;
  state.scene = scene;
  renderScene();
  resetChat();
});

els.intensity.addEventListener("input", () => {
  state.intensity = Number(els.intensity.value);
  renderTone();
});

els.memoryBtn.addEventListener("click", triggerMemory);

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
  if (event.key === "Escape" && !els.trackingModal.hidden) closeTrackingModal();
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
renderScene();
renderTone();
renderStats();
resetChat();
checkHealth().then(validateStoredTracking);
els.input.focus();
