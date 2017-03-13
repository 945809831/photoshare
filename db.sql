-- Photos database
-- CREATE DATABASE IF NOT EXISTS photos;
-- PhotoShare database tables
CREATE TABLE IF NOT EXISTS user(
    id INT UNSIGNED KEY,         -- 主键
    email VARCHAR(200) NOT NULL, -- 邮箱地址
    nickname VARCHAR(50),        -- 昵称
    name VARCHAR(20),            -- 真实姓名
    gender VARCHAR(1),           -- 性别: M(male) 男, F(female) 女
    password VARCHAR(200)        -- 密码
);

-- 照片表
CREATE TABLE IF NOT EXISTS photo(
    id INT UNSIGNED KEY,     -- 主键
    url VARCHAR(200),        -- 照片存贮路径
    title VARCHAR(100),      -- 照片的标题
    upload_time DATETIME,    -- 上传时间
    taken_time DATETIME,     -- 拍摄时间
    owner INT UNSIGNED,      -- 所有者
    visibility CHAR(1),      -- 可见性：F(friend朋友可见)，M(me)仅自己可见, P(public)所有人
    album_id INT UNSIGNED,
    CONSTRAINT fk_photo_album_id FOREIGN KEY (album_id) REFERENCES album (id),
    CONSTRAINT fk_photo_user_id FOREIGN KEY (owner) REFERENCES user (id)
);

-- 相册表
CREATE TABLE IF NOT EXISTS album(
    id INT UNSIGNED KEY,
    name VARCHAR(50) NOT NULL,
    create_time DATETIME,
    owner INT UNSIGNED,
    CONSTRAINT fk_album_user_id FOREIGN KEY (owner) REFERENCES user (id)
);

-- 评论表，存贮对照片评价及说明
CREATE TABLE IF NOT EXISTS comment(
    id INT UNSIGNED KEY,
    content VARCHAR(200) NOT NULL, -- 对照片评论的内容
    photo_id INT UNSIGNED,         -- 评论的照片对象
    issue_date DATETIME,           -- 发布评论的日期
    speaker_id INT UNSIGNED,       -- 评论的发布者
    CONSTRAINT fk_comment_photo_id FOREIGN KEY (photo_id) REFERENCES photo (id),
    CONSTRAINT fk_comment_user_id FOREIGN KEY (speaker_id) REFERENCES user (id)
);

-- 朋友表
CREATE TABLE IF NOT EXISTS friend(
    asker INT UNSIGNED,              -- 邀请者
    recipient INT UNSIGNED,          -- 接受者
    PRIMARY KEY(asker, recipient),
    CONSTRAINT fk_friend_asker_user_id FOREIGN KEY (asker) REFERENCES user (id),
    CONSTRAINT fk_friend_recipient_user_id FOREIGN KEY (recipient) REFERENCES user (id)
);
