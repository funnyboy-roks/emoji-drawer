// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const filterInput = document.querySelector('#filter');
const emojisDiv = document.querySelector('#emojis');
const emojiInfoDiv = document.querySelector('#emoji-info');
const { clipboard } = require('electron');

let allEmojis = [];
Object.keys(emojisJson).forEach((key) => {
	const category = emojisJson[key];
	allEmojis.push(
		...category.map((emoji) => {
			emoji.category = key;
			return emoji;
		})
	);
});

const fill = (filter = '') => {
	// const outStuff = [];
	// outStuff.push(
	emojisDiv.innerHTML = '';
	allEmojis
		.filter((emoji) =>
			arrHasText(emoji.names.concat(emoji.category), filter)
		)
		.forEach((e) => emojiToHtml(emojisDiv, e));
	// );
	// emojisDiv.innerHTML = outStuff.join('');
};

const arrHasText = (arr, text) => {
	const isRegex =
		text.startsWith('/') && text.endsWith('/') && text.length > 1;
	const regex = isRegex
		? new RegExp(text.substring(1, text.length - 1))
		: null;
	for (let n of arr) {
		if (!isRegex && n.includes(text.replace(/\:/g, ''))) {
			return true;
		}
		if (isRegex && regex.test(n)) {
			return true;
		}
	}
	return false;
};

filterInput.addEventListener('input', (e) => {
	fill(filterInput.value);
});

const emojiToHtml = (parent, emoji) => {
	const el = document.createElement('div');
	el.innerText = emoji.surrogates;
	el.classList.add(
		'is-clickable',
		'emoji',
		'p-1',
		'm-2',
		'has-text-centered'
	);
	el.title = `:${emoji.names[0]}:`;
	el.addEventListener('click', (e) => {
		copyItem(emoji.surrogates);
    });
    el.addEventListener('mouseenter', (e) => {
        emojiInfo(emoji);
    });

	parent.appendChild(el);
};

const emojiInfo = (emoji) => {
    emojiInfoDiv.querySelector('#icon').innerText = emoji.surrogates;
    emojiInfoDiv.querySelector('#names').innerText = emoji.names.map(n => `:${n}:`).join(' ');
};

const copyItem = (text) => clipboard.writeText(text);

fill();

// console.log(emojisJson);
