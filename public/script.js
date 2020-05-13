const question = document.querySelector("p.question");
const answerButtons = document.querySelectorAll("button.answer-btn");
const correctAnswersCountField = document.querySelector("p.correctAnswers");
const winMessage = document.querySelector("h2.isWinMessage");
const promptButtons = document.querySelectorAll('button.askForHelp-btn');
const promptResult = document.querySelector("p.promptResult");
const fillQuestionElements = (data) =>{
    if(data.youWin === true) {
        answerButtons.forEach(button => button.disabled = true);
        winMessage.innerText = 'Gratulacje! Wygrałeś życie!';
        winMessage.style.display='block';
        return;
    }
    else if(data.youLose ===true){
        answerButtons.forEach(button => button.disabled = true);
        winMessage.innerText = 'Przegrałeś :O Co się dzieje? Co się dzieje?';
        return;
    }
    question.innerText = data.question;
    for (let i = 0; i < data.answers.length ; i++) {
        const answerButton = document.querySelector(`button.answer_button-${i+1}`);
        answerButton.innerText = data.answers[i];
    }
};
const clearPromptFiled = () =>{
    promptResult.innerText='';
};
const usePrompt = (promptId)=>{
    const promptName = choosePromptName(promptId);
    fetch(`/prompt/${promptName}`, {
        method:"GET",
    }).then(res=> res.json())
        .then(data => chooseCorrectTypeOfPrompt(promptId,data));
};
const choosePromptName =(promptId)=>{
    if(Number(promptId)===0)
        return 'askPCH';
    else if(Number(promptId)===1)
        return 'askStudents';
    else if(Number(promptId)===2)
        return 'tomaszewHelp';
    else
        return 0;
};
const chooseCorrectTypeOfPrompt = (promptId, data) =>{
    if(Number(promptId)===0){
        showPrompt(data);
        return;
    }
    else if(Number(promptId)===1){
        askStudentsPrompt(data);
        return;
    }
    else if(Number(promptId)===2){
        halfOnHalfPrompt(data);
        return;
    }
}
const askStudentsPrompt = (data) =>{
    if(data.text != null)
        return showPrompt(data);

    answerButtons.forEach((button,index) =>{
      button.textContent= `${button.textContent} na ${data.chart[index]} %`;
    });
}
const halfOnHalfPrompt = (data)=>{
    if(data.options == null)
        return showPrompt(data);

    const answerBtn = [...answerButtons];
    const buttonsToDelete = answerBtn.filter(button => {
        return !(button.innerText === data.options[0] || button.innerText === data.options[1]);
    });
    buttonsToDelete.forEach(button=> button.style.visibility="hidden");
    showPrompt(data);
}
promptButtons.forEach(button => {
    button.addEventListener('click', (e)=>{
        const promptId = button.getAttribute("data-prompt");
        usePrompt(promptId);
    });
});

answerButtons.forEach((button)=>{
    button.addEventListener('click', (event)=>{
        event.preventDefault();
        sendAnswer(button.getAttribute("data-answer"));
    })
});

const showPrompt = (data) =>{
    if(data.text===null)
        return;
    promptResult.textContent=data.text;
};

const updateCorrectAnswersCountFiled = (data) =>{
    correctAnswersCountField.innerText = "Poprawne odpowiedzi: "+ data.goodAnswers;
};
const visibleAllAnswers = () =>{
    answerButtons.forEach(button=>button.style.visibility="visible")
};

const showNextQuestion = () =>{
    fetch('/question', {
        method:'GET',
    }).then(res => res.json())
        .then(data => {
            fillQuestionElements(data);
            clearPromptFiled();
            visibleAllAnswers();
        })
};

const sendAnswer= (answer)=>{
    fetch(`/answer/${answer}`, {
        method:"POST",
    }).then(res => res.json())
        .then(data =>{
            handleFeedbackAfterQuestion(data);
        });
};

showNextQuestion();

const handleFeedbackAfterQuestion = (data) =>{
    updateCorrectAnswersCountFiled(data);
    showNextQuestion();
}