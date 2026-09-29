# 《霓虹心事·林夏的手机》剧情梳理与 GLM 开发建议

> 文档版本：v1.0 · 编写日期：2026-08-10
> 对应游戏版本：v0.1.4
> 数据源：[story.js](file:///Users/x/code/game1/story.js)（2384 行）、[docs/玩法.md](file:///Users/x/code/game1/docs/玩法.md)、[代码审查m3.md](file:///Users/x/code/game1/代码审查m3.md)
> 适用对象：后续接入 GLM 系列模型进行剧情扩写、节点补全、对话生成的开发参考

---

## 一、整体剧情梳理

### 1.1 故事基调与定位

- **类型**：手机模拟器 + 文字剧情冒险（都市情感悬疑）
- **主角**：林夏，刚到霓城工作的策展新人
- **舞台**：霓城，起始日 7 月 15 日（周三）
- **核心叙事**：通过手机 30+ 个 App 推进剧情，三位男主并发消息，玩家自主决定回复时机与对象
- **结局规模**：4 条路线 × 4 种结局 + 真结局 = 共 17 个结局

### 1.2 主线时间线（按"第 N 天"）

| 阶段 | 天数 | 关键事件 | 涉及角色 | 行号 |
|------|------|---------|---------|------|
| **序章·抵达** | 第 1 天 | 苏苏问候 → 第一夜梦境（高三教室） | 苏苏、narrator | [story.js#L17-L43](file:///Users/x/code/game1/story.js#L17-L43) |
| **报到·三人登场** | 第 2 天 | 沈砚之登场 → 陆辞重逢 → 雾港邀约 → 江屿登场 → 江屿深夜电话 → 第二夜梦境（空画廊） | 沈砚之、陆辞、江屿 | [story.js#L46-L198](file:///Users/x/code/game1/story.js#L46-L198) |
| **考验·警告** | 第 3 天 | 沈砚之考验（盯开幕式）→ 陆辞警告"离他远点" → 第三夜梦境（空舞台） | 沈砚之、陆辞 | [story.js#L201-L282](file:///Users/x/code/game1/story.js#L201-L282) |
| **开幕式·路线选择** | 第 4 天 | 开幕式修罗场 → 天台江屿剧情 → 23:00 路线选择（4 选 1） | 全员 | [story.js#L285-L387](file:///Users/x/code/game1/story.js#L285-L387) |
| **路线分支** | 第 5 天起 | 各线 7-10 个事件到结局，含"半个月后/一个月后"时间跳跃 | 单线男主 | [story.js#L389-L725](file:///Users/x/code/game1/story.js#L389-L725) |

### 1.3 五位角色档案速查

| 角色 | 身份 | 性格关键词 | 关键前史 | 主线登场节点 |
|------|------|----------|---------|------------|
| **林夏** | 策展新人（主角） | 由玩家选项塑造（6 维性格）| 与陆辞是高中青梅；与江屿妹妹同名"林夏" | 全程第一视角 |
| **沈砚之** | 砚美术馆主理人 | 温柔腹黑、控制欲 | 五年前在美术馆见过林夏（跟陆辞一起来），画了五年未完成的画 | 第 2 天报到 |
| **陆辞** | 自由摄影师 | 青梅竹马、暗恋十年 | 高一军训递水夹纸条"明天就告白"，练了九年；写了一百多封信每年一封 | 第 2 天重逢 |
| **江屿** | 雾港酒吧调酒师 | 前渡鸦乐队主唱、孤僻 | 妹妹林夏十四年前因白血病去世；鼓手阿哲三年前车祸去世 | 第 2 天雾港 |
| **苏苏** | 大学闺蜜 | 八卦王、情报网 | **无任何前史铺垫** | 序章 |

### 1.4 四条路线分支结构

#### 沈砚之线（[story.js#L389-L478](file:///Users/x/code/game1/story.js#L389-L478)）
- 南方出差晚宴 → 雨夜道歉 → 半个月后控制 → 咖啡馆破局 → 最终抉择
- 关键选择 3 个：`shenyan_obey/resist`、`shenyan_awaken/deny`、`shenyan_choice: confront/endure`
- HIDDEN 信物：`memento_pen`（解谜 [puzzle_shenyan_office](file:///Users/x/code/game1/story.js#L1597) 奖励，密码 1402）

#### 陆辞线（[story.js#L480-L577](file:///Users/x/code/game1/story.js#L480-L577)）
- 旧学校天台告白 → 九年相册 → 米兰告别 → 雨夜机票 → 最终抉择
- 关键选择 4 个：`luci_confess/avoid`、`luci_stop/letgo`、`luci_chase/giveup`、`luci_choice: accept/miss`
- HIDDEN 信物：`evidence_letter`（解谜 [puzzle_luci_locker](file:///Users/x/code/game1/story.js#L1613) 奖励）

#### 江屿线（[story.js#L579-L669](file:///Users/x/code/game1/story.js#L579-L669)）
- 妹妹墓园 → 鼓手忌日 → 崩溃边缘 → 三天后遗物 → 一个月后首唱 → 最终抉择
- 关键选择 3 个：`jiangyu_hold/leave`、`jiangyu_stand/silent`、`jiangyu_choice: stay/leave`
- HIDDEN 信物：`evidence_lyrics`（解谜 [puzzle_jiangyu_song](file:///Users/x/code/game1/story.js#L1629) 奖励）

#### 独行线（[story.js#L671-L725](file:///Users/x/code/game1/story.js#L671-L725)）
- 第二天 → 一个月后 → 开幕前一周 → 三人帮助 → 最终抉择 → `ending_true`（调用 `computeEnding(s,'solo')`）
- 关键选择 2 个：`solo_independent` / `solo_accept`

### 1.5 结局判定算法（[story.js#L2131-L2153](file:///Users/x/code/game1/story.js#L2131-L2153)）

```
solo 路线优先级：
  1. trueEndingUnlockCondition(state)  → 'true_ending'   （成就数 ≥ 60% 即 9/14）
  2. flags._solo_hidden || collected.length >= 10  → 'solo_hidden'
  3. flags.solo_independent  → 'solo_good'
  4. flags.solo_accept  → 'solo_normal'
  5. 否则  → 'solo_bad'

男主路线优先级（route ∈ shenyan/luci/jiangyu）：
  1. flags['_'+route+'_hidden'] || (choiceKey===goodChoice && collected.includes(hiddenRequired))  → route+'_hidden'
  2. choiceKey===goodChoice && goodCount > badCount  → route+'_good'
  3. choiceKey===badChoice && badCount >= goodCount  → route+'_bad'
  4. 否则  → route+'_normal'
```

**重要澄清**：[ending_true 事件](file:///Users/x/code/game1/story.js#L725) 通过 `_compute: s => STORY.computeEnding(s, 'solo')` 调用判定函数，因此 solo 5 个结局（true_ending/solo_hidden/solo_good/solo_normal/solo_bad）**都可触达**，仅事件命名有误导性（名为 ending_true 但实际可能返回 solo_bad）。

---

## 二、剧情断裂与薄弱处清单

### 2.1 节点串联断裂（高优先级）

| 编号 | 位置 | 问题 | 影响 |
|------|------|------|------|
| D1 | [fb_highschool_luci](file:///Users/x/code/game1/story.js#L1364) `then:null` | 闪回完成后无后续触发，孤立片段 | 闪回剧情与主线割裂 |
| D2 | [fb_highschool_jiangyu](file:///Users/x/code/game1/story.js#L1383) `then:null` | 同上 | 同上 |
| D3 | [group_neon_react1/2/3](file:///Users/x/code/game1/story.js#L1299) | 三个群聊回复事件均无 then | 群聊剧情烂尾 |
| D4 | [opening_choice_shenyan/luci/neutral](file:///Users/x/code/game1/story.js#L310) | 三分支全部 `then:'rooftop_jiangyu'` | 修罗场选择无实质差异 |
| D5 | [shenyan_test_reply_2](file:///Users/x/code/game1/story.js#L241) | 拒绝盯开幕式仍进 luci_care_msg | 选择无后果 |
| D6 | [luci_reunion_msg_4](file:///Users/x/code/game1/story.js#L97) | 两选项都进 bar_invitation，差异仅 affection +2/+1 | 选择感弱 |
| D7 | [jiangyu_first_msg_4](file:///Users/x/code/game1/story.js#L154) | 两选项都进 jiangyu_call_night | 同上 |
| D8 | [shenyan_critical_3_reply / luci_critical_3_reply / jiangyu_critical_3_reply](file:///Users/x/code/game1/story.js#L1947) | 临界事件各仅一条消息无 then | 临界系统未发挥作用 |

### 2.2 角色弧光断层

| 编号 | 角色 | 问题 |
|------|------|------|
| C1 | **沈砚之** | 弧光断层：温柔腹黑→控制欲→结局，缺少"觉醒"中间过程。唯一破局点 [route_shenyan_cafe](file:///Users/x/code/game1/story.js#L456) 仅一条消息就到结局判定 |
| C2 | **沈砚之** | "前女友"在 [玩法.md](file:///Users/x/code/game1/docs/玩法.md) 提及但 story.js 中无任何前女友剧情节点，仅 [intel_shenyan_ex](file:///Users/x/code/game1/story.js#L1072) 提到"北方女人" |
| C3 | **江屿** | 弧光混乱：妹妹忌日（十四年前）与鼓手阿哲忌日（三年前）交错，阿哲[行600](file:///Users/x/code/game1/story.js#L600) 突然引入无铺垫，与妹妹故事线焦点混乱 |
| C4 | **江屿** | 妹妹与主角同名"林夏"的宿命感未深挖，仅作为揭示存在 |
| C5 | **苏苏** | 无独立剧情线，始终是情报/群聊工具人，无前史无弧光 |
| C6 | **narrator** | 仅作系统提示，未承担"主角内心"叙事功能，与林夏无主观视角关联 |
| C7 | **林夏（主角）** | 结局时缺乏"她改变了什么"的对比展示，玩家塑造的性格无收束 |

### 2.3 伏笔未回收

| 编号 | 伏笔 | 位置 | 现状 |
|------|------|------|------|
| F1 | 沈砚之"北方女人"身份 | [intel_shenyan_ex](file:///Users/x/code/game1/story.js#L1072)、[street_susu_intel](file:///Users/x/code/game1/story.js#L1019) | 真相是五年前的林夏（[malePerspectives.shenyan.truthEnding](file:///Users/x/code/game1/story.js#L1721)），但沈砚之线结局未揭示 |
| F2 | 沈砚之与江屿的关系 | [profile 关系描述](file:///Users/x/code/game1/story.js#L1331) "江屿唱《夏》那晚他离场了" | 主线无相关剧情 |
| F3 | 沈砚之与陆辞的关系 | [profile](file:///Users/x/code/game1/story.js#L1330) "拍过封面后没合作" | 主线无展开 |
| F4 | 江屿"那首歌不唱了" | [jiangyu_bad 图鉴 desc](file:///Users/x/code/game1/story.js#L2121) | 与阿哲忌日无关联 |
| F5 | memento_pen 密码 1402 | [puzzle_shenyan_office](file:///Users/x/code/game1/story.js#L1595) 注释"林夏的生日" | 林夏生日在剧情中未给出 |
| F6 | 独行线 solo_hidden | [solo_hidden desc](file:///Users/x/code/game1/story.js#L2127) "你发现自己也是某个故事的主角" | 暗示未具体回收 |
| F7 | egg_ghost_msg 五年前的消息 | [egg_ghost_msg](file:///Users/x/code/game1/story.js#L1571) | story.js 中无任何事件设置 `ghost_msg_triggered` flag |
| F8 | dream_day2 "烫手的画框" | [dream_day2](file:///Users/x/code/game1/story.js#L816) | 隐喻未明确回收 |

### 2.4 缺失的关键剧情节点

| 编号 | 缺失内容 | 必要性 |
|------|---------|--------|
| M1 | **沈砚之闪回节点** | 真相结局揭示五年前画，但 [STORY.flashbacks](file:///Users/x/code/game1/story.js#L1363) 只有 luci 和 jiangyu 两个，缺 shenyan 闪回 |
| M2 | **沈砚之觉醒中间段** | 从控制欲直接跳到结局，需补 1-2 个觉醒铺垫事件 |
| M3 | **江屿妹妹前史铺垫** | 阿哲忌日引入突兀，需在前期（第 2-3 天）补妹妹/阿哲的暗示 |
| M4 | **苏苏独立剧情线** | 至少 1-2 个苏苏个人故事节点（如苏苏自己的感情、苏苏与林夏的过往） |
| M5 | **林夏主角视角收束** | 结局时需有"她改变了什么"的对比场景 |

---

## 三、剧情代码层面问题

### 3.1 Flag 设置缺失（高优先级，影响结局触发）

| 编号 | Flag | 检查位置 | 设置入口 | 问题 |
|------|------|---------|---------|------|
| B1 | `flags['_'+route+'_hidden']` | [computeEnding L2145](file:///Users/x/code/game1/story.js#L2145) | **无** | HIDDEN 结局只能靠"goodChoice + 关键信物"触发，此 flag 形同虚设 |
| B2 | `flags._solo_hidden` | [computeEnding L2135](file:///Users/x/code/game1/story.js#L2135) | **无** | 同上 |
| B3 | `flags.group_created_group_neon` | [group_neon.trigger L1275](file:///Users/x/code/game1/story.js#L1275) | **susu_create_group 未设置** | 群聊可能重复触发 |
| B4 | `flags.shenyan_south` | [themes.sea L2092](file:///Users/x/code/game1/story.js#L2092) | **route_shenyan_south 未设置** | 海雾主题无法解锁 |
| B5 | `flags.midnight_call` | [egg_midnight L1569](file:///Users/x/code/game1/story.js#L1569) | **无** | 深夜来电彩蛋无法触发 |
| B6 | `flags.ghost_msg_triggered` | [egg_ghost_msg L1571](file:///Users/x/code/game1/story.js#L1571) | **无** | 幽灵消息彩蛋无法触发 |

### 3.2 收集品获取问题

| 编号 | 收集品 | 现状 | 问题 |
|------|--------|------|------|
| G1 | `stamp_route` | [玩法.md](file:///Users/x/code/game1/docs/玩法.md) 说"路线选择后获取" | **story.js 中无任何事件设置此收集品** |
| G2 | `recording_msg` | [玩法.md](file:///Users/x/code/game1/docs/玩法.md) 说"语音信箱回放后获取" | **story.js 中无任何事件设置此收集品** |
| G3 | `postcard_neon` | [intro_susu L18](file:///Users/x/code/game1/story.js#L18) + 7 天连胜 [L2013](file:///Users/x/code/game1/story.js#L2013) | 重复获取 |
| G4 | `stamp_first` | 节日 7-15 [L1654](file:///Users/x/code/game1/story.js#L1654) + 3 天连胜 [L2012](file:///Users/x/code/game1/story.js#L2012) | 重复获取 |
| G5 | `ticket_bar` | [bar_invitation L106](file:///Users/x/code/game1/story.js#L106) + 节日 8-25 [L1656](file:///Users/x/code/game1/story.js#L1656) | 重复获取 |
| G6 | `evidence_lyrics` | [puzzle_jiangyu_song L1629](file:///Users/x/code/game1/story.js#L1629) | 玩法.md 说"江屿线·通话后获取"，实际只能解谜 |
| G7 | `memento_pen` | [puzzle_shenyan_office L1597](file:///Users/x/code/game1/story.js#L1597) | 玩法.md 说"私人画室邀约"，但 [inv_shenyan_studio_after L1181](file:///Users/x/code/game1/story.js#L1181) 仅 photo_unlock 未给 memento_pen |
| G8 | `photo luci_album` | [route_luci_album L518](file:///Users/x/code/game1/story.js#L518) + [fb_highschool_luci.reward L1380](file:///Users/x/code/game1/story.js#L1380) | 重复获取 |
| G9 | `photo rooftop_night` | [photo_rooftop L366](file:///Users/x/code/game1/story.js#L366) + [fb_highschool_jiangyu.reward L1398](file:///Users/x/code/game1/story.js#L1398) | 重复获取 |
| G10 | `music xia` | [music_xia_unlock L189](file:///Users/x/code/game1/story.js#L189) + [inv_jiangyu_bar_after L1246](file:///Users/x/code/game1/story.js#L1246) | 重复解锁 |

### 3.3 命名一致性问题

| 编号 | 问题 | 位置 |
|------|------|------|
| N1 | ending 事件 ID（`ending_shenyan_good`）与 endingId（`shenyan_good`）不一致 | [L477](file:///Users/x/code/game1/story.js#L477) vs [endings L872](file:///Users/x/code/game1/story.js#L872) |
| N2 | event id 与 flag key 同名 `intel_shenyan_ex` | [L1070-L1071](file:///Users/x/code/game1/story.js#L1070) |
| N3 | reactions key 字符串混合 `'1.5b'` vs 数字 `1.5` | [L1452](file:///Users/x/code/game1/story.js#L1452) |
| N4 | 下划线前缀混乱 `__shenyan_end_judge`（双）vs `_solo_hidden`（单） | [L473](file:///Users/x/code/game1/story.js#L473) vs [L2135](file:///Users/x/code/game1/story.js#L2135) |
| N5 | "第 N 天"命名混乱：`day2_morning` 是第 2 天、`day3_shenyan_test` 是第 3 天，但序章 `intro_susu` 是第 1 天无 day1 前缀 | [L17](file:///Users/x/code/game1/story.js#L17) |

### 3.4 成就与节日系统问题

| 编号 | 问题 | 详情 |
|------|------|------|
| A1 | 成就数量不一致 | 实际 15 个（[L1510-L1539](file:///Users/x/code/game1/story.js#L1510)），玩法.md 说 14 个 |
| A2 | `perfect_listen` 缺 call 事件支撑 | story.js 仅 1 个 call 事件 [jiangyu_call_night L162](file:///Users/x/code/game1/story.js#L162)，需 3 次通话 |
| A3 | `three_routes` 难度极高 | 三男主好感都 ≥5，与单线深入矛盾，单次游戏难平衡 |
| A4 | `dream_walker` 依赖连续 3 天梦境 | 错过任一天则不足 3 个 shard |
| A5 | 8 个节日 flag 无后续剧情引用 | `luci_birthday_known`/`shenyan_birthday_known`/`art_festival`/`christmas`/`valentine_day`/`jiangyu_birthday_known` 等仅设置未使用 |
| A6 | 起始 7/15，主线第 4 天分支 | 玩家在主线内只能体验 7-15 一个节日，其余节日都在路线分支后的时间跳跃期 |

---

## 四、GLM 开发建议

### 4.1 剧情扩写优先级 P0（必须修复，否则游戏无法正常通关）

#### 任务 P0-1：补全沈砚之闪回节点

**目标**：在 [STORY.flashbacks](file:///Users/x/code/game1/story.js#L1363) 中新增 `fb_highschool_shenyan`，揭示五年前美术馆相遇。

**触发条件建议**：`s => s.affection?.shenyan >= 4 && s.flags?.intel_shenyan_ex`

**内容要点**（GLM 生成时遵循）：
- 时间：五年前的夏天，林夏跟陆辞来美术馆参观
- 视角：林夏回头对陆辞笑的瞬间，沈砚之在二楼看到
- 伏笔回收：与 [malePerspectives.shenyan.truthEnding L1721](file:///Users/x/code/game1/story.js#L1721) 呼应
- 奖励：`photo_shenyan_studio`（沈砚之画室照片）+ flag `fb_highschool_shenyan`
- `then`：建议设为 `null` 但在 engine 中触发后续对话（与现有闪回保持一致），或直接 `then:'shenyan_fb_aftertalk'` 新增后续对话

**Prompt 模板**：
```
你是都市情感悬疑游戏《霓虹心事》的剧情编剧。请为沈砚之线补写一段闪回剧情（五年前）。
要求：
1. 时间设定：五年前夏天，林夏跟陆辞来砚美术馆参观
2. 场景：林夏回头对陆辞笑，沈砚之在二楼看到这一幕
3. 字数：3-4 段，每段 50-80 字
4. 风格：克制、留白、暗示沈砚之开始画那幅未完成的画
5. 结尾：暗示"画了五年没画完"
6. 与现有真相结局文本（"五年前的她"）呼应
输出 JSON：{title, content, choices:[{text, shard, mood}]}
```

#### 任务 P0-2：补全缺失的收集品获取入口

**目标**：
1. 在 [route_choice_trigger](file:///Users/x/code/game1/story.js#L385) 后或 [route_*_start](file:///Users/x/code/game1/story.js#L389) 事件中添加 `collectible:'stamp_route'`
2. 在电话 missed 事件（如 [jiangyu_call_declined L184](file:///Users/x/code/game1/story.js#L184)）后或语音信箱回放逻辑中添加 `recording_msg` 收集品

**实施位置建议**：
- `stamp_route`：在各 `route_*_start` 事件块的第一个事件添加 `collectible:'stamp_route'`
- `recording_msg`：在 engine.js 的语音信箱回放逻辑中触发，或在 story.js 新增 `voicemail_replay` 事件

#### 任务 P0-3：修复 flag 设置缺失

**目标**：补全 B1-B6 列出的 flag 设置入口。

**实施建议**：
- `flags['_'+route+'_hidden']`：在各路线 HIDDEN 触发条件满足时设置（如在解谜完成后设置 `flags._shenyan_hidden = true`）
- `flags._solo_hidden`：在独行线收集 ≥10 件时设置，或在特定 solo 事件中设置
- `flags.group_created_group_neon`：在 [susu_create_group L1280](file:///Users/x/code/game1/story.js#L1280) 事件的 effects 中添加 `flags:{group_created_group_neon:1}`
- `flags.shenyan_south`：在 [route_shenyan_south L398](file:///Users/x/code/game1/story.js#L398) 事件的 effects 中添加
- `flags.midnight_call`：在 engine.js 的 call 逻辑中，当游戏时间在 0-5 点时设置
- `flags.ghost_msg_triggered`：新增彩蛋事件，或在特定梦境后触发

### 4.2 剧情扩写优先级 P1（显著提升体验）

#### 任务 P1-1：补全沈砚之觉醒中间段

**目标**：在 [route_shenyan_cafe L456](file:///Users/x/code/game1/story.js#L456) 与 [route_shenyan_end_check L460](file:///Users/x/code/game1/story.js#L460) 之间插入 1-2 个觉醒铺垫事件。

**建议新增事件**：
- `route_shenyan_awaken_1`：沈砚之深夜独自在画室，林夏看到未完成的画
- `route_shenyan_awaken_2`：沈砚之坦白五年前的相遇（可与 P0-1 闪回联动）

**Prompt 模板**：
```
为沈砚之线补写觉醒中间段剧情。当前剧情：沈砚之从控制欲直接跳到结局抉择。
请补写 2 个事件，每个事件含 2-3 条消息 + 1 个选择，要求：
1. 揭示沈砚之控制欲背后的脆弱（家族压力、自我认同危机）
2. 给林夏"看到真实的沈砚之"的机会
3. 选择影响 shenyan_awaken flag
4. 风格：克制、暗流涌动、避免狗血
```

#### 任务 P1-2：补全江屿妹妹/阿哲前史铺垫

**目标**：在第 2-3 天补 1-2 个江屿背景暗示事件。

**建议新增事件**（在第 2 天 [jiangyu_first_msg L130](file:///Users/x/code/game1/story.js#L130) 后）：
- `jiangyu_hint_sister`：江屿调的酒"夏"，提到"写给一个没能等到夏天的人"
- `jiangyu_hint_band`：雾港墙上的乐队海报，江屿回避话题

**目的**：让 [route_jiangyu_grave L592](file:///Users/x/code/game1/story.js#L592) 揭示妹妹时不再突兀，[route_jiangyu_drummer L600](file:///Users/x/code/game1/story.js#L600) 阿哲忌日有铺垫。

#### 任务 P1-3：补全苏苏独立剧情线

**目标**：新增 2-3 个苏苏个人故事节点，让其从工具人升格为有弧光的角色。

**建议事件**：
- `susu_own_love`：苏苏聊起自己的暗恋/失恋（与林夏形成镜像）
- `susu_past`：苏苏与林夏大学往事回忆（强化闺蜜羁绊）
- `susu_growth`：苏苏在林夏路线选择后给出"我也有我的选择"的独立宣言

#### 任务 P1-4：补全群聊后续

**目标**：在 [group_neon_react1/2/3](file:///Users/x/code/game1/story.js#L1299) 后各添加后续群聊事件。

**建议**：每条 react 后接 1-2 条群聊消息（其他角色反应），最终 `then` 汇合到主线下一节点。

#### 任务 P1-5：回收沈砚之"北方女人"伏笔

**目标**：在沈砚之线 HIDDEN 结局或新增的觉醒事件中，揭示"北方女人"就是五年前的林夏。

**实施位置**：[route_shenyan_end_check L460](file:///Users/x/code/game1/story.js#L460) 的 confront 选项后，或新增 `route_shenyan_truth` 事件。

### 4.3 剧情扩写优先级 P2（锦上添花）

#### 任务 P2-1：节日剧情化

**目标**：将 8 个仅设置 flag 的节日（[L1655-L1664](file:///Users/x/code/game1/story.js#L1655)）补全为有剧情的节日事件。

**优先级**：
1. 8-10 陆辞生日（与陆辞线呼应）
2. 9-12 沈砚之生日（与沈砚之线呼应）
3. 6-9 江屿生日（与江屿线呼应）
4. 2-14 情人节（多线通用）
5. 12-25 圣诞节（多线通用）

**Prompt 模板**：
```
为《霓虹心事》补写陆辞生日（8月10日）剧情事件。
要求：
1. 触发条件：s.affection.luci >= 3
2. 内容：陆辞生日当天发来的消息 + 玩家选择
3. 选择影响 luci 好感或解锁照片
4. 字数：消息 3-4 条，每条 30-50 字
5. 风格：陆辞的青梅竹马暗恋特质
输出 JSON 事件格式
```

#### 任务 P2-2：补全林夏主角收束

**目标**：在每条路线结局后，添加林夏的"她改变了什么"对比场景。

**实施**：在 [endings L872](file:///Users/x/code/game1/story.js#L872) 各结局的 `desc` 后，新增 `epilogue` 字段，展示林夏结局后的状态对比。

#### 任务 P2-3：narrator 内心化

**目标**：让 narrator 承担林夏内心独白功能，而非纯系统提示。

**实施**：在关键节点（如路线选择、结局抉择）将 narrator 消息改为林夏第一人称内心独白。

### 4.4 代码一致性修复（可与剧情扩写同步进行）

#### 任务 C1：统一 ending 命名

将 [ending_shenyan_good L477](file:///Users/x/code/game1/story.js#L477) 等事件重命名为 `ending_shenyan_good_evt`，或在 engine 中统一映射，避免与 endingId `shenyan_good` 混淆。

#### 任务 C2：重命名 `ending_true` 事件

将 [ending_true L725](file:///Users/x/code/game1/story.js#L725) 重命名为 `ending_solo_compute`，避免误导（实际可能返回 solo_bad 等）。

#### 任务 C3：补全 ending 事件

[endings 对象 L872](file:///Users/x/code/game1/story.js#L872) 定义了 normal/hidden 结局，但 events 中只有 good/bad 事件，需补全或统一通过 `_compute` 处理。

#### 任务 C4：修复重复收集品

- `postcard_neon`、`stamp_first`、`ticket_bar`、`photo luci_album`、`photo rooftop_night`、`music xia`：在重复获取处改为条件判断（`if (!collected.includes(id))`）或移除重复获取点
- `memento_pen`：在 [inv_shenyan_studio_after L1181](file:///Users/x/code/game1/story.js#L1181) 添加 `collectible:'memento_pen'`，与玩法.md 描述一致

#### 任务 C5：补全 call 事件支撑 perfect_listen 成就

新增 2 个 call 事件（如沈砚之/陆辞的电话），或在 engine 中支持拨出电话计入成就。

#### 任务 C6：补全群聊 flag

在 [susu_create_group L1280](file:///Users/x/code/game1/story.js#L1280) 的 effects 中添加 `flags:{group_created_group_neon:1}`。

### 4.5 节奏调整建议（中长期）

#### 问题：前期过长，后期仓促

- 序章 + 第 1-3 天：约 40 个共同事件详细铺垫
- 路线分支后：每线仅 7-10 个事件到结局
- 比例失衡，玩家对男主了解不足就要在第 4 天做路线选择

#### 建议 R1：增加中段铺垫

在第 4 天开幕式前，增加 1-2 天中段事件（如第 3.5 天的日常），让玩家有更多时间了解三位男主，再决定路线。

#### 建议 R2：路线分支后增加事件密度

每条路线当前 7-10 个事件，建议扩写到 12-15 个，特别是：
- 沈砚之线：补觉醒中间段（见 P1-1）
- 江屿线：补妹妹/阿哲前史铺垫（见 P1-2）
- 陆辞线：弧光较完整，可补米兰期间的异地消息往来
- 独行线：补"一个月后"期间的独立事件

#### 建议 R3：平滑时间跳跃

当前多处"半个月后/一个月后"跳跃无中间事件，建议在跳跃期间插入 1-2 个时间锚点事件（如朋友圈、消息、梦境），让时间流逝有实感。

#### 建议 R4：扩展支线窗口

当前邀约/情报/群聊都需 `day>=3`，但第 4 天就分支，支线窗口极窄。建议：
- 将支线触发条件改为 `day>=2`（部分）
- 或将路线选择延后到第 5-6 天
- 或在路线分支后仍允许部分支线触发

---

## 五、GLM 接入技术建议

### 5.1 数据格式约定

GLM 生成的剧情内容应严格遵循现有 [story.js](file:///Users/x/code/game1/story.js) 的事件结构：

```javascript
// 标准事件模板
'event_id': {
  type: 'message_batch' | 'call' | 'dream' | 'encounter' | 'moment_post' | 
        'photo_unlock' | 'music_unlock' | 'note_add' | 'calendar_add' | 
        'advance_time' | 'advance_day' | 'route_choice' | 'ending',
  delay: <number>,  // 秒
  collectible: '<id>',  // 可选
  messages: [
    {
      from: '<charId>',
      text: '<对话内容>',
      then: '<next_event_id>',  // 可选
      choice: {  // 可选
        prompt: '<提示>',
        options: [
          {
            text: '<选项文本>',
            effects: {
              affection: {charId: n} | {affectionDetail: {charId: {closeness, trust, tension}}},
              flags: {flagName: n},
              personality: {active|passive|rational|emotional|independent|dependent: n}
            },
            thenEvent: '<next_event_id>',
            hint: '<选项提示>'
          }
        ]
      }
    }
  ],
  then: '<next_event_id>'  // 可选，用于无 choice 的串联
}
```

### 5.2 角色对话风格 Prompt 指南

| 角色 | 风格关键词 | 禁忌 | 示例 |
|------|----------|------|------|
| 沈砚之 | 短句、克制、暗含控制、偶尔温柔 | 不可过于直白表白 | "九点。别迟到。" "我这个人，最讨厌不守时。" |
| 陆辞 | 热情、感叹号多、怀旧、暗恋感 | 不可过于黏人 | "诶诶诶！！！林夏是你吗？？？" "九年又一百八十二天。" |
| 江屿 | 沉默、断句、借酒/借歌表达 | 不可话多 | "今天那杯酒，算我请的。" "副歌写不下去。" |
| 苏苏 | 八卦、感叹、关心、活泼 | 不可过于严肃 | "林夏！！！你到霓城了吗？？" |
| narrator | 系统提示、第二人称 | 不可有主观情绪 | "（三个人都在等你。你的回应是？）" |

### 5.3 伏笔回收检查清单

GLM 生成新剧情时，应检查是否回收以下伏笔：

- [ ] 沈砚之"北方女人"身份（实为五年前林夏）
- [ ] 沈砚之五年前的画（与 memento_pen 密码 1402 关联）
- [ ] 沈砚之与江屿的关系（"唱《夏》那晚他离场了"）
- [ ] 沈砚之与陆辞的关系（"拍过封面后没合作"）
- [ ] 江屿妹妹与主角同名"林夏"的宿命感
- [ ] 江屿鼓手阿哲的忌日（三年前）
- [ ] dream_day2 "烫手的画框"隐喻
- [ ] dream_day3 "未完副歌"隐喻
- [ ] solo_hidden "你发现自己也是某个故事的主角"
- [ ] egg_ghost_msg 五年前的消息

### 5.4 结局判定兼容性

GLM 扩写剧情时，需确保不破坏 [computeEnding L2131](file:///Users/x/code/game1/story.js#L2131) 的判定逻辑：

1. 新增的 flag 不得与现有 flag 冲突
2. 新增的收集品若作为 HIDDEN 信物，需同步更新 [hiddenRequired L2144](file:///Users/x/code/game1/story.js#L2144)
3. 新增的路线选择点需同步更新 [positives/negatives L2146-L2147](file:///Users/x/code/game1/story.js#L2146)
4. 真结局条件 `trueEndingUnlockCondition`（[L1542](file:///Users/x/code/game1/story.js#L1542)）检查成就数 ≥ 60%，新增成就需重新计算阈值

### 5.5 测试验证要求

所有 GLM 生成的剧情节点，需通过以下测试：

1. **链路完整性**：`then`/`thenEvent` 引用的事件必须存在
2. **flag 可达性**：所有检查的 flag 必须有设置入口
3. **收集品可达性**：所有收集品必须有至少一个获取入口
4. **结局可触发性**：17 个结局必须都可触达
5. **回归测试**：运行 `node test_story.js` 和 `node test_regressions.js`，确保不破坏现有链路（当前 294/294 通过）
6. **Playwright 烟测**：运行 `npx playwright test`，确保浏览器端正常

---

## 六、开发路线图建议

### 阶段一：P0 修复（必须）

1. 补全沈砚之闪回节点（P0-1）
2. 补全缺失收集品获取入口（P0-2）
3. 修复 flag 设置缺失（P0-3）
4. 修复重复收集品（C4）
5. 补全群聊 flag（C6）
6. 运行全部测试验证

### 阶段二：P1 剧情扩写（显著提升）

1. 沈砚之觉醒中间段（P1-1）
2. 江屿妹妹/阿哲前史铺垫（P1-2）
3. 苏苏独立剧情线（P1-3）
4. 群聊后续（P1-4）
5. 回收"北方女人"伏笔（P1-5）

### 阶段三：P2 锦上添花

1. 节日剧情化（P2-1）
2. 林夏主角收束（P2-2）
3. narrator 内心化（P2-3）

### 阶段四：节奏调整（中长期）

1. 增加中段铺垫（R1）
2. 路线分支后增加事件密度（R2）
3. 平滑时间跳跃（R3）
4. 扩展支线窗口（R4）

### 阶段五：代码一致性（贯穿）

1. 统一 ending 命名（C1、C2、C3）
2. 补全 call 事件（C5）

---

## 七、附录

### 7.1 关键文件与行号索引

| 内容 | 位置 |
|------|------|
| 角色定义 | [story.js#L7-L13](file:///Users/x/code/game1/story.js#L7-L13) |
| 序章 | [story.js#L17-L43](file:///Users/x/code/game1/story.js#L17-L43) |
| 沈砚之线 | [story.js#L389-L478](file:///Users/x/code/game1/story.js#L389-L478) |
| 陆辞线 | [story.js#L480-L577](file:///Users/x/code/game1/story.js#L480-L577) |
| 江屿线 | [story.js#L579-L669](file:///Users/x/code/game1/story.js#L579-L669) |
| 独行线 | [story.js#L671-L725](file:///Users/x/code/game1/story.js#L671-L725) |
| 朋友圈 | [story.js#L729-L795](file:///Users/x/code/game1/story.js#L729-L795) |
| 梦境 | [story.js#L799-L833](file:///Users/x/code/game1/story.js#L799-L833) |
| 结局定义 | [story.js#L872-L901](file:///Users/x/code/game1/story.js#L872-L901) |
| 路线选择 | [story.js#L910-L918](file:///Users/x/code/game1/story.js#L910-L918) |
| 偶遇池 | [story.js#L922-L1030](file:///Users/x/code/game1/story.js#L922-L1030) |
| 情报系统 | [story.js#L1067-L1120](file:///Users/x/code/game1/story.js#L1067-L1120) |
| 邀约系统 | [story.js#L1122-L1255](file:///Users/x/code/game1/story.js#L1122-L1255) |
| 群聊系统 | [story.js#L1269-L1322](file:///Users/x/code/game1/story.js#L1269-L1322) |
| 角色关系描述 | [story.js#L1326-L1358](file:///Users/x/code/game1/story.js#L1326-L1358) |
| 闪回 | [story.js#L1363-L1401](file:///Users/x/code/game1/story.js#L1363-L1401) |
| 收集品定义 | [story.js#L1440-L1500](file:///Users/x/code/game1/story.js#L1440-L1500) |
| 成就定义 | [story.js#L1510-L1539](file:///Users/x/code/game1/story.js#L1510-L1539) |
| 解谜系统 | [story.js#L1581-L1635](file:///Users/x/code/game1/story.js#L1581-L1635) |
| 节日系统 | [story.js#L1653-L1664](file:///Users/x/code/game1/story.js#L1653-L1664) |
| 男主视角与真相结局 | [story.js#L1721-L1850](file:///Users/x/code/game1/story.js#L1721-L1850) |
| 主题解锁 | [story.js#L2075-L2100](file:///Users/x/code/game1/story.js#L2075-L2100) |
| 结局图鉴 | [story.js#L2103-L2128](file:///Users/x/code/game1/story.js#L2103-L2128) |
| 结局判定算法 | [story.js#L2131-L2153](file:///Users/x/code/game1/story.js#L2131-L2153) |
| 梦魇系统 | [story.js#L2208-L2264](file:///Users/x/code/game1/story.js#L2208-L2264) |
| 每日约会 | [story.js#L2158-L2200](file:///Users/x/code/game1/story.js#L2158-L2200) |

### 7.2 GLM 接入工作流建议

```
1. 读取本文件了解剧情全貌与问题清单
2. 读取 story.js 对应段落了解现有文本风格
3. 根据任务优先级（P0 → P1 → P2）选择扩写任务
4. 使用 5.2 节 Prompt 模板生成剧情内容
5. 按 5.1 节数据格式封装为事件
6. 用 5.3 节检查清单验证伏笔回收
7. 用 5.4 节验证结局判定兼容性
8. 运行 5.5 节测试套件验证
9. 提交 git（中文 commit message）
10. 更新 VERSION 文件（+0.0.1，满十进一）
```

### 7.3 版本规划建议

| 版本 | 目标 | 对应任务 |
|------|------|---------|
| v0.1.5 | P0 修复 | P0-1 ~ P0-3, C4, C6 |
| v0.2.0 | P1 沈砚之线扩写 | P1-1, P1-5 |
| v0.2.1 | P1 江屿线扩写 | P1-2 |
| v0.2.2 | P1 苏苏线扩写 | P1-3, P1-4 |
| v0.3.0 | P2 节日与收束 | P2-1 ~ P2-3 |
| v0.4.0 | 节奏调整 | R1 ~ R4 |
| v1.0.0 | 代码一致性 + 全结局测试 | C1 ~ C5 |

---

**文档结束** · 后续 GLM 扩写请以本文件为基准，每次扩写完成后更新对应章节的"已修复"标记。
