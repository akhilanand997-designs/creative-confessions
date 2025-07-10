import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAucWzQLOi4iupT23pDFPi6ltoE9Y5Hfxg",
  authDomain: "creative-block-c9c70.firebaseapp.com",
  databaseURL: "https://creative-block-c9c70-default-rtdb.firebaseio.com",
  projectId: "creative-block-c9c70",
  storageBucket: "creative-block-c9c70.firebasestorage.app",
  messagingSenderId: "517111503778",
  appId: "1:517111503778:web:8ddc6d54dc34ee9950b0fb",
  measurementId: "G-4ZGYX3DVXJ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let username = localStorage.getItem('whyWallUsername');
if (!username) {
  username = generateRandomUsername();
  localStorage.setItem('whyWallUsername', username);
}

const postsRef = ref(database, 'posts');

const whyInput = document.getElementById('whyInput');
const wallDiv = document.getElementById('wall');
const themeToggle = document.getElementById('themeToggle');

whyInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const text = whyInput.value.trim();
    if (text) {
      push(postsRef, { text, user: username, replies: [] });
      whyInput.value = '';
    }
  }
});

onValue(postsRef, (snapshot) => {
  renderPosts(snapshot);
});

function renderPosts(snapshot) {
  wallDiv.innerHTML = '';
  if (!snapshot.exists()) {
    wallDiv.innerHTML = `<p class="subtitle">No one has shared yet. Be the first!</p>`;
    return;
  }

  const data = snapshot.val();
  const posts = Object.entries(data).reverse();

  posts.forEach(([key, post]) => {
    const card = document.createElement('div');
    card.className = 'glass';
    let html = `<p><strong>${post.user}:</strong> ${post.text}</p>`;

    if (post.replies && post.replies.length) {
      html += post.replies.map(r => `
        <div class="reply">
          <strong>${r.user}:</strong> ${r.text}
        </div>`).join('');
    }

    html += `<input id="replyInput-${key}" placeholder="Add your reply... (Press Enter to submit)">`;
    card.innerHTML = html;
    wallDiv.appendChild(card);
  });

  attachReplyListeners(data);
}

function attachReplyListeners(data) {
  Object.entries(data).forEach(([key, post]) => {
    const input = document.getElementById(`replyInput-${key}`);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        const replyText = input.value.trim();
        if (!replyText) return;
        const newReplies = post.replies ? [...post.replies, { text: replyText, user: username }] : [{ text: replyText, user: username }];
        update(ref(database, `posts/${key}`), { ...post, replies: newReplies });
        input.value = '';
      }
    });
  });
}

function generateRandomUsername() {
  const adjectives = ['Mint', 'Pixel', 'Silent', 'Neon', 'Cosmic', 'Lunar', 'Aqua', 'Nova', 'Velvet', 'Shadow'];
  const nouns = ['Lion', 'Star', 'Wave', 'Bloom', 'Falcon', 'Crystal', 'Phoenix', 'Drift', 'Echo', 'Sky'];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}#${Math.floor(1000 + Math.random() * 9000)}`;
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  updateThemeButton();
});

function updateThemeButton() {
  const label = document.getElementById('themeLabel');
  if (document.body.classList.contains('light-theme')) {
    label.textContent = "🌙 Embrace the Dark";
  } else {
    label.textContent = "☀️ Chase the Light";
  }
}
