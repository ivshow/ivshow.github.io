var Vshow = {
  init: function (callback) {
    this.isNowDay();
    this.weather(callback);

    var downSignBottom = 20;
    if (!Diaspora.P()) {
      $.getScript('http://f.dooomi.com/js/canvas-nest.min.js');
      this.linkBlank();
      downSignBottom = 30;
    }
    this.mouseEffect(window, document);
    this.fullScreen();
    this.cicleFun($('.down-sign-1'), $('.down-sign-2'), $('.down-sign-3'), downSignBottom, 200);
  },

  /**
   * a新窗口跳转
   */
  linkBlank: function () {
    $('.main .content a').each(function () {
      $(this).attr('target', '_blank');
    });
  },

  /**
   * 鼠标点击
   */
  mouseEffect: function (e, t, a) {
    var s = [];
    $(e).click(function (e) {
      var a = t.createElement('div');
      a.className = 'heart';
      s.push({
        el: a,
        x: e.clientX - 5,
        y: e.clientY - 5,
        scale: 1,
        alpha: 1,
        color: c(),
      }),
        t.body.appendChild(a);
    });
    r();

    e.requestAnimationFrame =
      e.requestAnimationFrame ||
      e.webkitRequestAnimationFrame ||
      e.mozRequestAnimationFrame ||
      e.oRequestAnimationFrame ||
      e.msRequestAnimationFrame ||
      function (e) {
        setTimeout(e, 1e3 / 60);
      };

    function r() {
      for (var i = 0; i < s.length; i++)
        s[i].alpha <= 0
          ? (t.body.removeChild(s[i].el), s.splice(i, 1))
          : (s[i].y--,
            (s[i].scale += 0.004),
            (s[i].alpha -= 0.013),
            (s[i].el.style.cssText =
              'left:' +
              s[i].x +
              'px;top:' +
              s[i].y +
              'px;opacity:' +
              s[i].alpha +
              ';transform:scale(' +
              s[i].scale +
              ',' +
              s[i].scale +
              ') rotate(45deg);background:' +
              s[i].color +
              ';z-index:99999'));
      e.requestAnimationFrame(r);
    }

    function c() {
      return 'rgb(' + ~~(255 * Math.random()) + ',' + ~~(255 * Math.random()) + ',' + ~~(255 * Math.random()) + ')';
    }
  },

  /**
   * 首屏滚动
   */
  fullScreen: function () {
    var scrollObj = $('html,body');
    $('#container').on('mousewheel', function (e) {
      if (scrollObj.is(':animated')) return false;

      if (e.originalEvent.wheelDelta > 0 && $(window).scrollTop() < window.innerHeight + 100) {
        scrollObj.animate(
          {
            scrollTop: 0,
          },
          800
        );
        return false;
      } else if ($(window).scrollTop() < window.innerHeight) {
        scrollObj.animate(
          {
            scrollTop: window.innerHeight,
          },
          800
        );
        return false;
      }
    });

    $('.btn-down').click(function () {
      scrollObj.animate(
        {
          scrollTop: window.innerHeight,
        },
        800
      );
    });
  },

  /**
   * 首屏箭头
   */
  cicleFun: function (name1, name2, name3, shift, interval) {
    name1.animate({ bottom: '-=' + shift + 'px' }, interval, function () {
      name1.hide();
      name2.animate({ bottom: '-=' + shift + 'px' }, interval, function () {
        name2.hide();
        name3.animate({ bottom: '-=' + shift + 'px' }, interval, function () {
          name3.hide();
          name1
            .css('bottom', '+=' + shift * 2 + 'px')
            .show()
            .animate({ bottom: '-=' + shift + 'px' }, interval, function () {
              name2
                .css('bottom', '+=' + shift * 2 + 'px')
                .show()
                .animate({ bottom: '-=' + shift + 'px' }, interval, function () {
                  name3
                    .css('bottom', '+=' + shift * 2 + 'px')
                    .show()
                    .animate({ bottom: '-=' + shift + 'px' }, interval, function () {
                      setTimeout(function () {
                        Vshow.cicleFun(name1, name2, name3, shift, interval);
                      }, 1500);
                    });
                });
            });
        });
      });
    });
  },

  /**
   * 天气
   */
  weather1: function (callback) {
    var weatherInfo = localStorage.getItem('weatherInfo');
    if (weatherInfo) {
      Vshow.showWeather(weatherInfo, callback);
      return;
    }
    var uid = 'U7EF217037';
    var key = 'tbb1yjbcb1hqmmjf';
    var getUrl = function () {
      var str = 'ts=' + new Date().getTime() + '&ttl=30&uid=' + uid;
      var signature = CryptoJS.HmacSHA1(str, key).toString(CryptoJS.enc.Base64);
      signature = encodeURIComponent(signature);
      var url = 'https://api.thinkpage.cn/v3/weather/now.json?location=ip&' + str + '&sig=' + signature;
      return url;
    };

    $.ajax({
      type: 'get',
      async: false,
      cache: false,
      url: getUrl(),
      dataType: 'jsonp',
      jsonp: 'callback', //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
      jsonpCallback: 'showWeather', //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
      success: function (data) {
        var code = data.results[0].now.code;
        Vshow.showWeather(code, callback);
        localStorage.setItem('weatherInfo', code);
      },
    });
  },

  weather: function (callback) {
    $.ajax({
      type: 'get',
      async: false,
      cache: false,
      url: 'https://www.tianqiapi.com/free/day',
      data: {
        appid: '63596332',
        appsecret: 'pHvA6IKK',
        city: '西安'
      },
      dataType: 'jsonp',
      jsonp: 'callback', //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(一般默认为:callback)
      jsonpCallback: 'showWeather', //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
      success: function (data) {
        var code = data.wea_img;
        Vshow.showWeather(code, callback);
        localStorage.setItem('weatherInfo', code);
      },
    });
  },

  /**
   * 展示天气
   */
  showWeather: function (code, callback) {
    // code = 22;
    var weather = '',
      imgUrl = '';
    if (code == 'yu') {
      weather = 'rain';
      imgUrl = 'rain1';
      Vshow.playRain();
    } else if (code == 'xue') {
      weather = 'snow';
      imgUrl = 'snow1';
    }
    if (weather) {
      $('#cover').attr('src', 'http://f.dooomi.com/image/' + imgUrl + '.jpg');
      $('body').addClass(weather);
    }
    callback();
  },

  /**
   * 雨
   */
  playRain: function () {
    var increment = 0;
    (rainNum = 100), (drops = ''), (backDrops = '');

    while (increment < 100) {
      //couple random numbers to use for various randomizations
      //random number between 98 and 1
      var randoHundo = Math.floor(Math.random() * (rainNum - 1 + 1) + 1);
      //random number between 5 and 2
      var randoFiver = Math.floor(Math.random() * (5 - 2 + 1) + 2);
      //increment
      increment += randoFiver;
      //add in a new raindrop with various randomizations to certain CSS properties
      if (Diaspora.P() && increment % 5 != 0) {
        continue;
      }
      drops +=
        '<div class="rain-drop" style="left: ' +
        increment +
        '%; bottom: ' +
        (randoFiver + randoFiver - 1 + 80) +
        '%; animation-delay: 0.' +
        randoHundo +
        's; animation-duration: 0.5' +
        randoHundo +
        's;"><div class="rain-stem" style="animation-delay: 0.' +
        randoHundo +
        's; animation-duration: 0.5' +
        randoHundo +
        's;"></div><div class="rain-splat" style="animation-delay: 0.' +
        randoHundo +
        's; animation-duration: 0.5' +
        randoHundo +
        's;"></div></div>';
      backDrops +=
        '<div class="rain-drop" style="right: ' +
        increment +
        '%; bottom: ' +
        (randoFiver + randoFiver - 1 + 80) +
        '%; animation-delay: 0.' +
        randoHundo +
        's; animation-duration: 0.5' +
        randoHundo +
        's;"><div class="rain-stem" style="animation-delay: 0.' +
        randoHundo +
        's; animation-duration: 0.5' +
        randoHundo +
        's;"></div><div class="rain-splat" style="animation-delay: 0.' +
        randoHundo +
        's; animation-duration: 0.5' +
        randoHundo +
        's;"></div></div>';
    }

    $('.rain.front-row').html(drops);
    $('.rain.back-row').html(backDrops);
  },

  /**
   * 不是当天，清空天气信息
   */
  isNowDay: function () {
    var date = new Date(),
      nowDay = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
      day = localStorage.getItem('currentDay');
    if (day != nowDay) {
      localStorage.removeItem('weatherInfo');
      localStorage.setItem('currentDay', nowDay);
    }
  },
};
