const CACHE_NAME = "about-page-cache-v0.3.5"; // 更新缓存时修改版本号
const CACHE_PREFIX = CACHE_NAME.split("-v")[0]; // 提取前缀 
const urlsToCache = [
  "/",
  "./index.html",
  "./svgs/about.svg",
  "./svgs/counting.svg",
  "./svgs/route.svg",
  "./svgs/shift.svg",
  "./svgs/driver.svg",
  "./svgs/truck.svg",
  "./svgs/truck-pickup.svg",
  "./svgs/van.svg",
  "./scripts.js",
  "./styles.css",
  "./svgs/coins.svg",
  "./svgs/car.svg",
  "./svgs/android.svg",
  "./svgs/apple.svg",
  "./androidguide.pdf",
  "./iphoneguide.pdf",
  "./svgs/time.svg",
  "./svgs/happy.svg",

];



// 安装事件
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch((error) => console.error(`${CACHE_NAME} Install failed:`, error))
  );
});

// 获取事件
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then(function (networkResponse) {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(function (error) {
          console.error(`${CACHE_NAME} Fetch failed:`, error);
          return new Response("Network error occurred", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
    })
  );
});

// 激活事件
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // 只删除以当前 CACHE_PREFIX 开头但不是当前 CACHE_NAME 的缓存
            if (
              cacheName.startsWith(CACHE_PREFIX) &&
              cacheName !== CACHE_NAME
            ) {

              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
      .catch((error) => console.error(`${CACHE_NAME} Activation failed:`, error))
  );
});

// 处理 skipWaiting 消息
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});