🚀 Link4m Bypass

- Tác giả: © Chungdeptraivcl
- Phiên bản: 1.0.1
- Kiến trúc: Client-Server kết hợp (Tampermonkey Userscript + Node.js/Replit Mapping API)

Hệ thống tự động hóa hoàn tất các liên kết rút gọn Link4m theo cơ chế chạy ngầm (Background Task). Hệ thống tự động bóc tách mã định danh chiến dịch, tra cứu trang đích từ Server riêng, thực thi đếm ngược ngầm, sinh chữ ký số 96 hex, nhận mã và gõ mã mô phỏng người dùng thật.

📌 Mục lục

1.  Kiến trúc & Luồng hoạt động
2.  Hướng dẫn gán URL trên trang Admin
3.  Cài đặt & Cấu hình Userscript
4.  Quy trình sử dụng thực tế
5.  Phân loại 2 loại Task (Task Types)
6.  Các lỗi thường gặp & Cách xử lý

🏗 Kiến trúc & Luồng hoạt động

                                [ Trình duyệt (Userscript) ]
                                             │
                       1. Bắt gói tin POST /api/campaign/get-advertise
                                             │
                       2. Gửi campaign_id lên Server tra cứu URL
                                             │
                 ┌───────────────────────────┴───────────────────────────┐
                 ▼                                                       ▼
        [ ĐÃ CÓ TRONG SERVER ]                                  [ CHƯA CÓ TRONG SERVER ]
                 │
    - Tải HTML trang đích & lấy Key                         - Thu gom toàn bộ ảnh Base64 + CDN
    - Chạy ngầm Chặng 1 (đếm ngược 63s)                     - Gửi POST /task/new lên Server
    - Sinh Signature 96 hex qua client.js                   - Hiện bảng thông báo In-HTML (600s)
    - Nhận quest_id thành công                              - Tự động bắn POST /links/report báo lỗi
    - Chạy ngầm Chặng 2 (đếm ngược 20s)                                    │
    - Nhận mã mật khẩu thật                                                ▼
    - Gõ phím như người thật vào ô input                    [ Bạn vào [Server api] để gán URL ]
    - Chờ bạn giải reCAPTCHA (1 click)
    - Tự động gửi xác minh
    - HIỆN LINK GỐC + NÚT COPY & MỞ TAB MỚI

✍️ Hướng dẫn gán URL trên trang server api: https://userscript-mapping-server--tijawi6194.replit.app/

Khi Userscript gặp một nhiệm vụ Link4m chưa từng lưu, nó sẽ gửi toàn bộ ảnh hướng dẫn về server và hiển thị bảng chờ 600s. Bạn thực hiện gán link như sau:

