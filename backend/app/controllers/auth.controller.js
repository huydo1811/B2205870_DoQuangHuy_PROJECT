const MongoDB = require("../utils/mongodb.util");
const DocGiaService = require("../services/docgia.service");
const NhanVienService = require("../services/nhanvien.service");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT;
const { OAuth2Client } = require('google-auth-library');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, 'postmessage');

exports.login = async (req, res, next) => {
    try {
        const { Username, MatKhau } = req.body;
        let user = null;
        let role = "";

        // Tìm trong Độc Giả
        const docGiaService = new DocGiaService(MongoDB.client);
        user = await docGiaService.collection.findOne({ Username });
        if (user) {
            role = "user";
        } else {
            // Tìm trong Nhân Viên
            const nhanVienService = new NhanVienService(MongoDB.client);
            user = await nhanVienService.collection.findOne({ Username });
            if (user) {
                role = "admin";
            }
        }

        if (!user) {
            return res.status(400).json({ message: "Tài khoản không tồn tại!" });
        }

        // So sánh mật khẩu
        const validPassword = await bcrypt.compare(MatKhau, user.MatKhau);
        if (!validPassword) {
            return res.status(400).json({ message: "Mật khẩu không đúng!" });
        }

        // Tạo JWT
        const token = jwt.sign(
            {
                id: user._id,
                Username: user.Username,
                MaDocGia: user.MaDocGia,
                Role: role
            },
            SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Đăng nhập thành công!",
            token,
            Role: role,
            info: user
        });
    } catch (error) {
        next(error);
    }
};

exports.googleLogin = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: "Thiếu code từ Google!" });

    // Đổi code lấy token
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    const docGiaService = new DocGiaService(MongoDB.client);
    let user = await docGiaService.collection.findOne({ Username: email });

    if (!user) {
      const [Ho, ...TenArr] = name.split(' ');
      const Ten = TenArr.join(' ');
      const MaDocGia =  "DG" + Math.random().toString().slice(2, 12);

      await docGiaService.create({
        Ho: Ho || "",
        Ten: Ten || "",
        GioiTinh: "",
        DienThoai: "",
        DiaChi: "",
        Username: email,
        Role: "user",
        MaDocGia,
        OAuthProvider: "google"
      });
    }
    user = await docGiaService.collection.findOne({ Username: email });

    const token = jwt.sign({
      id: user._id,
      Username: user.Username,
      MaDocGia: user.MaDocGia,
      Role: "user"
    }, SECRET_KEY, { expiresIn: "7d" });

    res.json({
      message: "Đăng nhập Google thành công!",
      token,
      info: {
        MaDocGia: user.MaDocGia,
        DienThoai: user.DienThoai,
        DiaChi: user.DiaChi,
        GioiTinh: user.GioiTinh
      }
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ message: "Lỗi khi xác thực Google!" });
  }
};