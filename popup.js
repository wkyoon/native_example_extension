

let txtsendmsg = document.getElementById("txtsendmsg");
let sendmsg = document.getElementById("sendmsg");


sendmsg.addEventListener("click", async () => {
    

   console.log(txtsendmsg.value);
    
   txtsendmsg.value = "";

    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        console.log(response);
    });

});

