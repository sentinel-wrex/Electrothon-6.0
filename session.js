
window.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("button");
    const result = document.getElementById("result");
    const main = document.getElementsByTagName("main")[0];
    let listening = false;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (typeof SpeechRecognition !== "undefined") {
      const recognition = new SpeechRecognition();

      const stop = () => {
        main.classList.remove("speaking");
        recognition.stop();
        button.textContent = "Start listening";
      };

      const start = () => {
        main.classList.add("speaking");
        recognition.start();
        button.textContent = "Stop listening";
      };

      const onResult = event => {
        result.innerHTML = "";
        for (const res of event.results) {
          const text = document.createTextNode(res[0].transcript);
          const p = document.createElement("p");
          p.id = 'speechResult'
          if (res.isFinal) {
            p.classList.add("final");
          }
          p.appendChild(text);
          result.appendChild(p);

        }
      };
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.addEventListener("result", onResult);
      button.addEventListener("click", event => {
        listening ? stop() : start();
        listening = !listening;
      });
    } else {
      button.remove();
      const message = document.getElementById("message");
      message.removeAttribute("hidden");
      message.setAttribute("aria-hidden", "false");
    }
  });

var clicked = 0
var transcript = []

function nextQuestion() {
var msg = ""
if (clicked == 0) {
  msg = "Hello! How was your day? Good or bad?"
  document.getElementById("checker").innerHTML = "Next";
} if (clicked == 1) {
  transcript[0] = document.getElementById("speechResult").innerHTML
  if (transcript[0].includes("good")) {
    msg = "I am glad to hear that your day was good. Tell me more."
  } else if (transcript[0].includes("bad")) {
    msg = "I am sorry to hear that. Tell me more."
  } else {
    msg = "Interesting. Tell me more."
  }
} if (clicked == 2) {
  transcript[1] = document.getElementById("speechResult").innerHTML
  msg = "I understand your feelings. Would you like to talk or take a mindful minute?"
}if (clicked == 3) {
  transcript[2] = document.getElementById("speechResult").innerHTML
  if (transcript[2].includes("talk")) {
    msg = "Alright - rant your heart out."
  } else if (transcript[2].includes("mindful") || transcript[2].includes("minute")) {
    document.getElementById("speechResult").innerHTML = ""
    msg = "Ok, lets just be quiet together. While we have a mindful minute, try to reflect on the good parts of your day."
  } else {
    msg = "I didn't quite catch that. Please try again."
    clicked = clicked - 1
  }
} if (clicked == 4) {
  transcript[3] = document.getElementById("speechResult").innerHTML
  msg = "Thank you for using Counsyl."
  var check = document.getElementById('checker');
  check.style.display = 'none'
  var checkII = document.getElementById('button');
  checkII.style.display = 'none'
  document.getElementById("submit").setAttribute("value", transcript.toString());
  const message = document.getElementById("submit");
  message.removeAttribute("hidden");
  message.setAttribute("aria-hidden", "false");
}
document.getElementById("question").innerHTML = (msg);
var msg = new SpeechSynthesisUtterance(msg);
window.speechSynthesis.speak(msg);
clicked = clicked + 1
if (clicked == 3) {
  if (transcript[2].includes("mindful") || transcript[2].includes("minute")) {
    var intervalID = window.setInterval(myCallback, 1000);
    function myCallback() {
      var audio = new Audio('https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3');
      audio.play();
    }
  }
}
}

document.getElementById("checker").addEventListener("click", nextQuestion);
document.getElementById("stop").addEventListener("click", quitandsave);
  