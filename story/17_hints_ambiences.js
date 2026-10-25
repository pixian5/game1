/* ===== 霓虹心事 · 剧情数据：选项提示、朋友圈评论与氛围 =====
 * 本文件由 story.js 拆分而来（v0.1.7），内容逐字搬移。
 * 拆分方案：见 docs/ 与 README「目录结构」。修改剧情数据后请运行 npm run validate:story。
 */



// ===== v0.0.16 聊天选项智能提示 =====
// 二周目/观赏模式开启时，显示每个选项的"潜在影响"
// 提示规则：根据 effects 字段自动生成文案
STORY.optionHints = {
  // 通用规则：根据 effects.affection / flags / personality 自动生成
  generate: function(opt){
    if(!opt.effects) return null;
    const parts = [];
    if(opt.effects.affection){
      for(const k in opt.effects.affection){
        const v = opt.effects.affection[k];
        if(v > 0) parts.push(`${STORY.characters[k]?.name||k} +${v}`);
        else if(v < 0) parts.push(`${STORY.characters[k]?.name||k} ${v}`);
      }
    }
    if(opt.effects.affectionDetail){
      for(const k in opt.effects.affectionDetail){
        const ad = opt.effects.affectionDetail[k];
        const dims = [];
        if(ad.closeness) dims.push(`亲密${ad.closeness>0?'+':''}${ad.closeness}`);
        if(ad.trust) dims.push(`信任${ad.trust>0?'+':''}${ad.trust}`);
        if(ad.tension) dims.push(`暧昧${ad.tension>0?'+':''}${ad.tension}`);
        if(dims.length) parts.push(`${STORY.characters[k]?.name||k}(${dims.join('/')})`);
      }
    }
    if(opt.effects.flags){
      const flagKeys = Object.keys(opt.effects.flags);
      if(flagKeys.length > 0) parts.push(`解锁 ${flagKeys.length} 个剧情标记`);
    }
    if(opt.effects.personality){
      const ps = [];
      for(const k in opt.effects.personality){
        const v = opt.effects.personality[k];
        if(v > 0) ps.push(k);
      }
      if(ps.length) parts.push(`性格+${ps.join('/')}`);
    }
    return parts.length > 0 ? parts.join(' · ') : null;
  }
};


