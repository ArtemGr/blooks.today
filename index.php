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

  header ('Content-Type: text/html; charset=UTF-8');
?><!DOCTYPE html>
<html>
  <head>
    <title>Blooks Today, smart reader</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="manifest" href="/manifest.webmanifest" />
    <style>
    </style>
  </head>
  <body>
    <span id="signed-in-name"></span>
    <button id="sign-in-github" type="button" style="display: none" onclick="sign_in_github()">Sign in with GitHub</button>
    <button id="sign-in-anonymouly" type="button" style="display: none" onclick="sign_in_anonymously()">Sign in anonymously</button>
    <button id="sign-out" type="button" style="display: none" onclick="sign_out()">Sign out</button>

    <!-- Scripts. -->

    <script src="https://www.gstatic.com/firebasejs/3.6.9/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/3.6.9/firebase-auth.js"></script>
    <script src="https://code.jquery.com/jquery-3.1.1.min.js"
            integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="https://cdn.ravenjs.com/3.12.1/raven.min.js"></script>
    <script src="<?= $main_js_url ?>"></script>
  </body>
</html>
