// Neural Network-like Animation for AI
window.addEventListener('DOMContentLoaded', () => {
    // Typing effect for subtitle
    const typedEl = document.getElementById('typed');
    const phrases = ['I love learning new things', 'Small steps every day', 'Curious mind, big dreams', 'Future scientist & maker'];
    let pIndex = 0, charIndex = 0;

    function type() {
        const current = phrases[pIndex];
        if (charIndex <= current.length) {
            typedEl.textContent = current.slice(0, charIndex);
            charIndex++;
            setTimeout(type, 80);
        } else {
            setTimeout(erase, 1200);
        }
    }
    function erase() {
        const current = phrases[pIndex];
        if (charIndex > 0) {
            typedEl.textContent = current.slice(0, charIndex-1);
            charIndex--;
            setTimeout(erase, 40);
        } else {
            pIndex = (pIndex + 1) % phrases.length;
            setTimeout(type, 300);
        }
    }
    setTimeout(type, 600);

    // Parallax avatar tilt
    const avatar = document.getElementById('avatar');
    const profileCard = document.getElementById('profileCard');
    profileCard.addEventListener('mousemove', (e)=>{
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        const rx = (y/rect.height) * 12;
        const ry = (x/rect.width) * -12;
        avatar.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    profileCard.addEventListener('mouseleave', ()=>{ avatar.style.transform = '' });

    // Study goal CTA - removed prompt, now handled by modal

    function showToast(text){
        const t = document.createElement('div');
        t.className = 'toast'; t.textContent = text;
        Object.assign(t.style,{position:'fixed',right:'20px',bottom:'120px',background:'#0b3a6b',color:'#fff',padding:'10px 14px',borderRadius:'10px',boxShadow:'0 8px 30px rgba(2,6,23,0.3)',zIndex:1001});
        document.body.appendChild(t);
        setTimeout(()=>{ t.style.transition='opacity .6s'; t.style.opacity='0' },2600);
        setTimeout(()=>{ t.remove() },3300);
    }

    function launchConfetti(){
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        document.body.appendChild(confetti);
        const colours = ['#ff6b6b','#ffd93d','#6bf178','#4db7ff','#c77bff'];
        for(let i=0;i<40;i++){
            const el = document.createElement('span');
            el.style.background = colours[Math.floor(Math.random()*colours.length)];
            el.className = 'confetti-piece';
            confetti.appendChild(el);
            (function(a){
                a.style.left = Math.random()*100+'%';
                a.style.top = '-10%';
                a.style.transform = 'rotate('+Math.random()*360+'deg)';
                a.style.opacity = 1;
                a.style.transition = 'all 1.6s cubic-bezier(.2,.8,.2,1)';
                setTimeout(()=>{ a.style.top = 110 + Math.random()*20 + '%'; a.style.opacity=0 }, 20);
            })(el);
        }
        setTimeout(()=>{ confetti.remove() }, 2000);
    }

    function launchExplosion(){
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        document.querySelector('.study-modal-content').appendChild(explosion);
        for(let i=0;i<20;i++){
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = '50%';
            spark.style.top = '50%';
            spark.style.transform = `rotate(${i*18}deg) translateY(-50px)`;
            explosion.appendChild(spark);
        }
        setTimeout(()=>{ explosion.remove() }, 1000);
    }

    // Enhanced particle background (gentle glowing orbs)
    const canvas = document.createElement('canvas');
    canvas.id = 'ai-canvas';
    canvas.style.position = 'fixed';
    canvas.style.left = 0; canvas.style.top = 0; canvas.style.zIndex = 0; canvas.style.pointerEvents='none';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', resize); resize();

    class Orb{
        constructor(){ this.reset(true) }
        reset(init=false){
            this.r = 8 + Math.random()*28;
            this.x = Math.random()*canvas.width;
            this.y = Math.random()*canvas.height;
            this.vx = (Math.random()-0.5)*0.3;
            this.vy = (Math.random()-0.5)*0.3;
            this.h = 190 + Math.random()*80;
            this.a = 0.06 + Math.random()*0.12;
            if(!init){ this.x = Math.random()*canvas.width; this.y = Math.random()*canvas.height }
        }
        step(){
            this.x += this.vx; this.y += this.vy;
            if(this.x<-50||this.x>canvas.width+50||this.y<-50||this.y>canvas.height+50) this.reset();
        }
        draw(){
            const g = ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*4);
            g.addColorStop(0, `hsla(${this.h},80%,60%,${this.a})`);
            g.addColorStop(1, `hsla(${this.h},80%,60%,0)`);
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.x,this.y,this.r*2,0,Math.PI*2); ctx.fill();
        }
    }
    const orbs = Array.from({length:40}, ()=> new Orb());
    function loop(){ ctx.clearRect(0,0,canvas.width,canvas.height); for(const o of orbs){ o.step(); o.draw() } requestAnimationFrame(loop) }
    loop();

    // Knowledge network background canvas
    const know = document.createElement('canvas'); know.className='knowledge-canvas'; know.id='knowCanvas';
    document.body.appendChild(know); const kctx = know.getContext('2d');
    function resizeKnow(){ know.width = window.innerWidth; know.height = window.innerHeight }
    window.addEventListener('resize', resizeKnow); resizeKnow();
    const nodes = Array.from({length:28}, ()=>({x:Math.random()*know.width,y:Math.random()*know.height,vx:(Math.random()-0.5)*0.4,vy:(Math.random()-0.5)*0.4}));
    function drawKnowledge(){ kctx.clearRect(0,0,know.width,know.height);
        for(let i=0;i<nodes.length;i++){ const a=nodes[i]; a.x+=a.vx; a.y+=a.vy; if(a.x<0||a.x>know.width) a.vx*=-1; if(a.y<0||a.y>know.height) a.vy*=-1;
            kctx.beginPath(); kctx.fillStyle='rgba(255,255,255,0.04)'; kctx.arc(a.x,a.y,2.5,0,Math.PI*2); kctx.fill();
            for(let j=i+1;j<nodes.length;j++){ const b=nodes[j]; const dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy); if(d<160){ kctx.strokeStyle='rgba(150,200,255,'+(1-d/160)*0.12+')'; kctx.lineWidth=1; kctx.beginPath(); kctx.moveTo(a.x,a.y); kctx.lineTo(b.x,b.y); kctx.stroke(); } }
        }
        requestAnimationFrame(drawKnowledge);
    }
    drawKnowledge();
});

