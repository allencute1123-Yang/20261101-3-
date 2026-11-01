// 拆宇的國字注音測驗系統 sketch.js (RWD 全螢幕 + 個人錄音檔版)

let currentScreen = "start"; // 畫面狀態: start, quiz, feedback, result
let currentQIndex = 0;      // 目前題號 (0~5)
let score = 0;              // 得分
let startTime;              // 記錄開始時間
let totalSeconds = 0;       // 總花費時間

// 【修改處】題目資料庫：加入你親自錄製的音檔路徑 (放在 media/ 資料夾中)
const QUESTIONS = [
  {
    type: "sound",
    soundFile: null, // 稍後在 setup 載入
    src: "media/木.m4a", // <-- 【修改處】請把你的「木」字錄音檔放在 media/ 內並更改檔名
    q: "這是哪個字的聲音？",
    options: ["木 (ㄇㄨˋ / 4畫)", "日 (ㄖˋ / 4畫)", "水 (ㄕㄨㄟˇ / 4畫)"],
    answer: "木 (ㄇㄨˋ / 4畫)",
    explain: "四聲 ㄇㄨˋ，總共有 4 劃，指的是樹木的「木」喔！"
  },
  {
    type: "sound",
    soundFile: null,
    src: "media/日.m4a", // <-- 【修改處】請把你的「日」字錄音檔放在這裡
    q: "這是哪個字的聲音？",
    options: ["木 (ㄇㄨˋ / 4畫)", "日 (ㄖˋ / 4畫)", "水 (ㄕㄨㄟˇ / 4畫)"],
    answer: "日 (ㄖˋ / 4畫)",
    explain: "四聲 ㄖˋ，總共有 4 劃，指的是天空中的太陽「日」喔！"
  },
  {
    type: "sound",
    soundFile: null,
    src: "media/水.m4a", // <-- 【修改處】請把你的「水」字錄音檔放在這裡
    q: "這是哪個字的聲音？",
    options: ["木 (ㄇㄨˋ / 4畫)", "日 (ㄖˋ / 4畫)", "水 (ㄕㄨㄟˇ / 4畫)"],
    answer: "水 (ㄕㄨㄟˇ / 4畫)",
    explain: "三聲 ㄕㄨㄟˇ，總共有 4 劃，指的是我們喝的水喔！"
  },
  {
    type: "sound",
    soundFile: null,
    src: "media/金.m4a", // <-- 【修改處】請把你的「金」字錄音檔放在這裡
    q: "這是哪個字的聲音？",
    options: ["金 (ㄐㄧㄣ / 8畫)", "火 (ㄏㄨㄛˇ / 4畫)", "土 (ㄊㄨˇ / 3畫)"],
    answer: "金 (ㄐㄧㄣ / 8畫)",
    explain: "一聲 ㄐㄧㄣ，總共有 8 劃，像是黃金的「金」喔！"
  },
  {
    type: "sound",
    soundFile: null,
    src: "media/火.m4a", // <-- 【修改處】請把你的「火」字錄音檔放在這裡
    q: "這是哪個字的聲音？",
    options: ["金 (ㄐㄧㄣ / 8畫)", "火 (ㄏㄨㄛˇ / 4畫)", "土 (ㄊㄨˇ / 3畫)"],
    answer: "火 (ㄏㄨㄛˇ / 4畫)",
    explain: "三聲 ㄏㄨㄛˇ，總共有 4 劃，會發熱發光的「火」喔！"
  },
  {
    type: "sound",
    soundFile: null,
    src: "media/土.m4a", // <-- 【修改處】請把你的「土」字錄音檔放在這裡
    q: "這是哪個字的聲音？",
    options: ["金 (ㄐㄧㄣ / 8畫)", "火 (ㄏㄨㄛˇ / 4畫)", "土 (ㄊㄨˇ / 3畫)"],
    answer: "土 (ㄊㄨˇ / 3畫)",
    explain: "三聲 ㄊㄨˇ，總共有 3 劃，植物生長用的泥土「土」喔！"
  }
];

// 【修改處】預先載入所有錄音檔（需要 p5.sound 支援）
function preload() {
  for (let i = 0; i < QUESTIONS.length; i++) {
    QUESTIONS[i].soundFile = loadSound(QUESTIONS[i].src);
  }
}

