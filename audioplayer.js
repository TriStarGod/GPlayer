function InsertAudioPlayer(location) {
	const pC = document.createDocumentFragment();
	const d0 = pC.appendChild(document.createElement("div"));
	d0.classList.add("player");
	const p0 = document.createElement("p");
	p0.classList.add("message");
	p0.innerHTML = "Loading";
	d0.appendChild(p0);
	//d0.appendChild(document.createElement("p")).classList.add("message");
	const d1 = d0.appendChild(document.createElement("div"));
	d1.classList.add("controls");
	const c0 = d1.appendChild(document.createElement("button")).classList;
	c0.add("button");
	c0.add("play");
	const d2 = d1.appendChild(document.createElement("div"));
	d2.classList.add("track");
	d2.appendChild(document.createElement("div")).classList.add("progress");
	//d2.appendChild(document.createElement("div")).classList.add("scrubber");
	const d3 = d1.appendChild(document.createElement("div"));
	d3.classList.add("count");
	d3.appendChild(document.createElement("span")).classList.add("progressCount");
	const s0 = d3.appendChild(document.createElement("span"));
	s0.classList.add("divider");
	s0.innerHTML = "/";
	d3.appendChild(document.createElement("span")).classList.add("totalCount");
	const b0 = d1.appendChild(document.createElement("button"));
	b0.disabled = true;
	const c1 = b0.classList;
	c1.add("button");
	c1.add("volume-up");
	const i0 = d1.appendChild(document.createElement("input"));
	i0.classList.add("volume");
	i0.setAttribute("type", "range");
	i0.setAttribute("min", "0");
	i0.setAttribute("max", "100");
	i0.setAttribute("value", "100");
	//location.parentNode.appendChild(pC);
	location.appendChild(pC);
	return d0;
}
const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({
	log: true,
	corePath: chrome.runtime.getURL('node_modules/@ffmpeg/core/dist/ffmpeg-core.js'),
});
async function TranscodeAsync() {
	if (!ffmpeg.isLoaded()) {
		await ffmpeg.load();
	}
}
function AudioPlayer(el, buffer, url) {
	// console.log({ wac: window.AudioContext, wvc: window.VideoC });
	this.context = new window.AudioContext();
	this.el = el;
	this.status = false;
	this.button = el.querySelector('.button');
	this.track = el.querySelector('.track');
	this.progress = el.querySelector('.progress');
	//this.scrubber = el.querySelector('.scrubber');
	this.message = el.querySelector('.message');
	this.volume = el.querySelector('.volume');
	//this.message.innerHTML = 'Loading';
	this.bindEvents();
	this.progressCount = el.querySelector('.progressCount');
	this.totalCount = el.querySelector('.totalCount');
	this.updateTime(0, 0);
	if (buffer) {
		this.decode(buffer);
	} else if (url) {
		this.url = url;
		//this.scrubber = el.querySelector('.scrubber');
		this.fetch();
	}
}

AudioPlayer.prototype.bindEvents = function () {
	this.button.addEventListener('click', this.toggle.bind(this));
	//this.scrubber.addEventListener('mousedown', this.onMouseDown.bind(this));
	this.volume.addEventListener('input', this.changeVolume.bind(this));
	//this.scrubber.addEventListener('mousemove', this.onDrag.bind(this));
	//this.scrubber.addEventListener('mouseup', this.onMouseUp.bind(this));
	//window.addEventListener('mousemove', this.onDrag.bind(this));
	//window.addEventListener('mouseup', this.onMouseUp.bind(this));

	this.track.addEventListener('mousedown', this.onPoint.bind(this));
};

AudioPlayer.prototype.active = function () {
	return this.status;
}

