const toggle=document.getElementById('navToggle');
  const links=document.getElementById('navLinks');
  const backToTop=document.getElementById('backToTop');
  const progress=document.getElementById('readingProgress');
  const topbar=document.querySelector('.topbar');
  const portraitWrap=document.querySelector('.portrait-wrap');
  const quickFacts=document.querySelector('.quickfacts');
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent=new Date().getFullYear();

  function closeMenu(){
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','মেনু খুলুন');
  }

  toggle.addEventListener('click',()=>{
    const isOpen=toggle.getAttribute('aria-expanded')!=='true';
    toggle.setAttribute('aria-expanded',String(isOpen));
    toggle.setAttribute('aria-label',isOpen?'মেনু বন্ধ করুন':'মেনু খুলুন');
    links.classList.toggle('open',isOpen);
  });
  links.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click',event=>{
    if(window.innerWidth<=800&&toggle.getAttribute('aria-expanded')==='true'
      &&!links.contains(event.target)&&!toggle.contains(event.target))closeMenu();
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>800)closeMenu();});

  let scrollFrame;
  function updateScrollControls(){
    const scrollable=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=`${scrollable>0?Math.min(100,(window.scrollY/scrollable)*100):0}%`;
    backToTop.classList.toggle('visible',window.scrollY>560);
    const portraitHasReachedNav=portraitWrap.getBoundingClientRect().top<=topbar.offsetHeight+24;
    topbar.classList.toggle('has-portrait',portraitHasReachedNav);
    portraitWrap.classList.toggle('is-in-nav',portraitHasReachedNav);
    scrollFrame=undefined;
  }
  window.addEventListener('scroll',()=>{
    if(scrollFrame===undefined)scrollFrame=window.requestAnimationFrame(updateScrollControls);
  },{passive:true});
  backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));
  updateScrollControls();

  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches&&!reduceMotion){
    const facts=[...quickFacts.querySelectorAll('.fact')];
    const resetFactPositions=()=>{
      quickFacts.classList.remove('is-pointer-active');
      facts.forEach(fact=>{fact.style.top='0px';fact.style.left='0px';});
    };
    quickFacts.addEventListener('pointermove',event=>{
      if(event.pointerType!=='mouse')return;
      quickFacts.classList.add('is-pointer-active');
      facts.forEach(fact=>{
        const bounds=fact.getBoundingClientRect();
        const dx=bounds.left+bounds.width/2-event.clientX;
        const dy=bounds.top+bounds.height/2-event.clientY;
        const distance=Math.hypot(dx,dy);
        const radius=210;
        if(distance>=radius){
          fact.style.top='0px';
          fact.style.left='0px';
          return;
        }
        const strength=(1-distance/radius)*14;
        const directionX=distance===0?0:dx/distance;
        const directionY=distance===0?1:dy/distance;
        fact.style.left=`${(directionX*strength).toFixed(1)}px`;
        fact.style.top=`${(directionY*strength).toFixed(1)}px`;
      });
    });
    quickFacts.addEventListener('pointerleave',resetFactPositions);
  }

  if('IntersectionObserver'in window&&!reduceMotion){
    document.documentElement.classList.add('js-ready');
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -36px 0px'});
    document.querySelectorAll('main .section-head,main .card,main .item,main .fact').forEach(element=>{
      const siblings=[...element.parentElement.children].filter(sibling=>sibling.matches('.card,.item,.fact'));
      element.style.setProperty('--reveal-delay',`${Math.min(siblings.indexOf(element),5)*65}ms`);
      element.classList.add('reveal');
      revealObserver.observe(element);
    });

    const sectionObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          links.querySelectorAll('a').forEach(link=>{
            if(link.hash===`#${entry.target.id}`)link.setAttribute('aria-current','location');
            else link.removeAttribute('aria-current');
          });
        }
      });
    },{rootMargin:'-20% 0px -65% 0px',threshold:0});
    document.querySelectorAll('main section[id]').forEach(section=>sectionObserver.observe(section));

    const typingHeading=document.querySelector('.typing-heading');
    const typingLines=[...document.querySelectorAll('.typing-line')];
    if(typingHeading&&typingLines.length){
      const typingTargets=[typingHeading,...typingLines].map(element=>{
        const textElement=element.querySelector('span');
        return {element,textElement,fullText:textElement.textContent};
      });
      const typingTimers=[];
      const typingObserver=new IntersectionObserver(entries=>{
        if(!entries.some(entry=>entry.isIntersecting))return;
        typingObserver.disconnect();
        const typeTarget=targetIndex=>{
          if(targetIndex>=typingTargets.length)return;
          const {textElement,fullText}=typingTargets[targetIndex];
          const graphemes=window.Intl&&Intl.Segmenter
            ?[...new Intl.Segmenter('bn',{granularity:'grapheme'}).segment(fullText)].map(part=>part.segment)
            :Array.from(fullText);
          textElement.textContent='';
          let currentIndex=0;
          const typingTimer=window.setInterval(()=>{
            textElement.textContent+=graphemes[currentIndex];
            currentIndex+=1;
            if(currentIndex===graphemes.length){
              window.clearInterval(typingTimer);
              typingTimers.push(window.setTimeout(()=>typeTarget(targetIndex+1),700));
            }
          },85);
          typingTimers.push(typingTimer);
        };
        typeTarget(0);
      },{threshold:.5});
      typingObserver.observe(typingHeading);
      window.addEventListener('beforeprint',()=>{
        typingObserver.disconnect();
        typingTimers.forEach(timerId=>{
          window.clearTimeout(timerId);
          window.clearInterval(timerId);
        });
        typingTargets.forEach(({element,textElement,fullText})=>{
          textElement.textContent=fullText;
        });
      },{once:true});
    }
  }

  function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:'bn',includedLanguages:'en,ar',autoDisplay:false},'google_translate_element');}
  function setLanguage(lang){
    document.querySelectorAll('.language-switch button').forEach(b=>{
      const isActive=b.dataset.lang===lang;
      b.classList.toggle('active',isActive);
      b.setAttribute('aria-pressed',String(isActive));
    });
    document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    if(lang==='bn'){const combo=document.querySelector('.goog-te-combo');if(combo){combo.value='';combo.dispatchEvent(new Event('change'));}return;}
    const apply=()=>{const combo=document.querySelector('.goog-te-combo');if(combo){combo.value=lang;combo.dispatchEvent(new Event('change'));}};
    apply();setTimeout(apply,500);setTimeout(apply,1200);
  }
  document.querySelectorAll('.language-switch button').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));
