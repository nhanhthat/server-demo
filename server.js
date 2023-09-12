const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const fs = require('fs');

const app = express();
const port = 5555;

app.use(bodyParser.json());
app.use(cors());

let isProcessing = false; // Biến kiểm soát xem có đang xử lý yêu cầu hay không
const requestQueue = []; // Hàng đợi yêu cầu

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Có lỗi xảy ra trong quá trình xử lý' });
});

// Hàm xử lý yêu cầu
const processRequest = (req, res) => {
  const { content } = req.body;
  
  // Gọi đoạn code Python và truyền content nhận được từ client
  const pythonProcess = spawn('python', ['selenium_module.py', content]);
  

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Đầu ra từ Python: ${data}`);
    const output = data.toString();
  
    // Kiểm tra xem lệnh click thành công hay không
    if (output.includes('Button clicked successfully.')) {
      res.json({ success: true, message: output });
    } else {
      res.status(500).json({ success: false, error: 'Không thể click vào nút' });
    }
    processNextRequest(); // Xử lý yêu cầu tiếp theo
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`Lỗi từ Python: ${data}`);
    res.status(500).json({ success: false, error: data.toString() });
    processNextRequest(); // Xử lý yêu cầu tiếp theo
  });


};


// Hàm xử lý yêu cầu tiếp theo
const processNextRequest = () => {
  isProcessing = false; // Đánh dấu không có yêu cầu đang được xử lý

  if (requestQueue.length > 0) {
    const nextRequest = requestQueue.shift();
    isProcessing = true; // Đánh dấu có yêu cầu đang được xử lý
    processRequest(nextRequest.req, nextRequest.res);
  }
};

app.post('https://www.shopeelive247.online/api/live_x', (req, res) => {
  if (isProcessing) {
    // Nếu có yêu cầu đang được xử lý, thêm yêu cầu mới vào hàng đợi
    requestQueue.push({ req, res });
  } else {
    // Nếu không có yêu cầu đang được xử lý, xử lý yêu cầu mới
    isProcessing = true; // Đánh dấu có yêu cầu đang được xử lý
    processRequest(req, res);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});