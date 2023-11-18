const sounds = [
    'sounds/headshot.mp3', 'sounds/headshot.mp3',
    'sounds/grenade-out.mp3',
    'sounds/flashbang.mp3',
    'sounds/molotov.mp3',
    'sounds/incendiary.mp3',
    'sounds/move-it.mp3',
    'sounds/no-my-friend.mp3', 'sounds/no-my-friend.mp3'
]

function playSound() {
    let audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
    audio.volume = 0.33;
    audio.play();
}

let doggo = document.createElement('img')
doggo.src = 'doggo.png'
doggo.id = 'doggo'
doggo.alt = 'dog with ak47'
doggo.onclick = playSound

document.body.appendChild(doggo)
