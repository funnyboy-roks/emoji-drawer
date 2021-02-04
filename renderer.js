// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const filterInput = document.querySelector('#filter');
const emojisDiv = document.querySelector('div#emojis');

let allEmojis = [];
Object.keys(emojisJson).forEach(key => {
    const category = emojisJson[key]
    allEmojis.push(...category.map(emoji => {emoji.category = key; return emoji}));
});

const fill = (filter='') => {
    const outStuff = [];
    outStuff.push(...allEmojis.filter(emoji => arrHasText(emoji.names.concat(emoji.category), filter)).map(formatEmoji));
    emojisDiv.innerHTML = outStuff.join('');
};

const arrHasText = (arr, text) => {
    for(let n of arr){
        if(n.includes(text)){
            return true;
        }
    }
    return false;
};

filterInput.addEventListener('input', (e) => {
    fill(filterInput.value);
});

const formatEmoji = (emoji) => {
    return `
    <div>
        ${emoji.surrogates}
    </div>
    `
}

fill();

console.log(emojisJson)
