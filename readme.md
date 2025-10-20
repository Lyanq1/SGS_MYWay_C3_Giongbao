SGS_Myway_C3_GiongBao/
├── README.md # Overview, instructions to run the game, and project summary  
│  
├── project_report.pdf # Full report with introduction of the game, game theme topic justification, potential impact, technology stack (including AI tools and web libraries), overview of game mechanics, and reflection  
│  
├── youtube_link.txt # Include only the YouTube URL for your game’s demo video with voice-over (maximum 7 minutes)  
│  
├── prompts/  
│ ├── concept_prompts.txt # Prompts used for brainstorming ideas  
│ ├── asset_generation_prompts.txt # Prompts used for generating visuals or assets  
│ ├── code_generation_prompts.txt # Prompts used for game logic or UI  
│ ├── refinement_prompts.txt # Prompts used for debugging, polishing, etc.  
│ └── ...  
│  
├── game_app/ # A playable, working web game app  
│ ├── index.html # Main entry point (Welcome/Menu/Play)  
│ └── ... # Other relevant game files and folders (game assets, css, javascript, etc.)  
│  
└── screenshots/ # Maximum 5 screenshots only  
 ├── menu_screen.png  
 ├── play_screen1.png  
 ├── play_screen2.png  
 ├── play_screen3.png  
 └── results_screen.png

Overview
For this challenge, students will vibe code using LLMs to design and develop a web-based game that highlights and addresses a pressing social challenge in Vietnam or Australia. The game should be fun to play, educational, and impactful - giving players a fresh perspective on important real-world issues.

Description
You are required to vibe code a game using any LLMs that you find suitable to achieve the goals. The aim is to deliver a complete web game that fits the theme:

The game should take the form of a board game, card game, dice game, or any game topic of simple web game format.
The gameplay mechanics must directly connect to the chosen social issue, making the game both educational and engaging.
Suggested themes may include (but are not limited to):
Climate change & sustainability
Access to education
Mental health & wellbeing
Social equity & inclusion
Community resilience
So on
Contestants need to decide on topics that suit their local context (either Vietnam or Australia).

Game Requirements
Your game must include at least the following screens/views:

Menu
Play
Please free to add other approriate screens as you would like.

Additional guidelines:

The game must be in 2D. (Optional: or 3D if your team is able.)
Game assets (sprites, backgrounds, sound effects, code logics, etc.) can also be generated using your choices of AI models such as ChatGPT, Gemini, Nano Banana, Sora, …, where appropriate.
The game must only use HTML, CSS and Javascript. Feel free to use any HTML, CSS and JavaScript libraries/frameworks as long as it can run fully on the browser (only on front-end) without a need to install any additional installation or setup or backend.
You can use any AI platform, extension, website or service to help you to create this game.

Idea game:
Challenge 3: GiongBao (Giông bão)

Game logic and technique: Nhân vật sẽ di chuyển theo 4 hướng bằng phím mũi tên hoặc wasd, sẽ có những vật phẩm có thể interact và khi nhặt (ấn phím f) sẽ được đặt trong kho đồ của mình

\_ MAIN SCREEN: background chia tỉ lệ 7:3 ngang, 7 phần trên là mưa rơi, lốc xoáy và vỡ đê. 3 phần dưới là phần nước dâng cao màu nâu cà phê. Phía trước sẽ có một con đội nón lá Việt Nam với khuôn mặt (pnj). Có 2 nút, 1 nút Play có nhiệm vụ dẫn mọi người vào màn chơi chính cho người mới bắt đầu -> dẫn vào SCREEN 1. Nút thứ 2 là OVERVIEW -> Ý NGHĨA

\_ Ý NGHĨA: sẽ chia tỉ lệ khung hình 6:4 dọc, bên tỉ lệ 4 sẽ là hình ảnh bão lũ được cung cấp ( link ảnh: ảnh 1, ảnh 2, ảnh 3) . Bên phần tỉ lệ 6 sẽ là nội dung:
“Sau cơn bão đi qua, chỉ còn lại những dấu vết của mất mát.
Mái nhà bị gió giật tung, đồ đạc chìm trong nước lũ, những con đường quen thuộc trở nên xa lạ trong lớp bùn đất. Nhưng giữa khung cảnh tan hoang ấy, vẫn sáng lên ánh đèn của tình người — nơi những bàn tay cùng nhau dựng lại cuộc sống, san sẻ từng nắm gạo, tấm chăn, lời động viên.
“Thương người miền bão” không chỉ là câu chuyện về mất mát, mà là hành trình của hi vọng và hồi sinh.
Qua mỗi bước đi, bạn sẽ hiểu rằng chuẩn bị tốt — không chỉ để bảo vệ bản thân, mà còn để giữ vững niềm tin cho cả một vùng quê sau bão.”

\_SCREEN 1: Screen về chuẩn bị trước khi bão - ở siêu thị. Sẽ có các kệ hàng và các đồ ăn ở trên đó.

đoạn script hội thoại của main nói về hiện trạng của bão lũ ở dưới
![alt text]('SGS_Myway_C3_Giongbao/screenshots/Screenshot 2025-10-20 at 13.10.31.png')

