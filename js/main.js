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

firebase.initializeApp({
  apiKey: "AIzaSyDDQOSqmL6qKGRX2vMmwDb_NCsPsvA6Of4",
  authDomain: "blooks-today.firebaseapp.com"})

firebase.auth().onAuthStateChanged (function (user) {
  if (user) {
    $('#signed-in-name') .text (user.displayName)
    $('#sign-in-github') .hide()
    $('#sign-in-anonymouly') .hide()
    $('#sign-out') .show()
  } else {
    $('#signed-in-name') .text ('')
    $('#sign-in-github') .show()
    $('#sign-in-anonymouly') .show()
    $('#sign-out') .hide()}});
