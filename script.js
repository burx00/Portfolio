(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-triggered reveal for sections/cards
  var revealEls = document.querySelectorAll('.reveal, .reveal-card');
  if(!reduceMotion && 'IntersectionObserver' in window){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function(el){ observer.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  }

  if(reduceMotion) return;

  // 3D tilt + cursor spotlight on focus/project cards (skip on touch devices)
  var hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if(hasFinePointer){
    var tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(function(card){
      var rafId = null;

      card.addEventListener('mousemove', function(e){
        var rect = card.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width;
        var py = (e.clientY - rect.top) / rect.height;
        var rotateY = (px - 0.5) * 12;
        var rotateX = (0.5 - py) * 12;

        if(rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(function(){
          card.classList.add('is-tilting');
          card.style.transform = 'perspective(900px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-6px)';
          card.style.setProperty('--mx', (px * 100) + '%');
          card.style.setProperty('--my', (py * 100) + '%');
        });
      });

      card.addEventListener('mouseleave', function(){
        if(rafId) cancelAnimationFrame(rafId);
        card.classList.remove('is-tilting');
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // Mouse parallax on the background glow orbs
  var orb1 = document.querySelector('.orb-1');
  var orb2 = document.querySelector('.orb-2');
  var mouseX = 0, mouseY = 0;
  var curX1 = 0, curY1 = 0, curX2 = 0, curY2 = 0;

  window.addEventListener('mousemove', function(e){
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  function animateOrbs(){
    curX1 += (mouseX * 50 - curX1) * 0.04;
    curY1 += (mouseY * 50 - curY1) * 0.04;
    curX2 += (mouseX * -40 - curX2) * 0.04;
    curY2 += (mouseY * -40 - curY2) * 0.04;
    if(orb1) orb1.style.transform = 'translate(' + curX1 + 'px, ' + curY1 + 'px)';
    if(orb2) orb2.style.transform = 'translate(' + curX2 + 'px, ' + curY2 + 'px)';
    requestAnimationFrame(animateOrbs);
  }
  requestAnimationFrame(animateOrbs);

  // Scroll parallax: background grid drifts slower than scroll,
  // hero content fades and lifts as it leaves the viewport
  var gridBg = document.querySelector('.grid-bg');
  var heroEl = document.querySelector('header.hero');
  var ticking = false;

  function onScroll(){
    var y = window.scrollY;
    if(gridBg) gridBg.style.transform = 'translateY(' + (y * 0.15) + 'px)';
    if(heroEl){
      var fadeRange = window.innerHeight * 0.75;
      var progress = Math.min(y / fadeRange, 1);
      heroEl.style.transform = 'translateY(' + (y * 0.25) + 'px)';
      heroEl.style.opacity = String(1 - progress);
    }
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  });
})();