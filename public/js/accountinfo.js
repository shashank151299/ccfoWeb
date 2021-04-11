var firebaseConfig = {
  apiKey: "AIzaSyBxMaK_ncQqk4bdpgwv3uDBhfCuLXed4Mc",
  authDomain: "pmms-ccfo.firebaseapp.com",
  databaseURL: "https://pmms-ccfo-default-rtdb.firebaseio.com",
  projectId: "pmms-ccfo",
  storageBucket: "pmms-ccfo.appspot.com",
  messagingSenderId: "906514244130",
  appId: "1:906514244130:web:8b6c47d1f9d5c0dc07a07b",
  measurementId: "G-HK4HRJKCTT"
};

//var link = "https://shashank151299.github.io/ccfoWeb/public";
var link = "https://pmms-ccfo.web.app/";
//var link = "http://localhost:5000";

firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // User is signed in.
    //on load of home page if any task, do it here.
    //alert('welcome ' + user.uid)

    var db = firebase.database().ref('UserData/' + user.uid);
    db.on('value', function (snapshot) {
      document.getElementById('uname').innerHTML = snapshot.val().username;
      document.getElementById('email').innerHTML = snapshot.val().email;
      document.getElementById('user_name').setAttribute('value', snapshot.val().username);
      document.getElementById('mobile_no').setAttribute('value', snapshot.val().mobile);
      document.getElementById('email_id').setAttribute('value', snapshot.val().email);
      //storing user id in html tag to retrive it in another function
      document.getElementById('x').innerHTML = snapshot.key;
    });


  } else {
    // User is not signed in.
    location.replace(link + "/login.html")
  }
});

//Signout Function below:
function logOut() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    location.replace(link + "login.html")
  }).catch((error) => {
    // An error happened.
  });
}

//upating user data
function update(event) {
  event.preventDefault()
  var uname = document.getElementById('user_name').value;
  var uid = document.getElementById('x').innerHTML;
  firebase.database().ref('UserData/' + uid).update({ username: uname });
}