// Additional science/computer themed animations
(function(){
    // Binary rain canvas (small panel)
    const binCanvas = document.createElement('canvas');
    binCanvas.className = 'binary-canvas';
    binCanvas.id = 'binaryCanvas';
    document.body.appendChild(binCanvas);
    const bctx = binCanvas.getContext('2d');
    function resizeBin(){ binCanvas.width = 260; binCanvas.height = 300 }
    resizeBin();

    const columns = 26; const fontSize = 12; const drops = Array(columns).fill(1);
    function drawBinary(){
        bctx.fillStyle='rgba(0,0,0,0.18)'; bctx.fillRect(0,0,binCanvas.width,binCanvas.height);
        bctx.fillStyle='#00ff88'; bctx.font = fontSize+'px monospace';
        for(let i=0;i<drops.length;i++){
            const text = Math.random()>0.6 ? '1' : '0';
            const x = i*fontSize; const y = drops[i]*fontSize;
            bctx.fillText(text, x, y);
            if(y>binCanvas.height && Math.random()>0.975) drops[i]=0;
            drops[i]++;
        }
        requestAnimationFrame(drawBinary);
    }
    drawBinary();

    // Atom orbit canvas (small circular canvas)
    const atomCanvas = document.createElement('canvas');
    atomCanvas.className = 'atom-canvas'; atomCanvas.id='atomCanvas';
    document.body.appendChild(atomCanvas);
    const actx = atomCanvas.getContext('2d');
    function resizeAtom(){ atomCanvas.width = 220; atomCanvas.height = 220 }
    resizeAtom();
    let t=0;
    function drawAtom(){
        actx.clearRect(0,0,atomCanvas.width,atomCanvas.height);
        const cx = atomCanvas.width/2, cy = atomCanvas.height/2;
        // nucleus
        actx.beginPath(); actx.fillStyle='#ffd54a'; actx.arc(cx,cy,8,0,Math.PI*2); actx.fill();
        // electrons
        const orbits = [36,58,84];
        for(let i=0;i<orbits.length;i++){
            const r=orbits[i];
            actx.beginPath(); actx.strokeStyle='rgba(255,255,255,0.08)'; actx.arc(cx,cy,r,0,Math.PI*2); actx.stroke();
            const ang = t*0.02*(i%2?1:-1) + i;
            const ex = cx + Math.cos(ang)*r; const ey = cy + Math.sin(ang)*r;
            actx.beginPath(); actx.fillStyle=['#8bc34a','#4db6ac','#4fc3f7'][i%3]; actx.arc(ex,ey,6,0,Math.PI*2); actx.fill();
        }
        t+=1; requestAnimationFrame(drawAtom);
    }
    drawAtom();

    // Thumbnails interaction
    const thumbs = document.getElementById('thumbs');
    if(thumbs){
        thumbs.addEventListener('click', (e)=>{
            const img = e.target.closest('img');
            if(!img) return;
            // quick pulse effect
            img.style.transform = 'scale(1.18)'; img.style.boxShadow='0 30px 60px rgba(10,36,86,0.28)';
            setTimeout(()=>{ img.style.transform=''; img.style.boxShadow=''}, 600);
        });
    }
})();

