/*
Author       : Dreamguys
Template Name: Preskool - Bootstrap Admin Template
Vanilla JS build - no jQuery. Carousels use Swiper, selects use Choices.js,
date/time pickers use Flatpickr, the rich text editor uses Quill.
*/
(function () {
	"use strict";

	/* ---------- tiny DOM helpers (stand-ins for the jQuery bits we relied on) ---------- */
	function qs(sel, root) { return (root || document).querySelector(sel); }
	function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
	function on(el, evt, handler) { if (el) el.addEventListener(evt, handler); }
	/* event delegation, mirrors $(document).on('click', '.sel', fn) */
	function delegate(root, evt, sel, handler) {
		root.addEventListener(evt, function (e) {
			var target = e.target.closest(sel);
			if (target && root.contains(target)) handler.call(target, e);
		});
	}
	function addClass(el, c) { if (el) el.classList.add(c); }
	function removeClass(el, c) { if (el) el.classList.remove(c); }
	function toggleClass(el, c) { if (el) el.classList.toggle(c); }

	/* jQuery slideDown/slideUp/slideToggle equivalents (height animation) */
	function slideDown(el, duration) {
		if (!el) return;
		el.style.display = "block";
		var height = el.scrollHeight;
		el.style.overflow = "hidden";
		el.style.height = "0px";
		el.style.transition = "height " + duration + "ms ease";
		requestAnimationFrame(function () {
			el.style.height = height + "px";
		});
		setTimeout(function () {
			el.style.removeProperty("height");
			el.style.removeProperty("overflow");
			el.style.removeProperty("transition");
		}, duration);
	}
	function slideUp(el, duration) {
		if (!el) return;
		el.style.overflow = "hidden";
		el.style.height = el.scrollHeight + "px";
		el.style.transition = "height " + duration + "ms ease";
		requestAnimationFrame(function () {
			el.style.height = "0px";
		});
		setTimeout(function () {
			el.style.display = "none";
			el.style.removeProperty("height");
			el.style.removeProperty("overflow");
			el.style.removeProperty("transition");
		}, duration);
	}
	function slideToggle(el, duration) {
		if (!el) return;
		var hidden = getComputedStyle(el).display === "none";
		if (hidden) slideDown(el, duration); else slideUp(el, duration);
	}

	feather.replace();

	/* Page Content Height Resize */
	on(window, "resize", function () {
		var pw = qs(".page-wrapper");
		if (pw) pw.style.minHeight = window.innerHeight + "px";
	});

	/* Loader */
	var loader = document.getElementById("global-loader");
	if (loader) {
		loader.style.transition = "opacity 400ms ease";
		loader.style.opacity = "1";
		setTimeout(function () {
			loader.style.opacity = "0";
			setTimeout(function () { loader.style.display = "none"; }, 400);
		}, 200);
	}

	/* Mobile menu sidebar overlay */
	var wrapper = qs(".main-wrapper");
	document.body.insertAdjacentHTML("beforeend", '<div class="sidebar-overlay"></div>');
	var sidebarOverlay = qs(".sidebar-overlay");

	delegate(document, "click", "#mobile_btn", function () {
		toggleClass(wrapper, "slide-nav");
		toggleClass(sidebarOverlay, "opened");
		addClass(document.documentElement, "menu-opened");
		removeClass(document.getElementById("task_window"), "opened");
		return false;
	});
	on(sidebarOverlay, "click", function () {
		removeClass(document.documentElement, "menu-opened");
		removeClass(this, "opened");
		removeClass(wrapper, "slide-nav");
		removeClass(document.getElementById("task_window"), "opened");
	});

	/* Logo Hide Btn */
	delegate(document, "click", ".hideset", function () {
		var p = this.parentElement && this.parentElement.parentElement && this.parentElement.parentElement.parentElement;
		if (p) p.style.display = "none";
	});
	delegate(document, "click", ".delete-set", function () {
		var p = this.parentElement && this.parentElement.parentElement;
		if (p) p.style.display = "none";
	});

	/* Stick Sidebar - native position:sticky instead of theiaStickySidebar */
	if (window.innerWidth > 767) {
		qsa(".theiaStickySidebar").forEach(function (el) {
			el.style.position = "sticky";
			el.style.top = "30px";
		});
	}

	/* ================= Carousels (Swiper.js replaces Owl Carousel) ================= */
	/* Every entry below mirrors the exact owlCarousel() config that used to live here:
	   items -> slidesPerView, margin -> spaceBetween, same loop/nav/autoplay/rtl/breakpoints.
	   None of the original instances used dots, so none are added here. */
	function toSwiperBreakpoints(owlResponsive) {
		if (!owlResponsive) return undefined;
		var out = {};
		Object.keys(owlResponsive).forEach(function (bp) {
			var v = owlResponsive[bp];
			out[bp] = { slidesPerView: v.items };
		});
		return out;
	}

	function mountCarousel(cfg) {
		var root = qs(cfg.selector);
		if (!root) return;
		addClass(root, "swiper");
		/* markup may already ship with a pre-built .swiper-wrapper/.swiper-slide
		   structure (hand-authored pages) - only build one from scratch when
		   there isn't one yet, so this stays idempotent either way */
		var wrap = root.children.length === 1 && root.children[0].classList.contains("swiper-wrapper")
			? root.children[0]
			: null;
		if (!wrap) {
			var track = root.children.length ? Array.prototype.slice.call(root.children) : [];
			wrap = document.createElement("div");
			wrap.className = "swiper-wrapper";
			track.forEach(function (child) {
				addClass(child, "swiper-slide");
				wrap.appendChild(child);
			});
			root.appendChild(wrap);
		} else {
			qsa(":scope > *", wrap).forEach(function (child) { addClass(child, "swiper-slide"); });
		}

		var swiperOpts = {
			slidesPerView: cfg.items || 1,
			spaceBetween: cfg.margin || 0,
			loop: !!cfg.loop,
			speed: cfg.smartSpeed || 300,
			autoplay: cfg.autoplay ? { delay: 3000, disableOnInteraction: false } : false,
			rtl: !!cfg.rtl,
			allowTouchMove: cfg.touchDrag === false && cfg.mouseDrag === false ? false : true,
			breakpoints: toSwiperBreakpoints(cfg.responsive)
		};

		if (cfg.nav) {
			var prevBtn = document.createElement("button");
			prevBtn.type = "button";
			prevBtn.className = "owl-prev";
			prevBtn.innerHTML = (cfg.navText && cfg.navText[0]) || '<i class="fas fa-chevron-left"></i>';
			var nextBtn = document.createElement("button");
			nextBtn.type = "button";
			nextBtn.className = "owl-next";
			nextBtn.innerHTML = (cfg.navText && cfg.navText[1]) || '<i class="fas fa-chevron-right"></i>';
			if (cfg.navContainer) {
				/* these placeholders already exist in the markup with class
				   "owl-nav slide-navN nav-control" - drop the buttons straight in */
				var navHost = qs(cfg.navContainer);
				if (navHost) { navHost.appendChild(prevBtn); navHost.appendChild(nextBtn); }
			} else {
				/* no static placeholder: Owl used to inject its own .owl-nav wrapper
				   inside the carousel itself - reproduce that */
				var navWrap = document.createElement("div");
				navWrap.className = "owl-nav";
				navWrap.appendChild(prevBtn);
				navWrap.appendChild(nextBtn);
				root.appendChild(navWrap);
			}
			swiperOpts.navigation = { nextEl: nextBtn, prevEl: prevBtn };
		}

		if (cfg.watchSlidesProgress) swiperOpts.watchSlidesProgress = true;

		var instance = new Swiper(root, swiperOpts);
		if (cfg.onReady) cfg.onReady(instance, root);
		return instance;
	}

	var CAROUSELS = [
		{ selector: ".product-slide", items: 1, margin: 30, nav: true, loop: false,
			responsive: { 0: { items: 1 }, 800: { items: 1 }, 1170: { items: 1 } } },
		{ selector: ".notes-slider", items: 1, margin: 24, nav: true, loop: true, smartSpeed: 2000,
			navContainer: ".slide-nav5", navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 }, 768: { items: 2 }, 1300: { items: 3 } } },
		{ selector: ".owl-product", items: 2, margin: 10, nav: true, loop: false, touchDrag: false, mouseDrag: false,
			responsive: { 0: { items: 2 }, 768: { items: 4 }, 1170: { items: 8 } } },
		{ selector: ".folders-carousel", items: 2, margin: 15, nav: true, loop: true,
			navContainer: ".slide-nav6", navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 }, 768: { items: 2 }, 1400: { items: 3 } } },
		{ selector: ".files-carousel", items: 3, margin: 15, nav: true, loop: true, smartSpeed: 1000,
			navContainer: ".slide-nav7", navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3 } } },
		{ selector: ".total-periods-slider", items: 4, margin: 5, nav: false, loop: true, autoplay: false, smartSpeed: 1000,
			responsive: { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 1200: { items: 3 }, 1401: { items: 4 }, 1801: { items: 5 } } },
		{ selector: ".time-table-slider", items: 4, margin: 5, nav: false, loop: true, autoplay: false, smartSpeed: 1000,
			responsive: { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 1200: { items: 5 }, 1401: { items: 6 }, 1801: { items: 7 } } },
		{ selector: ".routine-slider", items: 4, margin: 15, nav: false, loop: true, autoplay: false, smartSpeed: 1000,
			responsive: { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 1200: { items: 2 }, 1300: { items: 3 }, 1400: { items: 4 } } },
		{ selector: ".inner-pages-slider", items: 5, margin: 15, nav: true, loop: true, smartSpeed: 1000,
			navContainer: ".slide-nav2", navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 }, 768: { items: 3 }, 1200: { items: 5 } } },
		{ selector: ".teachers-profile-slider", items: 5, margin: 15, nav: true, loop: true, smartSpeed: 1000,
			navContainer: ".slide-nav", navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 }, 768: { items: 3 }, 1200: { items: 5 } } },
		{ selector: ".link-slider", items: 3, margin: 24, nav: false, loop: true, autoplay: false, smartSpeed: 1000,
			responsive: { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 1200: { items: 3 }, 1400: { items: 2 }, 1500: { items: 3 } } },
		{ selector: ".link-slider-rtl", items: 3, margin: 24, nav: false, loop: true, autoplay: false, smartSpeed: 1000, rtl: true,
			responsive: { 0: { items: 1 }, 576: { items: 2 }, 768: { items: 3 }, 1200: { items: 3 }, 1400: { items: 2 }, 1500: { items: 3 } } },
		{ selector: ".student-slider", margin: 24, nav: true, loop: true, autoplay: false, smartSpeed: 1000,
			navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 } } },
		{ selector: ".student-slider-rtl", margin: 24, nav: true, loop: true, autoplay: false, smartSpeed: 1000, rtl: true,
			navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 } } },
		{ selector: ".teacher-slider", margin: 24, nav: true, loop: true, autoplay: false, smartSpeed: 1000,
			navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 } } },
		{ selector: ".teacher-slider-rtl", margin: 24, nav: true, loop: true, autoplay: false, smartSpeed: 1000, rtl: true,
			navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			responsive: { 0: { items: 1 } } },
		{ selector: ".lesson", items: 3, margin: 15, nav: true, loop: true, smartSpeed: 1000,
			navContainer: ".slide-nav3", navText: ['<i class="ti ti-chevron-left"></i>', '<i class="ti ti-chevron-right"></i>'],
			responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 4 } } },
		{ selector: ".task-slider", items: 3, margin: 15, nav: true, loop: true, smartSpeed: 1000,
			navContainer: ".slide-nav2", navText: ['<i class="ti ti-chevron-left"></i>', '<i class="ti ti-chevron-right"></i>'],
			responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 4 }, 1400: { items: 4 } } }
	];
	CAROUSELS.forEach(mountCarousel);

	/* video-slide: Plyr video players + pause-others-on-slide-change */
	var videoSlideInstance = mountCarousel({
		selector: ".video-slide", items: 4, margin: 24, nav: true, loop: true, autoplay: true, smartSpeed: 1000,
		navText: ['<i class="fa fa-angle-left" data-bs-toggle="tooltip" title="fa fa-angle-left"></i>', '<i class="fa fa-angle-right" data-bs-toggle="tooltip" title="fa fa-angle-right"></i>'],
		responsive: { 0: { items: 1 }, 500: { items: 1 }, 768: { items: 3 }, 991: { items: 3 }, 1200: { items: 4 }, 1401: { items: 4 } }
	});

	/* pos-category: separate instance with its own breakpoints */
	mountCarousel({
		selector: ".pos-category", items: 6, margin: 8, nav: true, loop: false, autoplay: false, smartSpeed: 1000,
		navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
		responsive: { 0: { items: 2 }, 500: { items: 3 }, 768: { items: 4 }, 991: { items: 5 }, 1200: { items: 6 }, 1401: { items: 6 } }
	});

	/* video-section: has Plyr players synced to slide changes, plus dropdown reposition fix */
	var videoSection = qs(".video-section");
	if (videoSection) {
		var videoSectionInstance = mountCarousel({
			selector: ".video-section", items: 3, margin: 15, nav: true, loop: true, smartSpeed: 1000,
			navContainer: ".slide-nav8", navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
			watchSlidesProgress: true,
			responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3 } }
		});

		var playerSettings = {
			controls: ["play-large"],
			fullscreen: { enabled: false },
			resetOnEnd: true,
			hideControls: true,
			clickToPlay: true,
			keyboard: false
		};
		var players = Plyr.setup(".js-player", playerSettings);
		players.forEach(function (instance) {
			instance.on("play", function () {
				players.forEach(function (instance1) {
					if (instance !== instance1) instance1.pause();
				});
			});
		});
		if (videoSectionInstance) {
			videoSectionInstance.on("slideChange", function () {
				players.forEach(function (instance) { instance.pause(); });
			});
		}
	}
	/* Bootstrap dropdown menus inside these carousels need to escape the slide's
	   overflow:hidden, same fix the jQuery version applied via translated.owl.carousel */
	qsa(".video-section, .files-carousel, .folders-carousel").forEach(function (carousel) {
		delegate(carousel, "show.bs.dropdown", "[data-bs-toggle=dropdown]", function () {
			var dropdown = bootstrap.Dropdown.getInstance(this);
			if (dropdown && dropdown._menu) carousel.insertAdjacentElement("afterend", dropdown._menu);
			var menu = this.nextElementSibling;
			if (menu && menu.classList.contains("dropdown-menu")) carousel.insertAdjacentElement("afterend", menu);
		});
	});

	qsa(".notes-tog").forEach(function (el) {
		on(el, "click", function () {
			toggleClass(qs(".section-bulk-widget"), "section-notes-dashboard");
			toggleClass(qs(".budget-role-notes"), "budgeted-role-notes");
			toggleClass(qs(".notes-page-wrapper"), "notes-tag-left");
		});
	});

	/* image file upload preview */
	function readURL(input) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				var blah = document.getElementById("blah");
				if (blah) blah.src = e.target.result;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}
	var imgInp = document.getElementById("imgInp");
	on(imgInp, "change", function () { readURL(this); });

	/* ================= Flatpickr (replaces bootstrap-datetimepicker + daterangepicker) ================= */
	function mountFlatpickr(sel, opts) {
		qsa(sel).forEach(function (el) {
			flatpickr(el, opts);
		});
	}
	mountFlatpickr(".datetimepicker", { dateFormat: "d-m-Y" });
	mountFlatpickr(".datetimepicker-dmy", { dateFormat: "d/m/Y" });
	mountFlatpickr(".yearpicker", { dateFormat: "M Y" });
	mountFlatpickr(".datepic", { dateFormat: "d-m-Y", inline: true });
	mountFlatpickr(".timepicker", { enableTime: true, noCalendar: true, dateFormat: "h:i K", time_24hr: false });
	mountFlatpickr(".bookingrange", { mode: "range", dateFormat: "n/j/Y", defaultDate: [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()] });
	mountFlatpickr('input[name="datetimes"]', { enableTime: true, dateFormat: "n/d h:i K" });
	/* Date fields living inside a Bootstrap dropdown-menu (e.g. the "Filters" panel
	   on list pages) need `static: true` - flatpickr appends the calendar to <body>
	   by default, which puts it outside the dropdown-menu's DOM subtree and makes
	   Bootstrap's data-bs-auto-close="outside" treat a click on a day as an outside
	   click and close the whole filter panel before the pick registers. `static`
	   keeps the calendar nested inside the input's own wrapper instead. */
	mountFlatpickr(".filter-datepicker", { dateFormat: "d M Y", static: true });
	mountFlatpickr(".filter-daterange", { mode: "range", dateFormat: "d M Y", rangeSeparator: " - ", static: true });

	/* toggle-password (three near-identical variants kept, matching the original) */
	function wireTogglePassword(triggerClass, inputSelector) {
		if (!qs("." + triggerClass)) return;
		delegate(document, "click", "." + triggerClass, function () {
			toggleClass(this, "ti-eye");
			toggleClass(this, "ti-eye-off");
			var input = qs(inputSelector, this.parentElement) || qs(inputSelector);
			if (input) input.type = input.type === "password" ? "text" : "password";
		});
	}
	wireTogglePassword("toggle-password", ".pass-input");
	wireTogglePassword("toggle-passwords", ".pass-inputs");
	delegate(document, "click", ".toggle-passworda", function () {
		toggleClass(this, "ti-eye");
		toggleClass(this, "ti-eye-off");
		var input = qs(".pass-inputa", this.parentElement) || qs(".pass-inputa");
		if (input) input.type = input.type === "password" ? "text" : "password";
	});

	/* Coming Soon countdown (already vanilla) */
	if (qs(".comming-soon-pg")) {
		var day = qs(".days"), hour = qs(".hours"), minute = qs(".minutes"), second = qs(".seconds");
		(function setCountdown() {
			var countdownDate = new Date("Sep 30, 2026 16:00:00").getTime();
			var updateCount = setInterval(function () {
				var distance = countdownDate - new Date().getTime();
				day.textContent = Math.floor(distance / 864e5);
				hour.textContent = Math.floor((distance % 864e5) / 36e5);
				minute.textContent = Math.floor((distance % 36e5) / 6e4);
				second.textContent = Math.floor((distance % 6e4) / 1000);
				if (distance < 0) {
					clearInterval(updateCount);
					qs(".comming-soon-pg").innerHTML = "<h1>EXPIRED</h1>";
				}
			}, 1000);
		})();
	}

	/* ================= Choices.js (replaces Select2) ================= */
	function mountChoices(el, opts) {
		if (el.dataset.choicesBound) return el._choices;
		el.dataset.choicesBound = "1";
		var inst = new Choices(el, Object.assign({
			shouldSort: false,
			itemSelectText: ""
		}, opts || {}));
		el._choices = inst;
		return inst;
	}
	function mountChoicesAll(sel, opts) {
		qsa(sel).forEach(function (el) { mountChoices(el, opts); });
	}
	/* searchable multi/single select */
	mountChoicesAll(".select2");
	/* plain single select, no search box (matches the old minimumResultsForSearch:-1, width:'100%') */
	mountChoicesAll(".select", { searchEnabled: false });

	/* ================= Step wizard (replaces the twitter-bootstrap-wizard jQuery plugin) ================= */
	qsa(".twitter-bs-wizard").forEach(function (wizard) {
		var links = qsa(".twitter-bs-wizard-nav .nav-link", wizard);
		function currentIndex() { return links.findIndex(function (l) { return l.classList.contains("active"); }); }
		function showStep(index) {
			if (index < 0 || index >= links.length) return;
			new bootstrap.Tab(links[index]).show();
		}
		links.forEach(function (link) {
			on(link, "click", function (e) {
				e.preventDefault();
				new bootstrap.Tab(this).show();
			});
			on(link, "shown.bs.tab", function () {
				var idx = currentIndex();
				links.forEach(function (l, i) { l.closest(".nav-item").classList.toggle("done", i < idx); });
			});
		});
		delegate(wizard, "click", ".pager .next a, .pager.next a", function (e) {
			e.preventDefault();
			showStep(currentIndex() + 1);
		});
		delegate(wizard, "click", ".pager .previous a, .pager.previous a", function (e) {
			e.preventDefault();
			showStep(currentIndex() - 1);
		});
	});

	/* ================= Choices.js text-tags (replaces bootstrap-tagsinput) ================= */
	qsa('[data-role="tagsinput"]').forEach(function (el) {
		var initial = (el.value || "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
		el.value = "";
		new Choices(el, {
			items: initial,
			addItems: true,
			removeItemButton: true,
			duplicateItemsAllowed: false,
			paste: true,
			editItems: true
		});
	});

	/* ================= counters (two selector families in the original: .counter via counterUp, .counters via manual animate) ================= */
	function countUpTo(el, to, duration) {
		var start = null;
		var from = parseFloat((el.textContent || "0").replace(/[^\d.-]/g, "")) || 0;
		function step(ts) {
			if (!start) start = ts;
			var progress = Math.min((ts - start) / duration, 1);
			el.textContent = Math.floor(from + (to - from) * progress);
			if (progress < 1) requestAnimationFrame(step);
			else el.textContent = to;
		}
		requestAnimationFrame(step);
	}
	qsa(".counter").forEach(function (el) {
		var to = parseFloat((el.textContent || "0").replace(/[^\d.-]/g, "")) || 0;
		countUpTo(el, to, 2000);
	});
	qsa(".counters").forEach(function (el) {
		var to = parseFloat(el.getAttribute("data-count")) || 0;
		countUpTo(el, to, 2000);
	});

	/* jQuery countdown plugin demo widgets (ui-counter.html) - small vanilla equivalent */
	function mountCountdownWidget(id, opts) {
		var el = document.getElementById(id);
		if (!el) return;
		var remaining = opts.from;
		var to = opts.to || 0;
		var dir = remaining <= to ? 1 : -1;
		function render() {
			var totalSeconds = Math.max(remaining, 0);
			var d = Math.floor(totalSeconds / 86400);
			var h = Math.floor((totalSeconds % 86400) / 3600);
			var m = Math.floor((totalSeconds % 3600) / 60);
			var s = Math.floor(totalSeconds % 60);
			if (opts.outputPattern) {
				el.textContent = opts.outputPattern
					.replace("$day", d).replace("$hour", h).replace("$minute", m).replace("$second", s);
			} else {
				el.textContent = (d ? d + "d " : "") + String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
			}
		}
		render();
		var timer = setInterval(function () {
			remaining += dir;
			render();
			if (remaining === to) {
				clearInterval(timer);
				if (opts.timerEnd) opts.timerEnd.call({ css: function () { el.style.textDecoration = "line-through"; el.style.opacity = 0.5; return this; }, animate: function () {} });
			}
		}, 1000);
	}
	mountCountdownWidget("timer-countdown", { from: 180, to: 0, outputPattern: "$day Day $hour : $minute : $second" });
	mountCountdownWidget("timer-countup", { from: 0, to: 180 });
	mountCountdownWidget("timer-countinbetween", { from: 30, to: 20 });
	mountCountdownWidget("timer-countercallback", { from: 10, to: 0, timerEnd: function () { this.css({ "text-decoration": "line-through" }).animate({ opacity: .5 }, 500); } });
	mountCountdownWidget("timer-outputpattern", { from: 60 * 60 * 24 * 3, to: 0, outputPattern: "$day Days $hour Hour $minute Min $second Sec.." });

	/* ================= Quill.js (replaces Summernote) ================= */
	function mountQuill(sel, opts) {
		var el = typeof sel === "string" ? document.getElementById(sel) : sel;
		if (!el) return;
		var holder = document.createElement("div");
		el.insertAdjacentElement("afterend", holder);
		el.style.display = "none";
		var quill = new Quill(holder, Object.assign({ theme: "snow" }, opts || {}));
		if (opts && opts.placeholder) quill.root.dataset.placeholder = opts.placeholder;
		var form = el.closest("form");
		function sync() { el.value = quill.root.innerHTML; }
		quill.on("text-change", sync);
		if (form) on(form, "submit", sync);
		return quill;
	}
	mountQuill("summernote", { placeholder: "" });
	mountQuill("summernote2", { placeholder: "" });
	mountQuill("summernote3", { placeholder: "Type your message" });
	mountQuill("summernote5", { placeholder: "" });
	qsa(".summernote").forEach(function (el) {
		mountQuill(el, {
			modules: { toolbar: [["bold", "italic", "underline", "strike"], [{ size: ["small", false, "large"] }], ["image"]] }
		});
	});

	/* ================= Sidebar scroll height (replaces jQuery slimScroll) ================= */
	/* The visible thin scrollbar comes from existing CSS (::-webkit-scrollbar on
	   .sidebar-inner); slimScroll's only real job was giving the sidebar an explicit
	   pixel height so overflow:auto can kick in - reproduced directly here. */
	var slimScrolls = qsa(".slimscroll").filter(function (el) {
		return !(el.parentElement && el.parentElement.classList.contains("chat-messages") && el.parentElement.parentElement && el.parentElement.parentElement.classList.contains("chat"));
	});
	function applySlimscrollHeight() {
		var h = window.innerHeight - 60;
		slimScrolls.forEach(function (el) { el.style.height = h + "px"; el.style.overflowY = "auto"; });
		var sidebarInner = qs(".sidebar .sidebar-inner");
		if (sidebarInner) sidebarInner.style.height = h + "px";
	}
	if (slimScrolls.length > 0) {
		applySlimscrollHeight();
		on(window, "resize", applySlimscrollHeight);
	}
	/* right-user-side chat contact list: mirrors the old .slimScrollDiv height rules */
	qsa(".right-user-side .slimscroll").forEach(function (el) {
		var audio = el.closest(".right-user-side.audio");
		el.style.height = audio ? "calc(100vh - 305px)" : "calc(100vh - 110px)";
		el.style.overflowY = "auto";
	});

	/* Sidebar submenu open/close */
	function initSidebarMenu() {
		qsa(".sidebar-menu a").forEach(function (a) {
			on(a, "click", function (e) {
				var li = this.parentElement;
				if (li && li.classList.contains("submenu")) e.preventDefault();
				var parentUl = this.closest("ul");
				var self = this;
				if (!this.classList.contains("subdrop")) {
					var next = this.nextElementSibling;
					if (parentUl) {
						qsa("ul", parentUl).forEach(function (ul) { if (ul !== next) slideUp(ul, 250); });
						qsa("a", parentUl).forEach(function (a2) { if (a2 !== self) removeClass(a2, "subdrop"); });
					}
					if (next && next.tagName === "UL") slideDown(next, 350);
					addClass(this, "subdrop");
				} else {
					removeClass(this, "subdrop");
					var next2 = this.nextElementSibling;
					if (next2 && next2.tagName === "UL") slideUp(next2, 350);
				}
			});
		});
		var activeLink = qs(".sidebar-menu ul li.submenu a.active");
		if (activeLink) {
			var lastLi = activeLink.closest("li");
			/* Walk up only through ancestor <li>s that are themselves submenu
			   containers. Some sections wrap their top-level items in a plain
			   (non-submenu) <li> alongside a <h6 class="submenu-hdr"> category
			   label - climbing into that wrapper and grabbing its first
			   descendant <a> would land on a sibling item that has nothing to
			   do with the active page. */
			var parentLi = lastLi && lastLi.parentElement && lastLi.parentElement.closest("li");
			while (parentLi && parentLi.classList.contains("submenu")) {
				lastLi = parentLi;
				parentLi = lastLi.parentElement && lastLi.parentElement.closest("li");
			}
			var firstA = lastLi && lastLi.querySelector("a");
			if (firstA) {
				addClass(firstA, "active");
				/* The static markup already ships the whole active trail pre-marked
				   with subdrop (CSS shows .active.subdrop's sibling <ul> via an
				   !important rule regardless of JS). Only simulate a click - which
				   TOGGLES open/closed - when it isn't already open, otherwise this
				   would close the very section it's supposed to reveal. */
				if (!firstA.classList.contains("subdrop")) firstA.click();
			}
		}
	}
	initSidebarMenu();

	setTimeout(function () {
		var sidebarInner = qs(".sidebar .sidebar-inner");
		var actives = qsa(".sidebar-menu a.active");
		var active = actives[actives.length - 1];
		if (sidebarInner && active) {
			var containerRect = sidebarInner.getBoundingClientRect();
			var activeRect = active.getBoundingClientRect();
			var offset = sidebarInner.scrollTop + (activeRect.top - containerRect.top) - (sidebarInner.clientHeight / 2) + (activeRect.height / 2);
			sidebarInner.scrollTop = offset;
		}
	}, 400);

	on(document, "mouseover", function (e) {
		e.stopPropagation();
		if (document.body.classList.contains("mini-sidebar")) {
			var toggleBtn = document.getElementById("toggle_btn");
			if (toggleBtn && toggleBtn.offsetParent !== null) {
				var targ = e.target.closest(".sidebar, .header-left");
				if (targ) {
					addClass(document.body, "expand-menu");
					qsa(".subdrop").forEach(function (el) { var n = el.nextElementSibling; if (n) slideDown(n, 0); });
				} else {
					removeClass(document.body, "expand-menu");
					qsa(".subdrop").forEach(function (el) { var n = el.nextElementSibling; if (n) slideUp(n, 0); });
				}
				return false;
			}
		}
	});

	/* Table Responsive */
	setTimeout(function () {
		qsa(".table").forEach(function (t) {
			if (t.parentElement) addClass(t.parentElement, "table-responsive");
		});
	}, 1000);

	/* toggle_btn (mini-sidebar) */
	delegate(document, "click", "#toggle_btn", function () {
		if (document.body.classList.contains("mini-sidebar")) {
			removeClass(document.body, "mini-sidebar");
			addClass(this, "active");
			localStorage.setItem("screenModeNightTokenState", "night");
			setTimeout(function () {
				removeClass(document.body, "mini-sidebar");
				addClass(qs(".header-left"), "active");
			}, 100);
		} else {
			addClass(document.body, "mini-sidebar");
			removeClass(this, "active");
			localStorage.removeItem("screenModeNightTokenState");
			setTimeout(function () {
				addClass(document.body, "mini-sidebar");
				removeClass(qs(".header-left"), "active");
			}, 100);
		}
		return false;
	});

	/* Advance Tabs */
	delegate(document, "click", ".next", function () {
		var active = qs(".nav-tabs .active");
		var li = active && active.closest("li");
		var nextLi = li && li.nextElementSibling;
		var link = nextLi && nextLi.querySelector("a");
		if (link) new bootstrap.Tab(link).show();
	});
	delegate(document, "click", ".previous", function () {
		var active = qs(".nav-tabs .active");
		var li = active && active.closest("li");
		var prevLi = li && li.previousElementSibling;
		var link = prevLi && prevLi.querySelector("a");
		if (link) new bootstrap.Tab(link).show();
	});

	on(qs(".submenus"), "click", function () { addClass(document.body, "sidebarrightmenu"); });
	on(document.getElementById("searchdiv"), "click", function () { addClass(qs(".searchinputs"), "show"); });
	on(qs(".search-addon span"), "click", function () { removeClass(qs(".searchinputs"), "show"); });

	["filter_search", "filter_search1", "filter_search2", "filter_search3"].forEach(function (id) {
		delegate(document, "click", "#" + id, function () {
			var target = document.getElementById(id.replace("filter_search", "filter_inputs"));
			slideToggle(target, 400);
		});
	});
	delegate(document, "click", "#filter_search", function () { toggleClass(this, "setclose"); });
	delegate(document, "click", "#filter_search1", function () { toggleClass(this, "setclose"); });
	delegate(document, "click", ".productset", function () { toggleClass(this, "active"); });
	delegate(document, "click", ".product-info", function () { toggleClass(this, "active"); });
	delegate(document, "click", ".layout-box", function () { toggleClass(qs(".layout-hide-box"), "layout-show-box"); });
	delegate(document, "click", ".select-option1", function () { addClass(qs(".select-color-add"), "selected-color-add"); });

	function exclusiveActive(sel) {
		qsa(sel).forEach(function (el) {
			on(el, "click", function () {
				qsa(sel).forEach(function (e2) { removeClass(e2, "active"); });
				addClass(this, "active");
			});
		});
	}
	exclusiveActive(".bank-box");
	exclusiveActive(".theme-image");
	exclusiveActive(".themecolorset");
	exclusiveActive(".theme-layout");

	/* Increment/decrement (kept as two families to match the two independent
	   implementations that existed side by side in the original file) */
	qsa(".inc.button").forEach(function (btn) {
		on(btn, "click", function () {
			var input = this.previousElementSibling;
			var newValue = (parseInt(input.value, 10) || 0) + 1;
			input.value = newValue;
		});
	});
	qsa(".dec.button").forEach(function (btn) {
		on(btn, "click", function () {
			var input = this.nextElementSibling;
			var newValue = (parseInt(input.value, 10) || 0) - 1;
			input.value = newValue;
		});
	});
	function updateValue(el, delta) {
		var item = el.parentElement && el.parentElement.querySelector("input");
		if (!item) return;
		var newValue = (parseInt(item.value, 10) || 0) + delta;
		item.value = Math.max(newValue, 0);
	}
	delegate(document, "click", ".inc", function () { updateValue(this, 1); });
	delegate(document, "click", ".dec", function () { updateValue(this, -1); });

	if (qs(".custom-file-container") && window.FileUploadWithPreview) {
		new FileUploadWithPreview("myFirstImage");
		new FileUploadWithPreview("mySecondImage");
	}

	if (qs(".select-color-add")) {
		var colorSelect = document.getElementById("colorSelect");
		var inputBox = document.getElementById("inputBox");
		var inputShow = document.getElementById("input-show");
		var variantTable = document.getElementById("variant-table");
		on(colorSelect, "change", function () {
			inputShow.style.display = "block";
			variantTable.style.display = "block";
			inputBox.value = colorSelect.value;
		});
	}

	delegate(document, "click", ".win-maximize", function () {
		if (!document.fullscreenElement) document.documentElement.requestFullscreen();
		else if (document.exitFullscreen) document.exitFullscreen();
	});

	delegate(document, "click", "#check_all", function () {
		qsa(".checkmail").forEach(function (el) { el.click(); });
		return false;
	});
	qsa(".checkmail").forEach(function (el) {
		on(el, "click", function () {
			var tr = this.closest("tr");
			if (tr) toggleClass(tr, "checked");
		});
	});

	/* Popover / Tooltip */
	qsa('[data-bs-toggle="popover"]').forEach(function (el) { new bootstrap.Popover(el); });
	if (qs('[data-bs-toggle="tooltip"]')) {
		qsa('[data-bs-toggle="tooltip"]').forEach(function (el) { new bootstrap.Tooltip(el); });
	}

	/* Chat */
	var chatAppTarget = qs(".main-chat-blk");
	(function () {
		if (window.innerWidth > 991 && chatAppTarget) removeClass(chatAppTarget, "chat-open");
		delegate(document, "click", ".left-sidebar-wrap .user-list-item > a", function () {
			if (window.innerWidth <= 991) addClass(chatAppTarget, "chat-open");
			return false;
		});
		delegate(document, "click", ".chat-header .left_sides", function () {
			if (window.innerWidth <= 991) removeClass(chatAppTarget, "chat-open");
			return false;
		});
	})();

	delegate(document, "click", ".mail-important", function () {
		var icon = this.querySelector("i.fa");
		if (icon) { toggleClass(icon, "fa-star"); toggleClass(icon, "fa-star-o"); }
	});

	function wireSelectAll(triggerSel, itemSel) {
		var trigger = qs(triggerSel);
		on(trigger, "click", function () {
			qsa(itemSel).forEach(function (cb) { cb.checked = trigger.checked; });
		});
	}
	wireSelectAll("#select-all2", ".form-check.form-check-md :checkbox");
	wireSelectAll("#select-all3", ".form-check.form-check-md :checkbox");
	wireSelectAll("#select-all", ":checkbox");

	/* OTP digit group */
	qsa(".digit-group input").forEach(function (input) {
		input.maxLength = 1;
		on(input, "keyup", function (e) {
			var parent = this.parentElement;
			if (e.keyCode === 8 || e.keyCode === 37) {
				var prev = parent.querySelector("input#" + this.dataset.previous);
				if (prev) prev.select();
			} else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
				var next = parent.querySelector("input#" + this.dataset.next);
				if (next) next.select();
				else if (parent.dataset.autosubmit) parent.closest("form") && parent.closest("form").submit();
			}
		});
		on(input, "keyup", function () {
			toggleClass(this, "active");
			if (this.value !== "") addClass(this, "active"); else removeClass(this, "active");
		});
	});

	/* Top online contacts (was already vanilla Swiper) */
	if (qs(".top-online-contacts .swiper-container")) {
		new Swiper(".top-online-contacts .swiper-container", { slidesPerView: 5, spaceBetween: 15 });
	}

	delegate(document, "click", ".dream_profile_menu", function () {
		addClass(qs(".right-side-contact"), "show-right-sidebar");
		removeClass(qs(".right-side-contact"), "hide-right-sidebar");
		if (window.innerWidth < 992) {
			qsa(".chat:not(.right-side-contact .chat)").forEach(function (el) { addClass(el, "hide-chatbar"); });
			qsa(".chat:not(.right_side_star .chat)").forEach(function (el) { addClass(el, "hide-chatbar"); });
		}
	});
	delegate(document, "click", ".close_profile", function () {
		addClass(qs(".right-side-contact"), "hide-right-sidebar");
		removeClass(qs(".right-side-contact"), "show-right-sidebar");
		if (window.innerWidth < 992) qsa(".chat").forEach(function (el) { removeClass(el, "hide-chatbar"); });
	});

	delegate(document, "click", ".emoj-action", function () { slideToggle(qs(".emoj-group-list"), 200); });
	delegate(document, "click", ".emoj-action-foot", function () { slideToggle(qs(".emoj-group-list-foot"), 200); });

	var customInput = qs(".custom-input");
	if (customInput) {
		on(customInput, "input", function () {
			var progress = (customInput.value - customInput.min) / (customInput.max - customInput.min) * 100;
			customInput.style.background = "linear-gradient(to top, var(--md-sys-color-on-surface-variant) 0%, var(--md-sys-color-on-surface-variant) " + progress + "%, var(--md-sys-color-surface-variant) " + progress + "%, var(--md-sys-color-surface-variant) 100%)";
		});
	}

	/* Video call mute toggles */
	function wireMuteToggle(sel, iconSel, offClass, onClass, titleOn, titleOff, extra) {
		delegate(document, "click", sel, function () {
			var el = this;
			var stopping = !el.classList.contains("stop");
			toggleClass(el, "stop");
			qsa(iconSel).forEach(function (i) {
				removeClass(i, stopping ? onClass : offClass);
				addClass(i, stopping ? offClass : onClass);
			});
			if (el.hasAttribute("data-bs-original-title")) el.setAttribute("data-bs-original-title", stopping ? titleOff : titleOn);
			if (extra) extra(stopping);
		});
	}
	wireMuteToggle(".mute-video", ".mute-video i", "bx-video-off", "bx-video", "Stop Camera", "Start Camera", function (stopping) {
		qsa(".join-call .join-video").forEach(function (el) { toggleClass(el, "video-hide"); });
		qsa(".video-avatar").forEach(function (el) { toggleClass(el, "active"); });
		qsa(".meeting .join-video.user-active").forEach(function (el) { toggleClass(el, "video-hide"); });
		qsa(".join-video.user-active .more-icon").forEach(function (el) { toggleClass(el, "vid-view"); });
		qsa(".action-info.vid-view li .mute-vid i").forEach(function (el) {
			removeClass(el, stopping ? "feather-video-off" : "feather-video");
			addClass(el, stopping ? "feather-video" : "feather-video-off");
		});
	});
	wireMuteToggle(".mute-bt", ".mute-bt i", "bx-microphone-off", "bx-microphone", "Unmute Audio", "Mute Audio", function () {
		qsa(".join-video.user-active .more-icon").forEach(function (el) { toggleClass(el, "mic-view"); });
		qsa(".add-list .user-active .action-info").forEach(function (el) { toggleClass(el, "vid-view"); });
	});
	delegate(document, "click", ".other-mic-off i", function () {
		var parent = this.parentElement;
		var stopping = !parent.classList.contains("stop");
		toggleClass(parent, "stop");
		removeClass(this, stopping ? "bx-microphone-off" : "bx-microphone");
		addClass(this, stopping ? "bx-microphone" : "bx-microphone-off");
	});
	delegate(document, "click", ".other-video-off i", function () {
		var parent = this.parentElement;
		var stopping = !parent.classList.contains("stop");
		toggleClass(parent, "stop");
		removeClass(this, stopping ? "bx-video-off" : "bx-video");
		addClass(this, stopping ? "bx-video" : "bx-video-off");
	});

	delegate(document, "click", ".close_profile", function () {
		removeClass(qs(".right-user-side"), "open-message");
		addClass(qs(".chat-center-blk .card-comman"), "chat-center-space");
		removeClass(qs(".video-screen-inner"), "video-space");
		removeClass(qs(".right-side-party"), "open-message");
		removeClass(qs(".meeting-list"), "add-meeting");
		removeClass(document.getElementById("chat-room"), "open-chats");
		addClass(qs(".call-user-side"), "add-setting");
	});
	delegate(document, "click", ".profile-open", function () {
		removeClass(qs(".right-user-side"), "add-setting");
		removeClass(qs(".chat-center-blk .card-comman"), "chat-center-space");
	});
	delegate(document, "click", "#call-chat", function () {
		addClass(qs(".right-user-side"), "open-message");
		addClass(qs(".video-screen-inner"), "video-space");
	});
	delegate(document, "click", "#add-partispant", function () {
		addClass(qs(".right-side-party"), "open-message");
		removeClass(document.getElementById("chat-room"), "open-chats");
		addClass(qs(".meeting-list"), "add-meeting");
	});
	delegate(document, "click", "#show-message", function () {
		addClass(document.getElementById("chat-room"), "open-chats");
		removeClass(qs(".right-side-party"), "open-message");
		addClass(qs(".meeting-list"), "add-meeting");
	});

	delegate(document, "click", ".chat-search-btn", function () { addClass(qs(".chat-search"), "visible-chat"); });
	delegate(document, "click", ".close-btn-chat", function () { removeClass(qs(".chat-search"), "visible-chat"); });
	delegate(document, "keyup", ".chat-search .form-control", function () {
		var value = this.value.toLowerCase();
		qsa(".chat .chat-body .messages .chats").forEach(function (el) {
			el.style.display = el.textContent.toLowerCase().indexOf(value) > -1 ? "" : "none";
		});
	});

	function toggleFullscreen(elem) {
		elem = elem || document.documentElement;
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
			if (elem.requestFullscreen) elem.requestFullscreen();
			else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
			else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
			else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		} else {
			if (document.exitFullscreen) document.exitFullscreen();
			else if (document.msExitFullscreen) document.msExitFullscreen();
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
			else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
		}
	}
	window.toggleFullscreen = toggleFullscreen;

	delegate(document, "click", ".quantity-btn", function () {
		var wrap = this.closest(".product-quantity");
		var input = wrap && wrap.querySelector("input.quntity-input");
		if (!input) return;
		var oldValue = parseFloat(input.value) || 0;
		input.value = this.textContent.trim() === "+" ? oldValue + 1 : Math.max(oldValue - 1, 0);
	});

	delegate(document, "click", ".remove-product", function () {
		var p = this.parentElement && this.parentElement.parentElement;
		if (p) p.style.display = "none";
	});

	/* Dynamic "add row" flows: append markup then wire Choices.js on the new selects */
	function appendAndInitSelects(containerSel, html) {
		var container = qs(containerSel);
		if (!container) return;
		container.insertAdjacentHTML("beforeend", html);
		setTimeout(function () {
			qsa(".select", container).forEach(function (el) {
				if (!el.dataset.choicesBound) mountChoices(el, { searchEnabled: false });
			});
		}, 100);
	}

	delegate(document, "click", ".add-extra", function () {
		var servicecontent = '<div class="row">' +
			'<div class="col-lg-4 col-sm-6 col-12"><div class="form-group add-product"><div class="add-newplus"><label>Category</label></div><select class="select"><option>Choose</option><option>Computers</option></select></div></div>' +
			'<div class="col-lg-4 col-sm-6 col-12"><div class="form-group add-product"><label>Choose Category</label><select class="select"><option>Choose</option><option>Computers</option></select></div></div>' +
			'<div class="col-lg-4 col-sm-6 col-12"><div class="d-flex align-items-center"><div class="form-group w-100 add-product"><label>Sub Category</label><select class="select"><option>Choose</option><option>Computers</option></select></div>' +
			'<div class="input-blocks"><a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a></div></div></div></div>';
		appendAndInitSelects(".addservice-info", servicecontent);
		return false;
	});
	delegate(document, "click", ".add-extra-item-two", function () {
		var servicecontent = '<div class="row">' +
			'<div class="col-lg-4 col-sm-6 col-12"><div class="form-group add-product"><div class="add-newplus"><label>Brand</label></div><select class="select"><option>Choose</option><option>Computers</option></select></div></div>' +
			'<div class="col-lg-4 col-sm-6 col-12"><div class="form-group add-product"><label>Unit</label><select class="select"><option>Choose</option><option>Computers</option></select></div></div>' +
			'<div class="col-lg-4 col-sm-6 col-12"><div class="d-flex align-items-center"><div class="form-group w-100 add-product"><label>Selling Type</label><select class="select"><option>Choose</option><option>Computers</option></select></div>' +
			'<div class="input-blocks"><a href="#" class="btn btn-danger-outline trash"><i class="far fa-trash-alt"></i></a></div></div></div></div>';
		appendAndInitSelects(".add-product-new", servicecontent);
		return false;
	});
	delegate(document, "click", ".remove-color", function () {
		var p = this.parentElement && this.parentElement.parentElement && this.parentElement.parentElement.parentElement;
		if (p) p.style.display = "none";
	});

	if (document.getElementById("btnFullscreen")) {
		document.getElementById("btnFullscreen").addEventListener("click", function () { toggleFullscreen(); });
	}
	if (document.getElementById("collapse-header")) {
		document.getElementById("collapse-header").onclick = function () {
			this.classList.toggle("active");
			document.body.classList.toggle("header-collapse");
		};
	}
	if (document.getElementById("file-delete")) {
		on(document.getElementById("file-delete"), "click", function () {
			qsa(".deleted-table").forEach(function (el) { addClass(el, "d-none"); });
			qsa(".deleted-info").forEach(function (el) { addClass(el, "d-block"); });
		});
	}

	delegate(document, "click", ".addsibling-info .trash-icon", function () {
		var p = this.closest(".sibling-cont");
		if (p) p.remove();
		return false;
	});
	delegate(document, "click", ".add-sibling", function () {
		var servicecontent = '<div class="row sibling-cont">' +
			'<div class="col-lg-3 col-md-6"><div class="mb-4"><label class="form-label">Name</label><select class="select"><option>Select</option><option>Newyork</option><option>Denver</option><option>Chicago</option></select></div></div>' +
			'<div class="col-lg-3 col-md-6"><div class="mb-4"><label class="form-label">Roll No</label><select class="select"><option>Select</option><option>35013</option><option>35011</option><option>35010</option></select></div></div>' +
			'<div class="col-lg-3 col-md-6"><div class="mb-4"><label class="form-label">Admission No</label><select class="select"><option>Select</option><option>AD9892434</option><option>AD9892433</option><option>AD9892432</option></select></div></div>' +
			'<div class="col-lg-3 col-md-6"><div class="mb-4"><div class="d-flex align-items-center"><div class="w-100"><label class="form-label">Class</label><select class="select w-100"><option>Select</option><option>I</option><option>II</option><option>III</option></select></div>' +
			'<div><label class="form-label">&nbsp;</label><a href="javascript:void(0);" class="trash-icon ms-3"><i class="ti ti-trash-x"></i></a></div></div></div></div></div>';
		appendAndInitSelects(".addsibling-info", servicecontent);
		return false;
	});

	delegate(document, "click", ".promote-students-btn", function () { addClass(qs(".promote-card-main"), "promote-card-main-show"); });
	delegate(document, "click", ".reset-promote", function () { removeClass(qs(".promote-card-main"), "promote-card-main-show"); });

	on(qs(".image-sign"), "change", function () {
		var frames = this.closest(".upload-pic") && this.closest(".upload-pic").querySelector(".frames");
		if (!frames) return;
		frames.innerHTML = "";
		Array.prototype.forEach.call(this.files, function (f) {
			frames.insertAdjacentHTML("beforeend", '<img src="' + window.URL.createObjectURL(f) + '" width="100px" height="100px">');
		});
	});

	on(document.getElementById("students"), "change", function () {
		qsa(".all-content").forEach(function (el) { removeClass(el, "active"); });
		addClass(document.getElementById("all-student"), "active");
	});
	on(document.getElementById("staffs"), "change", function () {
		qsa(".all-content").forEach(function (el) { removeClass(el, "active"); });
		addClass(document.getElementById("all-staffs"), "active");
	});
	on(document.getElementById("all"), "change", function () {
		qsa(".all-content").forEach(function (el) { removeClass(el, "active"); });
	});

	delegate(document, "click", ".btn-view", function () {
		var wrap = this.closest(".ticket-wrap");
		var view = wrap && wrap.querySelector(".ticket-view");
		slideToggle(view, 500);
	});

	delegate(document, "click", ".add-new-timetable", function () {
		var timetablecontent = '<div class="row timetable-count">' +
			'<div class="col-lg-3"><div class="mb-3"><label class="form-label">Subject</label><select class="select"><option>Select</option><option>English</option><option>Spanish</option><option>Physics</option><option>Maths</option></select></div></div>' +
			'<div class="col-lg-3"><div class="mb-3"><label class="form-label">Teacher</label><select class="select"><option>Select</option><option>Hellana</option><option>Erickson</option><option>Teresa</option><option>Aaron</option></select></div></div>' +
			'<div class="col-lg-3"><div class="mb-3"><label class="form-label">Time From</label><select class="select"><option>Select</option><option>09:00</option><option>09:45</option><option>10:45</option><option>11:30</option></select></div></div>' +
			'<div class="col-lg-3"><div class="d-flex align-items-end"><div class="mb-3 flex-fill"><label class="form-label">Time To</label><select class="select"><option>Select</option><option>09:45</option><option>10:45</option><option>11:30</option><option>12:15</option></select></div>' +
			'<div class="mb-3 ms-2"><a href="#" class="delete-time-table"><i class="ti ti-trash"></i></a></div></div></div></div>';
		appendAndInitSelects(".add-timetable-row", timetablecontent);
		return false;
	});
	delegate(document, "click", ".add-timetable-row .delete-time-table", function () {
		var p = this.closest(".timetable-count");
		if (p) p.remove();
		return false;
	});

	delegate(document, "click", ".add-new-schedule", function () {
		var examschedule = '<div class="exam-schedule-row d-flex align-items-center flex-wrap column-gap-3">' +
			'<div class="shedule-info flex-fill"><div class="mb-3"><label class="form-label">Exam Date</label><select class="select"><option>Select</option><option>13 May 2024</option><option>14 May 2024</option><option>15 May 2024</option></select></div></div>' +
			'<div class="shedule-info flex-fill"><div class="mb-3"><label class="form-label">Teacher</label><select class="select"><option>Select</option><option>English</option><option>Spanish</option><option>Physics</option></select></div></div>' +
			'<div class="shedule-info flex-fill"><div class="mb-3"><label class="form-label">Room No</label><select class="select"><option>Select</option><option>101</option><option>103</option><option>104</option></select></div></div>' +
			'<div class="shedule-info flex-fill"><div class="mb-3"><label class="form-label">Max Marks</label><select class="select"><option>Select</option><option>100</option></select></div></div>' +
			'<div class="shedule-info flex-fill"><div class="d-flex align-items-end"><div class="mb-3 flex-fill"><label class="form-label">Min Marks</label><select class="select"><option>Select</option><option>35</option></select></div>' +
			'<div class="mb-3 ms-2"><a href="#" class="delete-schedule-table"><i class="ti ti-trash"></i></a></div></div></div></div>';
		appendAndInitSelects(".exam-schedule-add", examschedule);
		return false;
	});
	delegate(document, "click", ".exam-schedule-add .delete-schedule-table", function () {
		var p = this.closest(".exam-schedule-row");
		if (p) p.remove();
		return false;
	});

	delegate(document, "click", ".percentage-radio", function () { addClass(qs(".percentage-field"), "percentage-field-show"); });
	delegate(document, "click", ".fixed-radio", function () { addClass(qs(".fixed-field"), "fixed-field-show"); });
	qsa("input[type='radio']:not(.percentage-radio)").forEach(function (el) {
		on(el, "click", function () { removeClass(qs(".percentage-field"), "percentage-field-show"); });
	});
	qsa("input[type='radio']:not(.fixed-radio)").forEach(function (el) {
		on(el, "click", function () { removeClass(qs(".fixed-field"), "fixed-field-show"); });
	});

	qsa(".todo-inbox-check input, .todo-list input").forEach(function (el) {
		on(el, "click", function () {
			var p = this.parentElement && this.parentElement.parentElement;
			if (p) toggleClass(p, "todo-strike-content");
		});
	});

	delegate(document, "click", ".student-active a", function () {
		addClass(this, "active");
		var siblings = this.parentElement ? qsa(":scope > a", this.parentElement.parentElement) : [];
		siblings.forEach(function (s) { if (s !== this) removeClass(s, "active"); }, this);
	});

	delegate(document, "click", "#notification_popup", function (e) {
		toggleClass(document.getElementById("notification_item"), "notification-item-show");
		e.stopPropagation();
	});
	on(document, "click", function (e) {
		if (!e.target.closest("#notification_item")) removeClass(document.getElementById("notification_item"), "notification-item-show");
	});
	on(qs(".notification-dropdown"), "click", function (e) { e.stopPropagation(); });

	delegate(document, "click", ".ntf-tab", function (e) {
		e.preventDefault();
		e.stopPropagation();
		var tab = this;
		addClass(tab, "active");
		var siblings = tab.parentElement ? qsa(".ntf-tab", tab.parentElement) : [];
		siblings.forEach(function (s) { if (s !== tab) removeClass(s, "active"); });
		var filterText = tab.textContent.trim().toLowerCase();
		var panel = tab.closest(".ntf-panel");
		var items = panel ? qsa(".ntf-list .ntf-item", panel) : [];
		items.forEach(function (item) {
			if (filterText.indexOf("unread") !== -1) {
				item.style.display = item.classList.contains("unread") ? "flex" : "none";
			} else if (filterText.indexOf("alert") !== -1) {
				var hasAlert = item.querySelector(".nb-red, .ti-alert-triangle, .ti-alert-circle") || item.dataset.filter === "alerts";
				item.style.display = hasAlert ? "flex" : "none";
			} else {
				item.style.display = "flex";
			}
		});
	});
	delegate(document, "click", ".ntf-readall", function (e) {
		e.preventDefault();
		var panel = this.closest(".ntf-panel");
		if (!panel) return;
		qsa(".ntf-item", panel).forEach(function (el) { removeClass(el, "unread"); });
		qsa(".ntf-dot", panel).forEach(function (el) { el.style.visibility = "hidden"; });
		var sub = panel.querySelector(".ntf-sub");
		if (sub) sub.textContent = "You have 0 unread messages";
		var tabSpan = panel.querySelector(".ntf-tab span");
		if (tabSpan) tabSpan.textContent = "0";
		var count = qs("#notification_item .mui-count");
		if (count) { count.textContent = "0"; count.style.display = "none"; }
		qsa(".notification-status-dot").forEach(function (el) { el.style.display = "none"; });
	});

	qsa(".circle-progress").forEach(function (el) {
		var value = parseFloat(el.getAttribute("data-value")) || 0;
		var left = el.querySelector(".progress-left .progress-bar");
		var right = el.querySelector(".progress-right .progress-bar");
		function toDeg(pct) { return (pct / 100) * 360; }
		if (value > 0) {
			if (value <= 50) {
				right.style.transform = "rotate(" + toDeg(value) + "deg)";
			} else {
				right.style.transform = "rotate(180deg)";
				left.style.transform = "rotate(" + toDeg(value - 50) + "deg)";
			}
		}
	});

	/* Toasts placement demo */
	(function () {
		var toastPlacement = document.getElementById("toastPlacement");
		var placementSelect = document.getElementById("selectToastPlacement");
		if (toastPlacement && placementSelect) {
			var originalClass = toastPlacement.className;
			on(placementSelect, "change", function () {
				toastPlacement.className = (originalClass + " " + this.value).trim();
			});
		}
	})();

	/* Global Search interactions (already vanilla, unchanged) */
	(function () {
		"use strict";
		var modal = document.getElementById("muiSearchModal");
		if (!modal) return;
		var input = document.getElementById("muiSearchInput");
		var rows = Array.prototype.slice.call(modal.querySelectorAll(".mui-search-row"));
		var empty = modal.querySelector("[data-search-empty]");
		var triggers = [].concat(
			Array.prototype.slice.call(document.querySelectorAll(".top-nav-search .searchinputs input")),
			Array.prototype.slice.call(document.querySelectorAll(".responsive-search"))
		);
		function open() { modal.hidden = false; document.body.classList.add("mui-search-open"); setTimeout(function () { input.value = ""; filter(); input.focus(); }, 20); }
		function close() { modal.hidden = true; document.body.classList.remove("mui-search-open"); }
		triggers.forEach(function (t) {
			if (t.tagName === "INPUT") t.setAttribute("readonly", "readonly");
			t.addEventListener("click", function (e) { e.preventDefault(); open(); });
			t.addEventListener("focus", open);
		});
		modal.querySelectorAll("[data-search-close]").forEach(function (el) { el.addEventListener("click", close); });
		function filter() {
			var q = (input.value || "").toLowerCase().trim();
			var shown = 0;
			rows.forEach(function (r) {
				var t = r.querySelector(".msr-txt").textContent.toLowerCase();
				var ok = t.indexOf(q) > -1;
				r.style.display = ok ? "" : "none";
				if (ok) shown++;
			});
			modal.querySelectorAll(".mui-search-sec").forEach(function (sec) {
				var any = sec.querySelector('.mui-search-row:not([style*="none"])');
				sec.style.display = any ? "" : "none";
			});
			if (empty) empty.style.display = shown ? "none" : "block";
			rows.forEach(function (r) { r.classList.remove("is-active"); });
			var first = rows.filter(function (r) { return r.style.display !== "none"; })[0];
			if (first) first.classList.add("is-active");
		}
		if (input) {
			input.addEventListener("input", filter);
			input.addEventListener("keydown", function (e) {
				var vis = rows.filter(function (r) { return r.style.display !== "none"; });
				var idx = vis.findIndex(function (r) { return r.classList.contains("is-active"); });
				if (e.key === "ArrowDown") { e.preventDefault(); if (vis.length) { if (idx >= 0) vis[idx].classList.remove("is-active"); vis[Math.min(idx + 1, vis.length - 1)].classList.add("is-active"); } }
				else if (e.key === "ArrowUp") { e.preventDefault(); if (vis.length) { if (idx >= 0) vis[idx].classList.remove("is-active"); vis[Math.max(idx - 1, 0)].classList.add("is-active"); } }
				else if (e.key === "Enter") { e.preventDefault(); var a = vis[idx < 0 ? 0 : idx]; if (a && a.href) window.location.href = a.href; }
			});
		}
		document.addEventListener("keydown", function (e) {
			if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); modal.hidden ? open() : close(); }
			else if (e.key === "Escape" && !modal.hidden) close();
		});
	})();

	/* Auto-calculate gauge values from inner text (already vanilla, unchanged) */
	qsa(".gauge").forEach(function (gauge) {
		var valueElement = gauge.querySelector(".gauge-value");
		if (valueElement) {
			var valueText = valueElement.textContent;
			if (valueText) {
				var value = parseFloat(valueText.replace("%", "").trim());
				if (!isNaN(value)) gauge.style.setProperty("--gauge-value", value);
			}
		}
	});

	/* ================= Page-specific widgets (moved out of per-page inline
	   <script> tags so every page-level behavior lives in this one file) ================= */

	/* ApexCharts mount helper: every chart below targets an id unique to one
	   page, so this just no-ops everywhere else instead of throwing. */
	function mountApexChart(sel, options) {
		if (typeof ApexCharts === "undefined") return;
		var el = qs(sel);
		if (el) new ApexCharts(el, options).render();
	}

	/* Admission Details: skeleton profile loader */
	(function () {
		var skeleton = document.getElementById("ad_skeleton");
		var workspace = document.getElementById("ad_workspace");
		if (!skeleton && !workspace) return;
		if (skeleton) skeleton.classList.remove("d-none");
		if (workspace) workspace.classList.add("d-none");
		setTimeout(function () {
			if (skeleton) skeleton.classList.add("d-none");
			if (workspace) workspace.classList.remove("d-none");
		}, 700);
	})();

	/* Behavior Discipline: trend + type-breakdown charts */
	mountApexChart("#bd_trend", {
		chart: { type: "line", height: 300, toolbar: { show: false } },
		series: [{ name: "Merits", data: [60, 72, 68, 80, 75, 90] }, { name: "Demerits", data: [14, 10, 16, 9, 12, 8] }],
		xaxis: { categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
		colors: ["#0ca678", "#e7515a"], stroke: { curve: "smooth", width: 3 }, dataLabels: { enabled: false }, legend: { position: "top" }
	});
	mountApexChart("#bd_types", {
		chart: { type: "donut", height: 290 }, series: [18, 12, 8, 4], labels: ["Late", "Disruptive", "Uniform", "Other"],
		colors: ["#f39c12", "#e7515a", "#3577f1", "#6c757d"], legend: { position: "bottom" }, dataLabels: { enabled: false }
	});

	/* AI Behavior Analysis: conduct radar */
	mountApexChart("#ba_radar", {
		chart: { type: "radar", height: 300, toolbar: { show: false } }, series: [{ name: "Score", data: [80, 65, 72, 58, 85] }],
		labels: ["Focus", "Conduct", "Teamwork", "Regularity", "Positivity"], colors: ["#3577f1"], dataLabels: { enabled: false }
	});

	/* AI Report Generator: usage trend */
	mountApexChart("#rg_usage", {
		chart: { type: "area", height: 300, toolbar: { show: false } }, series: [{ name: "Reports", data: [40, 62, 55, 80, 74, 96, 88] }],
		xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, colors: ["#3577f1"],
		stroke: { curve: "smooth", width: 3 }, fill: { type: "gradient", gradient: { opacityFrom: .4, opacityTo: .05 } }, dataLabels: { enabled: false }
	});

	/* AI Notification Assistant: delivery trend */
	mountApexChart("#na_trend", {
		chart: { type: "line", height: 300, toolbar: { show: false } }, series: [{ name: "Delivered %", data: [94, 96, 95, 97, 96, 98, 96] }],
		xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] }, colors: ["#0ca678"],
		stroke: { curve: "smooth", width: 3 }, dataLabels: { enabled: false }, yaxis: { max: 100 }
	});

	/* AI Scholarship Recommendation: match breakdown */
	mountApexChart("#sr_match", {
		chart: { type: "donut", height: 290 }, series: [42, 30, 14], labels: ["Merit", "Need-based", "Sports"],
		colors: ["#3577f1", "#0ca678", "#f39c12"], legend: { position: "bottom" }, dataLabels: { enabled: false }
	});

	/* Audit Log: module activity + event-type charts */
	mountApexChart("#au_module", {
		chart: { type: "bar", height: 300, toolbar: { show: false } },
		series: [{ name: "Events", data: [320, 280, 210, 180, 140, 120] }],
		xaxis: { categories: ["Students", "Fees", "Auth", "Users", "Exams", "Settings"] },
		colors: ["#3577f1"], plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } }, dataLabels: { enabled: false }
	});
	mountApexChart("#au_types", {
		chart: { type: "donut", height: 290 }, series: [642, 418, 54, 17], labels: ["Login", "Update", "Export", "Failed"],
		colors: ["#0ca678", "#3577f1", "#f39c12", "#e7515a"], legend: { position: "bottom" }, dataLabels: { enabled: false }
	});

	/* Fee Installments: collected vs due */
	mountApexChart("#fi_chart", {
		chart: { type: "bar", height: 300, toolbar: { show: false } },
		series: [{ name: "Collected", data: [620, 540, 480, 410] }, { name: "Due", data: [80, 120, 160, 210] }],
		xaxis: { categories: ["Installment 1", "Installment 2", "Installment 3", "Installment 4"] },
		colors: ["#0ca678", "#e7515a"], plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } }, dataLabels: { enabled: false }, legend: { position: "top" }
	});

	/* Performance Analytics: subject trend, radar, attendance/marks scatter */
	mountApexChart("#pa_trend", {
		chart: { type: "line", height: 300, toolbar: { show: false } },
		series: [{ name: "Maths", data: [82, 85, 84, 88, 90] }, { name: "Science", data: [78, 80, 83, 85, 87] }, { name: "English", data: [75, 77, 79, 80, 82] }],
		xaxis: { categories: ["T1", "T2", "T3", "T4", "T5"] },
		colors: ["#3577f1", "#0ca678", "#f39c12"], stroke: { curve: "smooth", width: 3 }, dataLabels: { enabled: false }, legend: { position: "top" }
	});
	mountApexChart("#pa_radar", {
		chart: { type: "radar", height: 280, toolbar: { show: false } },
		series: [{ name: "Avg Score", data: [90, 87, 82, 85, 88, 80] }],
		labels: ["Maths", "Science", "English", "Social", "Computer", "Art"],
		colors: ["#3577f1"], dataLabels: { enabled: false }
	});
	mountApexChart("#pa_scatter", {
		chart: { type: "scatter", height: 280, toolbar: { show: false } },
		series: [{ name: "Students", data: [[70, 62], [80, 74], [85, 80], [90, 88], [95, 92], [75, 68], [88, 84], [92, 90]] }],
		xaxis: { title: { text: "Attendance %" }, tickAmount: 6 },
		yaxis: { title: { text: "Marks %" } }, colors: ["#3577f1"]
	});

	/* Scholarship Management: budget vs disbursed */
	mountApexChart("#sc_budget", {
		chart: { type: "bar", height: 300, toolbar: { show: false } },
		series: [{ name: "Budget", data: [120, 90, 80, 70, 60] }, { name: "Disbursed", data: [100, 70, 60, 40, 16] }],
		xaxis: { categories: ["Merit", "Need-based", "Sports", "Arts", "Staff Ward"] },
		colors: ["#3577f1", "#0ca678"], plotOptions: { bar: { borderRadius: 4, columnWidth: "50%" } }, dataLabels: { enabled: false }, legend: { position: "top" }
	});

	/* Online Payment Receipts: collection trend + payment modes */
	mountApexChart("#op_trend", {
		chart: { type: "area", height: 300, toolbar: { show: false } },
		series: [{ name: "Collection ($K)", data: [28, 34, 31, 42, 38, 46, 43] }],
		xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
		colors: ["#3577f1"], stroke: { curve: "smooth", width: 3 }, fill: { type: "gradient", gradient: { opacityFrom: .4, opacityTo: .05 } }, dataLabels: { enabled: false }
	});
	mountApexChart("#op_modes", {
		chart: { type: "donut", height: 290 }, series: [48, 26, 18, 8], labels: ["Card", "UPI", "Net Banking", "Wallet"],
		colors: ["#3577f1", "#0ca678", "#f39c12", "#6c757d"], legend: { position: "bottom" }, dataLabels: { enabled: false }
	});

	/* Online Examination: score distribution + pass/fail */
	mountApexChart("#oe_scores", {
		chart: { type: "bar", height: 300, toolbar: { show: false } },
		series: [{ name: "Students", data: [4, 9, 18, 32, 41, 24] }],
		xaxis: { categories: ["0-40", "41-55", "56-70", "71-85", "86-95", "96-100"] },
		colors: ["#3577f1"], plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } }, dataLabels: { enabled: false }
	});
	mountApexChart("#oe_pass", {
		chart: { type: "donut", height: 290 }, series: [91, 9], labels: ["Pass", "Fail"],
		colors: ["#0ca678", "#e7515a"], legend: { position: "bottom" }, dataLabels: { enabled: false }
	});

	/* Question Bank: difficulty split + questions per subject */
	mountApexChart("#qb_difficulty", {
		chart: { type: "donut", height: 280 }, series: [45, 27, 28], labels: ["Easy", "Medium", "Hard"],
		colors: ["#0ca678", "#f39c12", "#e7515a"], legend: { position: "bottom" }, dataLabels: { enabled: false }
	});
	mountApexChart("#qb_subject", {
		chart: { type: "bar", height: 290, toolbar: { show: false } },
		series: [{ name: "Questions", data: [820, 640, 560, 480, 420, 360] }],
		xaxis: { categories: ["Maths", "Science", "English", "Social", "Computer", "GK"] },
		colors: ["#3577f1"], plotOptions: { bar: { borderRadius: 4, columnWidth: "45%" } }, dataLabels: { enabled: false }
	});

	/* Student Attendance History: Table / Timeline toggle + donut/trend/heatmap charts */
	(function () {
		var viewTimeline = document.getElementById("att_view_timeline");
		var viewTable = document.getElementById("att_view_table");
		if (viewTimeline) viewTimeline.addEventListener("click", function () {
			document.getElementById("att_timeline").classList.remove("d-none");
			document.getElementById("att_table").classList.add("d-none");
			this.classList.add("active"); this.classList.remove("bg-light");
			viewTable.classList.remove("active"); viewTable.classList.add("bg-light");
		});
		if (viewTable) viewTable.addEventListener("click", function () {
			document.getElementById("att_table").classList.remove("d-none");
			document.getElementById("att_timeline").classList.add("d-none");
			this.classList.add("active"); this.classList.remove("bg-light");
			viewTimeline.classList.remove("active"); viewTimeline.classList.add("bg-light");
		});

		var green = "#0ca678", red = "#e7515a", yellow = "#f39c12", blue = "#3577f1";
		mountApexChart("#att_donut", {
			chart: { type: "donut", height: 240 }, series: [21, 2, 2, 1], labels: ["Present", "Absent", "Late", "Leave"],
			colors: [green, red, yellow, blue], legend: { position: "bottom" }, dataLabels: { enabled: false }
		});
		mountApexChart("#att_trend", {
			chart: { type: "area", height: 260, toolbar: { show: false } },
			series: [{ name: "Present %", data: [88, 92, 85, 94, 90, 96, 91] }],
			xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
			colors: [blue], stroke: { curve: "smooth", width: 3 },
			fill: { type: "gradient", gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
			dataLabels: { enabled: false }, yaxis: { max: 100 }
		});
		function week(name, vals) { return { name: name, data: vals.map(function (v, i) { return { x: "W" + (i + 1), y: v }; }) }; }
		mountApexChart("#att_heatmap", {
			chart: { type: "heatmap", height: 260, toolbar: { show: false } },
			series: [week("Mon", [5, 5, 4, 5]), week("Tue", [5, 4, 5, 5]), week("Wed", [4, 5, 5, 5]), week("Thu", [5, 5, 5, 4]), week("Fri", [5, 5, 4, 5])],
			colors: [green], dataLabels: { enabled: false },
			plotOptions: { heatmap: { colorScale: { ranges: [
				{ from: 0, to: 2, color: red, name: "Low" },
				{ from: 3, to: 4, color: yellow, name: "Med" },
				{ from: 5, to: 5, color: green, name: "Full" }
			] } } }
		});
	})();

	/* Student 360: attendance trend + subject radar */
	mountApexChart("#s360_attendance_trend", {
		chart: { type: "area", height: 260, toolbar: { show: false } },
		series: [{ name: "Attendance %", data: [92, 95, 90, 96, 93, 97, 94] }],
		xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"] },
		colors: ["#0ca678"], stroke: { curve: "smooth", width: 3 }, fill: { type: "gradient", gradient: { opacityFrom: .4, opacityTo: .05 } }, dataLabels: { enabled: false }, yaxis: { max: 100 }
	});
	mountApexChart("#s360_radar", {
		chart: { type: "radar", height: 260, toolbar: { show: false } },
		series: [{ name: "Score", data: [92, 88, 79, 85, 90, 83] }],
		labels: ["Maths", "Science", "English", "Social", "Computer", "Art"],
		colors: ["#3577f1"], dataLabels: { enabled: false }
	});

	/* Student Wallet: weekly spend trend */
	mountApexChart("#wl_trend", {
		chart: { type: "area", height: 300, toolbar: { show: false } },
		series: [{ name: "Spent ($)", data: [1800, 2100, 1900, 2400, 2200, 2800, 2600] }],
		xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] },
		colors: ["#e7515a"], stroke: { curve: "smooth", width: 3 }, fill: { type: "gradient", gradient: { opacityFrom: .4, opacityTo: .05 } }, dataLabels: { enabled: false }
	});

	/* Student Documents: Grid / List toggle, bulk action bar, skeleton refresh, dropzone upload progress */
	(function () {
		var viewGrid = document.getElementById("doc_view_grid");
		var viewList = document.getElementById("doc_view_list");
		if (!viewGrid && !viewList) return;
		if (viewGrid) viewGrid.addEventListener("click", function () {
			document.getElementById("doc_grid").classList.remove("d-none");
			document.getElementById("doc_list").classList.add("d-none");
			this.classList.add("active");
			viewList.classList.remove("active");
		});
		if (viewList) viewList.addEventListener("click", function () {
			document.getElementById("doc_list").classList.remove("d-none");
			document.getElementById("doc_grid").classList.add("d-none");
			this.classList.add("active");
			viewGrid.classList.remove("active");
		});
		function refreshBulkBar() {
			var count = qsa(".row-check").filter(function (el) { return el.checked; }).length;
			qsa(".selected-count").forEach(function (el) { el.textContent = count; });
			var bar = document.getElementById("bulk_action_bar");
			if (bar) { bar.classList.toggle("d-none", count === 0); bar.classList.toggle("d-flex", count > 0); }
		}
		document.addEventListener("change", function (e) { if (e.target.classList.contains("row-check")) refreshBulkBar(); });
		function showSkeleton(ms) {
			var current = viewList && viewList.classList.contains("active") ? qs("#doc_list") : qs("#doc_grid");
			var skeleton = document.getElementById("doc_skeleton");
			if (skeleton) skeleton.classList.remove("d-none");
			if (current) current.classList.add("d-none");
			setTimeout(function () {
				if (skeleton) skeleton.classList.add("d-none");
				if (current) current.classList.remove("d-none");
			}, ms || 900);
		}
		var refreshBtn = document.getElementById("doc_refresh");
		if (refreshBtn) refreshBtn.addEventListener("click", function () { showSkeleton(900); });
		showSkeleton(700);
		qsa("#doc_file, #bulk_files, #replace_file_input").forEach(function (input) {
			input.addEventListener("change", function () {
				var names = Array.prototype.map.call(this.files, function (f) { return f.name; }).join(", ");
				var dropzone = this.previousElementSibling;
				if (names && dropzone && dropzone.classList.contains("dropzone-area")) {
					var label = dropzone.querySelector(".fw-medium");
					if (label) label.textContent = names;
				}
				var form = this.closest("form");
				var bar = form && form.querySelector(".upload-progress");
				if (bar) {
					bar.classList.remove("d-none");
					var inner = bar.querySelector(".progress-bar");
					if (inner) inner.style.width = "0%";
					var p = 0;
					var t = setInterval(function () {
						p += 20;
						if (inner) { inner.style.width = p + "%"; inner.textContent = p + "%"; }
						if (p >= 100) {
							clearInterval(t);
							var done = bar.querySelector(".upload-done");
							if (done) done.classList.remove("d-none");
						}
					}, 180);
				}
			});
		});
	})();

	/* Loading state on modal form submit (was Student Documents-only, now applies
	   wherever a .modal form exists - purely cosmetic, always preventDefault()s
	   since there's no real backend here) */
	document.addEventListener("submit", function (e) {
		var form = e.target.closest(".modal form");
		if (!form) return;
		var btn = form.querySelector("button[type=submit]");
		if (!btn) return;
		e.preventDefault();
		var html = btn.innerHTML;
		btn.disabled = true;
		btn.innerHTML = "<span class=\"spinner-border spinner-border-sm me-1\"></span>Please wait";
		setTimeout(function () { btn.disabled = false; btn.innerHTML = html; }, 1000);
	});
})();
