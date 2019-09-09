const data = (function(w, d) {
	return {
		status: { text: '', class: '' },
		msgList: [],
	};
})(window, document);

const elements = (function(w, d, $) {
	return {
		msgInput: $('.js-msg-input'),
		msgSend: $('.js-msg-send'),
		msgBox: $('.js-msg-box'),
		msgList: $('.js-msg-list'),
		alert: $('.js-alert-status'),
	};
})(window, document, jQuery);

function onmessage(event) {
	data.msgList.push({
		text: event.data,
		class: 'list-group-item list-group-item--server',
	});
	console.log('message', event);
}

function onopen(event) {
	console.log('open', event);
	data.status.text = 'Connected';
	data.status.class = 'alert-success';
}

function onerror(event) {
	console.log('error', event);
	data.status.text = 'Error';
	data.status.class = 'alert-danger';
}

function onclose(event) {
	console.log('close', event);
	data.status.text = 'Connection close';
	data.status.class = 'alert-warning';
}

const socket = (function(w, d) {
	const ws = new WebSocket('ws://localhost:8999');
	ws.onopen = onopen;
	ws.onmessage = onmessage;
	ws.onerror = onerror;
	ws.onclose = onclose;
	return ws;
})(window, document);

function render() {
	elements.alert
		.removeClass('alert-success alert-danger alert-warning')
		.addClass(data.status.class)
		.text(data.status.text);
	elements.msgList.html(
		data.msgList
			.map(function(item) {
				return `<li class="${item.class}">${item.text}</li>`;
			})
			.join(''),
	);
}

function trigger(d, e) {
	e.msgSend.click(function() {
		d.msgList.push({
			class: 'list-group-item list-group-item--client',
			text: e.msgInput.val(),
		});
		socket.send(e.msgInput.val());
	});
}

(function(w, d, e) {
	trigger(d, e);
	setInterval(() => {
		d.title = new Date().toLocaleTimeString();
		render(data, e);
	}, 1000);
})(window, data, elements);