// Math Sprint game and Log Match
(function(){
    // create a richer game modal with difficulty control and non-repeating pool
    const gameModal = document.createElement('div'); gameModal.className='study-modal'; gameModal.id='gameModal'; gameModal.setAttribute('aria-hidden','true');
    gameModal.innerHTML = `
        <div class="study-modal-content">
            <button id="game-close" class="study-close">✕</button>
            <h3>Math Sprint</h3>
            <p>Solve as many quick problems as you can in the selected time.</p>
            <div id="game-area">
                <div class="game-controls-row">
                    <label class="label-bold">Difficulty:</label>
                    <select id="game-diff"><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option></select>
                    <label class="label-bold">Time (s):</label>
                    <input id="game-time" type="number" min="10" max="300" value="60" class="small-input">
                </div>
                <div id="game-timer" class="timer-display">60</div>
                <div id="game-question" class="game-question"></div>
                <input id="game-answer" type="number" placeholder="Your answer">
                <div class="game-action-row"><button id="game-start" class="cta">Start</button><button id="game-submit" class="cta secondary">Submit</button></div>
                <div id="game-score" class="game-score">Score: 0</div>
            </div>
        </div>`;
    document.body.appendChild(gameModal);

    const playBtn = document.getElementById('play-game-btn');
    const logMatchBtn = document.getElementById('log-match-btn');
    playBtn.addEventListener('click', ()=>{ gameModal.setAttribute('aria-hidden','false'); });
    gameModal.querySelector('#game-close').addEventListener('click', ()=>{ gameModal.setAttribute('aria-hidden','true'); });

    let gameTimer=null, timeLeft=60, score=0;
    const qEl = gameModal.querySelector('#game-question'); const aEl = gameModal.querySelector('#game-answer'); const tEl = gameModal.querySelector('#game-timer'); const scoreEl = gameModal.querySelector('#game-score');

    // Question pool management to avoid repeats (persist seen IDs per day)
    let questionPool = [], poolIndex = 0;
    const SEEN_KEY = 'math_seen_' + new Date().toISOString().slice(0,10); // daily key
    let seenToday = new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]'));
    function buildPool(diff){
        const pool = [];
        const maxA = diff==='easy'?8: diff==='medium'?12: 20;
        const maxB = diff==='easy'?8: diff==='medium'?12: 12;
        for(let a=1;a<=maxA;a++){
            for(let b=1;b<=maxB;b++){
                const id = `mul_${a}x${b}`;
                pool.push({id, q:`${a} × ${b}`, ans: a*b});
            }
        }
        // for hard, add two-digit addition/subtraction variants
        if(diff==='hard'){
            for(let a=10;a<30;a++){ const b=Math.floor(Math.random()*20)+5; pool.push({q:`${a} + ${b}`, ans: a+b}); }
        }
    // shuffle
    for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]] }
        return pool;
    }

    function newQuestion(){
        if(poolIndex >= questionPool.length){ // refill
            const diff = gameModal.querySelector('#game-diff').value;
            questionPool = buildPool(diff);
            poolIndex = 0;
        }
        // skip items already seen today (avoid repeats across sessions)
        let tries = 0;
        while(poolIndex < questionPool.length && seenToday.has(questionPool[poolIndex].id) && tries < questionPool.length){ poolIndex++; tries++; }
        if(poolIndex >= questionPool.length){ // no unseen questions left -> reshuffle and reset seen set to allow replay
            seenToday = new Set(); localStorage.setItem(SEEN_KEY, JSON.stringify([]));
            questionPool = buildPool(gameModal.querySelector('#game-diff').value);
            poolIndex = 0;
        }
        const item = questionPool[poolIndex++];
        qEl.textContent = item.q + ' = ?';
        qEl.dataset.ans = item.ans;
        qEl.dataset.qid = item.id || '';
        aEl.value=''; aEl.focus();
    }

    function startGame(){
        score=0; const total = parseInt(gameModal.querySelector('#game-time').value,10) || 60; timeLeft = total; scoreEl.textContent='Score: 0'; tEl.textContent = timeLeft;
        // build pool according to selected difficulty
        questionPool = buildPool(gameModal.querySelector('#game-diff').value);
        poolIndex = 0;
        newQuestion();
        if(gameTimer) clearInterval(gameTimer);
        gameTimer = setInterval(()=>{ timeLeft--; tEl.textContent = timeLeft; if(timeLeft<=0){ clearInterval(gameTimer); endGame(); } },1000);
    }

    function submitAnswer(){ const v = parseInt(aEl.value,10); const ans = parseInt(qEl.dataset.ans,10); if(!Number.isFinite(v)) { aEl.focus(); return; }
        if(v===ans){ score++; scoreEl.textContent='Score: '+score;
            // mark seen
            const qid = qEl.dataset.qid; if(qid){ seenToday.add(qid); localStorage.setItem(SEEN_KEY, JSON.stringify(Array.from(seenToday))); }
            // award XP for correct answer
            awardXP(5);
            newQuestion();
        } else { // show correct then next
            // briefly show correct answer, then move on
            const correct = ans; qEl.textContent = `${qEl.textContent} → Correct: ${correct}`;
            setTimeout(()=> newQuestion(), 700);
        }
    }

    function endGame(){ showToast('Sprint over! Score: '+score); launchConfetti(); const current = parseInt(document.getElementById('p-math').textContent,10)||0; document.getElementById('p-math').textContent = current + score; gameModal.setAttribute('aria-hidden','true'); }

    gameModal.querySelector('#game-start').addEventListener('click', startGame);
    gameModal.querySelector('#game-submit').addEventListener('click', submitAnswer);
    aEl.addEventListener('keydown', (e)=>{ if(e.key==='Enter') submitAnswer(); });

    // Log Match increments Matches Played stat
    logMatchBtn.addEventListener('click', ()=>{
        const cur = parseInt(document.getElementById('p-sports').textContent,10)||0; document.getElementById('p-sports').textContent = cur + 1; showToast('Nice! Match logged.');
    });
})();