AudioPlayer.prototype.fetch = function () {
	const xhr = new XMLHttpRequest();
	xhr.open('GET', this.url, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = function () {
		const { readyState, status, response } = this;
		// console.log(`readyState: ${readyState} - status: ${status}`);
		if (readyState === 4 && status === 200) {
			this.decode(response);
		}
	}.bind(this);
	xhr.send();
};

AudioPlayer.prototype.decode = function (arrayBuffer) {
	this.context.decodeAudioData(arrayBuffer, function (audioBuffer) {
		this.message.innerHTML = '';
		this.buffer = audioBuffer;
		this.draw();
		this.toggle();
		this.status = true;
	}.bind(this)).catch((error) => {
		console.log(error);
	});
};

AudioPlayer.prototype.connect = function () {
	if (this.playing) {
		this.pause();
	}
	this.gainNode = this.context.createGain();
	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	//this.source.connect(this.context.destination);
	this.source.connect(this.gainNode);
	this.gainNode.connect(this.context.destination);
	this.deltaVolume(this.volume);
};


AudioPlayer.prototype.play = function (position) {
	if (this.message.innerHTML == '') {
		this.connect();
		this.position = typeof position === 'number' ? position : this.position || 0;
		this.startTime = this.context.currentTime - (this.position || 0);
		this.source.start(this.context.currentTime, this.position);
		this.playing = true;
	}
};

AudioPlayer.prototype.close = function () {
	this.stop();
	if (this.animated)
		cancelAnimationFrame(this.animated);
};

AudioPlayer.prototype.stop = function () {
	if (this.playing)
		this.pause();

};

AudioPlayer.prototype.pause = function () {
	if (this.source) {
		this.source.stop(0);
		this.source = null;
		this.position = this.context.currentTime - this.startTime;
		this.playing = false;
	}
};

AudioPlayer.prototype.seek = function (time) {
	if (this.playing) {
		this.play(time);
	}
	else {
		this.position = time;
	}
};

AudioPlayer.prototype.updatePosition = function () {
	this.position = this.playing ? this.context.currentTime - this.startTime : this.position;
	if (this.position > this.buffer.duration) {
		this.position = this.buffer.duration;
		this.pause();
	}
	return this.position;
};

AudioPlayer.prototype.formatTime = function (totalSec) {
	//const hours = parseInt( totalSec / 3600 ) % 24;
	//const minutes = parseInt( totalSec / 60 ) % 60;
	const minutes = parseInt(totalSec / 60);
	const seconds = totalSec % 60;
	//return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
	return (minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
};

AudioPlayer.prototype.updateTime = function (progress, total) {
	this.progressCount.innerHTML = progress ? this.formatTime(progress | 0) : "0:00";
	this.totalCount.innerHTML = total ? this.formatTime(total | 0) : "0:00";
};

AudioPlayer.prototype.deltaVolume = function (e) {
	const fraction = parseInt(e.value) / parseInt(e.max);
	// x*x curve (x-squared) sounds better than x (linear)
	if (this.gainNode)
		this.gainNode.gain.value = fraction * fraction;
};

AudioPlayer.prototype.changeVolume = function (e) {
	this.deltaVolume(e.srcElement);
};

AudioPlayer.prototype.toggle = function () {
	this.playing ? this.pause() : this.play();
	if (this.playing) {
		this.button.classList.add('pause');
		this.button.classList.remove('play');
	} else {
		this.button.classList.add('play');
		this.button.classList.remove('pause');
	}
};

AudioPlayer.prototype.onMouseDown = function (e) {
	// console.log("mousedown:" + e.pageX);
	// console.log(this.progress.getBoundingClientRect());
	this.dragging = true;
	this.startX = e.pageX;
	// console.log("startX:" + this.startX);
	this.startLeft = parseInt(this.scrubber.style.left || 0, 10);
};

AudioPlayer.prototype.onDrag = function (e) {
	//console.log("drag:"+e.pageX);
	if (!this.dragging) {
		return;
	}
	const width = this.track.offsetWidth;
	let position = this.startLeft + (e.pageX - this.startX);
	position = Math.max(Math.min(width, position), 0);
	this.scrubber.style.left = position + 'px';
};

AudioPlayer.prototype.onPoint = function (e) {
	let time;
	const divDetails = this.track.getBoundingClientRect();
	if (e.pageX < divDetails.right) {
		if (e.pageX > divDetails.left) {
			time = ((e.pageX - divDetails.left) / this.track.offsetWidth) * this.buffer.duration;
		}
		else {
			time = 0;
		}
	}
	else {
		time = this.buffer.duration;
	}
	this.seek(time);
};

AudioPlayer.prototype.onMouseUp = function () {
	if (this.dragging) {
		const width = this.track.offsetWidth;
		const left = parseInt(this.scrubber.style.left || 0, 10);
		const time = left / width * this.buffer.duration;
		this.seek(time);
		this.dragging = false;
	}
};

AudioPlayer.prototype.draw = function () {
	//if(this.playing)
	//{
	//console.log(this.el.parentNode.querySelectorAll(this.uniqueClass).length);
	//if(this.el.parentNode.querySelector(this.uniqueClass) == null)
	//	console.log("player doesn't exist anymore:" + this.uniqueClass);
	//}
	const uP = this.updatePosition();
	const bD = this.buffer.duration;
	this.updateTime(uP, bD);
	const progress = (uP / bD);
	const width = this.track.offsetWidth;
	//console.log(this.track.offsetWidth);
	this.progress.style.width = (progress * width) + 'px';
	//if (!this.dragging) {
	//	this.scrubber.style.left = ( progress * width ) + 'px';
	//}
	this.animated = requestAnimationFrame(this.draw.bind(this));
};