// ===== v0.0.16 男主朋友圈互动 =====
// 玩家发朋友圈后，根据内容类别男主会主动评论
// 玩家可选择回复方式，回复影响三轴好感
STORY.momentComments = {
  // 类别 → 男主评论模板
  byCategory: {
    city: {  // 城市夜景类
      shenyan: [
        {text:'霓虹灯太吵。', effects:{affectionDetail:{shenyan:{tension:1}}}, replyOptions:[
          {text:'你也来吗？', effects:{affectionDetail:{shenyan:{closeness:1,tension:1}}}},
          {text:'安静点好。', effects:{affectionDetail:{shenyan:{trust:1}}}},
          {text:'（不回复）', effects:{}}
        ]},
        {text:'光影不错。', effects:{affectionDetail:{shenyan:{trust:1}}}, replyOptions:[
          {text:'你也喜欢？', effects:{affectionDetail:{shenyan:{closeness:1}}}},
          {text:'嗯。', effects:{}},
          {text:'（不回复）', effects:{}}
        ]}
      ],
      luci: [
        {text:'这角度我熟，是雾港那条巷子？', effects:{affectionDetail:{luci:{closeness:2}}}, replyOptions:[
          {text:'被你认出来了', effects:{affectionDetail:{luci:{tension:1}}}},
          {text:'下次带我去拍', effects:{affectionDetail:{luci:{closeness:1,tension:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ],
      jiangyu: [
        {text:'……灯亮着，没人懂。', effects:{affectionDetail:{jiangyu:{tension:1}}}, replyOptions:[
          {text:'你在哪？', effects:{affectionDetail:{jiangyu:{closeness:1}}}},
          {text:'我懂。', effects:{affectionDetail:{jiangyu:{tension:1,trust:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ]
    },
    rooftop: {  // 天台/夜景
      shenyan: [
        {text:'夜风有点凉。', effects:{affectionDetail:{shenyan:{trust:1}}}, replyOptions:[
          {text:'你也上去过？', effects:{affectionDetail:{shenyan:{closeness:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ],
      jiangyu: [
        {text:'昨晚那阵风，我也在。', effects:{affectionDetail:{jiangyu:{tension:2}}}, replyOptions:[
          {text:'我看到你了。', effects:{affectionDetail:{jiangyu:{closeness:1,tension:1}}}},
          {text:'下次叫我。', effects:{affectionDetail:{jiangyu:{closeness:1}}}},
          {text:'（不回复）', effects:{}}
        ]}
      ]
    },
    '': {  // 无配图纯文字
      susu: [
        {text:'又emo了？', effects:{}, replyOptions:[
          {text:'没有啦', effects:{}},
          {text:'有点', effects:{}}
        ]}
      ],
      luci: [
        {text:'？', effects:{}, replyOptions:[
          {text:'没事', effects:{}},
          {text:'（不回复）', effects:{}}
        ]}
      ]
    }
  }
};


// ===== v0.0.16 动态背景氛围 =====
// 根据时间/心情/天气自动应用氛围层（不改主题，叠加在主题之上）
// v0.2.7 (M1.3): 雨天/夜晚/不安三档附带氛围纹理（tools/generate_ambiences.py 生成），
//   由 ui/18 composeWallpaper 合成进 --wallpaper-1；layerBlend 即 background-blend-mode。
STORY.ambiences = {
  day:     { id:'day',     name:'白昼', wallpaperOverlay:'rgba(255,250,240,0.04)', cond: s => Math.floor(s.minute/60) >= 8 && Math.floor(s.minute/60) < 18 },
  dusk:    { id:'dusk',    name:'黄昏', wallpaperOverlay:'rgba(251,191,36,0.08)', cond: s => { const h=Math.floor(s.minute/60); return h >= 17 && h < 20; } },
  night:   { id:'night',   name:'夜晚', wallpaperOverlay:'rgba(0,0,30,0.35)',    layerImage:'assets/ambiences/night.jpg',   layerBlend:'soft-light', cond: s => { const h=Math.floor(s.minute/60); return h >= 20 || h < 6; } },
  dawn:    { id:'dawn',    name:'黎明', wallpaperOverlay:'rgba(255,200,180,0.06)', cond: s => { const h=Math.floor(s.minute/60); return h >= 6 && h < 8; } },
  rainy:   { id:'rainy',   name:'雨天', wallpaperOverlay:'rgba(80,120,180,0.10)',  layerImage:'assets/ambiences/rainy.jpg',   layerBlend:'soft-light', cond: s => s.flags._weather === 'rainy' },
  anxious: { id:'anxious', name:'心绪不宁', wallpaperOverlay:'rgba(120,40,80,0.12)', layerImage:'assets/ambiences/anxious.jpg', layerBlend:'soft-light', cond: s => s.mood === 'anxious' },
  // v0.1.8: 塔罗运势接入氛围——抽牌当天叠加一层「幸运/沉重」色调（优先级低于心情与天气）
  lucky:   { id:'lucky',   name:'幸运', wallpaperOverlay:'rgba(255,160,210,0.07)', cond: s => s.todayFortune && s.todayFortune.day === s.day && s.todayFortune.reversed === false },
  unlucky: { id:'unlucky', name:'沉重', wallpaperOverlay:'rgba(60,60,90,0.14)', cond: s => s.todayFortune && s.todayFortune.day === s.day && s.todayFortune.reversed === true }
};

if (typeof window !== 'undefined') window.STORY = STORY;
