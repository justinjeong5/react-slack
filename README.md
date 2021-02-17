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

These are webSocket methods that used for React Slack Application here below. These have a one thing in common that these method both send signal and save data on database: mongodb. For say, a client-side method trigger the handler method on server, then it handles what server have to do: saving on mongodb.
- `submitMessage`: it sends message. Once the signal is emitted, `submitMessage handler` will be triggered on nodejs server, which handles messages and emits `returnMessage`. `returnMessage` will trigger client's side websocket so that user will be notified almost instantly.
- `createRoom`: it triggers `createRoom handler` on server, so that chatting room information will be stored on mongodb, and emits `returnCreateRoom` for client. 
- `createDirect`: it triggers `createDirect handler` just like `createRoom signal`.
- `submitPresence` & `submitAbsence`: it emits signal whenever user login success or logout success. Once signal is emitted and server catches the `submitPresence` or `submitAbsence` signal, user's information will be stored on mongodb, so that new user who just got login can notice others' presence status from database.
- `submitTypingStart` & `submitTypingFinish`: it almost same as what `submitPresence` & `submitAbsence` does for store current status. `submitTypingStart` will be triggered whenever user just types the first letter of chatting and `submitTypingFinish` will be triggered whenever the first letter of chatting is removed on chatting board.


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

## 🛠️ Issue

### WebSocket
![image](https://user-images.githubusercontent.com/44011462/108018398-f84b8b00-705a-11eb-9ba8-e7a5ee03f98c.png)

Web socket worked just fine in development environment, but once after deployed on aws-ec2 & nginx error comes up like this: ***Error during WebSocket handshack***. Mainly, error comes from the structure of reverse proxy: nginx. 

### Cookies

For the login strategy, I made use of **json web token**, **cookie** and database. 
```javascript
// redux axios setting
axios.defaults.withCredentials = true;

// express cors setting
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }))

// routes/user.js
res.cookie('slack_auth', token).status(200).json({ user: fullUser })
```

This code leads to response with cookie named 'slack_auth' on network tab on chrome browser just like below.
![image](https://user-images.githubusercontent.com/44011462/108150679-6ace7080-7118-11eb-96ed-754f40edbeed.png)

Once user tyied login and succeded the procedure, there should be cookie which contains 'slack_auth' but there no 'slack_auth' exist.
![image](https://user-images.githubusercontent.com/44011462/108150939-f8aa5b80-7118-11eb-8830-f60d7d31fbfe.png)


## 🏫 Research

### https

<details>

#### nginx 

![nginx](https://user-images.githubusercontent.com/44011462/106407535-a3671c80-647f-11eb-97c7-72cc5fb66743.png)

##### ssl certification
```bash
$ sudo apt-get install nginx
$ sudo su
$ vim /etc/nginx/nginx.conf
# {
#   ...
#   server {
#     server_name slack.api.shinywaterjeong.com
#     listen 80;
#     location / {
#       proxy_set_header HOST $host;
#       proxy_pass http://localhost:3065;
#       proxy_redirect off;
#       # setting for websocket
#       proxy_http_version 1.1;
#       proxy_set_header Upgrade $http_upgrade;
#       proxy_set_header Connection "upgrade";
#     }
#   }
#   ...
# }
$ exit
$ sudo lsof -i tcp:80
  # port 80 should be idle
$ sudo apt install snapd
$ sudo snap install core; sudo snap refresh core
$ sudo snap install --classic certbot
$ sudo certbot --nginx
$ sudo certbot renew --dry-run
  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  # Congratulations, all simulated renewals succeeded: 
  #   /etc/letsencrypt/live/yourDomainName/chine.pem (success)
  # - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
```

##### success ssl setting
```bash
# /etc/nginx/nginx.conf
{
  ...
  server {
    server_name slack.api.shinywaterjeong.com
    listen 80;
    location / {
      proxy_set_header HOST $host;
      proxy_pass http://localhost:3065;
      proxy_redirect off;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/slack.api.shinywaterjeong.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/slack.api.shinywaterjeong.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
  }
  server {
    if ($host = slack.api.shinywaterjeong.com) {
      return 301 https://$host$request_uri;
    } # managed by Certbot

    server_name slack.api.shinywaterjeong.com
    listen 80;
    return 404; # managed by Certbot
  }
}
```

</details>