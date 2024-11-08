const mailHtml = (otpToken) => `
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&display=swap');
      
      body {
        font-family: 'Libre Bodoni', serif;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        line-height: 1.5;
      }
      .padding-setting {
        padding-inline: 10px;
      }
      .title {
        font-weight: 700;
        font-size: 30px;
      }
      .content {
        padding: 5px;
        margin-block: 10px;
        border: 1px solid gray;
      }
      .token-content {
        display: flex;
        justify-content: center;
        background-color: #1c262c;
        color: white;
        padding-block: 10px;
      }
      .tip {
        text-align: center;
        font-size: 20px;
        font-weight: 900;
      }
      .token {
        text-align: center;
        font-size: 30px;
        font-weight: 900;
      }
      .column {
        flex-direction: column;
        align-items: center;
      }
      .center {
        display: flex;
        justify-content: center;
      }
      .logo {
        font-style: italic;
        color: #90957A;
        font-weight: 500;
        font-size: 50px;
      }
    </style>
  </head>
  <body>
    <div class="padding-setting">
      <p class="title">親愛的 Beautique 會員您好：</p>

      <div class="content">
        通知重設密碼所需要的驗證碼，<br />
        將以下6位驗證碼輸入於：<br />
        重設密碼頁面的《電子郵件驗證碼》欄位中。<br />
        <br />
        請注意驗證碼將於寄送後 30 分鐘後過期，<br />
        如有任何問題請洽 Beautique 客服人員，謝謝。
      </div>

      <div class="token-content">
        <div class="column">
          <div class="tip">請輸入以下的6位數字：</div>
          <div class="token">${otpToken}</div>
        </div>
      </div>
      <p>Beautique 敬上</p>
      <p class="logo">Beautique</p>
    </div>
  </body>
</html>
`
