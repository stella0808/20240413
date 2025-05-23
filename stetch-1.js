let radio;
let submitButton;
let resultText = "";
let resultColor = "#000000"; // 預設文字顏色為黑色
let questions;
let currentQuestionIndex = 0;
let correctCount = 0;
let incorrectCount = 0;
let isAnswered = false;

function preload() {
  // 使用 p5.Table 讀取 CSV 檔案
  questions = loadTable("questions.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#bbd0ff");

  // 建立選擇題
  radio = createRadio(); // 建立選項按鈕
  radio.style('width', '200px');  // 設定選項按鈕的寬度
  radio.style('font-size', '30px'); // 設定選項按鈕的字體大小

  // 建立送出按鈕
  submitButton = createButton('送出');
  submitButton.position(width / 2 - 50, height / 2 + 40);
  submitButton.style('font-size', '30px');
  submitButton.mousePressed(checkAnswer);

  displayQuestion();
}

function draw() {
  background("#bbd0ff");
  textAlign(CENTER);
  textSize(30);
  fill("#000000"); // 題目顏色保持黑色
  if (currentQuestionIndex < questions.getRowCount()) {
    text(questions.getString(currentQuestionIndex, 'question'), width / 2, height / 2 - 100);
  }
  fill(resultColor); // 設定答對或答錯文字的顏色
  text(resultText, width / 2 + 120, height / 2 + 150); // 向右移動顯示結果的文字
}

function displayQuestion() {
  radio.html(''); // 清空之前的選項
  const options = questions.columns.filter(col => col.startsWith('option')); // 動態取得所有選項欄位
  options.forEach((option) => {
    const optionText = questions.getString(currentQuestionIndex, option);
    if (optionText) {
      radio.option(optionText, optionText); // 顯示文字和選項值都設為選項文字
    }
  });
  radio.style('display', 'flex'); // 設定選項按鈕為彈性盒模型
  radio.style('flex-direction', 'row'); // 設定選項按鈕為橫排排列
  radio.style('justify-content', 'center'); // 讓選項按鈕居中排列
  radio.style('gap', '20px'); // 增加選項按鈕之間的間距
  radio.position(width / 2 - 200, height / 2 - 50); // 調整選項按鈕的位置
  submitButton.position(width / 2 + 70, height / 2 - 20); // 調整送出按鈕的位置
  submitButton.html('送出'); // 重置按鈕文字
  radio.selected(null); // 重置選項按鈕的選擇
  isAnswered = false; // 重置回答狀態
}

function checkAnswer() {
  const answer = radio.value();
  console.log("選擇的答案是: " + answer); // 除錯訊息
  if (answer === questions.getString(currentQuestionIndex, 'answer')) {
    resultText = "答對了！";
    resultColor = "#00FF00"; // 綠色
    correctCount++;
  } else {
    resultText = "答錯了！";
    resultColor = "#FF0000"; // 紅色
    incorrectCount++;
  }
  isAnswered = true; // 標記為已回答

  // 顯示下一題
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.getRowCount()) {
    displayQuestion();
  } else {
    displayResult();
  }
}

function displayResult() {
  resultText = `結束答題！答對題數: ${correctCount}, 答錯題數: ${incorrectCount}`;
  resultColor = "#000000"; // 黑色
  submitButton.hide(); // 隱藏送出按鈕
  radio.hide(); // 隱藏選項按鈕
}