/**
 * Global variable
 *
 * @type {string}
 */

document.addEventListener("DOMContentLoaded", function (g) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	function CompleteClose(event, playerInstance, container, audioArray) {
		event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true);
		if (playerInstance.active() != true)
			return;
		playerInstance.close();
		playerInstance = null;
		if (audioArray) audioArray = null;
		container.parentNode.removeChild(container);
		container = null;
	}

	function LoadFile(url, overlay, container, location, ldmsg) {
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function () {
			const { readyState, status, response } = this;
			// console.log(`readyState: ${readyState} - status: ${status}`);
			if (readyState === 4 && status === 200) {
				ldmsg.innerHTML = "";
				const playerElement = InsertPlayer(location);
				window.player = new Player(playerElement, response);
				overlay.addEventListener("click", function (e) { CompleteClose(e, window.player, container); });
			}
		}
		request.send();
	}

	function OverlaySetup(event, dlURL, aPass) {
		event.preventDefault();
		event.stopPropagation();
		// event.stopImmediatePropagation();
		// event.stopPropagation ? event.stopPropagation() : (event.cancelBubble=true);
		const holder = document.createDocumentFragment().appendChild(document.createElement("div"));
		holder.classList.add("playerDisplay");
		const oB = holder.appendChild(document.createElement("div"));
		oB.classList.add("overlay");
		const oCont = holder.appendChild(document.createElement("div"));
		oCont.classList.add("overlayPlayer");
		const p0 = oCont.appendChild(document.createElement("p"));
		p0.classList.add("initLoader");
		document.body.appendChild(holder);
		p0.innerHTML = "Loading mp3";
		LoadFile(dlURL, oB, holder, oCont, p0);
	}

	function Mp3sDecode(e) {
		const mp3List = document.querySelectorAll("*[download_url*='.mp3']:not(.hasMP3Player)");
		if (mp3List.length !== 0) {
			const slicedMP3List = Array.prototype.slice.call(mp3List);
			for (let i = 0; i < slicedMP3List.length; i++) {
				const input = slicedMP3List[i];
				input.classList.add("hasMP3Player");
				let dlURL = input.getAttribute("download_url");
				dlURL = dlURL.substring(dlURL.search(":http") + 1);
				input.addEventListener('click', (e) => OverlaySetup(e, dlURL), false);
			}
		}
	};

	document.addEventListener("DOMNodeInserted", Mp3sDecode.bind(this));

});