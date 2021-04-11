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
  var userdata;

  firebase.initializeApp(firebaseConfig);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      userdata = user;
      //on load of home page if any task, do it here.
      //alert('welcome ' + user.uid)
      var db = firebase.database();
      db.ref('UserData/'+user.uid).on('value', function(snapshot){
        document.getElementById('uname').innerHTML = snapshot.val().username;
        document.getElementById('email').innerHTML = snapshot.val().email;
      });
      db.ref('TempOrder/').on('value', function(snapshot){
        var totalAmount = 0;
        document.getElementById('total').innerHTML = 0;
        document.getElementById('mainCard_div').innerHTML = "<div class=\"col-12 margin-adj\"></div>";
        //console.log(snapshot.key)
        snapshot.forEach(
          function(snap){
            //console.log(snap.key)
            snap.forEach(
              function(childSnapshot){
                //console.log(childSnapshot.key)
                if(childSnapshot.key == user.uid){
                  //console.log('inside')
                  childSnapshot.forEach(
                    function(childSnap){
                      //console.log("test"+ childSnap.key)
                      var protitle = childSnap.val().title;
                      var procantName = childSnap.val().canteenName;
                      var proprice = childSnap.val().price;
                      var prodesc = childSnap.val().description;
                      var procust  = childSnap.val().customization;
                      var proquant = childSnap.val().quantity;
                      var prosubTotal = childSnap.val().subTotal;
                      //console.log(protitle);
                      ordCard(protitle,procantName,proprice,prodesc,procust,proquant,prosubTotal,snap.key,childSnapshot.key,childSnap.key);
                      totalAmount = totalAmount + parseInt(prosubTotal);
                      document.getElementById('total').innerHTML = totalAmount;
                                              
                    }
                  )
                }
              }
            )
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

  function ordCard(title,cantName,price,desc,cust,quant,subTotal,cantId,userId,ordId){
    var cardContainer = document.getElementById('mainCard_div');

    var cardElement = document.createElement('div');
    cardElement.classList.add('col-sm-6','col-12');

    var subCardElement = document.createElement('div');
    subCardElement.classList.add('row','cart-card');
    
    var titleElement = document.createElement('h5');
    titleElement.innerHTML = title.toString();

    var cantNameElement = document.createElement('h6');
    cantNameElement.innerHTML = cantName.toString();

    var dataElement = document.createElement('div');
    dataElement.className = "col-12";

    var priceParagraphElement = document.createElement('p');

    var priceText = document.createElement('strong');
    priceText.innerHTML = "Price: ";

    var rsh7Element = document.createElement('h7');
    rsh7Element.innerHTML = "₹";

    var priceValue = document.createElement('h7');
    priceValue.innerHTML = price.toString();

    var descParagraphElement = document.createElement('p');

    var descText = document.createElement('strong');
    descText.innerHTML = "Description: ";

    var descValue = document.createElement('h7');
    descValue.innerHTML = desc.toString();

    var custParagraphElement = document.createElement('p');

    var custText = document.createElement('strong');
    custText.innerHTML = "Customization: ";

    var custValue = document.createElement('textarea');
    custValue.innerHTML = cust.toString();
    custValue.id = ordId.toString();

    var submitContainer = document.createElement('div');
    submitContainer.classList.add('row','justify-content-center');

    var submitSubContainer = document.createElement('div');
    submitSubContainer.className = "col-12";

    var submitSubSubContainer = document.createElement('div');
    submitSubSubContainer.classList.add('row','m-0','justify-content-end');

    var submitButton = document.createElement('button');
    submitButton.classList.add('submit','bg-transparent');
    submitButton.innerHTML = "Submit-Customization";
    submitButton.setAttribute('onclick',('submitCustomization("'+cantId+'","'+userId+'","'+ordId+'")'));

    var btnContainer = document.createElement('div');
    btnContainer.classList.add('row','quantity-control-btn');

    var btnLeftElement = document.createElement('button');
    btnLeftElement.className = "left";
    btnLeftElement.innerHTML = "-";
    btnLeftElement.setAttribute('onclick',('decrement("'+cantId+'","'+userId+'","'+ordId+'")'));

    var quantityElement = document.createElement('p');
    quantityElement.innerHTML = quant.toString();

    var btnRightElement = document.createElement('button');
    btnRightElement.className = "right";
    btnRightElement.innerHTML = "+";
    btnRightElement.setAttribute('onclick',('increment("'+cantId+'","'+userId+'","'+ordId+'")'));
    
    var subTotalElement = document.createElement('h6');
    subTotalElement.innerHTML = "Sub-Total: ";

    var rsStrElement = document.createElement('strong');
    rsStrElement.innerHTML = "₹";
    
    var subTotalValue = document.createElement('strong');
    subTotalValue.innerHTML = subTotal.toString();

    cardContainer.appendChild(cardElement);
    cardElement.appendChild(subCardElement);
    subCardElement.append(
      titleElement,
      cantNameElement,
      dataElement
    );
    dataElement.append(
      priceParagraphElement,
      descParagraphElement,
      custParagraphElement,
      custValue,
      submitContainer,
      btnContainer
    );
    priceParagraphElement.append(
      priceText,
      rsh7Element,
      priceValue
    );
    descParagraphElement.append(
      descText,
      descValue
    );
    custParagraphElement.append(custText);
    submitContainer.appendChild(submitSubContainer);
    submitSubContainer.appendChild(submitSubSubContainer);
    submitSubSubContainer.appendChild(submitButton);






    btnContainer.append(
      btnLeftElement,
      quantityElement,
      btnRightElement,
      subTotalElement
    );
    subTotalElement.append(
      rsStrElement,
      subTotalValue
    );
  }

  //function for increment quantity inside the card
  function increment(cantId,userId,ordId){
    var quant;
    var price;
    var db = firebase.database().ref('TempOrder/' + cantId + "/" + userId + "/" + ordId);
    db.on('value', function(snapshot){
      quant = snapshot.val().quantity;
      price = snapshot.val().price;
    });
    quant++;
    db.update({
      quantity: quant,
      subTotal: (price*quant)
    });    
  }

  //function for decrement quantity inside the card
  function decrement(cantId,userId,ordId){
    var quant;
    var price;
    var db = firebase.database().ref('TempOrder/' + cantId + "/" + userId + "/" + ordId);
    db.on('value', function(snapshot){
      quant = snapshot.val().quantity;
      price = snapshot.val().price;
    });
    quant--;
    db.update({
      quantity: quant,
      subTotal: (price*quant)
    });
    if (quant == 0){
      db.remove();
    }
  }

  //CheckOut function...
  function checkOut(){
    var db = firebase.database();
    db.ref('TempOrder/').on('value', function(snapshot){
      //console.log(snapshot.key) == TempOrder
      snapshot.forEach(
        function(snap){
          //console.log(snap.key) == Canteen ID
          snap.forEach(
            function(childSnapshot){
              //console.log(childSnapshot.key) == Student ID
              if(childSnapshot.key == userdata.uid){
                //console.log('inside')
                childSnapshot.forEach(
                  function(childSnap){
                    //console.log("test"+ childSnap.key) == Order ID
                    db.ref('LiveOrder/' + snap.key + "/" + childSnapshot.key + "/" + childSnap.key).set({
                      username: childSnap.val().username,
                      productId: childSnap.val().productId,
                      title: childSnap.val().title,
                      canteenName: childSnap.val().canteenName,
                      price: childSnap.val().price,
                      quantity: childSnap.val().quantity,
                      subTotal: childSnap.val().subTotal,
                      description: childSnap.val().description,
                      customization: childSnap.val().customization,
                      status: childSnap.val().status,
                      imgUrl: childSnap.val().imgUrl
                    });
                    //after adding item to live order removing each card
                    db.ref('TempOrder/' + snap.key + "/" + childSnapshot.key + "/" + childSnap.key).remove();                                            
                  }
                )
              }
            }
          )
        }
      )
    });
  }

  function submitCustomization(cantId,userId,orderId){
    var db = firebase.database().ref('TempOrder/' + cantId + "/" + userId + "/" + orderId);
    db.update({
      customization: (document.getElementById(orderId.toString()).value).toString()
    })
  }