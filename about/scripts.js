// Service Worker 注册
if ("serviceWorker" in navigator) {
    
    navigator.serviceWorker
        .register("./service-worker.js")
        .then((registration) => {
            
            registration.addEventListener("updatefound", () => {
                const newWorker = registration.installing;
                newWorker.addEventListener("statechange", () => {
                    if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                      
                        {
                            newWorker.postMessage({ action: "skipWaiting" });
                        }
                    }
                });
            });
        })
        .catch((err) => console.error("about page: Service Worker 注册失败:", err));

    navigator.serviceWorker.addEventListener("controllerchange", () => {
       
        window.location.reload();
    });

    navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data && event.data.action === "skipWaiting") {
           
        }
    });
}