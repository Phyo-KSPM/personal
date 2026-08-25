# Nginx လမ်းညွှန် — ပုံစံအားလုံး

Nginx ကို **static website**, **reverse proxy**, **load balancer**, **HTTPS (port 443)**, **self-signed certificate** စတာတွေနဲ့ ဘယ်လို သုံးလဲ ဆိုတာကို ပတ်ဝန်းကျင်အလိုက် (local, on-premise, cloud) ခွဲရေးထားတယ်။

လိုချင်တဲ့ အပိုင်းကို အောက်က **မာတိကာ** ကနေ တိုက်ရိုက် ခုန်ပါ။ အကုန် မဖတ်ဘဲ သက်ဆိုင်ရာ section ပဲ ကြည့်လို့ရတယ်။

ဒီ guide ရဲ့ command တွေက **Ubuntu / Debian** အတွက် ဖြစ်တယ်။ RHEL / Rocky ဆိုရင် `apt` ကို `dnf` နဲ့ ပြောင်းပါ။

---

## မာတိကာ

**အရင် ဘာဖတ်ရမလဲ**

1. [ဘယ် section ကို ဖတ်ရမလဲ (ရွေးချယ်ရန်)](#read-first)
2. [Nginx ဆိုတာဘာလဲ](#what-is-nginx)
3. [သုံးလို့ရတဲ့ ပုံစံများ အနှစ်ချုပ်](#usage-patterns)
4. [Port 80 နဲ့ Port 443 — ကွာခြားချက်](#ports)

**ပတ်ဝန်းကျင်အလိုက်**

5. [Local laptop / home lab](#env-local)
6. [On-premise (ကိုယ်ပိုင် server / LAN)](#env-onprem)
7. [Cloud VPS (DigitalOcean, AWS EC2, Linode, …)](#env-cloud)
8. [Cloud load balancer ရဲ့ နောက်က Nginx](#env-cloud-lb)
9. [Docker / Docker Compose](#env-docker)
10. [Cloudflare DNS / proxy နောက်က Nginx](#env-cloudflare)

**အခြေခံ setup**

11. [Nginx install နဲ့ folder တည်ဆောက်ပုံ](#install)
12. [Config ဖိုင် ဘယ်နေရာမှာလဲ / test / reload](#config-layout)

**Port 80 (HTTP)**

13. [Port 80 ဆိုတာဘာလဲ](#port-80)
14. [Port 80 မှာ static site ဖွင့်ခြင်း](#port-80-static)
15. [Port 80 မှာ reverse proxy](#port-80-proxy)
16. [Port 80 → 443 redirect](#port-80-redirect)

**Static web server**

17. [Nginx ကို static web server အနေနဲ့ သုံးခြင်း](#static)
18. [HTML / CSS / JS folder တင်ခြင်း](#static-html)
19. [Directory listing, index, 404 page](#static-index)
20. [Static file cache နဲ့ gzip](#static-cache)

**Reverse proxy**

21. [Reverse proxy ဆိုတာဘာလဲ](#proxy)
22. [တစ်ခုတည်းသော app ကို proxy (Next.js / Node)](#proxy-single)
23. [Path အလိုက် app များစွာ ခွဲခြင်း (`/api`, `/app`)](#proxy-paths)
24. [Domain အလိုက် app များစွာ ခွဲခြင်း (virtual host)](#proxy-vhost)
25. [WebSocket နဲ့ long request](#proxy-websocket)
26. [Upload size နဲ့ timeout](#proxy-upload)

**Load balancer**

27. [Nginx ကို load balancer အနေနဲ့ သုံးခြင်း](#lb)
28. [Round robin](#lb-round-robin)
29. [Least connections](#lb-least-conn)
30. [IP hash (sticky-ish)](#lb-ip-hash)
31. [Weight နဲ့ backup server](#lb-weight)
32. [Health check (`max_fails`)](#lb-health)
33. [TCP / UDP stream load balancer](#lb-stream)

**HTTPS / Port 443 / Certificate**

34. [Port 443 ဆိုတာဘာလဲ](#port-443)
35. [HTTPS config အခြေခံ](#https-basic)
36. [Self-signed certificate ထုတ်ခြင်း (openssl)](#self-signed)
37. [Local အတွက် mkcert (browser ယုံကြည်အောင်)](#mkcert)
38. [On-premise internal CA](#internal-ca)
39. [Let's Encrypt (Certbot) — public domain](#letsencrypt)
40. [HTTP/2 နဲ့ TLS hardening](#tls-hardening)

**ပေါင်းစပ် ဥပမာ**

41. [Ko Phyo — production reverse proxy + HTTPS](#kophyo)
42. [On-premise static + self-signed](#recipe-onprem-static)
43. [Cloud — 3 app instance load balance](#recipe-cloud-lb)

**အထွေထွေ**

44. [Firewall (UFW) — 80 / 443 / မဖွင့်ရမယ့် port](#firewall)
45. [နေ့စဉ် command များ](#daily-commands)
46. [Troubleshooting](#troubleshooting)

---

<a id="read-first"></a>

## 1. ဘယ် section ကို ဖတ်ရမလဲ

| ကိုယ့်အခြေအနေ | ဖတ်ရမယ့် section |
| --- | --- |
| Nginx ဆိုတာ ဘာလဲပဲ သိချင်တယ် | [§2](#what-is-nginx) → [§3](#usage-patterns) → [§4](#ports) |
| Laptop မှာ localhost နဲ့ စမ်းချင်တယ် | [§5 Local](#env-local) → [§17 Static](#static) သို့ [§21 Proxy](#proxy) |
| ရုံး / ကိုယ်ပိုင် server (domain မရှိသေး) | [§6 On-premise](#env-onprem) → [§36 Self-signed](#self-signed) |
| VPS + domain ရှိပြီး | [§7 Cloud](#env-cloud) → [§22 Proxy](#proxy-single) → [§39 Certbot](#letsencrypt) |
| HTML folder ပဲ တင်ချင်တယ် | [§17 Static web server](#static) |
| Next.js / Node ကို နောက်က ဝှက်ချင်တယ် | [§21 Reverse proxy](#proxy) |
| App server ၂–၃ လုံး ခွဲချင်တယ် | [§27 Load balancer](#lb) |
| `http://` ပဲ သုံးမယ် | [§13 Port 80](#port-80) |
| `https://` လိုတယ် | [§34 Port 443](#port-443) |
| Browser က “Not secure” ကို လက်ခံပြီး စမ်းမယ် | [§36 Self-signed](#self-signed) |
| Public internet + အခမဲ့ SSL | [§39 Let's Encrypt](#letsencrypt) |
| Ko Phyo ကို production တင်မယ် | [§41](#kophyo) |

---

<a id="what-is-nginx"></a>

## 2. Nginx ဆိုတာဘာလဲ

Nginx (engine-x လို့ ဖတ်တယ်) က **web server** တစ်ခု ဖြစ်တယ်။ Browser / client က လာတဲ့ HTTP(S) request ကို လက်ခံပြီး

- disk ပေါ်က ဖိုင်ပေးနိုင်တယ် (static)
- နောက်က app ဆီ လွှဲပေးနိုင်တယ် (reverse proxy)
- app များစွာထဲက တစ်ခုကို ရွေးပေးနိုင်တယ် (load balancer)

အားသာချက်

- memory နည်းနည်းနဲ့ connection များများ ကိုင်နိုင်တယ်
- config က ဖိုင်တစ်ခု (သို့ site ဖိုင်များ) နဲ့ ရှင်းတယ်
- TLS (HTTPS) ကို သူ့မှာပဲ ကိုင်လို့ရတယ်

---

<a id="usage-patterns"></a>

## 3. သုံးလို့ရတဲ့ ပုံစံများ အနှစ်ချုပ်

Nginx က **တစ်ခုတည်းသော အခန်းကဏ္ဍ** မဟုတ်ဘူး။ အောက်က ပုံစံတွေကို **သီးသန့်** သုံးလို့ရသလို **ပေါင်း** သုံးလို့လည်း ရတယ်။

| ပုံစံ | Nginx လုပ်တာ | နောက်ကွယ် | ဥပမာ |
| --- | --- | --- | --- |
| Static web server | HTML/CSS/JS/ပုံ ကို disk ကနေ ပေးတယ် | App မလို | ကိုယ်ရေး site, docs |
| Reverse proxy | Request ကို အတွင်း app ဆီ ပို့တယ် | `127.0.0.1:3000` | Next.js, Django, FastAPI |
| Load balancer | Request ကို app များစွာထဲ ခွဲတယ် | `:3001 :3002 :3003` | scale out |
| TLS terminator | HTTPS ကို Nginx က ဖြေတယ် | နောက်က HTTP ပဲ | port 443 |
| HTTP redirector | `80` ကနေ `443` ပြန်ပို့တယ် | — | force HTTPS |
| Path / host router | URL သို့ domain အလိုက် ခွဲတယ် | apps များ | `api.` vs `app.` |
| Cache / gzip | static ကို cache, compress | — | မြန်အောင် |
| Stream proxy | TCP/UDP ကို proxy (HTTP မဟုတ်) | DB, game, mail | `stream { }` |
| Rate limiter | request များလွန်းရင် ချိန်တယ် | — | login brute-force |

ပုံစံ ပေါင်းစပ် ဥပမာ

```
Browser
   │  :443 HTTPS
   ▼
Nginx  ── static   → /var/www/site/_next/static
       ── proxy    → 127.0.0.1:3000   (app A)
       ── proxy    → 127.0.0.1:8000   (app B)
       ── balance  → 10.0.0.11:3000
                    → 10.0.0.12:3000
```

---

<a id="ports"></a>

## 4. Port 80 နဲ့ Port 443 — ကွာခြားချက်

Internet ပေါ်မှာ browser က URL မှာ port မရေးရင်

| URL | Protocol | Default port | Nginx `listen` |
| --- | --- | --- | --- |
| `http://example.com` | HTTP (စာဝှက်မထား) | **80** | `listen 80;` |
| `https://example.com` | HTTPS (TLS စာဝှက်) | **443** | `listen 443 ssl;` |

အရေးကြီးတဲ့ အချက်များ

- Port က **Nginx ရဲ့ အလုပ်အကိုင် မဟုတ်ဘူး**။ ဘယ် protocol / ဘယ် encryption လဲ ဆိုတာပဲ ခွဲတယ်။
- Static, reverse proxy, load balancer **သုံးခုလုံး** ကို port 80 မှာလည်း သုံးလို့ရတယ်၊ 443 မှာလည်း သုံးလို့ရတယ်။
- Public internet မှာ HTTP (80) ပဲ ဖွင့်ထားရင် password / cookie ကို ကြားက ဖတ်နိုင်တယ်။ **Login ရှိရင် 443 သုံးပါ။**
- Let's Encrypt က certificate ထုတ်တဲ့အခါ port **80** ကို အရင် သုံးပြီး ဒီ domain က ဒီ server ပိုင်တယ်လို့ သက်သေပြတယ် (HTTP-01 challenge)။

Local မှာ 80/443 က root လိုတယ် (`sudo`)။ root မလိုချင်ရင် `listen 8080;` / `listen 8443 ssl;` သုံးပါ။ Browser မှာ `http://localhost:8080` လို့ port ထည့်ရမယ်။

---

<a id="env-local"></a>

## 5. Local laptop / home lab

**ဘယ်အချိန်သုံးလဲ** — ကိုယ့်စက်မှာ Nginx config စမ်းချင်တယ်၊ domain / public IP မလိုသေးဘူး။

**ထူးခြားချက်**

- `server_name localhost;`
- Port `8080` သုံးရင် sudo မလိုနိုင် (distro ပေါ်မူတည်)
- HTTPS လိုရင် [mkcert](#mkcert) က အဆင်ပြေဆုံး (browser warning မရှိ)
- App က `localhost:3000` မှာ `npm run dev` / `npm start`

**အနည်းဆုံး static ဥပမာ** (`/etc/nginx/sites-available/local`)

```nginx
server {
    listen 8080;
    server_name localhost;

    root /home/YOU/projects/my-site;
    index index.html;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/local /etc/nginx/sites-enabled/local
sudo nginx -t && sudo systemctl reload nginx
# browser: http://localhost:8080
```

**Local reverse proxy** (Next.js dev)

```nginx
server {
    listen 8080;
    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Laptop firewall က `8080` ကို ပိတ်ထားရင် ကိုယ့် browser ကနေပဲ ဖွင့်လို့ရတယ်။ LAN က တခြားဖုန်းနဲ့ ဝင်ချင်ရင် machine IP (`http://192.168.1.10:8080`) နဲ့ [§6](#env-onprem) လို ဆက်တွေးပါ။

---

<a id="env-onprem"></a>

## 6. On-premise (ကိုယ်ပိုင် server / LAN)

**ဘယ်အချိန်သုံးလဲ** — ရုံး server, home NAS, rack — public domain မရှိ၊ သို့မဟုတ် အတွင်းကပဲ ဝင်မယ်။

**ထူးခြားချက်**

- DNS က internal (`notes.lan`, `/etc/hosts`, Windows DNS)
- Certificate က [self-signed](#self-signed) သို့ [internal CA](#internal-ca)
- Let's Encrypt မရဘူး (public DNS နဲ့ port 80 ကို ကမ္ဘာက မမြင်ရင်)
- Firewall က LAN subnet ပဲ ခွင့်ပြုနိုင်တယ်

**`/etc/hosts` ဥပမာ** (client စက်တွေမှာ)

```
192.168.10.20  notes.lan
```

**Nginx**

```nginx
server {
    listen 443 ssl;
    server_name notes.lan;

    ssl_certificate     /etc/nginx/ssl/notes.lan.crt;
    ssl_certificate_key /etc/nginx/ssl/notes.lan.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Certificate ထုတ်ပုံကို [§36](#self-signed) မှာ ကြည့်ပါ။

---

<a id="env-cloud"></a>

## 7. Cloud VPS (DigitalOcean, AWS EC2, Linode, …)

**ဘယ်အချိန်သုံးလဲ** — public IP + domain ရှိတယ်။ Ko Phyo production က ဒီပုံစံ။

**ထူးခြားချက်**

- DNS **A record** → VPS public IP
- Security group / VPS firewall မှာ **22, 80, 443** ပဲ ဖွင့်ပါ
- App port (`3000`) ကို **0.0.0.0 public** မဖွင့်ပါနဲ့
- Certificate က [Let's Encrypt](#letsencrypt)

DNS စစ်ရန်

```bash
dig +short notes.example.com
```

ပြန်လာတဲ့ IP = VPS IP ဖြစ်ရမယ်။

Cloud vendor firewall နဲ့ OS `ufw` **နှစ်ထပ်** ရှိတတ်တယ်။ Vendor မှာ 80/443 ဖွင့်ပြီး `ufw` မှာ ပိတ်ထားရင်လည်း မဝင်ဘူး။ နှစ်ခုလုံး စစ်ပါ။ [§44 Firewall](#firewall)

---

<a id="env-cloud-lb"></a>

## 8. Cloud load balancer ရဲ့ နောက်က Nginx

**ဘယ်အချိန်သုံးလဲ** — AWS ALB / GCP LB / Azure LB က HTTPS ကို ကိုင်ပြီး၊ နောက်က VM တွေမှာ Nginx ရှိတယ်။

ပုံ

```
Internet → Cloud LB (:443) → VM1 Nginx (:80) → app
                           → VM2 Nginx (:80) → app
```

**ထူးခြားချက်**

- TLS ကို cloud LB က ဖြေပြီးသား ဖြစ်တတ်တယ် → Nginx က `listen 80;` ပဲ လိုနိုင်တယ်
- `X-Forwarded-Proto` ကို LB က ထည့်ပေးတယ် — Nginx က မဖျက်ပါနဲ့
- Health check path (`/health`) ကို Nginx မှာ `200` ပြန်ပေးပါ

```nginx
server {
    listen 80;
    server_name _;

    location /health {
        access_log off;
        return 200 "ok\n";
        add_header Content-Type text/plain;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
    }
}
```

Nginx ကိုယ်တိုင် load balance လုပ်ချင်ရင် [§27](#lb) — cloud LB နဲ့ **ထပ်မမြှောက်** အောင် ဘယ်အလွှာက ခွဲမလဲ ဆုံးဖြတ်ပါ။

---

<a id="env-docker"></a>

## 9. Docker / Docker Compose

**ဘယ်အချိန်သုံးလဲ** — app နဲ့ Nginx ကို container ခွဲ run မယ်။

```yaml
# docker-compose.yml (အနှစ်)
services:
  web:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app

  app:
    build: .
    expose:
      - "3000"
```

Container ထဲ `proxy_pass` က `localhost` မဟုတ်ဘူး။ **service name** သုံးပါ။

```nginx
proxy_pass http://app:3000;
```

Host network မသုံးရင် `127.0.0.1:3000` က Nginx container ထဲက app ကို မတွေ့ဘူး။

---

<a id="env-cloudflare"></a>

## 10. Cloudflare DNS / proxy နောက်က Nginx

**ထူးခြားချက်**

- လိမ္မော်တိမ် (Proxied) = visitor က Cloudflare ကိုပဲ မြင်တယ်၊ origin IP ဝှက်တယ်
- Origin Nginx မှာ Cloudflare IP range ကလာတဲ့ request ပဲ ခွင့်ပြုနိုင်တယ်
- Let's Encrypt HTTP-01 က တခါတလေ fail တယ် → Certbot မလုပ်ခင် **DNS only** (မီးခိုးတိမ်) ပြောင်း၊ cert ရမှ proxy ပြန်ဖွင့်
- သို့မဟုတ် Cloudflare Origin Certificate ကို Nginx မှာ တင်ပြီး Full (strict) SSL mode သုံးပါ

`X-Forwarded-For` က Cloudflare IP ဖြစ်သွားနိုင်တယ်။ အစစ် visitor IP က `CF-Connecting-IP` ဖြစ်တတ်တယ်။

---

<a id="install"></a>

## 11. Nginx install နဲ့ folder တည်ဆောက်ပုံ

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable --now nginx
sudo systemctl status nginx
```

Install ပြီးရင် browser မှာ server IP ဖွင့်ရင် default welcome page ပေါ်မယ်။

Windows / macOS မှာ Homebrew (`brew install nginx`) သို့ official packages သုံးလို့ရတယ်။ Config path က `/opt/homebrew/etc/nginx/` လို ပြောင်းနိုင်တယ်။

---

<a id="config-layout"></a>

## 12. Config ဖိုင် ဘယ်နေရာမှာလဲ / test / reload

Debian/Ubuntu ပုံစံ

| Path | အဓိပ္ပာယ် |
| --- | --- |
| `/etc/nginx/nginx.conf` | အဓိက ဖိုင် (`http { }` အတွင်း `include sites-enabled/*`) |
| `/etc/nginx/sites-available/` | site config အစစ် (ဒီမှာ ရေး) |
| `/etc/nginx/sites-enabled/` | symlink — ဒီမှာ ရှိမှ အလုပ်လုပ်တယ် |
| `/var/www/` | static ဖိုင်တွေ ထားတဲ့ နေရာ (ဓလေ့) |
| `/var/log/nginx/` | access / error log |

Site တစ်ခု enable

```bash
sudo nano /etc/nginx/sites-available/mysite
sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/mysite
```

**Reload မလုပ်ခင် အမြဲ test**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

`nginx -t` fail ရင် reload **မလုပ်ပါနဲ့** — လက်ရှိ site မထိအောင်။

Default site ပိတ်ရန် (IP နဲ့ ဝင်ရင် ကြိုဆိုစာ မပေါ်စေချင်ရင်)

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

---

<a id="port-80"></a>

## 13. Port 80 ဆိုတာဘာလဲ

Port 80 = **HTTP**။ စာဝှက်မထားဘူး။

သုံးသင့်တဲ့ အချိန်

- LAN ထဲ စမ်းကြည့်တာ
- Let's Encrypt အတွက် challenge
- Cloud LB က TLS ဖြေပြီးသား၊ နောက်က HTTP ပဲ လက်ခံတာ
- အများပြည်သူ site မှာတောင် 80 ကို **ဖွင့်ထားပြီး 443 ကို ပြန်ပို့** တာ (bookmark / စာရိုက်မှား ကယ်တင်)

မသုံးသင့်တဲ့ အချိန်

- Login, cookie, API token ကို internet ပေါ် HTTP ပဲ သွားစေတာ

Nginx မှာ

```nginx
listen 80;
listen [::]:80;   # IPv6
```

`listen 80 default_server;` = ဒီ `server` block က port 80 ရဲ့ default (ဘယ် `server_name` မှ မတူရင် ဒီဟာ လက်ခံ)။

---

<a id="port-80-static"></a>

## 14. Port 80 မှာ static site ဖွင့်ခြင်း

```nginx
server {
    listen 80;
    server_name docs.example.com;

    root /var/www/docs;
    index index.html;
}
```

အသေးစိတ်ကို [§17](#static) မှာ ဆက်ပါ။

---

<a id="port-80-proxy"></a>

## 15. Port 80 မှာ reverse proxy

```nginx
server {
    listen 80;
    server_name notes.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Production public site ဆိုရင် ဒါကို ယာယီပဲ ထားပြီး [§16](#port-80-redirect) + [§39](#letsencrypt) ဆက်လုပ်ပါ။

---

<a id="port-80-redirect"></a>

## 16. Port 80 → 443 redirect

HTTPS အသင့်ဖြစ်ပြီးရင် HTTP ဝင်လာသမျှ HTTPS ပြောင်းပါ။

```nginx
server {
    listen 80;
    server_name notes.example.com;
    return 301 https://$host$request_uri;
}
```

Certbot `--nginx` က ဒီ redirect ကို အလိုအလျောက် ထည့်ပေးတတ်တယ်။ [§39](#letsencrypt)

`301` = permanent။ စမ်းနေစဉ် `302` သုံးလို့ရတယ်။

---

<a id="static"></a>

## 17. Nginx ကို static web server အနေနဲ့ သုံးခြင်း

**ဘာလဲ** — PHP / Node မလိုဘဲ HTML, CSS, JS, ပုံ, PDF, `index.html` ကို disk ကနေ တိုက်ရိုက် ပေးတယ်။

```
Browser → Nginx:80/443 → /var/www/mysite/index.html
```

**ဘယ်အချိန်သုံးလဲ**

- Landing page, documentation, ဓာတ်ပုံ gallery
- `next export` / SPA `dist/` folder (client-side router ဆို fallback လိုနိုင်တယ်)
- Reverse proxy ရဲ့ `/_next/static/` ကို Nginx က cache ပေးချင်တာ

App logic (login, database) မရှိရင် static က ပိုရိုး၊ ပိုမြန်တယ်။

---

<a id="static-html"></a>

## 18. HTML / CSS / JS folder တင်ခြင်း

ဖိုင်တွေ ချထားပါ။

```bash
sudo mkdir -p /var/www/mysite
sudo rsync -a ./dist/ /var/www/mysite/
sudo chown -R www-data:www-data /var/www/mysite
```

Config

```nginx
server {
    listen 80;
    server_name site.example.com;

    root /var/www/mysite;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

**SPA** (React/Vue router — refresh လုပ်ရင် path ရှိရမယ်) ဆိုရင်

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

`=404` မဟုတ်ဘဲ `/index.html` ကို ပြန်ပေးတယ်။

---

<a id="static-index"></a>

## 19. Directory listing, index, 404 page

```nginx
server {
    listen 80;
    server_name files.example.com;
    root /var/www/files;

    autoindex on;           # folder ဖွင့်ရင် ဖိုင်စာရင်း ပေါ်မယ်
    autoindex_exact_size off;
    autoindex_localtime on;

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

`autoindex off;` (default) က folder ကို list မပြဘူး — ပိုလုံခြုံတယ်။

---

<a id="static-cache"></a>

## 20. Static file cache နဲ့ gzip

`http { }` (`nginx.conf`) သို့ `server` ထဲ

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript image/svg+xml;
gzip_min_length 1024;

location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

Hashed filename (`app.a1b2c3.js`) ရှိရင် `immutable` သုံးလို့ရတယ်။ နာမည်မပြောင်းဘဲ ဖိုင်အကြောင်းအရာ ပြောင်းတဲ့ CSS ဆိုရင် `expires` ကြာလွန်းရင် user က အဟောင်း မြင်နေမယ်။

---

<a id="proxy"></a>

## 21. Reverse proxy ဆိုတာဘာလဲ

Browser က Nginx ကိုပဲ မြင်တယ်။ Nginx က request ကို **အတွင်းက app** ဆီ ပို့ပြီး response ပြန်ပေးတယ်။

```
Internet
   │  :80 / :443
   ▼
┌─────────┐
│  Nginx  │  reverse proxy
└────┬────┘
     │  http://127.0.0.1:3000
     ▼
┌─────────┐
│  App    │  Next.js, Node, Python, Go, …
└─────────┘
```

ဘာကြောင့် သုံးသလဲ

- App port ကို internet ပေါ် မဖွင့်ရဘူး
- HTTPS ကို Nginx က ကိုင်တယ်
- Domain / path များစွာ ခွဲလို့ရတယ်
- Static နဲ့ dynamic ကို ရောသုံးလို့ရတယ်

**Forward proxy** (office က internet ထွက်တဲ့ proxy) နဲ့ မတူဘူး။ Nginx က များသောအားဖြင့် **reverse** proxy။

---

<a id="proxy-single"></a>

## 22. တစ်ခုတည်းသော app ကို proxy (Next.js / Node)

App ကို localhost မှာပဲ နားခိုင်းပါ။

```bash
npx next start -H 127.0.0.1 -p 3000
```

Nginx

```nginx
upstream kophyo_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name notes.example.com;
    client_max_body_size 20m;

    location / {
        proxy_pass http://kophyo_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### Header တစ်ခုချင်း ဘာကြောင့်လဲ

| Header / ညွှန်ကြားချက် | မထည့်ရင် ဖြစ်နိုင်တာ |
| --- | --- |
| `Host $host` | App က `localhost:3000` လို့ မြင်ပြီး redirect / cookie မှားတယ် |
| `X-Forwarded-Proto` | HTTPS ဖြစ်ကြောင်း မသိ → cookie `Secure` / mixed content |
| `X-Real-IP` / `X-Forwarded-For` | Log မှာ Nginx IP ပဲ ပေါ်တယ် |
| `Upgrade` / `Connection` | WebSocket ဖြတ်တယ် |
| `client_max_body_size` | Upload မှာ `413` |

Production systemd ဥပမာက [§41](#kophyo) မှာ ရှိတယ်။

---

<a id="proxy-paths"></a>

## 23. Path အလိုက် app များစွာ ခွဲခြင်း (`/api`, `/app`)

```nginx
server {
    listen 80;
    server_name example.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;   # trailing slash = /api ဖြုတ်ပြီး ပို့
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`proxy_pass` ရဲ့ trailing slash က URI ပြောင်းပုံကို ပြောင်းတယ်။ မှားရင် app က `/api/users` ကို `/api/api/users` လို့ မြင်တတ်တယ်။ စမ်းရန် `curl -I` နဲ့ path ကို ကြည့်ပါ။

---

<a id="proxy-vhost"></a>

## 24. Domain အလိုက် app များစွာ ခွဲခြင်း (virtual host)

`server_name` မတူတဲ့ `server { }` နှစ်ခု။

```nginx
server {
    listen 80;
    server_name notes.example.com;
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name api.example.com;
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

DNS မှာ `notes` နဲ့ `api` နှစ်ခုလုံး A record ကို တူညီတဲ့ server IP ပေးပါ။ HTTPS ဆို domain တစ်ခုချင်း cert (သို့ SAN / wildcard) လိုတယ်။

---

<a id="proxy-websocket"></a>

## 25. WebSocket နဲ့ long request

```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
proxy_read_timeout 3600s;   # socket ကြာကြာ ဖွင့်ထားရင်
```

SSE / ကြီးတဲ့ download ဆိုရင်

```nginx
proxy_buffering off;
```

Next.js **dev** HMR က WebSocket သုံးတယ်။ Production `next start` မှာ HMR မလိုပေမယ့် header ထည့်ထားလို့ မထိခိုက်ဘူး။

---

<a id="proxy-upload"></a>

## 26. Upload size နဲ့ timeout

```nginx
client_max_body_size 20m;
proxy_connect_timeout 10s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

Default `client_max_body_size` က `1m`။ Markdown / ပုံ upload ကြီးရင် `413 Request Entity Too Large`။

---

<a id="lb"></a>

## 27. Nginx ကို load balancer အနေနဲ့ သုံးခြင်း

**ဘာလဲ** — တူညီတဲ့ app ကို server (သို့ process) များစွာ run ပြီး Nginx က request တွေကို ခွဲပေးတယ်။

```
                ┌→ 10.0.0.11:3000
Browser → Nginx ├→ 10.0.0.12:3000
                └→ 10.0.0.13:3000
```

Reverse proxy က **တစ်ခု** ဆီ ပို့တယ်။ Load balancer က **များစွာ** ထဲက ရွေးတယ်။ Nginx မှာ နှစ်ခုလုံး `proxy_pass` + `upstream { }` ပဲ။ ကွာတာက `upstream` ထဲ server စာရင်း။

Open source Nginx မှာ active HTTP health check (အဆက်မပြတ် probe) က **NGINX Plus** commercial မှာ ပိုပြည့်တယ်။ အခမဲ့ ဗားရှင်းမှာ [passive `max_fails`](#lb-health) သုံးတယ်။

Session ရှိတဲ့ app (in-memory session) ဆို [IP hash](#lb-ip-hash) သို့ app က shared session (Redis) သုံးပါ။

---

<a id="lb-round-robin"></a>

## 28. Round robin

Default။ Request 1 → A, 2 → B, 3 → C, 4 → A, …

```nginx
upstream apps {
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
    server 10.0.0.13:3000;
}

server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://apps;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
    }
}
```

`keepalive` သုံးရင် `proxy_http_version 1.1` နဲ့ `Connection ""` ထည့်ပါ။

---

<a id="lb-least-conn"></a>

## 29. Least connections

ချိတ်ဆက်မှု နည်းနေတဲ့ server ကို ရွေးတယ်။ Request ကြာချိန် မညီရင် round robin ထက် မျှတယ်။

```nginx
upstream apps {
    least_conn;
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
}
```

---

<a id="lb-ip-hash"></a>

## 30. IP hash (sticky-ish)

တူညီတဲ့ client IP ကို တူညီတဲ့ backend ကို ပို့တယ်။ Browser session က တစ်လုံးမှာပဲ နေရင် အဆင်ပြေတယ်။

```nginx
upstream apps {
    ip_hash;
    server 10.0.0.11:3000;
    server 10.0.0.12:3000;
}
```

Cloudflare / NAT ကြောင့် လူအများက IP တူနေရင် တစ်လုံးပေါ် ပုံနိုင်တယ်။ အဲ့ဒီအခါ app-level sticky cookie သို့ Redis session က ပိုမှန်တယ်။

---

<a id="lb-weight"></a>

## 31. Weight နဲ့ backup server

```nginx
upstream apps {
    server 10.0.0.11:3000 weight=3;   # ဒီလုံးကို ၃ ဆ ပိုပို့
    server 10.0.0.12:3000 weight=1;
    server 10.0.0.99:3000 backup;     # အပေါ်က အကုန်ကျမှ သုံး
}
```

RAM ကြီးတဲ့ machine ကို `weight` ပိုပေးပါ။

---

<a id="lb-health"></a>

## 32. Health check (`max_fails`)

```nginx
upstream apps {
    server 10.0.0.11:3000 max_fails=3 fail_timeout=30s;
    server 10.0.0.12:3000 max_fails=3 fail_timeout=30s;
}
```

`max_fails` ကြိမ် fail ရင် `fail_timeout` အတွင်း ဒီ server ကို ခဏ ရှောင်တယ်။ Active `/health` probe လိုချင်ရင် NGINX Plus, ပြင်ပ tool (`healthcheck` sidecar), သို့ cloud LB ကို သုံးပါ။

---

<a id="lb-stream"></a>

## 33. TCP / UDP stream load balancer

HTTP မဟုတ်တဲ့ protocol (PostgreSQL, Redis, game server) ကို `http { }` ထဲ မထည့်ရဘူး။ `nginx.conf` မှာ `stream { }`။

```nginx
stream {
    upstream db {
        server 10.0.0.21:5432;
        server 10.0.0.22:5432;
    }

    server {
        listen 5432;
        proxy_pass db;
    }
}
```

ဒီပုံစံက HTTP header / `server_name` မသုံးဘူး။ TLS ကို stream SSL နဲ့ သီးသန့် ပြင်ရတယ်။ အများစု web app က [§27 HTTP load balance](#lb) ပဲ လိုတယ်။

---

<a id="port-443"></a>

## 34. Port 443 ဆိုတာဘာလဲ

Port 443 = **HTTPS** (HTTP + TLS)။ Browser padlock၊ စာဝှက်၊ certificate စစ်ဆေးမှု။

Nginx မှာ အနည်းဆုံး

```nginx
listen 443 ssl;
listen [::]:443 ssl;
ssl_certificate     /path/to/fullchain.pem;
ssl_certificate_key /path/to/privkey.pem;
```

Certificate မရှိဘဲ `listen 443 ssl` ခေါ်ရင် Nginx start မဖြစ်ဘူး။

ဘယ် cert မျိုးသုံးမလဲ

| အခြေအနေ | ဘယ် section |
| --- | --- |
| Laptop စမ်း၊ warning လက်ခံမယ် | [§36 Self-signed](#self-signed) |
| Laptop၊ browser ယုံကြည်စေချင်တယ် | [§37 mkcert](#mkcert) |
| ရုံး LAN၊ ကိုယ်ပိုင် CA | [§38 Internal CA](#internal-ca) |
| Public domain | [§39 Let's Encrypt](#letsencrypt) |

HTTP/2

```nginx
listen 443 ssl;
http2 on;          # Nginx 1.25.1+
# အဟောင်း: listen 443 ssl http2;
```

---

<a id="https-basic"></a>

## 35. HTTPS config အခြေခံ (HTTP + HTTPS တွဲ)

```nginx
server {
    listen 80;
    server_name notes.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name notes.example.com;

    ssl_certificate     /etc/nginx/ssl/notes.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/notes.example.com.key;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

`$scheme` က HTTPS block ထဲမှာ `https` ဖြစ်သွားတယ်။ App / cookie အတွက် ဒါ အရေးကြီးတယ်။

Static site ဆို `location /` ကို `root` / `try_files` နဲ့ အစားထိုးပါ — [§17](#static)။

---

<a id="self-signed"></a>

## 36. Self-signed certificate ထုတ်ခြင်း (openssl)

**ဘာလဲ** — ကိုယ်တိုင် လက်မှတ်ထိုးတဲ့ cert။ Browser က “Not secure” / “Your connection is not private” ပြမယ်။ LAN / lab / ရုံးအတွင်း စမ်းဖို့ အဆင်ပြေတယ်။ Public internet + မသိတဲ့ visitor အတွက် မသုံးသင့်ဘူး (သူတို့က warning ကျော်ရတယ်၊ phishing နဲ့ ခွဲမရ)။

### 36.1 Private key နဲ့ cert ထုတ်ပါ

```bash
sudo mkdir -p /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/selfsigned.key \
  -out    /etc/nginx/ssl/selfsigned.crt
```

မေးလာတဲ့အခါ အရေးကြီးတာ

- **Common Name (CN)** = ဝင်မယ့် နာမည် (`localhost`, `192.168.10.20`, `notes.lan`)

`-nodes` = key ကို passphrase မထည့် (Nginx စတက်တိုင်း password မမေးစေချင်လို့)။

### 36.2 SAN ပါအောင် ထုတ်ပါ (Chrome က CN ပဲ မယုံတော့ဘူး)

IP / DNS များစွာ ပါချင်ရင်

```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/selfsigned.key \
  -out    /etc/nginx/ssl/selfsigned.crt \
  -subj "/CN=notes.lan" \
  -addext "subjectAltName=DNS:notes.lan,DNS:localhost,IP:127.0.0.1,IP:192.168.10.20"
```

OpenSSL ဟောင်းမှာ `-addext` မရှိရင် config ဖိုင်နဲ့ `openssl req -new -x509 -config san.cnf` သုံးပါ။

### 36.3 Nginx မှာ တင်ပါ

```nginx
server {
    listen 443 ssl;
    server_name notes.lan localhost;

    ssl_certificate     /etc/nginx/ssl/selfsigned.crt;
    ssl_certificate_key /etc/nginx/ssl/selfsigned.key;

    root /var/www/mysite;
    index index.html;
}
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 36.4 Browser မှာ

`https://notes.lan` ဖွင့်ပါ။ Warning ပေါ်မယ် → Advanced → Proceed (lab မှာပဲ)။

Client တွေ အမြဲ warning မလိုချင်ရင် `.crt` ကို OS trust store မှာ import လုပ်ရမယ်။ လူတိုင်းလုပ်ရတာ ခက်လို့ ရုံးမှာ [§38 Internal CA](#internal-ca) က ပိုသင့်တယ်။

### 36.5 အတွဲလိုက် ကြည့်ရန်

```bash
sudo openssl x509 -in /etc/nginx/ssl/selfsigned.crt -noout -subject -dates -ext subjectAltName
```

---

<a id="mkcert"></a>

## 37. Local အတွက် mkcert (browser ယုံကြည်အောင်)

Self-signed ရဲ့ warning ကို ရှောင်ချင်ရင် **mkcert** က local CA ကို OS/browser trust store ထဲ ထည့်ပေးတယ်။

```bash
# Ubuntu ဥပမာ
sudo apt install -y libnss3-tools
# mkcert: https://github.com/FiloSottile/mkcert/releases မှ install

mkcert -install
mkdir -p ~/certs && cd ~/certs
mkcert localhost 127.0.0.1 ::1 notes.lan
```

ထွက်လာတာ `localhost+3.pem` နဲ့ `localhost+3-key.pem` လို နာမည်။ Nginx

```nginx
ssl_certificate     /home/YOU/certs/localhost+3.pem;
ssl_certificate_key /home/YOU/certs/localhost+3-key.pem;
```

`www-data` က ဖတ်နိုင်အောင် permission စစ်ပါ။ **ဒီ CA က ကိုယ့်စက်မှာပဲ ယုံတယ်** — တခြား laptop မှာ `mkcert -install` ထပ်လုပ်ရမယ်။ Public production အတွက် မဟုတ်ဘူး။

---

<a id="internal-ca"></a>

## 38. On-premise internal CA

ရုံးက စက်တွေ အားလုံး internal CA ကို trust လုပ်ပြီး၊ server တစ်လုံးချင်းကို ဒီ CA က လက်မှတ်ထိုးတယ်။

အဆင့် အနှစ်

1. CA key + CA cert ထုတ် (လုံခြုံတဲ့ နေရာမှာ သိမ်း)
2. Staff PC / mobile မှာ CA cert ကို Trusted Root အဖြစ် install
3. Server CSR ထုတ် → CA က sign → Nginx မှာ server cert + key တင်
4. `ssl_certificate` က server cert (လိုရင် chain ပါ)

OpenSSL နဲ့ manual CA, သို့ `step-ca`, Smallstep, Microsoft AD CS သုံးလို့ရတယ်။ Let's Encrypt နဲ့ မတူတာက **public DNS မလို**၊ **ရုံးကပဲ ယုံ** ရတယ်။

Production internet site ကို internal CA နဲ့ မတင်ပါနဲ့ — visitor browser မှာ CA မရှိလို့ warning ပဲ ပေါ်မယ်။

---

<a id="letsencrypt"></a>

## 39. Let's Encrypt (Certbot) — public domain

**လိုအပ်ချက်** — public DNS A record ဒီ server ကို ညွှန်ပြီး၊ port 80 ဖွင့်ထားရမယ်။

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d notes.example.com
```

မေးလာရင် email၊ ToS၊ **Redirect HTTP→HTTPS = 2** ရွေးပါ။

Certbot က `ssl_certificate` ကို `/etc/letsencrypt/live/notes.example.com/fullchain.pem` လို path ထည့်ပေးတယ်။

သက်တမ်းတိုး စစ်ရန်

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

Fail များသော အကြောင်း

- DNS မရောက်သေး
- Port 80 ပိတ်ထား
- Cloudflare proxy ဖွင့်ထား (အရင် DNS only)
- `server_name` နဲ့ `-d` domain မတူ

Wildcard (`*.example.com`) က DNS-01 challenge လိုတယ် (`certbot` + DNS plugin)။ HTTP-01 နဲ့ မရဘူး။

---

<a id="tls-hardening"></a>

## 40. HTTP/2 နဲ့ TLS hardening

Certificate အလုပ်ဖြစ်ပြီးမှ ထည့်ပါ။

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;

add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options nosniff always;
add_header X-Frame-Options SAMEORIGIN always;
add_header Referrer-Policy strict-origin-when-cross-origin always;
```

HSTS (`max-age` ကြီး) ကို HTTPS အမြဲ မှန်မှန် ဝင်နိုင်မှ ထည့်ပါ။ တစ်ခါဖွင့်ပြီး HTTP ပြန်သုံးရင် browser က ခဏ ပိတ်ထားနိုင်တယ်။

---

<a id="kophyo"></a>

## 41. Ko Phyo — production reverse proxy + HTTPS

Cloud VPS + domain + Next.js။ အဆင့်လိုက်။

### 41.1 App production run (systemd)

`/etc/systemd/system/kophyo.service`

```ini
[Unit]
Description=Ko Phyo Next.js
After=network.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/var/www/kophyo-personal
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start -- -H 127.0.0.1 -p 3000
Restart=on-failure
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now kophyo
curl -I http://127.0.0.1:3000
```

### 41.2 Nginx reverse proxy (HTTP အရင်)

`/etc/nginx/sites-available/kophyo` — [§22](#proxy-single) က config။ ပြီးရင်

```bash
sudo ln -s /etc/nginx/sites-available/kophyo /etc/nginx/sites-enabled/kophyo
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

### 41.3 Firewall နဲ့ Certbot

[§44](#firewall) နဲ့ [§39](#letsencrypt)။

### 41.4 Supabase URL

**Authentication → URL Configuration**

- Site URL: `https://notes.example.com`
- Redirect URLs: `https://notes.example.com/**`

မပြင်ရင် login ပြီး `localhost:3000` ပြန်ပို့နိုင်တယ်။

`.env.production` ဥပမာ

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

---

<a id="recipe-onprem-static"></a>

## 42. On-premise static + self-signed (ချက်ချင်း ကူးယူရန်)

```bash
sudo mkdir -p /var/www/intranet /etc/nginx/ssl
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/intranet.key \
  -out /etc/nginx/ssl/intranet.crt \
  -subj "/CN=intranet.lan" \
  -addext "subjectAltName=DNS:intranet.lan,IP:192.168.10.20"
```

```nginx
server {
    listen 80;
    server_name intranet.lan;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name intranet.lan;
    ssl_certificate     /etc/nginx/ssl/intranet.crt;
    ssl_certificate_key /etc/nginx/ssl/intranet.key;
    root /var/www/intranet;
    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
}
```

---

<a id="recipe-cloud-lb"></a>

## 43. Cloud — 3 app instance load balance (ချက်ချင်း ကူးယူရန်)

App ၃ လုံး (`3001` `3002` `3003` သို့ သီးခြား VM)။ Nginx တစ်လုံးက ခွဲပေးတယ်။ HTTPS က Certbot။

```nginx
upstream kophyo_pool {
    least_conn;
    server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name notes.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name notes.example.com;
    client_max_body_size 20m;

    # certbot က ထည့်မယ့် စာကြောင်းတွေ ဒီနေရာ / သို့ include

    location / {
        proxy_pass http://kophyo_pool;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

SSL စာကြောင်းတွေကို Certbot က ဖြည့်ပေးအောင် အရင် HTTP-only `upstream` + `listen 80` နဲ့ စပြီး `certbot --nginx` ခေါ်လို့ရတယ်။

---

<a id="firewall"></a>

## 44. Firewall (UFW) — 80 / 443 / မဖွင့်ရမယ့် port

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'    # 80 + 443
sudo ufw enable
sudo ufw status
```

| Port | ဖွင့်မလား |
| --- | --- |
| 22 | SSH အတွက် ဖွင့် (lockout မဖြစ်အောင် အရင်) |
| 80 | HTTP + Let's Encrypt အတွက် ဖွင့် |
| 443 | HTTPS အတွက် ဖွင့် |
| 3000, 8000, … | **မဖွင့်ပါနဲ့** — Nginx က localhost ကနေပဲ ခေါ် |

```bash
sudo ss -tlnp | grep -E ':80|:443|:3000'
```

- `:80` / `:443` → `nginx`
- `:3000` → `127.0.0.1` ပဲ ဖြစ်ရမယ်

Cloud security group မှာလည်း ဒီစည်းမျဉ်း ထပ်တူ စစ်ပါ။

---

<a id="daily-commands"></a>

## 45. နေ့စဉ် command များ

| လုပ်ချင်တာ | Command |
| --- | --- |
| Config စစ် | `sudo nginx -t` |
| Reload (connection မဖြတ်) | `sudo systemctl reload nginx` |
| Restart | `sudo systemctl restart nginx` |
| Error log | `sudo tail -f /var/log/nginx/error.log` |
| ဘယ် `server_name` တွေ လက်ခံလဲ | `sudo nginx -T \| grep server_name` |
| Cert သက်တမ်း | `sudo certbot certificates` |
| Ko Phyo app log | `sudo journalctl -u kophyo -f` |
| App restart | `sudo systemctl restart kophyo` |

Code အသစ် (Ko Phyo)

```bash
cd /var/www/kophyo-personal
git pull && npm ci && npm run build
sudo systemctl restart kophyo
```

---

<a id="troubleshooting"></a>

## 46. Troubleshooting

### `welcome to nginx` ပဲ ပေါ်တယ်

- `sites-enabled` symlink မရှိ
- `server_name` မတူ
- `default` site က အရင် match

```bash
ls -l /etc/nginx/sites-enabled/
sudo nginx -T | grep -A8 server_name
```

### `502 Bad Gateway`

Nginx က upstream မရောက်ဘူး။

```bash
sudo systemctl status kophyo
curl -I http://127.0.0.1:3000
sudo tail -50 /var/log/nginx/error.log
```

Port မှား၊ app crash၊ Docker မှာ `localhost` သုံးမိတာ များတယ်။

### `413 Request Entity Too Large`

`client_max_body_size` တိုးပါ။ [§26](#proxy-upload)

### Login ဝင်ပြီး ချက်ချင်း ထွက် / cookie မကပ်

- `Host` နဲ့ `X-Forwarded-Proto` မရှိ
- HTTP နဲ့ ဝင်နေ (Secure cookie)
- Supabase Site URL က production domain မဟုတ်

### Browser `NET::ERR_CERT_AUTHORITY_INVALID`

Self-signed / အတွင်း CA ကို ဒီစက်က မယုံသေးတာ။ Lab ဆို Proceed။ သို့ [mkcert](#mkcert) / CA import။

### Certbot fail

DNS, port 80, Cloudflare orange cloud။ [§39](#letsencrypt)

### `Permission denied` (RHEL SELinux)

```bash
sudo setsebool -P httpd_can_network_connect 1
sudo setsebool -P httpd_read_user_content 1
```

### Load balancer က တစ်လုံးပဲ ပို့နေတယ်

`ip_hash` + NAT/Cloudflare။ `least_conn` / round robin ပြောင်းကြည့်။ Backup flag မှား မထည့်မိစေနဲ့။

---

## အကျဉ်းချုပ်

- Nginx ပုံစံ အဓိက ၃ ခု — **static server**, **reverse proxy**, **load balancer** — port 80 မှာလည်း 443 မှာလည်း သုံးလို့ရတယ်။
- **80** = HTTP၊ **443** = HTTPS + certificate။
- **Local** = localhost / mkcert။ **On-premise** = LAN + self-signed သို့ internal CA။ **Cloud** = public DNS + Let's Encrypt။
- Public login site ဆို TLS အစစ် (Let's Encrypt) သုံးပါ။ Self-signed က lab / LAN အတွက်။
- App port ကို internet ပေါ် မဖွင့်ပါနဲ့။ Nginx က `127.0.0.1` ကနေပဲ ခေါ်ပါ။