// XP, levels and daily quest UI
(function(){
    const XP_KEY = 'player_xp'; const LEVEL_KEY = 'player_level';
    function getXP(){ return parseInt(localStorage.getItem(XP_KEY)||'0',10); }
    function setXP(v){ localStorage.setItem(XP_KEY, String(v)); }
    function getLevel(){ return parseInt(localStorage.getItem(LEVEL_KEY)||'1',10); }
    function setLevel(v){ localStorage.setItem(LEVEL_KEY, String(v)); }

    function xpToNext(level){ return 50 + (level-1)*50; }
    function updateXPUI(){ const xp = getXP(); const lvl = getLevel(); const need = xpToNext(lvl); const pct = Math.min(100, Math.floor((xp/need)*100)); document.getElementById('xp-bar').style.width = pct + '%'; document.getElementById('xp-points').textContent = `${xp} XP`; document.getElementById('xp-level').textContent = `Level ${lvl}`; }

    window.awardXP = function(amount){ const cur = getXP() + amount; setXP(cur); // level up if reached
        let lvl = getLevel(); let need = xpToNext(lvl);
        while(cur >= need){ lvl++; setLevel(lvl); // celebrate
            const badge = document.createElement('div'); badge.className='badge spin'; badge.textContent='🏅'; document.body.appendChild(badge); setTimeout(()=> badge.remove(),1200);
            need = xpToNext(lvl);
        }
        updateXPUI();
    };

    // show daily quest popup
    function showDailyQuest(){
        const existing = document.getElementById('questPopup'); if(existing) return;
        const popup = document.createElement('div'); popup.className='quest-popup'; popup.id='questPopup';
        popup.innerHTML = `<h4>Today's Quest</h4><div>Solve 3 Math Puzzles &amp; Earn 50 XP</div><div class="quest-cta"><button id="claimQuest" class="cta">Start Quest</button><button id="dismissQuest" class="cta secondary">Later</button></div>`;
        document.body.appendChild(popup);
        popup.querySelector('#claimQuest').addEventListener('click', ()=>{ document.getElementById('play-game-btn').click(); popup.remove(); });
        popup.querySelector('#dismissQuest').addEventListener('click', ()=>{ popup.remove(); });
    }

    // initialize
    if(!localStorage.getItem(XP_KEY)) setXP(0);
    if(!localStorage.getItem(LEVEL_KEY)) setLevel(1);
    updateXPUI();
    // show daily quest once per day
    const questSeenKey = 'quest_shown_' + new Date().toISOString().slice(0,10);
    if(!localStorage.getItem(questSeenKey)) { showDailyQuest(); localStorage.setItem(questSeenKey, '1'); }
})();

