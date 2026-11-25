/* 谭乐 · 主页交互 */
(function () {
  'use strict'
  document.documentElement.classList.add('js')
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---- starfield canvas ---- */
  var cv = document.getElementById('stars')
  var ctx = cv.getContext('2d')
  var stars = [], W = 0, H = 0, mouse = { x: -9999, y: -9999 }
  function resize() {
    W = cv.width = window.innerWidth
    H = cv.height = window.innerHeight
    var n = Math.min(150, Math.floor(W * H / 12000))
    stars = []
    for (var i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.4 + 0.3,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        a: Math.random() * 0.5 + 0.15
      })
    }
  }
  function tick() {
    ctx.clearRect(0, 0, W, H)
    var LINK = 110
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i]
      s.x += s.vx; s.y += s.vy
      if (s.x < 0 || s.x > W) s.vx *= -1
      if (s.y < 0 || s.y > H) s.vy *= -1
      var dx = s.x - mouse.x, dy = s.y - mouse.y, d = Math.sqrt(dx * dx + dy * dy)
      var alpha = s.a
      if (d < 160) alpha = Math.min(1, s.a + (1 - d / 160) * 0.6)
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(160,190,255,' + alpha.toFixed(3) + ')'
      ctx.fill()
      if (!reduce && d < LINK) {
        ctx.beginPath()
        ctx.moveTo(s.x, s.y); ctx.lineTo(mouse.x, mouse.y)
        ctx.strokeStyle = 'rgba(110,168,255,' + (0.12 * (1 - d / LINK)).toFixed(3) + ')'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
    if (!reduce) requestAnimationFrame(tick)
  }
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY })
  if (!reduce) tick(); else tick()

  /* ---- nav scrolled state ---- */
  var nav = document.getElementById('nav')
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 30) }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* ---- reveal on scroll ---- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { threshold: 0.12 })
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el) })

  /* ---- counters ---- */
  function animateNum(el) {
    var target = parseFloat(el.getAttribute('data-count'))
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10)
    if (reduce) { el.textContent = target.toFixed(dec); return }
    var t0 = null, dur = 1400
    function step(ts) {
      if (!t0) t0 = ts
      var p = Math.min(1, (ts - t0) / dur)
      p = 1 - Math.pow(1 - p, 3)
      el.textContent = (target * p).toFixed(dec)
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
  var io2 = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(function (el) {
          if (!el._done) { el._done = true; animateNum(el) }
        })
        io2.unobserve(e.target)
      }
    })
  }, { threshold: 0.4 })
  document.querySelectorAll('.stat').forEach(function (el) { io2.observe(el) })

  /* ---- typed effect ---- */
  var el = document.getElementById('typed')
  var words = ['RAG 智能问答系统', 'Agent 工作流编排', 'OCR 文档解析管线', 'YOLO 实时检测', '大数据分析平台']
  var wi = 0, ci = 0, del = false
  function type() {
    var w = words[wi]
    if (!del) {
      ci++
      el.textContent = w.slice(0, ci)
      if (ci === w.length) { del = true; setTimeout(type, 1700); return }
      setTimeout(type, 95)
    } else {
      ci--
      el.textContent = w.slice(0, ci)
      if (ci === 0) { del = false; wi = (wi + 1) % words.length; setTimeout(type, 350); return }
      setTimeout(type, 38)
    }
  }
  if (!reduce) type(); else el.textContent = words[0]

  /* ---- card tilt ---- */
  if (!reduce && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.proj').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect()
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -5
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 5
        card.style.transform = 'translateY(-5px) perspective(800px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)'
      })
      card.addEventListener('pointerleave', function () { card.style.transform = '' })
    })
  }

  /* ---- copy email ---- */
  var btn = document.getElementById('copyMail')
  var tip = document.getElementById('copyTip')
  var mail = ['13415970755', '@163.com'].join('')
  if (btn) {
    btn.addEventListener('click', function () {
      function done() { tip.classList.add('show'); setTimeout(function () { tip.classList.remove('show') }, 1800) }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(done, function () { fallback() })
      } else fallback()
      function fallback() {
        var t = document.createElement('textarea')
        t.value = mail; document.body.appendChild(t); t.select()
        try { document.execCommand('copy'); done() } catch (e) { window.location.href = 'mailto:' + mail }
        document.body.removeChild(t)
      }
    })
  }
})()
