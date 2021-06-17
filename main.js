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

	function IgnoreAction(event) {
		const { target: {
			className
		} } = event;
		if (className === "aSK J-J5-Ji aYr") return true;
		if (className === "wtScjd J-J5-Ji aYr XG") return true;
		return false;
	}
	// can play mp3s and wav
	function DecodeAudio(files) {
		if (files.length === 0) return;
		const slicedList = Array.prototype.slice.call(files);
		for (let i = 0; i < slicedList.length; i++) {
			const input = slicedList[i];
			input.classList.add("hasPlayerFlag");
			let url = input.getAttribute("download_url");
			url = url.substring(url.search(":http") + 1);
			input.addEventListener('click', (e) => {
				if (IgnoreAction(e)) return;
				e.preventDefault();
				e.stopPropagation();
				// e.stopImmediatePropagation();
				// e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
				const request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'arraybuffer';
				let playerInstance;
				const container = document.createDocumentFragment().appendChild(document.createElement("div"));
				container.classList.add("playerDisplay");
				const overlay = container.appendChild(document.createElement("div"));
				overlay.classList.add("overlay");
				const location = container.appendChild(document.createElement("div"));
				location.classList.add("overlayPlayer");
				const ldmsg = location.appendChild(document.createElement("p"));
				ldmsg.classList.add("initLoader");
				document.body.appendChild(container);
				ldmsg.innerHTML = "Loading file";
				overlay.addEventListener("click", (e) => CompleteClose(e, playerInstance, container));
				request.onload = () => {
					try {

						const { readyState, status, response } = request; // or "this" if function
						// console.log(`readyState: ${readyState} - status: ${status}`);
						if (readyState === 4 && status === 200) {
							ldmsg.innerHTML = "";
							const playerElement = InsertAudioPlayer(location);
							playerInstance = window.player = new AudioPlayer(playerElement, response);
						}
					} catch (error) {
						console.error("GPlayer failed to load file", error)
						ldmsg.innerHTML = "GPlayer failed to load file";
					}
				};
				request.send();
			}, false);
		}
	}

	// decode mp4s
	function DecodeVideo0(files) {
		if (files.length === 0) return;
		const slicedList = Array.prototype.slice.call(files);
		for (let i = 0; i < slicedList.length; i++) {
			const input = slicedList[i];
			input.classList.add("hasPlayerFlag");
			let url = input.getAttribute("download_url");
			url = url.substring(url.search(":http") + 1);
			input.addEventListener('click', (e) => {
				if (IgnoreAction(e)) return;
				e.preventDefault();
				e.stopPropagation();
				// e.stopImmediatePropagation();
				// e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
				console.log("requesting data");
				const request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'blob';
				// request.responseType = 'arraybuffer';
				let playerInstance;
				const container = document.createDocumentFragment().appendChild(document.createElement("div"));
				container.classList.add("playerDisplay");
				const overlay = container.appendChild(document.createElement("div"));
				overlay.classList.add("overlay");
				const location = container.appendChild(document.createElement("div"));
				location.classList.add("overlayPlayer");
				const ldmsg = location.appendChild(document.createElement("p"));
				ldmsg.classList.add("initLoader");
				document.body.appendChild(container);
				ldmsg.innerHTML = "Loading file";
				overlay.addEventListener("click", (e) => CompleteClose(e, playerInstance, container));
				request.onload = async () => {
					console.log("data loaded");
					try {
						const { readyState, status, response } = request; // or "this" if function
						// console.log(`readyState: ${readyState} - status: ${status}`);
						if (readyState === 4 && status === 200) {
							ldmsg.innerHTML = "";


							// blob to text
							const videoHtml = location.appendChild(document.createElement("video"));
							videoHtml.classList.add("videoPlayer");
							console.log({ response });
							const reader = new FileReader();
							reader.onload = (e) => {
								// videoHtml.src = reader.result;
								console.log({ bt: reader.result });
							}
							const blob = URL.createObjectURL(response);
							reader.readAsText(response.slice(blob.size - 64, blob.size), "utf-8");

							// // blob
							// const videoHtml = location.appendChild(document.createElement("video"));
							// videoHtml.classList.add("videoPlayer");
							// console.log({ response });
							// const reader = new FileReader();
							// reader.onload = (e) => {
							// 	videoHtml.src = reader.result;
							// }
							// reader.readAsDataURL(response);

							//// video
							// const videoCanvasHtml = location.appendChild(document.createElement("canvas"));
							// videoCanvasHtml.classList.add("videoCanvasPlayer");
							// const videoCtx = new VideoContext(videoCanvasHtml);
							// const videoNode = videoCtx.video(response);
							// videoNode.start(0);
							// videoNode.stop(4);
							// videoCtx.play();

							// // blob
							// const videoHtml = location.appendChild(document.createElement("video"));
							// videoHtml.classList.add("videoPlayer");
							// const blob = URL.createObjectURL(response);
							// const blob2 = blob.slice(0, blob.size, "video/mp4");
							// console.log({ response, bt: await blob.text(), bt2: await blob2.text() });
							// videoHtml.src = blob2;

							//// arrayBuffer
							// const videoHtml = location.appendChild(document.createElement("video"));
							// videoHtml.classList.add("videoPlayer");
							// console.log({ response });
							// const mediaSource = new MediaSource();
							// videoHtml.src = URL.createObjectURL(mediaSource);
							// mediaSource.addEventListener("sourceopen", (e) => {
							// 	URL.revokeObjectURL(videoHtml.src);
							// 	const sourceBuffer = mediaSource.addSourceBuffer("video/mp4");
							// 	console.log("appending Buffer to sourceBuffer");
							// 	sourceBuffer.addEventListener("updateend", (e) => {
							// 		if (!sourceBuffer.updating && mediaSource.readyState === "open") {
							// 			mediaSource.endOfStream();
							// 			videoHtml.play();
							// 		}
							// 	});
							// 	sourceBuffer.appendBuffer(response);
							// });

							// playerInstance = window.player = videoHtml.src = response;
							// playerInstance = window.player = new AudioPlayer(playerElement, response);
						}
					} catch (error) {
						console.error("GPlayer failed to load file", error)
						ldmsg.innerHTML = "GPlayer failed to load file";
					}
				};
				request.send();
			}, false);
		}
	}
	// decode mp4s
	function DecodeVideo1(files) {
		if (files.length === 0) return;
		const slicedList = Array.prototype.slice.call(files);
		for (let i = 0; i < slicedList.length; i++) {
			const input = slicedList[i];
			input.classList.add("hasPlayerFlag");
			let url = input.getAttribute("download_url");
			url = url.substring(url.search(":http") + 1);
			input.addEventListener('click', (e) => {
				if (IgnoreAction(e)) return;
				e.preventDefault();
				e.stopPropagation();
				// e.stopImmediatePropagation();
				// e.stopPropagation ? e.stopPropagation() : (e.cancelBubble=true);
				console.log("requesting data");
				// const nw = window.open();
				// nw.document.write(`<html><body><video controls="" width="250"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm"></video></body></html>`);

				// const container = document.createDocumentFragment().appendChild(document.createElement("div"));
				// container.classList.add("playerDisplay");
				// const overlay = container.appendChild(document.createElement("div"));
				// overlay.classList.add("overlay");
				// const location = container.appendChild(document.createElement("div"));
				// location.classList.add("overlayPlayer");
				// const iframe = container.appendChild(document.createElement("iframe"));
				// iframe.classList.add("iframePlayer");

				// const ldmsg = location.appendChild(document.createElement("p"));
				// ldmsg.classList.add("initLoader");
				// document.body.appendChild(container);
				// ldmsg.innerHTML = "Loading file";

				// const iframedoc = iframe.contentWindow.document;
				// iframedoc.open();
				// iframedoc.write(`<html><body><video controls="" width="250"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm" type="video/webm"></video></body></html>`);
				// iframedoc.close();

				// overlay.addEventListener("click", (e) => CompleteClose(e, playerInstance, container));


				// request.onload = async () => {
				// 	console.log("data loaded");
				// 	try {
				// 		const { readyState, status, response } = request; // or "this" if function
				// 		// console.log(`readyState: ${readyState} - status: ${status}`);
				// 		if (readyState === 4 && status === 200) {
				// 			ldmsg.innerHTML = "";


				// 			// blob to text
				// 			const videoHtml = location.appendChild(document.createElement("video"));
				// 			videoHtml.classList.add("videoPlayer");
				// 			console.log({ response });
				// 			const reader = new FileReader();
				// 			reader.onload = (e) => {
				// 				// videoHtml.src = reader.result;
				// 				console.log({ bt: reader.result });
				// 			}
				// 			const blob = URL.createObjectURL(response);
				// 			reader.readAsText(response.slice(blob.size - 64, blob.size), "utf-8");

				// 		}
				// 	} catch (error) {
				// 		console.error("GPlayer failed to load file", error)
				// 		ldmsg.innerHTML = "GPlayer failed to load file";
				// 	}
				// };
				// request.send();
			}, false);
		}
	}
	// // Custom WAV decoder - testing - not working
	// function CustomDecodeWAV(files) {
	// 	if (files.length === 0) return;
	// 	const slicedList = Array.prototype.slice.call(files);
	// 	for (let i = 0; i < slicedList.length; i++) {
	// 		const input = slicedList[i];
	// 		input.classList.add("hasPlayerFlag");
	// 		let url = input.getAttribute("download_url");
	// 		url = url.substring(url.search(":http") + 1);
	// 		input.addEventListener('click', (e) => {
	// if (IgnoreAction(e)) return;
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

	// 						playerInstance = window.player = new AudioPlayer(playerElement, response);
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
		let files = document.querySelectorAll("*[download_url*='.mp3']:not(.hasPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.MP3']:not(.hasPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.wav']:not(.hasPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.WAV']:not(.hasPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.ogg']:not(.hasPlayerFlag)");
		DecodeAudio(files);
		files = document.querySelectorAll("*[download_url*='.OGG']:not(.hasPlayerFlag)");
		DecodeAudio(files);
		// files = document.querySelectorAll("*[download_url*='.mp4']:not(.hasPlayerFlag)");
		// DecodeVideo1(files);
		// files = document.querySelectorAll("*[download_url*='.MP4']:not(.hasPlayerFlag)");
		// DecodeVideo1(files);
	};

	document.addEventListener("DOMNodeInserted", Activate.bind(this));

});