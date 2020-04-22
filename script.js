const barcodeInput = document.getElementById('barCodeScannerInput')
const ul = document.getElementById('ulList')
const delay = ms => new Promise(res => setTimeout(res, ms))
let barcodes = []
let newUPC =  [] 
let currentCount = 0
let pastCount = 0
const milDelay = 300

barcodeInput.focus()
barcodeInput.addEventListener('keydown', function (e) {

    if (e.key.length === 1) {
        newUPC.push(e.key)
        currentCount ++
        pastCount = currentCount
        if (newUPC.length >= 10) {
            checkAmmount(newUPC)
        }
    }
})

const checkAmmount = async (newUPC) => {
    await delay(milDelay);
    if (currentCount === pastCount && (currentCount !== 0)) {
        barcodeInput.setAttribute('disabled', true)
        checkArray(barcodes, newUPC.join(""))
        
        if (checkArray(barcodes, newUPC.join("")) == -1){
            let node = document.createElement('li')
            barcodes.push(newUPC.join(""))
            let nodeItem = document.createTextNode(newUPC.join(""))
            node.appendChild(nodeItem)
            ul.appendChild(node)
            clearInput()
        } else {
            barcodeInput.setAttribute('disabled', true)
            swal({
                icon: "error",
                title: "Woops",
                text: "result all ready in database",
                buttons: false,
                timer: 1000,
                closeOnClickOutside: false
            }).then(() => {
                clearInput()
            })
        }
    }
}

function clearInput () {
    barcodeInput.value = ""
    currentCount = 0
    pastCount = 0
    newUPC = []
    barcodeInput.removeAttribute('disabled')
    barcodeInput.focus()
}

function checkArray (ary, value) {
    const tempResult = ary.indexOf(value)
    return tempResult
}