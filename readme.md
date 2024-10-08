# NOBOT AI

## INTRODUCTION

Nobot AI is custom package for validate internet service isp

## How to use ?

create a package in the node modules "nobot-ai", and put all the coding for this project into it

### validate IP address

```javascript{
    import NobotAi from "nobot-ai"

    const antibot = new NobotAi();
    await antibot.setup();

    const isBlaklist = await antibot.verifyIpAddress(
      "172.233.142.124",
      (robot, human) => {
        return robot;
      }
    );
    console.log(isBlacklist)
```

### validate user agent

```javascript{
    import NobotAi from "nobot-ai"

    const antibot = new NobotAi();
    await antibot.setup();

    const isBlaklist = await antibot.verifyUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edge/129.0.0.0",
      (robot, human) => {
        return robot;
      }
    );
    console.log(isBlacklist)
```
