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
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      //on load of home page if any task, do it here.
      //alert('welcome ' + user.uid)

      var db = firebase.database();
      db.ref('UserData/'+user.uid).on('value', function(snapshot){
        document.getElementById('uname').innerHTML = snapshot.val().username;
        document.getElementById('email').innerHTML = snapshot.val().email;
      });
      db.ref('Inventory').once('value', function(snapshot){
        snapshot.forEach(
          
          function(childSnapshot){
            var canteenId = childSnapshot.val().canteenId;
            var category = childSnapshot.val().category;
            var desc = childSnapshot.val().desc;
            var imageUrl = childSnapshot.val().imageUrl;
            var name = childSnapshot.val().name;
            var price = childSnapshot.val().price;
            var productId = childSnapshot.key;

            db.ref('CanteenOwners/'+canteenId).on('value', function(snap){
              var cantName = snap.val().canteenName;
              genCard(productId,imageUrl,name,cantName,price);
            });
            
          }
        )
      });
    } else {
      // User is not signed in.
      location.replace(link+"/login.html")
    }
  });

  //Signout Function below:
  function logOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        location.replace(link+"login.html")
      }).catch((error) => {
        // An error happened.
      });
  }

  //Card genration function.
  function genCard(proId,imgUrl,proName,cantName,proPrice){
    //proId is for genrating order accordinf to product
    var mainDiv = document.getElementById('main_div');

    var cardContainer = document.createElement('div');
    cardContainer.classList.add('col-sm-3','col-6');

    var cardElement = document.createElement('div');
    cardElement.classList.add('row','inventory-card');

    var foodImage =document.createElement('img');
    foodImage.classList.add('food-img','img-fluid');
    foodImage.alt = "food";
    foodImage.src = imgUrl.toString();

    var nameContainer = document.createElement('div');
    nameContainer.classList.add('col-12','p-0');
    
    var nameElement = document.createElement('h6');
    nameElement.className = "card-text-head";
    nameElement.innerHTML = proName.toString();

    var cantContainer = document.createElement('div');
    cantContainer.classList.add('col-12','p-0');

    var cantElement = document.createElement('p');
    cantElement.innerHTML = cantName.toString();

    var priceContainer = document.createElement('div');
    priceContainer.classList.add('col-12','p-0');

    var priceElement = document.createElement('p');
    priceElement.innerHTML = "Price: ₹";

    var priceVal = document.createElement('l');
    priceVal.innerHTML = proPrice.toString();

    var breakElement = document.createElement('br');

    var repeatContainer = document.createElement('div');
    repeatContainer.classList.add('col-12','p-0');

    var repeatElement = document.createElement('a');
    repeatElement.href = proId.toString();
    repeatElement.innerHTML = "<img class=\"img-fluid img-cart\" src=\"res/repeat.svg\"> Add To Cart";

    mainDiv.appendChild(cardContainer);
    cardContainer.appendChild(cardElement);
    cardElement.append(foodImage,nameContainer,cantContainer,priceContainer,repeatContainer);
    nameContainer.appendChild(nameElement);
    cantContainer.appendChild(cantElement);
    priceContainer.append(priceElement,breakElement);
    priceElement.appendChild(priceVal);
    repeatContainer.appendChild(repeatElement);
  }