let startingMinutes = 0;
let startingSeconds = 0;
let time = startingMinutes * 60 + startingSeconds;
const countdownEl = document.getElementById('timer');
const signalAudio = document.getElementById('signalAudio');
const infoAudio = document.getElementById('infoAudio');
var questionsAudios = document.getElementsByName('questionAudio');
const practicePanel = document.getElementById('practice-panel');
const resultPanel = document.getElementById('result-panel');
const infoText = document.getElementById('infoText');
var questions = document.getElementsByName('question');
var answers = document.getElementsByName('answer');
let repetitions = 0;
const totalRepetitions = 5;
let isPreparation = true;
const timer = 0;

let mediaRecorder;
let audioChunks = [];

function setTimer(minutes, seconds){
    startingMinutes = minutes;
    startingSeconds = seconds;
    time = startingMinutes * 60 + startingSeconds;
}

function playSignal(){
    signalAudio.play();
}

function playQuestion(id){
    questionAudio = questionsAudios[id];
    questionAudio.play();

    questionAudio.onended = function() {
        isPreparation = true;
        setTimer(0, 10);

        if(id === 0) {
            timer = setInterval(updateCountdown, 1000)
        }
    }
}

function playInfo(){
    infoAudio.play();

    infoAudio.onended = function() {
        hideInfo();
        showQuestion(0);
        playQuestion(0);
    };
}

function showQuestion(id){
    questions[id].style.display = 'block';
}

function hideQuestion(id){
    questions[id].style.display = 'none';
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

    if (time == 0){
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
                setTimer(0, 30);
                isPreparation = false;
            }
            else{
                stopRecording();
                hideQuestion(repetitions-1);
                showQuestion(repetitions);
                playQuestion(repetitions);
            }
    }
    else{
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
        audioChunks = [];
    };

    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
}