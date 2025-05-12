    const sprite1 = document.getElementById('sprite1');
    const sprite2 = document.getElementById('sprite2');
    const directionText = document.getElementById('directionText');
    const dialogueBox = document.getElementById('dialogueBox');
    const scene1 = document.getElementById('scene1');
    const circleGameContainer = document.getElementById('circleGameContainer');
    const scoreboard = document.getElementById('scoreboard');

    const sprite1Lines = [
      "Seriously... Seriously!",
      "How could I get my wand stolen again!",
      "I was being cautious too...",
      "Ugh, there's no use dwelling on it now.",
      "After all, I need to find out where it went.",
      "Where could it be—",
      "Oh god, did that little gremlin take it!?"
    ];

    const sprite2Lines = [
      "Why hello there, fellow cust—",
      "Oh, it's you...",
      "Hmmmm, are you here because of your wand?",
      "Why would I question such a thing?",
      "Of course you are!"
    ];

    let sprite1DialogueIndex = 0;
    let sprite2DialogueIndex = 0;
    let canMove = false;
    let keys = {};
    let moveBy = 5;

    const sprite = sprite1;

    function showDialogue(line) {
      dialogueBox.style.opacity = 0;
      setTimeout(() => {
        dialogueBox.innerHTML = line;
        dialogueBox.style.opacity = 1;

        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');

        if (yesBtn) {
          yesBtn.addEventListener('click', startCircleGame, { once: true });
        }

        if (noBtn) {
          noBtn.addEventListener('click', () => {
            showDialogue("Oh that's a bummer, why don't you come again next time.");
            sprite2.addEventListener('click', repeatPrompt, { once: true });
          }, { once: true });
        }
      }, 250);
    }

    function repeatPrompt() {
      showDialogue(`Oh, so do you want to play, <span id="yesBtn" style="color:yellow; text-decoration:underline; cursor:pointer;">Yes</span> or <span id="noBtn" style="color:yellow; text-decoration:underline; cursor:pointer;">No</span>?`);
    }

    sprite1.addEventListener('click', () => {
      if (sprite1DialogueIndex === 0) directionText.style.opacity = 0;
      if (sprite1DialogueIndex < sprite1Lines.length) {
        showDialogue(sprite1Lines[sprite1DialogueIndex++]);

        // Check for final line
        if (sprite1DialogueIndex === sprite1Lines.length) {
          setTimeout(() => {
            dialogueBox.style.opacity = 0;
            directionText.innerText = "Walk up to sprite 2.";
            directionText.style.opacity = 1;
            canMove = true;
          }, 3000);
        }
      }
    });

    sprite2.addEventListener('click', () => {
      if (!canMove) return;
      if (sprite2DialogueIndex === 0) directionText.style.opacity = 0;
      if (sprite2DialogueIndex < sprite2Lines.length) {
        showDialogue(sprite2Lines[sprite2DialogueIndex++]);
      } else {
        repeatPrompt();
      }
    });

    window.addEventListener('keydown', e => keys[e.key] = true);
    window.addEventListener('keyup', e => keys[e.key] = false);

    function move() {
      if (!canMove) return requestAnimationFrame(move);
      let left = parseInt(sprite.style.left) || 0;
      let top = parseInt(sprite.style.top) || 0;
      if (keys['ArrowLeft']) left -= moveBy;
      if (keys['ArrowRight']) left += moveBy;
      if (keys['ArrowUp']) top -= moveBy;
      if (keys['ArrowDown']) top += moveBy;
      sprite.style.left = left + 'px';
      sprite.style.top = top + 'px';
      requestAnimationFrame(move);
    }

    move();

    // Circle Game
    let score = 0;
    const winScore = 10;
    const maxCircles = 15;
    let circles = [];

    function updateScore() {
      scoreboard.textContent = `Score: ${score}`;
    }

    function createCircle(x = Math.random() * (window.innerWidth - 100), y = Math.random() * (window.innerHeight - 100)) {
      const div = document.createElement('div');
      div.className = 'circle';
      circleGameContainer.appendChild(div);
      const circle = { el: div, x, y, dy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1) };
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
      div.addEventListener('click', () => {
        if (div.classList.contains('fade-out')) return;
        score++; updateScore();
        div.classList.add('fade-out');
        setTimeout(() => {
          circleGameContainer.removeChild(div);
          circles = circles.filter(c => c.el !== div);
          if (score >= winScore) {
            showScene2();
            addHoverText();
            return;
          }
          createCircle(); createCircle();
          if (circles.length >= maxCircles) {
            alert("You lose! Too many circles!");
            resetGame();
          }
        }, 500);
      });
      circles.push(circle);
    }

    function moveCircles() {
      circles.forEach(circle => {
        circle.y += circle.dy;
        if (circle.y <= 0 || circle.y >= window.innerHeight - 100) circle.dy *= -1;
        circle.el.style.top = `${circle.y}px`;
      });
    }

    function animateCircles() {
      moveCircles();
      requestAnimationFrame(animateCircles);
    }

    function resetGame() {
      circles.forEach(c => circleGameContainer.removeChild(c.el));
      circles = [];
      score = 0;
      updateScore();
      createCircle(); createCircle(); createCircle();
    }

    function startCircleGame() {
      scene1.classList.add('fade-out');
      setTimeout(() => {
        scene1.style.display = 'none';
        circleGameContainer.style.display = 'block';
        scoreboard.style.display = 'block';
        resetGame();
        animateCircles();
      }, 800);
    }

    function showScene2() {
      scene1.style.display = 'none';
      circleGameContainer.style.display = 'none';
      scoreboard.style.display = 'none';
      document.getElementById('scene2').style.display = 'block';
      ['???', 'wand', 'apple'].forEach(id => {
        document.getElementById(id).style.display = 'block';
      });
    }

    function handleEnding(type) {
      const endingText = document.getElementById('endingText');
      const hoverText = document.getElementById('hoverText');
      ['???', 'wand', 'apple'].forEach(id => document.getElementById(id).style.display = 'none');
      hoverText.style.opacity = 0;
      if (type === '???') {
        endingText.innerHTML = "<strong>Neutral Ending</strong><br>Uh, you don't know what exactly this is, perhaps you can exchange it for a new wand?";
      } else if (type === 'apple') {
        endingText.innerHTML = "<strong>Bad Ending</strong><br>You died after eating the apple, did you never see Snow White?";
      } else if (type === 'wand') {
        endingText.innerHTML = "<strong>Good Ending</strong><br>Good job! You successfully got your wand back!";
      }
      endingText.style.opacity = 1;
    }

    function addHoverText() {
      const hoverText = document.getElementById('hoverText');
      ['???', 'wand', 'apple'].forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('mouseover', () => {
          hoverText.innerText = id === '???' ? '???' : id;
          hoverText.style.opacity = 1;
        });
        el.addEventListener('mouseout', () => hoverText.style.opacity = 0);
        el.addEventListener('click', () => handleEnding(id));
      });
    }
