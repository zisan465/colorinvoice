
//popup function
function pasteTextForChallan() {
  var textarea = document.getElementById('myTextarea');
  navigator.clipboard.readText().then(text => {
    textarea.value = text;

    var popup = document.getElementById('popup');
    popup.style.opacity = 0;
    popup.style.visibility = 'hidden';
    document.getElementById("row-2").style.display="none";
    document.getElementById("unit-price").style.display="none";
    document.getElementById("total-price").style.display="none";
    document.getElementById('header-slogan').textContent='বিক্রয় চালান';
    parseAndDisplay('challan')
  });
}
function pasteTextForInvoice(){
  var textarea = document.getElementById('myTextarea');
  navigator.clipboard.readText().then(text => {
    textarea.value = text;

    var popup = document.getElementById('popup');
    popup.style.opacity = 0;
    popup.style.visibility = 'hidden';
    parseAndDisplay('invoice')
  });

}


function openPopup() {
  var popup = document.getElementById('popup');
  popup.style.opacity = 1;
  popup.style.visibility = 'visible';
 
}
window.onload = openPopup;
//popup Function Work Done



function parseAndDisplay(getValue) {
  //Data Shorting Here
  var inputValue = document.getElementById('myTextarea').value;
  var lines = inputValue.split('\n');
  lines = lines.filter(line => line.trim() !== '');
  var customerInfo = lines.slice(0, 7);
  var products = lines.slice(7, -11).map(line => {
    var values = line.split('\t');
    return {
      code: values[1],
      description: values[2],
      quantity: values[3],
      unitPrice: parseFloat(values[4]),
      total: parseFloat(values[5])
    };
  });
  var moneyDetails = lines.slice(-11).map(line => {
    var [key, value] = line.split(':');
    return { [key.trim()]: parseFloat(value.trim()) };
  });
  var result = {
    customerInfo: customerInfo,
    products: products,
    moneyDetails: moneyDetails
  };
//Data Shorting Complete


//////////////// Customer Information Data Set Here///////////////////
  for (let i = 0; i < result.customerInfo.length; i++) {
    if(i==4){
      //data formation
      var deliveryAddressString = result.customerInfo[i];
      var deliveryAddress = deliveryAddressString.split('Delivery Address:')[1].split('Sales by:')[0].trim();  
      if(deliveryAddress==''){
        document.getElementById('customer-header-deliveryaddress-info').style.display='none'
      }else{
        document.getElementById('customer-delivery-address').innerText=deliveryAddress; 
      }
       
 
    } else{
      //data formating

      var namePart = result.customerInfo[i].split(":"); 
      var key = namePart[0].trim();
      var customerName = namePart.slice(1).join(':').trim();
      //condition based data seting 
      if(i==0){

        document.getElementById('customer-id').innerText=convertToBanglaNumber(customerName); 

      }else if(i==1){

        if(customerName==''){
          document.getElementById('customer-header-name-info').style.display='none'
        }else{
          document.getElementById('customer-name').innerText=customerName;
        }

      }else if(i==2){
        
        if(customerName==''){
          document.getElementById('customer-header-number-info').style.display='none';
        }else{
          document.getElementById('customer-number').innerText=convertToBanglaNumber(customerName);
        }

      }else if(i==3){

        if(customerName==''){
          document.getElementById('customer-header-presentaddress-info').style.display='none'
        }else{
          document.getElementById('customer--address').innerText=customerName;
        }

      }else if(i==5){
        document.getElementById('customer-challan-no').innerText=convertToBanglaNumber(customerName);
      }else if(i==6){
        document.getElementById('sales-time').innerText=convertToBanglaNumber(customerName);
      };
    } 
  }
  
//////////////////Invoice Or Challan/////////////////////////
  if(getValue=="invoice"){

    ////////------------Product Add----------///////////////
    var productsTableBody = document.getElementById('dinamic-product-add');
    for (var i = 1; i < result.products.length; i++) {
      var row = document.createElement('tr');
    
      var cellNumber = document.createElement('td');
      cellNumber.textContent = convertToBanglaNumber(i) ;
      row.appendChild(cellNumber); 
    
      var cellCode = document.createElement('td');
      cellCode.textContent = convertToBanglaNumber(result.products[i].code);
      cellCode.contentEditable = true;
      row.appendChild(cellCode);
    
     
    
      var cellDescription = document.createElement('td'); 
      cellDescription.textContent =  convertToBanglaNumber(productlist[result.products[i].code]);
      cellDescription.contentEditable = true;
      row.appendChild(cellDescription);  
      
    
      var cellQuantity = document.createElement('td');
      cellQuantity.colSpan = 3; // colspan='3'
      var unitchanging = convertUnits(result.products[i].quantity)
      cellQuantity.textContent = convertToBanglaNumber(unitchanging); 
      cellQuantity.contentEditable = true;
      row.appendChild(cellQuantity); 
    
      var cellUnitPrice = document.createElement('td');
      cellUnitPrice.textContent = convertToBanglaNumber(result.products[i].unitPrice);
      cellUnitPrice.contentEditable = true;
      row.appendChild(cellUnitPrice);
    
      var cellTotal = document.createElement('td');
      cellTotal.textContent = convertToBanglaNumber(result.products[i].total);
      cellTotal.contentEditable = true;
      row.appendChild(cellTotal);
      productsTableBody.appendChild(row);
    }

///////////////----------Summery Calculation ----------///////////////////
  var previousDue,subtotal,discount ,labourCost,transport;
    for (var i = 0; i < result.moneyDetails.length; i++) {
        for (var key in result.moneyDetails[i]) {
            if (i == 0) {
                previousDue = result.moneyDetails[i][key];
                document.getElementById('previous-due').innerText = convertToBanglaNumber(result.moneyDetails[i][key]);
            } else if (i == 3) {
                subtotal = result.moneyDetails[i][key];
                document.getElementById('subtotal').innerText = convertToBanglaNumber(result.moneyDetails[i][key]);
            } else if (i == 5) {
                discount = result.moneyDetails[i][key];
                document.getElementById('discount').innerText = convertToBanglaNumber(result.moneyDetails[i][key]);
            } else if (i == 6) {
                labourCost = result.moneyDetails[i][key];
                document.getElementById('labour-cost').innerText = convertToBanglaNumber(result.moneyDetails[i][key]);
            } else if (i == 7) {
              transport = result.moneyDetails[i][key];
                document.getElementById('transport-cost').innerText = convertToBanglaNumber(result.moneyDetails[i][key]);
            } else if (i == 9) {
                document.getElementById('submision-ammount').innerText = convertToBanglaNumber(result.moneyDetails[i][key]);
            } else if (i == 2) {
              document.getElementById('due-amount').innerText = convertToBanglaNumber(result.moneyDetails[i][key]);
              logochange(result.moneyDetails[i][key])
            }else{
              var sum = (previousDue + subtotal + labourCost+ transport)- discount;
              document.getElementById('total-amount').innerText = convertToBanglaNumber(sum)
            }
        }
    }

  }else{ /////////If It's Challan-----------

    //Product Adding Here
    var productsTableBody = document.getElementById('dinamic-product-add');
    for (var i = 1; i < result.products.length; i++) {
      var row = document.createElement('tr');
      var cellNumber = document.createElement('td');
      
      cellNumber.textContent = convertToBanglaNumber(i) ;
      cellNumber.contentEditable = true;
      row.appendChild(cellNumber); 
      
      var cellCode = document.createElement('td');
      cellCode.textContent = convertToBanglaNumber(result.products[i].code);
      cellCode.contentEditable = true;
      row.appendChild(cellCode);
      
      var cellDescription = document.createElement('td'); 
      cellDescription.textContent =  convertToBanglaNumber(productlist[result.products[i].code]);
      cellDescription.contentEditable = true;
      row.appendChild(cellDescription); 
      
      var cellQuantity = document.createElement('td');
      cellQuantity.colSpan = 3; // colspan='3'
      var unitchanging = convertUnits(result.products[i].quantity)
      cellQuantity.textContent = convertToBanglaNumber(unitchanging);
      cellQuantity.contentEditable = true;
      row.appendChild(cellQuantity); 
      productsTableBody.appendChild(row);
    }
    window.print()
  }

} 













//unit convert
function convertUnits(inputString) {
  const regex = /(\d+)\s*([a-zA-Z]+)/g;
  const resultString = inputString.replace(regex, (_, number, unit) => {
    const translatedUnit = unitTranslations[unit.toLowerCase()] || unit;
    return `${number} ${translatedUnit}`;
  });
  return resultString;
} 

//English Number to Bangla Number Convert
function convertToBanglaNumber(englishNumber) {
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const banglaNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

  const englishNumberString = englishNumber.toString();
  let banglaNumberString = '';

  for (let i = 0; i < englishNumberString.length; i++) {
    const digit = englishNumbers.indexOf(englishNumberString[i]);
    banglaNumberString += digit !== -1 ? banglaNumbers[digit] : englishNumberString[i];
  }

  return banglaNumberString;
}




//logo Seting here
   function logochange(params) {
    if(params <= 0){
  document.getElementById('duepaidsell').src = "paid.png";
    }
    setTimeout(delayedFunction, 500);
   }
   function delayedFunction() {
    window.print()
  }
  
  // Call the function after a 1-second delay
  
  
