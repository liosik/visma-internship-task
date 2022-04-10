const leftContainer = document.querySelector('.container-left')
const rightContainer = document.querySelector('.container-right')
const imagesEl = document.querySelector('.images')
const pagination = document.querySelector('.pagination')
const grayscaleFilter = document.getElementById('grayscale')
const blurFilter = document.getElementById('blur')
const hidden = document.querySelector('.hidden')

let currentPage = 1
const limit = 100
let currentBigImage = null

const getImages = async (page, limit) => {
    const API_LINK = `https://picsum.photos/v2/list?page=${page}&limit=${limit}`
    const response = await fetch(API_LINK)
    return await response.json()
}

const showBigImage = () => {

    const bigImageEl = document.createElement('img')
    bigImageEl.classList.add('big-img')
    bigImageEl.src = `${currentBigImage.download_url}`

    if (grayscaleFilter.checked) {
        bigImageEl.src += '?grayscale'
        if (Number(blurFilter.value > 0)) {
            bigImageEl.src += `&blur=${blurFilter.value}`
        }
    } else if (Number(blurFilter.value) > 0) {
        bigImageEl.src += `?blur=${blurFilter.value}`
    }

    const bigImageTextEl = document.createElement('div')
    bigImageTextEl.innerHTML = `<h1>Author: ${currentBigImage.author}</h1>
    <h2> Original Height: ${currentBigImage.height} </h2>
    <h2>Original Width: ${currentBigImage.width}</h2>`
    rightContainer.innerHTML =''
    rightContainer.appendChild(bigImageEl)
    rightContainer.appendChild(bigImageTextEl)
    hidden.classList.remove('hidden')
}

grayscaleFilter.onchange = showBigImage
blurFilter.onchange = showBigImage

const showImages = (images) => {
    images.map((image, i) => {
        const smallImageEl = document.createElement('div')
        smallImageEl.classList.add('small-img')
        if (i === 0) {
            smallImageEl.id = currentPage
            const paginationButton = document.createElement('a')
            paginationButton.href = `#${currentPage}`
            paginationButton.innerText = currentPage
            pagination.appendChild(paginationButton)
        }
        smallImageEl.onclick = () => {
            currentBigImage = image
            showBigImage()
        }
        smallImageEl.style.backgroundImage = `url(https://picsum.photos/id/${image.id}/200/200)`
        imagesEl.appendChild(smallImageEl)
    })
}

const loadImages = async (page, limit) => {
    try {
        const response = await getImages(page, limit)
        showImages(response)

    } catch (error) {
        console.log(error.message)
    }


}

leftContainer.addEventListener('scroll', () => {

    if (leftContainer.scrollTop + leftContainer.clientHeight >= leftContainer.scrollHeight - 1) {
        currentPage++
        loadImages(currentPage, limit)
    }

})

loadImages(currentPage, limit)