function setup() {
  // 自動建立符合當前視窗大小的全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(239, 241, 237); // 對應視覺風格主色 #eff1ed

  if (currentScreen === "start") {
    drawStartScreen();
  } else if (currentScreen === "quiz") {
    drawQuizScreen();
  } else if (currentScreen === "feedback") {
    drawFeedbackScreen();
  } else if (currentScreen === "result") {
    drawResultScreen();
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// 1. 開始畫面
function drawStartScreen() {
  fill(217, 72, 15);
  textSize(Math.min(width * 0.05, 42));
  text("國字注音聽寫天才", width / 2, height / 3 - 30);

  fill(50);
  textSize(Math.min(width * 0.025, 20));
  text("嗨！拆宇，準備好挑戰國字注音與筆劃了嗎？", width / 2, height / 3 + 30);

  // 開始按鈕
  fill(153, 184, 123); // #99B87B
  noStroke();
  rectMode(CENTER);
  let btnW = Math.min(width * 0.3, 240);
  let btnH = 60;
  rect(width / 2, height / 2 + 50, btnW, btnH, 30);

  fill(255);
  textSize(24);
  text("開始玩", width / 2, height / 2 + 50);
}

// 2. 作答畫面
function drawQuizScreen() {
  // 顯示題號
  fill(100);
  textSize(20);
  text(`第 ${currentQIndex + 1} 題 / 共 ${QUESTIONS.length} 題`, width / 2, height * 0.12);

  // 題目
  fill(30);
  textSize(Math.min(width * 0.04, 32));
  text(QUESTIONS[currentQIndex].q, width / 2, height * 0.22);

  // 【修改處】可點擊的「播放聲音」互動按鈕區塊
  fill(255, 240, 220);
  stroke(217, 72, 15);
  let boxW = Math.min(width * 0.6, 400);
  rect(width / 2, height * 0.32, boxW, 55, 10);
  
  fill(217, 72, 15);
  noStroke();
  textSize(18);
  text("🔊 點擊此處播放你的錄音檔", width / 2, height * 0.32);

  // 選項按鈕（包含國字、注音與筆劃）
  let qData = QUESTIONS[currentQIndex];
  for (let i = 0; i < qData.options.length; i++) {
    let btnY = height * 0.45 + i * 85;
    
    // 滑鼠懸停效果
    if (mouseX > width / 2 - boxW / 2 && mouseX < width / 2 + boxW / 2 && mouseY > btnY - 30 && mouseY < btnY + 30) {
      fill(220, 235, 200);
    } else {
      fill(255);
    }
    
    stroke(153, 184, 123);
    strokeWeight(2);
    rect(width / 2, btnY, boxW, 60, 15);

    fill(30);
    noStroke();
    textSize(20);
    text(`${i + 1}. ${qData.options[i]}`, width / 2, btnY);
  }
}

// 3. 回饋畫面
function drawFeedbackScreen() {
  textSize(Math.min(width * 0.045, 36));
  let qData = QUESTIONS[currentQIndex];
  let isCorrect = (qData.selected === qData.answer);

  if (isCorrect) {
    fill(43, 138, 87); // 綠色
    text("棒極了！答對了！🎉", width / 2, height * 0.2);
  } else {
    fill(217, 72, 15); // 紅橘色
    text("答錯囉！再接再厲💪", width / 2, height * 0.2);
  }

  fill(50);
  textSize(22);
  text(`正確答案是：${qData.answer}`, width / 2, height * 0.35);
  
  textSize(18);
  fill(80);
  text(qData.explain, width / 2, height * 0.45);

  // 下一題按鈕
  fill(153, 184, 123);
  noStroke();
  rect(width / 2, height * 0.65, 220, 60, 30);
  fill(255);
  textSize(22);
  text("下一題", width / 2, height * 0.65);
}

// 4. 成績畫面
function drawResultScreen() {
  fill(217, 72, 15);
  textSize(Math.min(width * 0.045, 36));
  text(`太棒了，拆宇！你的成績：`, width / 2, height * 0.2);

  // 分數圓圈
  fill(255);
  stroke(217, 72, 15);
  strokeWeight(4);
  ellipse(width / 2, height * 0.38, 130, 130);

  noStroke();
  fill(217, 72, 15);
  textSize(42);
  let finalScore = Math.round((score / QUESTIONS.length) * 100);
  text(`${finalScore}分`, width / 2, height * 0.38);

  fill(100);
  textSize(18);
  text(`總計花費時間：${totalSeconds} 秒`, width / 2, height * 0.52);

  // 按鈕區塊
  let btnY = height * 0.65;
  
  // 再玩一次按鈕
  fill(217, 72, 15);
  rect(width / 2 - 130, btnY, 200, 50, 25);
  fill(255);
  textSize(18);
  text("再玩一次", width / 2 - 130, btnY);

  // 學習紀錄按鈕
  fill(153, 184, 123);
  rect(width / 2 + 130, btnY, 200, 50, 25);
  fill(255);
  textSize(18);
  text("學習紀錄", width / 2 + 130, btnY);
}

// 滑鼠點擊互動控制
function mousePressed() {
  let boxW = Math.min(width * 0.6, 400);

  if (currentScreen === "start") {
    // 點擊「開始玩」按鈕
    let btnW = Math.min(width * 0.3, 240);
    if (mouseX > width / 2 - btnW / 2 && mouseX < width / 2 + btnW / 2 && mouseY > height / 2 + 20 && mouseY < height / 2 + 80) {
      currentScreen = "quiz";
      currentQIndex = 0;
      score = 0;
      startTime = millis(); // 開始計時
      
      // 【修改處】進入第一題時自動播放第一聲錄音
      if (QUESTIONS[currentQIndex].soundFile) {
        QUESTIONS[currentQIndex].soundFile.play();
      }
    }
  } else if (currentScreen === "quiz") {
    // 【修改處】點擊上方「播放聲音提示框」可以重新播放當前題目錄音
    if (mouseX > width / 2 - boxW / 2 && mouseX < width / 2 + boxW / 2 && mouseY > height * 0.32 - 27 && mouseY < height * 0.32 + 27) {
      if (QUESTIONS[currentQIndex].soundFile) {
        QUESTIONS[currentQIndex].soundFile.play();
      }
    }

    let qData = QUESTIONS[currentQIndex];
    // 檢查點擊選項
    for (let i = 0; i < qData.options.length; i++) {
      let btnY = height * 0.45 + i * 85;
      if (mouseX > width / 2 - boxW / 2 && mouseX < width / 2 + boxW / 2 && mouseY > btnY - 30 && mouseY < btnY + 30) {
        qData.selected = qData.options[i];
        if (qData.selected === qData.answer) {
          score++;
        }
        currentScreen = "feedback";
      }
    }
  } else if (currentScreen === "feedback") {
    // 點擊「下一題」按鈕
    if (mouseX > width / 2 - 110 && mouseX < width / 2 + 110 && mouseY > height * 0.65 - 30 && mouseY < height * 0.65 + 30) {
      currentQIndex++;
      if (currentQIndex < QUESTIONS.length) {
        currentScreen = "quiz";
        // 【修改處】換到下一題時自動播放對應的錄音檔
        if (QUESTIONS[currentQIndex].soundFile) {
          QUESTIONS[currentQIndex].soundFile.play();
        }
      } else {
        // 計算總花費時間
        totalSeconds = Math.floor((millis() - startTime) / 1000);
        currentScreen = "result";
      }
    }
  } else if (currentScreen === "result") {
    let btnY = height * 0.65;
    // 點擊「再玩一次」按鈕
    if (mouseX > width / 2 - 130 - 100 && mouseX < width / 2 - 130 + 100 && mouseY > btnY - 25 && mouseY < btnY + 25) {
      currentScreen = "start";
    }
    // 點擊「學習紀錄」按鈕
    if (mouseX > width / 2 + 130 - 100 && mouseX < width / 2 + 130 + 100 && mouseY > btnY - 25 && mouseY < btnY + 25) {
      alert("拆宇太棒了！已順利完成所有國字注音與筆劃挑戰！");
    }
  }
}