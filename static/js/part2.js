let startingMinutes = 0;
let startingSeconds = 0;
let time = startingMinutes * 60 + startingSeconds;
const countdownEl = document.getElementById('timer');
const signalAudio = document.getElementById('signalAudio');
const infoAudio = document.getElementById('infoAudio');
const practicePanel = document.getElementById('practice-panel');
const resultPanel = document.getElementById('result-panel');
const infoText = document.getElementById('infoText');
var questions = document.getElementsByName('question');
var answers = document.getElementsByName('answer');
let repetitions = 0;
var timer = 0;
const totalRepetitions = 1;
let isPreparation = true;

let mediaRecorder;
let audioChunks = [];
let audioBlobs = [];
const formData = new FormData();

function setTimer(minutes, seconds){
    startingMinutes = minutes;
    startingSeconds = seconds;
    time = startingMinutes * 60 + startingSeconds;
}

function playSignal(){
    signalAudio.play();
}

function playQuestion(){
    if ('speechSynthesis' in window) {

        const synthesis = window.speechSynthesis;
        
        var textToSpeak = questions[0].innerText;
    
        var utterance = new SpeechSynthesisUtterance(textToSpeak);

        synthesis.speak(utterance);

        isPreparation = true;

        setTimer(1, 0);

        timer = setInterval(updateCountdown, 1000);
    }

    else {
        alert('Please use a modern browser.');
    }
}

function playInfo(){
    infoAudio.play();

    infoAudio.onended = function() {
        hideInfo();
        showQuestion();
        playQuestion();
    };
}

function showQuestion(){
    questions[0].style.display = 'block';
}

function hideQuestion(){
    questions[0].style.display = 'none';
}

function hideInfo(){
    infoText.style.display = 'none';
}

playInfo();

function updateCountdown() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    minutes = minutes < 10 ? '0' + minutes: minutes;
    seconds = seconds < 10 ? '0' + seconds: seconds;
    countdownEl.innerHTML = `${minutes}:${seconds}`;

    if (time === 0) {
        if(totalRepetitions === repetitions){
            clearInterval(timer);
            stopRecording();
            practicePanel.style.display = 'none';
            resultPanel.style.display = 'block';
        }
        else if(isPreparation === true){
                playSignal();
                startRecording();
                repetitions++;
                setTimer(2, 0);
                isPreparation = false;
            }
            else{
                stopRecording();
                playQuestion();
            }
    }
    else {
        time--;        
    }
}

async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        answers[repetitions-1].src = audioUrl;
        audioBlobs.push(audioBlob);

        formData.append('answers', audioBlob);

        audioChunks = [];
    };

    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
}

async function submit_answers() {

    formData.append('part', '2');

    const csrftoken = getCookie('csrftoken');
    var submitButton = document.getElementById('submitButton');

    questions.forEach(function(question){
        formData.append('questions', question.id);
    });

    submitButton.innerHTML="Submitting ...";
    submitButton.setAttribute("disabled", "");

    try {
        await fetch('/speaking/save_answers/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            body: formData,
            'Content-type': 'multipart/form-data',
        });

        window.location.href = "/speaking/submitted/";

    } catch (error) {
        console.error('Error while submitting answers:', error);
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Extract CSRF token
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}