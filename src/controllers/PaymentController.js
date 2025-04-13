require('dotenv').config();
const moment = require('moment');
const crypto = require('crypto');
const config = require('config');
const querystring = require('qs');

const createPayment = (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;



    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;

    // Lấy thông tin từ body request
    let order_id = req.body.order_id;  // Sử dụng order_id truyền vào từ frontend
    let amount = req.body.amount;      // Sử dụng amount truyền vào từ frontend

    // Kiểm tra ngôn ngữ, mặc định là 'vn'
    let locale = req.body.language || 'vn';
    let currCode = 'VND';

    // Khởi tạo các tham số VNPAY
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = order_id;  // Đặt mã đơn hàng từ frontend
    vnp_Params['vnp_OrderInfo'] = 'Thanh toán cho mã GD: ' + order_id;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;  // VNPAY yêu cầu số tiền nhân với 100
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    // Nếu có mã ngân hàng, thêm vào params


    // Sắp xếp lại các tham số theo tên
    vnp_Params = sortObject(vnp_Params);

    // Chuỗi để tính chữ ký
    let signData = querystring.stringify(vnp_Params, { encode: false });

    // Tính chữ ký HMAC SHA512
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

    // Thêm chữ ký vào params
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    // Redirect đến URL thanh toán VNPAY
    res.status(201).json({
        status: 201,
        message: "Tạo URL thanh toán thành công",
        data: vnpUrl,
    });

}
// Hàm để sắp xếp các tham số theo tên




const vnpayReturn = (req, res) => {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    // Sắp xếp các tham số để kiểm tra chữ ký
    vnp_Params = sortObject(vnp_Params);

    let secretKey = process.env.VNP_HASH_SECRET;
    let signData = querystring.stringify(vnp_Params, { encode: false });

    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // So sánh chữ ký nhận được với chữ ký tự tạo
    if (secureHash === signed) {
        // Nếu đúng chữ ký, có thể kiểm tra thêm trong DB nếu cần
        res.status(200).json(
            'success', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
        // Sai chữ ký
        res.json('success_97', { code: '97' }); // 97 là mã sai chữ ký
    }
};
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort(); // Lấy key và sắp xếp
    for (const key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = {
    createPayment, vnpayReturn
};
