const monitorEvents = (el, callback) => {
    const eventCallback = callback || ((e) => console.log(e))
    const events = []

    for (var i in el) {
        if (i.startsWith('on')) events.push(i.substr(2))
    }
    events.forEach(eventName => el.addEventListener(eventName, eventCallback))
}

monitorEvents(document.getElementById('barCodeScannerInput'))