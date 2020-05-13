 function Game(app) {
    let  goodAnswers = 0;
    let isGameOver =false;
    let questionToTheCrowdUsed = false;
    let callTheFriendUsed = false;
    let halfOnHalfUsed = false;

    const unHelpResponse = ["Nie dzwoń do mnie więcej.", "Odczep się.", "Nie pomogę Ci więcej"];
    const dataQuestions = [
        {
            question: 'Jaka funkcja wypisuje nową linię w konsoli w języku Java',
            answers: ['System.out.println', 'console.log', 'Console.writeln', 'Console.println'],
            correctAnswer: 0,
        },
        {
            question: 'który z poniższych typów pozwala przechowywać liczby zmiennoprzecinkowe',
            answers: ['boolean', 'char', 'integer', 'double'],
            correctAnswer: 3,
        }, {
            question: '.NET Core jest oparty o język: ',
            answers: ['Java', 'JavaScript', 'Go', 'C#'],
            correctAnswer: 3,
        }, {
            question: 'Która firma stworzyła React.js',
            answers: ['Amazon', 'Microsoft', 'Facebook', 'Netflix'],
            correctAnswer: 2,
        }
    ];

    app.get('/question', (req, res) => {
        if (goodAnswers === dataQuestions.length) {
            res.json({
                youWin: true,
            });
            return;
        } else if(isGameOver){
            res.json({
                youLose: true,
            });
            return;
        }

        const {question, answers} = dataQuestions[goodAnswers]; // if 0 -> 1st question
        res.json({
            question,
            answers
        });
        res.end();
    });

    app.post('/answer/:id', (req, res)=>{
        if(isGameOver)
            return res.json({youLose: true});
        else if(goodAnswers===dataQuestions.length)
            return res.json({youWin:true});

        const {correctAnswer} = dataQuestions[goodAnswers];
        const isCorrect = correctAnswer===Number(req.params.id)?true:false;
        console.log();
        if(isCorrect)
            goodAnswers++;
        else
            isGameOver=true;

        res.json({
            correct: isCorrect,
            goodAnswers,
        });
    });

    app.get('/prompt/askPCH', (req, res)=>{
        const unHelpfulAnswer = unHelpResponse[Math.floor(Math.random() * unHelpResponse.length)];
        const helpResponse = [
            `2000 lat temu. Istaniał pewien matematyk, Giorgio Borgio Romanowski... 
            Jak poszedł po jedzenie, bo był zamożny i jadł, to wymyślił pewną liczbę 
            - 4f*3e^2, więc odpowiedź na Twoje pytanie to: `,
            `Odpowiedź jest dość banalna proszę Państwa. Otóż sztuczna inteligencja, która w roku 2000 pomagała wygrać partię szachów w Hogwarcie opracowała pewien algorytm.
            Mianowicie... Jeśli najpierw zbijesz konia, to reszta gry przebiega w miłej atmosferze. ALE odpowiedź na to pytanie powiedział mi ostatnio fryzjer, jest to: `];
        if (callTheFriendUsed) {
            res.json({
                text : unHelpfulAnswer,
            });
            return;
        }
        const {answers, correctAnswer}= dataQuestions[goodAnswers];
        const helpfulAnswer = `${helpResponse[Math.floor(Math.random() * helpResponse.length)]} ${answers[correctAnswer]}`;
         callTheFriendUsed=true;
        res.json({
            text: helpfulAnswer,
        })
    });

    app.get('/prompt/tomaszewHelp', (req, res)=>{
        if(halfOnHalfUsed){
           res.json({
               text:unHelpResponse[Math.floor(Math.random()*unHelpResponse.length)],
           });
           return;
        }
        halfOnHalfUsed= true;
        const {answers, correctAnswer}= dataQuestions[goodAnswers];
        const wrongAnswers = answers.filter((s,index)=>index!==correctAnswer);
        const randomWrongAnswer = wrongAnswers[Math.floor(Math.random()*wrongAnswers.length)];

        res.json({
            options: [answers[correctAnswer], randomWrongAnswer],
            text: "Strzelaj drogi studencie!"
        });
    })

     app.get('/prompt/askStudents', (req,res)=>{
         if(questionToTheCrowdUsed){
             res.json({
                 text:"Koniec z tymi podpowiedziami od nas!",
             });
             return;
         }
         questionToTheCrowdUsed= true;
         const chart = [10,20,30,40];
         for(let i = chart.length-1 ; i>0 ; i--){
             const change = Math.floor(Math.random() * 20 -10);
             chart[i] += change;
             chart[i-1] -=change;
         }
         const question = dataQuestions[goodAnswers];
         const {correctAnswer} = question;

         [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]];
         res.json({
             chart,
         })
     })

}
module.exports= Game;
