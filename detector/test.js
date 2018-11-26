
const Detector = require('./empty_catch_detector');



const src = `<?php
try {
  //check if
  if(filter_var($email, FILTER_VALIDATE_EMAIL) === FALSE) {
    //throw exception if email is not valid
    throw new customException($email);
  }
  else if($email == NULL){
  	throw new customException2($email);
  }else{
  	throw new customException3($email);
  }
}

catch (customException $e) {
  //display custom message
  echo $e->errorMessage();
}
catch (Exception $e){
  
}
catch(customException2 $e){
  
}
catch (customException3 $e){
  echo $e;
}
  
?>`;

const path = "/Users/yaeger/Desktop/extension/weakfinder/detector/test.php";

let detec = new Detector(src, path);

console.log(detec.bugReport());

