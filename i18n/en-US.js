/* ===== 霓虹心事 · English pack (en-US, 骨架) =====
 * 骨架：仅示范若干译文；未收录的 key 由 I18N.translate 回退为中文原文。
 * 启用：I18N.setLang('en-US')（当前尚无 UI 切换入口，供后续接入；默认仍 zh-CN）。
 * 新增译文：把中文原文（key，含 {var} 占位）映射到英文即可。
 */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  window.I18N_PACKS = window.I18N_PACKS || {};
  window.I18N_PACKS['en-US'] = {
    '壁纸已切换': 'Wallpaper switched',
    '图标主题已切换': 'Icon theme switched',
    '已导出': 'Exported',
    '已发表': 'Posted',
    '已继续游戏': 'Resumed game',
    '已挂断': 'Call ended',
    '已回复': 'Replied',
    '已删除': 'Deleted',
    '照片未解锁': 'Photo not unlocked',
    '请输入答案': 'Enter your answer',
    '谜题已解开': 'Puzzle solved',
    '答案不对': 'Wrong answer',
    '保存失败': 'Save failed',
    '读取失败': 'Load failed',
    '删除失败': 'Delete failed',
    '已保存到 {slot}': 'Saved to {slot}',
    '已读取 {slot}': 'Loaded {slot}',
    '已导入到 {slot}': 'Imported to {slot}',
    '导入失败：{reason}': 'Import failed: {reason}',
    '存档失败：{reason}': 'Save failed: {reason}'
  };
})();