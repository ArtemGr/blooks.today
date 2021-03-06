<?php
  // NB: To see the PHP error log in codeanywhere: $ sudo tail -f /var/log/apache2/error.log

  $cu = curl_init ('http://blooks.today/r');  // TODO: Use 'localhost' when working alongside the service.
  curl_setopt ($cu, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt ($cu, CURLOPT_HTTPHEADER, [
    'X-Mode: about',
    'Host: blooks.today',
    'User-Agent: PHP cURL',
    'Content-Type: application/json']);
  curl_setopt ($cu, CURLOPT_POST, 1);
  $about_request = json_encode ([
    'uri' => $_SERVER['REQUEST_URI'],
    'ip' => $_SERVER['REMOTE_ADDR']
  ], JSON_UNESCAPED_UNICODE);
  curl_setopt ($cu, CURLOPT_POSTFIELDS, $about_request);
  $about_response = curl_exec ($cu);
  $about_response = json_decode ($about_response, 1);
  curl_close ($cu);
  if (!empty ($about_response['location'])) {
    header ('Location: /' . $about_response['location']);
    return;}

  $main_js_url = '/js/main.js?lm=' . stat ('js/main.js') [9];
  $sw_js_url = '/sw.js?lm=' . stat ('sw.js') [9];

  header ('Content-Type: text/html; charset=UTF-8');
?><!DOCTYPE html>
<html>
  <head>
    <title>Blooks Today, a smart reader</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <style>
    </style>
  </head>
  <body>
    <span id="signed-in-name"></span>
    <button id="sign-in-github" type="button" style="display: none" onclick="sign_in_github()">Sign in with GitHub</button>
    <button id="sign-in-anonymouly" type="button" style="display: none" onclick="sign_in_anonymously()">Sign in anonymously</button>
    <div id="sign-out" style="display: none">
      We'd like you to stay, but you can
      <button type="button" onclick="sign_out()">sign out</button>,
      if you must.
    </div>

    <!-- Scripts. -->

    <script src="https://www.gstatic.com/firebasejs/3.6.9/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.6.9/firebase-auth.js"></script>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
    <script src="https://cdn.ravenjs.com/3.12.1/raven.min.js"></script>
    <script>
      Raven.config ('https://c556d463d627445a9c3f3733b4d1e2a3@sentry.io/146197') .install()
      if ('serviceWorker' in navigator) {
        window.addEventListener ('load', function() {
          navigator.serviceWorker.register ('<?= $sw_js_url ?>')
            .then (function (reg) {window.the_service_worker_registration = reg})
            .catch (function (err) {Raven.captureException (err)})})}
    </script>
    <script src="<?= $main_js_url ?>"></script>

    <br/>

    <div id="rss-prompt" style="display: none">
      Please enter the URL of a site you'd like to read and filter:
      <input id="rss-prompt-url" type="text" style="width: 90%" /><br/>
      <div id="rss-preview">
        We'll promptly check whether we can grok it.
      </div>
    </div>
  </body>
</html>
