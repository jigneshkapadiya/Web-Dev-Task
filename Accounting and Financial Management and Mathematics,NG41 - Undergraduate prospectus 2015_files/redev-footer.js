$('body').attr('id', '');

$(document).ready(function() {

  // Changes font size depending on character count of page title
  $(function(){

      var $title = $("#pageTitle");
      
      var $numChars = $title.text().length;
      
      if ($numChars <= 42) {
          $title.css("font-size", "36px");
      }
      else if (($numChars >= 43) && ($numChars < 70)) {
          $title.css("font-size", "27px");
      }
      else if (($numChars >= 71) && ($numChars < 100)) {
          $title.css("font-size", "24px");
      }
      else {
          $title.css("font-size", "18px");
      }
     
  });

  // Nudge local nav down to make room for global nav
  $("#localNavigation").css({"margin-top":"50px"});

 // Add class to currentPage parent list item
 $("#localNavigation #currentPage").parents('li').addClass("currentPageParent");

 // Global menu HTML and CSS
  $("#localNavigation").before(
    '<ul class="menu-main">' +
        '<li class="menu-item"><a class="radius-top-left radius-bottom-left" href="#">Main menu<i class="icon-hamburger"></i></a>' +
          '<ul class="menu-sub">' +
             '<li class="menu-item"><a class="icon-arrow" href="/">Home</a></li>' +
             '<li class="menu-item"><a class="icon-arrow" href="/study">Study with us</a></li>' +
             '<li class="menu-item"><a class="icon-arrow" href="/research">Our research</a></li>' +
             '<li class="menu-item"><a class="icon-arrow" href="/business">For business</a></li>' +
             '<li class="menu-item"><a class="icon-arrow" href="/alumni">Alumni</a></li>' +
             '<li class="menu-item"><a class="icon-arrow" href="/global">Sheffield International</a></li>' +
             '<li class="menu-item"><a class="icon-arrow" href="/about">About us</a></li>' +
             '<li class="menu-item"><a class="icon-arrow radius-bottom-left" href="/departments">Departments and services</a></li>' +
          '</ul>' +
       '</li>' +
    '</ul>'
  );

  // Global menu toggle
  $('.menu-main > .menu-item:has(ul) > a').click(function(e) {
     $(this).siblings('ul').slideToggle();
     $(this).toggleClass('radius-bottom-left');
     $('#localNavigation li').toggleClass('nav-opacity');
     e.preventDefault();
  });

  // Footer HTML and CSS
  $( "#footer" ).before(
    '<div class="pg-btm">' +
      '<div class="top-inner">' +
         '<div class="footer-links">' +
            '<nav class="footer-nav">' +
               '<ul>' +
                  '<li><a href="/contact" onclick="_gaq.push([\'_trackEvent\', \'footer link\', \'clicked\', \'contact us\']);">Contact us</a></li>' +
                  '<li><a href="/visitors" onclick="_gaq.push([\'_trackEvent\', \'footer link\', \'clicked\', \'information for visitors\']);">Information for visitors</a></li>' +
                  '<li><a href="/jobs" onclick="_gaq.push([\'_trackEvent\', \'footer link\', \'clicked\', \'jobs\']);">Jobs</a></li>' +
                  '<li><a href="/alumni/support" onclick="_gaq.push([\'_trackEvent\', \'footer link\', \'clicked\', \'support us\']);">Support us</a></li>' +
                  '<li><a href="/union" onclick="_gaq.push([\'_trackEvent\', \'footer link\', \'clicked\', \'students\' Union\']);">Students\' Union</a></li>' +
                  '<li><a href="/students" onclick="_gaq.push([\'_trackEvent\', \'footer link\', \'clicked\', \'current students\']);">Current students</a></li>' +
                  '<li><a href="/staff" onclick="_gaq.push([\'_trackEvent\', \'footer link\', \'clicked\', \'staff\']);">Staff</a></li>' +
                '</ul>' +
            '</nav>' +
             '<div class="footer-social">' +
               '<p>Connect</p>' +
               '<ul>' +
                  '<li class="fb"><a href="//facebook.com/theuniversityofsheffield">Facebook</a></li>' +
                  '<li class="tw"><a href="//twitter.com/sheffielduni">Twitter</a></li>' +
                  '<li class="yt"><a href="//www.youtube.com/user/uniofsheffield">YouTube</a></li>' +
                  '<li class="g-plus"><a href="//plus.google.com/u/0/+universityofsheffield/posts">Google+</a></li>' +
                  '<li class="l-in"><a href="//www.linkedin.com/edu/school?id=12675">LinkedIn</a></li>' +
                  '<li class="weibo"><a href="//www.weibo.com/sheffielduni">Weibo</a></li>' +
               '</ul>' +
                '<a href="/about/rankings"><img src="/polopoly_fs/1.325481!/image/awards.png" height="45" /></a>' +
                '<a style="margin-left: 30px" href="/numberone"><img src="/polopoly_fs/1.373903!/image/student-experience-survey.png" /></a>' +
            '</div>' +
          '</div>' +
          '<div class="uni-address">' +
             '<address>' +
             'The University of Sheffield<br />' +
             'Western Bank<br />' +
             'Sheffield S10 2TN<br />' +
             'UK' +
            '</address>' +
          '</div>' +
       '</div>    ' +
    '</div>'
  );

});