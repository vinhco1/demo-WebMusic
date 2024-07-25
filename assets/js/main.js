const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd')
const nameSong = $('.player .song-name h2')
const singer = $('.player .song-name h3')
const cdThumb = $('.cd-thumb')
const audio = $('audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const currentTime = $('#current-time')
const totalTime = $('#total-time')
const volume = $('#volume')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    conFig: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs : [
    {
        name: 'Chạy ngay đi',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/chayNgayDi.mp3',
        image: './assets/img/chayNgayDi.jpg',
    },
    {
        name: 'Hãy trao cho anh',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/hayTraoChoAnh.mp3',
        image: './assets/img/hayTraoChoAnh.jpg',
    },
    {
        name: 'Chúng ta của hiện tại',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/chungTaCuaHienTai.mp3',
        image: './assets/img/chungTaCuaHienTai.jpg',
    },
    {
        name: 'Lạc trôi',
        singer: 'Sơn Tùng M-TP',
        path: './ass',
        image: './assets/img/lacTroi.png',
    },
    {
        name: 'Có chắc yêu là đây',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/coChacYeuLaDay.mp3',
        image: './assets/img/coChacYeuLaDay.jpg',
    },
    {
        name: 'Muộn rồi mà sao còn',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/muonRoiMaSaoCon.mp3',
        image: './assets/img/muonRoiMaSaoCon.jpg',
    },
    {
        name: 'Em của ngày hôm qua',
        singer: 'Sơn Tùng M-TP',
        path: './assets/music/emCuaNgayHomQua.mp3',
        image: './assets/img/emCuaNgayHomQua.jpg',
    },
    {
        name: 'Bước qua mùa cô đơn',
        singer: 'Vũ',
        path: './assets/music/buocQuaMuaCoDon.mp3',
        image: './assets/img/buocQuaMuaCoDon.jpg',
    },
    {
        name: 'Anh nhớ ra',
        singer: 'Vũ',
        path: '',
        image: './assets/img/anhNhoRa.jpg',
    },
    {
        name: 'Lời yêu em',
        singer: 'Vũ',
        path: '.',
        image: './assets/img/loiYeuEm.jpg',
    }
    ],
    setConFig: function(key, value){
        this.conFig[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.conFig))
    },
    loadConFig: function(){
        this.isRandom = this.conFig.isRandom 
        this.isRepeat = this.conFig.isRepeat 
    },
    setUpToConFig: function(){
        if(this.isRandom) {
            randomBtn.classList.add('active')
        }
        if(this.isRepeat) {
            repeatBtn.classList.add('active')
        }
        
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return`
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index= "${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <div class="tittle">${song.name}</div>
                    <div class="author">${song.singer}</div>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
            })
        playList.innerHTML = htmls.join(' ')
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            },
        })
    },
    scrollTopToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'nearest' })
        }, 300)
    },
    adjustActiveSong: function(){
        const songs = $$('.song')
        songs.forEach(song => {
            song.classList.remove('active')
        })
        songs[this.currentIndex].classList.add('active')
    },
    loadCurrentSong: function(){       
        nameSong.textContent = this.currentSong.name
        singer.textContent = this.currentSong.singer
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path   
    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) this.currentIndex = 0
        this.loadCurrentSong()
    },
    previousSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0) this.currentIndex = this.songs.length - 1
        this.loadCurrentSong()
    },
    handleEvents: function(){
       
        //Xử lí cd quay / dừng
        const cdThumAnimate= cdThumb.animate([
            {transform: 'rotate(360deg)'}],
            {
            duration: 20000,
            iterations: Infinity,
            }
        )
        cdThumAnimate.pause()
        //Xử lí phóng to / thu nhỏ cd
        const cdWidth = cd.offsetWidth
        document.onscroll= function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCDWidth = cdWidth - scrollTop
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
            cd.style.opacity= newCDWidth/cdWidth
        }
        // Xử lí khi người dùng click vào playlist
        playBtn.click()
        playBtn.onclick = function(){
            if(app.isPlaying) audio.pause()
            else audio.play()
        }
        //Khi song được play
        audio.onplay = function(){
            app.isPlaying = true
            player.classList.add('playing')
            cdThumAnimate.play()
            playBtn.title= "Pause current"
        }
        //Khi song được pause
        audio.onpause = function(){
            app.isPlaying = false
            player.classList.remove('playing')
            cdThumAnimate.pause()
            playBtn.title= "Play current"
        }
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
                progress.style.backgroundImage = `linear-gradient(90deg, #ec1f55 ${progressPercent}%, transparent 0%)`
                currentTime.textContent = formatTime(audio.currentTime)
                totalTime.textContent = formatTime(audio.duration)
        }
            else{
                currentTime.textContent = '0:00'
                progress.value = 0
                progress.style.backgroundImage = `linear-gradient(90deg, #ec1f55 0%, transparent 0%)`
            }
        }
        //Xử lí khi tua bài hát
        progress.oninput = function(e){
            const seekTime = (e.target.value / 100) * audio.duration
            audio.currentTime = seekTime
        }
        //Xử lí âm thanh khi tua 
        volume.value = audio.volume *100
        volume.style.backgroundImage = `linear-gradient(90deg, #ec1f55 ${volume.value}%, transparent 0%)`
        volume.oninput = function() {
            const newAudioVolume = volume.value / 100;
            audio.volume = volume.value / 100;
            volume.style.backgroundImage = `linear-gradient(90deg, #ec1f55 ${newAudioVolume * 100}%, transparent 0%)`
        }
        //Khi next bài 
        nextBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
                
            }else{
                app.nextSong()
                
            }
            audio.play()
            app.adjustActiveSong()
            app.scrollTopToActiveSong()
        }
        //Khi prev bài
        preBtn.onclick = function(){
            if(app.isRandom){
                app.playRandomSong()
            }else{
                app.previousSong()
            }
            audio.play()
            app.adjustActiveSong()
            app.scrollTopToActiveSong()
        }
        //Khi random bài
        randomBtn.onclick = function(){
            app.isRandom =!app.isRandom
            app.setConFig('isRandom', app.isRandom)
            randomBtn.classList.toggle('active', app.isRandom)
        }
        //Khi repeat bài
        repeatBtn.onclick = function(){
            app.isRepeat =!app.isRepeat
            app.setConFig('isRepeat', app.isRepeat)
            repeatBtn.classList.toggle('active', app.isRepeat)
        }
        //Xử lí khi hết bài hát tự động next bài / trường hợp repeat bật
        audio.onended = function(){
            if(app.isRepeat) {
                audio.play()
            } else nextBtn.click()
        }
        //Lắng nghe / xử lí khi người dùng click vào playlist
        playList.onclick = function(e){
            const songElement = e.target.closest('.song:not(.active)')
            if(songElement || e.target.closest('.option')) {
                //Xử lí khi click vào một bài hát
                if(songElement) {
                    app.currentIndex = Number(songElement.dataset.index)
                    app.loadCurrentSong()
                    app.adjustActiveSong()
                    audio.play()
                }
            }
        }   
    },
    playRandomSong: function(){
        let randomIndex
        do{
            randomIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(this.currentIndex === randomIndex)
        this.currentIndex = randomIndex
        this.loadCurrentSong()
    },
    start : function() {
        // Load thông tin bài hát từ localStorage
        this.loadConFig()
        // Render danh sách bài hát ra giao diện
        this.render()
        // Set up congfig mặc định
        this.setUpToConFig()
        //Định nghĩa các thuộc tính cho object
        this.defineProperties()
        // Lắng nghe / xử lí các sự kiện (DOM Events)
        this.handleEvents()
        // Tải thông tin bài hát hiện tại vào đầu trang
        this.loadCurrentSong()
       
    
        
    }
}
app.start()
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds < 10? '0' : ''}${remainingSeconds}`
}