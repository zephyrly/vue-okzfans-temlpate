export const unRegisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister()
        })
    }
}
