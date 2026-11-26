/* 谭乐 · 主页交互（Editorial 版） */
(function () {
  'use strict'
  document.documentElement.classList.add('js')
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ---- 显现动画 ---- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
  }, { threshold: 0.12 })
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el) })

  /* ---- 数字滚动 ---- */
  function animateNum(el) {
    var target = parseFloat(el.getAttribute('data-count'))
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10)
    if (reduce) { el.textContent = target.toFixed(dec); return }
    var t0 = null, dur = 1500
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
  document.querySelectorAll('.figs').forEach(function (el) { io2.observe(el) })

  /* ---- 封面轻视差（慢速杂志感） ---- */
  if (!reduce) {
    var hero = document.getElementById('heroPar')
    var ticking = false
    window.addEventListener('scroll', function () {
      if (ticking) return
      ticking = true
      requestAnimationFrame(function () {
        var y = window.scrollY
        if (y < window.innerHeight * 1.2 && hero) {
          hero.style.transform = 'translateY(' + (y * 0.12).toFixed(1) + 'px)'
          hero.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.9)))
        }
        ticking = false
      })
    }, { passive: true })
  }

  /* ---- 复制邮箱 ---- */
  var btn = document.getElementById('copyMail')
  var tip = document.getElementById('copyTip')
  var mail = ['13415970755', '@163.com'].join('')
  if (btn) {
    btn.addEventListener('click', function () {
      function done() { tip.classList.add('show'); setTimeout(function () { tip.classList.remove('show') }, 2000) }
      function fallback() {
        var t = document.createElement('textarea')
        t.value = mail; document.body.appendChild(t); t.select()
        try { document.execCommand('copy'); done() } catch (e) { window.location.href = 'mailto:' + mail }
        document.body.removeChild(t)
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(mail).then(done, fallback)
      } else fallback()
    })
  }
})()
