!(function(e) {
	(e.fn.teletype = function(t) {
		var i = e.extend({}, e.fn.teletype.defaults, t),
			n = this,
			o = e(this),
			s = null,
			l = { string: "", index: 0, position: 0, loop: 0 },
			a = function() {
				return (
					l.index++,
					l.index >= i.text.length &&
					((l.index = 0), l.loop++, i.loop !== !1 && i.loop == l.loop)
						? !1
						: ((l.position = 0),
							c(),
							"function" == typeof i.callbackNext && i.callbackNext(l, n),
							!0)
				);
			},
			r = function() {
				i.prefix &&
					0 === l.position &&
					0 === l.loop &&
					0 === l.index &&
					e("<span />")
						.addClass("teletype-prefix")
						.html(i.prefix)
						.prependTo(o);
				var t = l.string.split(""),
					c = t[l.position],
					d = l.position + 1;
				if ("^" == c || "~" == c) {
					var f = l.string.substr(d).search(/[^0-9]/);
					-1 == f && (f = l.string.length);
					var y = l.string.substr(d, f);
					if (e.isNumeric(y)) {
						if (((l.string = l.string.replace(c + y, "")), "^" == c))
							window.setTimeout(function() {
								window.setTimeout(r, u(i.typeDelay / 100));
							}, y);
						else {
							var h = l.position - y;
							(l.string = l.string.substr(0, h - 1) + l.string.substr(l.position - 1)),
								window.setTimeout(function() {
									p(Math.max(h, 0));
								}, u(i.backDelay));
						}
						return;
					}
				} else if ("\\" == c) {
					var m = l.string.substr(d, 1);
					"n" == m && (l.position++, (c = "<br />"));
				}
				void 0 !== c && s.html(s.html() + c),
					l.position++,
					l.position < l.string.length
						? window.setTimeout(r, u(i.typeDelay / 100))
						: i.preserve === !1
							? window.setTimeout(function() {
									window.setTimeout(p, u(i.backDelay));
								}, i.delay)
							: (s.html(
									s.html() + '<span class="teletype-prefix">' + i.prefix + "</span>"
								),
								a()
									? window.setTimeout(function() {
											window.setTimeout(r, u(i.typeDelay / 100));
										}, i.delay)
									: "function" == typeof i.callbackFinished && i.callbackFinished(n)),
					"function" == typeof i.callbackType && i.callbackType(c, l, n);
			},
			p = function(e) {
				if ((e || (e = 0), l.position > e))
					s.html(s.html().slice(0, -1)),
						window.setTimeout(function() {
							p(e);
						}, u(i.backDelay)),
						l.position--;
				else {
					if (0 === e && a() === !1) return;
					window.setTimeout(r, u(i.typeDelay / 100));
				}
			},
			u = function(e) {
				var t = parseInt(e);
				return i.humanise && (t += Math.floor(10 * Math.random())), t;
			},
			c = function() {
				l.string = i.text[l.index].replace(/\n/g, "\\n");
			};
		return (
			(this.setCursor = function(t) {
				e(".teletype-cursor", o).text(t);
			}),
			this.each(function() {
				if (
					(c(),
					o.addClass("teletype").empty(),
					(s = e("<span />")
						.addClass("teletype-text")
						.appendTo(o)),
					i.cursor)
				) {
					var t = e("<span />")
						.addClass("teletype-cursor")
						.appendTo(o);
					n.setCursor(i.cursor),
						setInterval(function() {
							t.animate({ opacity: 0 }).animate({ opacity: 1 });
						}, i.blinkSpeed);
				}
				r();
			})
		);
	}),
		(e.fn.teletype.defaults = {
			text: ["one", "two", "three"],
			typeDelay: 1,
			backDelay: 50,
			blinkSpeed: 1e3,
			delay: 1e2,
			cursor: "|",
			preserve: !1,
			prefix: "",
			loop: 0,
			humanise: !0,
			callbackNext: null,
			callbackType: null,
			callbackFinished: null
		});
})(jQuery);

var dt = new Date();
document.getElementById("datetime").innerHTML = "> " + dt.toUTCString();
function teleWrite(id, text, delay) {
	$(id).teletype({
		text: text,
		typeDelay: 1,
		blinkSpeed: 1,
		// backDelay: 20,
		delay: delay,
		cursor: "",
		// cursor: "▋",
		loop: 1,
		// smoothBlink: "true",
		preserve: "true",
		// prefix: "> ",
		humanise: "true"
	});
}
function teleIntro() {
	teleWrite(
		"#protocol1",
		[
			"CONNECTING.....................\nHTTP/1.1\nSTATUS: 200 OK \nServer: Apache/2.2.8 (Ubuntu) mod_ssl/2.2.8 OpenSSL/0.9.8g \nLast-Modified: Sun, 26 Sep 2010 22:04:35 GMT \nETag: '45b6-834-49130cc1182c0' \nAccept-Ranges: bytes \nContent-Length: 12 \nConnection: close \nContent-Type: text/html \n\n",
			"IMPRESSUM: \nFelix Jonesman \nD-54988 West Berlin\nFirst Aeroplan St. 30\nGermany\n"
		],
		1
	);

	teleWrite("#email-wrap", ["E-MAIL: "], 1);
	teleWrite("#email-link", ["info@verfilmung.de"], 1);
	teleWrite("#tel-wrap", ["TEL: "], 1);
	teleWrite("#tel-link", ["+49-912-34-56-789"], 1);
	teleWrite(
		"#protocol2",
		["\nPRESS TEL / EMAIL TO CONTACT OR ANY KEY TO EXIT \n"],
		1
	);
}
$(function() {
	$("#loading-screen").fadeOut(1600, teleIntro());
	// $("#title").teletype({
	// 	text: ["VERFINGUNG", "VERSCHLINGUNG", "VERFILMUNG"],
	// 	typeDelay: 10,
	// 	// backDelay: 20,
	// 	blinkSpeed: 10,
	// 	cursor: "▋",
	// 	smoothBlink: "true",
	// 	// preserve:"true"
	// 	prefix: "> ",
	// 	humanise: "true"
	// });
});