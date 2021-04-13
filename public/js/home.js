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

      //recent orders card generation
      db.ref('History/').on('value', function(snapshot){
        //console.log(snapshot.key)
        snapshot.forEach(
          function(snap){
            document.getElementById('recent_div').innerHTML = "";
            //console.log(snap.key)
            snap.forEach(
              function(childSnapshot){
                //console.log(childSnapshot.key)
                if(childSnapshot.key == user.uid){
                  recentOrdTitleCreate();
                  //console.log('inside')
                  var arr = [];
                  var i = 0;
                  childSnapshot.forEach(
                    function(arrChild){
                        arr.push(arrChild);
                        //console.log(arr);
                    }
                  )
                  arr.reverse();
                  arr.forEach(
                    function(childSnap){
                      if(i < 2){
                        //console.log("test"+ childSnap.key)
                        var imgUrl = childSnap.val().imageUrl;
                        var title = childSnap.val().title;
                        var cantName = childSnap.val().canteenName;
                        var price = childSnap.val().price;
                        var quant = childSnap.val().quantity;
                        var total = childSnap.val().subtotal;
                        var desc = childSnap.val().description;
                        var cust = childSnap.val().customization;
                        var status = childSnap.val().status;
                        var proId = childSnap.val().productId;
                        //console.log("test"+ imgUrl)
                        liveCard(imgUrl,title,cantName,price,quant,total,desc,cust,status,proId,user.uid);
                        i++;
                      }
                    }
                  )
                }
              }
            )
          }
        )
      });

      //canteen List database handling.
      db.ref('CanteenOwners/').on('value', function(snapshot){
        //removing all the innerHTML before writing the new updated data in card.
        document.getElementById('mainCant_div').innerHTML = "";
        cantOptTitleCreate();
        snapshot.forEach(
          function(childSnapshot){
            var canteenName = childSnapshot.val().canteenName;
            var email = childSnapshot.val().email;
            var mobileNo = childSnapshot.val().mobileNo;
            var cantId = childSnapshot.key;
            var imgUrl = (childSnapshot.val().imageUrl).toString();
            //encoding cantid to url
            var invUrl = link + '/cantInventory.html?cantId=' + encodeURIComponent(cantId);
            genCantCard(invUrl,imgUrl,canteenName);
          }
        )
      });
    } else {
      // User is not signed in.
      location.replace(link+"/login.html")
    }
  });

  //Signout Function
  function logOut() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
        location.replace(link+"login.html")
      }).catch((error) => {
        // An error happened.
      });
  }

  //creating title for canteen options...
  function cantOptTitleCreate(){
    var mainDiv = document.getElementById('cantTitle');

    var titleContainer = document.createElement('div');
    titleContainer.className = "title";
    titleContainer.innerHTML = "<h4>Canteen Opts.</h4><hr class=\"hr1\"><hr class=\"hr2\">"
    
    mainDiv.appendChild(titleContainer);
  }

  //creating title for recent orders...
  function recentOrdTitleCreate(){
    var mainDiv = document.getElementById('recentTitle');

    var titleContainer = document.createElement('div');
    titleContainer.className = "title";
    titleContainer.innerHTML = "<h4>Recent Orders</h4><hr class=\"hr1\"><hr class=\"hr2\">"
    
    mainDiv.appendChild(titleContainer);
  }

  //function to create recent card
  function liveCard(imgUrl,title,cantName,price,quant,total,desc,cust,status,proid,userId){
    var mainDiv = document.getElementById('recent_div');

    var cardContainer = document.createElement('div');
    cardContainer.classList.add('col-md-6','col-12','justify-content-center','pb-1');

    var cardSubContainer = document.createElement('div');
    cardSubContainer.classList.add('row','recent-card');

    var cardPart1 = document.createElement('div');
    cardPart1.classList.add('col-5','p-0','m-0');

    var imgElement = document.createElement('img');
    imgElement.classList.add('food-img','img-fluid');
    imgElement.alt = "foodimg";
    imgElement.src = imgUrl.toString();

    var titleElement = document.createElement('h6');
    titleElement.className = "card-text-head";
    titleElement.innerHTML = title.toString();

    var canteenElement = document.createElement('h6');
    canteenElement.className = "card-text-sub";
    canteenElement.innerHTML = cantName.toString();

    var priceElement = document.createElement('p');
    priceElement.className = "price_text";

    var strElement = document.createElement('strong');
    strElement.innerHTML = "Price: ";

    var litElement = document.createElement('light');
    litElement.innerHTML = "₹";

    var priceValue = document.createElement('light');
    priceValue.innerHTML = price.toString();
    
    var cardPart2 = document.createElement('div');
    cardPart2.classList.add('col-7','content','p-0','border-left');

    var quantParaElement = document.createElement('p');
    
    var quantStrElement = document.createElement('strong');
    quantStrElement.innerHTML = "Quantity: ";

    var quantValue = document.createElement('light');
    quantValue.innerHTML = quant.toString();

    var totalParaElement = document.createElement('p');
    
    var totalStrElement = document.createElement('strong');
    totalStrElement.innerHTML = "Total: ";

    var totalrsElement = document.createElement('light');
    totalrsElement.innerHTML = "₹";

    var totalValue = document.createElement('light');
    totalValue.innerHTML = total.toString();

    var descParaElement = document.createElement('p');
    
    var descStrElement = document.createElement('strong');
    descStrElement.innerHTML = "Description: ";

    var descValue = document.createElement('light');
    descValue.innerHTML = desc.toString();

    var custParaElement = document.createElement('p');
    
    var custStrElement = document.createElement('strong');
    custStrElement.innerHTML = "Customization: ";

    var custValue = document.createElement('light');
    custValue.innerHTML = cust.toString();

    var statusParaElement = document.createElement('p');
    statusParaElement.style.marginBottom = "25px";

    var statusStrElement = document.createElement('strong');
    statusStrElement.innerHTML = "Status: ";

    var statusValue = document.createElement('light');
    statusValue.innerHTML = status.toString();

    var repeatDiv = document.createElement('div');
    repeatDiv.classList.add('col','rep-ord','d-flex','align-items-end','flex-column');

    var repeatParaElement = document.createElement('button');
    repeatParaElement.innerHTML = "<img src=\"res/repeat.svg\"> Repeat Order"
    repeatParaElement.setAttribute('onclick',('fun("'+proid+'","'+userId+'")'));

    mainDiv.appendChild(cardContainer);
    cardContainer.appendChild(cardSubContainer);
    cardSubContainer.append(cardPart1,cardPart2);
    cardPart1.append(imgElement,titleElement,canteenElement,priceElement)
    priceElement.append(strElement,litElement,priceValue);
    cardPart2.append(
      quantParaElement,
      totalParaElement,
      descParaElement,
      custParaElement,
      statusParaElement,
      repeatDiv
    );
    quantParaElement.append(quantStrElement,quantValue);
    totalParaElement.append(totalStrElement,totalrsElement,totalValue);
    descParaElement.append(descStrElement,descValue);
    custParaElement.append(custStrElement,custValue);
    statusParaElement.append(statusStrElement,statusValue);
    repeatDiv.appendChild(repeatParaElement);
  }

  //Canteens List Card genration function.
  function genCantCard(invUrl,imgUrl,cantName){
    var mainDiv = document.getElementById('mainCant_div');

    var cardContainer = document.createElement('div');
    cardContainer.classList.add('col-md-3','col-6');

    var aElement = document.createElement('a');
    aElement.href = invUrl.toString();

    var cardElement = document.createElement('div');
    cardElement.className = "cant-card";

    var imgElement = document.createElement('img');
    imgElement.classList.add('food-img','img-fluid');
    imgElement.src = imgUrl.toString();

    var hrElement = document.createElement('hr');

    var pElement = document.createElement('p');

    var strElement = document.createElement('strong');
    strElement.innerHTML = cantName.toString();

    mainDiv.appendChild(cardContainer);
    cardContainer.appendChild(aElement);
    aElement.appendChild(cardElement);
    cardElement.append(imgElement,hrElement,pElement);
    pElement.appendChild(strElement);
  }

  //this fun function is for adding items to cart.
  function fun(proId,uId){
    db = firebase.database();
    db.ref('Inventory/'+proId).on('value', function(snapshot){
      var canteenId = snapshot.val().canteenId;
      var proDesc = snapshot.val().desc;
      var proImageUrl = snapshot.val().imageUrl;
      var proName = snapshot.val().name;
      var proPrice = snapshot.val().price;
      var quant = '1';
      db.ref('CanteenOwners/'+canteenId).on('value', function(snap){
        var cantName = snap.val().canteenName;
        db.ref('UserData/'+uId).on('value',function(childSnap){
          var uname = childSnap.val().username;
          db.ref('TempOrder/'+canteenId+'/'+uId).push().set({
            username: uname,
            productId: proId,
            title: proName,
            canteenName: cantName,
            price: proPrice,
            quantity: quant,
            subTotal: (proPrice*quant),
            description: proDesc,
            customization: "none",
            status: "Not Accepted",
            imgUrl: proImageUrl
          });
        });
      });
    });
    alert("Item Added to Cart");
  }


  //Search function.......
  function search(){
    var searchValue = document.getElementById('searchValue').value.toLowerCase();
    //alert(searchValue)
    var arr =[];
    var db = firebase.database();
    db.ref('Inventory/').on('value', function(snapshot){
      snapshot.forEach(
        function(childSnapshot){
          var catagory = childSnapshot.val().category.toString().toLowerCase();
          var name = childSnapshot.val().name.toString().toLowerCase();
          if(catagory == searchValue || name == searchValue){
            arr.push(childSnapshot);
          }
        }
      )
      if(arr[0] == null){
        console.log('null')
        document.getElementById('searchResult').innerHTML = "<h5 class=\"mt-2\">No result found!!!</h5>";
      }
      else{
        console.log('notnull');
        document.getElementById('searchResult').innerHTML = "";
        arr.forEach(
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
              searchCard(productId,imageUrl,name,cantName,price,userdata.uid);
            });
          }
        );
      }
      
      document.getElementById('searchOutput').style.visibility = "visible";
      document.getElementById('searchOutput').style.position = "relative";
    });
  }
  //closesearch section......
  function removeSearchResult(){
    document.getElementById('searchOutput').style.visibility = "hidden";
    document.getElementById('searchOutput').style.position = "absolute";
  }

  //SearchCard js
  function searchCard(proid,imgUrl,proName,cantName,proPrice,userId){
    //proId is for genrating order accordinf to product
    var mainDiv = document.getElementById('searchResult');

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

    var repeatElement = document.createElement('button');
    repeatElement.innerHTML = "<img class=\"img-fluid img-cart\" src=\"res/repeat.svg\"> Add To Cart";
    repeatElement.setAttribute('onclick',('fun("'+proid+'","'+userId+'")'));
    
    mainDiv.appendChild(cardContainer);
    cardContainer.appendChild(cardElement);
    cardElement.append(foodImage,nameContainer,cantContainer,priceContainer,repeatContainer);
    nameContainer.appendChild(nameElement);
    cantContainer.appendChild(cantElement);
    priceContainer.append(priceElement,breakElement);
    priceElement.appendChild(priceVal);
    repeatContainer.appendChild(repeatElement);
  }