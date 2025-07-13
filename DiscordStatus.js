    document.addEventListener('DOMContentLoaded', () => {
      // --- Canvas Setup ---
      const canvas = document.getElementById('space-canvas');
      const ctx = canvas.getContext('2d');
      let stars = [], blackHole, nebulas = [], saturn, earth;
      let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

      function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        blackHole = { x: canvas.width / 2, y: canvas.height / 2, radius: 40, angle: 0 };
        saturn = { x: canvas.width * 0.15, y: canvas.height * 0.2, radius: 30, parallax: 0.08 };
        earth = { x: canvas.width * 0.85, y: canvas.height * 0.8, radius: 25, parallax: 0.06 };

        stars = [];
        const starCount = window.innerWidth > 768 ? 600 : 300;
        for (let i = 0; i < starCount; i++) {
            stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 1.5, alpha: Math.random() * 0.5 + 0.5, twinkle: Math.random() * 0.02, parallax: Math.random() * 0.05 + 0.01 });
        }
        
        nebulas = [];
        for(let i = 0; i < 3; i++) {
            nebulas.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, radius: Math.random() * 200 + 150, color: `rgba(${100 + Math.random() * 50}, ${50 + Math.random() * 50}, ${150 + Math.random() * 50}, 0.15)`, speedX: (Math.random() - 0.5) * 0.1, speedY: (Math.random() - 0.5) * 0.1 });
        }
      }

      function drawSaturn(x, y) {
        ctx.save();
        ctx.translate(x, y);
        // Rings
        ctx.strokeStyle = 'rgba(210, 180, 140, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(0, 0, saturn.radius * 2.2, saturn.radius * 0.8, -0.4, 0, Math.PI * 2);
        ctx.stroke();
        // Planet
        ctx.fillStyle = '#E3B971';
        ctx.beginPath();
        ctx.arc(0, 0, saturn.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function drawEarth(x, y) {
        ctx.save();
        ctx.translate(x, y);
        // Atmosphere glow
        const glow = ctx.createRadialGradient(0, 0, earth.radius, 0, 0, earth.radius * 1.5);
        glow.addColorStop(0, 'rgba(100, 150, 255, 0.3)');
        glow.addColorStop(1, 'rgba(100, 150, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, earth.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        // Planet
        ctx.fillStyle = '#4D94DB';
        ctx.beginPath();
        ctx.arc(0, 0, earth.radius, 0, Math.PI * 2);
        ctx.fill();
        // Simple clouds
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-5, -10, 20, 8, 0.5, 0, Math.PI * 2);
        ctx.ellipse(10, 5, 18, 6, -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const parallaxX = (mouse.x - canvas.width / 2);
        const parallaxY = (mouse.y - canvas.height / 2);

        nebulas.forEach(n => { n.x += n.speedX; n.y += n.speedY; if(n.x+n.radius<0) n.x=canvas.width+n.radius; if(n.x-n.radius>canvas.width) n.x=-n.radius; if(n.y+n.radius<0) n.y=canvas.height+n.radius; if(n.y-n.radius>canvas.height) n.y=-n.radius; const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.radius); g.addColorStop(0,n.color); g.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height); });
        stars.forEach(s => { const sx=s.x+parallaxX*s.parallax; const sy=s.y+parallaxY*s.parallax; s.alpha+=s.twinkle; if(s.alpha>1||s.alpha<0.5) s.twinkle=-s.twinkle; ctx.globalAlpha=s.alpha; ctx.fillStyle='white'; ctx.beginPath(); ctx.arc(sx,sy,s.radius,0,Math.PI*2); ctx.fill(); });
        ctx.globalAlpha = 1;

        drawSaturn(saturn.x + parallaxX * saturn.parallax, saturn.y + parallaxY * saturn.parallax);
        drawEarth(earth.x + parallaxX * earth.parallax, earth.y + parallaxY * earth.parallax);

        const bhX = blackHole.x + parallaxX * 0.05; const bhY = blackHole.y + parallaxY * 0.05;
        ctx.save(); ctx.translate(bhX, bhY);
        ctx.fillStyle='black'; ctx.beginPath(); ctx.arc(0,0,blackHole.radius,0,Math.PI*2); ctx.fill();
        ctx.rotate(blackHole.angle); const dG=ctx.createLinearGradient(-blackHole.radius*2.5,0,blackHole.radius*2.5,0); dG.addColorStop(0,'rgba(255,200,0,0.8)'); dG.addColorStop(0.5,'rgba(160,60,255,0.9)'); dG.addColorStop(1,'rgba(255,200,0,0.8)');
        ctx.strokeStyle=dG; ctx.lineWidth=3; ctx.shadowColor='rgba(160,60,255,0.7)'; ctx.shadowBlur=15;
        ctx.beginPath(); ctx.ellipse(0,0,blackHole.radius*2,blackHole.radius*0.7,0,0,Math.PI*2); ctx.stroke();
        ctx.lineWidth=1.5; ctx.shadowBlur=5; ctx.beginPath(); ctx.ellipse(0,0,blackHole.radius*1.5,blackHole.radius*0.5,0,0,Math.PI*2); ctx.stroke();
        ctx.restore(); blackHole.angle += 0.003;

        requestAnimationFrame(draw);
      }

      window.addEventListener('resize', init);
      window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
      init();
      draw();

      // --- FAB Menu Logic ---
      const fabContainer = document.getElementById('fab-container');
      const fabToggle = document.getElementById('fab-toggle');
      fabToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling to the window
        fabContainer.classList.toggle('active');
      });
      // Close menu when clicking outside
      window.addEventListener('click', () => {
        if (fabContainer.classList.contains('active')) {
            fabContainer.classList.remove('active');
        }
      });


      // --- Discord Status Checker ---
      async function checkDiscordStatus() {
        const userId = '1146057264969556018';
        const statusElement = document.getElementById('discord-status');
        try {
          const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
          const data = await response.json();
          if (data.success) {
            const statusMap = { online:{t:'Online',c:'online'}, idle:{t:'Idle',c:'idle'}, dnd:{t:'Do Not Disturb',c:'dnd'}, offline:{t:'Offline',c:'offline'} };
            const s = statusMap[data.data.discord_status] || {t:'Unknown',c:'checking'};
            statusElement.textContent = s.t; statusElement.className = s.c;
          } else { statusElement.textContent='API Error'; statusElement.className='offline'; }
        } catch (error) { console.error('Error:',error); statusElement.textContent='Connection Error'; statusElement.className='offline'; }
      }
      checkDiscordStatus();
      setInterval(checkDiscordStatus, 30000);
    });