1.  Mở trang quản trị: [Ở Đây](https://userscript-mapping-server--tijawi6194.replit.app/)
2.  Tìm đến các nhiệm vụ có chữ "Pending":
      - Bạn sẽ thấy bức ảnh chụp từ khóa Google và ảnh chụp website đích (kèm logo/giao diện).
3.  Xác định thông tin:
      - Nhìn vào ảnh để tìm tên miền hoặc đường dẫn bài viết (Ví dụ:
        https://foryou.us.com/ hoặc https://sevenam.vn/gg-meet/).
      - Khuyến nghị: Nên copy đầy đủ URL của bài viết cụ thể chứa nút lấy mã thay vì chỉ điền trang chủ.
4.  Chọn Loại Task (Task Type):
      - what_on: là loại task yêu cầu lăn/di chuyển/kéo trang liên tục (s1.what-on.com).
      - website_analytics: là loại task không yêu cầu lăn/di chuyển/kéo trang liên tục (website-analytics.net).
      - Nếu bạn chưa biết chon Loại Task (Task Type) nào hãy để mặc định là website_analytics vì đa số các mã đều thuộc loại này
5.  Nhấn nút "Save mapping".
      - Nhiệm vụ sẽ chuyển sang trạng thái đã hoàn thành. Kể từ lúc này, mọi lượt truy cập vào campaign_id đó sẽ tự động chạy ngầm 100%.

🧩 Cài đặt & Cấu hình Userscript

1.  Cài đặt tiện ích mở rộng Tampermonkey trên trình duyệt Chrome/Brave/Edge.
2.  Tạo một Script mới trong Tampermonkey.
3.  Dán mã nguồn Userscript (phiên bản v1.0.1).
4.  Nhấn Ctrl + S để lưu script.

🎯 Quy trình sử dụng thực tế

1.  Mở link rút gọn Link4m:
      - Toàn bộ trang web được tự động dọn dẹp: ẩn sạch quảng cáo, video, hướng dẫn, chỉ còn giao diện Dark Theme tối giản.
2.  Trường hợp Nhiệm vụ mới (Chưa có link):
      - Xuất hiện hộp thoại tím:
        "Phát hiện nhiệm vụ mới admin chưa setup url, sẽ tự động báo lỗi đổi nhiệm vụ và vui lòng đợi 600s để được đổi"
      - Script tự gửi lệnh báo lỗi đến máy chủ Link4m và đếm ngược 600 giây. Bạn có thể vào /admin gán URL hoặc bấm đổi task.
3.  Trường hợp Nhiệm vụ đã có URL:
      - Hộp trạng thái màu xanh hiển thị: Chặng 1: Đang đếm ngược lấy mã (63s)... kèm thanh tiến trình.
      - Chặng 1 kết thúc \to tự lấy quest_id \to chuyển sang Chặng 2: Đang lấy mã mật khẩu (20s)....
      - Nhận mã thành công \to Script tự động gõ mật mã vào ô theo phong cách gõ phím của người thật (từng ký tự cách nhau 120–250ms).
      - Dòng trạng thái đổi thành: 👉 Tích vào reCAPTCHA để nhận link!.
4.  Nhận link đích:
      - Bạn chỉ cần dùng chuột click giải ô reCAPTCHA (1 thao tác duy nhất).
      - Ngay khi captcha hoàn thành, script tự động gửi xác minh (không cần bấm nút gì thêm).
      - Màn hình hiện ra thẻ chúc mừng màu xanh lá cây:
          - Nút 📋 Copy Link: Bấm để sao chép link gốc vào bộ nhớ tạm.
          - Nút 🔗 Mở Link (Tab mới): Mở trực tiếp link gốc trong một tab mới.

⚙️ Phân loại 2 loại Task

| Tiêu chí               | `what_on`                                                | `website_analytics`                                                |
| :--------------------- | :------------------------------------------------------- | :----------------------------------------------------------------- |
| **Máy chủ Widget**     | `s1.what-on.com` y/c: lăn/di chuyển/kéo trang liên tục   | `website-analytics.net` không y/c: lăn/di chuyển/kéo trang liên tục|
| **Đặc điểm nhận dạng** | Mã nguồn trang đích nạp `service-v2.js` từ `what-on.com` | Mã nguồn trang đích nạp `service-v2.js` từ `website-analytics.net` |
| **Chữ ký xác thực**    | 96 ký tự Hex (`MD5 + SHA-256`)                           | 96 ký tự Hex (`MD5 + SHA-256`)                                     |
| **Tham số gửi kèm**    | Đầy đủ thông số `jscd`, `hostname`, `href`, `pathname`   | Đầy đủ thông số `jscd`, `hostname`, `href`, `pathname`             |

🛠 Các lỗi thường gặp & Cách xử lý

1. Thông báo No Campaign

  - Hiện tượng: Script dừng lại và báo: "Chiến dịch đối tác đã hết ngân sách (No
    Campaign), Vui lòng đợi có nhiệm vụ hoặc đổi ip để tiếp tục...".
  - Nguyên nhân: Nhà quảng cáo trang web đích đã dùng hết lượt xem/hết tiền
    trong ngày trên sàn widget. Lúc này người dùng thật vào bấm nút cũng không
    có mã.
  - Xử lý: Script sẽ tự kích hoạt báo lỗi. Bạn hãy F5 để Link4m đổi sang chiến
    dịch của nhà quảng cáo khác.

2. Báo lỗi Mã sai khi xác minh

  - Nguyên nhân: Gán nhầm URL trên trang Admin. Mỗi campaign_id cố định chỉ chấp
    nhận mã sinh ra từ đúng trang web của nó. Nếu gán nhầm link của web khác, mã
    lấy về sẽ bị Link4m từ chối.
  - Xử lý: Vào /admin, kiểm tra kỹ ảnh chụp của campaign_id đó và cập nhật lại
    URL chính xác.

3. Lỗi CORS khi kết nối Server Replit

  - Nguyên nhân: Dùng fetch() thông thường bị trình duyệt chặn cross-origin.
  - Xử lý: Bản Userscript v1.0.1 đã thay thế hoàn toàn bằng request()
    (GM_xmlhttpRequest) để bỏ qua 100% chính sách CORS của trình duyệt.
