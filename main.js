/**
 * Global variable
 *
 * @type {string}
 */

document.addEventListener("DOMContentLoaded", function (g) {
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	function CompleteClose(e, playerInstance, container) {
		if (e) e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
		if (container) container.parentNode.removeChild(container);
		if (playerInstance && playerInstance.active()) playerInstance.close();
		// playerInstance = null;
		// container = null;
	}

	// can play mp3s and wav
	function DecodeAudio(files) {
		if (files.length === 0) return;
		const slicedList = Array.prototype.slice.call(files);
		for (let i = 0; i < slicedList.length; i++) {
			const input = slicedList[i];
			input.classList.add("hasAudioPlayerFlag");
			let url = input.getAttribute("download_url");
			url = url.substring(url.search(":http") + 1);
			input.addEventListener('click', (e) => {
				e.preventDefault();
				e.stopPropagation();
				// e.stopImmediatePropagation();
				// e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
				const request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'arraybuffer';
				request.onload = function () {
					let container;
					let overlay;
					let playerInstance;
					let ldmsg;
					try {
						container = document.createDocumentFragment().appendChild(document.createElement("div"));
						container.classList.add("playerDisplay");
						overlay = container.appendChild(document.createElement("div"));
						overlay.classList.add("overlay");
						const location = container.appendChild(document.createElement("div"));
						location.classList.add("overlayPlayer");
						ldmsg = location.appendChild(document.createElement("p"));
						ldmsg.classList.add("initLoader");
						document.body.appendChild(container);
						ldmsg.innerHTML = "Loading file";

						const { readyState, status, response } = this;
						// console.log(`readyState: ${readyState} - status: ${status}`);
						if (readyState === 4 && status === 200) {
							ldmsg.innerHTML = "";
							const playerElement = InsertPlayer(location);
							playerInstance = window.player = new Player(playerElement, response);
						}
					} catch (error) {
						console.error("GPlayer failed to load file", error)
						if (ldmsg) ldmsg.innerHTML = "GPlayer failed to load file";
					} finally {
						overlay.addEventListener("click", (e) => CompleteClose(e, playerInstance, container));
					}
				}
				request.send();
			}, false);
		}
	}
	// // Custom WAV decoder - test - not working
	// function CustomDecodeWAV(files) {
	// 	if (files.length === 0) return;
	// 	const slicedList = Array.prototype.slice.call(files);
	// 	for (let i = 0; i < slicedList.length; i++) {
	// 		const input = slicedList[i];
	// 		input.classList.add("hasAudioPlayerFlag");
	// 		let url = input.getAttribute("download_url");
	// 		url = url.substring(url.search(":http") + 1);
	// 		input.addEventListener('click', (e) => {
	// 			e.preventDefault();
	// 			e.stopPropagation();
	// 			// e.stopImmediatePropagation();
	// 			// e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
	// 			const request = new XMLHttpRequest();
	// 			request.open('GET', url, true);
	// 			request.responseType = 'arraybuffer';
	// 			request.onload = function () {
	// 				let container;
	// 				let overlay;
	// 				let playerInstance;
	// 				let ldmsg;
	// 				try {
	// 					container = document.createDocumentFragment().appendChild(document.createElement("div"));
	// 					container.classList.add("playerDisplay");
	// 					overlay = container.appendChild(document.createElement("div"));
	// 					overlay.classList.add("overlay");
	// 					const location = container.appendChild(document.createElement("div"));
	// 					location.classList.add("overlayPlayer");
	// 					ldmsg = location.appendChild(document.createElement("p"));
	// 					ldmsg.classList.add("initLoader");
	// 					document.body.appendChild(container);
	// 					ldmsg.innerHTML = "Loading file";

	// 					const { readyState, status, response } = this;
	// 					// console.log(`readyState: ${readyState} - status: ${status}`);
	// 					if (readyState === 4 && status === 200) {
	// 						ldmsg.innerHTML = "";
	// 						const playerElement = InsertPlayer(location);

	// 						let audioData = response;
	// 						let dv = new DataView(audioData);
	// 						let junk = 0;
	// 						let position = 12;
	// 						do {
	// 							const header = String.fromCharCode.apply(null, new Uint8Array(audioData, position, 4));
	// 							const length = dv.getUint32(position + 4, true);
	// 							if (header.trim() === 'fmt') {
	// 								junk = junk + length - 16;
	// 							}
	// 							position = position + 8 + length;
	// 						} while (position < audioData.byteLength);
	// 						const productArray = new Uint8Array(audioData.byteLength - junk);
	// 						productArray.set(new Uint8Array(audioData, 0, 12));
	// 						let newPosition = 12;
	// 						position = 12;
	// 						let fmt_length_spot = 0;
	// 						do {
	// 							const header = String.fromCharCode.apply(null, new Uint8Array(audioData, position, 4));
	// 							const length = dv.getUint32(position + 4, true);
	// 							if (header.trim() === 'fmt') {
	// 								productArray.set(new Uint8Array(audioData, position, 24), newPosition);
	// 								fmt_length_spot = newPosition + 4;
	// 								newPosition = newPosition + 24;
	// 							}
	// 							else {
	// 								productArray.set(new Uint8Array(audioData, position, length + 8), newPosition);
	// 								newPosition = newPosition + 8 + length;
	// 							}
	// 							position = position + 8 + length;
	// 						} while (position < audioData.byteLength);
	// 						audioData = productArray.buffer;
	// 						dv = new DataView(audioData);
	// 						dv.setUint32(4, audioData.byteLength - 8, true);
	// 						dv.setUint32(fmt_length_spot, 16, true);

	// 						playerInstance = window.player = new Player(playerElement, response);
	// 					}
	// 				} catch (error) {
	// 					console.error("GPlayer failed to load file", error)
	// 					if (ldmsg) ldmsg.innerHTML = "GPlayer failed to load file";
	// 				} finally {
	// 					overlay.addEventListener("click", (e) => CompleteClose(e, playerInstance, container));
	// 				}
	// 			}
	// 			request.send();
	// 		}, false);
	// 	}
	// }

	function Activate(e) {
		let files = document.querySelectorAll("*[download_url*='.mp3']:not(.hasAudioPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.MP3']:not(.hasAudioPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.wav']:not(.hasAudioPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.WAV']:not(.hasAudioPlayerFlag)");
		DecodeAudio(files);
	};

	document.addEventListener("DOMNodeInserted", Activate.bind(this));

});