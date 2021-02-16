# React Slack

![image](https://user-images.githubusercontent.com/44011462/107928529-c9320c80-6fbb-11eb-8dc6-efeb15ad0475.png)

React Slack [(here)](http://slack.shinywaterjeong.com) is realtime chatting application throught public room, direct room.

## 🗒️ Summary
React slack ls a clone project of slack, which provides user realtime communication sending text, file, image. User can make a conversation with others on public or private room in real time.

Frontend consist of Reactjs, Nextjs, Ant design. Reactjs is typical framework for Single Page Application(SPA), which has a merit of that fast loading ever since the first loading is done. But SPA has demerits of that the first loading is slow and Search Engine Optimization is limited.
For these Pros and Cons, Nextjs using Reactjs is a hybrid solution for SSR.

![slack-summary-ssr](https://user-images.githubusercontent.com/44011462/107926512-27112500-6fb9-11eb-8b9a-b18ee00cf81b.png)

Backend consist of Nodejs, Express, Mongodb. Mysql was an option for Database, but Mongodb is database for this application, because I wanna make use of flexibillity of mongodb data format. mongodb is NoSQL which means mongodb can contains not only of primitive data type, but also object, array. Since some of data is depends on situation, such as starred, typing. Mysql also do just fine job, but I made use of mongodb for my personal various experience.

![image](https://user-images.githubusercontent.com/44011462/107928663-f5e62400-6fbb-11eb-869a-ae20367f7ce2.png)


## ⏱️ Socket.io

Difference from Socket communications and client-server communications is the who send data to whom. In typical client-server communications, client request data and server response proper answer. In other way, server does not ask for client. Once client requests something for server, server response with data that client wanted. But in socket communications, socket can send & read both, and socket can be both of client, server. Both client and server can contain socket, which means both of them can request and response. 

![socketio](https://user-images.githubusercontent.com/44011462/107924148-d946ed80-6fb5-11eb-86a4-ae64524c0e4e.png)


## ⭐ Features

- User
  - Register, Login, Logout
  - Image edit
    - aws-s3
  - Login Status in Real Time

- Chat 
  - Realtime Send & Receive
  - Notification of Typing in Real Time
  - Image

- Room
  - Public Room
  - Direct Room
  - Notification of Creation in Real Time 
  
## 🔧 Tech Stack
- React
- Nextjs
- Nodejs
- Express
- Mongodb
- Socket.io
- Ant Design

## 📶 Apis

[Apis Document](https://slack.api.shinywaterjeong.com/api-docs/)

⚠️ This Apis document does not contain some of apis which from socket.io methods: submitMessage, createRoom, createDirect, submitPresence, submitAbsence, submitTypingStart, submitTypingFinish.

## 🗃️ Database

![slack-database](https://user-images.githubusercontent.com/44011462/107945540-24232e00-6fd3-11eb-96e3-7ded55784585.png)

## 🚧 Futurework

- Grouping of chat just like slack does: upper hierarchical group can contain current form of chatting.

![groupchat](https://user-images.githubusercontent.com/44011462/108012653-3e015700-704d-11eb-9664-bb5e8e6dc9fc.png)
