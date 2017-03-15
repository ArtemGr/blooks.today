function sign_in_anonymously() {
  firebase.auth().signInAnonymously().then (function (user) {
    firebase.auth().currentUser.getToken (/* forceRefresh */ false) .then (function (idToken) {
      // TODO: Remove this call. We're going to pass the token along with the non-specific AJAX request for now.
      $.ajax ('//blooks.today/r/firebase_id_token', {method: 'POST', dataType: 'json', contentType: 'application/json', data: JSON.stringify ({
        firebase_id_token: idToken})})})})/*.catch (function (error) {...})*/}

function sign_in_github() {
  firebase.auth().signInWithPopup (new firebase.auth.GithubAuthProvider()) .then (function (result) {
    firebase.auth().currentUser.getToken (/* forceRefresh */ false) .then (function (idToken) {
      // TODO: Remove this call. We're going to pass the token along with the non-specific AJAX request for now.
      $.ajax ('//blooks.today/r/firebase_id_token', {method: 'POST', dataType: 'json', contentType: 'application/json', data: JSON.stringify ({
        firebase_id_token: idToken})})})})/*.catch (function (error) {...})*/}

function sign_out() {
  firebase.auth().signOut()/*.catch (function (err) {...})*/}

function check_url() {
  // Initialize the static variables.
  if (!check_url.url) check_url.url = ''
  if (!check_url.url_entered_at) check_url.url_entered_at = 0
  if (!check_url.fetch_started_at) check_url.fetch_started_at = 0
  if (!check_url.state) check_url.state = 'waiting_for_url'

  // See if the URL has changed.
  var input_url = $('#rss-prompt-url').val();
  if (check_url.url != input_url && (check_url.state == 'waiting_for_url' || check_url.state == 'url_entered')) {
    check_url.url = input_url
    check_url.url_entered_at = Date.now()
    check_url.state = 'url_entered'}

  // See if the URL is old enough for us to check.
  if (check_url.state == 'url_entered' && Date.now() - check_url.url_entered_at > 600) {
    check_url.state = 'fetching'
    check_url.fetch_started_at = Date.now()
    $('#rss-preview').html ('The URL is "' + check_url.url + '", fetching (TBD)...')}

  // Timeout the fetch if necessary.
  var fetch_delta = Date.now() - check_url.fetch_started_at
  if (check_url.state == 'fetching' && fetch_delta >= 3000) {
    if (fetch_delta < 20000) {
      $('#rss-preview').html ('The URL is "' + check_url.url + '", fetching (' + Math.round (fetch_delta / 1000) + ' seconds passed)...')
    } else {
      check_url.state = 'waiting_for_url'
      $('#rss-preview').html ('Timeout fetching The URL, "' + check_url.url + '". Try another one.')
    }
  }
}

firebase.initializeApp({
  apiKey: "AIzaSyDDQOSqmL6qKGRX2vMmwDb_NCsPsvA6Of4",
  authDomain: "blooks-today.firebaseapp.com"})

firebase.auth().onAuthStateChanged (function (user) {
  if (user) {
    $('#signed-in-name') .text ('Hello, ' + user.displayName + '!')
    $('#sign-in-github') .hide()
    $('#sign-in-anonymouly') .hide()
    $('#sign-out') .show()
    $('#rss-prompt') .show()
    if (!check_url.interval) check_url.interval = setInterval (check_url, 200)
  } else {
    $('#signed-in-name') .text ('')
    $('#sign-in-github') .show()
    $('#sign-in-anonymouly') .show()
    $('#sign-out') .hide()
    if (check_url.interval) {clearInterval (check_url.interval); check_url.interval = null}}});
