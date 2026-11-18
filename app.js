const STORAGE_KEY = 'forum_posts';

// 从 localStorage 读取帖子，没有就用空数组
function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// 保存帖子到 localStorage
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// 渲染帖子列表
function renderPosts() {
  const posts = loadPosts();
  const container = document.getElementById('posts');

  if (posts.length === 0) {
    container.innerHTML = '<p class="empty">还没有帖子，发第一帖吧。</p>';
    return;
  }

  container.innerHTML = posts.map(post => `
    <div class="post">
      <h3>${escapeHtml(post.title)}</h3>
      <p>${escapeHtml(post.content)}</p>
      <div class="meta">${post.time}</div>
    </div>
  `).join('');
}

// 防止用户输入 HTML 注入
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 处理发帖
document.getElementById('submit-post').addEventListener('click', () => {
  const titleInput = document.getElementById('post-title');
  const contentInput = document.getElementById('post-content');
  const msg = document.getElementById('form-msg');

  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    msg.textContent = '标题和内容都不能为空。';
    return;
  }

  msg.textContent = '';

  const posts = loadPosts();
  posts.unshift({
    title,
    content,
    time: new Date().toLocaleString('zh-CN')
  });
  savePosts(posts);

  titleInput.value = '';
  contentInput.value = '';
  renderPosts();
});

// 页面加载时渲染
renderPosts();