\_ SCREEN 2: Screen về chuẩn bị khi bão mức 1
Màn hình chia tỉ lệ 7:3, ở tỉ lệ 3 phần (cửa sổ ngoài trời có mưa, hiệu ứng nước lũ dâng lên đến ⅓ khung cửa sổ). 7 phần còn lại sẽ là khu vực hoạt động của nhân vật chibi với nón lá.
1st line nhân vật chính: “ Ôi nước đã bắt đầu dâng cao rồi, chúng ta phải tắt các thiết bị điện thôi.”
Hiện trường là khu phòng khách, gồm một máy quạt đang cắm điện, một máy công tắt cầu dao điện, hoặc các thiết bị điện tử khác cần rút điện, di chuyển các con vật nuôi và trẻ em lên cầu thang.
Yêu cầu vượt ải (Win Conditions): Hoàn thành trong vòng 30 giây sẽ có thể qua màn. Điều kiện để thực hiện thắng nhanh nhất: tắt cầu dao điện trước khi rút điện các thiết bị khác, nếu không sẽ bị giật điện và thua.
Thua cuộc (Fail Conditions) Hết thời gian và không tắt cầu dao điện, hiệu ứng nước vào nguồn điện dưới chân -> bị giật điện.
Kết thúc screen này nếu đạt yêu cầu thắng, nhân vật di chuyển lên lầu qua cầu thang bộ cùng các con vật -> hiện lên dòng chữ “HÃY NHỚ TẮT CẦU DAO ĐIỆN TỔNG TRƯỚC NHÉ” -> chuyển SCREEN 3. Nếu thua, chơi lại SCREEN 2.

\_ SCREEN 3: Screen sau khi di chuyển lên lầu
Màn hình chia tỉ lệ 7:3, ở tỉ lệ 3 phần (ban công tầng 2 ngoài trời có mưa, hiệu ứng nước lũ dâng lên đến ngọn cây bên ngoài cửa sổ ). 7 phần còn lại sẽ là khu vực hoạt động của nhân vật chibi với nón lá.
1st line của nhân vật: “ Nước đã dâng lên tới tầng 2 rồi, chúng ta đã sắp hết lương thực, phải cầu cứu thôi.”
Hiện trường là phòng ngủ, có giường, có tủ, có điện thoại di động để trên bàn ( có khả năng bấm vào để hiện lên màn hình bấm số điện), và một cái còi (phát ra tiếng khi nhấp vào) huýt sáo khi đoàn cứu hộ tới và đèn pin.
Đoàn cứu hộ: nhân vật mặc áo xanh lá đậm, ngồi trên phao cứu hộ có đèn đỏ tắt mở. Đoàn cứu hộ xuất hiện sau 5 giây sau khi bấm gọi đúng số.
Yêu cầu vượt ải (Win Conditions): Bấm đúng số điện thoại gọi 114, 115, 113. Bấm còi huýt sao để phát ra tín hiệu khi Đoàn cứu hộ xuất hiện trong vòng 10 giây. Đoàn cứu hộ dẫn lên thuyền di chuyển đến khu vực an toàn.
Thua cuộc (Fail Conditions) sau 30 giây nhưng không gọi đúng số, hoặc sau 30 giây sau khi đoàn cứu hộ xuất hiện 3 lần nhưng không bấm còi huýt sáo tín hiệu.
Kết thúc screen này nếu đạt yêu cầu thắng, nhân vật di chuyển lên thuyền cùng các con vật -> hiện lên dòng chữ “KHI BẠN CẦN, CÓ CHÚNG TÔI, ĐỘI CỨU HỘ CỨU NẠN VIỆT NAM” -> chuyển SCREEN 4. Nếu thua, chơi lại SCREEN 3.

_ SCREEN 4: Khung cảnh dọn nhà sau khi hết bão, phần dọn nhà
Màn hình chia tỉ lệ 7:3, ở tỉ lệ 3 phần (ánh sáng đầu tiên sau bão chiếu lên ngôi nhà ngập bùn đất. Nước đang rút dần, lá rơi và đồ đạc ngổn ngang). 7 phần còn lại sẽ là khu vực hoạt động của nhân vật chibi với nón lá.
1st line: “Thật may mắn khi bão đã hết, giờ thì chúng ta phải dọn dẹp thôi”
Người chơi giúp nhân vật thu gom và sắp xếp lại đồ đạc trong nhà, dọn rác – lau dọn – sửa chữa, đồng thời học cách xử lý an toàn sau bão.
Yêu cầu vượt ải (Win Conditions): Dọn dẹp đủ 80% lượng rác và đồ đổ vỡ trong thời gian quy định (2 phút) . Phân loại đúng rác thường – rác nguy hiểm (như dây điện, hóa chất). Hoàn thành nhiệm vụ trong thời gian giới hạn (ví dụ: 3 phút).
Thua cuộc (Fail Conditions): Chạm vào vật nguy hiểm khi chưa ngắt điện, mở cầu dao điện. Làm đổ thêm đồ vật hoặc không hoàn thành trong thời gian quy định. Bỏ qua các vật dụng quan trọng (như lương thực bị ướt, pin dự phòng, giấy tờ).
Kết thúc screen này nếu đạt yêu cầu thắng, nhân vật dọn dẹp hoàn tất -> hiện lên dòng chữ ‘CHÚC MỪNG BẠN ĐÃ VƯỢT QUA CƠN BÃO” -> chuyển ENDING. Nếu thua, chơi lại SCREEN 4.
_ ENDING: screen kết thúc trò chơi
Nội dung:
“Mỗi cơn bão đi qua đều để lại mất mát, nhưng dọn dẹp cũng là cách để bắt đầu lại — từng chút một.
Chúng ta không thể tránh bão, nhưng có thể mạnh mẽ hơn sau nó.”
