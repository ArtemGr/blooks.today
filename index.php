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
    <title>
      Blooks Today
    </title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
    </style>
  </head>
  <body>
    HW
  </body>
  <script src="<?= $main_js_url ?>" async></script>
</html>
