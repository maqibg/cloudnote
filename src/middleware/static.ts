import { Context } from 'hono';
import { QUILL_JS_SOURCE } from '../vendor/quillJs';

export function serveStatic() {
  return async (c: Context) => {
    const path = c.req.path;
    
    // 这里可以根据需要返回不同的静态资源
    // 在实际部署时，这些资源可以存储在R2或KV中
    
    if (path === '/static/editor.js') {
      return c.text(getEditorJS(), 200, {
        'Content-Type': 'application/javascript'
      });
    }
    
    if (path === '/static/style.css') {
      return c.text(getStyleCSS(), 200, {
        'Content-Type': 'text/css'
      });
    }

    if (path === '/static/quill.js') {
      return c.body(QUILL_JS_SOURCE, 200, {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=86400'
      });
    }
    
    return c.notFound();
  };
}

function getEditorJS(): string {
  return `
// 编辑器JavaScript代码将在前端界面开发时添加
console.log('Editor loaded');
  `;
}

function getStyleCSS(): string {
  return `
/* 样式表将在前端界面开发时添加 */
body { font-family: system-ui, -apple-system, sans-serif; }
  `;
}