// Lightbox handlers
(function(){
    const photoBtn = document.querySelector('.profile-card .photo');
    const lightbox = document.getElementById('lightbox');
    const lbClose = document.getElementById('lightbox-close');
    const lbImg = document.getElementById('lightbox-img');
    if(photoBtn && lightbox){
        photoBtn.addEventListener('click', ()=>{ lightbox.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden' });
        photoBtn.addEventListener('keydown', (e)=>{ if(e.key==='Enter') lightbox.setAttribute('aria-hidden','false') });
        lbClose.addEventListener('click', ()=>{ lightbox.setAttribute('aria-hidden','true'); document.body.style.overflow='' });
        lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) { lightbox.setAttribute('aria-hidden','true'); document.body.style.overflow='' } });
    }
})();

// Study modal and timer logic
(function(){
    const studyModal = document.getElementById('studyModal');
    const studyClose = document.getElementById('study-close');
    const startBtn = document.getElementById('start-study');
    const cancelBtn = document.getElementById('cancel-study');
    const goalInput = document.getElementById('study-goal');
    const minsInput = document.getElementById('study-mins');
    const timerWrap = document.getElementById('study-timer');
    const timerDisplay = document.querySelector('.timer-display');
    const timerBar = document.querySelector('.timer-bar');
    const pauseBtn = document.getElementById('pause-study');
    const stopBtn = document.getElementById('stop-study');
    const followBtn = document.getElementById('follow-btn');

    function openStudy(){ 
        studyModal.setAttribute('aria-hidden','false'); 
        // Generate mini-game question
        const a = Math.floor(Math.random()*10)+1, b = Math.floor(Math.random()*10)+1;
        document.getElementById('math-question').textContent = `${a} + ${b} = ?`;
        document.getElementById('math-question').dataset.answer = a + b;
        document.getElementById('math-answer').value = '';
        document.getElementById('math-feedback').textContent = '';
        startBtn.disabled = true;
        // Start particle animations
        startModalParticles();
    }
    function closeStudy(){ 
        studyModal.setAttribute('aria-hidden','true'); 
        timerWrap.setAttribute('aria-hidden','true'); 
        stopModalParticles();
    }

    // attach open handler to the CTA
    followBtn.addEventListener('click', (e)=>{ e.preventDefault(); openStudy(); });
    studyClose.addEventListener('click', closeStudy);
    cancelBtn.addEventListener('click', closeStudy);

    // Mini-game check
    document.getElementById('check-math').addEventListener('click', ()=>{
        const ans = parseInt(document.getElementById('math-answer').value,10);
        const correct = parseInt(document.getElementById('math-question').dataset.answer,10);
        if(ans === correct){
            document.getElementById('math-feedback').textContent = 'Correct! Ready to study.';
            document.getElementById('math-feedback').style.color = '#4caf50';
            startBtn.disabled = false;
            // Marvel-like explosion effect
            launchExplosion();
        } else {
            document.getElementById('math-feedback').textContent = 'Try again!';
            document.getElementById('math-feedback').style.color = '#f44336';
        }
    });

    // Drawing canvas
    const canvas = document.getElementById('drawing-canvas');
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    let drawing = false;
    canvas.addEventListener('mousedown', ()=>{ drawing = true; });
    canvas.addEventListener('mouseup', ()=>{ drawing = false; ctx.beginPath(); });
    canvas.addEventListener('mousemove', (e)=>{
        if(!drawing) return;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    });
    document.getElementById('clear-canvas').addEventListener('click', ()=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
    });

    // Modal particles (crickets and math symbols)
    let particles = [];
    function startModalParticles(){
        const modalContent = document.querySelector('.study-modal-content');
        for(let i=0;i<10;i++){
            const p = document.createElement('div');
            p.className = 'modal-particle';
            p.textContent = Math.random()>0.5 ? '🐜' : '✖️'; // cricket or math symbol
            p.style.left = Math.random()*100 + '%';
            p.style.top = Math.random()*100 + '%';
            modalContent.appendChild(p);
            particles.push(p);
        }
        function animate(){
            particles.forEach(p=>{
                const y = parseFloat(p.style.top);
                p.style.top = (y + 0.5) % 100 + '%';
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
    function stopModalParticles(){
        particles.forEach(p=>p.remove());
        particles = [];
    }

    // Timer state
    let totalSeconds=0, remaining=0, timerId=null, paused=false;

    function formatTime(s){ const m=Math.floor(s/60); const sec=s%60; return (m<10?'0'+m:m)+':'+(sec<10?'0'+sec:sec) }

    startBtn.addEventListener('click', ()=>{
        const mins = parseInt(minsInput.value,10) || 25; totalSeconds = mins*60; remaining = totalSeconds;
        timerWrap.setAttribute('aria-hidden','false'); timerDisplay.textContent = formatTime(remaining);
        timerBar.style.width = '0%';
        if(timerId) clearInterval(timerId);
        paused = false;
        timerId = setInterval(()=>{
            if(!paused){ remaining--; const pct = Math.max(0, (1 - remaining/totalSeconds)*100); timerBar.style.width = pct+'%'; timerDisplay.textContent = formatTime(remaining); }
            if(remaining<=0){ clearInterval(timerId); timerComplete(); }
        },1000);
        // persist today's start to localStorage for streak checks
        localStorage.setItem('study_last_start', new Date().toISOString());
    });

    pauseBtn.addEventListener('click', ()=>{ paused = !paused; pauseBtn.textContent = paused? 'Resume' : 'Pause' });
    stopBtn.addEventListener('click', ()=>{ if(timerId) clearInterval(timerId); timerWrap.setAttribute('aria-hidden','true'); });

    function timerComplete(){
        timerWrap.setAttribute('aria-hidden','true');
        showToast('Great job! Study session complete.');
        launchConfetti();
        // increment streak and math problems as small reward
        const streak = updateStreak(); document.getElementById('p-streak').textContent = streak;
        // small math reward
        const current = parseInt(document.getElementById('p-math').textContent,10) || 0; document.getElementById('p-math').textContent = current + 5;
    }

    function updateStreak(){
        const last = localStorage.getItem('study_streak_last'); const today = new Date().toISOString().slice(0,10);
        let streak = parseInt(localStorage.getItem('study_streak')||'0',10);
        if(last === today) return streak; // already counted today
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
        if(last === yesterday) streak = streak + 1; else streak = 1;
        localStorage.setItem('study_streak', streak.toString()); localStorage.setItem('study_streak_last', today);
        return streak;
    }

    // initialize displayed streak if present
    const storedStreak = parseInt(localStorage.getItem('study_streak')||'0',10); if(storedStreak) document.getElementById('p-streak').textContent = storedStreak;
})();

// Role-specific animations and scroll activation
(function(){
    const roles = document.querySelectorAll('.role');
    function isVisible(el){ const r=el.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0 }

    // create canvases inside role visuals
    roles.forEach(role=>{
        const visual = role.querySelector('.role-visual');
        const canvas = document.createElement('canvas');
        canvas.width = visual.clientWidth; canvas.height = visual.clientHeight;
        visual.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        role._canvas = canvas; role._ctx = ctx;
    });

    // ECG waveform for doctor
    function drawECG(ctx,w,h,t){ ctx.clearRect(0,0,w,h); ctx.strokeStyle='#ff6b6b'; ctx.lineWidth=2; ctx.beginPath();
        for(let x=0;x<w;x++){ const y = h/2 + Math.sin((x+t*2)/12)*6 + (Math.sin((x+t*6)/6)>0.95? -24:0); if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y) }
        ctx.stroke(); }

    // gears for engineer
    function drawGears(ctx,w,h,t){ ctx.clearRect(0,0,w,h); const cx=w/2,cy=h/2; ctx.fillStyle='#8aa6ff';
        for(let i=0;i<3;i++){ const r=18+ i*8; const ang = t*0.02*(i%2?1:-1); ctx.save(); ctx.translate(cx + (i-1)*28,cy); ctx.rotate(ang);
            ctx.beginPath(); for(let p=0;p<12;p++){ const a = (p/12)*Math.PI*2; const rr = r + (p%2?4:0); const x=Math.cos(a)*rr, y=Math.sin(a)*rr; p==0?ctx.moveTo(x,y):ctx.lineTo(x,y) } ctx.closePath(); ctx.fill(); ctx.restore() }
    }

    let tt=0; function animateRoles(){
        roles.forEach(role=>{
            const canvas = role._canvas; const ctx = role._ctx; if(!canvas) return; const w=canvas.width, h=canvas.height; canvas.width=w; canvas.height=h;
            if(isVisible(role)){
                if(role.dataset.role==='doctor') drawECG(ctx,w,h,tt);
                if(role.dataset.role==='engineer') drawGears(ctx,w,h,tt);
                if(role.dataset.role==='science'){
                    // small atom loop in role visual
                    ctx.clearRect(0,0,w,h); const cx=w/2,cy=h/2; ctx.fillStyle='#ffd54a'; ctx.beginPath(); ctx.arc(cx,cy,6,0,Math.PI*2); ctx.fill();
                    for(let i=0;i<2;i++){ ctx.beginPath(); ctx.strokeStyle='rgba(255,255,255,0.26)'; ctx.arc(cx,cy,20+ i*12, (tt*0.02*i)%Math.PI, (Math.PI*2)); ctx.stroke() }
                }
                if(role.dataset.role==='computer'){
                    // code-brackets float (non-binary visual)
                    ctx.fillStyle='rgba(0,0,0,0.02)'; ctx.fillRect(0,0,w,h);
                    ctx.font='20px monospace'; ctx.fillStyle='#7ef3ff';
                    for(let i=0;i<6;i++){
                        const sx = (tt*3 + i*40) % (w + 80) - 40;
                        const sy = 20 + ((i*31) % (h-30));
                        ctx.globalAlpha = 0.6 - (i*0.08);
                        ctx.fillText(i%2?'< />':'{ }', sx, sy);
                        ctx.globalAlpha = 1;
                    }
                }
            }
        });
        tt++; requestAnimationFrame(animateRoles);
    }
    animateRoles();
    window.addEventListener('resize', ()=>{ roles.forEach(r=>{ const c=r._canvas; if(c){ c.width = r.querySelector('.role-visual').clientWidth; c.height = r.querySelector('.role-visual').clientHeight } }) });
})();
