// ✅ Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, update } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// ✅ Your Firebase config
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

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ✅ Generate (or remember) user identity
let username = localStorage.getItem('whyWallUsername');
if (!username) {
  username = generateRandomUsername();
  localStorage.setItem('whyWallUsername', username);
}

// ✅ Firebase posts reference
const postsRef = ref(database, 'posts');

// ✅ DOM elements
const whyInput = document.getElementById('whyInput');
const wallDiv = document.getElementById('wall');
const themeToggle = document.getElementById('themeToggle');

// ✅ Add a new WHY post
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

// ✅ Render posts from database
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

// ✅ Attach reply inputs
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

// ✅ Listen for realtime updates
onValue(postsRef, (snapshot) => {
  renderPosts(snapshot);
});

// ✅ Random Username Generator
function generateRandomUsername() {
  const adjectives = ['Mint', 'Pixel', 'Silent', 'Neon', 'Cosmic', 'Lunar', 'Aqua', 'Nova', 'Velvet', 'Shadow'];
  const nouns = ['Lion', 'Star', 'Wave', 'Bloom', 'Falcon', 'Crystal', 'Phoenix', 'Drift', 'Echo', 'Sky'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${adj}${noun}#${number}`;
}

// ✅ Theme toggle button
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  updateThemeButton();
});

// ✅ Theme label
function updateThemeButton() {
  const label = document.getElementById('themeLabel');
  if (document.body.classList.contains('light-theme')) {
    const options = [
      "🌙 Embrace the Dark",
      "🌙 Switch to Night Mode",
      "🌙 Design in Shadows"
    ];
    label.textContent = options[Math.floor(Math.random() * options.length)];
  } else {
    const options = [
      "☀️ Chase the Light",
      "☀️ Design in Sunlight",
      "☀️ Go Radiant"
    ];
    label.textContent = options[Math.floor(Math.random() * options.length)];
  }
}
