const CACHE='catarina-v2';
const FILES=['./','./index.html','./rotina.html','./manifest.json','./icon.png','./icon-512.png'];

// URLs que NUNCA devem ser cacheadas (Firebase, APIs externas)
const BYPASS = [
  'firestore.googleapis.com',
  'firebase.googleapis.com',
  'identitytoolkit.googleapis.com',
  'securetoken.googleapis.com',
  'www.gstatic.com/firebasejs',
  'fonts.googleapis.com',
  'fonts.gstatic.com'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  const url = e.request.url;
  
  // Deixa passar direto sem cache (Firebase e APIs)
  if(BYPASS.some(b => url.includes(b))){
    e.respondWith(fetch(e.request));
    return;
  }
  
  // Para os assets locais: cache-first, fallback para rede
  e.respondWith(
    caches.match(e.request).then(r => {
      if(r) return r;
      return fetch(e.request).then(res => {
        if(res && res.status === 200 && e.request.method === 'GET'){
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    }).catch(()=>caches.match('./index.html'))
  );
});
