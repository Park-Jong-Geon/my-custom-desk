const CACHE_NAME = 'my-custom-desk-v1.2'; // 버전을 올릴 때마다 이름 변경
const FILES_TO_CACHE = [
  './',
  './index.html',
  // 필요한 파일들...
];

// 설치 시 즉시 캐시
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // 대기하지 않고 즉시 새 버전으로 갈아타기
});

// 활성화될 때 이전 캐시 청소
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // 💡 즉시 제어권 가져오기
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
