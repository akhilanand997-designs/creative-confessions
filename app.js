// ===== Data store =====
const whys = [];

// ===== Username =====
let username = localStorage.getItem('whyWallUsername');
if (!username) {
  username = generateRandomUsername();
  localStorage.setItem('whyWallUsername', username);
}

// ===== On Load =====
document.addEventListener('DOMContentLoaded', () => {
  const whyInput = document.getElementById('whyInput');
  const themeToggle = document.getElementById('themeToggle');

  whyInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addWhy();
    }
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    updateThemeButton();
  });

  updateThemeButton();
  renderWall();
});


// ===== Username Generation =====
function generateRandomUsername() {
  const adjectives = ['Mint', 'Pixel', 'Silent', 'Neon', 'Cosmic', 'Lunar', 'Aqua', 'Nova', 'Velvet', 'Shadow'];
  const nouns = ['Lion', 'Star', 'Wave', 'Bloom', 'Falcon', 'Crystal', 'Phoenix', 'Drift', 'Echo', 'Sky'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${adj}${noun}#${number}`;
}

// ===== Add a new WHY =====
function addWhy() {
  const text = document.getElementById('whyInput').value.trim();
  if (!text) return;
  whys.unshift({ text, user: username, replies: [] });
  document.getElementById('whyInput').value = '';
  renderWall();
}

// ===== Add a Reply =====
function addReply(index) {
  const input = document.getElementById(`replyInput-${index}`);
  const replyText = input.value.trim();
  if (!replyText) return;
  whys[index].replies.push({ text: replyText, user: username });
  input.value = '';
  renderWall();
}

// ===== Render Wall =====
function renderWall() {
  const wall = document.getElementById('wall');
  wall.innerHTML = '';

  if (whys.length === 0) {
    wall.innerHTML = `<p class="subtitle">No one has shared yet. Be the first!</p>`;
    return;
  }

  whys.forEach((why, index) => {
    const card = document.createElement('div');
    card.className = 'glass';

    let html = `<p><strong>${why.user}:</strong> ${why.text}</p>`;

    if (why.replies.length) {
      html += why.replies.map(r => `
        <div class="reply">
          <strong>${r.user}:</strong> ${r.text}
        </div>`).join('');
    }

    html += `<input id="replyInput-${index}" placeholder="Add your reply... (Press Enter to submit)">`;
    card.innerHTML = html;
    wall.appendChild(card);
  });

  attachReplyListeners();
}

// ===== Attach Listeners =====
function attachReplyListeners() {
  whys.forEach((_, index) => {
    const replyInput = document.getElementById(`replyInput-${index}`);
    replyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addReply(index);
      }
    });
  });
}
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

  // ✅ Your real Firebase config
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

  // ✅ Random username for this visitor
  const username = "User" + Math.floor(Math.random() * 10000);

  // ✅ References
  const postsRef = ref(database, 'posts');
  const input = document.getElementById('whyInput');
  const wall = document.getElementById('wall');

  // ✅ Add post on Enter
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = input.value.trim();
      if (text) {
        push(postsRef, { text, user: username });
        input.value = '';
      }
    }
  });

  // ✅ Load posts in realtime
  onValue(postsRef, (snapshot) => {
    wall.innerHTML = '';
    snapshot.forEach(childSnapshot => {
      const post = childSnapshot.val();
      const p = document.createElement('p');
      p.textContent = `${post.user}: ${post.text}`;
      wall.appendChild(p);
    });
  });
</script>


// ===== Update Theme Button =====
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
