/* El Huda — App Shell: bottom tabs, splash, transitions, offline notice */
(function(){
  var isApp = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())
              || /[?&]app=1/.test(location.search) || sessionStorage.getItem('eh_app')==='1';
  if(!isApp) return;
  if(/[?&]app=1/.test(location.search)) sessionStorage.setItem('eh_app','1');
  var d = document, root = d.documentElement;
  root.classList.add('is-app');

  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var ICON = {
    home:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    quran:'<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5C4.7 20 4 19.3 4 18.5z"/><path d="M20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5z"/>',
    prayer:'<path d="M12 3a7 7 0 1 0 7 9.5A6 6 0 0 1 12 3z"/><path d="M17 4v3M15.5 5.5h3"/>',
    tools:'<rect x="4" y="4" width="7" height="7" rx="2"/><rect x="13" y="4" width="7" height="7" rx="2"/><rect x="4" y="13" width="7" height="7" rx="2"/><rect x="13" y="13" width="7" height="7" rx="2"/>',
    more:'<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'
  };
  var TABS = [
    ['index.html','home','الرئيسية',['index.html','']],
    ['quran.html','quran','القرآن',['quran.html','quran-read.html','quran-listen.html','quran-tafsir.html','tajweed-guide.html']],
    ['prayer.html','prayer','الصلاة',['prayer.html','qibla.html','hijri.html']],
    ['tools.html','tools','الأدوات',['tools.html','tasbih.html','zakat.html','tracker.html','share-ayah.html']]
  ];
  var MORE = [
    ['🕋','أسماء الله الحسنى','asmaullah.html'],['📜','أحاديث','hadiths.html'],['🤲','أدعية وأذكار','duas-dhikr.html'],
    ['🌙','رمضان','ramadan.html'],['📖','قصص الأنبياء','stories.html'],['🎓','دروس','lessons.html'],
    ['🎬','فيديوهات','videos.html'],['📚','المكتبة','library.html'],['🖼️','خلفيات','wallpapers.html'],
    ['📰','مقالات','articles.html'],['🔍','بحث','search.html'],['❓','أسئلة شائعة','faq.html'],
    ['ℹ️','من نحن','about.html'],['✉️','تواصل','contact.html']
  ];
  function svg(k){return '<svg viewBox="0 0 24 24">'+ICON[k]+'</svg>';}

  function build(){
    // splash (only first load per session)
    if(!sessionStorage.getItem('eh_splash')){
      sessionStorage.setItem('eh_splash','1');
      var s=d.createElement('div'); s.id='eh-splash';
      s.innerHTML='<img src="assets/icon-512.png" alt=""><b>الهُدى</b><small>EL HUDA</small>';
      d.body.appendChild(s); setTimeout(function(){s.classList.add('hide');setTimeout(function(){s.remove()},600)},1100);
    }
    var nav=d.createElement('nav'); nav.className='eh-nav';
    var h='';
    TABS.forEach(function(t){
      var act=t[3].indexOf(page)>-1 ? ' active':'';
      h+='<a class="eh-tab'+act+'" href="'+t[0]+'">'+svg(t[1])+'<span>'+t[2]+'</span></a>';
    });
    h+='<button class="eh-tab" id="ehMore" aria-label="المزيد">'+svg('more')+'<span>المزيد</span></button>';
    nav.innerHTML=h; d.body.appendChild(nav);

    var bg=d.createElement('div'); bg.className='eh-sheet-bg';
    var sh=d.createElement('div'); sh.className='eh-sheet';
    var g='<h3>استكشف المزيد</h3><div class="eh-grid">';
    MORE.forEach(function(m){g+='<a class="eh-item" href="'+m[2]+'"><i>'+m[0]+'</i><span>'+m[1]+'</span></a>';});
    sh.innerHTML=g+'</div>';
    d.body.appendChild(bg); d.body.appendChild(sh);
    function toggle(on){root.classList.toggle('eh-more',on);}
    d.getElementById('ehMore').addEventListener('click',function(){toggle(!root.classList.contains('eh-more'));});
    bg.addEventListener('click',function(){toggle(false);});

    var toast=d.createElement('div'); toast.id='eh-toast'; toast.textContent='لا يوجد اتصال بالإنترنت — بعض المحتوى قد لا يعمل';
    d.body.appendChild(toast);
    function net(){toast.classList.toggle('show',!navigator.onLine);}
    addEventListener('online',net); addEventListener('offline',net); net();

    // smooth page leave
    d.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a[href]'); if(!a) return;
      var u=a.getAttribute('href');
      if(!u||u[0]=='#'||/^(https?:|mailto:|tel:|javascript:)/i.test(u)||a.target=='_blank') return;
      e.preventDefault(); root.classList.add('eh-leaving'); setTimeout(function(){location.href=u},170);
    });
    // external links -> system browser
    d.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a[href^="http"]'); if(!a) return;
      if(window.Capacitor&&window.Capacitor.Plugins&&window.Capacitor.Plugins.Browser){
        e.preventDefault(); window.Capacitor.Plugins.Browser.open({url:a.href});
      }
    },true);
  }
  if(d.readyState==='loading') d.addEventListener('DOMContentLoaded',build); else build();
})();
